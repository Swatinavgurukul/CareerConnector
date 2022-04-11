from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from job.models.job_applications import JobApplication
from job.models.jobs import Job
from rest_framework.response import Response
from core.helpers import api_response
from django.db.models import Sum
from recruiter.serializers.recruiter_serializers import (
    RecruiterCandidateDensitySerializer,
    InterviewDashboardSerializer,
)
from resume.models.profile import Profile
from core.models.users import User
import math
from datetime import datetime, timedelta, date
from recruiter.models.schedule_interview import ScheduleInterview
from django.db.models import Max
import math
from django.utils import timezone


class AdminDashboardCountView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        active_job = Job.objects.filter(status="active")
        applicant_received = JobApplication.objects.all().exclude(user__is_superuser=1)
        upcoming_interviews = applicant_received.filter(
            current_status="interview",
            scheduled=1,
            scheduled_date__gt=timezone.now().date(),
        )
        applicant_hired = applicant_received.filter(current_status="hired")
        applicant_screening = applicant_received.filter(current_status="screening")
        applicant_offered = applicant_received.filter(current_status="offered")

        data = {
            "active_jobs": active_job.count(),
            "application_received": applicant_received.count(),
            "upcoming_interviews": upcoming_interviews.count(),
            "applicant_hired": applicant_hired.count(),
            "applicant_screening": applicant_screening.count(),
            "applicant_offered": applicant_offered.count(),
        }
        return api_response(Response.status_code, "Success", data)


class AdminApplicationSourceView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        applications = Job.objects.all()
        linkedin_jobs = applications.filter(linkedin=True)
        ziprecruiter_jobs = applications.filter(zip_recruiter=True)
        broadbean_jobs = applications.filter(broadbean=True)
        data = {
            "linkedin_jobs": linkedin_jobs.count(),
            "ziprecruiter_jobs": ziprecruiter_jobs.count(),
            "broadbean_jobs": broadbean_jobs.count(),
        }
        return api_response(Response.status_code, "ApplicationSourceCount", data)


class AdminFillRateView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        job = Job.objects.aggregate(Sum("openings"))
        if job["openings__sum"] is None:
            opening_job = 0
        else:
            opening_job = job["openings__sum"]

        hired_jobs = JobApplication.objects.filter(current_status="hired").exclude(user__is_superuser=1)
        hired_count = hired_jobs.count()
        try:
            job_rate = (hired_count / opening_job) * 100
        except ZeroDivisionError:
            job_rate = 0
        data = {"openings_jobs": opening_job, "hired_jobs": hired_count, "fill_rate": math.ceil(job_rate)}
        return api_response(Response.status_code, "AdminFillRate", data)


class AdminJobSeekerDensityView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, slug=None):

        jobs = Job.objects.all().select_related(
            "company",
            "industry",
            "location",
            "job_type",
        )
        job_status_dict = JobApplication.objects.all().exclude(user__is_superuser=1).values("job__id")
        context = {"job_status_dict": job_status_dict}
        serializer = RecruiterCandidateDensitySerializer(jobs, context=context, many=True)
        return api_response(200, "Retrieved successfully", serializer.data)


class AdminUpcomingInterviewsView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        interview_data = (
            JobApplication.objects.filter(
                current_status="interview",
                scheduled=1,
                scheduled_date__gt=timezone.now().date(),
            )
            .exclude(user__is_superuser=1)
            .values(
                "scheduled_date",
                "scheduled_time",
                "user__username",
                "user__first_name",
                "user__last_name",
            )
            .order_by("-scheduled_date")
        )
        serializer = InterviewDashboardSerializer(interview_data, many=True)
        return api_response(200, "UpcomingInterviews", serializer.data)
