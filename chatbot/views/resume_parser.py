from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.views.generic import View
from core.helpers import api_response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.http import HttpResponse
import io
import json
from django.shortcuts import get_object_or_404
from core.models.users import User
from resume.serializers.resume_serializers import (
    EducationSerializer,
    WorkSerializer,
    AboutmeUpdate,
    NameUpdate,
    LocationUpdate,
    ResumeUploadSerializer,
    SKillsSerializer,
    CertificationSerializer,
    AchievementSerializer,
    NameUpdate,
)
from resume.models.profile import Profile
from resume.models.work import Work
from resume.models.education import Education
from resume.models.certificate import Certification
from resume.models.skill import Skills
from resume.models.achievement import Achievement
from resume.models.resume_models import (
    create_edudetails_from_soverign,
    create_workexp_from_soverign,
    create_skills_from_sovern,
    create_certificate,
    create_achievement,
)
from django.core.serializers import serialize
from rest_framework.parsers import MultiPartParser, FormParser
import pymongo
from directsourcing.settings import MEDIA_ROOT
from core.helpers import (
    call_sovrenapi,
    recursive_lookup,
    date_func,
    education_fun,
    check_or_create,
    delete_parsed_data,
    employment_type,
    current_employment,
)
from directsourcing.settings import MEDIA_ROOT
from rest_framework.permissions import AllowAny
import random
import base64


class UploadResume(APIView):
    permission_classes = (AllowAny,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, pk):
        try:
            profile_obj = User.objects.get(id=pk)
            if profile_obj:
                serializer = ResumeUploadSerializer(profile_obj, request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    user = User.objects.get(id=pk)
                    user.is_resume_parsed = True
                    user.save()
                    p = Profile.objects.get(user_id=profile_obj.id)
                    resumepath = profile_obj.resume_file
                    resume_file = str(MEDIA_ROOT) + str(resumepath)

                    with open(resume_file, "rb") as f:
                        base64str = base64.b64encode(f.read()).decode("UTF-8")
                    data = call_sovrenapi(resume_file)
                    if data["Value"]["ParsedDocument"] is None:
                        return api_response(400, "Bad Request", data["Info"])
                    sovren_response = data["Value"]["ParsedDocument"]
                    value2 = json.loads(sovren_response)
                    EmploymentHistory = recursive_lookup("EmployerOrg", value2)
                    EducationHistory = recursive_lookup("SchoolOrInstitution", value2)
                    skill = recursive_lookup("sov:Taxonomy", value2)
                    linkedin_link = recursive_lookup("InternetWebAddress", value2)
                    FullName = recursive_lookup("FormattedName", value2)
                    CertificationHistory = recursive_lookup("LicenseOrCertification", value2)
                    ExecutiveSummary = recursive_lookup("ExecutiveSummary", value2)
                    ResumeId = recursive_lookup("ResumeId", value2)

                    # SaveProfile
                    p.formated_name = FullName
                    p.linkdein_link = linkedin_link
                    p.about_me = ExecutiveSummary
                    p.save()

                    # resume_id
                    user = User.objects.get(id=pk)
                    user.resume_id = ResumeId["IdValue"]
                    user.is_resume_parsed = True
                    
                    user.save()

                    # LicenseOrCertification
                    if CertificationHistory:
                        for i in range(len(CertificationHistory)):
                            certification_name = CertificationHistory[i]["Name"]
                    else:
                        certification_name = None
                    user = User.objects.get(id=pk)
                    obj = Certification.objects.create(
                        user=user,
                        certification_name=certification_name,
                        start_date=None,
                        end_date=None,
                        created_at=None,
                        updated_at=None,
                    )

                    # EmploymentDetails
                    if EmploymentHistory:
                        for i in range(len(EmploymentHistory)):
                            if "EmployerOrgName" in EmploymentHistory[i].keys():
                                org = {"organization": EmploymentHistory[i]["EmployerOrgName"]}
                            else:
                                org = {"organization": None}

                            if "Title" in EmploymentHistory[i]["PositionHistory"][0].keys():
                                title = {"postion": EmploymentHistory[i]["PositionHistory"][0]["Title"]}
                            else:
                                title = {"postion": None}

                            if "Description" in EmploymentHistory[i]["PositionHistory"][0].keys():
                                emp_desc = {"description": EmploymentHistory[i]["PositionHistory"][0]["Description"]}
                                for key in emp_desc.keys():
                                    emp_details = emp_desc[key].replace("â€¢", "")

                                    desc = {"description": emp_details}

                            else:
                                desc = {"description": None}

                            if "StartDate" in EmploymentHistory[i]["PositionHistory"][0].keys():

                                if "StringDate" in EmploymentHistory[i]["PositionHistory"][0]["StartDate"].keys():
                                    startdate = {
                                        "start_date_year": EmploymentHistory[i]["PositionHistory"][0]["StartDate"][
                                            "StringDate"
                                        ]
                                    }
                                    dateyear = startdate["start_date_year"]
                                    date = date_func(dateyear)
                                    startdate_year = {"start_date_year": date}
                                elif "YearMonth" in EmploymentHistory[i]["PositionHistory"][0]["StartDate"].keys():
                                    startdate = {
                                        "start_date_year": EmploymentHistory[i]["PositionHistory"][0]["StartDate"][
                                            "YearMonth"
                                        ]
                                    }
                                    dateyear = startdate["start_date_year"]
                                    date = date_func(dateyear)
                                    startdate_year = {"start_date_year": date}
                                elif "AnyDate" in EmploymentHistory[i]["PositionHistory"][0]["StartDate"].keys():
                                    startdate = {
                                        "start_date_year": EmploymentHistory[i]["PositionHistory"][0]["StartDate"][
                                            "AnyDate"
                                        ]
                                    }
                                    dateyear = startdate["start_date_year"]
                                    date = date_func(dateyear)
                                    startdate_year = {"start_date_year": date}

                                else:
                                    startdate = {
                                        "start_date_year": EmploymentHistory[i]["PositionHistory"][0]["StartDate"][
                                            "Year"
                                        ]
                                    }
                                    dateyear = startdate["start_date_year"]
                                    date = date_func(dateyear)
                                    startdate_year = {"start_date_year": date}
                            else:
                                startdate_year = {"start_date_year": None}

                            if "EndDate" in EmploymentHistory[i]["PositionHistory"][0].keys():
                                if "StringDate" in EmploymentHistory[i]["PositionHistory"][0]["EndDate"].keys():
                                    enddate = {
                                        "end_date_year": EmploymentHistory[i]["PositionHistory"][0]["EndDate"][
                                            "StringDate"
                                        ]
                                    }
                                    endyear = enddate["end_date_year"]
                                    date = date_func(endyear)
                                    enddate_year = {"end_date_year": date}
                                elif "YearMonth" in EmploymentHistory[i]["PositionHistory"][0]["EndDate"].keys():
                                    enddate = {
                                        "end_date_year": EmploymentHistory[i]["PositionHistory"][0]["EndDate"][
                                            "YearMonth"
                                        ]
                                    }
                                    endyear = enddate["end_date_year"]
                                    date = date_func(endyear)
                                    enddate_year = {"end_date_year": date}
                                elif "AnyDate" in EmploymentHistory[i]["PositionHistory"][0]["EndDate"].keys():
                                    enddate = {
                                        "end_date_year": EmploymentHistory[i]["PositionHistory"][0]["EndDate"][
                                            "AnyDate"
                                        ]
                                    }
                                    endyear = enddate["end_date_year"]
                                    date = date_func(endyear)
                                    enddate_year = {"end_date_year": date}
                                else:
                                    enddate = {
                                        "end_date_year": EmploymentHistory[i]["PositionHistory"][0]["EndDate"]["Year"]
                                    }
                                    endyear = enddate["end_date_year"]
                                    date = date_func(endyear)
                                    enddate_year = {"end_date_year": date}
                            else:
                                enddate_year = {"end_date_year": None}

                            if "@positionType" in EmploymentHistory[i]["PositionHistory"][0].keys():
                                positiontype = {
                                    "positionType": EmploymentHistory[i]["PositionHistory"][0]["@positionType"]
                                }
                                jobtype = employment_type(positiontype["positionType"])
                                emp_type = {"positionType": jobtype}
                            else:
                                emp_type = {"positionType": None}

                            if "@currentEmployer" in EmploymentHistory[i]["PositionHistory"][0].keys():
                                current_emp = {
                                    "currentEmployer": EmploymentHistory[i]["PositionHistory"][0]["@currentEmployer"]
                                }
                                is_current = current_employment(current_emp["currentEmployer"])
                                emp_current = {"currentEmployer": is_current}
                            else:
                                emp_current = {"currentEmployer": None}

                            if (
                                "sov:NormalizedOrganizationName"
                                in EmploymentHistory[i]["PositionHistory"][0]["UserArea"][
                                    "sov:PositionHistoryUserArea"
                                ].keys()
                            ):
                                company = {
                                    "companyname": EmploymentHistory[i]["PositionHistory"][0]["UserArea"][
                                        "sov:PositionHistoryUserArea"
                                    ]["sov:NormalizedOrganizationName"]
                                }
                                companydata = company["companyname"]
                                normalized_id = check_or_create(companydata)
                                normalizedid = {"org_normalized": normalized_id}
                            else:
                                normalizedid = {"org_normalized": None}

                            user = User.objects.get(id=pk)
                            obj = Work.objects.create(
                                user=user,
                                organization=org["organization"],
                                job_title=title["postion"],
                                employment_type=emp_type["positionType"],
                                is_current=emp_current["currentEmployer"],
                                org_city=None,
                                org_state=None,
                                org_description=desc["description"],
                                org_start_date=startdate_year["start_date_year"],
                                org_end_date=enddate_year["end_date_year"],
                                org_normalized=normalizedid["org_normalized"],
                            )

                    # SkillDetails
                    if skill:
                        for i in range(len(skill)):
                            user = User.objects.get(id=pk)
                            create_skills_from_sovern(user=user, skills=skill[i]["@name"], score=None)

                    # EducationDetails
                    if EducationHistory:
                        for i in range(len(EducationHistory)):
                            if "School" in EducationHistory[i].keys():
                                if "SchoolName" in EducationHistory[i]["School"][0].keys():
                                    SchoolName = {"SchoolName": EducationHistory[i]["School"][0]["SchoolName"]}
                                else:
                                    SchoolName = {"SchoolName": None}
                            else:
                                SchoolName = {"SchoolName": None}

                            if "Degree" in EducationHistory[i].keys():
                                if "@degreeType" in EducationHistory[i]["Degree"][0].keys():
                                    DegreeType = {"DegreeType": EducationHistory[i]["Degree"][0]["@degreeType"]}
                                else:
                                    DegreeType = {"DegreeType": None}

                                if "DegreeMajor" in EducationHistory[i]["Degree"][0].keys():
                                    DegreeMajor = {
                                        "DegreeMajor": EducationHistory[i]["Degree"][0]["DegreeMajor"][0]["Name"][0]
                                    }
                                else:
                                    DegreeMajor = {"DegreeMajor": None}

                                if "DegreeMinor" in EducationHistory[i]["Degree"][0].keys():
                                    DegreeMinor = {
                                        "DegreeMinor": EducationHistory[i]["Degree"][0]["DegreeMinor"][0]["Name"][0]
                                    }
                                else:
                                    DegreeMinor = {"DegreeMinor": None}

                                if "DegreeDate" in EducationHistory[i]["Degree"][0].keys():
                                    if "StringDate" in EducationHistory[i]["Degree"][0]["DegreeDate"].keys():
                                        DegreeDate = {
                                            "DegreeDate": EducationHistory[i]["Degree"][0]["DegreeDate"]["StringDate"]
                                        }
                                    elif "YearMonth" in EducationHistory[i]["Degree"][0]["DegreeDate"].keys():
                                        DegreeDate = {
                                            "DegreeDate": EducationHistory[i]["Degree"][0]["DegreeDate"]["YearMonth"]
                                        }
                                    elif "Year" in EducationHistory[i]["Degree"][0]["DegreeDate"].keys():
                                        DegreeDate = {
                                            "DegreeDate": EducationHistory[i]["Degree"][0]["DegreeDate"]["Year"]
                                        }
                                    else:
                                        DegreeDate = {"DegreeDate": None}
                                else:
                                    DegreeDate = {"DegreeDate": None}

                                if "DatesOfAttendance" in EducationHistory[i]["Degree"][0].keys():
                                    if (
                                        "StringDate"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["StartDate"].keys()
                                    ):
                                        startdate = {
                                            "start_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "StartDate"
                                            ]["StringDate"]
                                        }
                                        startyear = startdate["start_date_year"]
                                        date = education_fun(startyear)
                                        StartDate = {"start_date_year": date}
                                    elif (
                                        "YearMonth"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["StartDate"].keys()
                                    ):
                                        startdate = {
                                            "start_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "StartDate"
                                            ]["YearMonth"]
                                        }
                                        startyear = startdate["start_date_year"]
                                        date = education_fun(startyear)
                                        StartDate = {"start_date_year": date}

                                    elif (
                                        "Year"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["StartDate"].keys()
                                    ):
                                        startdate = {
                                            "start_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "StartDate"
                                            ]["Year"]
                                        }
                                        startyear = startdate["start_date_year"]
                                        date = education_fun(startyear)
                                        StartDate = {"start_date_year": date}

                                    elif (
                                        "AnyDate"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["StartDate"].keys()
                                    ):
                                        startdate = {
                                            "start_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "StartDate"
                                            ]["AnyDate"]
                                        }
                                        startyear = startdate["start_date_year"]
                                        date = education_fun(startyear)
                                        StartDate = {"start_date_year": date}
                                    else:
                                        StartDate = {"start_date_year": None}

                                    if (
                                        "StringDate"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["EndDate"].keys()
                                    ):
                                        endDate = {
                                            "end_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "EndDate"
                                            ]["StringDate"]
                                        }
                                        startyear = endDate["end_date_year"]
                                        date = education_fun(startyear)
                                        EndDate = {"end_date_year": date}
                                    elif (
                                        "YearMonth"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["EndDate"].keys()
                                    ):
                                        endDate = {
                                            "end_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "EndDate"
                                            ]["YearMonth"]
                                        }
                                        startyear = endDate["end_date_year"]
                                        date = education_fun(startyear)
                                        EndDate = {"end_date_year": date}

                                    elif (
                                        "Year"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["EndDate"].keys()
                                    ):
                                        endDate = {
                                            "end_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "EndDate"
                                            ]["Year"]
                                        }
                                        startyear = endDate["end_date_year"]
                                        date = education_fun(startyear)
                                        EndDate = {"end_date_year": date}

                                    elif (
                                        "AnyDate"
                                        in EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0]["EndDate"].keys()
                                    ):
                                        endDate = {
                                            "end_date_year": EducationHistory[i]["Degree"][0]["DatesOfAttendance"][0][
                                                "EndDate"
                                            ]["AnyDate"]
                                        }
                                        startyear = endDate["end_date_year"]
                                        date = education_fun(startyear)
                                        EndDate = {"end_date_year": date}
                                    else:
                                        EndDate = {"end_date_year": None}
                                else:
                                    StartDate = {"start_date_year": None}
                                    EndDate = {"end_date_year": None}
                            else:
                                DegreeType = {"DegreeType": None}
                                DegreeMajor = {"DegreeMajor": None}
                                DegreeMinor = {"DegreeMinor": None}
                                DegreeDate = {"DegreeDate": None}
                                StartDate = {"start_date_year": None}
                                EndDate = {"end_date_year": None}
                            user = User.objects.get(id=pk)
                            education = create_edudetails_from_soverign(
                                user=user,
                                user_degree=DegreeType["DegreeType"],
                                academic=SchoolName["SchoolName"],
                                university_type=DegreeMajor["DegreeMajor"],
                                university_city=None,
                                university_state=None,
                                is_current=None,
                                academic_start_date=StartDate["start_date_year"],
                                academic_end_date=EndDate["end_date_year"],
                            )

                return api_response(200, "updated", "sovren_response")
            else:
                return api_response(404, "Page not found", {})
        except Exception as e:
            return api_response(404, "Page not found", {str(e)})
