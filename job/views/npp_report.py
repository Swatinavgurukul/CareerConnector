from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from core.models.tenant import Tenant
from job.models.job_applications import JobApplication
import xlsxwriter
from io import BytesIO
from django.http import StreamingHttpResponse
from job.models.jobs import Job
from core.helpers import api_response
from datetime import date
from core.models.users import User
import collections, functools, operator
from job.models.job_status import JobStatus
from core.models.profile_setting import ProfileSetting
from core.models.users import User
from resume.models.profile import Profile
from resume.models.work import Work
from resume.models.education import Education
from recruiter.models.candidate_note import RecruiterCandidateNote
from resume.models.user_preferences import IndustryPreference
from datetime import datetime


def jobseekerjournel(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "JobSeekerName", bold)
    worksheet.write("B1", "CurrentJobTitle", bold)
    worksheet.write("C1", "LastContactedOn", bold)
    worksheet.write("D1", "ProfileCompletionScore", bold)
    worksheet.write("E1", "Email", bold)
    worksheet.write("F1", "Phone", bold)
    worksheet.write("G1", "LookingforJobs", bold)
    worksheet.write("H1", "AvailabilityDate", bold)
    worksheet.write("I1", "Notes", bold)
    worksheet.write("J1", "IndustryPreferences", bold)
    worksheet.write("K1", "ExpectedSalaryRange", bold)
    worksheet.write("L1", "SalaryType", bold)
    worksheet.write("M1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("jobseeker_name"))
        worksheet.write(row, column + 1, item.get("current_job_title"))
        if item.get("last_contacted_on") == "N/A":
            worksheet.write(row, column + 2, item.get("last_contacted_on"))
        else:
            worksheet.write(row, column + 2, item.get("last_contacted_on").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 3, item.get("score"))
        worksheet.write(row, column + 4, item.get("email"))
        worksheet.write(row, column + 5, item.get("phone"))
        worksheet.write(row, column + 6, item.get("looking_for_offers"))
        worksheet.write(row, column + 7, item.get("availability_date"))
        worksheet.write(row, column + 8, item.get("note"))
        worksheet.write(row, column + 9, item.get("industry_preference"))
        worksheet.write(row, column + 10, item.get("expected_salary"))
        worksheet.write(row, column + 11, item.get("salary_type"))
        worksheet.write(row, column + 12, item.get("is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=CandidateSucessMetric.xlsx"
    return response


class JobSeekerJournelReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        users = User.objects.filter(tenant=request.user.tenant.id, role_id=None, is_superuser=False)
        if request.user.is_ca is False:
            users = users.exclude(is_ca=True)
        else:
            users = users.exclude(is_ca=False)

        all_user = users.values(
            "id",
            "first_name",
            "last_name",
            "phone",
            "tenant__name",
            "email",
            "city",
            "state",
            "country",
            "last_login",
            "is_ca",
        )
        for user in all_user:
            profile_objects = ProfileSetting.objects.filter(user_id=user["id"]).values(
                "looking_for_offers",
                "availability_date",
                "expected_min_salary",
                "expected_max_salary",
                "expected_currency",
                "score",
                "salary_per",
            )
            if user["last_login"] is None:
                last_contacted_on = "N/A"
            else:
                last_contacted_on = user["last_login"].date()

            # if profile_objects[0]["score"] == None:
            #     score = str(0) + "%"
            # else:
            #     score = str(sum(profile_objects[0]["score"].values())) + "%"

            if profile_objects.exists():
                if profile_objects[0]["score"] == None:
                    score = str(0) + "%"
                elif profile_objects[0]["score"]["about_me"] == 0:
                    total = sum(profile_objects[0]["score"].values())
                    score = str(total - profile_objects[0]["score"]["personal_info"]) + "%"
                else:
                    score = str(sum(profile_objects[0]["score"].values())) + "%"
                if (
                    profile_objects[0]["expected_min_salary"] == None
                    and profile_objects[0]["expected_max_salary"] == None
                ):
                    salary = "N/A"
                else:
                    salary = (
                        str(profile_objects[0]["expected_min_salary"])
                        + "-"
                        + str(profile_objects[0]["expected_max_salary"])
                        + str(profile_objects[0]["expected_currency"])
                    )
                if profile_objects[0]["looking_for_offers"] is None:
                    looking_for_offer = "N/A"
                else:
                    looking_for_offer = profile_objects[0]["looking_for_offers"]

                if profile_objects[0]["availability_date"] is None:
                    availability_date = "N/A"
                else:
                    availability_date = profile_objects[0]["availability_date"]

                if profile_objects[0]["salary_per"] is None:
                    salary_per = "N/A"
                else:
                    salary_per = profile_objects[0]["salary_per"]
            else:
                score = str(0) + "%"
                salary = "N/A"
                looking_for_offer = "N/A"
                availability_date = "N/A"
                salary_per = "N/A"

            note = RecruiterCandidateNote.objects.filter(user_id=user["id"]).values("note_text").order_by("-created_at")
            if note.exists():
                note = note[0]["note_text"]
            else:
                note = "N/A"
            current_profile = Work.objects.filter(user_id=user["id"], is_current=True).values("title")
            if current_profile.exists():
                title = current_profile[0]["title"]
            else:
                title = "N/A"

            industry_preferences = IndustryPreference.objects.filter(user_id=user["id"]).values("industry_slug__name")
            if industry_preferences.exists():
                industry_preference = industry_preferences[0]["industry_slug__name"]
            else:
                industry_preference = "N/A"

            if user["last_name"] == None:
                last_name = ""
            else:
                last_name = user["last_name"]

            job_dict = dict(
                jobseeker_name=str(user["first_name"]) + " " + str(last_name),
                phone=user["phone"],
                email=user["email"],
                current_job_title=title,
                score=score,
                last_contacted_on=last_contacted_on,
                note=note,
                looking_for_offers=looking_for_offer,
                availability_date=availability_date,
                industry_preference=industry_preference,
                expected_salary=salary,
                salary_type=salary_per,
                is_ca=user["is_ca"],
            )
            data.append(job_dict)
        return api_response(200, "Current Application Report", data)


class JobSeekerJournelDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        users = User.objects.filter(tenant=request.user.tenant.id, role_id=None, is_superuser=False)
        if request.user.is_ca is False:
            users = users.exclude(is_ca=True)
        else:
            users = users.exclude(is_ca=False)

        all_user = users.values(
            "id",
            "first_name",
            "last_name",
            "phone",
            "tenant__name",
            "email",
            "city",
            "state",
            "country",
            "last_login",
            "is_ca",
        )
        for user in all_user:
            profile_objects = ProfileSetting.objects.filter(user_id=user["id"]).values(
                "looking_for_offers",
                "availability_date",
                "expected_min_salary",
                "expected_max_salary",
                "expected_currency",
                "score",
                "salary_per",
            )
            if user["last_login"] is None:
                last_contacted_on = "N/A"
            else:
                last_contacted_on = user["last_login"].date()

            if profile_objects.exists():
                if profile_objects[0]["score"] == None:
                    score = str(0) + "%"
                elif profile_objects[0]["score"]["about_me"] == 0:
                    total = sum(profile_objects[0]["score"].values())
                    score = str(total - profile_objects[0]["score"]["personal_info"]) + "%"
                else:
                    score = str(sum(profile_objects[0]["score"].values())) + "%"
                if (
                    profile_objects[0]["expected_min_salary"] == None
                    and profile_objects[0]["expected_max_salary"] == None
                ):
                    salary = "N/A"
                else:
                    salary = (
                        str(profile_objects[0]["expected_min_salary"])
                        + "-"
                        + str(profile_objects[0]["expected_max_salary"])
                        + str(profile_objects[0]["expected_currency"])
                    )
                if profile_objects[0]["looking_for_offers"] is None:
                    looking_for_offer = "N/A"
                else:
                    looking_for_offer = profile_objects[0]["looking_for_offers"]

                if profile_objects[0]["availability_date"] is None:
                    availability_date = "N/A"
                else:
                    availability_date = profile_objects[0]["availability_date"]

                if profile_objects[0]["salary_per"] is None:
                    salary_per = "N/A"
                else:
                    salary_per = profile_objects[0]["salary_per"]
            else:
                score = str(0) + "%"
                salary = "N/A"
                looking_for_offer = "N/A"
                availability_date = "N/A"
                salary_per = "N/A"

            note = RecruiterCandidateNote.objects.filter(user_id=user["id"]).values("note_text").order_by("-created_at")
            if note.exists():
                note = note[0]["note_text"]
            else:
                note = "N/A"
            current_profile = Work.objects.filter(user_id=user["id"], is_current=True).values("title")
            if current_profile.exists():
                title = current_profile[0]["title"]
            else:
                title = "N/A"

            industry_preferences = IndustryPreference.objects.filter(user_id=user["id"]).values("industry_slug__name")
            if industry_preferences.exists():
                industry_preference = industry_preferences[0]["industry_slug__name"]
            else:
                industry_preference = "N/A"

            if user["last_name"] == None:
                last_name = ""
            else:
                last_name = user["last_name"]

            job_dict = dict(
                jobseeker_name=str(user["first_name"]) + " " + str(last_name),
                phone=user["phone"],
                email=user["email"],
                current_job_title=title,
                score=score,
                last_contacted_on=last_contacted_on,
                note=note,
                looking_for_offers=looking_for_offer,
                availability_date=availability_date,
                industry_preference=industry_preference,
                expected_salary=salary,
                salary_type=salary_per,
                is_ca=user["is_ca"],
            )
            data.append(job_dict)
        stream_response = jobseekerjournel(data)
        return stream_response


def jobactivity(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "JobTitle", bold)
    worksheet.write("B1", "HiringManager", bold)
    worksheet.write("C1", "JobStatus", bold)
    worksheet.write("D1", "Location", bold)
    worksheet.write("E1", "CompanyName", bold)
    worksheet.write("F1", "DateOpened", bold)
    worksheet.write("G1", "TotalApplicationSubmitted", bold)
    worksheet.write("H1", "Positions", bold)
    worksheet.write("I1", "PoolApplications", bold)
    worksheet.write("J1", "Interviews", bold)
    worksheet.write("K1", "Hires", bold)
    worksheet.write("L1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("hiring_manager"))
        worksheet.write(row, column + 2, item.get("job_status"))
        worksheet.write(row, column + 3, item.get("location"))
        worksheet.write(row, column + 4, item.get("company_name"))
        if item.get("job_start_date") is not None:
            worksheet.write(row, column + 5, item.get("job_start_date").strftime("%d/%m/%Y"))
        else:
            worksheet.write(row, column + 5, "N/A")
        worksheet.write(row, column + 6, item.get("total_application"))
        worksheet.write(row, column + 7, item.get("positions"))
        worksheet.write(row, column + 8, item.get("application_count"))
        worksheet.write(row, column + 9, item.get("interview_count"))
        worksheet.write(row, column + 10, item.get("hired_count"))
        worksheet.write(row, column + 11, item.get("user__is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=CandidateSucessMetric.xlsx"
    return response


class JobActivityReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        jobs = Job.objects.exclude(status="draft")
        if request.user.is_ca is False:
            jobs = jobs.exclude(user__is_ca=True)
        else:
            jobs = jobs.exclude(user__is_ca=False)
        all_jobstatus = jobs.values(
            "id",
            "title",
            "title_esp",
            "title_fr",
            "tenant__name",
            "display_name",
            "state",
            "country",
            "job_type__name",
            "job_start_date",
            "job_end_date",
            "status",
            "user__first_name",
            "user__last_name",
            "openings",
            "remote_location",
            "user__is_ca",
        )
        jobstatus = (
            JobApplication.objects.select_related("job__id")
            .filter(tenant=request.user.tenant.id)
            .exclude(user__is_superuser=1)
            .values("current_status", "job__id")
        )
        for job in all_jobstatus:
            jobstatus1 = JobApplication.objects.filter(job_id=job["id"]).exclude(user__is_superuser=1).count()
            pool_applicant = (
                JobApplication.objects.filter(tenant=request.user.tenant.id, job_id=job["id"])
                .exclude(user__is_superuser=1)
                .count()
            )
            if job["display_name"] == None or job["display_name"] == "" and job["remote_location"] == False:
                city = ""
            elif job["remote_location"] == True and job["display_name"] == None or job["display_name"] == "":
                city = "Remote Location"
            else:
                city = job["display_name"] + "," + job["state"] + "," + job["country"]

            if job["user__last_name"] == None:
                last_name = ""
            else:
                last_name = ""
            job_dict = dict(
                # job_id=job.job.id,
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                hiring_manager=str(job["user__first_name"]) + "" + str(last_name),
                company_name=job["tenant__name"],
                location=city,
                job_start_date=job["job_start_date"],
                job_end_date=job["job_end_date"],
                job_status=job["status"],
                # job_type=job["job_type__name"],
                positions=job["openings"],
                total_application=jobstatus1,
                application_count=pool_applicant,
                user__is_ca=job["user__is_ca"],
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
            )
            data.append(job_dict)
        return api_response(200, "Job Application Count", data)


class JobActivityDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        jobs = Job.objects.exclude(status="draft")
        if request.user.is_ca is False:
            jobs = jobs.exclude(user__is_ca=True)
        else:
            jobs = jobs.exclude(user__is_ca=False)
        all_jobstatus = jobs.values(
            "id",
            "title",
            "title_esp",
            "title_fr",
            "tenant__name",
            "display_name",
            "state",
            "country",
            "job_type__name",
            "job_start_date",
            "job_end_date",
            "status",
            "user__first_name",
            "user__last_name",
            "openings",
            "remote_location",
            "user__is_ca",
        )
        jobstatus = (
            JobApplication.objects.select_related("job__id")
            .filter(tenant=request.user.tenant.id)
            .exclude(user__is_superuser=1)
            .values("current_status", "job__id")
        )
        for job in all_jobstatus:
            jobstatus1 = JobApplication.objects.filter(job_id=job["id"]).exclude(user__is_superuser=1).count()
            pool_applicant = (
                JobApplication.objects.filter(tenant=request.user.tenant.id, job_id=job["id"])
                .exclude(user__is_superuser=1)
                .count()
            )

            if job["display_name"] == None or job["display_name"] == "" and job["remote_location"] == False:
                city = ""
            elif job["remote_location"] == True and job["display_name"] == None or job["display_name"] == "":
                city = "Remote Location"
            else:
                city = job["display_name"] + "," + job["state"] + "," + job["country"]
            if job["display_name"] == None or job["display_name"] == "":
                city = ""
            else:
                city = job["display_name"] + "," + job["state"] + "," + job["country"]

            if job["user__last_name"] == None:
                last_name = ""
            else:
                last_name = job["user__last_name"]
            job_dict = dict(
                # job_id=job.job.id,
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                hiring_manager=str(job["user__first_name"]) + "" + str(last_name),
                company_name=job["tenant__name"],
                location=city,
                job_start_date=job["job_start_date"],
                job_end_date=job["job_end_date"],
                job_status=job["status"],
                # job_type=job["job_type__name"],
                positions=job["openings"],
                total_application=jobstatus1,
                application_count=pool_applicant,
                user__is_ca=job["user__is_ca"],
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
            )
            data.append(job_dict)
        stream_response = jobactivity(data)
        return stream_response


def openjob(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "JobTitle", bold)
    worksheet.write("B1", "HiringManagerName", bold)
    worksheet.write("C1", "CompanyName", bold)
    worksheet.write("D1", "SalaryRange", bold)
    worksheet.write("E1", "OpeningDate", bold)
    worksheet.write("F1", "ClosingDate", bold)
    worksheet.write("G1", "DaysLeftToClose", bold)
    worksheet.write("H1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("hiring_manager"))
        worksheet.write(row, column + 2, item.get("company_name"))
        worksheet.write(row, column + 3, item.get("salary_range"))
        worksheet.write(row, column + 4, item.get("job_start_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 5, item.get("job_end_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 6, item.get("days_left_close"))
        worksheet.write(row, column + 7, item.get("user__is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=CandidateSucessMetric.xlsx"
    return response


class OpenJobReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        jobs = Job.objects.filter(status="active")
        if request.user.is_ca is False:
            jobs = jobs.exclude(user__is_ca=True)
        else:
            jobs = jobs.exclude(user__is_ca=False)
        all_jobstatus = jobs.values(
            "id",
            "title",
            "title_esp",
            "title_fr",
            "tenant__name",
            "display_name",
            "state",
            "country",
            "job_type__name",
            "job_start_date",
            "job_end_date",
            "status",
            "user__first_name",
            "user__last_name",
            "openings",
            "salary_min",
            "salary_max",
            "currency",
            "user__is_ca",
        ).order_by("-job_end_date")

        today_date = datetime.today()
        for job in all_jobstatus:
            if job["user__last_name"] == None:
                last_name = ""
            else:
                last_name = job["user__last_name"]

            if (
                job["salary_min"] == None
                or job["salary_min"] == 0
                and job["salary_max"] == None
                or job["salary_max"] == 0
            ):
                salary = "N/A"
            else:
                salary = str(job["salary_min"]) + "-" + str(job["salary_max"]) + str(job["currency"])

            if (job["job_end_date"] - today_date.date()).days <= 0:
                days = 0
            else:
                days = (job["job_end_date"] - today_date.date()).days
            job_dict = dict(
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                hiring_manager=str(job["user__first_name"]) + "" + str(last_name),
                company_name=job["tenant__name"],
                job_start_date=job["job_start_date"],
                job_end_date=job["job_end_date"],
                job_status=job["status"],
                salary_range=salary,
                days_left_close=days,
                user__is_ca=job["user__is_ca"],
            )
            data.append(job_dict)
        return api_response(200, "Open Job Report", data)


class OpenJobDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        jobs = Job.objects.filter(status="active")
        if request.user.is_ca is False:
            jobs = jobs.exclude(user__is_ca=True)
        else:
            jobs = jobs.exclude(user__is_ca=False)
        all_jobstatus = jobs.values(
            "id",
            "title",
            "title_esp",
            "title_fr",
            "tenant__name",
            "display_name",
            "state",
            "country",
            "job_type__name",
            "job_start_date",
            "job_end_date",
            "status",
            "user__first_name",
            "user__last_name",
            "openings",
            "salary_min",
            "salary_max",
            "currency",
            "user__is_ca",
        ).order_by("-job_end_date")
        today_date = datetime.today()
        for job in all_jobstatus:
            if (
                job["salary_min"] is None
                or job["salary_min"] == ""
                or job["salary_min"] == 0
                and job["salary_max"] is None
                or job["salary_max"] == ""
                or job["salary_max"] == 0
            ):
                salary = "N/A"
            else:
                salary = str(job["salary_min"]) + "-" + str(job["salary_max"]) + str(job["currency"])
            if job["user__last_name"] == None:
                last_name = ""
            else:
                last_name = job["user__last_name"]
            if (job["job_end_date"] - today_date.date()).days <= 0:
                days = 0
            else:
                days = (job["job_end_date"] - today_date.date()).days
            job_dict = dict(
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                hiring_manager=str(job["user__first_name"]) + "" + str(last_name),
                company_name=job["tenant__name"],
                job_start_date=job["job_start_date"],
                job_end_date=job["job_end_date"],
                job_status=job["status"],
                salary_range=salary,
                days_left_close=days,
                user__is_ca=job["user__is_ca"],
            )
            data.append(job_dict)
        stream_response = openjob(data)
        return stream_response


def candidateapplication(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "NameOfJobSeeker", bold)
    worksheet.write("B1", "ContactNumber", bold)
    worksheet.write("C1", "Email", bold)
    worksheet.write("D1", "CurrentDesignation", bold)
    worksheet.write("E1", "Experience", bold)
    worksheet.write("F1", "CurrentLocation", bold)
    worksheet.write("G1", "EducationQualification", bold)
    worksheet.write("H1", "JobTitle", bold)
    worksheet.write("I1", "JobSeekerStatus", bold)
    worksheet.write("J1", "ApplicationSubmissionDate", bold)
    worksheet.write("K1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("jobseeker_name"))
        worksheet.write(row, column + 1, item.get("phone"))
        worksheet.write(row, column + 2, item.get("email"))
        worksheet.write(row, column + 3, item.get("designation"))
        worksheet.write(row, column + 4, item.get("experience"))
        worksheet.write(row, column + 5, item.get("city"))
        worksheet.write(row, column + 6, item.get("qualification"))
        worksheet.write(row, column + 7, item.get("job_title"))
        worksheet.write(row, column + 8, item.get("jobseeker_status"))
        worksheet.write(row, column + 9, item.get("application_submission_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 10, item.get("is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=CandidateSucessMetric.xlsx"
    return response


class CurentApplicationReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_application = (
            JobApplication.objects.filter(tenant=request.user.tenant.id)
            .exclude(user__is_superuser=1)
            .values("user_id", "current_status", "job_id", "updated_at")
        )
        for user in all_application:
            user_objects = User.objects.filter(id=user["user_id"]).values(
                "id",
                "phone",
                "first_name",
                "last_name",
                "email",
                "city",
                "state",
                "country",
                "is_ca",
            )
            if user_objects[0]["city"] == None or user_objects[0]["city"] == "":
                city = ""
            else:
                city = user_objects[0]["city"] + "," + user_objects[0]["state"] + "," + user_objects[0]["country"]

            profile_objects = Profile.objects.filter(user_id=user["user_id"]).values("total_experience")

            current_profile = Work.objects.filter(user_id=user["user_id"], is_current=True).values("title")

            education = Education.objects.filter(user_id=user["user_id"]).values("degree")
            if education.exists():
                qualification = education.first()["degree"]
            else:
                qualification = "N/A"

            if current_profile.exists():
                title = current_profile[0]["title"]
            else:
                title = "N/A"
            job_obj = Job.objects.filter(id=user["job_id"]).values("title", "title_esp", "title_fr")

            if user_objects[0]["last_name"] == None:
                last_name = ""
            else:
                last_name = user_objects[0]["last_name"]
            job_dict = dict(
                jobseeker_name=str(user_objects[0]["first_name"]) + " " + str(last_name),
                phone=user_objects[0]["phone"],
                email=user_objects[0]["email"],
                city=city,
                experience=profile_objects[0]["total_experience"],
                qualification=qualification,
                designation=title,
                job_title=job_obj[0]["title"],
                job_title_esp=job_obj[0]["title_esp"],
                job_title_fr=job_obj[0]["title_fr"],
                jobseeker_status=user["current_status"],
                application_submission_date=user["updated_at"].date(),
                is_ca=user_objects[0]["is_ca"],
            )
            data.append(job_dict)

        return api_response(200, "Current Application Report", data)


class CurentApplicationDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_application = (
            JobApplication.objects.filter(tenant=request.user.tenant.id)
            .exclude(user__is_superuser=1)
            .values("user_id", "current_status", "job_id", "updated_at")
        )
        for user in all_application:
            user_objects = User.objects.filter(id=user["user_id"]).values(
                "id",
                "phone",
                "first_name",
                "last_name",
                "email",
                "city",
                "state",
                "country",
                "is_ca"
            )
            if user_objects[0]["city"] == None or user_objects[0]["city"] == "":
                city = ""
            else:
                city = user_objects[0]["city"] + "," + user_objects[0]["state"] + "," + user_objects[0]["country"]

            profile_objects = Profile.objects.filter(user_id=user["user_id"]).values("total_experience")

            current_profile = Work.objects.filter(user_id=user["user_id"], is_current=True).values("title")

            education = Education.objects.filter(user_id=user["user_id"]).values("degree")
            if education.exists():
                qualification = education.first()["degree"]
            else:
                qualification = "N/A"

            if current_profile.exists():
                title = current_profile[0]["title"]
            else:
                title = "N/A"
            job_title = Job.objects.filter(id=user["job_id"]).values("title")

            if user_objects[0]["last_name"] == None:
                last_name = ""
            else:
                last_name = user_objects[0]["last_name"]

            job_dict = dict(
                jobseeker_name=str(user_objects[0]["first_name"]) + " " + str(last_name),
                phone=user_objects[0]["phone"],
                email=user_objects[0]["email"],
                city=city,
                experience=profile_objects[0]["total_experience"],
                qualification=qualification,
                designation=title,
                job_title=job_title[0]["title"],
                jobseeker_status=user["current_status"],
                application_submission_date=user["updated_at"].date(),
                is_ca=user_objects[0]["is_ca"],
            )
            data.append(job_dict)
        stream_response = candidateapplication(data)
        return stream_response


def candidatemetric(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "JobSeekerName", bold)
    worksheet.write("B1", "CandidateEmail", bold)
    worksheet.write("C1", "AppliedCount", bold)
    worksheet.write("D1", "HiredCount", bold)
    worksheet.write("E1", "LastActivityOn", bold)
    worksheet.write("F1", "Availability", bold)
    worksheet.write("G1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("jobseeker_name"))
        worksheet.write(row, column + 1, item.get("email"))
        worksheet.write(row, column + 2, item.get("applied_count"))
        worksheet.write(row, column + 3, item.get("hired_count"))
        worksheet.write(row, column + 4, item.get("last_activity_on").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 5, item.get("availability"))
        worksheet.write(row, column + 6, item.get("is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=CandidateSucessMetric.xlsx"
    return response


class JobSeekerSucessMetricReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_jobstatus = JobStatus.objects.filter(tenant=request.user.tenant.id, status="hired").values(
            "status",
            "user__id",
            "user__email",
            "user__last_login",
            "user__is_active",
            "user__first_name",
            "user__last_name",
            "user__is_ca",
        )
        jobstatus = (
            JobStatus.objects.select_related("user__id")
            .filter(tenant=request.user.tenant.id)
            .values("status", "user__id")
        )

        for user in all_jobstatus:
            profile_availability = (
                ProfileSetting.objects.filter(user_id=user["user__id"]).values("availability_date").first()
            )
            if user["user__last_login"] is None:
                last_activity_on = "N/A"
            else:
                last_activity_on = user["user__last_login"].date()

            if user["user__last_name"] is None:
                last_name = ""
            else:
                last_name = user["user__last_name"]

            job_dict = dict(
                jobseeker_name=user["user__first_name"] + " " + str(last_name),
                email=user["user__email"],
                last_activity_on=last_activity_on,
                availability=profile_availability["availability_date"],
                is_ca=user["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["user__id"] == user["user__id"] and js["status"] == "applied"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["user__id"] == user["user__id"] and js["status"] == "hired"), jobstatus)
                    ),
                ),
            )
            data.append(job_dict)
        res_list = []
        for i in range(len(data)):
            if data[i] not in data[i + 1 :]:
                res_list.append(data[i])
        return api_response(200, "Job Seeker Count", res_list)


class JobSeekerSucessMetricDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_jobstatus = JobStatus.objects.filter(tenant=request.user.tenant.id, status="hired").values(
            "status",
            "user__id",
            "user__email",
            "user__last_login",
            "user__is_active",
            "user__first_name",
            "user__last_name",
            "user__is_ca"
        )
        jobstatus = (
            JobStatus.objects.select_related("user__id")
            .filter(tenant=request.user.tenant.id)
            .values("status", "user__id")
        )

        for user in all_jobstatus:
            profile_availability = (
                ProfileSetting.objects.filter(user_id=user["user__id"]).values("availability_date").first()
            )
            if user["user__last_login"] is None:
                last_activity_on = "N/A"
            else:
                last_activity_on = user["user__last_login"].date()

            if user["user__last_name"] is None:
                last_name = ""
            else:
                last_name = user["user__last_name"]

            job_dict = dict(
                jobseeker_name=user["user__first_name"] + " " + str(last_name),
                email=user["user__email"],
                last_activity_on=last_activity_on,
                availability=profile_availability["availability_date"],
                is_ca=user["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["user__id"] == user["user__id"] and js["status"] == "applied"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["user__id"] == user["user__id"] and js["status"] == "hired"), jobstatus)
                    ),
                ),
            )
            data.append(job_dict)
        res_list = []
        for i in range(len(data)):
            if data[i] not in data[i + 1 :]:
                res_list.append(data[i])
        stream_response = candidatemetric(res_list)
        return stream_response
