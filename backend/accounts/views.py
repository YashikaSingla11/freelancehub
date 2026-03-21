from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone

from .models import FreelancerProfile, Project, ProjectApplication
from .serializers import (FreelancerProfileSerializer, PublicFreelancerSerializer,
                           ProjectSerializer, ProjectApplicationSerializer)
from .screening import screen_application
from .email_service import (send_freelancer_approved, send_freelancer_rejected,
                              send_project_application_to_client,
                              send_application_confirmation_to_freelancer)


# ─── EXISTING AUTH VIEWS (unchanged) ─────────────────────────────────────────

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


class LoginView(APIView):
    def post(self, request):
        email_or_username = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email_or_username, password=password)
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
        return Response({"detail": "Invalid credentials, please try again."}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    def get(self, request):
        users = User.objects.all().values('username', 'email')
        return Response(users, status=status.HTTP_200_OK)


# ─── FREELANCER VIEWS ─────────────────────────────────────────────────────────

class FreelancerListView(APIView):
    """
    GET  /api/freelancers/  — list all approved freelancers (public)
    """
    def get(self, request):
        qs = FreelancerProfile.objects.filter(status='approved')

        # Optional filters
        role = request.query_params.get('role')
        skill = request.query_params.get('skill')
        search = request.query_params.get('search')

        if role:
            qs = qs.filter(role__icontains=role)
        if skill:
            qs = qs.filter(skills__icontains=skill)
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(skills__icontains=search)

        serializer = PublicFreelancerSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FreelancerApplyView(APIView):
    """
    POST /api/freelancers/apply/
    Accepts form-data (with optional resume file).
    Runs AI screening → auto approve/reject → sends email.
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        # Check duplicate email
        email = request.data.get('email', '')
        if FreelancerProfile.objects.filter(email=email).exists():
            return Response(
                {"detail": "An application with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = FreelancerProfileSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        application = serializer.save()

        # ── Run AI Screening ──
        score, feedback, should_approve = screen_application(application)
        application.ai_score = score
        application.ai_feedback = feedback
        application.reviewed_at = timezone.now()

        if should_approve:
            application.status = 'approved'
            application.save()
            send_freelancer_approved(application)
            application.notification_sent = True
            application.save()
            return Response({
                "result": "approved",
                "message": "Congratulations! Your application has been approved. Check your email!",
                "ai_score": int(score * 100),
                "feedback": feedback,
            }, status=status.HTTP_201_CREATED)
        else:
            application.status = 'rejected'
            application.save()
            send_freelancer_rejected(application)
            application.notification_sent = True
            application.save()
            return Response({
                "result": "rejected",
                "message": "Thank you for applying. Your application was not approved this time.",
                "ai_score": int(score * 100),
                "feedback": feedback,
            }, status=status.HTTP_201_CREATED)


# ─── PROJECT VIEWS ────────────────────────────────────────────────────────────

class ProjectListView(APIView):
    """
    GET /api/projects/ — list all open projects (public)
    """
    def get(self, request):
        qs = Project.objects.filter(status='open')

        category = request.query_params.get('category')
        search = request.query_params.get('search')

        if category:
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(title__icontains=search) | \
                 qs.filter(company__icontains=search) | \
                 qs.filter(skills_required__icontains=search)

        serializer = ProjectSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectDetailView(APIView):
    """
    GET /api/projects/<pk>/ — single project detail
    """
    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk, status='open')
        except Project.DoesNotExist:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectApplyView(APIView):
    """
    POST /api/projects/<pk>/apply/
    Sends email to client + confirmation to applicant.
    """
    def post(self, request, pk):
        try:
            project = Project.objects.get(pk=pk, status='open')
        except Project.DoesNotExist:
            return Response({"detail": "Project not found or closed."}, status=status.HTTP_404_NOT_FOUND)

        # Duplicate check
        email = request.data.get('applicant_email', '')
        if ProjectApplication.objects.filter(project=project, applicant_email=email).exists():
            return Response(
                {"detail": "You have already applied to this project."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProjectApplicationSerializer(data={**request.data, 'project': str(project.id)})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        application = serializer.save(project=project)

        # ── Send emails ──
        send_project_application_to_client(
            project,
            application.applicant_name,
            application.applicant_email,
            application.cover_letter,
            application.proposed_rate,
        )
        send_application_confirmation_to_freelancer(
            application.applicant_name,
            application.applicant_email,
            project.title,
        )

        return Response({
            "message": "Application submitted! Client notified. Check your email for confirmation.",
            "application_id": str(application.id),
        }, status=status.HTTP_201_CREATED)