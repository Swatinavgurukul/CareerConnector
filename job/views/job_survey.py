from datetime import datetime
from rest_framework.views import APIView
from core.helpers import api_response
from job.models.job_survey import SurveyFeedBack
from job.serializers.survey_feedback_serializers import SurveyFeedbackSerializer
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode


class SurveyFeedback(APIView):
    def get(self, request):

        uuid = force_str(urlsafe_base64_decode(request.query_params["uuid"]))
        try:
            survey_feed = SurveyFeedBack.objects.get(uuid=uuid)
            survey_all = SurveyFeedbackSerializer(survey_feed)
            return api_response(200, "survey questions retrieved successfully", survey_all.data)
        except SurveyFeedBack.DoesNotExist:
            return api_response(404, "survey feedback object doesnot exist", {})

    def put(self, request):
        uuid = force_str(urlsafe_base64_decode(request.query_params["uuid"]))

        try:
            survey_obj = SurveyFeedBack.objects.get(uuid=uuid)
            serializer = SurveyFeedbackSerializer(survey_obj, request.data)
            if serializer.is_valid():
                serializer.save(is_submitted=True, updated_at=datetime.now())
                return api_response(200, "Thank you for submitting the data", serializer.data)
        except SurveyFeedBack.DoesNotExist:
            return api_response(404, "Page not found", {})
