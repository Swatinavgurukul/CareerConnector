import os, django, random
from django.utils.text import slugify
from job.utils.slug_generator import random_string_generator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.jobs import Job


fake = Faker()
STATUS = ["active", "closed", "draft", "paused"]
JOB_TYPE = ["contract", "self-employed", "part-time", "full-time", "internship", "apprenticeship", "freelance"]
SALARY_TYPE = ["per-year", "per-hour", "per-week", "per-month", "biweekly", "per-day", "quarter", "other", "piece-rate"]
fake_level = ["intern", "fresher", "experienced"]


def unique_slug_generator(title, new_slug=None):
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(title)

    qs_exists = Job.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = slug + "-" + random_string_generator(size=6)
        # new_slug = "{slug}-{randstr}".format(slug=slug, randstr=random_string_generator(size=6))
        return unique_slug_generator(title, new_slug=new_slug)
    return slug


def add_jobs():
    fake_tenant = "4"
    fake_user = "1"
    fake_location = random.randint(1, 50)
    fake_company = random.randint(1, 22)
    category = random.randint(1, 27)
    industry = random.randint(1, 148)
    qualification = random.randint(1, 11)
    fake_title = fake.job()
    fake_description = fake.paragraph(nb_sentences=2, variable_nb_sentences=False)
    fake_short_description = fake.sentence(nb_words=10)
    easy_apply = bool(random.getrandbits(1))
    remote_location = bool(random.getrandbits(1))
    slug = unique_slug_generator(fake_title)
    status = random.choice(STATUS)
    job_type = random.choice(JOB_TYPE)
    salary_frequency = random.choice(SALARY_TYPE)
    opening_count = random.randint(0, 100)
    fake_linkedin = random.randint(0, 1)
    fake_broadbean = random.randint(0, 1)
    fake_zip_recruiter = random.randint(0, 1)
    level = random.choice(fake_level)
    fake_language = fake.language_name()
    fake_contact_name = fake.name()
    fake_email = fake.email()

    j = Job.objects.get_or_create(
        tenant_id=fake_tenant,
        user_id=fake_user,
        company_id=fake_company,
        category_id=category,
        industry_id=industry,
        qualification_id=qualification,
        title=fake_title,
        location_id=fake_location,
        easy_apply=easy_apply,
        remote_location=remote_location,
        slug=slug,
        status=status,
        job_type=job_type,
        salary_frequency=salary_frequency,
        level=level,
        description=fake_description,
        short_description=fake_short_description,
        language=fake_language,
        contact_email=fake_email,
        contact_name=fake_contact_name,
        opening_count=opening_count,
        linkedin=fake_linkedin,
        broadbean=fake_broadbean,
        zip_recruiter=fake_zip_recruiter,
    )[0]
    j.save()
    return j


def create_job(N):
    for i in range(N):
        job = add_jobs()


if __name__ == "__main__":
    print("populating job")
    create_job(50)
    print("done")