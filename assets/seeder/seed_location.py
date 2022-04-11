import os, django, random


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from core.models.location import Location

fake = Faker()


def add_location():
    street_name = fake.street_name()
    city = fake.city()
    postal_code = fake.postalcode()
    state = fake.state()
    country = fake.country()
    country_code = fake.country_code()

    j = Location.objects.get_or_create(
        street_name=street_name,
        city=city,
        postal_code=postal_code,
        state=state,
        country=country,
        country_code=country_code,
    )[0]
    j.save()
    return j


def create_location(N):
    for i in range(N):
        job = add_location()


if __name__ == "__main__":
    print("populating job")
    create_location(50)
    print("done")