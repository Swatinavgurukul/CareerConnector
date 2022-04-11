import json
import datetime
import requests
import pymongo
from job.models.jobs import Job
import random
import string
import re
from decouple import config
import datetime
from resume.helpers import recursive_lookup
from core.models.dataprocessing import DataProcessing

client = pymongo.MongoClient("mongodb://localhost:27017/")
# Database Name
db = client["dummydata"]
# job_mongo collection Name
job_mongo = db["job_parser"]


def sovren_jobparser_v10_new(job, **kwargs):
    documentid = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    environment = config("ENVIORNMENT")
    if environment == "development":
        index_id = "ds_job_development"
    elif environment == "local":
        index_id = "ds_job_local"
    elif environment == "staging":
        index_id = "ds_job_staging"
    else:
        index_id = "ds_job_production"
    url = "https://rest.resumeparsing.com/v10/parser/joborder"
    payload = json.dumps(
        {
            "DocumentAsBase64String": job,
            "DocumentLastModified": "2021-04-01",
            "IndexingOptions": {
                "IndexId": index_id,
                "DocumentId": documentid,
            },
        }
    )
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
        "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    responseJson = json.loads(response.content)
    if response.status_code == 200:
        if "jobid" in kwargs:
            job_parsed_data = job_mongo.insert_one({"job_id": kwargs["jobid"], "data": responseJson})
            mongo_object_id = job_parsed_data.inserted_id
            job_data = Job.objects.get(id=kwargs["jobid"])
            job_data.sovren_document_id = documentid
            job_data.sovren_index_id = index_id
            job_data.mongo_object_id = mongo_object_id
            job_data.save()
            return responseJson["Value"]["JobData"]
        else:
            sovren_response = responseJson["Value"]["JobData"]
            try:
                plain_text = recursive_lookup("PlainText", sovren_response)
                plain_text = re.sub(r"\[[0-9]*\]", " ", plain_text)
                plain_text = re.sub(r"\s+", " ", plain_text)
                description = plain_text.encode()
            except Exception as error:
                plain_text = None
                description = plain_text.encode()
            job_title = recursive_lookup("MainJobTitle", sovren_response)
            try:
                reference = datetime.datetime.now()
                date_time = reference.strftime("%m%d%H%M%S-%f")

                job_creation = Job.objects.create(
                    tenant_id=kwargs["tenantid"],
                    user_id=kwargs["userid"],
                    title=job_title,
                    status="draft",
                    vms_job_reference=reference.strftime("%d%H%M%S%f"),
                    vms_job_internal_reference=str("simplify-") + date_time,
                    company_name=kwargs["organisation_name"],
                    job_type_id=1,
                )
                job_parsed_data = job_mongo.insert_one({"job_id": job_creation.id, "data": responseJson})
                mongo_object_id = job_parsed_data.inserted_id

                job_creation.description = description
                job_creation.sovren_document_id = documentid
                job_creation.sovren_index_id = index_id
                job_creation.mongo_object_id = mongo_object_id
                job_creation.job_file_id = kwargs["myfile"][5:]
                job_creation.openings = 1
                # job_creation.interview_questions = (
                #     [
                #         {
                #             "id": "legally_authorized",
                #             "type": "select",
                #             "question": "Are you legally authorized to work in the country of job location?",
                #             "options": [{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}],
                #         },
                #         {
                #             "id": "visa_sponsorship",
                #             "type": "select",
                #             "question": "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?",
                #             "options": [{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}],
                #         },
                #     ],
                # )
                job_creation.save()

                # update dataprocessing status
                try:
                    obj = DataProcessing.objects.get(user_id=kwargs["userid"], file=kwargs["myfile"])
                    obj.is_parsed = True
                    obj.is_processed = True
                    obj.save()
                except DataProcessing.DoesNotExist:
                    pass
            except KeyError as error:
                # return str(error)
                try:
                    obj = DataProcessing.objects.get(user_id=kwargs["userid"], file=kwargs["myfile"])
                    obj.is_processed = True
                    obj.save()
                except DataProcessing.DoesNotExist:
                    pass

    else:
        # issue with parsing, it will be skipped, set processed to True
        try:
            obj = DataProcessing.objects.get(user_id=kwargs["userid"], file=kwargs["myfile"])
            obj.is_processed = True
            obj.save()
        except DataProcessing.DoesNotExist:
            pass
