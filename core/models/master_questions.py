import uuid
from django.db import models
from core.models.tenant import Tenant
from core.models.users import User


QUESTION_TYPE = [
        ("text", "Text"),
        ("single-choice", "SingleChoice"),
        ("multi-choice", "MultiChoice"),
    ]

DISPLAY_TEXTBOX_OPTIONS = [
        ("yes", "Yes"),
        ("no", "No"),
        ("all", "All"),
        ("other", "Other")
    ]


class BaseQuestion(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.DO_NOTHING)
    title = models.CharField(max_length=600)
    display_title = models.CharField(max_length=600, null=True, blank=True,
                                     help_text="Name [name] , position title [jobtitle]")
    type = models.CharField(max_length=191, choices=QUESTION_TYPE, default="single-choice")
    options = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Question(BaseQuestion):
    is_sub_question = models.BooleanField(default=False)
    display_textbox_options = models.CharField(max_length=191, choices=DISPLAY_TEXTBOX_OPTIONS, blank=True, null=True)
    textbox_label = models.CharField(max_length=191, null=True, blank=True,
                                     help_text="For both display_textbox_options we need to seprate text with | pipe operator")

    class Meta:
        db_table = "master_question"


class SubQuestion(BaseQuestion):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    class Meta:
        db_table = "master_sub_question"
