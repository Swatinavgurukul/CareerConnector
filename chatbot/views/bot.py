from core.get_tenant import get_user_tenant
from core.models.tenant import Tenant
import requests
import json
from decouple import config
import os
import uuid
from google.cloud.dialogflowcx_v3beta1.services.sessions import SessionsClient
from google.cloud.dialogflowcx_v3beta1.types import session
import sys

sys.path.append(os.path.abspath(os.path.join("..", "directsourcing")))

credential_path = "./assets/googleservice.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credential_path


def run_sample(texts):
    project_id = config("GOOGLE_PROJECT")
    location_id = "us"
    agent_id = config("DIALOGFLOWCX_AGENT")
    agent = f"projects/{project_id}/locations/{location_id}/agents/{agent_id}"
    session_id = uuid.uuid4()
    # texts = ["Hello"]
    language_code = "en-us"

    return detect_intent_texts(agent, session_id, texts, language_code)


def detect_intent_texts(agent, session_id, texts, language_code):

    session_client = SessionsClient()
    session_path = f"{agent}/sessions/{session_id}"
    # print(f"Session path: {session_path}\n")

    for text in texts:
        text_input = session.TextInput(text=text)
        query_input = session.QueryInput(
            text=text_input, language_code=language_code)
        request = session.DetectIntentRequest(
            session=session_path, query_input=query_input)
        response = session_client.detect_intent(request=request)
        # print("=" * 20)
        # print(f"Query text: {response.query_result.text}")
        response_messages = [" ".join(msg.text.text)
                             for msg in response.query_result.response_messages]

        # print(f"Response text: {' '.join(response_messages)}\n")
        intent_name = response.query_result.intent.display_name
        # print(intent_name)
        if intent_name == "jobs.search" or intent_name == "Default_Welcome_Intent":
            bot_type = "text"
        # print(intent_name)
        if intent_name == "jobs.search":
            if "geo-city" in response.query_result.parameters:
                geocity = [
                    msg for msg in response.query_result.parameters["geo-city"]]
            else:
                geocity = " "
            if "job-name" in response.query_result.parameters:
                jobname = [
                    msg for msg in response.query_result.parameters["job-name"]]
            else:
                jobname = " "
            # domain = request.get_host()
            tenant = get_user_tenant(request)
            domain = tenant.base_url
            if domain == "127.0.0.1.8000":
                domain = "127.0.0.1:8000"
            else:
                domain = "tufts.simplifycareers.com"
            search_api_url = "https://" + domain + "/api/v1/jobs?"
            params = {"query": jobname, "location": geocity}
            response = requests.get(search_api_url, params=params)
            response_data = json.loads(response.content)
            if response_data["data"]["total_count"] == 0:
                data = json.dumps(
                    {"type": "text", "response_messages": "No Job Found "})
            else:
                data = json.dumps(
                    {"type": "card", "response_messages": response_data,
                        "geocity": geocity, "jobname": jobname}
                )
            return data
    data = json.dumps(
        {"type": bot_type, "response_messages": response_messages})
    return data


# print(run_sample(["job for product manager in london"]))
