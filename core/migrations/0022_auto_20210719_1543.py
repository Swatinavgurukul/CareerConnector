# Generated by Django 3.1.4 on 2021-07-19 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0021_merge_20210719_1543'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_image',
            field=models.URLField(blank=True, max_length=191, null=True),
        ),
    ]