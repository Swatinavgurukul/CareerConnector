from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.helpers import api_response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from job.models.job_templates import JobTemplate
from job.serializers.job_template_serializers import JobTemplateSerializer
from core.models.tenant import Tenant


class JobTemplateView(APIView):

    def get(self, request, title):
        try:
            template_obj = JobTemplate.objects.filter(job_title__icontains=title)
            template_serializer = JobTemplateSerializer(template_obj,many=True)
            return api_response(200, "Job Template retrieved successfully", template_serializer.data)
        except JobTemplate.DoesNotExist:
            return api_response(404, "Template doesn't exist", {})