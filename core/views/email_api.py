from rest_framework.views import APIView
from core.helpers import api_response
from django.template.loader import get_template
import html
from sendgrid.helpers.mail import Mail
from sendgrid import SendGridAPIClient
from decouple import config


class EmailView(APIView):
    def post(self, request):
        from_email = request.data.get("from_email", None)
        to_email = request.data.get("to_email", None)
        subject = request.data.get("subject", None)
        body = request.data.get("body", None)
        compose = dict(
            body=body,
            text=request.data.get("text", None),
            url=request.data.get("url", None),
            email_signature=request.data.get("email_signature", None),
        )
        filtered = {k: v for k, v in compose.items() if v is not None}
        compose.clear()
        compose.update(filtered)
        email_template = get_template("emails/action.html")
        html_content = email_template.render(compose)
        html_content = html.unescape(html_content)
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body,
            html_content=html_content,
        )
        try:
            sendgrid_client = SendGridAPIClient(config("SENDGRID_API"))
            response = sendgrid_client.send(message)
            return api_response("200", "email sent", response.body)
        except Exception as e:
            return api_response("400", "email not sent", e.body)
