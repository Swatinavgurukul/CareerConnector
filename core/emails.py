from core.helpers import compile_email
from core.models.users import User
from notification.tasks import compile_notification

# new_email
def resume_update_email(request, email):
    user = User.objects.get(email=email)
    compile_email(
        "user.resume.update",
        request,
        user,
        data={"email": email},
    )


def password_change_email(request, user):
    compile_email("user.password.change", request, user, data={"email": user.email})


# def job_apply_email(request, job, user):
#     compile_email(
#         "job.apply",
#         request,
#         user,
#         data={"email": user.email, "company_name": job.company_name, "job_title": job.title},
#     )
#     user_id = user.id
#     compile_notification.delay("job.apply", user_id, data={"job_name": job.title}, cta=None)


# def interview_invitation_email(request, job, user):
#     compile_email(
#         "interview.invitation",
#         request,
#         user,
#         data={"email": user.email, "company_name": job.company_name, "job_title": job.title},
#     )


# def reschedule_interview_email(request, user, schedule_interview):
#     compile_email(
#         "interview.reschedule",
#         request,
#         user,
#         data={
#             "email": user.email,
#             "company_name": schedule_interview.application.job.company_name,
#             "job_title": schedule_interview.application.job.title,
#             "interview_time": f"{schedule_interview.interview_time.hour}:{schedule_interview.interview_time.minute}",
#             "interview_date": str(schedule_interview.interview_date),
#         },
#     )


# def job_offer_email(request, job, user):
#     compile_email(
#         "job.offer", request, user, data={"email": user.email, "company_name": job.company_name, "job_title": job.title}
#     )

# new_email
def job_hired_email(request, job, user):
    if user.first_name is not None and user.last_name is not None:
        user_name = user.first_name + " " + user.last_name
    else:
        user_name = user.username
    compile_email(
        "job.hired",
        request,
        user,
        data={
            "email": user.email,
            "candidate_name": user_name,
            "company_name": job.company_name,
            "job_title": job.title,
        },
    )


# new_email
def job_offer_declined_email(request, job, user):
    compile_email(
        "job.offer.declined",
        request,
        user,
        data={
            "email": user.email,
            "company_name": job.company_name,
            "job_title": job.title,
        },
    )


# new_email
def application_rejected_email(request, job, user):
    subject = "Your Application to" + " " + job.company_name
    compile_email(
        "application.rejected",
        request,
        user,
        data={
            "email": user.email,
            "company_name": job.company_name,
            "job_title": job.title,
            "subject": subject,
        },
    )


# new_email
def job_closed_email(request, job, applications):
    subject = "Unpublished Job Notification" + " " + "-" + job.company_name + " " + "-" + job.title
    for application in applications:
        compile_email(
            "job.closed",
            request,
            application.user,
            data={
                "email": application.user.email,
                "company_name": job.company_name,
                "job_title": job.title,
                "subject": subject,
            },
        )


# new_email
def application_notselected_email(request, job, user):
    compile_email(
        "application.notselected",
        request,
        user,
        data={
            "email": user.email,
            "company_name": job.company_name,
            "job_title": job.title,
        },
    )


# new_email
def personal_information_update(request, user, updated_data):
    compile_email("personal.information.update", request, user, data={"updated_data": updated_data})


# new_email
def work_experience_update(request, user, updated_data):
    compile_email("work.experience.update", request, user, data={"updated_data": updated_data})


# new_email
def academic_details_update(request, user, updated_data):
    compile_email("academic.details.update", request, user, data={"updated_data": updated_data})


# new_email
def skills_update(request, user, updated_data):
    compile_email("skills.update", request, user, data={"updated_data": updated_data})


# new_email
def job_alert_email(request, email, job):
    user = User.objects.get(email=email)
    compile_email("job.alert", request, user, data={"email": email, "job_title": job.title})


# new_email
def feedback_email(request, user):
    compile_email(
        "feedback",
        request,
        user,
        data={
            "email": user.email,
        },
    )