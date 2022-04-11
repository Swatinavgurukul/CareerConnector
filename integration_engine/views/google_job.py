from rest_framework.response import Response
from rest_framework.views import APIView
from core.helpers import api_response
import os
from google.cloud import talent
import six
from decouple import config

# File Path
credential_path = "./assets/googleservice.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credential_path


class GoogleJobView(APIView):
    """ Post Job """

    def post(self, request):
        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = config("GOOGLE_TENANT_ID")
        company_id = config("GOOGLE_COMPANY_ID")
        requisition_id = request.data["requisition_id"]
        # job_application_url = "https://www.example.org/job-posting/123"
        job_application_url = request.data["job_application_url"]
        title = request.data["title"]
        description = request.data["description"]
        addresses = request.data["addresses"]

        client = talent.JobServiceClient()
        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(company_id, six.binary_type):
            company_id = company_id.decode("utf-8")
        if isinstance(requisition_id, six.binary_type):
            requisition_id = requisition_id.decode("utf-8")
        if isinstance(job_application_url, six.binary_type):
            job_application_url = job_application_url.decode("utf-8")
        parent = f"projects/{project_id}/tenants/{tenant_id}"
        uris = [job_application_url]
        application_info = {"uris": uris}
        addresses1 = [addresses]

        job = {
            "company": company_id,
            "requisition_id": requisition_id,
            "title": title,
            "description": description,
            "application_info": application_info,
            "addresses": addresses1,
            "language_code": "en-US",
        }
        response = client.create_job(parent=parent, job=job)
        return api_response(Response.status_code, "Job Created Successfully", response.name)


class GoogleJobRetrieveView(APIView):
    """ Get Job """

    def get(self, request):
        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = config("GOOGLE_TENANT_ID")

        job_id = request.data["job_id"]
        client = talent.JobServiceClient()

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(job_id, six.binary_type):
            job_id = job_id.decode("utf-8")
        name = client.job_path(project_id, tenant_id, job_id)

        response = client.get_job(name=name)
        return api_response(Response.status_code, "Job Retrieved Succesfully", response.name)


class GoogleJobDeleteView(APIView):
    """Delete Job"""

    def delete(self, request):

        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = config("GOOGLE_TENANT_ID")
        job_id = request.data["job_id"]

        client = talent.JobServiceClient()

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(job_id, six.binary_type):
            job_id = job_id.decode("utf-8")
        name = client.job_path(project_id, tenant_id, job_id)

        response = client.delete_job(name=name)
        return api_response(Response.status_code, "Job Deleted Succesfully", response)


class GoogleJobListView(APIView):

    """List Company"""

    def get(self, request):
        client = talent.JobServiceClient()

        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = config("GOOGLE_TENANT_ID")
        company = config("GOOGLE_COMPANY_ID")
        filter_ = 'companyName="projects/{}/companies/{}"'.format(project_id, company)

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(filter_, six.binary_type):
            filter_ = filter_.decode("utf-8")
        parent = f"projects/{project_id}/tenants/{tenant_id}"

        # Iterate over all results
        results = []
        for job in client.list_jobs(parent=parent, filter=filter_):
            results.append(job.name)
        return api_response(Response.status_code, "JobList Retrieved Succesfully", results)
