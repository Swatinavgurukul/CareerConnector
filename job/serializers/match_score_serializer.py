from job.models import Job, MatchScore
from rest_framework import serializers


class matchscoreGetSerializer(serializers.ModelSerializer):

    """
    gets list of match scores for candidates
    """

    score = serializers.SerializerMethodField("get_score")

    class Meta:
        model = MatchScore
        fields = ["id", "job_id", "user_id", "paramter_1", "paramter_2", "paramter_3", "paramter_4", "score"]

    def get_score(self, match_score_obj):
        job = Job.objects.get(pk=match_score_obj.job_id)
        total_score = (
            (job.weightage_parameter_1 * int(match_score_obj.paramter_1))
            + (job.weightage_parameter_2 * int(match_score_obj.paramter_2))
            + (job.weightage_parameter_3 * int(match_score_obj.paramter_3))
            + (job.weightage_parameter_4 * int(match_score_obj.paramter_4))
        ) / 4
        score = total_score / 100

        return score