import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.job_industry import Industry

f = open("industry.txt")
industry_list = f.readlines()
N = len(industry_list)
fake = Faker()


def add_industry(i):
    name = industry_list[i]

    j = Industry.objects.get_or_create(
        tenant_id="4",
        name=name,
    )[0]
    j.save()
    return j


def create_industry(N):
    for i in range(N):
        job = add_industry(i)


if __name__ == "__main__":
    print("populating job")
    create_industry(N)
    print("done")