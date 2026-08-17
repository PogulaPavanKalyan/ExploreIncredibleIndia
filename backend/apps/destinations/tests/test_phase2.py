from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.states.models import State
from apps.cities.models import City
from apps.categories.models import Category
from apps.destinations.models import Destination, DestinationImage, Attraction, TravelTip

User = get_user_model()

class Phase2CoreDestinationSystemTests(APITestCase):

    def setUp(self):
        # Create normal user
        self.normal_user = User.objects.create_user(
            username="normaluser",
            email="user@example.com",
            password="password123"
        )

        # Create admin user
        self.admin_user = User.objects.create_superuser(
            username="adminuser",
            email="admin@example.com",
            password="password123"
        )

        # Sample State
        self.state_ap = State.objects.create(
            name="Andhra Pradesh",
            slug="andhra-pradesh",
            code="AP",
            capital="Amaravati",
            description="Andhra Pradesh state",
            latitude=15.9129,
            longitude=79.7400,
            published=True
        )

        self.state_draft = State.objects.create(
            name="Draft State",
            slug="draft-state",
            published=False
        )

        # Sample City
        self.city_araku = City.objects.create(
            name="Araku",
            slug="araku-andhra-pradesh",
            state=self.state_ap,
            description="Araku valley city",
            latitude=18.3273,
            longitude=82.8775,
            published=True
        )

        # Sample Category
        self.cat_waterfalls = Category.objects.create(
            name="Waterfalls",
            slug="waterfalls",
            description="Waterfalls category",
            published=True
        )

        self.cat_beaches = Category.objects.create(
            name="Beaches",
            slug="beaches",
            description="Beaches category",
            published=True
        )

        # Sample Destination (Published)
        self.dest_araku = Destination.objects.create(
            name="Araku Valley Place",
            slug="araku-valley-place",
            short_description="Beautiful hill station in AP",
            description="Detailed description of Araku Valley",
            state=self.state_ap,
            city=self.city_araku,
            best_time_to_visit="Winter",
            ticket_price=50.00,
            latitude=18.3273,
            longitude=82.8775,
            featured=True,
            trending=True,
            published=True
        )
        self.dest_araku.categories.add(self.cat_waterfalls)

        # Sample Destination (Unpublished)
        self.dest_unpublished = Destination.objects.create(
            name="Secret Hidden Place",
            slug="secret-hidden-place",
            short_description="Secret place description",
            description="Unpublished secret destination",
            state=self.state_ap,
            city=self.city_araku,
            ticket_price=0.00,
            published=False
        )

    # 1. State CRUD & Permissions Test
    def test_public_cannot_create_state(self):
        url = "/api/states/"
        data = {"name": "New State", "code": "NS"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_state(self):
        self.client.force_authenticate(user=self.admin_user)
        url = "/api/states/"
        data = {
            "name": "Telangana State",
            "slug": "telangana-state",
            "code": "TG",
            "capital": "Hyderabad",
            "description": "Telangana description",
            "published": True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(State.objects.filter(name="Telangana State").exists())

    def test_public_only_sees_published_states(self):
        response = self.client.get("/api/states/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("data", [])
        state_names = [s["name"] for s in results]
        self.assertIn("Andhra Pradesh", state_names)
        self.assertNotIn("Draft State", state_names)

    # 2. City CRUD & Duplicate Constraint Test
    def test_unique_city_per_state_constraint(self):
        with self.assertRaises(Exception):
            City.objects.create(
                name="Araku",
                state=self.state_ap,
                description="Duplicate Araku city"
            )

    # 3. Destination Public vs Admin Permissions
    def test_public_user_cannot_create_destination(self):
        url = "/api/places/"
        data = {
            "name": "New Destination",
            "short_description": "Short desc",
            "description": "Long desc",
            "state_id": self.state_ap.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_user_can_create_destination(self):
        self.client.force_authenticate(user=self.admin_user)
        url = "/api/places/"
        data = {
            "name": "RK Beach Vizag",
            "slug": "rk-beach-vizag",
            "short_description": "Popular Vizag beach",
            "description": "Ramakrishna beach details",
            "state_id": self.state_ap.id,
            "city_id": self.city_araku.id,
            "ticket_price": "0.00",
            "published": True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Destination.objects.filter(name="RK Beach Vizag").exists())

    def test_unpublished_destinations_hidden_from_public(self):
        response = self.client.get("/api/places/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("data", [])
        slugs = [d["slug"] for d in results]
        self.assertIn("araku-valley-place", slugs)
        self.assertNotIn("secret-hidden-place", slugs)

    # 4. Filtering Tests
    def test_filtering_by_state_and_category(self):
        response = self.client.get("/api/places/?state=andhra-pradesh&category=waterfalls")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("data", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["slug"], "araku-valley-place")

    def test_filtering_by_featured_and_trending(self):
        response = self.client.get("/api/places/?featured=true&trending=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("data", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["slug"], "araku-valley-place")

    # 5. Search Endpoint Test
    def test_search_endpoint(self):
        response = self.client.get("/api/search/?q=araku")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("data", {})
        destinations = data.get("destinations", [])
        self.assertTrue(len(destinations) > 0)
        self.assertEqual(destinations[0]["slug"], "araku-valley-place")

    # 6. Pagination Test
    def test_pagination(self):
        response = self.client.get("/api/places/?page=1&page_size=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pagination = response.data.get("pagination", {})
        self.assertEqual(pagination.get("page_size"), 1)
        self.assertIn("total", pagination)
