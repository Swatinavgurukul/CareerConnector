# Generated by Django 3.1.4 on 2021-06-01 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_merge_20210601_1421'),
    ]

    operations = [
        migrations.CreateModel(
            name='Translation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('namespace', models.CharField(max_length=20)),
                ('translation_type', models.CharField(max_length=20)),
                ('language', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'translation',
            },
        ),
    ]
