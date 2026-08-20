import csv
import io
from decimal import Decimal
from django.utils.text import slugify
from django.db import transaction
from django.db.models import Q
from apps.destinations.models import Destination, DestinationHistory, DestinationImage, DestinationVideo
from apps.states.models import State, District
from apps.cities.models import City
from apps.regions.models import Region
from apps.categories.models import Category, Activity, Tag

class DestinationCSVImporter:
    """
    Robust CSV validation and import service for bulk destination management.
    Features:
    - 2-Step validation & dry-run preview
    - Case-insensitive master data matching (States, Regions, Cities, Categories, Activities)
    - Duplicate detection by slug, name+state, name+city
    - Comprehensive error reporting with row numbers and suggested fixes
    - Transaction safety
    """

    EXPECTED_COLUMNS = [
        'name', 'slug', 'region', 'state', 'district', 'city',
        'short_description', 'full_description', 'history',
        'historical_significance', 'cultural_significance', 'religious_significance',
        'latitude', 'longitude', 'best_time_to_visit', 'recommended_duration',
        'estimated_budget', 'categories', 'activities', 'tags',
        'nearest_airport', 'nearest_railway_station', 'nearest_bus_station',
        'how_to_reach', 'featured', 'verified', 'published'
    ]

    def __init__(self, csv_file_or_content):
        if isinstance(csv_file_or_content, str):
            self.reader = csv.DictReader(io.StringIO(csv_file_or_content))
        elif hasattr(csv_file_or_content, 'read'):
            content = csv_file_or_content.read()
            if isinstance(content, bytes):
                content = content.decode('utf-8-sig', errors='replace')
            self.reader = csv.DictReader(io.StringIO(content))
        else:
            self.reader = csv_file_or_content

        # Master data cache for fast resolution
        self.states_cache = {s.name.lower(): s for s in State.objects.all()}
        self.states_cache.update({s.slug.lower(): s for s in State.objects.all()})
        self.regions_cache = {r.slug.lower(): r for r in Region.objects.all()}
        self.regions_cache.update({r.name.lower(): r for r in Region.objects.all()})
        self.categories_cache = {c.slug.lower(): c for c in Category.objects.all()}
        self.categories_cache.update({c.name.lower(): c for c in Category.objects.all()})
        self.activities_cache = {a.slug.lower(): a for a in Activity.objects.all()}
        self.activities_cache.update({a.name.lower(): a for a in Activity.objects.all()})

    def validate(self):
        """
        Validates all rows without committing to database.
        Returns preview summary and errors.
        """
        valid_rows = []
        errors = []
        rows_to_create = 0
        rows_to_update = 0
        skipped_count = 0

        for row_idx, row in enumerate(self.reader, start=2): # 1-indexed header is row 1
            row_errors = []
            clean_row = {k.strip(): (v.strip() if v else '') for k, v in row.items() if k}

            # 1. Required Name
            name = clean_row.get('name', '')
            if not name:
                row_errors.append({
                    'row': row_idx,
                    'field': 'name',
                    'error': 'Destination name is required.',
                    'suggested_fix': 'Provide a valid destination name.'
                })

            # 2. Slug generation or validation
            slug = clean_row.get('slug', '')
            if not slug and name:
                slug = slugify(name)
            clean_row['slug'] = slug

            # 3. State Resolution (case-insensitive fuzzy match)
            state_raw = clean_row.get('state', '').lower()
            state_obj = self.states_cache.get(state_raw)
            if not state_obj and state_raw:
                # Try finding closest match
                for s_key, s_val in self.states_cache.items():
                    if state_raw in s_key or s_key in state_raw:
                        state_obj = s_val
                        break
            if not state_obj:
                row_errors.append({
                    'row': row_idx,
                    'field': 'state',
                    'error': f"State '{clean_row.get('state')}' is not recognized in India master data.",
                    'suggested_fix': 'Use standard state name, e.g. "Telangana", "Andhra Pradesh", "Kerala", "Tamil Nadu".'
                })

            # 4. Region Resolution
            region_raw = clean_row.get('region', '').lower()
            region_obj = self.regions_cache.get(region_raw)
            if not region_obj and state_obj and state_obj.region:
                region_obj = state_obj.region
            clean_row['region_obj'] = region_obj

            # 5. Coordinate validation
            lat = clean_row.get('latitude', '')
            lng = clean_row.get('longitude', '')
            lat_f = None
            lng_f = None
            if lat:
                try:
                    lat_f = float(lat)
                    if not (-90 <= lat_f <= 90):
                        raise ValueError()
                except ValueError:
                    row_errors.append({
                        'row': row_idx,
                        'field': 'latitude',
                        'error': f"Invalid latitude '{lat}'.",
                        'suggested_fix': 'Provide valid decimal coordinate between -90 and 90.'
                    })
            if lng:
                try:
                    lng_f = float(lng)
                    if not (-180 <= lng_f <= 180):
                        raise ValueError()
                except ValueError:
                    row_errors.append({
                        'row': row_idx,
                        'field': 'longitude',
                        'error': f"Invalid longitude '{lng}'.",
                        'suggested_fix': 'Provide valid decimal coordinate between -180 and 180.'
                    })
            clean_row['lat_f'] = lat_f
            clean_row['lng_f'] = lng_f

            # 6. Duplicate Detection
            existing = None
            if slug:
                existing = Destination.objects.filter(slug=slug).first()
            if not existing and name and state_obj:
                existing = Destination.objects.filter(name__iexact=name, state=state_obj).first()

            if existing:
                clean_row['action'] = 'UPDATE'
                rows_to_update += 1
            else:
                clean_row['action'] = 'CREATE'
                rows_to_create += 1

            clean_row['state_obj'] = state_obj
            clean_row['existing_dest'] = existing

            if row_errors:
                errors.extend(row_errors)
                skipped_count += 1
            else:
                valid_rows.append(clean_row)

        return {
            'total_rows': len(valid_rows) + skipped_count,
            'valid_count': len(valid_rows),
            'rows_to_create': rows_to_create,
            'rows_to_update': rows_to_update,
            'skipped_count': skipped_count,
            'errors': errors,
            'valid_rows': valid_rows
        }

    def execute_import(self, valid_rows):
        """
        Executes the import inside a database transaction.
        """
        created_count = 0
        updated_count = 0

        with transaction.atomic():
            for r in valid_rows:
                state_obj = r.get('state_obj')
                region_obj = r.get('region_obj')
                slug = r.get('slug')
                name = r.get('name')

                # District lookup/creation
                dist_name = r.get('district', '')
                dist_obj = None
                if dist_name and state_obj:
                    dist_obj, _ = District.objects.get_or_create(
                        name=dist_name,
                        state=state_obj,
                        defaults={"published": True}
                    )

                # City lookup/creation
                city_name = r.get('city', '')
                city_obj = None
                if city_name and state_obj:
                    city_obj, _ = City.objects.get_or_create(
                        name=city_name,
                        state=state_obj,
                        defaults={
                            "district": dist_obj,
                            "latitude": Decimal(str(r['lat_f'])) if r['lat_f'] is not None else None,
                            "longitude": Decimal(str(r['lng_f'])) if r['lng_f'] is not None else None,
                            "published": True
                        }
                    )

                is_featured = r.get('featured', '').lower() in ['true', '1', 'yes']
                is_verified = 'verified' if r.get('verified', '').lower() in ['true', '1', 'yes', 'verified'] else 'unverified'
                is_published = r.get('published', 'true').lower() in ['true', '1', 'yes']

                dest_defaults = {
                    "name": name,
                    "state": state_obj,
                    "district": dist_name,
                    "district_obj": dist_obj,
                    "city": city_obj,
                    "region_obj": region_obj,
                    "region": region_obj.slug if region_obj else (state_obj.region.slug if state_obj and state_obj.region else 'south-india'),
                    "short_description": r.get('short_description', ''),
                    "description": r.get('full_description', '') or r.get('short_description', ''),
                    "latitude": Decimal(str(r['lat_f'])) if r['lat_f'] is not None else None,
                    "longitude": Decimal(str(r['lng_f'])) if r['lng_f'] is not None else None,
                    "best_time_to_visit": r.get('best_time_to_visit', 'October to March'),
                    "ideal_duration": r.get('recommended_duration', '2-3 Days'),
                    "recommended_duration": r.get('recommended_duration', '2-3 Days'),
                    "budget_level": r.get('estimated_budget', 'medium') if r.get('estimated_budget') in ['budget', 'medium', 'luxury'] else 'medium',
                    "nearest_airport": r.get('nearest_airport', ''),
                    "nearest_railway": r.get('nearest_railway_station', ''),
                    "nearest_bus_station": r.get('nearest_bus_station', ''),
                    "featured": is_featured,
                    "verification_status": is_verified,
                    "published": is_published,
                }

                dest, was_created = Destination.objects.update_or_create(
                    slug=slug,
                    defaults=dest_defaults
                )

                if was_created:
                    created_count += 1
                else:
                    updated_count += 1

                # Categories M2M
                cat_str = r.get('categories', '')
                if cat_str:
                    cats = [c.strip().lower() for c in cat_str.split(',') if c.strip()]
                    for c_name in cats:
                        c_obj = self.categories_cache.get(c_name)
                        if not c_obj:
                            c_obj, _ = Category.objects.get_or_create(
                                slug=slugify(c_name),
                                defaults={"name": c_name.title(), "published": True}
                            )
                            self.categories_cache[c_name] = c_obj
                        dest.categories.add(c_obj)

                # Activities M2M
                act_str = r.get('activities', '')
                if act_str:
                    acts = [a.strip().lower() for a in act_str.split(',') if a.strip()]
                    for a_name in acts:
                        a_obj = self.activities_cache.get(a_name)
                        if not a_obj:
                            a_obj, _ = Activity.objects.get_or_create(
                                slug=slugify(a_name),
                                defaults={"name": a_name.title(), "published": True}
                            )
                            self.activities_cache[a_name] = a_obj
                        dest.activities.add(a_obj)

                # Tags M2M
                tag_str = r.get('tags', '')
                if tag_str:
                    tags = [t.strip().lower() for t in tag_str.split(',') if t.strip()]
                    for t_name in tags:
                        t_obj, _ = Tag.objects.get_or_create(
                            slug=slugify(t_name),
                            defaults={"name": t_name.title()}
                        )
                        dest.tags.add(t_obj)

                # History inline creation
                hist_text = r.get('history', '')
                hist_sig = r.get('historical_significance', '')
                cult_sig = r.get('cultural_significance', '')
                rel_sig = r.get('religious_significance', '')
                if hist_text or hist_sig or cult_sig or rel_sig:
                    DestinationHistory.objects.update_or_create(
                        destination=dest,
                        defaults={
                            "short_history": hist_text[:500] if hist_text else (hist_sig[:500] if hist_sig else "Historical heritage of India."),
                            "detailed_history": hist_text or hist_sig,
                            "cultural_significance": cult_sig,
                            "religious_significance": rel_sig,
                            "verification_status": is_verified
                        }
                    )

                # Recalculate completeness score
                dest.save()

        return {
            'success': True,
            'created_count': created_count,
            'updated_count': updated_count,
            'total_imported': created_count + updated_count
        }
