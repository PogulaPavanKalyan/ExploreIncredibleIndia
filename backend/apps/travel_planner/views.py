from rest_framework.views import APIView
from rest_framework import permissions, status
from .services import TravelPlannerService
from apps.utils import api_response

class TravelPlannerGenerateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        starting_location = request.data.get('starting_location')
        destination = request.data.get('destination')
        duration_days = request.data.get('duration_days')

        if not starting_location or not destination or not duration_days:
            return api_response(
                success=False,
                message="starting_location, destination, and duration_days are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        planner_service = TravelPlannerService()
        plan_result = planner_service.generate_plan(request.data)

        return api_response(
            success=True,
            message="AI Travel Plan generated successfully",
            data=plan_result
        )
