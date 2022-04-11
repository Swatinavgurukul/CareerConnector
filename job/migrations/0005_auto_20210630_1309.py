# Generated by Django 3.1.4 on 2021-06-30 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0004_auto_20210618_1200'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobapplication',
            name='current_status',
            field=models.CharField(choices=[('sourced', 'Sourced'), ('applied', 'Applied'), ('screening', 'Phone screen'), ('interview', 'Interview'), ('offered', 'Offered'), ('rejected', 'Rejected'), ('hired', 'Hired'), ('declined', 'Declined'), ('on-hold', 'On hold'), ('withdrawn', 'Withdrawn')], default='applied', max_length=191),
        ),
        migrations.AlterField(
            model_name='jobstatus',
            name='status',
            field=models.CharField(choices=[('sourced', 'Sourced'), ('applied', 'Applied'), ('screening', 'Phone screen'), ('interview', 'Interview'), ('offered', 'Offered'), ('hired', 'Hired'), ('declined', 'Declined'), ('on-hold', 'On hold'), ('withdrawn', 'Withdrawn')], default='applied', max_length=191),
        ),
    ]
