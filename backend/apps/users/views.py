from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer
from apps.utils import api_response

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return api_response(
            success=True,
            message="Login successful",
            data=response.data,
            status_code=status.HTTP_200_OK
        )

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile_data = UserProfileSerializer(user).data
            return api_response(
                success=True,
                message="User registered successfully",
                data={"user": profile_data},
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Validation error",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return api_response(
            success=True,
            message="Profile retrieved successfully",
            data=serializer.data
        )

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Profile updated successfully",
                data=serializer.data
            )
        return api_response(
            success=False,
            message="Validation error",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
