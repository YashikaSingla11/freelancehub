from django.urls import path
from .views import (
    RegisterView, LoginView, UserView,
    FreelancerListView, FreelancerApplyView,
    ProjectListView, ProjectDetailView, ProjectApplyView,
)

urlpatterns = [
    # ── Existing Auth (unchanged) ──
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserView.as_view(), name='users'),

    # ── Freelancers ──
    path('freelancers/', FreelancerListView.as_view(), name='freelancer-list'),
    path('freelancers/apply/', FreelancerApplyView.as_view(), name='freelancer-apply'),

    # ── Projects ──
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<uuid:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('projects/<uuid:pk>/apply/', ProjectApplyView.as_view(), name='project-apply'),
]