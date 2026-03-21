from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import FreelancerProfile, Project, ProjectApplication
from .email_service import send_freelancer_approved, send_freelancer_rejected


@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'experience', 'status_badge',
                    'ai_score_display', 'notification_sent', 'applied_at']
    list_filter = ['status', 'notification_sent']
    search_fields = ['name', 'email', 'role', 'skills']
    readonly_fields = ['id', 'ai_score', 'ai_feedback', 'applied_at', 'reviewed_at']
    actions = ['approve_and_email', 'reject_and_email']

    def status_badge(self, obj):
        colors = {'approved': '#16a34a', 'rejected': '#dc2626', 'pending': '#d97706'}
        c = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{};color:white;padding:2px 10px;'
            'border-radius:12px;font-size:11px;font-weight:600">{}</span>',
            c, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def ai_score_display(self, obj):
        if obj.ai_score is None:
            return '—'
        pct = int(obj.ai_score * 100)
        color = '#16a34a' if pct >= 55 else '#dc2626'
        return format_html('<b style="color:{}">{}/100</b>', color, pct)
    ai_score_display.short_description = 'AI Score'

    def approve_and_email(self, request, queryset):
        for app in queryset.filter(status='pending'):
            app.status = 'approved'
            app.reviewed_at = timezone.now()
            app.save()
            send_freelancer_approved(app)
        self.message_user(request, f'{queryset.count()} applications approved & emails sent.')
    approve_and_email.short_description = '✅ Approve selected & send emails'

    def reject_and_email(self, request, queryset):
        for app in queryset.filter(status='pending'):
            app.status = 'rejected'
            app.reviewed_at = timezone.now()
            app.save()
            send_freelancer_rejected(app)
        self.message_user(request, f'{queryset.count()} applications rejected & emails sent.')
    reject_and_email.short_description = '❌ Reject selected & send emails'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'budget', 'category', 'status', 'posted_at']
    list_filter = ['status', 'category']
    search_fields = ['title', 'company', 'skills_required']
    readonly_fields = ['id', 'posted_at']


@admin.register(ProjectApplication)
class ProjectApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant_name', 'applicant_email', 'project', 'proposed_rate', 'status', 'applied_at']
    list_filter = ['status']
    search_fields = ['applicant_name', 'applicant_email']
    readonly_fields = ['id', 'applied_at']