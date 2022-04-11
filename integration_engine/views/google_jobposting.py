from job.models.jobs import Job
from rest_framework.views import APIView
from core.helpers import api_response, cleanhtml
import pymongo
from core.models.tenant import Tenant
from geopy.geocoders import Nominatim
from job.models.job_category import Category
from job.models.job_type import JobType
from decouple import UndefinedValueError, config
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.http import HttpResponse
from django.template.loader import render_to_string

client = pymongo.MongoClient("mongodb://localhost:27017/")
# Database Name
db = client["dummydata"]
# Collection Name
col = db["google"]


class Google_JobPosting(APIView):
    def get(self, request):
        data = []
        joblist = Job.objects.filter(zip_recruiter=True, status="active").values()
        if joblist:
            for i in range(len(joblist)):
                data1 = {}
                if joblist[i]["vms_job_reference"] is None or joblist[i]["vms_job_reference"] == "":
                    data1["identifier_value"] = ""
                else:
                    data1["identifier_value"] = joblist[i]["vms_job_reference"]
                data1["title"] = joblist[i]["title"]
                data1["description"] = cleanhtml(str(joblist[i]["description"]))
                data1["slug"] = joblist[i]["slug"]
                master_jobtype = joblist[i]["job_type_id"]
                jobtype = JobType.objects.filter(id=master_jobtype).values()
                if jobtype:
                    for k in range(len(jobtype)):
                        data1["employment_type"] = jobtype[k]["name"]
                else:
                    data1["employment_type"] = ""
                expires_in = joblist[i]["expires_in"]
                if joblist[i]["job_publish_date"] is None or joblist[i]["job_publish_date"] == "":
                    data1["date_posted"] = ""
                    data1["valid_through"] = ""
                else:
                    data1["date_posted"] = joblist[i]["job_publish_date"].isoformat()
                    valid_through = joblist[i]["job_publish_date"] + timedelta(expires_in)
                    data1["valid_through"] = valid_through.isoformat()
                if joblist[i]["salary_min"] is None or joblist[i]["salary_min"] == "":
                    data1["minValue"] = 0.00
                else:
                    data1["minValue"] = joblist[i]["salary_min"]

                if joblist[i]["salary_max"] is None or joblist[i]["salary_max"] == "":
                    data1["maxValue"] = 0.00
                else:
                    data1["maxValue"] = joblist[i]["salary_max"]

                if joblist[i]["currency"] is None or joblist[i]["currency"] == "":
                    data1["currency"] = "USD"
                else:
                    data1["currency"] = joblist[i]["currency"]

                if joblist[i]["salary_frequency"] is None or joblist[i]["salary_frequency"] == "":
                    data1["unitText"] = ""
                else:
                    data1["unitText"] = joblist[i]["salary_frequency"]

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
                            data1["domain"] = ""
                        data1["company_name"] = domain_name[x]["name"]
                        data1["logo_url"] = domain_name[x]["logo_url"]
                else:
                    data1["domain"] = ""
                    data1["company_name"] = ""
                    data1["logo_url"] = ""

                data.append(data1)

        else:
            # data.append(data1)
            pass
        return api_response(200, "Google job Posting", data)


def JobPosting_JSONLD(request):
    html = render_to_string("xml_feeds/google_jobposting.html")
    return HttpResponse(html, content_type="application/json")
