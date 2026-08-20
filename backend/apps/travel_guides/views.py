from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from django.db.models import Q
from .models import Story, TravelGuide, LocalGuide
from .serializers import StorySerializer, TravelGuideSerializer, LocalGuideSerializer
from apps.utils import StandardResultsSetPagination, api_response

class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Story.objects.select_related('state', 'city', 'destination').filter(is_active=True)
    serializer_class = StorySerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'short_description', 'content', 'location', 'author', 'state__name', 'category']
    ordering_fields = ['display_order', 'created_at', 'views_count', 'likes_count', 'title']

    def get_object(self):
        lookup_val = self.kwargs.get(self.lookup_field) or self.kwargs.get('pk')
        qs = self.get_queryset()
        if lookup_val and lookup_val.isdigit():
            obj = qs.filter(id=int(lookup_val)).first()
        else:
            obj = qs.filter(slug=lookup_val).first()
        if not obj:
            raise NotFound("Story not found")
        return obj

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Category filtering
        cat = request.query_params.get('category')
        if cat and cat.lower() != 'all':
            cat_slug = cat.lower().strip()
            category_aliases = {
                'hidden': ['hidden', 'untold', 'hidden-india'],
                'culture': ['culture', 'tradition', 'traditions', 'festival', 'festivals'],
                'food': ['food', 'culinary', 'cuisine'],
                'heritage': ['heritage', 'royal', 'palace', 'forts', 'history'],
                'spiritual': ['spiritual', 'sacred', 'temple', 'temples', 'pilgrimage'],
                'adventure': ['adventure', 'trekking', 'rafting'],
                'wildlife': ['wildlife', 'wild', 'safari', 'animals', 'tiger'],
                'nature': ['nature', 'landscapes', 'forest', 'waterfalls'],
                'coastal': ['coastal', 'beach', 'beaches', 'backwaters', 'sea'],
                'mountain': ['mountain', 'mountains', 'himalayas', 'hills', 'high-altitude'],
            }
            if cat_slug in category_aliases:
                aliases = category_aliases[cat_slug]
                q_cat = Q(category__in=aliases)
                for alias in aliases:
                    q_cat |= Q(category_label__icontains=alias) | Q(title__icontains=alias)
                queryset = queryset.filter(q_cat).distinct()
            else:
                queryset = queryset.filter(
                    Q(category__iexact=cat_slug) |
                    Q(category_label__icontains=cat_slug)
                ).distinct()

        # Featured filter
        featured = request.query_params.get('featured') or request.query_params.get('is_featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Stories retrieved successfully", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment views count safely
        Story.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        instance.views_count += 1
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Story '{instance.title}' retrieved", data=serializer.data)

    @action(detail=False, methods=['get'], url_path='featured')
    def get_featured(self, request):
        featured_story = self.get_queryset().filter(is_featured=True).first()
        if not featured_story:
            featured_story = self.get_queryset().first()
        if not featured_story:
            raise NotFound("No active stories available.")
        serializer = self.get_serializer(featured_story)
        return api_response(success=True, message="Featured story retrieved", data=serializer.data)


class TravelGuideViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TravelGuide.objects.select_related('state', 'city', 'destination').filter(is_published=True)
    serializer_class = TravelGuideSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'state__name', 'city__name']
    ordering_fields = ['published_at', 'title']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Travel guides retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Guide {instance.title} retrieved", data=serializer.data)


class LocalGuideViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = LocalGuide.objects.select_related('state', 'city', 'destination').all()
    serializer_class = LocalGuideSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'bio', 'languages_spoken', 'state__name', 'destination__name']
    ordering_fields = ['rating', 'experience_years', 'price_per_day']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        dest = request.query_params.get('destination')
        if dest:
            queryset = queryset.filter(Q(destination__slug=dest) | Q(destination__name__icontains=dest))
            
        state = request.query_params.get('state')
        if state:
            queryset = queryset.filter(Q(state__slug=state) | Q(state__name__icontains=state))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Local guides retrieved", data=serializer.data)
