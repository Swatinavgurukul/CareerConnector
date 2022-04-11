# Generated by Django 3.1.4 on 2021-07-28 09:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0010_merge_20210726_1524'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplication',
            name='scheduled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='jobapplication',
            name='scheduled_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobapplication',
            name='scheduled_time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]