from django.db import models
from core.models.users import User


class Feedback(models.Model):
    title = models.CharField(max_length=191, null=True, blank=True)
    text = models.CharField(max_length=191, null=True, blank=True)
    image = models.ImageField(blank=True, null=True, upload_to="feedback/")
    rating = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = "feedbacks"



class FeedbackForm(models.Model):
    user = models.ForeignKey(User, related_name='user_feedback', on_delete=models.CASCADE)
    feedback_type = models.CharField(max_length=191, null=True, blank=True)
    page = models.CharField(max_length=191, null=True, blank=True)
    description = models.TextField(max_length=2000, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "feedback_form"