import os
import django
import random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()
from faker import Faker
from job.models.job_company import JobCompany
import json

fake = Faker()
path = r"C:\Users\Angithala\Downloads\company\ResourceXperts.json"
jsonFile = open(path, encoding="utf-8")
values = json.load(jsonFile)


def recursive_lookup(k, d):
    if k in d:
        return d[k]
    for v in d.values():
        if isinstance(v, dict):
            a = recursive_lookup(k, v)
            if a is not None:
                return a
        if isinstance(v, list):
            for i in v:
                if isinstance(i, dict):
                    a = recursive_lookup(k, i)
                    if a is not None:
                        return a
    return None


def add_company():
    fake_tenant = "4"
    fake_location = random.randint(151, 200)
    # fake_location = recursive_lookup("location", values)
    fake_name = recursive_lookup("name", values)
    fake_legal_name = recursive_lookup("legalName", values)
    fake_domain = recursive_lookup("domain", values)
    fake_domain_aliases = recursive_lookup("domainAliases", values)
    fake_sector = recursive_lookup("sector", values)
    fake_tags = recursive_lookup("tags", values)
    fake_description = recursive_lookup("description", values)
    fake_founded_year = recursive_lookup("foundedYear", values)
    fake_logo = recursive_lookup("logo", values)
    fake_phone = recursive_lookup("phone", values)
    fake_metrics = recursive_lookup("metrics", values)
    fake_time_zone = recursive_lookup("timeZone", values)

    j = JobCompany.objects.get_or_create(
        tenant_id=fake_tenant,
        name=fake_name,
        logo=fake_logo,
        description=fake_description,
        location_id=fake_location,
        domain=fake_domain,
        domain_aliases=fake_domain_aliases,
        founded_year=fake_founded_year,
        legal_name=fake_legal_name,
        metrics=fake_metrics,
        phone=fake_phone,
        sector=fake_sector,
        tags=fake_tags,
    )[0]
    j.save()
    return j


def create_company(N):
    for i in range(N):
        company = add_company()


if __name__ == "__main__":
    print("populating job comapny")
    create_company(1)
    print("done")
