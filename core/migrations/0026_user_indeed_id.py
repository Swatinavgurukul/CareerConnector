# Generated by Django 3.1.4 on 2021-08-03 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_auto_20210728_1440'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='indeed_id',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
    ]
