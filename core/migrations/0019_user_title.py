# Generated by Django 3.1.4 on 2021-07-05 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_excludeuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='title',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
