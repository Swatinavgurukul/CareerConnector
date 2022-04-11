from rest_framework.views import APIView
from job.serializers.job_serializers import JobGetSerializer
from job.models.jobs import Job
from core.helpers import api_response, get_pagination
from core.models.tenant import Tenant
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from job.utils.search_query import get_results
from datetime import timedelta
from django.db.models import Q
from django.utils import timezone
from core.get_tenant import get_user_tenant

# from job.views.similar_title import similar_titles


class JobSearchView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, *args, **kwargs):
        tenant_obj = get_user_tenant(request)
        size = Job.objects.filter().count()
        if request.method == "GET" and "query" in request.GET:
            title = request.GET["query"]
            # obj = similar_titles(title)
            # title = " ".join(obj)
        else:
            title = None

        if request.method == "GET" and "location" in request.GET:
            location = request.GET["location"]
            state = request.GET["state"]

        else:
            location = None
            state = None

        if request.method == "GET" and "easy_apply" in request.GET and request.GET["easy_apply"] == "true":
            easy_apply = True
        else:
            easy_apply = None

        if request.method == "GET" and "remote" in request.GET and request.GET["remote"] == "true":
            remote = True
        else:
            remote = None

        if request.method == "GET" and "type" in request.GET and request.GET["type"] != "all":
            job_type = request.GET["type"]
        else:
            job_type = None

        if request.method == "GET" and "posted" in request.GET:
            posted = int(request.GET["posted"])
        else:
            posted = None

        if request.method == "GET" and "range" in request.GET and request.GET["range"] != "any":
            salary = int(request.GET["range"])
        else:
            salary = 0
        ep_country = request.GET.get("ca", None)
        if ep_country in ["true", 1, "1"]:
            ep_country = True
        else:
            ep_country = False
        results = get_results(
            tenant_obj, size, title, location, state, easy_apply, remote, job_type, salary, posted, ep_country
        )

        # filtered = results.filter(
        #     Q(easy_apply__in=easy_apply)
        #     & Q(remote_location__in=remote)
        #     & Q(job_type__in=job_type)
        #     & Q(updated_at__gte=old_dt)
        #     & Q(salary_min__gte=salary)
        # ).order_by("-updated_at")

        jobs = get_pagination(request, results, 12)
        if jobs:
            serializer = JobGetSerializer(jobs["data"], context={"request": request}, many=True)
            data = {
                "page_number": int(jobs["page_number"]),
                "page_count": jobs["page_count"],
                "total_count": results.count(),
                "total_pages": jobs["total_pages"],
                "data": serializer.data,
            }
            return api_response(200, str(results.count()) + " Jobs found ", data)
        else:
            return api_response(400, "No search results found", {})
