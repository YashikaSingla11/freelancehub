"""
Email Notification Service — FreelanceHub
All emails print to console in development (EMAIL_BACKEND = console)
Switch to SMTP in production via settings.py
"""
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_freelancer_approved(application):
    subject = "🎉 Congratulations! You've been selected — FreelanceHub"
    message = f"""
Dear {application.name},

We are thrilled to inform you that your application to join FreelanceHub
as a {application.role} has been APPROVED!

AI Screening Score: {int((application.ai_score or 0) * 100)}/100

Your profile is now LIVE on FreelanceHub. Clients can now discover
and contact you for projects.

Profile Feedback:
{application.ai_feedback}

Next Steps:
1. Keep your profile updated
2. Browse and apply to projects on FreelanceHub
3. Wait for client inquiries

Welcome aboard!

— FreelanceHub Team
"""
    _send(subject, message, application.email, "Approval")


def send_freelancer_rejected(application):
    subject = "FreelanceHub Application Update — Keep Growing! 💪"
    message = f"""
Dear {application.name},

Thank you for applying to join FreelanceHub as a {application.role}.

After our AI screening review, we were unable to approve your profile
at this time.

AI Screening Score: {int((application.ai_score or 0) * 100)}/100

Detailed Feedback:
{application.ai_feedback}

Don't be discouraged! You are welcome to reapply after 30 days
with an updated profile.

Keep learning and growing — we'd love to have you on the platform!

— FreelanceHub Team
"""
    _send(subject, message, application.email, "Rejection")


def send_project_application_to_client(project, applicant_name, applicant_email, cover_letter, proposed_rate):
    subject = f"📋 New Application for '{project.title}' — FreelanceHub"
    message = f"""
Dear {project.company} Team,

Your project "{project.title}" has received a new application on FreelanceHub!

Applicant Details:
  Name:          {applicant_name}
  Email:         {applicant_email}
  Proposed Rate: {proposed_rate}

Cover Letter:
{cover_letter}

Log in to your FreelanceHub dashboard to review this application
and get in touch with the applicant directly.

— FreelanceHub Team
"""
    _send(subject, message, project.client_email, "Project Application Notification")


def send_application_confirmation_to_freelancer(applicant_name, applicant_email, project_title):
    subject = f"✅ Application Submitted — {project_title}"
    message = f"""
Dear {applicant_name},

Your application for "{project_title}" has been successfully submitted!

The client has been notified and will review your application shortly.
You will be contacted at this email address if selected.

Good luck!

— FreelanceHub Team
"""
    _send(subject, message, applicant_email, "Application Confirmation")


def _send(subject, message, recipient_email, label):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        logger.info(f"[Email OK] {label} → {recipient_email}")
    except Exception as e:
        logger.error(f"[Email FAILED] {label} → {recipient_email} | Error: {e}")