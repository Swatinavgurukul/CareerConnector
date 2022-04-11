import os, django, random
import csv
import codecs
import sumy
import pandas
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
import nltk
from django.utils.text import slugify
from job.utils.slug_generator import random_string_generator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "directsourcing.settings")
django.setup()

from faker import Faker
from job.models.jobs import Job

fake = Faker()
path = "Dice_US_jobs.csv"
# nltk.download("punkt")
df = pandas.read_csv(r"C:\Users\Angithala\Downloads\Dice_US_jobs1.csv", encoding="ISO-8859-1")
# print(df["job_type"][0])

salary_type = ["per-year", "per-hour", "per-week", "per-month", "biweekly", "per-day", "quarter", "other", "piece-rate"]
# category = ["Accounting/Finance", "Admin/Secretarial", "Advertising", "Architect/Design", "Art/Media/Writers"]
# education=["High School", "Associate", "Bachelor's","Master's","Doctoral"]
employment_type = ["contract", "self-employed", "part-time", "full-time", "internship", "apprenticeship", "freelance"]
STATUS = ["active", "closed", "draft", "paused"]


def summ(text):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LexRankSummarizer()
    summary = summarizer(parser.document, 1)
    return summary[0]


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


def add_jobs(i):
    fake_tenant = "4"
    fake_user = "1"
    fake_location = random.randint(1, 50)
    fake_company = random.randint(1, 22)
    category = random.randint(1, 27)
    industry = random.randint(1, 148)
    qualification = random.randint(1, 11)

    fake_title = df["job_title"][i]
    # fake_location = df["location"][i]
    data = df["job_description"][i]
    description = (data[:185] + "..") if len(data) > 185 else data
    fake_description = description
    fake_short_description = summ(fake_description)
    # fake_bill_rate = fake.pyint()
    # fake_bill_rate_currency = "USD"
    fake_language = "English"
    # fake_address = df["location"][i]
    # fake_contact_url = df["page_url"][i]
    fake_email = " "
    # fake_company = df["organization"][i]
    # skill = df["sector"][i]
    # skills = (skill[:185] + "..") if len(skill) > 185 else skill
    # fake_skills = skills
    fake_opening = random.randint(0, 100)
    fake_linkedin = random.randint(0, 1)
    fake_broadbean = random.randint(0, 1)
    fake_zip_recruiter = random.randint(0, 1)

    j = Job.objects.get_or_create(
        tenant_id=fake_tenant,
        user_id=fake_user,
        company_id=fake_company,
        category_id=category,
        industry_id=industry,
        qualification_id=qualification,
        title=fake_title,
        location_id=fake_location,
        easy_apply=bool(random.getrandbits(1)),
        remote_location=bool(random.getrandbits(1)),
        slug=unique_slug_generator(fake_title),
        level=random.choice(employment_type),
        description=fake_description,
        short_description=fake_short_description,
        language=fake_language,
        contact_email=fake_email,
        contact_name=fake.name(),
        job_type=random.choice(employment_type),
        salary_frequency=random.choice(salary_type),
        status=random.choice(STATUS),
        opening_count=fake_opening,
        linkedin=fake_linkedin,
        broadbean=fake_broadbean,
        zip_recruiter=fake_zip_recruiter,
    )[0]
    j.save()
    return j


def create_job(N):
    for i in range(N):
        job = add_jobs(i)


if __name__ == "__main__":
    print("populating job")
    create_job(50)
    print("done")