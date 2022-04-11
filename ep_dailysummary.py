import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from core.models.users import User
from core.task import send_simple_message
from django.utils import timezone
from datetime import timedelta
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from urllib.parse import urlparse
from django.template.loader import get_template
from decouple import UndefinedValueError, config
import html


def ep_dailysummary():
    subject = "Application Summary Report"
    ep_users = User.objects.filter(is_superuser=1, role_id__in=[1,4],daily_jobs_summary=True)
    last_week = timezone.now() - timedelta(days=7)
    try:
        base_url = config("HOST_URL")
    except UndefinedValueError:
        base_url = None
    email_template = get_template("emails/template.html")
    for ep_user in ep_users:
        email=ep_user.email
        active_jobs = Job.objects.filter(tenant=ep_user.tenant.id, status="active").order_by("updated_at")
        applications_received = JobApplication.objects.filter(job_tenant=ep_user.tenant.id).exclude(
            user__is_superuser=1
        )
        upcoming_interviews = applications_received.filter(
            current_status="interview",
            scheduled=1,
            scheduled_date__gte=timezone.now().date(),
        )
        active_jobs_count = active_jobs.count()
        applications_received_count = applications_received.count()
        upcoming_interviews_count = upcoming_interviews.count()
        if active_jobs_count > 10:
            active_jobs = active_jobs[0:10]

        jobs_data = ""
        if active_jobs:
            for job in active_jobs:
                applications_received = (
                    JobApplication.objects.filter(job_tenant=ep_user.tenant.id, job__slug=job.slug)
                    .exclude(user__is_superuser=1)
                    .count()
                )
                lastweek_applications = (
                    JobApplication.objects.filter(
                        job_tenant=ep_user.tenant.id, job__slug=job.slug, created_at__gte=last_week
                    )
                    .exclude(user__is_superuser=1)
                    .count()
                )
                job_data = (
                    "<br><b>"
                    + str(job.title)
                    + "</b><br>"
                    + "Total Applications : "
                    + str(applications_received)
                    + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                    + "New Applications : "
                    + str(lastweek_applications)
                    + "<br>"
                )
                jobs_data = jobs_data + job_data
            applications_url=base_url+"/applications"
            notification_url=base_url+"/settingsv2"
            data_list =(
                "Number of Active Jobs :"
                + str(active_jobs_count)
                + "<br>"
                + "Number of Applications :"
                + str(applications_received_count)
                + "<br>"
                + "Number of Upcoming Interviews :"
                + str(upcoming_interviews_count)
                + "<br>"
                + jobs_data
                + "<br>"
                +"<h5>"
                +"View All Applications :"
                +"&nbsp;&nbsp;"
                + applications_url
                + "<br>"
                +"Manage Notifications :"
                +"&nbsp;&nbsp;"
                + notification_url
                +"<br>"
                +"<br>"
                +"Contact us at +1 888-323-7470"
                +"</h5>"

            )
            html_content = email_template.render(
                    {
                        "body": data_list
                    }
                )
            html_content = html.unescape(html_content)
            send_simple_message(email_address=email, subject=subject, body=None, html=html_content)


if __name__ == "__main__":
    ep_dailysummary()
    print("Done" + " " + str(timezone.now()))