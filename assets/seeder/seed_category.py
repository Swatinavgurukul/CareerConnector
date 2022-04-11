import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.job_category import Category

f = open("category.txt")
category_list = f.readlines()
N = len(category_list)
fake = Faker()


def add_category(i):
    name = category_list[i]

    j = Category.objects.get_or_create(
        tenant_id="4",
        name=name,
    )[0]
    j.save()
    return j


def create_category(N):
    for i in range(N):
        job = add_category(i)


if __name__ == "__main__":
    print("populating job")
    create_category(N)
    print("done")