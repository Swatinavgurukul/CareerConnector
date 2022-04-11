import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.job_bookmark import JobBookmark


fake = Faker()


def add_job_bookmark():
    fake_tenant = "4"
    fake_user = random.randint(152, 200)
    fake_job = random.randint(151, 200)
    j = JobBookmark.objects.get_or_create(
        tenant_id=fake_tenant,
        user_id=fake_user,
        job_id=fake_job,
        is_bookmarked=True,
    )[0]
    j.save()
    return j


def create_job_bookmark(N):
    for i in range(N):
        job_bookmark = add_job_bookmark()


if __name__ == "__main__":
    print("populating job bookmark")
    create_job_bookmark(10)
    print("done")