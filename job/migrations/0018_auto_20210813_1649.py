# Generated by Django 3.1.4 on 2021-08-13 11:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0027_question_subquestion_survey'),
        ('job', '0017_jobsurvey_uuid'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurveyFeedBack',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('answers', models.JSONField(blank=True, null=True)),
                ('is_submitted', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('application', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='job.jobapplication')),
                ('job', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='job.job')),
                ('submitted_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('survey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.survey')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='core.tenant')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='_survey', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'survey_feedbacks',
                'db_table': 'survey_feedback',
            },
        ),
        migrations.DeleteModel(
            name='JobSurvey',
        ),
    ]