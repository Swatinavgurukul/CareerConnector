from django.http.response import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from core.models.tenant import Tenant
from job.models.job_applications import JobApplication
import xlsxwriter
from io import BytesIO
from django.http import StreamingHttpResponse
from job.models.jobs import Job
from core.helpers import api_response
import datetime
from core.models.users import User
import collections, functools, operator
from job.models.job_status import JobStatus
from core.get_tenant import get_user_tenant
from core.serializers.survey import ListSurveySerializer, ListCaSurveySerializer
from core.models.master_survey import Survey
from core.models.master_survey import Survey
from job.models.job_survey import SurveyFeedBack
from job.serializers.survey_feedback_serializers import SurveyFeedbackSerializer
import time

from core.models.audit import Audit
from core.serializers.useractivity import AuditSerializer
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant
import pandas as pd
from core.serializers.hiring_member_serializers import AdminUserSerializer


def downloadFile(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "Title", bold)
    worksheet.write("B1", "CompanyName", bold)
    worksheet.write("C1", "Location", bold)
    worksheet.write("D1", "JobType", bold)
    worksheet.write("E1", "JobCreatedAt", bold)
    worksheet.write("F1", "AppliedCount", bold)
    worksheet.write("G1", "ScreeningCount", bold)
    worksheet.write("H1", "InterviewCount", bold)
    worksheet.write("I1", "OfferedCount", bold)
    worksheet.write("J1", "HiredCount", bold)
    worksheet.write("K1", "DeclinedCount", bold)
    worksheet.write("L1", "OnholdCount", bold)
    worksheet.write("M1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("company_name"))
        worksheet.write(row, column + 2, item.get("location"))
        worksheet.write(row, column + 3, item.get("job_type"))
        worksheet.write(row, column + 4, item.get("job_created_at").strftime("%m/%d/%Y"))
        worksheet.write(row, column + 5, item.get("applied_count"))
        worksheet.write(row, column + 6, item.get("screening_count"))
        worksheet.write(row, column + 7, item.get("interview_count"))
        worksheet.write(row, column + 8, item.get("offered_count"))
        worksheet.write(row, column + 9, item.get("hired_count"))
        worksheet.write(row, column + 10, item.get("declined_count"))
        worksheet.write(row, column + 11, item.get("onhold_count"))
        worksheet.write(row, column + 12, item.get("user__is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Current_Pipeline.xlsx"
    return response


def historicreport(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "Title", bold)
    worksheet.write("B1", "CompanyName", bold)
    worksheet.write("C1", "Location", bold)
    worksheet.write("D1", "JobType", bold)
    worksheet.write("E1", "JobCreatedAt", bold)
    worksheet.write("F1", "AppliedCount", bold)
    worksheet.write("G1", "ScreeningCount", bold)
    worksheet.write("H1", "InterviewCount", bold)
    worksheet.write("I1", "OfferedCount", bold)
    worksheet.write("J1", "HiredCount", bold)
    worksheet.write("K1", "DeclinedCount", bold)
    worksheet.write("L1", "OnholdCount", bold)
    worksheet.write("M1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("company_name"))
        worksheet.write(row, column + 2, item.get("location"))
        worksheet.write(row, column + 3, item.get("job_type"))
        worksheet.write(row, column + 4, item.get("job_created_at").strftime("%m/%d/%Y"))
        worksheet.write(row, column + 5, item.get("applied_count"))
        worksheet.write(row, column + 6, item.get("screening_count"))
        worksheet.write(row, column + 7, item.get("interview_count"))
        worksheet.write(row, column + 8, item.get("offered_count"))
        worksheet.write(row, column + 9, item.get("hired_count"))
        worksheet.write(row, column + 10, item.get("declined_count"))
        worksheet.write(row, column + 11, item.get("onhold_count"))
        worksheet.write(row, column + 12, item.get("user__is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=historic_Pipeline.xlsx"
    return response


class CurrentPipelineReport(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request):
        data = []
        if "active" in request.data.values():
            all_jobstatus = Job.objects.filter(status="active").values(
                "id",
                "title",
                "title_esp",
                "title_fr",
                "user__is_ca",
                "company__name",
                "location__city",
                "job_type__name",
                "created_at",
                "status",
            )
        else:
            all_jobstatus = (
                Job.objects.all()
                .exclude(status="active")
                .values(
                    "id",
                    "title",
                    "title_esp",
                    "title_fr",
                    "user__is_ca",
                    "company__name",
                    "location__city",
                    "job_type__name",
                    "created_at",
                    "status",
                )
            )
        jobstatus = (
            JobApplication.objects.select_related("job__id")
            .all()
            .exclude(user__is_superuser=1)
            .values("current_status", "job__id")
        )
        for job in all_jobstatus:
            job_dict = dict(
                # job_id=job.job.id,
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                user__is_ca=job["user__is_ca"],
                company_name=job["company__name"],
                location=job["location__city"],
                job_type=job["job_type__name"],
                created_at=job["created_at"].date(),
                status=job["status"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data.append(job_dict)
        return api_response(200, "Job Application Count", data)


class CurrentPipelineDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request):
        data = []
        if "active" in request.data.values():
            all_jobstatus = Job.objects.filter(status="active").values(
                "id",
                "title",
                "title_fr",
                "user__is_ca",
                "title_esp",
                "company__name",
                "location__city",
                "job_type",
                "created_at",
                "status",
            )
        else:
            all_jobstatus = (
                Job.objects.all()
                .exclude(status="active")
                .values(
                    "id",
                    "title",
                    "title_fr",
                    "user__is_ca",
                    "title_esp",
                    "company__name",
                    "location__city",
                    "job_type",
                    "created_at",
                    "status",
                )
            )
        jobstatus = (
            JobApplication.objects.select_related("job__id")
            .all()
            .exclude(user__is_superuser=1)
            .values("current_status", "job__id")
        )
        for job in all_jobstatus:
            job_dict = dict(
                # job_id=job.job.id,
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                company_name=job["company__name"],
                location=job["location__city"],
                job_type=job["job_type"],
                job_created_at=job["created_at"].date(),
                job_status=job["status"],
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data.append(job_dict)
        if data == []:
            return api_response(404, "data not found", {})
        elif "active" in data[0]["job_status"]:
            stream_response = downloadFile(data)
        else:
            stream_response = historicreport(data)
        return stream_response


def timetohire(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "Title", bold)
    worksheet.write("B1", "CompanyName", bold)
    worksheet.write("C1", "Location", bold)
    worksheet.write("D1", "JobType", bold)
    worksheet.write("E1", "JobCreatedAt", bold)
    worksheet.write("F1", "HiringDate", bold)
    worksheet.write("G1", "TimeToFill", bold)
    worksheet.write("H1", "TimeToHire", bold)
    worksheet.write("I1", "Canada", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("company_name"))
        worksheet.write(row, column + 2, item.get("location"))
        worksheet.write(row, column + 3, item.get("job_type"))
        worksheet.write(row, column + 4, item.get("job_created_at"))
        worksheet.write(row, column + 5, item.get("hiring_date"))
        worksheet.write(row, column + 6, item.get("hiring_day"))
        worksheet.write(row, column + 7, item.get("apply_day"))
        worksheet.write(row, column + 8, item.get("user__is_ca"))

        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Timetohire.xlsx"
    return response


class PipelineReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_jobstatus = (
            JobApplication.objects.filter(current_status="hired")
            .exclude(user__is_superuser=1)
            .values(
                "created_at",
                "job__title",
                "job__title_esp",
                "job__title_fr",
                "job__company__name",
                "job__location__city",
                "job__created_at",
                "job__status",
                "job__job_type__name",
                "job__user__is_ca",
            )
        )
        for job in all_jobstatus:
            job_dict = dict(
                title=job["job__title"],
                title_esp=job["job__title_esp"],
                title_fr=job["job__title_fr"],
                company_name=job["job__company__name"],
                location=job["job__location__city"],
                job_type=job["job__job_type__name"],
                job_created_at=job["job__created_at"].date(),
                job_status=job["job__status"],
                hiring_date=job["created_at"].date(),
                hiring_day=(job["created_at"].date() - job["job__created_at"].date()).days,
                apply_day=(job["created_at"].date() - job["job__created_at"].date()).days,
                user__is_ca=job["job__user__is_ca"],
            )
            data.append(job_dict)
        return api_response(200, "Hired Applicant Day", data)


class PipelineDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_jobstatus = (
            JobApplication.objects.filter(current_status="hired")
            .exclude(user__is_superuser=1)
            .values(
                "created_at",
                "job__title",
                "job__title_fr",
                "job__title_esp",
                "job__company__name",
                "job__location__city",
                "job__created_at",
                "job__status",
                "job__job_type__name",
                "job__user__is_ca",
            )
        )
        for job in all_jobstatus:
            job_dict = dict(
                title=job["job__title"],
                title_esp=job["job__title_esp"],
                title_fr=job["job__title_fr"],
                company_name=job["job__company__name"],
                location=job["job__location__city"],
                job_type=job["job__job_type__name"],
                job_created_at=job["job__created_at"].date(),
                job_status=job["job__status"],
                hiring_date=job["created_at"].date(),
                hiring_day=(job["created_at"].date() - job["job__created_at"].date()).days,
                apply_day=(job["created_at"].date() - job["job__created_at"].date()).days,
                user__is_ca=job["job__user__is_ca"],
            )
            data.append(job_dict)
            stream_response = timetohire(data)
        return stream_response


def candidatemetric(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "CandidateName", bold)
    worksheet.write("B1", "Location", bold)
    worksheet.write("C1", "LastActivityOn", bold)
    worksheet.write("D1", "JobSearchStatus", bold)
    worksheet.write("E1", "NumberofApplication", bold)
    worksheet.write("F1", "NumberofTimeHire", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("candidate_name"))
        worksheet.write(row, column + 1, item.get("location"))
        worksheet.write(row, column + 2, item.get("last_activity_on"))
        worksheet.write(row, column + 3, item.get("status"))
        worksheet.write(row, column + 4, item.get("applied_count"))
        worksheet.write(row, column + 5, item.get("hired_count"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=CandidateSucessMetric.xlsx"
    return response


class CandidateSucessMetricReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        tenant = get_user_tenant(request)
        all_jobstatus = JobStatus.objects.filter(status="hired").values(
            "status", "user__id", "user__username", "user__location__city", "user__last_login", "user__is_active"
        )
        jobstatus = JobStatus.objects.select_related("user__id").all().values("status", "user__id")
        for user in all_jobstatus:
            if user["user__is_active"] is True:
                status = "Active"
            else:
                status = "Inactive"

            if user["user__last_login"] is None:
                last_activity_on = "Not Found"
            else:
                last_activity_on = user["user__last_login"].date()

            job_dict = dict(
                candidate_name=user["user__username"],
                location=user["user__location__city"],
                last_activity_on=last_activity_on,
                status=status,
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


class CandidateSucessMetricDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        tenant = get_user_tenant(request)
        all_jobstatus = JobStatus.objects.filter(status="hired").values(
            "status", "user__id", "user__username", "user__location__city", "user__last_login", "user__is_active"
        )
        jobstatus = JobStatus.objects.select_related("user__id").all().values("status", "user__id")
        for user in all_jobstatus:
            if user["user__is_active"] is True:
                status = "Active"
            else:
                status = "Inactive"

            if user["user__last_login"] is None:
                last_activity_on = "Not Found"
            else:
                last_activity_on = user["user__last_login"].date()

            job_dict = dict(
                candidate_name=user["user__username"],
                location=user["user__location__city"],
                last_activity_on=last_activity_on,
                status=status,
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


def applicationsource(data_dict):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "JobBoardName", bold)
    worksheet.write("B1", "JobCount", bold)
    worksheet.write("C1", "AppliedCount", bold)
    worksheet.write("D1", "ScreeningCount", bold)
    worksheet.write("E1", "InterviewCount", bold)
    worksheet.write("F1", "OfferedCount", bold)
    worksheet.write("G1", "HiredCount", bold)
    worksheet.write("H1", "DeclinedCount", bold)
    worksheet.write("I1", "OnholdCount", bold)
    worksheet.write("J1", "Canada", bold)

    for item in data_dict:
        column = 0
        worksheet.write(row, column, item.get("jobboard_name"))
        worksheet.write(row, column + 1, item.get("job_count"))
        worksheet.write(row, column + 2, item.get("applied_count"))
        worksheet.write(row, column + 3, item.get("screening_count"))
        worksheet.write(row, column + 4, item.get("interview_count"))
        worksheet.write(row, column + 5, item.get("offered_count"))
        worksheet.write(row, column + 6, item.get("hired_count"))
        worksheet.write(row, column + 7, item.get("declined_count"))
        worksheet.write(row, column + 8, item.get("onhold_count"))
        worksheet.write(row, column + 9, item.get("user__is_ca"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=ApplicationSources.xlsx"
    return response


class ApplicationSourceReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data_dict = []
        data = []
        linkedin_jobstatus = Job.objects.filter(linkedin=True).values("id", "user__is_ca")
        linkedin_count = linkedin_jobstatus.count()
        for job in linkedin_jobstatus:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .all()
                .exclude(user__is_superuser=1)
                .values("current_status", "job__id")
            )
            linkedin_dict = dict(
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data.append(linkedin_dict)
        counter = collections.Counter()
        for i in data:
            counter.update(i)
        result = dict(counter, job_count=linkedin_count, jobboard_name="Linkedin")
        data_dict.append(result)
        data1 = []
        broadbean_jobstatus = Job.objects.filter(broadbean=True).values("id", "user__is_ca")
        broadbean_count = broadbean_jobstatus.count()
        for job in broadbean_jobstatus:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .all()
                .exclude(user__is_superuser=1)
                .values("current_status", "job__id")
            )
            broadbean_dict = dict(
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data1.append(broadbean_dict)
        counter = collections.Counter()
        for i in data1:
            counter.update(i)
        result2 = dict(counter, job_count=broadbean_count, jobboard_name="Broadbean")

        data_dict.append(result2)

        data2 = []
        ziprecuiter_jobstatus = Job.objects.filter(zip_recruiter=True).values("id", "user__is_ca")
        ziprecuiter_count = ziprecuiter_jobstatus.count()
        for job in ziprecuiter_jobstatus:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .all()
                .exclude(user__is_superuser=1)
                .values("current_status", "job__id")
            )
            ziprecuiter_dict = dict(
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data2.append(ziprecuiter_dict)
        counter = collections.Counter()
        for i in data2:
            counter.update(i)
        result3 = dict(counter, job_count=ziprecuiter_count, jobboard_name="Ziprecuiter")

        data_dict.append(result3)

        return api_response(200, "JobApplication Source Count", data_dict)


class ApplicationSourceDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data_dict = []
        data = []
        tenant = get_user_tenant(request)
        linkedin_jobstatus = Job.objects.filter(linkedin=True).values("id", "user__is_ca")
        linkedin_count = linkedin_jobstatus.count()
        for job in linkedin_jobstatus:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .all()
                .exclude(user__is_superuser=1)
                .values("current_status", "job__id")
            )
            linkedin_dict = dict(
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data.append(linkedin_dict)
        counter = collections.Counter()
        for i in data:
            counter.update(i)
        result = dict(counter, job_count=linkedin_count, jobboard_name="Linkedin")
        data_dict.append(result)
        data1 = []
        broadbean_jobstatus = Job.objects.filter(broadbean=True).values("id", "user__is_ca")
        broadbean_count = broadbean_jobstatus.count()
        for job in broadbean_jobstatus:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .all()
                .exclude(user__is_superuser=1)
                .values("current_status", "job__id")
            )
            broadbean_dict = dict(
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data1.append(broadbean_dict)
        counter = collections.Counter()
        for i in data1:
            counter.update(i)
        result2 = dict(counter, job_count=broadbean_count, jobboard_name="Broadbean")

        data_dict.append(result2)

        data2 = []
        ziprecuiter_jobstatus = Job.objects.filter(zip_recruiter=True).values("id", "user__is_ca")
        ziprecuiter_count = ziprecuiter_jobstatus.count()
        for job in ziprecuiter_jobstatus:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .all()
                .exclude(user__is_superuser=1)
                .values("current_status", "job__id")
            )
            ziprecuiter_dict = dict(
                user__is_ca=job["user__is_ca"],
                applied_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "applied"), jobstatus)
                    ),
                ),
                screening_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "screening"), jobstatus
                        )
                    ),
                ),
                interview_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "interview"), jobstatus
                        )
                    ),
                ),
                offered_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "offered"), jobstatus)
                    ),
                ),
                hired_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "hired"), jobstatus)
                    ),
                ),
                declined_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "declined"), jobstatus
                        )
                    ),
                ),
                onhold_count=len(
                    list(
                        filter(lambda js: (js["job__id"] == job["id"] and js["current_status"] == "on-hold"), jobstatus)
                    ),
                ),
                rejected_count=len(
                    list(
                        filter(
                            lambda js: (js["job__id"] == job["id"] and js["current_status"] == "rejected"), jobstatus
                        )
                    ),
                ),
            )
            data2.append(ziprecuiter_dict)
        counter = collections.Counter()
        for i in data2:
            counter.update(i)
        result3 = dict(counter, job_count=ziprecuiter_count, jobboard_name="Ziprecuiter")

        data_dict.append(result3)
        stream_response = applicationsource(data_dict)
        return stream_response


class AdminSurveyListView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):

        obj_survey = Survey.objects.filter(tenant=request.user.tenant)
        serializer = ListSurveySerializer(obj_survey, many=True)
        return api_response(200, "All Surveys", serializer.data)


class AdminSurveyCaListView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):

        obj_survey = Survey.objects.filter(tenant=request.user.tenant)
        serializer = ListCaSurveySerializer(obj_survey, many=True)
        return api_response(200, "All Surveys", serializer.data)


class AdminSurveyDetailView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        survey_id = kwargs["survey_id"]
        obj_survey = Survey.objects.get(tenant=request.user.tenant, id=survey_id)
        serializer = ListSurveySerializer(obj_survey)
        return api_response(200, "survey details", serializer.data)


class AdminSurveyCaDetailView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        survey_id = kwargs["survey_id"]
        obj_survey = Survey.objects.get(tenant=request.user.tenant, id=survey_id)
        serializer = ListCaSurveySerializer(obj_survey)
        return api_response(200, "survey details", serializer.data)

class SurveyFeedbackReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, id):
        headers_list = [
            "Unique Response Id",
            "Submitted Date",
            "Submitted Time",
            "Job Title",
            "Tenant Name",
            "Respondent Name",
            "Email",
        ]
        data = list()
        try:
            survey = Survey.objects.get(id=id, tenant_id=request.user.tenant.id)
        except Survey.DoesNotExist:
            return api_response(404, "survey not found", {})
        survey_feed = SurveyFeedBack.objects.filter(survey_id=survey.id, is_submitted=1, submitted_by__is_ca=0).order_by("-updated_at")
        if not survey_feed:
            return api_response(404, "no survey feedback submitted", {})
        feed_serializer = SurveyFeedbackSerializer(survey_feed[0])

        if survey.event == "post-interview":
            headers_list.append("Job Seeker Name")
        elif survey.event == "job-closed":
            headers_list.append("Tenant Email")

        comment_section_needed = list()
        # Get the questions for the header
        question_count = 1
        for question in feed_serializer.data["questions"]:
            if question["is_sub_question"]:
                for sub_question in question["sub_question"]:
                    headers_list.append(str(question_count) + ". " + sub_question["display_title"])
            else:
                headers_list.append(str(question_count) + "." + question["display_title"])

            if question["display_textbox_options"]:
                headers_list.append(str(question_count) + ". Comment")
                comment_section_needed.append(question["id"])

            question_count += 1
        headers_list.append(".")

        # Fetch the data for the submitted survey feedbacks
        answer_reference_id = 1
        for survey_answers in survey_feed:
            answers = list()
            answers.append(answer_reference_id)
            answer_reference_id += 1
            answers.append(survey_answers.updated_at.strftime("%d-%m-%Y"))
            answers.append(survey_answers.updated_at.strftime("%H:%M:%S"))
            answers.append(survey_answers.job.title)
            answers.append(survey_answers.tenant.name)
            answers.append(survey_answers.submitted_by.get_full_name)
            answers.append(survey_answers.submitted_by.email)
            if survey.event == "post-interview":
                answers.append(survey_answers.user.get_full_name)
            elif survey.event == "job-closed":
                answers.append(survey_answers.job.user.email)

            for answer in survey_answers.answers:
                if answer["is_sub_question"]:
                    for sub_answer in answer["sub_question"]:
                        answers.append(sub_answer["text"])
                elif not answer["answer"] and answer["text"]:
                    answers.append(answer["text"])
                else:
                    answers.append(answer["answer"])
                if answer["question_id"] in comment_section_needed and answer["text"]:
                    answers.append(answer["text"])
                elif answer["question_id"] in comment_section_needed and not answer["text"]:
                    answers.append("NA")

            data.append(answers)
        stream_response = survey_report(headers_list, data, survey.event)
        return stream_response

class SurveyFeedbackCaReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, id):
        headers_list = [
            "Unique Response Id",
            "Submitted Date",
            "Submitted Time",
            "Job Title",
            "Tenant Name",
            "Respondent Name",
            "Email",
        ]
        data = list()
        try:
            survey = Survey.objects.get(id=id, tenant_id=request.user.tenant.id)
        except Survey.DoesNotExist:
            return api_response(404, "survey not found", {})
        survey_feed = SurveyFeedBack.objects.filter(survey_id=survey.id, is_submitted=1, submitted_by__is_ca=1).order_by("-updated_at")
        if not survey_feed:
            return api_response(404, "no survey feedback submitted", {})
        feed_serializer = SurveyFeedbackSerializer(survey_feed[0])

        if survey.event == "post-interview":
            headers_list.append("Job Seeker Name")
        elif survey.event == "job-closed":
            headers_list.append("Tenant Email")

        comment_section_needed = list()
        # Get the questions for the header
        question_count = 1
        for question in feed_serializer.data["questions"]:
            if question["is_sub_question"]:
                for sub_question in question["sub_question"]:
                    headers_list.append(str(question_count) + ". " + sub_question["display_title"])
            else:
                headers_list.append(str(question_count) + "." + question["display_title"])

            if question["display_textbox_options"]:
                headers_list.append(str(question_count) + ". Comment")
                comment_section_needed.append(question["id"])

            question_count += 1
        headers_list.append(".")

        # Fetch the data for the submitted survey feedbacks
        answer_reference_id = 1
        for survey_answers in survey_feed:
            answers = list()
            answers.append(answer_reference_id)
            answer_reference_id += 1
            answers.append(survey_answers.updated_at.strftime("%d-%m-%Y"))
            answers.append(survey_answers.updated_at.strftime("%H:%M:%S"))
            answers.append(survey_answers.job.title)
            answers.append(survey_answers.tenant.name)
            answers.append(survey_answers.submitted_by.get_full_name)
            answers.append(survey_answers.submitted_by.email)
            if survey.event == "post-interview":
                answers.append(survey_answers.user.get_full_name)
            elif survey.event == "job-closed":
                answers.append(survey_answers.job.user.email)

            for answer in survey_answers.answers:
                if answer["is_sub_question"]:
                    for sub_answer in answer["sub_question"]:
                        answers.append(sub_answer["text"])
                elif not answer["answer"] and answer["text"]:
                    answers.append(answer["text"])
                else:
                    answers.append(answer["answer"])
                if answer["question_id"] in comment_section_needed and answer["text"]:
                    answers.append(answer["text"])
                elif answer["question_id"] in comment_section_needed and not answer["text"]:
                    answers.append("NA")

            data.append(answers)
        stream_response = survey_report(headers_list, data, survey.event)
        return stream_response


def survey_report(headers_list, data, file_name):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 65
    # Add headers in bold format to the top row of the worksheet
    bold = workbook.add_format({"bold": True})
    for header in headers_list:
        worksheet.write(chr(column) + str(row), header, bold)
        column += 1

    for data_items in data:
        row += 1
        column = 65
        for item in data_items:
            worksheet.write(chr(column) + str(row), item)
            column += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename={}.xlsx".format(
        file_name + "-report-" + str(int(time.time()))
    )
    return response


class SurveyFeedbackSummary(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, id):
        try:
            survey = Survey.objects.get(id=id, tenant_id=request.user.tenant.id)
        except Survey.DoesNotExist:
            return api_response(404, "survey not found", {})
        survey_feed = SurveyFeedBack.objects.filter(survey_id=survey.id, is_submitted=1, submitted_by__is_ca=0)
        if not survey_feed:
            return api_response(404, "no survey feedback submitted", {})
        feed_serializer = SurveyFeedbackSerializer(survey_feed[0])

        master_survey_dict = {"survey_title": feed_serializer.data["survey_title"]}
        # Create a dictionary with questions and sub-questions
        for question in feed_serializer.data["questions"]:
            survey_dict = dict()
            if question["type"] != "text":
                survey_dict["display_title"] = question["display_title"]
                survey_dict["is_sub_question"] = question["is_sub_question"]

                if question["is_sub_question"]:
                    survey_dict["sub_questions"] = {}
                    for sub_question in question["sub_question"]:
                        survey_dict["sub_questions"][str(sub_question["id"])] = {
                            "display_title": sub_question["display_title"],
                            "answers": {j: 0 for i, j in sub_question["options"].items()},
                        }
                else:
                    survey_dict["answers"] = {j: 0 for i, j in question["options"].items()}
                master_survey_dict[str(question["id"])] = survey_dict

        # Fetch the data for the submitted survey feedbacks
        for survey_answers in survey_feed:
            for answer in survey_answers.answers:
                if answer["is_sub_question"]:
                    for sub_answer in answer["sub_question"]:
                        if sub_answer["text"]:
                            master_survey_dict[str(answer["question_id"])]["sub_questions"][
                                str(sub_answer["sub_question_id"])
                            ]["answers"][sub_answer["text"]] += 1
                elif answer["answer"]:
                    master_survey_dict[str(answer["question_id"])]["answers"][answer["answer"]] += 1
        return api_response(200, "survey details", master_survey_dict)


class SurveyFeedbackCaSummary(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, id):
        try:
            survey = Survey.objects.get(id=id, tenant_id=request.user.tenant.id)
        except Survey.DoesNotExist:
            return api_response(404, "survey not found", {})
        survey_feed = SurveyFeedBack.objects.filter(survey_id=survey.id, is_submitted=1, submitted_by__is_ca=1)
        if not survey_feed:
            return api_response(404, "no survey feedback submitted", {})
        feed_serializer = SurveyFeedbackSerializer(survey_feed[0])

        master_survey_dict = {"survey_title": feed_serializer.data["survey_title"]}
        # Create a dictionary with questions and sub-questions
        for question in feed_serializer.data["questions"]:
            survey_dict = dict()
            if question["type"] != "text":
                survey_dict["display_title"] = question["display_title"]
                survey_dict["is_sub_question"] = question["is_sub_question"]

                if question["is_sub_question"]:
                    survey_dict["sub_questions"] = {}
                    for sub_question in question["sub_question"]:
                        survey_dict["sub_questions"][str(sub_question["id"])] = {
                            "display_title": sub_question["display_title"],
                            "answers": {j: 0 for i, j in sub_question["options"].items()},
                        }
                else:
                    survey_dict["answers"] = {j: 0 for i, j in question["options"].items()}
                master_survey_dict[str(question["id"])] = survey_dict

        # Fetch the data for the submitted survey feedbacks
        for survey_answers in survey_feed:
            for answer in survey_answers.answers:
                if answer["is_sub_question"]:
                    for sub_answer in answer["sub_question"]:
                        if sub_answer["text"]:
                            master_survey_dict[str(answer["question_id"])]["sub_questions"][
                                str(sub_answer["sub_question_id"])
                            ]["answers"][sub_answer["text"]] += 1
                elif answer["answer"]:
                    master_survey_dict[str(answer["question_id"])]["answers"][answer["answer"]] += 1
        return api_response(200, "survey details", master_survey_dict)


class AuditLoginReport(APIView):
    """
    This class is for generating the report for login details (unique and all) for a period of time
    """

    permission_classes = (IsAdminUser,)

    def get(self, request):
        report_type = request.query_params["report_type"]
        time_duration = int(request.query_params["period"])
        tenant = get_user_tenant(request)
        audits = Audit.objects.filter(
            tenant_id=tenant.id, date__gt=datetime.datetime.today() - datetime.timedelta(days=time_duration)
        ).order_by("-date")
        # Create data frame for Audit
        audit_serializer = AuditSerializer(audits, many=True)
        audit_df = pd.DataFrame(audit_serializer.data)

        audit_df["time"] = audit_df["date"].apply(lambda x: x.split("T")[1].split('.')[0])
        audit_df["date"] = audit_df["date"].apply(lambda x: x.split("T")[0])

        # Get unique user_ids
        unique_user_id = audit_df["user_id"].unique()

        if report_type == "unique":
            audit_df = audit_df.groupby("user_id").size().reset_index(name="login_count")
        else:
            audit_df = audit_df.drop(["id", "table_name", "table_row", "action", "tenant_id", "data"], axis=1)

        # Create data frame for users
        users = User.objects.filter(id__in=unique_user_id, is_ca=0)
        if not users:
            return api_response(404, "users not found", {})
        user_serializer = AdminUserSerializer(users, many=True)
        user_df = pd.DataFrame(user_serializer.data)
        user_df.rename(columns={"id": "user_id"}, inplace=True)

        final_df = audit_df.merge(user_df, on="user_id", how="right")
        final_df = final_df.fillna("")
        final_df = final_df.drop(["role_id", "tenant", "email", "username"], axis=1)

        # Report for fetching the login count role wise and date wise
        if report_type == "rolewise":
            grand_total = len(final_df)
            final_df = final_df.groupby("role_name")
            data_list = list()
            headers = ["Role", "Date", "Number Of Last Logins"]
            for role, data in final_df:
                data_list.append([role, "", len(data)])
                data["date"] = data["date"].apply(lambda x: x.split("T")[0])
                date_grouped_data = data.groupby("date").size().reset_index(name="date_f").values.tolist()
                for date_data in date_grouped_data:
                    date_data.insert(0, "")
                    data_list.append(date_data)
            data_list.append([])
            data_list.append(["Grand Total", "", grand_total])
            stream_response = survey_report(
                headers, data_list, "user_login_audit_" + report_type + "_" + str(time_duration) + "_days"
            )
        else:
            stream_response = survey_report(
                final_df.columns,
                final_df.values.tolist(),
                "user_login_audit_" + report_type + "_" + str(time_duration) + "_days",
            )
        return stream_response

class AuditLoginCaReport(APIView):
    """
    This class is for generating the report for login details (unique and all) for a period of time
    """

    permission_classes = (IsAdminUser,)

    def get(self, request):
        report_type = request.query_params["report_type"]
        time_duration = int(request.query_params["period"])
        tenant = get_user_tenant(request)
        audits = Audit.objects.filter(
            tenant_id=tenant.id, date__gt=datetime.datetime.today() - datetime.timedelta(days=time_duration)
        ).order_by("-date")
        # Create data frame for Audit
        audit_serializer = AuditSerializer(audits, many=True)
        audit_df = pd.DataFrame(audit_serializer.data)

        audit_df["time"] = audit_df["date"].apply(lambda x: x.split("T")[1].split('.')[0])
        audit_df["date"] = audit_df["date"].apply(lambda x: x.split("T")[0])

        # Get unique user_ids
        unique_user_id = audit_df["user_id"].unique()

        if report_type == "unique":
            audit_df = audit_df.groupby("user_id").size().reset_index(name="login_count")
        else:
            audit_df = audit_df.drop(["id", "table_name", "table_row", "action", "tenant_id", "data"], axis=1)

        # Create data frame for users
        users = User.objects.filter(id__in=unique_user_id, is_ca=1)
        if not users:
            return api_response(404, "users not found", {})
        user_serializer = AdminUserSerializer(users, many=True)
        user_df = pd.DataFrame(user_serializer.data)
        user_df.rename(columns={"id": "user_id"}, inplace=True)

        final_df = audit_df.merge(user_df, on="user_id", how="right")
        final_df = final_df.fillna("")
        final_df = final_df.drop(["role_id", "tenant", "email", "username"], axis=1)

        # Report for fetching the login count role wise and date wise
        if report_type == "rolewise":
            grand_total = len(final_df)
            final_df = final_df.groupby("role_name")
            data_list = list()
            headers = ["Role", "Date", "Number Of Last Logins"]
            for role, data in final_df:
                data_list.append([role, "", len(data)])
                data["date"] = data["date"].apply(lambda x: x.split("T")[0])
                date_grouped_data = data.groupby("date").size().reset_index(name="date_f").values.tolist()
                for date_data in date_grouped_data:
                    date_data.insert(0, "")
                    data_list.append(date_data)
            data_list.append([])
            data_list.append(["Grand Total", "", grand_total])
            stream_response = survey_report(
                headers, data_list, "user_login_audit_" + report_type + "_" + str(time_duration) + "_days"
            )
        else:
            stream_response = survey_report(
                final_df.columns,
                final_df.values.tolist(),
                "user_login_audit_" + report_type + "_" + str(time_duration) + "_days",
            )
        return stream_response
