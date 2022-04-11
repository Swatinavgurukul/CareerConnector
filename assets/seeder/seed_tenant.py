import os, django, random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from django.utils import timezone

fake = Faker()

from core.models.tenant import Tenant

# base_url = models.URLField(null=True, max_length=191)

# 127.0.0.1
# client2.test
def add_Tenant():
    base_url1 = "client2.test"
    u = Tenant.objects.get_or_create(base_url=base_url1)[0]
    u.save()
    return u


def create_tenant(N):
    for i in range(N):
        tenant = add_Tenant()


if __name__ == "__main__":
    print("populating tenanat")
    create_tenant(1)
    print("done")