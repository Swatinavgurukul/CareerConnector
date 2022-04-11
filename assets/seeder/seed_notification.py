import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from notification.models.notifications import JobNotification


fake = Faker()


def add_job_notification():
    fake_tenant = "4"
    fake_user = random.randint(152, 201)
    # fake_job = random.randint(1, 200)
    fake_message = fake.text()
    j = JobNotification.objects.get_or_create(
        tenant_id=fake_tenant,
        user_id=fake_user,
        is_read=bool(random.getrandbits(1)),
        message=fake_message,
    )[0]
    j.save()
    return j


def create_job_notification(N):
    for i in range(N):
        job_notification = add_job_notification()


if __name__ == "__main__":
    print("populating job notification")
    create_job_notification(50)
    print("done")