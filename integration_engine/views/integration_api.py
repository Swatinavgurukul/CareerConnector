# from job.models.jobs import Job
# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from core.helpers import api_response, cleanhtml

# from core.models.location import Location
# from job.models.job_industry import Industry
# from job.models.job_category import Category
# from job.models.job_company import JobCompany
# import pymongo
# import json
# from core.models.tenant import Tenant
# from job.models.job_type import JobType
# from geopy.geocoders import Nominatim


# client = pymongo.MongoClient("mongodb://localhost:27017/")
# # Database Name
# db = client["dummydata"]
# # Collection Name
# col = db["ziprecruiter"]
# # Collection Name
# col1 = db["careerjet"]


class IntegrationEngineView(APIView):
    """IntegrationEngineList Api"""

    def get(self, request):
        data = {
            "linkedIn": "LinkedIn",
            "ziprecruiter": "ZipRecruiter",
            "broadbean": "BroadBean",
            "googleforjobs": "GoogleForJobs",
        }

        return api_response(Response.status_code, "All IntegrationEngineList", data)


# def getlinkedindetail(id):
#     my_dict = {
#         1: 47,
#         2: 94,
#         3: 120,
#         4: 125,
#         5: 127,
#         6: 19,
#         7: 50,
#         8: 111,
#         9: 53,
#         10: 52,
#         11: 41,
#         12: 12,
#         13: 36,
#         14: 49,
#         15: 138,
#         16: 129,
#         17: 54,
#         18: 90,
#         19: 51,
#         20: 128,
#         21: 118,
#         22: 109,
#         23: 3,
#         24: 5,
#         25: 4,
#         26: 48,
#         27: 24,
#         28: 25,
#         29: 91,
#         30: 18,
#         31: 65,
#         32: 1,
#         33: 99,
#         34: 69,
#         35: 132,
#         36: 112,
#         37: 28,
#         38: 86,
#         39: 110,
#         40: 76,
#         41: 122,
#         42: 63,
#         43: 43,
#         44: 38,
#         45: 66,
#         46: 34,
#         47: 23,
#         48: 101,
#         49: 26,
#         50: 29,
#         51: 145,
#         52: 75,
#         53: 148,
#         54: 140,
#         55: 124,
#         56: 68,
#         57: 14,
#         58: 31,
#         59: 137,
#         60: 134,
#         61: 88,
#         62: 147,
#         63: 84,
#         64: 96,
#         65: 42,
#         66: 74,
#         67: 141,
#         68: 6,
#         69: 45,
#         70: 46,
#         71: 73,
#         72: 77,
#         73: 9,
#         74: 10,
#         75: 72,
#         76: 30,
#         77: 85,
#         78: 116,
#         79: 143,
#         80: 55,
#         81: 11,
#         82: 95,
#         83: 97,
#         84: 80,
#         85: 135,
#         86: 126,
#         87: 17,
#         88: 13,
#         89: 139,
#         90: 71,
#         91: 56,
#         93: 35,
#         94: 37,
#         95: 115,
#         96: 114,
#         97: 81,
#         98: 100,
#         99: 57,
#         100: 113,
#         101: 123,
#         102: 87,
#         103: 146,
#         104: 61,
#         105: 39,
#         106: 15,
#         107: 131,
#         108: 136,
#         109: 117,
#         110: 107,
#         111: 67,
#         112: 83,
#         113: 105,
#         114: 102,
#         115: 79,
#         116: 98,
#         117: 78,
#         118: 82,
#         119: 62,
#         120: 64,
#         121: 44,
#         122: 40,
#         123: 89,
#         124: 144,
#         125: 70,
#         126: 32,
#         127: 27,
#         128: 121,
#         129: 7,
#         130: 58,
#         131: 20,
#         132: 33,
#         133: 104,
#         134: 22,
#         135: 8,
#         136: 60,
#         137: 130,
#         138: 21,
#         139: 108,
#         140: 92,
#         141: 59,
#         142: 106,
#         143: 16,
#         144: 93,
#         145: 133,
#         146: 142,
#         147: 119,
#         148: 103,
#     }
#     return my_dict.get(id)


# def getlinkedincategory(id):
#     category = {
#         1: "othr",
#         2: "acct",
#         3: "adm",
#         4: "art",
#         5: "bd",
#         7: "cnsl",
#         8: "edu",
#         9: "eng",
#         11: "fin",
#         13: "hr",
#         14: "it",
#         15: "lgl",
#         16: "mrkt",
#         20: "prdm",
#         21: "prdm",
#         22: "prch",
#         23: "qa",
#         25: "rsch",
#         26: "sale",
#     }
#     return category.get(id)


# def broadbean(request):
#     data = []
#     joblist = Job.objects.filter(job_board__broadbean=1, status="active").values()
#     if joblist:
#         for i in range(len(joblist)):
#             data1 = {}
#             data1["job_internal_reference"] = joblist[i]["vms_job_internal_reference"]
#             data1["job_reference"] = joblist[i]["vms_job_reference"]
#             data1["title"] = joblist[i]["title"]
#             data1["description"] = cleanhtml(str(joblist[i]["description"]))
#             data1["id"] = joblist[i]["id"]
#             data1["slug"] = joblist[i]["slug"]
#             data1["salary_max"] = joblist[i]["salary_max"]
#             data1["salary_min"] = joblist[i]["salary_min"]
#             data1["salary_frequency"] = joblist[i]["salary_frequency"]
#             data1["benefits"] = joblist[i]["benefits"]
#             data1["contact_email"] = joblist[i]["contact_email"]
#             data1["contact_name"] = joblist[i]["contact_name"]
#             datetime = joblist[i]["created_at"].isoformat()
#             data1["created_at"] = datetime[:-6]
#             data1["salary_min"] = joblist[i]["salary_min"]
#             data1["salary_max"] = joblist[i]["salary_max"]
#             data1["currency"] = joblist[i]["currency"]
#             job_type_id = joblist[i]["job_type_id"]
#             job_type_detail = JobType.objects.filter(id=job_type_id).values()
#             if job_type_detail:
#                 for k in range(len(job_type_detail)):
#                     data1["job_type"] = job_type_detail[k]["name"]
#             else:
#                 data1["job_type"] = ""
#             if joblist[i]["display_name"] is None or joblist[i]["display_name"] == "":
#                 data1["city"] = ""
#             else:
#                 data1["city"] = joblist[i]["display_name"]

#             if joblist[i]["state"] is None or joblist[i]["state"] == "":
#                 data1["state"] = ""
#             else:
#                 data1["state"] = joblist[i]["state"]

#             if joblist[i]["country"] is None or joblist[i]["country"] == "":
#                 data1["country"] = ""
#             else:
#                 data1["country"] = joblist[i]["country"]

#             if (
#                 joblist[i]["latitude"] == None
#                 or joblist[i]["latitude"] == ""
#                 and joblist[i]["longitude"] is None
#                 or joblist[i]["longitude"] == ""
#             ):
#                 data1["postal_code"] = ""
#             else:
#                 geolocator = Nominatim(user_agent="geoapiExercises")
#                 location = geolocator.geocode(joblist[i]["latitude"] + "," + joblist[i]["longitude"])
#                 postal_code = location.raw["display_name"].split(",")[-2]
#                 data1["postal_code"] = postal_code

#             master_category = joblist[i]["category_id"]
#             category = Category.objects.filter(id=master_category).values()
#             if category:
#                 for k in range(len(category)):
#                     data1["category_name"] = category[k]["name"]
#             else:
#                 data1["category_name"] = ""

#             domain = joblist[i]["tenant_id"]

#             domain_name = Tenant.objects.filter(id=domain).values()
#             if domain_name:
#                 for x in range(len(domain_name)):
#                     data1["domain"] = domain_name[x]["base_url"]
#                     data1["company_name"] = domain_name[x]["name"]
#             else:
#                 data1["domain"] = ""
#                 data1["company_name"] = ""
#             data.append(data1)

#     else:
#         pass
#         # data.append(data1)
#     return render(request, "xml_feeds/broadbean.html", {"joblist": data}, content_type="application/xml")


# def linkedin(request):
#     data = []
#     joblist = Job.objects.filter(job_board__linkedin=1, status="active").values()
#     if joblist:
#         for i in range(len(joblist)):
#             data1 = {}
#             data1["title"] = joblist[i]["title"]
#             descrip = joblist[i]["description"].decode("utf-8")
#             data1["description"] = cleanhtml(str(descrip))
#             data1["master_location"] = joblist[i]["location_id"]
#             data1["slug"] = joblist[i]["slug"]
#             data1["id"] = joblist[i]["id"]
#             data1["salary_max"] = joblist[i]["salary_max"]
#             data1["salary_min"] = joblist[i]["salary_min"]
#             data1["salary_frequency"] = joblist[i]["salary_frequency"]
#             data1["benefits"] = joblist[i]["benefits"]
#             category = joblist[i]["category_id"]
#             data1["category_id"] = getlinkedincategory(category)
#             domain = joblist[i]["tenant_id"]

#             domain_name = Tenant.objects.filter(id=domain).values()
#             if domain_name:
#                 for x in range(len(domain_name)):
#                     data1["domain"] = domain_name[x]["base_url"]
#                     data1["company_name"] = domain_name[x]["name"]
#             else:
#                 data1["domain"] = ""
#                 data1["company_name"] = ""

#             if joblist[i]["display_name"] is None or joblist[i]["display_name"] == "":
#                 data1["city"] = ""
#             else:
#                 data1["city"] = joblist[i]["display_name"]

#             if joblist[i]["state"] is None or joblist[i]["state"] == "":
#                 data1["state"] = ""
#             else:
#                 data1["state"] = joblist[i]["state"]

#             if joblist[i]["country"] is None or joblist[i]["country"] == "":
#                 data1["country"] = ""
#             else:
#                 data1["country"] = joblist[i]["country"]

#             if (
#                 joblist[i]["latitude"] == None
#                 or joblist[i]["latitude"] == ""
#                 and joblist[i]["longitude"] is None
#                 or joblist[i]["longitude"] == ""
#             ):
#                 data1["postal_code"] = ""
#             else:
#                 geolocator = Nominatim(user_agent="geoapiExercises")
#                 location = geolocator.geocode(joblist[i]["latitude"] + "," + joblist[i]["longitude"])
#                 postal_code = location.raw["display_name"].split(",")[-2]
#                 data1["postal_code"] = postal_code

#             master_industry = joblist[i]["industry_id"]
#             industry = Industry.objects.filter(id=master_industry).values()
#             if industry:
#                 for id in range(len(industry)):
#                     data1["industry"] = industry[id]["name"]
#                     data1["industry_id"] = getlinkedindetail(master_industry)
#                     data.append(data1)
#             else:
#                 data1["industry"] = ""
#                 data1["industry_id"] = ""
#                 data.append(data1)
#     else:
#         pass
#         # data.append(data1)
#     return render(request, "xml_feeds/linkedin.html", {"joblist": data}, content_type="application/xml")


# def ziprecruiter(request):
#     data = []
#     joblist = Job.objects.filter(job_board__zip_recruiter=1, status="active").values()
#     if joblist:
#         for i in range(len(joblist)):
#             data1 = {}
#             data1["job_reference"] = joblist[i]["vms_job_reference"]
#             data1["title"] = joblist[i]["title"]
#             data1["description"] = cleanhtml(str(joblist[i]["description"]))
#             data1["slug"] = joblist[i]["slug"]
#             # data1["salary_max"] = joblist[i]["salary_max"]
#             # data1["salary_min"] = joblist[i]["salary_min"]
#             # data1["salary_frequency"] = joblist[i]["salary_frequency"]
#             data1["benefits"] = joblist[i]["benefits"]
#             # question = joblist[i]["interview_questions"]
#             # ques = cleanhtml(str(question))
#             # data1["interview_json"] = ques
#             # data1["contact_email"] = joblist[i]["contact_email"]
#             # data1["address"] = joblist[i]["address"]
#             datetime = joblist[i]["created_at"].isoformat()
#             data1["created_at"] = datetime[:-6]
#             if joblist[i]["salary_min"] is None or joblist[i]["salary_min"] == "":
#                 data1["salary_min"] = 0.00
#             else:
#                 data1["salary_min"] = joblist[i]["salary_min"]

#             if joblist[i]["salary_max"] is None or joblist[i]["salary_max"] == "":
#                 data1["salary_max"] = 0.00
#             else:
#                 data1["salary_max"] = joblist[i]["salary_max"]

#             if joblist[i]["currency"] is None or joblist[i]["currency"] == "":
#                 data1["currency"] = "USD"
#             else:
#                 data1["currency"] = joblist[i]["currency"]

#             if joblist[i]["display_name"] is None or joblist[i]["display_name"] == "":
#                 data1["city"] = ""
#             else:
#                 data1["city"] = joblist[i]["display_name"]

#             if joblist[i]["state"] is None or joblist[i]["state"] == "":
#                 data1["state"] = ""
#             else:
#                 data1["state"] = joblist[i]["state"]

#             if joblist[i]["country"] is None or joblist[i]["country"] == "":
#                 data1["country"] = ""
#             else:
#                 data1["country"] = joblist[i]["country"]

#             if (
#                 joblist[i]["latitude"] == None
#                 or joblist[i]["latitude"] == ""
#                 and joblist[i]["longitude"] is None
#                 or joblist[i]["longitude"] == ""
#             ):
#                 data1["postal_code"] = ""
#             else:
#                 geolocator = Nominatim(user_agent="geoapiExercises")
#                 location = geolocator.geocode(joblist[i]["latitude"] + "," + joblist[i]["longitude"])
#                 postal_code = location.raw["display_name"].split(",")[-2]
#                 data1["postal_code"] = postal_code
#             master_category = joblist[i]["category_id"]
#             category = Category.objects.filter(id=master_category).values()
#             if category:
#                 for k in range(len(category)):
#                     data1["category_name"] = category[k]["name"]
#             else:
#                 data1["category_name"] = ""

#             domain = joblist[i]["tenant_id"]

#             domain_name = Tenant.objects.filter(id=domain).values()
#             if domain_name:
#                 for x in range(len(domain_name)):
#                     data1["domain"] = domain_name[x]["base_url"]
#                     data1["company_name"] = domain_name[x]["name"]
#             else:
#                 data1["domain"] = ""
#                 data1["company_name"] = ""

#             data.append(data1)

#     else:
#         # data.append(data1)
#         pass
#     return render(request, "xml_feeds/ziprecruiter.html", {"joblist": data}, content_type="application/xml")


# def careerjet(request):
#     data = []
#     joblist = Job.objects.filter(job_board__careerjet=1, status="active").values()
#     if joblist:
#         for i in range(len(joblist)):
#             data1 = {}
#             data1["title"] = joblist[i]["title"]
#             data1["description"] = cleanhtml(str(joblist[i]["description"]))
#             data1["slug"] = joblist[i]["slug"]
#             datetime = joblist[i]["created_at"].isoformat()
#             data1["created_at"] = datetime[:-6]
#             if joblist[i]["salary_min"] is None or joblist[i]["salary_min"] == "":
#                 data1["salary_min"] = 0.00
#             else:
#                 data1["salary_min"] = joblist[i]["salary_min"]

#             if joblist[i]["salary_max"] is None or joblist[i]["salary_max"] == "":
#                 data1["salary_max"] = 0.00
#             else:
#                 data1["salary_max"] = joblist[i]["salary_max"]

#             if joblist[i]["currency"] is None or joblist[i]["currency"] == "":
#                 data1["currency"] = "USD"
#             else:
#                 data1["currency"] = joblist[i]["currency"]

#             if joblist[i]["display_name"] is None or joblist[i]["display_name"] == "":
#                 data1["city"] = ""
#             else:
#                 data1["city"] = joblist[i]["display_name"]

#             if joblist[i]["state"] is None or joblist[i]["state"] == "":
#                 data1["state"] = ""
#             else:
#                 data1["state"] = joblist[i]["state"]

#             if joblist[i]["country"] is None or joblist[i]["country"] == "":
#                 data1["country"] = ""
#             else:
#                 data1["country"] = joblist[i]["country"]

#             if (
#                 joblist[i]["latitude"] == None
#                 or joblist[i]["latitude"] == ""
#                 and joblist[i]["longitude"] is None
#                 or joblist[i]["longitude"] == ""
#             ):
#                 data1["postal_code"] = ""
#             else:
#                 geolocator = Nominatim(user_agent="geoapiExercises")
#                 location = geolocator.geocode(joblist[i]["latitude"] + "," + joblist[i]["longitude"])
#                 postal_code = location.raw["display_name"].split(",")[-2]
#                 data1["postal_code"] = postal_code
#             data1["contact_name"] = joblist[i]["contact_name"]
#             data1["contact_email"] = joblist[i]["contact_email"]
#             master_jobType = joblist[i]["job_type_id"]
#             jobtype = Category.objects.filter(id=master_jobType).values()
#             if jobtype:
#                 for k in range(len(jobtype)):
#                     data1["jobtype"] = jobtype[k]["name"]
#             else:
#                 data1["jobtype"] = ""
#             master_category = joblist[i]["category_id"]
#             category = Category.objects.filter(id=master_category).values()
#             if category:
#                 for k in range(len(category)):
#                     data1["category_name"] = category[k]["name"]
#             else:
#                 data1["category_name"] = ""

#             domain = joblist[i]["tenant_id"]

#             domain_name = Tenant.objects.filter(id=domain).values()
#             if domain_name:
#                 for x in range(len(domain_name)):
#                     data1["domain"] = domain_name[x]["base_url"]
#                     data1["company_name"] = domain_name[x]["name"]
#             else:
#                 data1["domain"] = ""
#                 data1["company_name"] = ""

#             data.append(data1)

#     else:
#         # data.append(data1)
#         pass
#     return render(request, "xml_feeds/careerjet.html", {"joblist": data}, content_type="application/xml")


# def jooble(request):
#     data = []
#     joblist = Job.objects.filter(job_board__jooble=1, status="active").values()
#     if joblist:
#         for i in range(len(joblist)):
#             data1 = {}
#             data1["job_reference"] = joblist[i]["vms_job_reference"]
#             data1["title"] = joblist[i]["title"]
#             data1["description"] = cleanhtml(str(joblist[i]["description"]))
#             data1["slug"] = joblist[i]["slug"]
#             datetime = joblist[i]["created_at"].isoformat()
#             data1["created_at"] = datetime[:-6]
#             if joblist[i]["salary_min"] is None or joblist[i]["salary_min"] == "":
#                 data1["salary_min"] = 0.00
#             else:
#                 data1["salary_min"] = joblist[i]["salary_min"]

#             if joblist[i]["salary_max"] is None or joblist[i]["salary_max"] == "":
#                 data1["salary_max"] = 0.00
#             else:
#                 data1["salary_max"] = joblist[i]["salary_max"]

#             if joblist[i]["currency"] is None or joblist[i]["currency"] == "":
#                 data1["currency"] = "USD"
#             else:
#                 data1["currency"] = joblist[i]["currency"]

#             if joblist[i]["display_name"] is None or joblist[i]["display_name"] == "":
#                 data1["city"] = ""
#             else:
#                 data1["city"] = joblist[i]["display_name"]

#             if joblist[i]["state"] is None or joblist[i]["state"] == "":
#                 data1["state"] = ""
#             else:
#                 data1["state"] = joblist[i]["state"]

#             if joblist[i]["country"] is None or joblist[i]["country"] == "":
#                 data1["country"] = ""
#             else:
#                 data1["country"] = joblist[i]["country"]

#             if (
#                 joblist[i]["latitude"] == None
#                 or joblist[i]["latitude"] == ""
#                 and joblist[i]["longitude"] is None
#                 or joblist[i]["longitude"] == ""
#             ):
#                 data1["postal_code"] = ""
#             else:
#                 geolocator = Nominatim(user_agent="geoapiExercises")
#                 location = geolocator.geocode(joblist[i]["latitude"] + "," + joblist[i]["longitude"])
#                 postal_code = location.raw["display_name"].split(",")[-2]
#                 data1["postal_code"] = postal_code
#             data1["contact_name"] = joblist[i]["contact_name"]
#             data1["contact_email"] = joblist[i]["contact_email"]
#             master_jobType = joblist[i]["job_type_id"]
#             jobtype = Category.objects.filter(id=master_jobType).values()
#             if jobtype:
#                 for k in range(len(jobtype)):
#                     data1["jobtype"] = jobtype[k]["name"]
#             else:
#                 data1["jobtype"] = ""
#             master_category = joblist[i]["category_id"]
#             category = Category.objects.filter(id=master_category).values()
#             if category:
#                 for k in range(len(category)):
#                     data1["category_name"] = category[k]["name"]
#             else:
#                 data1["category_name"] = ""

#             domain = joblist[i]["tenant_id"]

#             data1["updated_at"] = joblist[i]["updated_at"].strftime("%d.%m.%Y")
#             if joblist[i]["job_end_date"] is None:
#                 data1["job_end_date"] = ""
#             else:
#                 data1["job_end_date"] = joblist[i]["job_end_date"].strftime("%d.%m.%Y")

#             if joblist[i]["job_publish_date"] is None:
#                 data1["job_publish_date"] = ""
#             else:
#                 data1["job_publish_date"] = joblist[i]["job_publish_date"].strftime("%d.%m.%Y")

#             domain_name = Tenant.objects.filter(id=domain).values()
#             if domain_name:
#                 for x in range(len(domain_name)):
#                     data1["domain"] = domain_name[x]["base_url"]
#                     data1["company_name"] = domain_name[x]["name"]
#             else:
#                 data1["domain"] = ""
#                 data1["company_name"] = ""

#             data.append(data1)

#     else:
#         # data.append(data1)
#         pass
#     return render(request, "xml_feeds/jooble.html", {"joblist": data}, content_type="application/xml")


# class ZipRecruiterView(APIView):
#     """ZipRecruiter Api"""

#     def post(self, request):
#         data = request.data
#         response = json.dumps(data)
#         ziprecruiter = json.loads(response)
#         x = col.insert_one(ziprecruiter)
#         # print(x)
#         return api_response(Response.status_code, "Successfully", {})


# class GetZipRecruiterView(APIView):
#     def get(self, request):
#         x = col.find()
#         data = []
#         for doc in x:
#             doc["_id"] = str(doc["_id"])
#             data.append(doc)
#         return api_response(Response.status_code, "ResumeData", data)
