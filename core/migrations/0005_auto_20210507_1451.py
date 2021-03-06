# Generated by Django 3.1.4 on 2021-05-07 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_feedbackform'),
    ]

    operations = [
        migrations.AddField(
            model_name='tenant',
            name='b_address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tenant',
            name='b_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='tenant',
            name='b_first_name',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
        migrations.AddField(
            model_name='tenant',
            name='b_last_name',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
        migrations.AddField(
            model_name='tenant',
            name='b_phone',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
        migrations.AddField(
            model_name='tenant',
            name='b_phone_sec',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
        migrations.AddField(
            model_name='tenant',
            name='b_title',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
    ]
