from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from resume.models.profile import Profile
from resume.models.work import Work
from resume.models.education import Education
from resume.models.certificate import Certification
from resume.models.skill import Skills
from resume.models.achievement import Achievement
from core.models.users import User
from job.models.job_status import JobStatus
from job.models.job_applications import JobApplication
from recruiter.serializers.candidates_serializers import AllCandidatesGetSerializer
from core.helpers import api_response
from core.models.tenant import Tenant
from core.models.exclude_users import ExcludeUser
from resume.search.get_request_params import jobseeker_advanced_search


class AllJobSeekerView(APIView):
    """
    class used to get all jobseeker data

    get:
    return a list of all the jobseeker data

    """

    permission_classes = (IsAdminUser,)

    def get(self, request):
        candidates = User.objects.select_related("location").filter(is_superuser=0, approved=True).order_by("-updated_at")
        exclude_users = list(
            ExcludeUser.objects.filter(request_by=request.user.id, exclude_from="sp_candidates_list").values_list(
                "user", flat=True
            )
        )
        user_objects = User.objects.all().values(
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "location__city",
            "location__state",
            "is_resume_parsed",
            "location__state_code",
            "updated_at",
            "resume_file",
        )
        work_objects = Work.objects.all().values("user__id", "organization", "title", "is_current", "updated_at")
        profile_objects = Profile.objects.all().values("user__id", "about_me", "total_experience", "updated_at")
        education_objects = Education.objects.all().values("user__id", "updated_at")
        certification_objects = Certification.objects.all().values("user__id", "updated_at")
        achievement_objects = Achievement.objects.all().values("user__id", "updated_at")
        skill_objects = Skills.objects.all().values("user__id", "updated_at")
        jobstatus = JobApplication.objects.select_related("job", "user").exclude(user__is_superuser=1)
        jobstatus_objects = jobstatus.values("id", "job__id", "user__id", "current_status")

        context = {
            "user_objects": user_objects,
            "work_objects": work_objects,
            "profile_objects": profile_objects,
            "education_objects": education_objects,
            "certification_objects": certification_objects,
            "achievement_objects": achievement_objects,
            "jobstatus_objects": jobstatus_objects,
            "skill_objects": skill_objects,
            "exclude_users": exclude_users,
        }
        user_objects = User.objects.all().filter(is_superuser=0, approved=True)

        if candidates:
            candidates = jobseeker_advanced_search(request, candidates)
            serializer = AllCandidatesGetSerializer(candidates, context=context, many=True)
            return api_response(200, "Job Seeker Retrieved Successfully", serializer.data)
        else:
            return api_response(200, "Job Seeker Not Found", {})


class AllPartnersView(APIView):

    permission_classes = (IsAdminUser,)

    def get(self, request):
        partners = Tenant.objects.filter(approved=True).exclude(key=None).values("name", "id", "key")
        return api_response(200, "All Skilling Partners", partners)


class AllSkillingPartnerAdminView(APIView):

    permission_classes = (IsAdminUser,)

    def get(self, request, user_id):
        data = User.objects.filter(tenant=user_id, role_id=2, approved=True).values("email", "id")
        return api_response(200, "Skilling Partners Admin", data)
