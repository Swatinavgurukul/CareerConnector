from celery import shared_task
from time import sleep
from core.helpers import send_simple_message, send_mail_with_attachement
from core.models.users import User

# from resume.views.resume_api import resumeupload
from resume.views.sovren_resume import sovrenresume
from recruiter.views.sovren_resume_new import sovrenresume_bulk_new
from core.models.dataprocessing import DataProcessing
from recruiter.utils import bulk_upload_notify_user
from job.views.job_parser_new import sovren_jobparser_v10_new


@shared_task
def sleepy(duration):
    sleep(duration)
    return None


@shared_task
def send_asynchronous_email(email_address, subject, body, html_content=None, time_delay=None):
    send_simple_message(email_address, subject, body, html_content, time_delay)


@shared_task
def asynchronous_uploadResume(user):
    # resumeupload(user, resume_file)
    sovrenresume(user)
    # return {"status": True}


@shared_task
def asynchronous_resume_upload_new(recruiter_id, tenant_id, resume_file, path):
    sovrenresume_bulk_new(recruiter_id, tenant_id, resume_file, path)


@shared_task
def check_bulk_resume_upload_completeness(ids):
    completed_tasks = []
    for id in ids:
        obj = DataProcessing.objects.get(id=id)
        if obj.is_processed is True:
            completed_tasks.append(id)
            user_id = obj.user.id
        else:
            continue
    # remove completed tasks
    remaining_ids = list(set(ids) - set(completed_tasks))
    if len(completed_tasks) == len(ids):
        bulk_upload_notify_user(user_id)
    else:
        check_bulk_resume_upload_completeness.apply_async(args=(remaining_ids,), countdown=10)


@shared_task
def send_from_email(
    from_email,
    to_email_address,
    subject,
    body=None,
    html_content=None,
    filepath=None,
):
    send_mail_with_attachement(
        from_email,
        to_email_address,
        subject,
        body,
        html_content,
        filepath,
    )


@shared_task
def asynchronous_jobs_bulk_upload(job, **kwargs):
    sovren_jobparser_v10_new(job, **kwargs)


@shared_task
def check_bulk_jobs_upload_completeness(ids):
    completed_tasks = []
    for id in ids:
        obj = DataProcessing.objects.get(id=id)
        if obj.is_processed is True:
            completed_tasks.append(id)
            user_id = obj.user.id
        else:
            continue
    # remove completed tasks
    remaining_ids = list(set(ids) - set(completed_tasks))
    if len(completed_tasks) == len(ids):
        bulk_upload_notify_user(user_id)
    else:
        check_bulk_jobs_upload_completeness.apply_async(args=(remaining_ids,), countdown=10)