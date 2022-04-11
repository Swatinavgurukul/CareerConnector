from rest_framework import serializers
from core.models.master_questions import Question, SubQuestion
from job.models.job_survey import SurveyFeedBack

class SubQuestionsSerializer(serializers.ModelSerializer):
        class Meta:
            model=SubQuestion
            fields = ('id','title', 'display_title', 'options', 'type', 'is_active',)

class QuestionsSerializer(serializers.ModelSerializer):
        sub_question = serializers.SerializerMethodField()

        class Meta:
            model=Question
            fields = ('id','title', 'display_title', 'options', 'type', 'is_active', 'is_sub_question', 'sub_question', 'display_textbox_options', 'textbox_label')

        @staticmethod
        def get_sub_question(instance):
            if instance.is_sub_question:
                questions_obj = SubQuestion.objects.filter(question_id=instance.id)
                return SubQuestionsSerializer(questions_obj, many=True).data
            return None


class SurveyFeedbackSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    job_title = serializers.ReadOnlyField(source='job.title')
    survey_title = serializers.ReadOnlyField(source='survey.name')
    survey_description = serializers.ReadOnlyField(source='survey.description')

    class Meta:
        model = SurveyFeedBack
        fields = ('user_name', 'answers', 'job_title', 'is_submitted', 'questions', 'survey_title', 'survey_description')

    @staticmethod
    def get_questions(instance):
        questions_obj = Question.objects.filter(id__in=[ i.id for i in instance.survey.questions.all()])
        return QuestionsSerializer(questions_obj, many=True).data
