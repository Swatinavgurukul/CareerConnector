# Generated by Django 3.1.4 on 2021-04-14 07:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobalert',
            name='user',
        ),
    ]