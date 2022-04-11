from job.models.job_applications import JobApplication
import requests
import json
from decouple import config
import base64


def submission_api(data):
    resume_file = data["resume_file"]
    if len(str(resume_file)) > 1:
        base64str = base64.b64encode(resume_file.file.read())
    else:
        base64str = None

    # domain = data["base_url"]
    # if domain == "127.0.0.1:8000":
    #     url = "http://127.0.0.1:8000/api/v1/questions/{0}/jobs".format(data["slug"])
    # else:
    #     url = "https://" + domain + "/api/v1/questions/{0}/jobs".format(data["slug"])
    # q_a = list(JobQuestion.objects.filter(user_id=data["user_id"], job_id=data["j_id"]).values("identifier", "answer"))
    # resp = requests.get(url)

    raw_data = {}
    # raw_data["job_id"] = data["job_id"]
    raw_data["resume"] = str(base64str)
    raw_data["first_name"] = data["first_name"]
    raw_data["response_id"] = "155be9b5"
    raw_data["last_name"] = data["last_name"]
    raw_data["email"] = data["email"]
    raw_data["isProcessed"] = data["isProcessed"]
    raw_data["created_at"] = data["created_at"]
    raw_data["vendor"] = data["vendor"]
    raw_data["score"] = data["score"]
    raw_data["score_json"] = data["score_json"]
    if data["question_answers"]:
        raw_data["question_answers"] = json.loads(data["question_answers"])

    url_tuft = config("VMS_V1_URL")

    payload = raw_data

    headers = {
        "content-type": "application/json",
        "X-Token": config("VMS_V1_TOKEN"),
    }
    response = requests.post(url_tuft, json=payload, headers=headers)
    responseJson = json.loads(response.content)
    applied_job = JobApplication.objects.filter(
        tenant=data["tenant_id"],
        user=data["user_id"],
        job=data["j_id"],
        # applied=True,
    )
    obj1 = applied_job[0]
    obj1.submission = responseJson["message"]
    obj1.save()
    return raw_data
