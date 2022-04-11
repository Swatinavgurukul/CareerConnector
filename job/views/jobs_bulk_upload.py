from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from core.models.dataprocessing import DataProcessing
from core.helpers import api_response
from recruiter.views.bulk_resume_upload import generate_token
from directsourcing.settings import MEDIA_ROOT
from rest_framework.permissions import IsAdminUser
from datetime import datetime, timedelta
from recruiter.serializers.bulk_resume_upload_serializer import (
    DataProcessingPostSerializer,
    DataProcessingGetSerializer,
)
from core.task import asynchronous_jobs_bulk_upload, check_bulk_jobs_upload_completeness
from core.get_tenant import get_user_tenant
import base64
from datetime import datetime, timedelta


class JobsBulkUploadView(APIView):

    permission_classes = (IsAdminUser,)

    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        tenant = get_user_tenant(request)
        qs = DataProcessing.objects.filter(user_id=request.user.id)
        token = generate_token(qs)
        job_files = request.FILES.getlist("job_files")
        if len(job_files) != 0:
            for job_file in job_files:
                data = {"user": request.user.id, "file": job_file, "is_uploaded": True, "token": token}
                Serializer = DataProcessingPostSerializer(data=data)
                if Serializer.is_valid():
                    Serializer.save()
                else:
                    continue

            # async job parsing
            dataprocess_objs = DataProcessing.objects.filter(user_id=request.user.id, is_processed=False, token=token)
            dataprocess_ids = []
            for datapocess_obj in dataprocess_objs:
                filename = str(MEDIA_ROOT) + str(datapocess_obj.file)
                with open(filename, "rb") as job:
                    base64str = base64.b64encode(job.read()).decode("UTF-8")
                tenantid = tenant.id
                organisation_name = tenant.name
                userid = request.user.id
                asynchronous_jobs_bulk_upload.delay(
                    base64str,
                    tenantid=tenantid,
                    organisation_name=organisation_name,
                    userid=userid,
                    myfile=str(datapocess_obj.file),
                )
                dataprocess_ids.append(datapocess_obj.id)
            check_bulk_jobs_upload_completeness.delay(dataprocess_ids)
            return api_response(200, "Jobs Uploaded successfully", {"token": token})
        else:
            return api_response(400, "Files Not Received", {})


class JobsDataProcessGetView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        token = request.GET.get("token")
        duration = request.GET.get("duration")
        if token is not None:
            qs = DataProcessing.objects.filter(user_id=request.user.id, token=token)
        else:
            if duration == "all":
                qs = DataProcessing.objects.filter(user_id=request.user.id)
            else:
                qs = DataProcessing.objects.filter(
                    user_id=request.user.id, updated_at__gte=(datetime.now() - timedelta(minutes=int(duration)))
                )
        serializer = DataProcessingGetSerializer(qs, many=True)
        total_files = qs.count()
        processed_count = 0
        pending_count = 0
        pending_files = []
        success_count = 0
        success_files = []
        failed_files = []
        failed_count = 0
        for each in qs:
            job_file = str(each.file)[5:]
            if each.is_processed is True:
                processed_count += 1
                if each.is_parsed is True:
                    success_count += 1
                    success_files.append({"job_file": job_file})
                else:
                    failed_count += 1
                    failed_files.append({"job_file": job_file})
            else:
                pending_count += 1
                pending_files.append({"job_file": job_file})
        summary = {
            "total_files": total_files,
            "processed": processed_count,
            "pending_count": pending_count,
            "pending_files": pending_files,
            "success_count": success_count,
            "success_files": success_files,
            "failed_count": failed_count,
            "failed_files": failed_files,
        }
        data = {"summary": summary, "data": serializer.data}

        return api_response(200, "status fetched", data)
