from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from core.models import Skill, JobRoles
from recruiter.serializers.job_skill_serializer import JobSkillSerializer
from core.helpers import api_response
from rest_framework.permissions import IsAuthenticated
from recruiter.serializers.recruiter_serializers import (
    CompanySerializer,
    JobTypeSerializer,
    IndustrySerializer,
    QualificationSerializer,
    CategorySerializer,
    HiringManagerSerializer,
    LocationSerializer,
)
from core.models.location import Location
from job.models.job_industry import Industry
from core.models.users import User
from job.models.job_type import JobType
from job.models.job_company import JobCompany as Company
from job.models.job_category import Category
from job.models.job_qualifications import JobQualification as Qualification


class GetSkillView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        skill_lang = request.GET.get("lang", "en")
        skills = Skill.objects.filter(language_preference=skill_lang, user_created=0).order_by("name")
        serializer = JobSkillSerializer(skills[:5], many=True)
        if "query" in request.GET:
            skills = skills.filter(name__startswith=request.GET["query"]) | skills.filter(
                name__icontains=request.GET["query"]
            )
            serializer = JobSkillSerializer(skills, many=True)
        return api_response(200, "skills retrieved successfully", serializer.data)


class GetMasterDataset(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        current_lang = request.GET.get("lang", "en")
        master_companies = Company.objects.filter(language_preference=current_lang).values("id", "name")
        master_industries = Industry.objects.filter(language_preference=current_lang).values("id", "name")
        master_categories = Category.objects.filter(language_preference=current_lang).values("id", "name")
        job_types = JobType.objects.filter(language_preference=current_lang).values("id", "name")
        master_qualification = Qualification.objects.filter(language_preference=current_lang).values("id", "education")
        locations = Location.objects.filter(language_preference=current_lang).values("id")
        company_serializer = CompanySerializer(master_companies, many=True)
        industry_serializer = IndustrySerializer(master_industries, many=True)
        category_serializer = CategorySerializer(master_categories, many=True)
        jobtype_serializer = JobTypeSerializer(job_types, many=True)
        qualification_serializer = QualificationSerializer(master_qualification, many=True)
        location_serializer = LocationSerializer(locations, many=True)
        data = {
            "industries": industry_serializer.data,
            "categories": category_serializer.data,
            "job_types": jobtype_serializer.data,
            "education": qualification_serializer.data,
            "companies": company_serializer.data,
            "locations": location_serializer.data,
        }
        return api_response(200, "data retrieved successfully", data)


class GetJobRolesView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        data = []
        obj_jobs_roles = JobRoles.objects.all()
        q = request.GET.get("q")
        if q:
            obj_jobs_roles = obj_jobs_roles.filter(name__startswith=q) | obj_jobs_roles.filter(name__icontains=q)

        else:
            obj_jobs_roles = obj_jobs_roles[:5]
        data = [
                {
                    "id": i.id,
                    "name": i.name,
                    "name_esp": i.esp_name
                } for i in obj_jobs_roles
            ]
        return api_response(200, "Job roles retrieved successfully", data)