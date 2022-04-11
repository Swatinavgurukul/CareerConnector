import os, django, random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from core.models.users import User
from django.utils import timezone
from django.contrib.auth.hashers import make_password


fake = Faker()

# id=random.randint(1,100)
# fake_tenant_id=random.randint(1,100)
# tenant_id=fake_tenant_id,


def add_user():
    fake_tenant = "4"
    fake_username = fake.user_name()
    fake_email = fake.email()
    fake_name = fake.name()
    name_list = fake_name.split()
    fake_first_name = name_list[0]
    fake_last_name = name_list[1]
    fake_password = make_password("testpassword")
    fake_created_at = timezone.now()
    fake_updated_at = timezone.now()
    u = User.objects.get_or_create(
        tenant_id=fake_tenant,
        location_id=random.randint(1, 50),
        username=fake_username,
        email=fake_email,
        first_name=fake_first_name,
        last_name=fake_last_name,
        password=fake_password,
        created_at=fake_created_at,
        updated_at=fake_updated_at,
    )[0]
    u.save()
    return u


def create_user(N):
    for i in range(N):
        user = add_user()


if __name__ == "__main__":
    print("populating")
    create_user(49)
    print("done")