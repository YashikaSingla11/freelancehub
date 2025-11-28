from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# ✅ Register new user
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"detail": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)


# ✅ Login with username or email
class LoginView(APIView):
    def post(self, request):
        email_or_username = request.data.get('email')
        password = request.data.get('password')

        # Try with username
        user = authenticate(username=email_or_username, password=password)

        # Try with email
        if user is None:
            try:
                user_obj = User.objects.get(email=email_or_username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                return Response({"detail": "Invalid credentials, please try again."}, status=status.HTTP_400_BAD_REQUEST)

        if user is not None:
            return Response({
                "message": "Login successful",
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials, please try again."}, status=status.HTTP_400_BAD_REQUEST)


# ✅ Get user info (for profile/dashboard)
class UserView(APIView):
    def get(self, request):
        users = User.objects.all().values('username', 'email')
        return Response(users, status=status.HTTP_200_OK)
