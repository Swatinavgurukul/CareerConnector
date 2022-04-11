from django.urls import path
from integration_engine.views.integration_api import IntegrationEngineView
from integration_engine.views.ziprecruiter import ZipRecruiterView, GetZipRecruiterView
from integration_engine.views.careerbuilder import CareerBuilderView, GetCareerBuilderView

# from integration_engine.views.post_ziprecruiter import PostZipRecruiterAPI
from integration_engine.views.google_tenant import (
    GoogleTenantView,
    GoogleTenantRetriveView,
    GoogleTenantDeleteView,
    GoogleTenantListView,
)
from integration_engine.views.google_company import (
    GoogleCompanyView,
    GoogleCompanyNameRetrieveView,
    GoogleDeleteCompanyNameView,
    GoogleCompanyListView,
)
from integration_engine.views.google_job import (
    GoogleJobView,
    GoogleJobRetrieveView,
    GoogleJobDeleteView,
    GoogleJobListView,
)

from integration_engine.views.google_jobposting import Google_JobPosting
from integration_engine.views.zip_career_user_created import ZipUserCreatedView
from integration_engine.views.careerbuilder_user_created import CareerBuilderUserCreatedView

urlpatterns = [
    path("google/tenant", GoogleTenantView.as_view(), name="GoogleTenant"),
    path("google/gettenant", GoogleTenantRetriveView.as_view(), name="GoogleTenantRetrieve"),
    path("google/tenantlist", GoogleTenantListView.as_view(), name="GoogleTenantListView"),
    path("google/deletetenant", GoogleTenantDeleteView.as_view(), name="GoogleTenantDelete"),
    path("google/company", GoogleCompanyView.as_view(), name="GoogleCompany"),
    path("google/getcompanyname", GoogleCompanyNameRetrieveView.as_view(), name="GoogleCompanyNameRetrieve"),
    path("google/companylist", GoogleCompanyListView.as_view(), name="GoogleCompanyListView"),
    path("google/deletecompanyname", GoogleDeleteCompanyNameView.as_view(), name="GoogleDeleteCompanyName"),
    path("google/job", GoogleJobView.as_view(), name="GoogleJob"),
    path("google/getjob", GoogleJobRetrieveView.as_view(), name="GoogleJobRetrieve"),
    path("google/deletejob", GoogleJobDeleteView.as_view(), name="GoogleJobDelete"),
    path("google/joblist", GoogleJobListView.as_view(), name="GoogleJobListView"),
    path("integration/list", IntegrationEngineView.as_view(), name="IntegrationEngine"),
    path("integration/ziprecruiter", ZipRecruiterView.as_view(), name="IntegrationEngine"),
    path("integration/getziprecruiter", GetZipRecruiterView.as_view(), name="GetZipRecruiterView"),
    # path("integration/postziprecruiter", PostZipRecruiterAPI.as_view(), name="PostZipRecruiterView"),
    path("integration/gooogle_jobposting", Google_JobPosting.as_view(), name="Google_JobPosting"),
    path("integration/careerbuilder", CareerBuilderView.as_view(), name="CareerBuilderPost"),
    path("integration/getcareerbuilder", GetCareerBuilderView.as_view(), name="GetCareerBuilder"),
    path("integration/zip_created_user", ZipUserCreatedView.as_view(), name="ZipUserCreated"),
    path("integration/careerbuilder_created_user", CareerBuilderUserCreatedView.as_view(), name="CareerBuilderUserCreated"),
]
