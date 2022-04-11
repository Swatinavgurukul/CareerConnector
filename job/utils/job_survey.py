from job.models import SurveyFeedBack
from core.models.master_survey import Survey
from core.helpers import compile_email
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from urllib.parse import urlparse


class CreateSurvey:
    """
    Class for getting the survey type, inser job survey and send email
    """

    def __init__(self, request, survey_type: str, data: dict):
        self._request = request
        self._survey_type = survey_type
        self._data = data

    def create_survey(self):
        # survey_object = Survey.objects.get(tenant_id=self._data['tenant_id'], event= self._survey_type)
        #  No need to check Tenant only for MCC as per Chetan : 27-aug-2021
        survey_object = Survey.objects.get(tenant_id=1, event=self._survey_type)

        job_survey_object = SurveyFeedBack.objects.create(
            tenant_id=self._data["tenant_id"],
            survey=survey_object,
            user_id=self._data["user_id"] if "user_id" in self._data else None,
            job_id=self._data["job_id"],
            submitted_by_id=self._data["user_object"].id,
            application_id=self._data["application_id"] if "application_id" in self._data else None,
        )
        cta = None
        if "cta" in self._data:
            cta = self._data["cta"]
            lang = self._data["lang"]
            # Update the base url for submit tag in the body
            path = self._request.build_absolute_uri()
            url_parse = urlparse(path)
            cta["url"] = (
                url_parse.scheme
                + "://"
                + url_parse.netloc
                + "/survey?id="
                + str(urlsafe_base64_encode(smart_bytes(job_survey_object.uuid)) + "&" + "lang=" + lang)
            )
        compile_email(
            self._survey_type,
            self._request,
            self._data["user_object"],
            cta=cta,
            data={
                "subject": self._data["subject"],
            },
            time_delay=self._data["time_delay"] if "time_delay" in self._data else None,
        )
