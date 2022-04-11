from rest_framework.views import APIView
from core.helpers import api_response
from core.serializers.serializers import FeedbackFormSerializer
from rest_framework.permissions import IsAuthenticated
from decouple import config
from core.task import send_asynchronous_email

# from core.emails import feedback_email


class FeedbackView(APIView):

    """Feedback Api"""

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id
        serializer = FeedbackFormSerializer(data=request.data)
        if serializer.is_valid():
            new_feedback = serializer.save(user_id=user_id)
            from_email = request.user.email
            environment = config("ENVIORNMENT")
            if environment == "production":
                email_address = ["prahlad@simplifyvms.com", "simplifyhire@simplifyworkforce.zohodesk.com"]
            else:
                email_address = ["ayush@simplifyvms.com"]
            subject = new_feedback.feedback_type
            body = new_feedback.description
            send_asynchronous_email(email_address, subject, body, html_content=None)
            # new_email2
            # feedback_email(request,request.user) # send acknowledge mail to the user who submitted feedback
            return api_response(201, "Feedback added successfully", serializer.data)
        else:
            return api_response(400, "Invalid data", serializer.errors)
