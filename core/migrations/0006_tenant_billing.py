# Generated by Django 3.1.4 on 2021-05-10 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20210507_1451'),
    ]

    operations = [
        migrations.AddField(
            model_name='tenant',
            name='billing',
            field=models.BooleanField(default=False, null=True),
        ),
    ]