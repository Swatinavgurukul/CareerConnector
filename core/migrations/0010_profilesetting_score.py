# Generated by Django 3.1.4 on 2021-05-25 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20210520_1442'),
    ]

    operations = [
        migrations.AddField(
            model_name='profilesetting',
            name='score',
            field=models.JSONField(null=True),
        ),
    ]