# Generated by Django 3.1.4 on 2021-07-13 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0006_merge_20210712_1149'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobbookmark',
            name='is_archived',
            field=models.BooleanField(default=False),
        ),
    ]
