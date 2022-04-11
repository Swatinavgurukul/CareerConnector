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
from core.get_tenant import get_user_tenant
from datetime import datetime


def downloadFile(data):
    # if not os.path.exists("media/reports"):
    #     os.makedirs("media/reports")
    # fileName = "media/reports/Current_Pipeline.xlsx"
    # workbook = xlsxwriter.Workbook(fileName)
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
    worksheet.write("E1", "JobStartDate", bold)
    worksheet.write("F1", "JobEndDate", bold)
    worksheet.write("G1", "AppliedCount", bold)
    worksheet.write("H1", "ScreeningCount", bold)
    worksheet.write("I1", "InterviewCount", bold)
    worksheet.write("J1", "OfferedCount", bold)
    worksheet.write("K1", "HiredCount", bold)
    worksheet.write("L1", "DeclinedCount", bold)
    worksheet.write("M1", "OnholdCount", bold)
    worksheet.write("N1", "RejectedCount", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("company_name"))
        worksheet.write(row, column + 2, item.get("location"))
        worksheet.write(row, column + 3, item.get("job_type"))
        worksheet.write(row, column + 4, item.get("job_start_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 5, item.get("job_end_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 6, item.get("applied_count"))
        worksheet.write(row, column + 7, item.get("screening_count"))
        worksheet.write(row, column + 8, item.get("interview_count"))
        worksheet.write(row, column + 9, item.get("offered_count"))
        worksheet.write(row, column + 10, item.get("hired_count"))
        worksheet.write(row, column + 11, item.get("declined_count"))
        worksheet.write(row, column + 12, item.get("onhold_count"))
        worksheet.write(row, column + 13, item.get("rejected_count"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Current_Pipeline.xlsx"
    return response


def historicreport(data):
    # if not os.path.exists("media/reports"):
    #     os.makedirs("media/reports")
    # fileName = "media/reports/Current_Pipeline.xlsx"
    # workbook = xlsxwriter.Workbook(fileName)
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
    worksheet.write("E1", "JobStartDate", bold)
    worksheet.write("F1", "JobEndDate", bold)
    worksheet.write("G1", "AppliedCount", bold)
    worksheet.write("H1", "ScreeningCount", bold)
    worksheet.write("I1", "InterviewCount", bold)
    worksheet.write("J1", "OfferedCount", bold)
    worksheet.write("K1", "HiredCount", bold)
    worksheet.write("L1", "DeclinedCount", bold)
    worksheet.write("M1", "OnholdCount", bold)
    worksheet.write("N1", "RejectedCount", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("company_name"))
        worksheet.write(row, column + 2, item.get("location"))
        worksheet.write(row, column + 3, item.get("job_type"))
        if item.get("job_start_date") is not None:
            worksheet.write(row, column + 4, item.get("job_start_date").strftime("%d/%m/%Y"))
        else:
            worksheet.write(row, column + 4, "N/A")
        if item.get("job_end_date") is not None:
            worksheet.write(row, column + 5, item.get("job_end_date").strftime("%d/%m/%Y"))
        else:
            worksheet.write(row, column + 5, "N/A")
        worksheet.write(row, column + 6, item.get("applied_count"))
        worksheet.write(row, column + 7, item.get("screening_count"))
        worksheet.write(row, column + 8, item.get("interview_count"))
        worksheet.write(row, column + 9, item.get("offered_count"))
        worksheet.write(row, column + 10, item.get("hired_count"))
        worksheet.write(row, column + 11, item.get("declined_count"))
        worksheet.write(row, column + 12, item.get("onhold_count"))
        worksheet.write(row, column + 13, item.get("rejected_count"))
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
        if request.user.role_id == 2:
            if "active" in request.data.values():
                all_jobstatus = Job.objects.filter(status="active").values(
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
                )
            else:
                pass
                # all_jobstatus = Job.objects.filter(status="closed").values(
                #     "id",
                #     "title",
                #     "tenant__name",
                #     "display_name",
                #     "state",
                #     "country",
                #     "job_type__name",
                #     "job_start_date",
                #     "job_end_date",
                #     "status",
                # )
        else:
            if "active" in request.data.values():
                all_jobstatus = Job.objects.filter(tenant=request.user.tenant.id, status="active").values(
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
                )
            else:
                all_jobstatus = Job.objects.filter(tenant=request.user.tenant.id, status="closed").values(
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
                )
        if request.user.role_id == 2:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .filter(tenant=request.user.tenant.id)
                .values("current_status", "job__id")
            )
        else:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .filter(job_tenant=request.user.tenant.id)
                .values("current_status", "job__id")
            )
        for job in all_jobstatus:
            if job["display_name"] == None or job["display_name"] == "":
                city = ""
            else:
                city = job["display_name"] + "," + job["state"] + "," + job["country"]
            job_dict = dict(
                # job_id=job.job.id,
                title=job["title"],
                title_esp=job["title_esp"],
                title_fr=job["title_fr"],
                company_name=job["tenant__name"],
                location=city,
                job_start_date=job["job_start_date"],
                job_end_date=job["job_end_date"],
                job_status=job["status"],
                job_type=job["job_type__name"],
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
        if request.user.role_id == 2:
            if "active" in request.data.values():
                all_jobstatus = Job.objects.filter(status="active").values(
                    "id",
                    "title",
                    "tenant__name",
                    "display_name",
                    "state",
                    "country",
                    "job_type__name",
                    "job_start_date",
                    "job_end_date",
                    "status",
                )
            else:
                pass
                # all_jobstatus = Job.objects.filter(status="closed").values(
                #     "id",
                #     "title",
                #     "tenant__name",
                #     "display_name",
                #     "state",
                #     "country",
                #     "job_type__name",
                #     "job_start_date",
                #     "job_end_date",
                #     "status",
                # )
        else:
            if "active" in request.data.values():
                all_jobstatus = Job.objects.filter(tenant=request.user.tenant.id, status="active").values(
                    "id",
                    "title",
                    "tenant__name",
                    "display_name",
                    "state",
                    "country",
                    "job_type__name",
                    "job_start_date",
                    "job_end_date",
                    "status",
                )
            else:
                all_jobstatus = Job.objects.filter(tenant=request.user.tenant.id, status="closed").values(
                    "id",
                    "title",
                    "tenant__name",
                    "display_name",
                    "state",
                    "country",
                    "job_type__name",
                    "job_start_date",
                    "job_end_date",
                    "status",
                )
        if request.user.role_id == 2:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .filter(tenant=request.user.tenant.id)
                .values("current_status", "job__id")
            )
        else:
            jobstatus = (
                JobApplication.objects.select_related("job__id")
                .filter(job_tenant=request.user.tenant.id)
                .values("current_status", "job__id")
            )
        for job in all_jobstatus:
            if job["display_name"] == None or job["display_name"] == "":
                city = ""
            else:
                city = job["display_name"] + "," + job["state"] + "," + job["country"]
            job_dict = dict(
                # job_id=job.job.id,
                title=job["title"],
                company_name=job["tenant__name"],
                location=city,
                job_start_date=job["job_start_date"],
                job_end_date=job["job_end_date"],
                status=job["status"],
                job_type=job["job_type__name"],
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
        elif "active" in data[0]["status"]:
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
    worksheet.write("B1", "JobFunction", bold)
    worksheet.write("C1", "HiredJobSeeker", bold)
    worksheet.write("D1", "JobOpenDate", bold)
    worksheet.write("E1", "JobCloseDate", bold)
    worksheet.write("F1", "TimeToFill", bold)
    worksheet.write("G1", "TimeToHire", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("title"))
        worksheet.write(row, column + 1, item.get("job_function"))
        worksheet.write(row, column + 2, item.get("hired_job_seeker"))
        worksheet.write(row, column + 3, item.get("job_open_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 4, item.get("job_close_date").strftime("%d/%m/%Y"))
        worksheet.write(row, column + 5, item.get("time_to_fill"))
        worksheet.write(row, column + 6, item.get("time_to_hire"))

        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Timetohire.xlsx"
    return response


class TimetohireReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_jobstatus = JobApplication.objects.filter(job_tenant=request.user.tenant.id, current_status="hired").values(
            "job__title",
            "job__title_esp",
            "job__title_fr",
            "job__industry__name",
            "job__category__name",
            "user__first_name",
            "user__last_name",
            "job__job_start_date",
            "job__job_end_date",
            "created_at",
            "job__created_at",
            "user_id",
            "job_id",
        )
        for job in all_jobstatus:
            if job["user__last_name"] is None:
                last_name = ""
            else:
                last_name = job["user__last_name"]

            applied_job = (
                JobStatus.objects.filter(user_id=job["user_id"], job_id=job["job_id"], status="applied")
                .values("created_at")
                .first()
            )
            if (applied_job["created_at"].date() - job["job__job_start_date"]).days <= 0:
                fill_days = 0
            else:
                fill_days = (applied_job["created_at"].date() - job["job__job_start_date"]).days

            if (job["created_at"].date() - applied_job["created_at"].date()).days <= 0:
                hire_days = 0
            else:
                hire_days = (job["created_at"].date() - applied_job["created_at"].date()).days

            job_dict = dict(
                title=job["job__title"],
                title_esp=job["job__title_esp"],
                title_fr=job["job__title_fr"],
                job_function=job["job__category__name"],
                hired_job_seeker=str(job["user__first_name"]) + " " + str(last_name),
                job_open_date=job["job__job_start_date"],
                job_close_date=job["job__job_end_date"],
                # hiring_date=job["created_at"].date(),
                time_to_fill=fill_days,
                time_to_hire=hire_days,
            )
            data.append(job_dict)
        return api_response(200, "Hired Applicant Day", data)


class TimetohireDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = []
        all_jobstatus = JobApplication.objects.filter(job_tenant=request.user.tenant.id, current_status="hired").values(
            "job__title",
            "job__industry__name",
            "user__first_name",
            "user__last_name",
            "job__job_start_date",
            "job__job_end_date",
            "created_at",
            "job__created_at",
            "user_id",
            "job_id",
        )
        for job in all_jobstatus:
            if job["user__last_name"] is None:
                last_name = ""
            else:
                last_name = job["user__last_name"]

            applied_job = (
                JobStatus.objects.filter(user_id=job["user_id"], job_id=job["job_id"], status="applied")
                .values("created_at")
                .first()
            )

            if (applied_job["created_at"].date() - job["job__job_start_date"]).days <= 0:
                fill_days = 0
            else:
                fill_days = (applied_job["created_at"].date() - job["job__job_start_date"]).days

            if (job["created_at"].date() - applied_job["created_at"].date()).days <= 0:
                hire_days = 0
            else:
                hire_days = (job["created_at"].date() - applied_job["created_at"].date()).days

            job_dict = dict(
                title=job["job__title"],
                job_function=job["job__industry__name"],
                hired_job_seeker=str(job["user__first_name"]) + " " + str(last_name),
                job_open_date=job["job__job_start_date"],
                job_close_date=job["job__job_end_date"],
                # hiring_date=job["created_at"].date(),
                time_to_fill=fill_days,
                time_to_hire=hire_days,
            )
            data.append(job_dict)
        stream_response = timetohire(data)
        return stream_response


class HiringVelocityReport(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request):
        data = []
        all_jobstatus = JobStatus.objects.filter(job_tenant=request.user.tenant.id)
        applied_count = all_jobstatus.filter(status="applied").distinct().values("user_id", "job_id").count()
        if applied_count != 0:
            created_at = all_jobstatus.filter(status="applied").distinct().values("created_at")
            applied = []
            for applied_status in created_at:
                today_date = datetime.today()
                applied_status = created_at[0]["created_at"].date()
                day = (today_date.date() - applied_status).days
                applied.append(day)
            total = sum(applied)
            job_dict = dict(status="Applied", count=applied_count, average=int(total / applied_count))
            data.append(job_dict)
        else:
            job_dict = dict(status="Applied", count=applied_count, average=0)
            data.append(job_dict)

        screening_count = all_jobstatus.filter(status="screening").distinct().values("user_id", "job_id").count()
        if screening_count != 0:
            created_at = all_jobstatus.filter(status="screening").distinct().values("created_at")
            screening = []
            for screening_status in created_at:
                today_date = datetime.today()
                screening_status = created_at[0]["created_at"].date()
                day = (today_date.date() - screening_status).days
                screening.append(day)
            total = sum(screening)
            screening_dict = dict(status="Screening", count=screening_count, average=int(total / screening_count))
            data.append(screening_dict)
        else:
            screening_dict = dict(status="Screening", count=screening_count, average=0)
            data.append(screening_dict)

        interview_count = all_jobstatus.filter(status="interview").distinct().values("user_id", "job_id").count()
        if interview_count != 0:

            created_at = all_jobstatus.filter(status="interview").distinct().values("created_at")
            interview = []
            for interview_status in created_at:
                today_date = datetime.today()
                interview_status = created_at[0]["created_at"].date()
                day = (today_date.date() - interview_status).days
                interview.append(day)
            total = sum(interview)
            interview_dict = dict(status="Interview", count=interview_count, average=int(total / interview_count))
            data.append(interview_dict)
        else:
            interview_dict = dict(status="Interview", count=interview_count, average=0)
            data.append(interview_dict)

        offered_count = all_jobstatus.filter(status="offered").distinct().values("user_id", "job_id").count()
        if offered_count != 0:
            created_at = all_jobstatus.filter(status="offered").distinct().values("created_at")
            offered = []
            for offered_status in created_at:
                today_date = datetime.today()
                offered_status = created_at[0]["created_at"].date()
                day = (today_date.date() - offered_status).days
                offered.append(day)
            total = sum(offered)
            offered_dict = dict(status="Offered", count=offered_count, average=int(total / offered_count))
            data.append(offered_dict)
        else:
            offered_dict = dict(status="Offered", count=offered_count, average=0)
            data.append(offered_dict)

        hired_count = all_jobstatus.filter(status="hired").distinct().values("user_id", "job_id").count()
        if hired_count != 0:

            created_at = all_jobstatus.filter(status="hired").distinct().values("created_at")
            hired = []
            for hired_status in created_at:
                today_date = datetime.today()
                hired_status = created_at[0]["created_at"].date()
                day = (today_date.date() - hired_status).days
                hired.append(day)
            total = sum(hired)
            hired_dict = dict(status="Hired", count=hired_count, average=int(total / hired_count))
            data.append(hired_dict)
        else:
            hired_dict = dict(status="Hired", count=hired_count, average=0)
            data.append(hired_dict)

        declined_count = all_jobstatus.filter(status="declined").distinct().values("user_id", "job_id").count()
        if declined_count != 0:
            created_at = all_jobstatus.filter(status="declined").distinct().values("created_at")
            declined = []
            for declined_status in created_at:
                today_date = datetime.today()
                declined_status = created_at[0]["created_at"].date()
                day = (today_date.date() - declined_status).days
                declined.append(day)
            total = sum(declined)
            declined_dict = dict(status="Declined", count=declined_count, average=int(total / declined_count))
            data.append(declined_dict)
        else:
            declined_dict = dict(status="Declined", count=declined_count, average=0)
            data.append(declined_dict)

        on_hold_count = all_jobstatus.filter(status="on-hold").distinct().values("user_id", "job_id").count()
        if on_hold_count != 0:
            created_at = all_jobstatus.filter(status="on-hold").distinct().values("created_at")
            on_hold = []
            for on_hold_status in created_at:
                today_date = datetime.today()
                on_hold_status = created_at[0]["created_at"].date()
                day = (today_date.date() - on_hold_status).days
                on_hold.append(day)
            total = sum(on_hold)
            declined_dict = dict(status="OnHold", count=on_hold_count, average=int(total / on_hold_count))
            data.append(declined_dict)
        else:
            declined_dict = dict(status="OnHold", count=on_hold_count, average=0)
            data.append(declined_dict)

        rejected_count = all_jobstatus.filter(status="rejected").distinct().values("user_id", "job_id").count()
        if rejected_count != 0:
            created_at = all_jobstatus.filter(status="rejected").distinct().values("created_at")
            rejected = []
            for rejected_status in created_at:
                today_date = datetime.today()
                rejected_status = created_at[0]["created_at"].date()
                day = (today_date.date() - rejected_status).days
                rejected.append(day)
            total = sum(rejected)
            rejected_dict = dict(status="Rejected", count=rejected_count, average=int(total / rejected_count))
            data.append(rejected_dict)
        else:
            rejected_dict = dict(status="Rejected", count=rejected_count, average=0)
            data.append(rejected_dict)
        return api_response(200, "Hired Velocity", data)


def hirevelocity(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    row = 1
    column = 0
    bold = workbook.add_format({"bold": True})
    worksheet.write("A1", "Status", bold)
    worksheet.write("B1", "CountOfJobSeeker", bold)
    worksheet.write("C1", "AvgDaysInStage", bold)

    for item in data:
        column = 0
        worksheet.write(row, column, item.get("status"))
        worksheet.write(row, column + 1, item.get("count"))
        worksheet.write(row, column + 2, item.get("average"))
        row += 1
    workbook.close()
    output.seek(0)
    response = StreamingHttpResponse(
        output, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Timetohire.xlsx"
    return response


class HiringVelocityDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request):
        data = []
        all_jobstatus = JobStatus.objects.filter(job_tenant=request.user.tenant.id)
        applied_count = all_jobstatus.filter(status="applied").distinct().values("user_id", "job_id").count()
        if applied_count != 0:
            created_at = all_jobstatus.filter(status="applied").distinct().values("created_at")
            applied = []
            for applied_status in created_at:
                today_date = datetime.today()
                applied_status = created_at[0]["created_at"].date()
                day = (today_date.date() - applied_status).days
                applied.append(day)
            total = sum(applied)
            job_dict = dict(status="Applied", count=applied_count, average=int(total / applied_count))
            data.append(job_dict)
        else:
            job_dict = dict(status="Applied", count=applied_count, average=0)
            data.append(job_dict)

        screening_count = all_jobstatus.filter(status="screening").distinct().values("user_id", "job_id").count()
        if screening_count != 0:
            created_at = all_jobstatus.filter(status="screening").distinct().values("created_at")
            screening = []
            for screening_status in created_at:
                today_date = datetime.today()
                screening_status = created_at[0]["created_at"].date()
                day = (today_date.date() - screening_status).days
                screening.append(day)
            total = sum(screening)
            screening_dict = dict(status="Screening", count=screening_count, average=int(total / screening_count))
            data.append(screening_dict)
        else:
            screening_dict = dict(status="Screening", count=screening_count, average=0)
            data.append(screening_dict)

        interview_count = all_jobstatus.filter(status="interview").distinct().values("user_id", "job_id").count()
        if interview_count != 0:

            created_at = all_jobstatus.filter(status="interview").distinct().values("created_at")
            interview = []
            for interview_status in created_at:
                today_date = datetime.today()
                interview_status = created_at[0]["created_at"].date()
                day = (today_date.date() - interview_status).days
                interview.append(day)
            total = sum(interview)
            interview_dict = dict(status="Interview", count=interview_count, average=int(total / interview_count))
            data.append(interview_dict)
        else:
            interview_dict = dict(status="Interview", count=interview_count, average=0)
            data.append(interview_dict)

        offered_count = all_jobstatus.filter(status="offered").distinct().values("user_id", "job_id").count()
        if offered_count != 0:
            created_at = all_jobstatus.filter(status="offered").distinct().values("created_at")
            offered = []
            for offered_status in created_at:
                today_date = datetime.today()
                offered_status = created_at[0]["created_at"].date()
                day = (today_date.date() - offered_status).days
                offered.append(day)
            total = sum(offered)
            offered_dict = dict(status="Offered", count=offered_count, average=int(total / offered_count))
            data.append(offered_dict)
        else:
            offered_dict = dict(status="Offered", count=offered_count, average=0)
            data.append(offered_dict)

        hired_count = all_jobstatus.filter(status="hired").distinct().values("user_id", "job_id").count()
        if hired_count != 0:

            created_at = all_jobstatus.filter(status="hired").distinct().values("created_at")
            hired = []
            for hired_status in created_at:
                today_date = datetime.today()
                hired_status = created_at[0]["created_at"].date()
                day = (today_date.date() - hired_status).days
                hired.append(day)
            total = sum(hired)
            hired_dict = dict(status="Hired", count=hired_count, average=int(total / hired_count))
            data.append(hired_dict)
        else:
            hired_dict = dict(status="Hired", count=hired_count, average=0)
            data.append(hired_dict)

        declined_count = all_jobstatus.filter(status="declined").distinct().values("user_id", "job_id").count()
        if declined_count != 0:
            created_at = all_jobstatus.filter(status="declined").distinct().values("created_at")
            declined = []
            for declined_status in created_at:
                today_date = datetime.today()
                declined_status = created_at[0]["created_at"].date()
                day = (today_date.date() - declined_status).days
                declined.append(day)
            total = sum(declined)
            declined_dict = dict(status="Declined", count=declined_count, average=int(total / declined_count))
            data.append(declined_dict)
        else:
            declined_dict = dict(status="Declined", count=declined_count, average=0)
            data.append(declined_dict)

        on_hold_count = all_jobstatus.filter(status="on-hold").distinct().values("user_id", "job_id").count()
        if on_hold_count != 0:
            created_at = all_jobstatus.filter(status="on-hold").distinct().values("created_at")
            on_hold = []
            for on_hold_status in created_at:
                today_date = datetime.today()
                on_hold_status = created_at[0]["created_at"].date()
                day = (today_date.date() - on_hold_status).days
                on_hold.append(day)
            total = sum(on_hold)
            declined_dict = dict(status="OnHold", count=on_hold_count, average=int(total / on_hold_count))
            data.append(declined_dict)
        else:
            declined_dict = dict(status="OnHold", count=on_hold_count, average=0)
            data.append(declined_dict)

        rejected_count = all_jobstatus.filter(status="rejected").distinct().values("user_id", "job_id").count()
        if rejected_count != 0:
            created_at = all_jobstatus.filter(status="rejected").distinct().values("created_at")
            rejected = []
            for rejected_status in created_at:
                today_date = datetime.today()
                rejected_status = created_at[0]["created_at"].date()
                day = (today_date.date() - rejected_status).days
                rejected.append(day)
            total = sum(rejected)
            rejected_dict = dict(status="Rejected", count=rejected_count, average=int(total / rejected_count))
            data.append(rejected_dict)
        else:
            rejected_dict = dict(status="Rejected", count=rejected_count, average=0)
            data.append(rejected_dict)

        stream_response = hirevelocity(data)
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
    worksheet.write("C1", "BoardStrikeRate", bold)
    worksheet.write("D1", "AppliedCount", bold)
    worksheet.write("E1", "ScreeningCount", bold)
    worksheet.write("F1", "InterviewCount", bold)
    worksheet.write("G1", "OfferedCount", bold)
    worksheet.write("H1", "HiredCount", bold)
    worksheet.write("I1", "DeclinedCount", bold)
    worksheet.write("J1", "OnholdCount", bold)
    worksheet.write("K1", "RejectedCount", bold)

    for item in data_dict:
        column = 0
        worksheet.write(row, column, item.get("jobboard_name"))
        worksheet.write(row, column + 1, item.get("job_count"))
        worksheet.write(row, column + 2, item.get("broad_strike_rate"))
        worksheet.write(row, column + 3, item.get("applied_count"))
        worksheet.write(row, column + 4, item.get("screening_count"))
        worksheet.write(row, column + 5, item.get("interview_count"))
        worksheet.write(row, column + 6, item.get("offered_count"))
        worksheet.write(row, column + 7, item.get("hired_count"))
        worksheet.write(row, column + 8, item.get("declined_count"))
        worksheet.write(row, column + 9, item.get("onhold_count"))
        worksheet.write(row, column + 10, item.get("rejected_count"))
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
        career_connector = []
        if request.user.role_id == 2:
            career_jobstatus = Job.objects.exclude(linkedin=True).values("id")
            career_count = career_jobstatus.count()
        else:
            career_jobstatus = Job.objects.filter(tenant=request.user.tenant.id).exclude(linkedin=True).values("id")
            career_count = career_jobstatus.count()
        for job in career_jobstatus:
            if request.user.role_id == 2:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            else:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(job_tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            career_dict = dict(
                applied_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "applied"), jobstatus)),
                ),
                screening_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "screening"), jobstatus)),
                ),
                interview_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "interview"), jobstatus)),
                ),
                offered_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "offered"), jobstatus)),
                ),
                hired_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "hired"), jobstatus)),
                ),
                declined_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "declined"), jobstatus)),
                ),
                onhold_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "on-hold"), jobstatus)),
                ),
                rejected_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "rejected"), jobstatus)),
                ),
            )
            career_connector.append(career_dict)
        counter = collections.Counter()
        for i in career_connector:
            counter.update(i)

        career_applied = counter["applied_count"]
        career_hired = counter["hired_count"]
        try:
            career_strike = career_hired / career_applied * 100
            strike = "%0.2f" % career_strike
        except ZeroDivisionError:
            strike = 0
        result2 = dict(
            counter,
            job_count=career_count,
            broad_strike_rate=str(strike) + " %",
            jobboard_name="Microsoft Career Connector",
        )
        data_dict.append(result2)

        data = []
        if request.user.role_id == 2:
            linkedin_jobstatus = Job.objects.filter(linkedin=True).values("id")
            linkedin_count = linkedin_jobstatus.count()
        else:
            linkedin_jobstatus = Job.objects.filter(tenant=request.user.tenant.id, linkedin=True).values("id")
            linkedin_count = linkedin_jobstatus.count()
        for job in linkedin_jobstatus:
            if request.user.role_id == 2:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            else:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(job_tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            linkedin_dict = dict(
                applied_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "applied"), jobstatus)),
                ),
                screening_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "screening"), jobstatus)),
                ),
                interview_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "interview"), jobstatus)),
                ),
                offered_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "offered"), jobstatus)),
                ),
                hired_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "hired"), jobstatus)),
                ),
                declined_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "declined"), jobstatus)),
                ),
                onhold_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "on-hold"), jobstatus)),
                ),
                rejected_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "rejected"), jobstatus)),
                ),
            )
            data.append(linkedin_dict)
        counter = collections.Counter()

        for i in data:
            counter.update(i)

        linkedin_applied = counter["applied_count"]
        linkedin_hired = counter["hired_count"]
        try:
            linkedin_strike = linkedin_hired / linkedin_applied * 100
            strike = "%0.2f" % linkedin_strike
        except ZeroDivisionError:
            strike = 0
        result = dict(counter, job_count=linkedin_count, broad_strike_rate=str(strike) + " %", jobboard_name="LinkedIn")
        data_dict.append(result)
        return api_response(200, "JobApplication Source Count", data_dict)


class ApplicationSourceDownloadReport(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data_dict = []
        career_connector = []
        if request.user.role_id == 2:
            career_jobstatus = Job.objects.exclude(linkedin=True).values("id")
            career_count = career_jobstatus.count()
        else:
            career_jobstatus = Job.objects.filter(tenant=request.user.tenant.id).exclude(linkedin=True).values("id")
            career_count = career_jobstatus.count()
        for job in career_jobstatus:
            if request.user.role_id == 2:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            else:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(job_tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            career_dict = dict(
                applied_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "applied"), jobstatus)),
                ),
                screening_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "screening"), jobstatus)),
                ),
                interview_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "interview"), jobstatus)),
                ),
                offered_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "offered"), jobstatus)),
                ),
                hired_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "hired"), jobstatus)),
                ),
                declined_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "declined"), jobstatus)),
                ),
                onhold_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "on-hold"), jobstatus)),
                ),
                rejected_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "rejected"), jobstatus)),
                ),
            )
            career_connector.append(career_dict)

        counter = collections.Counter()
        for i in career_connector:
            counter.update(i)

        career_applied = counter["applied_count"]
        career_hired = counter["hired_count"]
        try:
            career_strike = career_hired / career_applied * 100
            strike = "%0.2f" % career_strike
        except ZeroDivisionError:
            strike = 0
        result2 = dict(
            counter,
            job_count=career_count,
            broad_strike_rate=str(strike) + " %",
            jobboard_name="Microsoft Career Connector",
        )
        data_dict.append(result2)

        data = []
        if request.user.role_id == 2:
            linkedin_jobstatus = Job.objects.filter(linkedin=True).values("id")
            linkedin_count = linkedin_jobstatus.count()
        else:
            linkedin_jobstatus = Job.objects.filter(tenant=request.user.tenant.id, linkedin=True).values("id")
            linkedin_count = linkedin_jobstatus.count()
        for job in linkedin_jobstatus:
            if request.user.role_id == 2:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            else:
                jobstatus = (
                    JobStatus.objects.select_related("job__id")
                    .filter(job_tenant=request.user.tenant.id)
                    .values("status", "job__id")
                )
            linkedin_dict = dict(
                applied_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "applied"), jobstatus)),
                ),
                screening_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "screening"), jobstatus)),
                ),
                interview_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "interview"), jobstatus)),
                ),
                offered_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "offered"), jobstatus)),
                ),
                hired_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "hired"), jobstatus)),
                ),
                declined_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "declined"), jobstatus)),
                ),
                onhold_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "on-hold"), jobstatus)),
                ),
                rejected_count=len(
                    list(filter(lambda js: (js["job__id"] == job["id"] and js["status"] == "rejected"), jobstatus)),
                ),
            )
            data.append(linkedin_dict)
        counter = collections.Counter()
        for i in data:
            counter.update(i)
        linkedin_applied = counter["applied_count"]
        linkedin_hired = counter["hired_count"]
        try:
            linkedin_strike = linkedin_hired / linkedin_applied * 100
            strike = "%0.2f" % linkedin_strike
        except ZeroDivisionError:
            strike = 0
        result = dict(counter, job_count=linkedin_count, broad_strike_rate=str(strike) + " %", jobboard_name="LinkedIn")
        data_dict.append(result)

        stream_response = applicationsource(data_dict)
        return stream_response
