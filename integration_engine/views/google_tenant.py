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


class GoogleTenantView(APIView):
    """Post Tenant"""

    def post(self, request):
        external_id = request.data["external_id"]
        project_id = config("GOOGLE_PROJECT_ID")
        client = talent.TenantServiceClient()
        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(external_id, six.binary_type):
            external_id = external_id.decode("utf-8")
        parent = f"projects/{project_id}"
        tenant = talent.Tenant(external_id=external_id)

        response = client.create_tenant(parent=parent, tenant=tenant)
        return api_response(Response.status_code, "Tenant Created Successfully", response.name)


class GoogleTenantRetriveView(APIView):
    """Get Tenant by name"""

    def get(self, request):

        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = request.data["tenant_id"]

        client = talent.TenantServiceClient()
        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        name = client.tenant_path(project_id, tenant_id)

        response = client.get_tenant(name=name)
        return api_response(Response.status_code, "Successfully Retrieved Tenant", response.name)


class GoogleTenantDeleteView(APIView):

    """Delete Tenant"""

    def delete(self, request):
        project_id = config("GOOGLE_PROJECT_ID")
        tenant_id = request.data["tenant_id"]

        client = talent.TenantServiceClient()

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        if isinstance(tenant_id, six.binary_type):
            tenant_id = tenant_id.decode("utf-8")
        name = client.tenant_path(project_id, tenant_id)

        response = client.delete_tenant(name=name)
        return api_response(Response.status_code, "Successfully Deleted Tenant", response)


class GoogleTenantListView(APIView):
    """List Tenants"""

    def get(self, request):

        client = talent.TenantServiceClient()

        project_id = config("GOOGLE_PROJECT_ID")

        if isinstance(project_id, six.binary_type):
            project_id = project_id.decode("utf-8")
        parent = f"projects/{project_id}"

        # Iterate over all results
        for response_item in client.list_tenants(parent=parent):
            return api_response(Response.status_code, "TenantList retrieved successfully", response_item.name)