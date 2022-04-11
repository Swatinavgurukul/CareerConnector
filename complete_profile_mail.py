import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()
import datetime
from core.models.users import User
from core.task import send_simple_message
from django.utils import timezone
from datetime import timedelta
from core.models.profile_setting import ProfileSetting

from django.template.loader import get_template


def complete_profile():

    email_template = get_template("emails/action.html")
    subject = "Complete your Career Connector profile "

    body = (
        "With your account confirmed, it’s time to complete your Career Connector profile."
        " Completing your profile gives you higher chance of getting hired."
        " Click on the button below to update your profile."
    )


    first_mail = datetime.datetime.now().date() - timedelta(days=3)
    second_mail = datetime.datetime.now().date() - timedelta(days=10)
    third_mail = datetime.datetime.now().date() - timedelta(days=22)
    duration = [first_mail, second_mail, third_mail]

    for dt in duration:
        job_seeker = User.objects.filter(is_superuser=0, role_id=None, created_at__contains=dt).values("id")
        user = [each["id"] for each in job_seeker]
        # fetch the score of above fetched user; if value of any of the key is 0. Send a mail.
        score = ProfileSetting.objects.filter(user__in=user).values("user", "user__email", "score")

        to_email_address = [
            each["user__email"]
            for each in score
            if each["score"] is not None and any([v == 0 for v in each["score"].values()])
        ]

        for mail in to_email_address:
            user = User.objects.get(email=mail)
            if user.first_name is not None and user.last_name is not None:
                user_name = user.first_name + " " + user.last_name
            else:
                user_name = user.username
            html_content = email_template.render(
                {
                    "body": body,
                    "candidate_name": user_name.title(),
                    "text": "Complete Profile",
                    "url": "https://microsoft.simplifyhire.net/profile",
                }
            )
            send_simple_message(mail, subject, body, html_content)


if __name__ == "__main__":
    complete_profile()
    print("Done" + " " + str(timezone.now()))
