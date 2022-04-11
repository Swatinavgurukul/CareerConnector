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


class GoogleCompanyView(APIView):
    """Post Company Name"""

    def post(self, request):
        external_id = request.data["external_id"]
        project_id = config("GOOGLE_PROJECT_ID")
        display_name = request.data["display_name"]
        tenant_id = request.data["tenant_id"]
        client = talent.CompanyServiceClient()
        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(display_name, six.binary_type):
            display_name = display_name.decode("utf-8")
        if isinstance(external_id, six.binary_type):
            external_id = external_id.decode("utf-8")
        parent = f"projects/{project_id}/tenants/{tenant_id}"
        company = {"display_name": display_name, "external_id": external_id}

        response = client.create_company(parent=parent, company=company)
        return api_response(Response.status_code, "Company Created Successfully", response.name)


class GoogleCompanyNameRetrieveView(APIView):
    """Get Company"""

    def get(self, request):

        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = request.data["tenant_id"]
        company_id = request.data["company_id"]

        client = talent.CompanyServiceClient()

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(company_id, six.binary_type):
            company_id = company_id.decode("utf-8")
        name = client.company_path(project_id, tenant_id, company_id)

        response = client.get_company(name=name)
        return api_response(Response.status_code, "Company Retrieved Successfully", response.name)


class GoogleDeleteCompanyNameView(APIView):
    """Delete Company"""

    def delete(self, request):

        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = request.data["tenant_id"]
        company_id = request.data["company_id"]

        client = talent.CompanyServiceClient()
        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        if isinstance(company_id, six.binary_type):
            company_id = company_id.decode("utf-8")

        name = client.company_path(project_id, tenant_id, company_id)
        response = client.delete_company(name=name)
        return api_response(Response.status_code, "Company Deleted Succesfully", response)


class GoogleCompanyListView(APIView):

    """List Tenants"""

    def get(self, request):
        client = talent.CompanyServiceClient()

        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = request.data["tenant_id"]

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        parent = f"projects/{project_id}/tenants/{tenant_id}"

        # Iterate over all results
        results = []
        for company in client.list_companies(parent=parent):
            results.append(company.name)
        return api_response(Response.status_code, "CompanyList retrieved successfully", results)