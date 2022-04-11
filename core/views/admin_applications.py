from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from job.models.job_status import JobStatus
from job.models.job_applications import JobApplication
from core.models.users import User
from recruiter.serializers.applications_serializers import AllApplicationSerializer
from core.helpers import api_response
from resume.models.profile import Profile
from resume.models.work import Work
from recruiter.models.schedule_interview import ScheduleInterview


class AdminApplicantView(APIView):
    """
    List of all applications
    """

    permission_classes = (IsAdminUser,)

    def get(self, request, slug=None):
        all_status = (
            JobApplication.objects.select_related("user", "job")
            .all()
            .exclude(user__is_superuser=1)
            .values("user__id", "job__id")
        )
        if slug:
            jobs = (
                JobApplication.objects.select_related("user", "job", "job__company", "user__location", "job__location")
                .filter(job__slug=slug)
                .exclude(user__is_superuser=1)
                .order_by("-updated_at")
            )
        else:
            jobs = (
                JobApplication.objects.select_related("user", "job", "job__company", "user__location", "job__location")
                .all()
                .exclude(user__is_superuser=1)
                .order_by("-updated_at")
            )
        jobstatus_dict = jobs.values("id", "job__id", "user__id", "current_status")
        work_objects = Work.objects.all().values("id", "user__id", "title", "is_current")
        profile_objects = Profile.objects.all().values("user__id", "total_experience")
        user_objects = User.objects.all().values(
            "id",
            "username",
            "user_image",
            "resume_file",
            "email",
            "updated_at",
        )
        schedule_interview_objects = ScheduleInterview.objects.all().values("application_id", "is_scheduled")

        context = {
            "all_status": all_status,
            "jobstatus_dict": jobstatus_dict,
            "work_objects": work_objects,
            "profile_objects": profile_objects,
            "user_objects": user_objects,
            "schedule_interview_objects": schedule_interview_objects,
        }
        if "status" in request.GET:
            status = request.GET["status"]
            jobs = jobs.filter(current_status=status)
            serializer = AllApplicationSerializer(jobs, context=context, many=True)
            return api_response(200, " Applicants Retrieved Successfully", serializer.data)
        else:
            serializer = AllApplicationSerializer(jobs, context=context, many=True)
            return api_response(200, "Applicants Retrieved Successfully", serializer.data)
