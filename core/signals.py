from core.models.audit import Audit
from core.models.users import User
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.signals import (
    user_logged_in,
    user_logged_out,
    user_login_failed,
)
from job.models.jobs import Job
from datetime import datetime
from resume.models.profile import Profile
from django.dispatch import Signal
from core.models.profile_setting import ProfileSetting

# from resume.views.signup_view import uploadResume
# from resume.views.resume_api import resumeupload
from job.models.email_templates import EmailTemplate
from job.models.job_applications import JobApplication
from job.views.job_submission import submission_api
from chatbot.views.chatbot_api import save_question_data
from django.template.loader import get_template
from core.helpers import send_simple_message
import random
from core.models.partner_setting import PartnerSetting
from recruiter.models.schedule_interview import ScheduleInterview
from resume.views.sovren_resume import bimetricscore
from job.models.user_job_match import UserJobMatch


@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    ip = request.META.get("REMOTE_ADDR")
    action = request.META.get("REQUEST_METHOD")
    Audit.objects.create(
        user_id=user.id,
        table_name="User",
        data=user.username,
        action=action,
        table_row=ip,
        tenant_id=user.tenant_id,
        date=datetime.now(),
    )


# @receiver(user_logged_out)
# def user_logged_out_callback(sender, request, user, **kwargs):
#     ip = request.META.get("REMOTE_ADDR")
#     action = request.META.get("REQUEST_METHOD")
#     Audit.objects.create(table_name="User", data=user.username, action=action, table_row=ip)


@receiver(user_login_failed)
def user_login_failed_callback(sender, credentials, **kwargs):
    Audit.objects.create(table_name="User", action="user_login_failed_callback", date=datetime.now())


@receiver(post_save, sender=User)
def user_detail(sender, instance, **kwargs):
    Audit.objects.create(
        user_id=instance.id,
        table_name="User",
        data=instance.username,
        action="Created",
        tenant_id=instance.tenant_id,
        date=datetime.now(),
    )


@receiver(post_save, sender=Job)
def job_create_edit_callback(sender, instance, **kwargs):
    if kwargs["created"]:
        Audit.objects.create(
            user_id=instance.id,
            table_name="Job",
            table_row=str(instance.id),
            data=instance.title,
            action="Created",
            date=datetime.now(),
        )
    else:
        Audit.objects.create(
            user_id=instance.id,
            table_name="Job",
            table_row=str(instance.id),
            data=str(kwargs["update_fields"]),
            action="updated",
            date=datetime.now(),
        )


@receiver(post_save, sender=User)
def create_or_save_profile(sender, created, instance, **kwargs):
    if created:
        Profile.objects.create(user=instance, tenant=instance.tenant)
        ProfileSetting.objects.create(
            user=instance,
            tenant=instance.tenant,
            score={
                "skills": 0,
                "uploads": 0,
                "about_me": 0,
                "personal_info": 0,
                "work_experience": 0,
                "education_details": 0,
                "trainings_certification": 0,
            },
        )
        if instance.role_id == 1 or instance.role_id == 2 or instance.role_id == 4 or instance.role_id == 5:
            # TODO : Need to map role_id = 4 with hiring_member
            PartnerSetting.objects.create(user=instance, tenant=instance.tenant)


# uploaded = Signal(providing_args=["user", "resume_file"])


@receiver(post_save, sender=JobApplication)
def catch_job_application_event(sender, instance, created, **kwargs):
    if created:
        body = "Thank you for submitting your application.  Due to the volume of applications we receive, we are not able to respond to every applicant.Once we are able to evaluate your application, a member of our Talent Acquisition team will be in touch if you are selected to move forward in the process."
        # body = "You have successfully applied for {} with {} on {}".format(
        #     instance.job.title, name, instance.created_at.date()
        # )
        model_type = "{}".format(instance._meta.db_table)
        EmailTemplate.objects.create(
            user=instance.user,
            tenant=instance.tenant,
            job=instance.job,
            body=body,
            model_type=model_type,
        )


@receiver(post_save, sender=JobApplication)
def job_bimetric_score(sender, instance, created, **kwargs):
    if created:
        try:
            userjob_matchobj = UserJobMatch.objects.filter(
                user=instance.user, tenant=instance.user.tenant, job=instance.job
            )[0]
        except IndexError:
            bimetricscore(instance.job.id, instance.user.id)


# current there is no Job rejection table
# sender=JobRejection
# @receiver(post_save, sender=None)
# def catch_job_rejection_event(sender, instance, created, **kwargs):
#     if created:
#         email_address = instance.email
#         message = """Thank you for applying. At this time, we regret to inform you that we are not able
#         to offer you further consideration. We encourage you to continue to browse the career center for additional
#         openings that may interest you."""
#         email_template = get_template("emails/rejection.html")
#         html_content = email_template.render({"message": message})
#         subject = "Thank you for your interest!"
#         body = None
#         send_simple_message(email_address, subject, body, html_content)


@receiver(post_save, sender=Job)
def save_questions(sender, created, instance, **kwargs):
    if created:
        if instance.interview_questions is not None:
            instance.interview_questions = save_question_data(instance)


@receiver(post_save, sender=JobApplication)
def process_application(sender, instance, created, **kwargs):
    data = {}
    date_time = instance.job.created_at.isoformat()
    if created:
        # data["job_id"] = instance.job.source_job_id
        data["tenant_id"] = instance.tenant.id
        data["base_url"] = instance.tenant.base_url
        data["j_id"] = instance.job.id
        data["slug"] = instance.job.slug
        data["resume_file"] = instance.user.resume_file
        data["user_id"] = instance.user.id
        data["first_name"] = instance.user.first_name
        data["last_name"] = instance.user.last_name
        data["email"] = instance.user.email
        data["isProcessed"] = True
        data["created_at"] = date_time[:-6]
        data["vendor"] = "simplifycareers"
        data["score"] = random.randint(50, 70)
        data["score_json"] = {
            "Id": instance.job.title,
            "WeightedScore": random.randint(50, 75),
            "UnweightedCategoryScores": [
                {
                    "Category": "SKILLS",
                    "UnweightedScore": random.randint(0, 20),
                    "TermsFound": [],
                },
                {
                    "Category": "JOB_TITLES",
                    "UnweightedScore": random.randint(0, 20),
                    "TermsFound": [],
                },
                {
                    "Category": "INDUSTRIES",
                    "UnweightedScore": random.randint(0, 20),
                    "TermsFound": [],
                },
                {
                    "Category": "MANAGEMENT_LEVEL",
                    "UnweightedScore": random.randint(0, 20),
                    "TermsFound": [],
                },
            ],
            "ReverseCompatibilityScore": random.randint(0, 20),
            "IndexId": instance.job.title,
        }
        data["question_answers"] = instance.answer
        # submission_api(data)


# @receiver(post_save, sender=ScheduleInterview)
# def send_interview_schedule_mail(sender, instance, created, **kwargs):
#     if created:
#         email_address = instance.email_to
#         subject = instance.email_subject
#         body = instance.email_body
#         send_simple_message(email_address, subject, body, html=None)


@receiver(post_save, sender=Job)
def job_create_mail(sender, instance, created, **kwargs):
    if created:
        username = instance.user.username
        from_email = instance.user.email
        email_address = ["prahlad@simplifyvms.com"]
        subject = " New Job Created "
        body = " New job is created by " + username
        if instance.custom_field1:
            send_simple_message(email_address, subject, body=body, html=None)
