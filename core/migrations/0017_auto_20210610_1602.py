# Generated by Django 3.1.4 on 2021-06-10 10:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_auto_20210610_1602'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='translation',
            unique_together={('namespace', 'language')},
        ),
    ]
