# Generated by Django 3.1.4 on 2021-07-19 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_user_delete_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_image',
            field=models.URLField(blank=True, max_length=400, null=True),
        ),
    ]
