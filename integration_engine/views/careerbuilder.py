import json
from rest_framework.views import APIView
from job.models.jobs import Job
from django.shortcuts import render
from core.helpers import cleanhtml, api_response
import pymongo
from core.models.tenant import Tenant
from geopy.geocoders import Nominatim
from decouple import UndefinedValueError, config
from rest_framework.response import Response

client = pymongo.MongoClient("mongodb://localhost:27017/")
# Database Name
db = client["dummydata"]
# Collection Name
col1 = db["careerbuilder"]


def careerbuilder(request):
    data = []
    joblist = Job.objects.filter(careerbuilder_jb=True, status="active").values()
    if joblist:
        for i in range(len(joblist)):
            data1 = {}
            data1["title"] = joblist[i]["title"]
            data1["description"] = cleanhtml(str(joblist[i]["description"]))
            data1["slug"] = joblist[i]["slug"]
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

            data1["address"] = data1["city"] + "," + data1["state"] + "," + data1["country"]

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

            data1["job_reference"] = joblist[i]["vms_job_reference"]
            data.append(data1)
    else:
        # data.append(data1)
        pass
    return render(request, "xml_feeds/careerbuilder.html", {"joblist": data}, content_type="application/xml")


class CareerBuilderView(APIView):
    def post(self, request):
        data = request.data
        response = json.dumps(data)
        careerbuilder = json.loads(response)
        x = col1.insert_one(careerbuilder)
        return api_response(Response.status_code, "Successfully", {})


class GetCareerBuilderView(APIView):
    def get(self, request):
        x = col1.find()
        data = []
        for doc in x:
            doc["_id"] = str(doc["_id"])
            data.append(doc)
        return api_response(Response.status_code, "ResumeData", data)