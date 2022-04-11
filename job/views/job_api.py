from rest_framework.views import APIView
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
)
from job.serializers.job_serializers import (
    JobGetSerializer,
    JobCreateSerializer,
    JobUpdateSerializer,
    JobApplySerializer,
    BookMarkSerializer,
    JobAlertSerializer,
    AppliedJobsSerializer,
    JobAppliedSerializer,
    WithdrawApplicationSerializer,
    HiringTeamSerializer,
)
from job.models.jobs import Job
from job.models.job_alerts import JobAlert
from job.models.job_applications import JobApplication
from job.models.job_status import JobStatus
from core.helpers import api_response, get_pagination, compile_email
from core.models.tenant import Tenant
from core.models.users import User
from job.models.job_bookmark import JobBookmark
from django.http import QueryDict
from datetime import timedelta, datetime
import base64
from django.utils.datastructures import MultiValueDictKeyError
from job.views.permissions import IsOwnerOnly, IsUserOnly
from recruiter.utils import get_sov_score
from django.db.models import Max
from core.get_tenant import get_user_tenant
from job.models.job_skills import JobSkill
from recruiter.utils import get_real_sov_score
import random
from job.serializers.job_serializers import JobCreateNewSerializer

# from core.emails import job_alert_email


class JobCreateView(APIView):
    permission_classes = (IsAdminUser, IsOwnerOnly)

    def post(self, request):
        data = request.data
        if "source_job_id" in request.data.keys():
            source_job_id = request.data["source_job_id"]
            if Job.objects.filter(source_job_id=source_job_id, tenant=request.user.tenant_id).exists():
                job = Job.objects.get(source_job_id=source_job_id, tenant=request.user.tenant_id)
                if job.user_id == request.user.id:
                    if get_user_tenant(request).id == (job.tenant_id):
                        serializer = JobUpdateSerializer(job, data=request.data, partial=True)

                        if serializer.is_valid():
                            serializer.save(tenant_id=request.user.tenant.id, user=request.user)
                            data = {"url": "https://tufts.simplifycareers.com/jobs/" + serializer.data["slug"]}
                            data.update(serializer.data)
                            return api_response(200, "Job Updated successfully", data)
                        else:
                            return api_response(400, "Invalid data", serializer.errors)
                        return api_response(400, "Invalid data", serializer.errors)
                    else:
                        return api_response(
                            403,
                            "You do not have permission to perform this action.",
                            {},
                        )
                else:
                    return api_response(403, "You do not have permission to perform this action.", {})

            else:
                source_job_id = None
                serializer = JobCreateSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(tenant_id=request.user.tenant.id, user=request.user)
                    data = {"url": "https://tufts.simplifycareers.com/jobs/" + serializer.data["slug"]}
                    data.update(serializer.data)
                    return api_response(201, "Job Created successfully", data)
                return api_response(400, "Invalid data", serializer.errors)
        else:
            serializer = JobCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(tenant_id=request.user.tenant.id, user=request.user)
                data = {"url": "https://tufts.simplifycareers.com/jobs/" + serializer.data["slug"]}
                data.update(serializer.data)
                return api_response(201, "Job Created successfully", data)
            else:
                return api_response(400, "Invalid data", serializer.errors)
            return api_response(400, "Invalid Data", serializer.errors)


def get_job_object(request, slug):
    try:
        job_object = Job.objects.get(
            slug=slug,
        )
    except Job.DoesNotExist:
        job_object = None
    return job_object


def get_job_by_user(request, slug):
    try:
        job_object = Job.objects.get(slug=slug, user=request.user, tenant=get_user_tenant(request))
    except Job.DoesNotExist:
        job_object = None
    return job_object


class JobDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, slug):
        job = get_job_object(request, slug)
        if job:
            context = {"request": request}
            jobskills = JobSkill.objects.select_related("tenant", "job", "skill").filter(job_id=job.id)
            if jobskills:
                context.update({"jobskills": jobskills})
            serializer = JobGetSerializer(job, context=context)
            return api_response(200, "Job retrieved successfully", serializer.data)
        else:
            return api_response(404, "Job doesn't exists", {})

    # def put(self, request, slug):
    #     job = get_job_object(request, slug)
    #     tenant = get_user_tenant(request)
    #     if job:
    #         try:
    #             bookmark_obj = JobBookmark.objects.get(job_id=job.id, user_id=request.user.id, tenant=tenant)
    #             bookmark_obj.delete()
    #             return api_response(200, "UnBookmarked Successfully", {})
    #         except JobBookmark.DoesNotExist:
    #             bookmark_obj = JobBookmark.objects.create(
    #                 job_id=job.id,
    #                 user_id=request.user.id,
    #                 is_bookmarked=True,
    #                 tenant=tenant,
    #             )
    #             serializer = BookMarkSerializer(bookmark_obj)
    #             return api_response(201, "Bookmark Created Successfully", serializer.data)
    #     else:
    #         return api_response(404, "Page not found", {})


class JobBookmarkView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, slug):
        job = get_job_object(request, slug)
        tenant = get_user_tenant(request)
        if job:
            try:
                bookmark_obj = JobBookmark.objects.get(job_id=job.id, user_id=request.user.id, tenant=tenant)
                bookmark_obj.delete()
                return api_response(200, "UnBookmarked Successfully", {})
            except JobBookmark.DoesNotExist:
                bookmark_obj = JobBookmark.objects.create(
                    job_id=job.id,
                    user_id=request.user.id,
                    is_bookmarked=True,
                    tenant=tenant,
                )
                serializer = BookMarkSerializer(bookmark_obj, context={"request": request})
                return api_response(201, "Job Saved Successfully", serializer.data)
        else:
            return api_response(404, "Page not found", {})


class JobAppliedView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, slug):
        job = get_job_object(request, slug)
        if job:
            serializer = JobAppliedSerializer(job, context={"request": request})
            return api_response(200, "Job retrieved successfully", serializer.data)
        else:
            return api_response(404, "Job doesn't exists", {})


class JobCompanyView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, slug):
        comp_objects = None
        job = get_job_object(request, slug)
        if job is not None:
            company_id = job.company.id
            comp_objects = Job.objects.filter(company_id=company_id, tenant=get_user_tenant(request)).exclude(id=job.id)
        if comp_objects:
            serializer = JobGetSerializer(comp_objects, context={"request": request}, many=True)
            return api_response(200, "Job retrieved successfully", serializer.data)
        else:
            return api_response(404, "Job doesn't exists", {})


class JobUpdateView(APIView):
    permission_classes = (IsAdminUser, IsOwnerOnly)

    def put(self, request, slug):
        job = get_job_by_user(request, slug)
        if job:
            serializer = JobUpdateSerializer(job, request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, tenant_id=request.user.tenant.id)
                return api_response(200, "Job updated successfully", serializer.data)
        else:
            return api_response(404, "Job doesn't exists", {})


class JobDeleteView(APIView):
    permission_classes = (IsAdminUser, IsOwnerOnly)

    def delete(self, request, slug):
        job = get_job_object(request, slug)
        if job:
            if request.user.id == job.user.id:
                job.delete()
                return api_response(200, "Job deleted successfully", {})
            else:
                return api_response(401, "Unauthorized user", {})
        else:
            return api_response(404, "Job doesn't exists", {})


def get_job_apply(request, slug):
    try:
        job_object = Job.objects.filter(status="active").get(slug=slug)
    except Job.DoesNotExist:
        job_object = None
    return job_object


class JobApplyView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, slug):
        job = get_job_apply(request, slug)
        user = request.user
        body_unicode = request.data
        tenant = request.user.tenant.id
        if body_unicode:
            answer = body_unicode["answer"]
            resume_id = body_unicode.get("resume_id", None)
        else:
            answer = None
            resume_id = None

        if job:
            applied_job = JobApplication.objects.get_or_create(
                tenant=request.user.tenant,
                job_tenant=job.tenant.id,
                user=request.user,
                job=job,
                answer=answer,
                resume_id=resume_id,
            )[0]

            applied_job.sov_data = get_real_sov_score(tenant, user, job)
            applied_job.sov_score = applied_job.sov_data["rcs"]
            applied_job.weighted_score = applied_job.sov_data["ws"]
            applied_job.suggested_score = applied_job.sov_data["suggested_score"]
            applied_job.save()

            JobStatus.objects.create(
                user=request.user,
                job_tenant=job.tenant.id,
                tenant=request.user.tenant,
                job=job,
                application=applied_job,
            )
            # job_apply_email(request, applied_job.job, applied_job.user)
            serializer = JobApplySerializer(applied_job)
            lang = user.locale
            if lang == "esp":
                subject = "Su Postulación para " + applied_job.job.title + " en " + applied_job.job.tenant.name
            elif lang == "fr":
                subject = "Votre demande de " + applied_job.job.title + " à " + applied_job.job.tenant.name
            else:
                subject = "Your Application for " + applied_job.job.title + " at " + applied_job.job.tenant.name

            compile_email(
                "jobseeker.apply",
                request,
                request.user,
                data={
                    "email": request.user.email,
                    "title": applied_job.job.title,
                    "company": applied_job.job.tenant.name,
                    "subject": subject,
                },
            )

            return api_response(201, "Successfully applied for job", serializer.data)
        else:
            return api_response(404, "Job doesn't exists or Expired ", {})


class JobAlertView(APIView):
    def post(self, request, slug):
        job = get_job_object(request, slug)
        serializer = JobAlertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = request.data["email"]
        if request.user.is_anonymous:
            # job = register_user(request, email)
            try:
                JobAlert.objects.get(email=email, job=job)
                return api_response(200, "You have already subscribed for this Job!", {})
            except JobAlert.DoesNotExist:
                user = None
        else:
            user = request.user
        if job:
            if serializer.is_valid():
                serializer.save(tenant=get_user_tenant(request), email=email, job=job)
                # new_email2
                # job_alert_email(request, email, job)
                return api_response(
                    201, "Successfully subscribed for the job alerts similar to this job.", serializer.data
                )
            else:
                return api_response(400, "Invalid Data", serializer.errors)
        else:
            return api_response(404, "Job doesn't Exists", {})


class BookMarkListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        bookmarks = JobBookmark.objects.filter(user=request.user, is_bookmarked=True).order_by("-created_at")
        bookmarks_pagination = get_pagination(request, bookmarks, bookmarks.count())
        context = {"request": request}
        serializer = BookMarkSerializer(bookmarks_pagination["data"], context=context, many=True)
        data = {
            "page_number": int(bookmarks_pagination["page_number"]),
            "page_count": bookmarks_pagination["page_count"],
            "total_count": bookmarks.count(),
            "total_pages": bookmarks_pagination["total_pages"],
            "data": serializer.data,
        }
        return api_response(200, "Bookmarks List", data)


class JobAppliedListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        # tenant = get_user_tenant(request)
        applications = JobApplication.objects.filter(user_id=request.user.id)
        latest_created_dates = applications.values("user_id", "job_id").annotate(latest_created_at=Max("created_at"))
        applications = applications.filter(created_at__in=latest_created_dates.values("latest_created_at")).order_by(
            "-created_at"
        )
        applied_jobs_pagination = get_pagination(request, applications, len(applications))
        serializer = AppliedJobsSerializer(applied_jobs_pagination["data"], context={"request": request}, many=True)
        data = {
            "page_number": int(applied_jobs_pagination["page_number"]),
            "page_count": applied_jobs_pagination["page_count"],
            "total_count": applications.count(),
            "total_pages": applied_jobs_pagination["total_pages"],
            "data": serializer.data,
        }

        return api_response(200, "Applied Jobs List", data)


class CompareView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, id=None):

        applied_jobs = []
        try:
            job = Job.objects.get(id=id, user=request.user)
            job = JobStatus.objects.filter(job=job)

            if job:
                for users in job:
                    job = {}
                    job["job_id"] = users.job_id
                    job["title"] = users.job.title
                    job["user"] = users.user_id
                    job["username"] = users.user.username

                    applied_jobs.append(job)
                return api_response(200, " Records Found Successfully", applied_jobs)
            else:
                return api_response(400, "No Records Found", {})
        except Job.DoesNotExist:
            return api_response(404, "Job DoesNot Exist ", {})


class JobRejectionView(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request):
        # source_job_id = request.data["source_job_id"]
        serializer = JobRejectionSerializer(data=request.data)
        # job = Job.objects.get(source_job_id=source_job_id)
        if serializer.is_valid():
            serializer.save(tenant=get_user_tenant(request))
            return api_response(201, "Job Rejection Successfull Created ", serializer.data)
        else:
            return api_response(400, "Invalid data", serializer.errors)


class SimilarJobsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, job_id=None):
        remaining_jobs = Job.objects.all().exclude(id=job_id)
        if remaining_jobs.count() < 5:
            random_jobs = random.sample(list(remaining_jobs), remaining_jobs.count())
        else:
            random_jobs = random.sample(list(remaining_jobs), 5)
        context = {"request": request}
        serializer = JobGetSerializer(random_jobs, context=context, many=True)
        return api_response(200, "Similar jobs retrieved successfully", serializer.data)


class JobCreateURLView(APIView):
    permission_classes = (IsAdminUser, IsOwnerOnly)

    def post(self, request):
        data = request.data
        serializer = JobCreateNewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(
                tenant=request.user.tenant,
                user=request.user,
                status="draft",
                # interview_questions=[
                #     {
                #         "id": "legally_authorized",
                #         "type": "select",
                #         "question": "Are you legally authorized to work in the country of job location?",
                #         "options": [{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}],
                #     },
                #     {
                #         "id": "visa_sponsorship",
                #         "type": "select",
                #         "question": "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?",
                #         "options": [{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}],
                #     },
                # ],
            )
            return api_response(201, "Job Created Successfully.", serializer.data)
        return api_response(400, "Invalid data.", serializer.errors)


class WithdrawJobApplicationView(APIView):

    """
    User withdraws job application
    """

    permission_classes = (IsAuthenticated,)

    def put(self, request, job_slug):
        try:
            application_obj = JobApplication.objects.get(job__slug=job_slug, user_id=request.user.id)
        except JobApplication.DoesNotExist:
            return api_response(404, "Application not found.", {})
        serializer = WithdrawApplicationSerializer(application_obj, request.data)
        if serializer.is_valid():
            application = serializer.save()
            JobStatus.objects.create(
                tenant=application.tenant,
                user=application.user,
                job=application.job,
                application=application,
                status=application.current_status,
                job_tenant=application.job_tenant,
            )
            return api_response(200, "Application withdrawn succesfully.", serializer.data)
        else:
            return api_response(400, "Invalid data", serializer.errors)


class HiringTeamView(APIView):
    """
    API to get hiring members and hiring admin list.
    This API we are using in job creation to get list of all hiring members and hiring manager in Hiring manager dropdown.
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        tenant = get_user_tenant(request)
        users = User.objects.filter(tenant=tenant, role_id__in=[1, 4], is_active=True)
        serializer_data = HiringTeamSerializer(users, many=True)
        return api_response(200, "hiring members retrieved successfully", serializer_data.data)


# class ReApplyJobView(APIView):

#     """
#     useful for reapplying the job after the application withdrawal
#     """

#     permission_classes = (IsAuthenticated,)

#     def put(self, request, slug):
#         job = get_job_apply(request, slug)
#         if job:
#             try:
#                 application = JobApplication.objects.get(
#                     tenant=request.user.tenant,
#                     user=request.user,
#                     job=job,
#                 )
#             except JobApplication.DoesNotExist:
#                 return api_response(404, "Not found", {})
#             application.current_status = "applied"
#             application.save()
#             JobStatus.objects.create(
#                 user=request.user,
#                 job_tenant=application.tenant,
#                 tenant=request.user.tenant,
#                 job=job,
#                 application=application,
#                 status=application.current_status,
#             )
#             return api_response(200, "Successfully applied for job.", {})
#         return api_response(404, "Job doesn't exist or expired", {})


class RecommendedJobsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        """
        recommended jobs and excluding archived jobs for user
        """
        tenant = get_user_tenant(request)
        archived_jobs = JobBookmark.objects.filter(user_id=request.user.id, tenant=tenant, is_archived=True)
        job_ids = [archived.job.id for archived in archived_jobs]
        recommended_jobs = Job.objects.filter(status="active", user__is_ca=request.user.is_ca).exclude(id__in=job_ids)
        context = {"request": request}
        serializer = JobGetSerializer(recommended_jobs, context=context, many=True)
        return api_response(200, "recommended jobs retrieved successfully", serializer.data)

    def post(self, request, *args, **kwargs):
        """
        archived jobs for user
        """
        job = get_job_object(request, kwargs["slug"])
        tenant = get_user_tenant(request)
        if job:
            try:
                archived_obj = JobBookmark.objects.get(job_id=job.id, user_id=request.user.id, tenant=tenant)
                archived_obj.is_bookmarked = False
                archived_obj.is_archived = True
                archived_obj.save()
                return api_response(201, "archived job successfully", {})
            except JobBookmark.DoesNotExist:
                archived_obj = JobBookmark.objects.create(
                    job_id=job.id, user_id=request.user.id, tenant=tenant, is_bookmarked=False, is_archived=True
                )
                return api_response(201, "archived job successfully", {})
        else:
            return api_response(404, "page not found", {})
