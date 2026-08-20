from rest_framework.views import APIView
from rest_framework import permissions, status
from .services import TripRecommendationService
from apps.utils import api_response

class TravelPlannerGenerateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        service = TripRecommendationService()
        try:
            plan_result = service.plan_trip(request.data)
            return api_response(
                success=True,
                message="Personalized India travel plan generated successfully",
                data=plan_result
            )
        except Exception as e:
            return api_response(
                success=False,
                message=f"Failed to generate travel plan: {str(e)}",
                status_code=status.HTTP_400_BAD_REQUEST
            )
