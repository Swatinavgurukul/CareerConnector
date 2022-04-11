from django.db import models
from requests.api import request
from core.models.tenant import Tenant
from job.models.jobs import Job
from core.models.users import User
from job.models.job_applications import JobApplication
from django.db.models.signals import post_save
from notification.models.notifications import JobNotification
from django.dispatch import receiver
from django import template
from django.template import Context
from django.template.loader import get_template
from core.helpers import compile_email

# from job.views.job import similar_job


class EmailTemplate(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(null=True, blank=True)
    model_type = models.CharField(null=True, blank=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notification_templates"

    def get_rendered_template(self, data, context):
        return self.get_template(data).render(context)

    def get_template(self, data):
        return template.Template(data)

    def get_username(self, username, context):
        return username

    def get_body(self, body, context):
        return body

    @staticmethod
    def compile_message(user, context):
        context = Context(context)
        message = EmailTemplate.objects.get(user=user)
        body = message.get_body(message.body, context)
        username = message.get_username(message.user.username, context)
        return username, body


# @receiver(post_save, sender=Job)
# def catch_job_creation_event(sender, created, instance, **kwargs):
#     if created:
#         user_ids = similar_job(instance.id)
#         body = "Similar Job for you:{}".format(instance.title)
#         model_type = "{}".format(instance._meta.db_table)
#         for user_id in user_ids:
#             EmailTemplate.objects.create(user_id=user_id, tenant=instance.tenant, job=instance, body=body, model_type=model_type)


@receiver(post_save, sender=EmailTemplate)
def notification_processor_event(sender, created, instance, **kwargs):
    if created:
        user = User.objects.get(id=instance.user.id)
        email_template = get_template("emails/apply.html")
        email_address = instance.user.email
        body = None
        if instance.model_type == "job_applications":
            if user.notication_frequency == "immediate":
                if user.is_notification_jobs is True:
                    JobNotification.objects.create(
                        tenant=instance.tenant,
                        user=instance.user,
                        job=instance.job,
                        is_read=False,
                        message=instance.body,
                        model_type=instance.model_type,
                    )
                    if user.first_name is not None and user.last_name is not None:
                        user_name = user.first_name + " " + user.last_name
                    else:
                        user_name = user.username
                    html_content = email_template.render({"body": instance.body, "candidate_name": user_name})
                    # subject = "Job Applied for {} with {} ".format(instance.job.title, instance.job.company.name)
                    subject = "Thank you for applying"
                    # send_simple_message(email_address, subject, body, html_content)
        if instance.model_type == "change_password":
            if user.notication_frequency == "immediate":
                if user.is_notification_jobs is True:
                    JobNotification.objects.create(
                        tenant=instance.tenant,
                        user=instance.user,
                        is_read=False,
                        message=instance.body,
                        model_type=instance.model_type,
                        job_id=1,
                    )
                    if user.first_name is not None and user.last_name is not None:
                        user_name = user.first_name + " " + user.last_name
                    else:
                        user_name = user.username
                    # html_content = email_template.render({"body": instance.body, "candidate_name": user_name})
                    # subject = "Password Updated Successfully"
                    # send_simple_message(email_address, subject, body, html_content)
                    # request = None
                    compile_email(
                        "user.change.password",
                        request,
                        user,
                        data={"email": user.email, "candidate_name": user_name},
                    )

        if instance.model_type == "jobs":
            if user.notication_frequency == "immediate":
                html_content = email_template.render({"message": instance.body})
                subject = "Job Alert Email"
                # send_simple_message(email_address, subject, body, html_content)
