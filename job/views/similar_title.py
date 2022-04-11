import requests
import json
from decouple import config


def similar_titles(query_param):
    similar_title_list = [query_param]
    url = "https://dev-similartitles-api.simplifyapis.com/similar_titles/"
    payload = {
        "mainJobTitle": query_param,
        # "relevantJobTitles": ["aws"],
        # "skills": ["devops"],
    }
    similar_api = "Bearer" + " " + config("SIMILAR_API_TOKEN")
    headers = {
        "authorization": similar_api,
        "accept": "application/json",
        "content-type": "application/json",
    }
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
    responseJson = json.loads(response.content)
    obj = responseJson["similarTitles"]
    for val in obj:
        for key, value in val.items():
            if key == "title":
                similar_title_list.append(value)
    return similar_title_list
