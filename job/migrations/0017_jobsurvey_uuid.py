# Generated by Django 3.1.4 on 2021-08-10 13:11

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0016_jobsurvey'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobsurvey',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]
