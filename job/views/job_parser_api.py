from rest_framework.views import APIView
from core.helpers import (
    api_response,
    job_parser,
    job_parser_encoded,
    parse_resume,
    bimetric_score,
    job_parser_ten,
    parse_resume_ten,
    bimetric_score_ten,
)
from directsourcing.settings import MEDIA_ROOT
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import FileSystemStorage
from rest_framework.permissions import IsAuthenticated, IsAdminUser
import uuid
import base64
from resume.helpers import sovren_jobparser_v10
import os
from core.get_tenant import get_user_tenant

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


class ParseJobView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            serialized_data = request.data
            if "job_sample" in serialized_data is not None:
                myfile = request.FILES["job_sample"]
                fs = FileSystemStorage(location=str(MEDIA_ROOT))
                filename = fs.save(myfile.name, myfile)
                filename = str(MEDIA_ROOT) + filename

            data = job_parser(filename)

            return api_response(200, "Job Parsed", data)
        except Exception as e:
            return api_response(404, "Page not found", str(e))


class JobParserAPI(APIView):
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            data = request.data
            myfile = request.FILES["job_sample"]
            fs = FileSystemStorage(location=str(MEDIA_ROOT))
            filename = fs.save(myfile.name, myfile)
            filename = str(MEDIA_ROOT) + filename
            tenant = get_user_tenant(request)
            if "job_sample" in data.keys() is not None:
                with open(filename, "rb") as job:
                    base64str = base64.b64encode(job.read()).decode("UTF-8")
                tenantid = tenant.id
                organisation_name = tenant.name
                userid = request.user.id
                delete_file = default_storage.delete(str(filename))
                job_parser = sovren_jobparser_v10(
                    base64str, tenantid=tenantid, organisation_name=organisation_name, userid=userid
                )
                if job_parser != 400:
                    job_parser.job_file_id = myfile
                    job_parser.save()

                    return api_response(201, "Job Parsed and created", job_parser.slug)
                else:
                    return api_response(400, "Invalid file", {})

        except Exception as error:
            return api_response(404, "Page not found", str(error))


class ParseJobBase64View(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            serialized_data = request.data
            data = job_parser_encoded(serialized_data["job_sample"])
            return api_response(200, "Job Parsed", data)
        except Exception as e:
            return api_response(404, "Page not found", str(e))


class BimetricScoreView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            serialized_data = request.data
            if "resume" in serialized_data is not None and "job_sample" in serialized_data is not None:
                # for file in range(len(request.FILES.getlist('resume'))):
                #     with request.FILES.getlist('resume')[file].open("rb") as image_file:
                #         encoded_string = base64.b64encode(image_file.read())
                # import pdb
                # pdb.set_trace()
                # myfile = request.FILES['resume']
                # fs = FileSystemStorage(location=str(MEDIA_ROOT))
                # filename = fs.save(myfile.name, myfile)
                # filename = str(MEDIA_ROOT) + filename
                # data = bimetric_score(request)
                target = []
                sourcedata = None

                for file in range(len(request.FILES.getlist("resume"))):
                    myfile = request.FILES.getlist("resume")[file]
                    fs = FileSystemStorage(location=str(MEDIA_ROOT))
                    filename = fs.save(myfile.name, myfile)
                    filename = str(MEDIA_ROOT) + filename
                    data = parse_resume(filename)
                    target.append({"Id": str(uuid.uuid1()), "FileText": data})
                if "job_sample" in serialized_data is not None:
                    myfile = request.FILES["job_sample"]
                    fs = FileSystemStorage(location=str(MEDIA_ROOT))
                    filename = fs.save(myfile.name, myfile)
                    filename = str(MEDIA_ROOT) + filename
                    data = job_parser(filename)
                    sourcedata = {"Id": str(uuid.uuid1()), "FileText": data}

                data = bimetric_score(sourcedata, target)

            return api_response(200, "data fetched", data)
        except Exception as e:
            return api_response(404, "Page not found", str(e))


"""
varsion 10 bimetric implementation
"""


class BimetricScoreLatestVersionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            serialized_data = request.data

            if "resume" in serialized_data is not None and "job_sample" in serialized_data is not None:
                target = []
                sourcedata = None
                for file in range(len(request.FILES.getlist("resume"))):
                    myfile = request.FILES.getlist("resume")[file]
                    fs = FileSystemStorage(location=str(MEDIA_ROOT))
                    filename = fs.save(myfile.name, myfile)
                    filename = str(MEDIA_ROOT) + filename
                    data = parse_resume_ten(filename)
                    target.append({"Id": str(uuid.uuid1()), "ResumeData": data})
                if "job_sample" in serialized_data is not None:
                    myfile = request.FILES["job_sample"]
                    fs = FileSystemStorage(location=str(MEDIA_ROOT))
                    filename = fs.save(myfile.name, myfile)
                    filename = str(MEDIA_ROOT) + filename
                    data = job_parser_ten(filename)
                    sourcedata = {"Id": str(uuid.uuid1()), "JobData": data}

                # print(source)
                # import pdb
                # pdb.set_trace()
                data = bimetric_score_ten(sourcedata, target)

            return api_response(200, "data fetched", data)
        except Exception as e:
            return api_response(404, "Page not found", str(e))
