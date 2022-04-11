import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.job_applications import JobApplication


fake = Faker()


def add_job_applications():
    fake_tenant = "4"
    fake_user = random.randint(151, 200)
    fake_job = random.randint(151, 200)
    j = JobApplication.objects.get_or_create(
        tenant_id=fake_tenant,
        user_id=fake_user,
        job_id=fake_job,
        applied=bool(random.getrandbits(1)),
    )[0]
    j.save()
    return j


def create_job_application(N):
    for i in range(N):
        job_application = add_job_applications()


if __name__ == "__main__":
    print("populating job applications")
    create_job_application(50)
    print("done")