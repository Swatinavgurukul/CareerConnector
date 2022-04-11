from rest_framework.views import APIView
from rest_framework import status
from job.serializers.match_score_serializer import matchscoreGetSerializer
from job.models import MatchScore
from core.helpers import api_response


class MatchListView(APIView):

    """
    gets list of match scores of candidates for a particular job
    """

    def get(self, request, job_id):
        match_score_list = MatchScore.objects.filter(job_id=job_id)
        serializer = matchscoreGetSerializer(match_score_list, many=True)
        return api_response(status.HTTP_200_OK, "data retrieved successfully", serializer.data)
