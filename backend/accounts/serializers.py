from rest_framework import serializers
from .models import FreelancerProfile, Project, ProjectApplication


class FreelancerProfileSerializer(serializers.ModelSerializer):
    skills_list = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = [
            'id', 'name', 'email', 'role', 'skills', 'skills_list',
            'experience', 'resume', 'bio', 'portfolio_url', 'hourly_rate',
            'status', 'ai_score', 'ai_feedback', 'applied_at'
        ]
        read_only_fields = ['id', 'status', 'ai_score', 'ai_feedback', 'applied_at']

    def get_skills_list(self, obj):
        return obj.get_skills_list()


class PublicFreelancerSerializer(serializers.ModelSerializer):
    """Only approved freelancers — limited fields for public listing"""
    skills_list = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = [
            'id', 'name', 'role', 'skills_list', 'experience',
            'hourly_rate', 'bio', 'portfolio_url'
        ]

    def get_skills_list(self, obj):
        return obj.get_skills_list()


class ProjectSerializer(serializers.ModelSerializer):
    skills_list = serializers.SerializerMethodField()
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'company', 'skills_required',
            'skills_list', 'budget', 'duration', 'category',
            'status', 'posted_at', 'application_count'
        ]

    def get_skills_list(self, obj):
        return obj.get_skills_list()

    def get_application_count(self, obj):
        return obj.applications.count()


class ProjectApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectApplication
        fields = [
            'id', 'project', 'applicant_name', 'applicant_email',
            'cover_letter', 'proposed_rate', 'status', 'applied_at'
        ]
        read_only_fields = ['id', 'status', 'applied_at']