from rest_framework.views import APIView
from job.models.jobs import Job
from core.helpers import api_response, get_pagination
from core.models.tenant import Tenant
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from datetime import timedelta
from django.db.models import Q
from django.utils import timezone
from core.get_tenant import get_user_tenant
from job.models.job_applications import JobApplication
from job.models.job_bookmark import JobBookmark
from elasticsearch import Elasticsearch
from elasticsearch_dsl.connections import connections
from directsourcing.settings import url, elastic_username, elastic_password, elastic_index
from django.db.models import Case, When
import re
import datetime
from decouple import config
from rest_framework import serializers


connections.create_connection(hosts=[url], http_auth=(elastic_username, elastic_password))
es = Elasticsearch(hosts=[url], http_auth=(elastic_username, elastic_password))


class ElasticJobSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    process_status = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            "id",
            "title",
            "description",
            "short_description",
            "status",
            "company_name",
            "job_type",
            "is_bookmarked",
            "process_status",
            "slug",
            "display_name",
            "state",
            "country",
            "salary_min",
            "salary_max",
            "experience",
            "experience_min",
            "experience_max",
            "remote_location",
            "job_start_date",
            "job_publish_date",
            "job_end_date",
            "created_at",
            "updated_at",
        )

    def get_description(self, job_obj):
        return job_obj["description"]

    def get_short_description(self, job_obj):
        return job_obj["short_description"]

    def get_is_bookmarked(self, job_obj):
        user_id = self.context["request"].user.id
        try:
            bookmark_object = JobBookmark.objects.get(job_id=job_obj["id"], user_id=user_id)
            return bookmark_object.is_bookmarked
        except JobBookmark.DoesNotExist:
            return False

    def get_process_status(self, job_obj):
        request = self.context["request"]
        try:
            job = Job.objects.get(id=job_obj["id"])
        except Job.DoesNotExist:
            return None
        posted = timezone.now() - job.updated_at
        days = posted.days
        if days <= 3:
            return "New Job"
        elif JobApplication.objects.filter(job_id=job_obj["id"]).exclude(current_status="applied"):
            return "Actively Hiring"
        else:
            return None

    def get_job_type(self, job_obj):
        request = self.context["request"]
        try:
            job = Job.objects.get(id=job_obj["id"])
            jobtype = job.job_type
        except Job.DoesNotExist:
            jobtype = None
        if jobtype:
            return jobtype.name
        else:
            return None


def str_to_date(updated_at):
    match = re.search("\d{4}-\d{2}-\d{2}", updated_at)
    job_posted_date = datetime.datetime.strptime(match.group(), "%Y-%m-%d").date()
    delta = datetime.date.today() - job_posted_date
    return delta.days


def get_results(title, location, remote, job_type, salary, posted):
    status_q = {"match": {"status": "active"}}
    query_list = [status_q]
    filter_list = []
    title_q = {
        "multi_match": {
            "query": title,
            "fields": [
                "title",
                "company.name",
            ],
            "fuzziness": "AUTO",
        }
    }
    location_q = {
        "multi_match": {
            "query": location,
            "fields": ["display_name", "state", "country"],
            "fuzziness": "AUTO",
        }
    }

    if title:
        query_list.append(title_q)
    if location:
        query_list.append(location_q)
    if remote:
        filter_list.append({"term": {"remote_location": True}})
    query = {
        "size": 10000,
        "query": {"bool": {"must": query_list, "filter": filter_list}},
        "sort": [{"updated_at": {"order": "desc"}}],
    }
    # print("query", query)
    search_result = []
    res = es.search(index=elastic_index, body=query)
    # print("ressss", res["hits"]["total"]["value"])
    for document in res["hits"]["hits"]:
        search_result.append(document["_source"])
    if job_type:
        search_result = list(filter(lambda x: x["job_type"]["name"] == job_type, search_result))
    if posted:
        posted_result = []
        for job_posted in search_result:
            job_posted_days = str_to_date(job_posted["created_at"])
            if job_posted_days <= posted:
                posted_result.append(job_posted)
            else:
                pass
        search_result = posted_result
    if salary:
        salary_result = []
        for job_salary in search_result:
            if job_salary["salary_min"] and job_salary["salary_min"] >= salary:
                salary_result.append(job_salary)
            else:
                pass
        search_result = salary_result
    return search_result


class JobSearchView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, *args, **kwargs):
        if "query" in request.GET:
            title = request.GET["query"]
        else:
            title = None

        if "location" in request.GET:
            location = request.GET["location"]
        else:
            location = None

        if "remote" in request.GET and request.GET["remote"] == "true":
            remote = True
        else:
            remote = None

        if "type" in request.GET and request.GET["type"] != "all":
            job_type = request.GET["type"]
        else:
            job_type = None

        if "posted" in request.GET:
            posted = int(request.GET["posted"])
        else:
            posted = None

        if "range" in request.GET and request.GET["range"] != "any":
            salary = int(request.GET["range"])
        else:
            salary = 0

        results = get_results(title, location, remote, job_type, salary, posted)
        jobs = get_pagination(request, results, 12)
        if jobs:
            serializer = ElasticJobSerializer(jobs["data"], context={"request": request}, many=True)
            data = {
                "page_number": int(jobs["page_number"]),
                "page_count": jobs["page_count"],
                "total_count": len(results),
                "total_pages": jobs["total_pages"],
                "data": serializer.data,
            }
            return api_response(200, str(len(results)) + " Jobs found ", data)
        else:
            return api_response(400, "No search results found", {})
