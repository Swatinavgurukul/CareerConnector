from rest_framework import serializers
from core.models.master_questions import Question, SubQuestion
from job.models.job_survey import SurveyFeedBack
from core.models.master_survey import Survey


class ListSurveySerializer(serializers.ModelSerializer):
    survey_for = serializers.ReadOnlyField()
    counts = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = ('id', 'name', 'event', 'is_active', 'survey_for', 'counts')

    @staticmethod
    def get_counts(instance):
        objects = SurveyFeedBack.objects.filter(survey_id=instance.id, submitted_by__is_ca=0)

        data_json = [
            {
                "sent_out": objects.count(),
                "responses": objects.filter(is_submitted=True).count()
            }
        ]
        return data_json


class ListCaSurveySerializer(serializers.ModelSerializer):
    survey_for = serializers.ReadOnlyField()
    counts = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = ('id', 'name', 'event', 'is_active', 'survey_for', 'counts')

    @staticmethod
    def get_counts(instance):
        objects = SurveyFeedBack.objects.filter(survey_id=instance.id, submitted_by__is_ca=1)

        data_json = [
            {
                "sent_out": objects.count(),
                "responses": objects.filter(is_submitted=True).count()
            }
        ]
        return data_json
