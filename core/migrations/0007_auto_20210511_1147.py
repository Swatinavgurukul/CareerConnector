# Generated by Django 3.1.4 on 2021-05-11 06:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_tenant_billing'),
    ]

    operations = [
        migrations.AddField(
            model_name='tenant',
            name='logo_image',
            field=models.FileField(blank=True, null=True, upload_to='logo/'),
        ),
        migrations.AddField(
            model_name='tenant',
            name='logo_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
