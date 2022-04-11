from django_elasticsearch_dsl import Document, fields
from elasticsearch_dsl import analyzer
from django_elasticsearch_dsl.registries import registry
from job.models.jobs import Job
from core.models.tenant import Tenant
from core.models.location import Location
from job.models.job_category import Category
from job.models.job_company import JobCompany
from job.models.job_type import JobType
from decouple import config

html_strip = analyzer(
    "html_strip", tokenizer="standard", filter=["lowercase", "stop", "snowball"], char_filter=["html_strip"]
)


@registry.register_document
class JobDocument(Document):
    class Index:
        name = config("ELASTIC_INDEX")
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = Job
        fields = [
            "id",
            "title",
            "title_esp",
            "title_fr",
            "display_name",
            # "easy_apply",
            "remote_location",
            # "job_type",
            "salary_min",
            "created_at",
        ]

    tenant = fields.ObjectField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.TextField(),
        }
    )
    location = fields.ObjectField(
        properties={
            "city": fields.TextField(),
            "state": fields.TextField(),
            "state_code": fields.TextField(),
            "country": fields.TextField(),
            "country_code": fields.TextField(),
            "postal_code": fields.TextField(),
        }
    )
    company = fields.ObjectField(
        properties={
            "name": fields.TextField(),
        }
    )
    category = fields.ObjectField(
        properties={
            "name": fields.TextField(),
        }
    )
    job_type = fields.ObjectField(
        properties={
            "name": fields.TextField(),
        }
    )
    related_models = [Tenant, Location, JobCompany, Category, JobType]
