from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from recruiter.serializers.recruiter_serializers import (
    RecruiterSerializer,
    RecruiterJobCreateSerializer,
    RecruiterJobUpdateSerializer,
    RecruiterGetJobSerializer,
)
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from core.helpers import api_response
from core.models.users import User
from resume.helpers import sovren_jobparser_v10
import json
import base64
from recruiter.utils import save_skill, update_skill
from core.models.tenant import Tenant
from recruiter.serializers.applications_serializers import JobStatusUpdateSerializer
from job.models.job_skills import JobSkill
from rest_framework.permissions import IsAuthenticated


class AdminJobGetView(APIView):
    """
    Get all jobs

    get:
    return a list of all the existing jobs by *all* *active* *closed* *paused* *offered*.

    """

    permission_classes = (IsAdminUser,)

    def get(self, request, slug=None):
        jobs = Job.objects.all().select_related("company", "industry", "location", "job_type")
        job_status_dict = JobApplication.objects.all().values("job__id")
        context = {"job_status_dict": job_status_dict}
        if "status" in request.GET:
            status = request.GET["status"]
            if status == "all":
                jobs = jobs.filter(status__in=["active", "draft", "paused", "closed", "offered"])
            else:
                jobs = jobs.filter(status=status)

            serializer = RecruiterSerializer(jobs, context=context, many=True)
            return api_response(200, "Jobs Retrieved Successfully", serializer.data)
        else:
            serializer = RecruiterSerializer(jobs, context=context, many=True)
            return api_response(200, "Jobs Retrieved Successfully", serializer.data)


class AllEmployeePartnersView(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        partners = Tenant.objects.filter(approved=True, key=None).values("name", "id", "key")
        return api_response(200, "All Employee Partners", partners)


class AllEmployeePartnerAdminView(APIView):

    permission_classes = (IsAdminUser,)

    def get(self, request, tenant_id):
        data = User.objects.filter(tenant=tenant_id, role_id=1, approved=True).values("email", "id")
        return api_response(200, "Employee Partners Admin", data)


class AdminJobCreateView(APIView):
    """
    admin can post/put jobs
    """

    permission_classes = (IsAdminUser,)

    def post(self, request):
        serializer = RecruiterJobCreateSerializer(data=request.data)
        email = request.data["tenant_email"]
        user = User.objects.filter(email=email).values("id", "tenant_id", "tenant__name")
        user_id = user[0]["id"]
        tenant_id = user[0]["tenant_id"]
        tenant_name = user[0]["tenant__name"]
        if serializer.is_valid(raise_exception=True):
            serializer.save(user_id=user_id, tenant_id=tenant_id, company_name=tenant_name)
            job_base64 = base64.urlsafe_b64encode(json.dumps(serializer.data).encode()).decode()
            jobid = serializer.data["id"]
            sovren_jobparser_v10(job_base64, jobid=jobid)
            try:
                job_id = serializer.data["id"]
                skills = list(eval(request.data["skills"]))
                save_skill(tenant_id, job_id, skills)
            except KeyError:
                return api_response(400, "Invalid skills", {})
            return api_response(201, "Job created successfully", serializer.data)
        else:
            return api_response(400, "Invalid data", serializer.errors)

    def put(self, request, slug):
        email = request.data["tenant_email"]
        user = User.objects.filter(email=email).values("id", "tenant_id", "tenant__name")
        user_id = user[0]["id"]
        tenant_id = user[0]["tenant_id"]
        tenant_name = user[0]["tenant__name"]
        try:
            job = Job.objects.get(slug=slug, tenant=tenant_id)
            serializer = RecruiterJobUpdateSerializer(job, request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(user_id=user_id, tenant_id=tenant_id, company_name=tenant_name)
                try:
                    job_id = job.id
                    skills = list(eval(request.data["skills"]))
                    update_skill(tenant_id, job_id, skills)
                except KeyError:
                    pass
                try:
                    encoded_data = serializer.data["description"]
                    serializer.data["description"] = encoded_data.encode().decode("utf-8")
                except KeyError:
                    pass
                return api_response(200, "Job updated successfully", serializer.data)
            else:
                return api_response(400, "Invalid data", {})
        except Job.DoesNotExist:
            return api_response(404, "Job doesn't exists", {})

    def get(self, request, slug):
        job = Job.objects.filter(slug=slug).values("user_id")
        user_id = job[0]["user_id"]
        user = User.objects.filter(id=user_id).values("id", "tenant_id", "tenant__name")
        tenant_id = user[0]["tenant_id"]
        # tenant = get_user_tenant(request)
        job_object = Job.objects.filter(slug=slug, tenant=tenant_id)
        if job_object:
            job_skill = JobSkill.objects.filter(job_id=job_object[0].id)
            context = {"job_object": job_object, "job_skill": job_skill}
            serializer = RecruiterGetJobSerializer(job_object, context=context, many=True)
            return api_response(200, "job retrived successfully", serializer.data)
        else:
            return api_response(404, "Job doesn't exists", {})


class AdminJobStatusView(APIView):
    def put(self, request, slug):
        """
        this method is to update only job status
        """

        # email = request.data["tenant_email"]
        # user = User.objects.filter(email=email).values("id", "tenant_id", "tenant__name")
        # tenant_id = user[0]["tenant_id"]
        try:
            job = Job.objects.get(slug=slug)
            serializer = JobStatusUpdateSerializer(job, request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return api_response(200, "Job updated successfully", serializer.data)
            else:
                return api_response(400, "Invalid Status", {})
        except Job.DoesNotExist:
            return api_response(404, "Job doesn't exists", {})
