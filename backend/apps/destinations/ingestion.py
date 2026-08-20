import json
import csv
import io
import math
from decimal import Decimal
from difflib import SequenceMatcher
from django.utils.text import slugify
from django.db import transaction
from django.db.models import Q
from apps.destinations.models import (
    Destination, DestinationHistory, DestinationImage, 
    DestinationVideo, DestinationSource, DestinationAuditLog
)
from apps.states.models import State, District
from apps.cities.models import City
from apps.regions.models import Region
from apps.categories.models import Category, Activity, Tag
from apps.destinations.search_engine import calculate_haversine_distance

INDIA_GEO_BOUNDS = {
    'min_lat': 6.0,
    'max_lat': 37.5,
    'min_lng': 68.0,
    'max_lng': 97.5
}

class IndiaTourismDataPipeline:
    """
    Enterprise-grade Data Ingestion and Quality Pipeline for Dekho Bharat.
    """

    def __init__(self):
        self._refresh_caches()

    def _refresh_caches(self):
        self.states_cache = {s.name.lower(): s for s in State.objects.all()}
        self.states_cache.update({s.slug.lower(): s for s in State.objects.all()})
        self.regions_cache = {r.slug.lower(): r for r in Region.objects.all()}
        self.regions_cache.update({r.name.lower(): r for r in Region.objects.all()})
        self.categories_cache = {c.slug.lower(): c for c in Category.objects.all()}
        self.categories_cache.update({c.name.lower(): c for c in Category.objects.all()})
        self.activities_cache = {a.slug.lower(): a for a in Activity.objects.all()}
        self.activities_cache.update({a.name.lower(): a for a in Activity.objects.all()})

    def parse_input(self, raw_data, format_type='auto'):
        """
        Parses raw input (CSV string/stream, JSON string/list) into a list of normalized dicts.
        """
        if isinstance(raw_data, list):
            return raw_data

        if isinstance(raw_data, str):
            trimmed = raw_data.strip()
            if format_type == 'json' or (format_type == 'auto' and (trimmed.startswith('[') or trimmed.startswith('{'))):
                parsed = json.loads(trimmed)
                return parsed if isinstance(parsed, list) else [parsed]
            
            # Parse as CSV
            reader = csv.DictReader(io.StringIO(trimmed))
            return [row for row in reader]

        if hasattr(raw_data, 'read'):
            content = raw_data.read()
            if isinstance(content, bytes):
                content = content.decode('utf-8-sig', errors='replace')
            trimmed = content.strip()
            if format_type == 'json' or (format_type == 'auto' and (trimmed.startswith('[') or trimmed.startswith('{'))):
                parsed = json.loads(trimmed)
                return parsed if isinstance(parsed, list) else [parsed]
            reader = csv.DictReader(io.StringIO(content))
            return [row for row in reader]

        return []

    def validate_and_classify(self, records):
        """
        Validates records, flags suspicious coordinates, classifies into:
        - NEW
        - EXISTING_UPDATE
        - POSSIBLE_DUPLICATE
        - INVALID
        """
        self._refresh_caches()
        existing_destinations = list(Destination.objects.select_related('state', 'city').all())
        
        classified_rows = []
        errors = []
        
        counts = {
            'total': len(records),
            'new': 0,
            'updates': 0,
            'possible_duplicates': 0,
            'invalid': 0
        }

        for idx, row in enumerate(records, start=1):
            row_errors = []
            clean = {k.strip(): (v.strip() if isinstance(v, str) else v) for k, v in row.items() if k}

            name = clean.get('name', '')
            if not name:
                row_errors.append(f"Row {idx}: Name is required.")

            # 1. State Normalization
            state_raw = str(clean.get('state', '')).strip().lower()
            state_obj = self.states_cache.get(state_raw)
            if not state_obj and state_raw:
                for s_key, s_val in self.states_cache.items():
                    if state_raw in s_key or s_key in state_raw:
                        state_obj = s_val
                        break
            if not state_obj and not row_errors:
                row_errors.append(f"Row {idx}: State '{clean.get('state')}' not found in India master data.")

            # 2. Region Normalization
            region_raw = str(clean.get('region', '')).strip().lower()
            region_obj = self.regions_cache.get(region_raw)
            if not region_obj and state_obj and state_obj.region:
                region_obj = state_obj.region

            # 3. Deterministic Slug Generation
            slug = clean.get('slug')
            if not slug and name:
                slug = slugify(name)
            clean['slug'] = slug

            # 4. Geographic Coordinate Validation
            lat = clean.get('latitude')
            lng = clean.get('longitude')
            lat_f = None
            lng_f = None
            geo_warning = None

            if lat is not None and str(lat).strip():
                try:
                    lat_f = float(lat)
                    if not (-90 <= lat_f <= 90):
                        row_errors.append(f"Row {idx}: Latitude {lat_f} out of valid range [-90, 90].")
                except ValueError:
                    row_errors.append(f"Row {idx}: Invalid latitude format '{lat}'.")

            if lng is not None and str(lng).strip():
                try:
                    lng_f = float(lng)
                    if not (-180 <= lng_f <= 180):
                        row_errors.append(f"Row {idx}: Longitude {lng_f} out of valid range [-180, 180].")
                except ValueError:
                    row_errors.append(f"Row {idx}: Invalid longitude format '{lng}'.")

            if lat_f is not None and lng_f is not None:
                # India Bounding Box Check
                if not (INDIA_GEO_BOUNDS['min_lat'] <= lat_f <= INDIA_GEO_BOUNDS['max_lat'] and
                        INDIA_GEO_BOUNDS['min_lng'] <= lng_f <= INDIA_GEO_BOUNDS['max_lng']):
                    geo_warning = f"Coordinates ({lat_f}, {lng_f}) fall outside standard Indian territory bounds."

            clean['lat_f'] = lat_f
            clean['lng_f'] = lng_f
            clean['geo_warning'] = geo_warning
            clean['state_obj'] = state_obj
            clean['region_obj'] = region_obj

            if row_errors:
                clean['classification'] = 'INVALID'
                clean['errors'] = row_errors
                errors.extend(row_errors)
                counts['invalid'] += 1
                classified_rows.append(clean)
                continue

            # 5. Duplicate Detection Engine
            classification = 'NEW'
            matched_dest = None
            match_reason = ''

            # Check exact slug or name + state
            for ex in existing_destinations:
                if ex.slug == slug:
                    classification = 'EXISTING_UPDATE'
                    matched_dest = ex
                    match_reason = f"Exact slug match: '{slug}'"
                    break
                if state_obj and ex.state_id == state_obj.id and ex.name.lower() == name.lower():
                    classification = 'EXISTING_UPDATE'
                    matched_dest = ex
                    match_reason = f"Exact name & state match: '{name}' in {state_obj.name}"
                    break

            # If not exact match, perform fuzzy check
            if classification == 'NEW':
                for ex in existing_destinations:
                    # String similarity
                    sim = SequenceMatcher(None, ex.name.lower(), name.lower()).ratio()
                    if sim >= 0.82 and ex.state_id == (state_obj.id if state_obj else None):
                        classification = 'POSSIBLE_DUPLICATE'
                        matched_dest = ex
                        match_reason = f"High name similarity ({int(sim*100)}%) in same state with '{ex.name}'"
                        break
                    
                    # Proximity check (< 5km distance with similar categories)
                    if lat_f and lng_f and ex.latitude and ex.longitude:
                        dist = calculate_haversine_distance(lat_f, lng_f, float(ex.latitude), float(ex.longitude))
                        if dist <= 3.0:
                            classification = 'POSSIBLE_DUPLICATE'
                            matched_dest = ex
                            match_reason = f"Close coordinate proximity (~{dist} km) to '{ex.name}'"
                            break

            if classification == 'NEW':
                counts['new'] += 1
            elif classification == 'EXISTING_UPDATE':
                counts['updates'] += 1
            elif classification == 'POSSIBLE_DUPLICATE':
                counts['possible_duplicates'] += 1

            clean['classification'] = classification
            clean['matched_dest'] = matched_dest
            clean['match_reason'] = match_reason
            clean['errors'] = []
            classified_rows.append(clean)

        return {
            'counts': counts,
            'errors': errors,
            'rows': classified_rows
        }

    def execute_ingestion(self, classified_rows, auto_publish=False, user_name='Data Pipeline'):
        """
        Transaction-safe ingestion of classified records.
        """
        created = 0
        updated = 0
        skipped = 0

        with transaction.atomic():
            for row in classified_rows:
                if row.get('classification') in ['INVALID', 'POSSIBLE_DUPLICATE']:
                    skipped += 1
                    continue

                state_obj = row['state_obj']
                region_obj = row['region_obj']
                slug = row['slug']
                name = row['name']

                # District lookup/creation
                dist_name = row.get('district', '')
                dist_obj = None
                if dist_name and state_obj:
                    dist_obj, _ = District.objects.get_or_create(
                        name=dist_name,
                        state=state_obj,
                        defaults={"published": True}
                    )

                # City lookup/creation
                city_name = row.get('city', '')
                city_obj = None
                if city_name and state_obj:
                    city_obj, _ = City.objects.get_or_create(
                        name=city_name,
                        state=state_obj,
                        defaults={
                            "district": dist_obj,
                            "latitude": Decimal(str(row['lat_f'])) if row['lat_f'] is not None else None,
                            "longitude": Decimal(str(row['lng_f'])) if row['lng_f'] is not None else None,
                            "published": True
                        }
                    )

                # Content status determination
                raw_status = str(row.get('content_status', row.get('status', 'draft'))).lower()
                if auto_publish or raw_status == 'published' or str(row.get('published', '')).lower() in ['true', '1', 'yes']:
                    status = 'published'
                elif raw_status in ['draft', 'review', 'unpublished', 'archived']:
                    status = raw_status
                else:
                    status = 'draft'

                is_featured = str(row.get('featured', '')).lower() in ['true', '1', 'yes']
                is_verified = 'verified' if str(row.get('verified', '')).lower() in ['true', '1', 'yes', 'verified'] else 'unverified'

                defaults = {
                    "name": name,
                    "state": state_obj,
                    "district": dist_name,
                    "district_obj": dist_obj,
                    "city": city_obj,
                    "region_obj": region_obj,
                    "region": region_obj.slug if region_obj else (state_obj.region.slug if state_obj and state_obj.region else 'south-india'),
                    "short_description": row.get('short_description', ''),
                    "description": row.get('full_description', '') or row.get('description', '') or row.get('short_description', ''),
                    "latitude": Decimal(str(row['lat_f'])) if row['lat_f'] is not None else None,
                    "longitude": Decimal(str(row['lng_f'])) if row['lng_f'] is not None else None,
                    "best_time_to_visit": row.get('best_time_to_visit', 'October to March'),
                    "ideal_duration": row.get('recommended_duration', row.get('ideal_duration', '2-3 Days')),
                    "recommended_duration": row.get('recommended_duration', row.get('ideal_duration', '2-3 Days')),
                    "budget_level": row.get('estimated_budget', row.get('budget_level', 'medium')),
                    "nearest_airport": row.get('nearest_airport', ''),
                    "nearest_railway": row.get('nearest_railway_station', row.get('nearest_railway', '')),
                    "nearest_bus_station": row.get('nearest_bus_station', ''),
                    "featured": is_featured,
                    "content_status": status,
                    "published": (status == 'published'),
                    "verification_status": is_verified,
                    "source_name": row.get('source_name', 'Incredible India / Official Tourism'),
                    "source_type": row.get('source_type', 'tourism_board'),
                    "main_image": row.get('main_image', '')
                }

                # Fallback to ensure budget_level choices validity
                if defaults['budget_level'] not in ['low', 'medium', 'high']:
                    defaults['budget_level'] = 'medium'

                dest, was_created = Destination.objects.update_or_create(
                    slug=slug,
                    defaults=defaults
                )

                if was_created:
                    created += 1
                    action_type = 'CREATED'
                    summary = f"Created new destination via pipeline ({status.upper()})"
                else:
                    updated += 1
                    action_type = 'UPDATED'
                    summary = f"Updated existing destination details ({status.upper()})"

                # Categories
                cat_data = row.get('categories', [])
                if isinstance(cat_data, str):
                    cat_data = [c.strip().lower() for c in cat_data.split(',') if c.strip()]
                for c_item in cat_data:
                    c_slug = slugify(c_item)
                    c_obj = self.categories_cache.get(c_slug)
                    if not c_obj:
                        c_obj, _ = Category.objects.get_or_create(
                            slug=c_slug,
                            defaults={"name": str(c_item).title(), "published": True}
                        )
                        self.categories_cache[c_slug] = c_obj
                    dest.categories.add(c_obj)

                # Activities
                act_data = row.get('activities', [])
                if isinstance(act_data, str):
                    act_data = [a.strip().lower() for a in act_data.split(',') if a.strip()]
                for a_item in act_data:
                    a_slug = slugify(a_item)
                    a_obj = self.activities_cache.get(a_slug)
                    if not a_obj:
                        a_obj, _ = Activity.objects.get_or_create(
                            slug=a_slug,
                            defaults={"name": str(a_item).title(), "published": True}
                        )
                        self.activities_cache[a_slug] = a_obj
                    dest.activities.add(a_obj)

                # History inline
                hist = row.get('history')
                hist_sig = row.get('historical_significance', '')
                cult_sig = row.get('cultural_significance', '')
                rel_sig = row.get('religious_significance', '')
                arch = row.get('architecture', '')

                if hist or hist_sig or cult_sig or rel_sig or arch:
                    short_h = hist if isinstance(hist, str) else (hist.get('short_history', '') if isinstance(hist, dict) else '')
                    detail_h = hist if isinstance(hist, str) else (hist.get('detailed_history', '') if isinstance(hist, dict) else (hist_sig or ''))
                    
                    DestinationHistory.objects.update_or_create(
                        destination=dest,
                        defaults={
                            "short_history": short_h[:500] if short_h else (detail_h[:500] if detail_h else "Verified historical legacy."),
                            "detailed_history": detail_h or short_h or "Detailed historical overview.",
                            "cultural_significance": cult_sig or (hist.get('cultural_significance', '') if isinstance(hist, dict) else ''),
                            "religious_significance": rel_sig or (hist.get('religious_significance', '') if isinstance(hist, dict) else ''),
                            "architecture": arch or (hist.get('architecture', '') if isinstance(hist, dict) else ''),
                            "verification_status": is_verified
                        }
                    )

                # Images Ingestion
                images_data = row.get('images', [])
                if isinstance(images_data, list):
                    for img_idx, img_item in enumerate(images_data):
                        img_url = img_item if isinstance(img_item, str) else img_item.get('url', img_item.get('image_url'))
                        if img_url:
                            caption = img_item.get('caption', '') if isinstance(img_item, dict) else ''
                            DestinationImage.objects.get_or_create(
                                destination=dest,
                                image_url=img_url,
                                defaults={
                                    "caption": caption,
                                    "is_primary": (img_idx == 0 and not dest.main_image),
                                    "display_order": img_idx,
                                    "source": row.get('source_name', 'Licensed / Official')
                                }
                            )

                # Video Ingestion
                video_data = row.get('video') or row.get('videos')
                if video_data:
                    v_list = [video_data] if isinstance(video_data, dict) else (video_data if isinstance(video_data, list) else [])
                    for v_idx, v_item in enumerate(v_list):
                        v_url = v_item.get('url') or v_item.get('video_url')
                        if v_url:
                            DestinationVideo.objects.update_or_create(
                                destination=dest,
                                video_url=v_url,
                                defaults={
                                    "title": v_item.get('title', f"Experience {dest.name}"),
                                    "video_type": v_item.get('type', 'overview'),
                                    "duration": v_item.get('duration', '08:00'),
                                    "is_primary": (v_idx == 0),
                                    "published": True
                                }
                            )

                # Audit Log Entry
                DestinationAuditLog.objects.create(
                    destination=dest,
                    action=action_type,
                    changed_by=user_name,
                    change_summary=summary,
                    new_state={"name": dest.name, "status": dest.content_status, "score": dest.data_completeness_score}
                )

                dest.save()

        return {
            'success': True,
            'created': created,
            'updated': updated,
            'skipped': skipped,
            'total_processed': created + updated
        }
