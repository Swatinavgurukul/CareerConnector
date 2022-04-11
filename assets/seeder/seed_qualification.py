import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.job_qualifications import JobQualification

f = open("qualification.txt")
qualification_list = f.readlines()
N = len(qualification_list)
fake = Faker()


def add_qualification(i):
    education = qualification_list[i]

    j = JobQualification.objects.get_or_create(
        tenant_id="4",
        education=education,
    )[0]
    j.save()
    return j


def create_qualification(N):
    for i in range(N):
        job = add_qualification(i)


if __name__ == "__main__":
    print("populating job")
    create_qualification(N)
    print("done")