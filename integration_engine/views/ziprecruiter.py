from job.models.jobs import Job
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from core.helpers import api_response, cleanhtml
import pymongo
import json
from core.models.tenant import Tenant
from geopy.geocoders import Nominatim
from job.models.job_category import Category
from decouple import UndefinedValueError, config

client = pymongo.MongoClient("mongodb://localhost:27017/")
# Database Name
db = client["dummydata"]
# Collection Name
col = db["ziprecruiter"]


def ziprecruiter(request):
    data = []
    joblist = Job.objects.filter(zip_recruiter=True, status="active").values()
    if joblist:
        for i in range(len(joblist)):
            data1 = {}
            data1["job_reference"] = joblist[i]["vms_job_reference"]
            data1["title"] = joblist[i]["title"]
            data1["description"] = cleanhtml(str(joblist[i]["description"]))
            data1["slug"] = joblist[i]["slug"]
            # data1["salary_max"] = joblist[i]["salary_max"]
            # data1["salary_min"] = joblist[i]["salary_min"]
            # data1["salary_frequency"] = joblist[i]["salary_frequency"]
            data1["benefits"] = joblist[i]["benefits"]
            # question = joblist[i]["interview_questions"]
            # ques = cleanhtml(str(question))
            # data1["interview_json"] = ques
            # data1["contact_email"] = joblist[i]["contact_email"]
            # data1["address"] = joblist[i]["address"]
            datetime = joblist[i]["created_at"].isoformat()
            data1["created_at"] = datetime[:-6]
            if joblist[i]["salary_min"] is None or joblist[i]["salary_min"] == "":
                data1["salary_min"] = 0.00
            else:
                data1["salary_min"] = joblist[i]["salary_min"]

            if joblist[i]["salary_max"] is None or joblist[i]["salary_max"] == "":
                data1["salary_max"] = 0.00
            else:
                data1["salary_max"] = joblist[i]["salary_max"]

            if joblist[i]["currency"] is None or joblist[i]["currency"] == "":
                data1["currency"] = "USD"
            else:
                data1["currency"] = joblist[i]["currency"]

            if joblist[i]["display_name"] is None or joblist[i]["display_name"] == "":
                data1["city"] = ""
            else:
                data1["city"] = joblist[i]["display_name"]

            if joblist[i]["state"] is None or joblist[i]["state"] == "":
                data1["state"] = ""
            else:
                data1["state"] = joblist[i]["state"]

            if joblist[i]["country"] is None or joblist[i]["country"] == "":
                data1["country"] = ""
            else:
                data1["country"] = joblist[i]["country"]

            if (
                joblist[i]["latitude"] == None
                or joblist[i]["latitude"] == ""
                and joblist[i]["longitude"] is None
                or joblist[i]["longitude"] == ""
            ):
                data1["postal_code"] = ""
            else:
                geolocator = Nominatim(user_agent="geoapiExercises")
                location = geolocator.geocode(joblist[i]["latitude"] + "," + joblist[i]["longitude"])
                postal_code = location.raw["display_name"].split(",")[-2]
                data1["postal_code"] = postal_code
            master_category = joblist[i]["category_id"]
            category = Category.objects.filter(id=master_category).values()
            if category:
                for k in range(len(category)):
                    data1["category_name"] = category[k]["name"]
            else:
                data1["category_name"] = ""

            domain = joblist[i]["tenant_id"]

            domain_name = Tenant.objects.filter(id=domain).values()
            if domain_name:
                for x in range(len(domain_name)):
                    try:
                        data1["domain"] = config("HOST_URL")
                    except UndefinedValueError:
                        data1["domain"] = None
                    data1["company_name"] = domain_name[x]["name"]
            else:
                data1["domain"] = ""
                data1["company_name"] = ""

            data.append(data1)

    else:
        # data.append(data1)
        pass
    return render(request, "xml_feeds/ziprecruiter.html", {"joblist": data}, content_type="application/xml")


class ZipRecruiterView(APIView):
    """ZipRecruiter Api"""

    def post(self, request):
        data = request.data
        response = json.dumps(data)
        ziprecruiter = json.loads(response)
        x = col.insert_one(ziprecruiter)
        # print(x)
        return api_response(Response.status_code, "Successfully", {})


class GetZipRecruiterView(APIView):
    def get(self, request):
        x = col.find()
        data = []
        for doc in x:
            doc["_id"] = str(doc["_id"])
            data.append(doc)
        return api_response(Response.status_code, "ResumeData", data)