from django.db import models
import uuid


class FreelancerProfile(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=200)
    skills = models.TextField(help_text="Comma-separated: React, Python, Django")
    experience = models.IntegerField(help_text="Years of experience")
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    bio = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    # AI Screening fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    ai_score = models.FloatField(null=True, blank=True)
    ai_feedback = models.TextField(blank=True)
    notification_sent = models.BooleanField(default=False)

    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def get_skills_list(self):
        return [s.strip() for s in self.skills.split(',') if s.strip()]

    def __str__(self):
        return f"{self.name} — {self.role} ({self.status})"

    class Meta:
        ordering = ['-applied_at']


class Project(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile'),
        ('design', 'Design'),
        ('data', 'Data Science'),
        ('ml', 'ML/AI'),
        ('writing', 'Writing'),
        ('marketing', 'Marketing'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    description = models.TextField()
    company = models.CharField(max_length=200)
    client_email = models.EmailField()
    skills_required = models.TextField(help_text="Comma-separated skills")
    budget = models.CharField(max_length=100)
    duration = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    posted_at = models.DateTimeField(auto_now_add=True)

    def get_skills_list(self):
        return [s.strip() for s in self.skills_required.split(',') if s.strip()]

    def __str__(self):
        return f"{self.title} — {self.company}"

    class Meta:
        ordering = ['-posted_at']


class ProjectApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('seen', 'Seen'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='applications')
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    cover_letter = models.TextField()
    proposed_rate = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} → {self.project.title}"

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['project', 'applicant_email']