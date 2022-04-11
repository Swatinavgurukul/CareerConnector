from job.models.jobs import Job
from django.shortcuts import render
from core.helpers import cleanhtml
from core.models.tenant import Tenant
from geopy.geocoders import Nominatim
from integration_engine.views.jb_helpers import getlinkedincategory, getlinkedindetail
from job.models.job_industry import Industry
from decouple import UndefinedValueError, config


def linkedin(request):
    data = []
    joblist = Job.objects.filter(linkedin=True, status="active").values()
    if joblist:
        for i in range(len(joblist)):
            data1 = {}
            data1["title"] = joblist[i]["title"]
            descrip = joblist[i]["description"].decode("utf-8")
            data1["description"] = cleanhtml(str(descrip))
            data1["master_location"] = joblist[i]["location_id"]
            data1["slug"] = joblist[i]["slug"]
            data1["id"] = joblist[i]["id"]
            data1["salary_max"] = joblist[i]["salary_max"]
            data1["salary_min"] = joblist[i]["salary_min"]
            data1["salary_frequency"] = joblist[i]["salary_frequency"]
            data1["benefits"] = joblist[i]["benefits"]
            category = joblist[i]["category_id"]
            data1["category_id"] = getlinkedincategory(category)
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

            master_industry = joblist[i]["industry_id"]
            industry = Industry.objects.filter(id=master_industry).values()
            if industry:
                for id in range(len(industry)):
                    data1["industry"] = industry[id]["name"]
                    data1["industry_id"] = getlinkedindetail(master_industry)
                    data.append(data1)
            else:
                data1["industry"] = ""
                data1["industry_id"] = ""
                data.append(data1)
    else:
        pass
        # data.append(data1)
    return render(request, "xml_feeds/linkedin.html", {"joblist": data}, content_type="application/xml")