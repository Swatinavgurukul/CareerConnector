from django.urls import path
from job.views.job_api import (
    JobCreateView,
    JobDetailView,
    JobUpdateView,
    JobDeleteView,
    JobApplyView,
    BookMarkListView,
    JobAppliedListView,
    JobAlertView,
    CompareView,
    JobCompanyView,
    JobRejectionView,
    JobAppliedView,
    JobBookmarkView,
    SimilarJobsView,
    JobCreateURLView,
    WithdrawJobApplicationView,
    HiringTeamView,
    RecommendedJobsView,
)
from job.views.job_parser_api import (
    ParseJobView,
    ParseJobBase64View,
    BimetricScoreView,
    BimetricScoreLatestVersionView,
    JobParserAPI,
)

from job.views.job_survey import SurveyFeedback
from job.views.search_api import JobSearchView

# from job.views.elastic_search import JobSearchView

from job.views.match_score_api import MatchListView
from job.views.job_template_api import JobTemplateView

from job.views.reports import (
    CurrentPipelineReport,
    CurrentPipelineDownloadReport,
    TimetohireReport,
    TimetohireDownloadReport,
    ApplicationSourceReport,
    ApplicationSourceDownloadReport,
    HiringVelocityReport,
    HiringVelocityDownloadReport,
)

from job.views.npp_report import (
    JobSeekerJournelReport,
    JobActivityReport,
    OpenJobReport,
    CurentApplicationReport,
    JobSeekerSucessMetricReport,
    JobSeekerSucessMetricDownloadReport,
    JobActivityDownloadReport,
    OpenJobDownloadReport,
    CurentApplicationDownloadReport,
    JobSeekerJournelDownloadReport,
)
from job.views.job_reapply import JobReapplyView

from job.views.get_mongo import MongoGetDataApi

from job.views.tenant_update import TenantUpdate
from core.views.get_dataset_view import GetMasterDataset
from job.views.jobs_bulk_upload import JobsBulkUploadView, JobsDataProcessGetView

app_name = "job"

urlpatterns = [
    path("jobs", JobSearchView.as_view(), name="job_search"),
    path("jobs/create", JobCreateView.as_view(), name="job_create"),
    path("jobs/<str:slug>", JobDetailView.as_view(), name="job_detail"),
    path("jobs/applied/<str:slug>", JobAppliedView.as_view(), name="job_applied"),
    path("jobs/<str:slug>/bookmark", JobBookmarkView.as_view(), name="job_bookmark"),
    path("jobs/<str:slug>/update", JobUpdateView.as_view(), name="job_update"),
    path("jobs/<str:slug>/delete", JobDeleteView.as_view(), name="job_delete"),
    path("jobs/<str:slug>/apply", JobApplyView.as_view(), name="job_apply"),
    path("jobs/<str:slug>/alert", JobAlertView.as_view(), name="job_alert"),
    path("user/jobs/applied", JobAppliedListView.as_view(), name="user_applied_jobs"),
    path("jobs/user/bookmarks", BookMarkListView.as_view()),
    path("jobs/<int:job_id>/recommended", MatchListView.as_view(), name="match_score_list"),
    path("template/<str:title>", JobTemplateView.as_view(), name="job_template"),
    path("compare/<int:id>", CompareView.as_view(), name="jobs_compare"),
    path("jobs/<str:slug>/companyjobs", JobCompanyView.as_view(), name="job_company"),
    path("job/rejection", JobRejectionView.as_view(), name="job_rejection"),
    path("job/validatejob", ParseJobView.as_view(), name="parse_job"),
    path("job/uploadjob", JobParserAPI.as_view(), name="parse_job"),  # drop job pdf/word endpoint
    path("job/validatejob2", ParseJobBase64View.as_view(), name="parse_job_64"),
    path("job/bimetricscore", BimetricScoreView.as_view(), name="bimetric_score"),
    path("job/bimetricscorev10", BimetricScoreLatestVersionView.as_view(), name="bimetric_score"),
    path("job/hiringteam", HiringTeamView.as_view(), name="hiring_team"),
    path("report/current", CurrentPipelineReport.as_view(), name="CurrentPipelineReport"),
    path("report/current/download", CurrentPipelineDownloadReport.as_view(), name="CurrentPipelineDownloadReport"),
    path("report/timetohire", TimetohireReport.as_view(), name="TimetohireReport"),
    path("report/timetohire/download", TimetohireDownloadReport.as_view(), name="TimetohireDownloadReport"),
    path("report/applicationsource", ApplicationSourceReport.as_view(), name="ApplicationSourceReport"),
    path(
        "report/applicationsource/download",
        ApplicationSourceDownloadReport.as_view(),
        name="ApplicationSourceDownloadReport",
    ),
    path("report/hirevelocity", HiringVelocityReport.as_view(), name="HiringVelocityReport"),
    path("report/hirevelocity/download", HiringVelocityDownloadReport.as_view(), name="HiringVelocityDownloadReport"),
    path("report/sp/jobseekerjournal", JobSeekerJournelReport.as_view(), name="JobSeekerJournelReport"),
    path(
        "report/sp/jobseekerjournal/download",
        JobSeekerJournelDownloadReport.as_view(),
        name="JobSeekerJournelDownloadReport",
    ),
    path("report/sp/jobactivity", JobActivityReport.as_view(), name="JobActivityReport"),
    path(
        "report/sp/jobactivity/download",
        JobActivityDownloadReport.as_view(),
        name="JobActivityDownloadReport",
    ),
    path("report/sp/openjob", OpenJobReport.as_view(), name="OpenJobReport"),
    path(
        "report/sp/openjob/download",
        OpenJobDownloadReport.as_view(),
        name="OpenJobDownloadReport",
    ),
    path("report/sp/currentapplication", CurentApplicationReport.as_view(), name="CurentApplicationReport"),
    path(
        "report/sp/currentapplication/download",
        CurentApplicationDownloadReport.as_view(),
        name="CurentApplicationDownloadReport",
    ),
    path("report/sp/jobseekermetric", JobSeekerSucessMetricReport.as_view(), name="JobSeekerSucessMetricReport"),
    path(
        "report/sp/jobseekermetric/download",
        JobSeekerSucessMetricDownloadReport.as_view(),
        name="JobSeekerSucessMetricDownloadReport",
    ),
    path("job/similarjobs/<int:job_id>", SimilarJobsView.as_view(), name="random_jobs"),
    # job create new
    path("jobs/create/url", JobCreateURLView.as_view()),
    path("tenant/update", TenantUpdate.as_view()),
    path("job/application/withdraw/<str:job_slug>", WithdrawJobApplicationView.as_view()),
    # job reapply
    path("jobs/<str:slug>/reapply", JobReapplyView.as_view()),
    path("getmongodata", MongoGetDataApi.as_view()),
    # User Dashbaord
    path("users/dashboard/recommendedjobs", RecommendedJobsView.as_view()),
    path("users/dashboard/recommendedjobs/<str:slug>", RecommendedJobsView.as_view()),
    path("job/master/dataset", GetMasterDataset.as_view()),
    # jobs bulk upload
    path("jobs/bulk/uploadfiles", JobsBulkUploadView.as_view()),
    path("jobs/bulk/dataprocess/status", JobsDataProcessGetView.as_view()),
    # job Survey
    path("job/survey_feedback", SurveyFeedback.as_view()),
]
