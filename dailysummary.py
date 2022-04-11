import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from core.models.users import User
from core.task import send_simple_message
from django.utils import timezone
from datetime import timedelta
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from core.models.feedback import FeedbackForm


def dailysummary():
    subject = "Summary Report"
    to_email_address = ["michael@simplifyvms.com", "prahlad@simplifyvms.com"]
    yesterday = timezone.now() - timedelta(days=1)
    data = []
    hiring = User.objects.filter(is_superuser=True, role_id=1, approved=True).values(
        "first_name", "last_name", "email", "tenant"
    )
    for job in hiring:
        res = dict(
            name=job["first_name"] + " " + job["last_name"],
            email=job["email"],
            jobs=Job.objects.filter(tenant=job["tenant"], status="active").count(),
        )
        data.append(res)

    data1 = []
    recuriter = User.objects.filter(is_superuser=True, role_id=2, approved=True).values(
        "first_name", "last_name", "email", "tenant"
    )
    for job_seeker in recuriter:
        candidate = dict(
            name=job_seeker["first_name"] + " " + job_seeker["last_name"],
            email=job_seeker["email"],
            users=User.objects.filter(tenant=job_seeker["tenant"], is_user=True, approved=True).count(),
        )
        data1.append(candidate)

    feedback_question = FeedbackForm.objects.filter(feedback_type="Microsoft Career Connector - Questions").values(
        "page", "description", "user__email", "created_at"
    )
    feedback_suggestions = FeedbackForm.objects.filter(feedback_type="Microsoft Career Connector - Suggestions").values(
        "page", "description", "user__email", "created_at"
    )
    feedback_complaints = FeedbackForm.objects.filter(feedback_type="Microsoft Career Connector - Complaints").values(
        "page", "description", "user__email", "created_at"
    )

    questions = list(feedback_question)
    suggestions = list(feedback_suggestions)
    complaints = list(feedback_complaints)

    complaint = "<br><b>Complaints:</b> <br>"
    for i in range(0, len(complaints)):
        complaint += (
            "<li> User: "
            + complaints[i]["user__email"]
            + " || URL: "
            + complaints[i]["page"]
            + " "
            + "|| Description: "
            + str(complaints[i]["description"])
            + "</li>"
        )

    question = "<br><b>Question:</b> <br>"
    for i in range(0, len(questions)):
        question += (
            "<li> User: "
            + questions[i]["user__email"]
            + " || URL: "
            + questions[i]["page"]
            + " "
            + "|| Description: "
            + str(questions[i]["description"])
            + "</li>"
        )

    suggestion = "<br><b>Suggestions:</b> <br>"
    for i in range(0, len(suggestions)):
        suggestion += (
            "<li> User: "
            + suggestions[i]["user__email"]
            + " || URL: "
            + suggestions[i]["page"]
            + " "
            + "|| Description: "
            + str(suggestions[i]["description"])
            + "</li>"
        )

    st = ""
    for i in range(0, len(data)):
        st += (
            "<li>"
            + data[i]["name"]
            + " ("
            + data[i]["email"]
            + ") "
            + "  -  "
            + str(data[i]["jobs"])
            + " Jobs"
            + "</li>"
        )
    ut = ""
    for i in range(0, len(data1)):
        ut += (
            "<li>"
            + data1[i]["name"]
            + " ("
            + data1[i]["email"]
            + ") "
            + "  -  "
            + str(data1[i]["users"])
            + " Users"
            + "</li>"
        )
    if ut == "":
        ut += "<li> No Skilling Partner created </li>"
    if st == "":
        st += "<li> No Employers created </li>"
    if suggestions == []:
        suggestion += "<li> No Suggestion </li>"
    if complaints == []:
        complaint += "<li> No complaint </li>"
    if questions == []:
        question += "<li> No question </li>"

    data_list = str(
        "Skilling Partners <br><br>" + ut + "<br>" + "Employers <br><br>" + st + complaint + suggestion + question
    )

    send_simple_message(email_address=to_email_address, subject=subject, body=None, html=data_list)
    # send_asynchronous_email.delay(to_email_address, subject, body, html_content=None)
    return data


if __name__ == "__main__":
    dailysummary()
    print("Done" + " " + str(timezone.now()))
