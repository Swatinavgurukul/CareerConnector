from job.models.jobs import Job
from elasticsearch import Elasticsearch
from elasticsearch_dsl.connections import connections
from directsourcing.settings import url, elastic_username, elastic_password
from django.db.models import Case, When
import re
import datetime
from decouple import config

connections.create_connection(hosts=[url], http_auth=(elastic_username, elastic_password))
es = Elasticsearch(hosts=[url], http_auth=(elastic_username, elastic_password))


def diff_date(old_date):
    match = re.search("\d{4}-\d{2}-\d{2}", old_date)
    datex = datetime.datetime.strptime(match.group(), "%Y-%m-%d").date()
    delta = datetime.date.today() - datex
    return delta.days


def get_filter(res, filterlist, jobtype=None, days=None, salary=None):
    easyApplylist = []
    remoteLocationList = []
    postedList = []
    jobTypeList = []
    salaryList = []
    allIds = []
    for i in range(0, len(res["hits"]["hits"])):
        if len(filterlist) == 0:
            id = res["hits"]["hits"][i]["_source"]["id"]
            allIds.append(id)

        if "easy_apply" in filterlist:
            if res["hits"]["hits"][i]["_source"]["easy_apply"] is True:
                id = res["hits"]["hits"][i]["_source"]["id"]
                easyApplylist.append(id)
        if "remote_location" in filterlist:
            if res["hits"]["hits"][i]["_source"]["remote_location"] is True:
                id = res["hits"]["hits"][i]["_source"]["id"]
                remoteLocationList.append(id)
        if "posted" in filterlist:
            date2 = res["hits"]["hits"][i]["_source"]["created_at"]
            q = diff_date(date2)
            if q < days:
                id = res["hits"]["hits"][i]["_source"]["id"]
                postedList.append(id)
        if "type" in filterlist:
            typ = res["hits"]["hits"][i]["_source"]["job_type"]["name"]
            typ = typ.lower()
            jobtype = jobtype.lower()
            if typ == jobtype:
                id = res["hits"]["hits"][i]["_source"]["id"]
                jobTypeList.append(id)
        if "range" in filterlist:
            salary_min = res["hits"]["hits"][i]["_source"]["salary_min"]
            if salary_min is None:
                salary_min = 0
            if salary_min > salary:
                id = res["hits"]["hits"][i]["_source"]["id"]
                salaryList.append(id)

    # print("easy type=>", easyApplylist)
    # print("remote location=>", remoteLocationList)
    # print("posted list=>", postedList)
    # print("job type=>", jobTypeList)
    # print("Salary=>", salaryList)
    # print("Filters=>",filterlist)

    if len(filterlist) == 0:
        return allIds
    valuedList = []
    if len(easyApplylist) > 0 or "easy_apply" in filterlist:
        valuedList.append(easyApplylist)
    if len(remoteLocationList) > 0 or "remote_location" in filterlist:
        valuedList.append(remoteLocationList)
    if len(postedList) > 0 or "posted" in filterlist:
        valuedList.append(postedList)
    if len(jobTypeList) > 0 or "type" in filterlist:
        valuedList.append(jobTypeList)
    if len(salaryList) > 0 or "range" in filterlist:
        valuedList.append(salaryList)
    commonIds = []
    ids = set(commonIds)
    for itemCount in range(0, len(valuedList)):
        if len(valuedList[itemCount]) == 0:
            return []
        if len(commonIds) > 0:
            commonIds = list(set(ids) & set(valuedList[itemCount]))
            ids = set(commonIds)
        else:
            commonIds = valuedList[itemCount]
            ids = set(commonIds)
    return commonIds


from django.db.models import Q


def get_results(tenant_obj, size, title, location, state, easy_apply, remote, job_type, salary, posted, ep_country):
    job_ids = []
    # tenant_q = {"match": {"tenant.id": tenant_obj.id}}
    query_list = []
    title_q = {
        "multi_match": {
            "query": title,
            "fields": [
                "title",
                "title_esp",
                "title_fr",
                "tenant.name",
                "company.name",
            ],
            "fuzziness": "AUTO",
        }
    }
    # location_q = {
    #     "multi_match": {
    #         "query": location,
    #         "fields": [
    #             "display_name",
    #             # "location.state",
    #             # "location.country",
    #             # "location.postal_code",
    #             # "location.country_code",
    #         ],
    #         "fuzziness": "AUTO",
    #     }
    # }

    if title:
        query_list.append(title_q)

    query = {"size": size, "query": {"bool": {"must": query_list}}}
    res = es.search(index=config("ELASTIC_INDEX"), body=query)
    filterList = []

    if easy_apply or remote or job_type or salary or posted:
        if easy_apply is True:
            filterList.append("easy_apply")
        # if remote is True:
        #     filterList.append("remote_location")
        if job_type:
            filterList.append("type")
        if salary:
            filterList.append("range")
        if posted:
            filterList.append("posted")

    job_ids = get_filter(res, filterList, job_type, posted, salary)

    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(job_ids)])
    if location and remote:
        objects = Job.objects.filter(pk__in=job_ids, remote_location=True).order_by(preserved)
    elif location:
        objects = Job.objects.filter(
            Q(display_name=location, state=state) | Q(remote_location=True), pk__in=job_ids
        ).order_by(preserved)
    elif remote:
        objects = Job.objects.filter(pk__in=job_ids, remote_location=True).order_by(preserved)
    else:
        objects = Job.objects.filter(pk__in=job_ids).order_by(preserved)
    return objects.filter(status="active", user__is_ca=ep_country).order_by("-updated_at")


# def job_posted(res, days):
#     li = []
#     for i in range(0, len(res["hits"]["hits"])):
#         date2 = res["hits"]["hits"][i]["_source"]["created_at"]
#         q = diff_date(date2)
#         if q < days:
#             id = res["hits"]["hits"][i]["_source"]["id"]
#             li.append(id)
#     return li


# def easyapply(res):
#     li = []
#     for i in range(0, len(res["hits"]["hits"])):
#         if res["hits"]["hits"][i]["_source"]["easy_apply"] is True:
#             id = res["hits"]["hits"][i]["_source"]["id"]
#             li.append(id)
#     return li


# def remote_jobs(res):
#     li = []
#     for i in range(0, len(res["hits"]["hits"])):
#         if res["hits"]["hits"][i]["_source"]["remote_location"] is True:
#             id = res["hits"]["hits"][i]["_source"]["id"]
#             li.append(id)
#     return li


# def job_typ(res, ty):
#     li = []
#     for i in range(0, len(res["hits"]["hits"])):
#         typ = res["hits"]["hits"][i]["_source"]["job_type"]
#         if typ == ty:
#             id = res["hits"]["hits"][i]["_source"]["id"]
#             li.append(id)
#     return li


# def job_range(res, salary):
#     li = []
#     for i in range(0, len(res["hits"]["hits"])):
#         salary_min = res["hits"]["hits"][i]["_source"]["salary_min"]
#         if salary_min is None:
#             salary_min = 0
#         if salary_min > salary:
#             id = res["hits"]["hits"][i]["_source"]["id"]
#             li.append(id)
#     return li
