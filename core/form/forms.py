from django import forms
from core.models.feedback import Feedback


class FeedbackForm(forms.ModelForm):
    class Meta:
        model = Feedback
        exclude = []