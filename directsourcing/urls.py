from django.contrib import admin
from django.urls import path, include
from directsourcing.views import DesignGuide
from integration_engine.views.broadbean import broadbean
from integration_engine.views.careerjet import careerjet
from integration_engine.views.linkedin import linkedin
from integration_engine.views.ziprecruiter import ziprecruiter
from integration_engine.views.jooble import jooble
from integration_engine.views.getwork import getwork
from integration_engine.views.careerbuilder import careerbuilder

from integration_engine.views.google_jobposting import JobPosting_JSONLD

urlpatterns = [
    # app urls
    path(r"api/v1/accounts/", include("allauth.urls")),
    path(r"api/v1/admin/", admin.site.urls),
    path(r"api/v1/o/", include("oauth2_provider.urls", namespace="oauth2_provider")),
    path(r"api/v1/", include("core.urls")),
    path(r"api/v1/", include("job.urls")),
    path(r"api/v1/", include("notification.urls")),
    path(r"api/v1/", include("integration_engine.urls")),
    path(r"api/v1/", include("chatbot.urls")),
    path(r"api/v1/", include("resume.urls")),
    path(r"api/v1/", include("recruiter.urls")),
    # tests urls
    path("api/test/design_guide", DesignGuide),
    path("xml/broadbean/v1/jobs", broadbean, name="broadbean"),
    path("xml/linkedin/v1/jobs", linkedin, name="linkedin"),
    path("xml/ziprecruiter/v1/jobs", ziprecruiter, name="ziprecruiter"),
    path("xml/careerjet/v1/jobs", careerjet, name="careerjet"),
    path("xml/jooble/v1/jobs", jooble, name="jooble"),
    path("xml/getwork/v1/jobs", getwork, name="getwork"),
    path("xml/careerbuilder/v1/jobs", careerbuilder, name="careerbuilder"),
    path("xml/google_jobposting/v1/jobs", JobPosting_JSONLD, name="jobposting_google_example"),
    # path("test/demo1", TestOne),
    # static urls
    # path(r"", home, name="home"),
    # path("dashboard", dashboard.as_view(), name="dashboard"),
    # url(r"^.*$", dashboard.as_view(), name="dashboard"),
    # warning don't add any route below this
]
