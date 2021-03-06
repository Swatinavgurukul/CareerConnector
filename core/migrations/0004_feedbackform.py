# Generated by Django 3.1.4 on 2021-04-30 09:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20210414_0954'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeedbackForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback_type', models.CharField(blank=True, max_length=191, null=True)),
                ('page', models.CharField(blank=True, max_length=191, null=True)),
                ('description', models.TextField(blank=True, max_length=2000, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_feedback', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'feedback_form',
            },
        ),
    ]
