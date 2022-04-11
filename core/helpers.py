import json
import requests
import re
from decouple import config
from rest_framework.response import Response
import base64
import datetime
from datetime import date
import os.path
from job.models.job_company import JobCompany
from resume.models.profile import Profile
from resume.models.work import Work
from resume.models.education import Education
from resume.models.certificate import Certification
from resume.models.skill import Skills
from resume.models.achievement import Achievement
from core.models.users import User
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import string
import random
from directsourcing.settings import MEDIA_ROOT
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType
from sendgrid import SendGridAPIClient
import time
from urllib.parse import urlparse


def get_asset(key):
    with open("./static/manifest.json") as f:
        manifest_json = json.load(f)
    return manifest_json.get(key)


def send_simple_message(email_address, subject, body=None, html=None, time_delay=None):
    message = Mail(
        from_email="CareerConnector<noreply@simplifyhire.com>",
        to_emails=email_address,
        subject=subject,
        plain_text_content=body,
        html_content=html,
    )

    if time_delay:
        message.send_at = int(time.time()) + time_delay

    try:
        sendgrid_client = SendGridAPIClient(config("SENDGRID_API"))
        response = sendgrid_client.send(message)
        print(response.status_code)
        # print(response.body)
        # print(response.headers)
    except Exception as e:
        print(e.body)


# def send_simple_message(email_address, subject, body=None, html=None):
#     return requests.post(
#         config("MAILGUN_DOMAIN_NAME"),
#         auth=("api", config("MAILGUN_API_KEY")),
#         data={
#             "from": "Simplify Hire<emailverification@simplifyhire.net>",
#             "to": email_address,
#             "subject": subject,
#             "text": body,
#             "html": html,
#         },
#     )


def send_mail_with_attachement(from_email, to_email_address, subject, body=None, html_content=None, filepath=None):
    message = Mail(
        from_email=from_email,
        to_emails=to_email_address,
        subject=subject,
        plain_text_content=body,
        html_content=html_content,
    )
    li = list(filepath.split(","))
    lis = []
    count = 0
    for attachment in li:
        path = os.path.join(str(MEDIA_ROOT), "attachments")
        filepath = os.path.join(path, attachment)
        head, tail = os.path.split(attachment)
        with open(filepath, "rb") as f:
            data = f.read()
            f.close()
        encoded = base64.b64encode(data).decode()
        x = Attachment()
        x.file_content = FileContent(encoded)
        x.file_type = FileType("application/pdf")
        x.file_name = FileName(tail)
        lis.append(x)
        count = count + 1
    message.attachment = lis

    try:
        sendgrid_client = SendGridAPIClient(config("SENDGRID_API"))
        response = sendgrid_client.send(message)
        print(response.status_code)
    except Exception as e:
        print(e.message)


# def send_mail_with_attachement(from_email, to_email_address, subject, body=None, html_content=None, filepath=None):
#     print(filepath)
#     li = list(filepath.split(","))
#     files = {}
#     # filesxx = {}
#     count = 0
#     for attachment in li:
#         path = os.path.join(str(MEDIA_ROOT), "attachments")
#         filepath = os.path.join(path, attachment)
#         with open(filepath, "rb") as f:
#             # filesxx["attachment[" + str(count) + "]"] = os.path.basename(filepath)
#             files["attachment[" + str(count) + "]"] = (os.path.basename(filepath), f.read())
#         count = count + 1

#     return requests.post(
#         config("MAILGUN_DOMAIN_NAME"),
#         auth=("api", config("MAILGUN_API_KEY")),
#         files=files,
#         data={
#             "from": from_email,
#             "to": "ayush@simplifyvms.com",
#             "subject": subject,
#             "text": body,
#             "html": html_content,
#         },
#     )


def generate_username(email):
    account_name = re.findall("[a-zA-Z0-9_.+-]+", email)
    val = "{0}".format(account_name[0]).lower()
    x = 0
    while True:
        if x == 0 and User.objects.filter(username=val).count() == 0:
            return val
        else:
            new_val = "{0}{1}".format(val, x)
            if User.objects.filter(username=new_val).count() == 0:
                return new_val
        x += 1
        if x > 1000000:
            raise Exception("Unable to create username , Name is super popular!")


def api_response(code, message, data):
    data = {
        "status": code,
        "message": message,
        "data": data,
    }
    return Response(data=data, status=code)


def get_pagination(request, obj, size):
    paginator = Paginator(obj, size, orphans=0, allow_empty_first_page=True)
    page_number = request.GET.get("page")
    try:
        items = paginator.page(page_number)
    except PageNotAnInteger:
        page_number = 1
        items = paginator.page(page_number)
    except EmptyPage:
        page_number = paginator.num_pages
        items = paginator.page(page_number)
    return {
        "page_number": page_number,
        "page_count": len(items),
        "total_pages": paginator.num_pages,
        "data": items,
    }


def password_validation(pwd):
    """
    Password validations for user
    """
    errors = []
    if bool(re.search(r"\s", pwd)):
        errors.append("The password should not contain any spaces")

    if len(pwd) < 8:
        errors.append("The password must contain at least 8 characters")

    # if not re.findall(r"\d", pwd):
    #     errors.append("The password must contain at least 1 digit, 0-9.")

    # if not re.findall("[A-Z]", pwd):
    #     errors.append("The password must contain at least 1 uppercase letter, A-Z.")

    # if not re.findall("[a-z]", pwd):
    #     errors.append("The password must contain at least 1 lowercase letter, a-z.")

    # if not re.findall(r"[()[\]{}|\\`~!@#$%^&*_\-+=;:'\",<>./?]", pwd):
    #     errors.append("The password must contain at least 1 special character: " + r"()[]{}|\`~!@#$%^&*_-+=;:'\",<>./?")
    return errors


def call_sovrenapi(filePath):
    """
    SovrenResumeApi
    """
    with open(filePath, "rb") as f:
        base64str = base64.b64encode(f.read()).decode("UTF-8")
        epochSeconds = os.path.getmtime(filePath)
        revisionDate = datetime.datetime.fromtimestamp(epochSeconds).strftime("%Y-%m-%d")
        url = "https://rest.resumeparsing.com/v9/parser/resume"
        payload = {"DocumentAsBase64String": base64str, "RevisionDate": revisionDate}
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
            "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
        }
        response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
        responseJson = json.loads(response.content)
        return responseJson


def job_parser(filePath):
    with open(filePath, "rb") as f:

        base64str = base64.b64encode(f.read()).decode("UTF-8")
        epochSeconds = os.path.getmtime(filePath)
        revisionDate = datetime.datetime.fromtimestamp(epochSeconds).strftime("%Y-%m-%d")
        url = "https://rest.resumeparsing.com/v9/parser/joborder"
        payload = {"DocumentAsBase64String": base64str, "RevisionDate": revisionDate}
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
            "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
        }
        response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
        responseJson = json.loads(response.content)
        Data = json.loads(responseJson["Value"]["ParsedDocument"])
        return Data


def sovren_matcher(data):

    url = "https://rest.resumeparsing.com/v10/scorer/bimetric/joborder"
    payload = {"DocumentAsBase64String": data}
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
        "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
    }
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
    responseJson = json.loads(response.content)
    return responseJson


def recursive_lookup(k, d):
    if k in d:
        return d[k]
    for v in d.values():
        if isinstance(v, dict):
            a = recursive_lookup(k, v)
            if a is not None:
                return a
        if isinstance(v, list):
            for i in v:
                if isinstance(i, dict):
                    a = recursive_lookup(k, i)
                    if a is not None:
                        return a
    return None


def date_func(date_year):
    if date_year == "current" or date_year == "present":
        return datetime.datetime.now().date()
    else:
        dtFormat = ("%Y-%m", "%Y")
        for i in dtFormat:
            try:
                return datetime.datetime.strptime(date_year, i).date()
            except ValueError:
                pass


def education_fun(date_year):
    if date_year == "current" or date_year == "notKnown":
        return None
    else:
        dtFormat = ("%Y-%m", "%Y")
        for i in dtFormat:
            try:
                return datetime.datetime.strptime(date_year, i).date()
            except ValueError:
                pass


def check_or_create(request, company):
    try:
        check = JobCompany.objects.get(name=company)
        companyname = check.name
        org_normalized = check
    except JobCompany.DoesNotExist:
        sovcompany = JobCompany.objects.create(tenant_id=request.user.tenant.id, name=company, user_created=True)
        org_normalized = sovcompany
    return org_normalized


def delete_parsed_data(user_id):
    profile_obj = Profile.objects.get(user=user_id)
    profile_obj.about_me = None
    profile_obj.linkdein_link = None
    profile_obj.blog_link = None
    profile_obj.facebook_link = None
    profile_obj.google_link = None
    profile_obj.save()
    work_obj = Work.objects.filter(user=user_id)
    edu_obj = Education.objects.filter(user=user_id)
    certification_obj = Certification.objects.filter(user=user_id)
    skill_obj = Skills.objects.filter(user=user_id)
    acheivment_obj = Achievement.objects.filter(user=user_id)
    for work in work_obj:
        work.delete()
    for edu in edu_obj:
        edu.delete()
    for certificate in certification_obj:
        certificate.delete()
    for skill in skill_obj:
        skill.delete()
    for acheivment in acheivment_obj:
        acheivment.delete()
    return None


def employment_type(positionType):
    if positionType == "contract":
        emptype = "Contract"
        return emptype
    else:
        positionType == "directHire"
        emptype = "Permanent"
        return emptype


def current_employment(current_employment):
    if current_employment == "true":
        iscurrent = True
        return iscurrent
    else:
        iscurrent = False
        return iscurrent


def cleanhtml(raw_html):
    cleanr = re.compile("<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});")
    cleantext = re.sub(cleanr, "", raw_html)
    return cleantext


def job_parser_encoded(base64str):
    revisionDate = date.today().strftime("%Y-%m-%d")
    url = "https://rest.resumeparsing.com/v9/parser/joborder"
    payload = {"DocumentAsBase64String": base64str, "RevisionDate": revisionDate}
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
        "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
    }
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
    responseJson = json.loads(response.content)
    Data = json.loads(responseJson["Value"]["ParsedDocument"])
    return Data


def password_generator(size=8, chars=string.ascii_uppercase + string.digits + string.punctuation):
    return "".join(random.choice(chars) for _ in range(size))


# def register_user(request, email):
#     try:
#         return User.objects.get(email=email).id
#     except User.DoesNotExist:
#         url = "http://localhost:8000/api/v1/register"

#         password = password_generator()
#         payload = {"email": email, "password": password, "set_password": "yes"}
#         headers = {
#             "accept": "application/json",
#             "content-type": "application/json",
#         }
#         response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
#         responseJson = json.loads(response.content)
#         return responseJson["data"]["id"]


"""
bimetric implementation
"""


def parse_resume(filePath):
    """
    SovrenResumeApi
    """
    with open(filePath, "rb") as f:
        base64str = base64.b64encode(f.read()).decode("UTF-8")
        epochSeconds = os.path.getmtime(filePath)
        revisionDate = datetime.datetime.fromtimestamp(epochSeconds).strftime("%Y-%m-%d")
        url = "https://rest.resumeparsing.com/v9/parser/resume"
        payload = {"DocumentAsBase64String": base64str, "DocumentLastModified": revisionDate}
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
            "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
        }

        response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
        responseJson = json.loads(response.content)
        # import pdb
        # pdb.set_trace()
        # parsedDoc = json.loads(responseJson['Value']['ParsedDocument'])
        # parsedDoc = json.loads(responseJson['Value'])
        return responseJson


def bimetric_score(sourcedata, target):
    # revisionDate = (date.today().strftime("%Y-%m-%d"))

    url = "https://rest.resumeparsing.com/v9/scorer/bimetric"
    # payload = {"SourceDocument": sourcedata,"TargetDocuments":target, "Settings": {"PositionTitlesMustHaveAnExactMatch": False,"PositionTitlesIgnoreSingleWordVariations": False},"CategoryWeights": [{"Category": "","Weight": 0}]}
    payload = {"Settings": None, "SourceDocument": sourcedata, "TargetDocuments": target, "CategoryWeights": []}
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
        "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
    }
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)

    responseJson = json.loads(response.content)
    return responseJson


"""
Version 10 bimetric score implementation
"""


def parse_resume_ten(filePath):
    """
    Sovren parse ResumeApi
    """
    with open(filePath, "rb") as f:
        base64str = base64.b64encode(f.read()).decode("UTF-8")
        # epochSeconds = os.path.getmtime(filePath)
        revisionDate = "2021-04-01"
        url = "https://rest.resumeparsing.com/v10/parser/resume"
        payload = {"DocumentAsBase64String": base64str, "DocumentLastModified": revisionDate}
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
            "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
        }
        response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
        responseJson = json.loads(response.content)
        ResumeData = responseJson["Value"]["ResumeData"]
        # parsedDoc = json.loads(responseJson['Value'])
        return ResumeData


def job_parser_ten(filePath):
    with open(filePath, "rb") as f:

        base64str = base64.b64encode(f.read()).decode("UTF-8")
        # epochSeconds = os.path.getmtime(filePath)
        revisionDate = "2021-04-01"
        url = "https://rest.resumeparsing.com/v10/parser/joborder"
        payload = {"DocumentAsBase64String": base64str, "RevisionDate": revisionDate}
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
            "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
        }
        response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
        responseJson = json.loads(response.content)
        ResumeData = responseJson["Value"]["JobData"]
        return ResumeData


def bimetric_score_ten(sourcedata, target):
    # revisionDate = (date.today().strftime("%Y-%m-%d"))

    url = "https://rest.resumeparsing.com/v10/scorer/bimetric/joborder"
    # payload = {"SourceDocument": sourcedata,"TargetDocuments":target, "Settings": {"PositionTitlesMustHaveAnExactMatch": False,"PositionTitlesIgnoreSingleWordVariations": False},"CategoryWeights": [{"Category": "","Weight": 0}]}
    payload = {
        "SourceJob": {"Id": "string", "JobData": sourcedata},
        "TargetResumes": target,
        "TargetJobs": [],
        "Settings": {"PositionTitlesMustHaveAnExactMatch": False, "PositionTitlesIgnoreSingleWordVariations": False},
        "PreferredCategoryWeights": {
            "Education": 20,
            "JobTitles": 20,
            "Skills": 20,
            "Industries": 20,
            # "Languages": 0,
            "Certifications": 20,
            # "ExecutiveType": 0,
            # "ManagementLevel": 0,
        },
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Sovren-AccountId": config("SOVREN_ACCOUNT_ID"),
        "Sovren-ServiceKey": config("SOVREN_SERVICE_KEY"),
    }
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)

    responseJson = json.loads(response.content)
    # Data = json.loads(responseJson)
    return responseJson


from core.get_tenant import get_user_tenant
from notification.models.notifications import EmailNotificationTemplate
import html
from django.template.loader import get_template
from core.task import send_asynchronous_email, send_from_email


def compile_email(
    namespace, request, user, data, path=None, cta=None, admin_email=None, filepath=None, toemail=None, time_delay=None
):

    if user.locale:
        lang = user.locale
    else:
        lang = "en"
    email_notification = EmailNotificationTemplate.objects.filter(name=namespace, language_preference=lang).values()
    body = (email_notification[0]["body"]).decode("iso-8859-1", "ignore")
    subject = email_notification[0]["subject"]
    to_email = email_notification[0]["to_address"]
    to_email_other = email_notification[0]["to_address_other"]
    attachments = email_notification[0]["attachments"]
    email_signature = email_notification[0]["email_signature"]
    button_text = email_notification[0]["cta"]
    if subject == "" or subject is None:
        subject = data["subject"]
    else:
        subject = subject

    if user.first_name is not None and user.last_name is not None:
        user_name = user.first_name + " " + user.last_name
    else:
        user_name = user.username
    email_address = user.email

    body = body.replace("{{" + "candidate_name" + "}}", user_name.title())
    for i in data:
        body = body.replace("{{" + i + "}}", data[i])

    if request is not None:
        path = request.build_absolute_uri()
    url_parse = urlparse(path)
    unsubscribe_url = url_parse.scheme + "://" + url_parse.netloc
    if cta:
        try:
            cta["text"] = button_text
        except:
            pass
        email_template = get_template("emails/action.html")
        html_content = email_template.render(
            {
                "body": body,
                # "candidate_name": user_name.title(),
                "text": cta["text"],
                "url": cta["url"],
                "email_signature": email_signature,
                "unsubscribe_url": unsubscribe_url,
            }
        )
        html_content = html.unescape(html_content)
        if admin_email:
            if user.role_id == 1:
                if to_email:
                    admin_email = to_email.split(",")
                else:
                    admin_email = "prahlad@simplifyvms.com"
            elif user.role_id == 2:
                if to_email_other:
                    admin_email = to_email_other.split(",")
                else:
                    admin_email = "prahlad@simplifyvms.com"
            email_template = get_template("emails/approval.html")
            html_content = email_template.render(
                {
                    "body": body,
                    # "candidate_name": user_name.title(),
                    "text": cta["text"],
                    "url": cta["url"],
                    # "text1": cta["text1"],
                    # "url1": cta["url1"],
                    "email_signature": email_signature,
                    "unsubscribe_url": unsubscribe_url,
                }
            )
            html_content = html.unescape(html_content)
            send_asynchronous_email.delay(admin_email, subject, body, html_content)
        else:
            send_asynchronous_email.delay(email_address, subject, body, html_content, time_delay)

    elif attachments or filepath:
        if toemail:
            email_address = data["to_email"]
            user_name = data["candidate_name"]
        email_template = get_template("emails/template.html")
        html_content = email_template.render(
            {
                "body": body,
                # "candidate_name": user_name.title(),
                "email_signature": email_signature,
                "unsubscribe_url": unsubscribe_url,
            }
        )
        html_content = html.unescape(html_content)
        from_address = "CareerConnector<noreply@simplifyhire.com>"
        if attachments:
            send_from_email.delay(from_address, email_address, subject, body, html_content, filepath=attachments)
        else:
            send_from_email.delay(from_address, email_address, subject, body, html_content, filepath=filepath)

    else:
        email_template = get_template("emails/template.html")
        html_content = email_template.render(
            {
                "body": body,
                # "candidate_name": user_name.title(),
                "email_signature": email_signature,
                "unsubscribe_url": unsubscribe_url,
            }
        )
        # for i in cta:
        #     body = body.replace("{{" + i + "}}", cta[i])
        html_content = html.unescape(html_content)
        send_asynchronous_email.delay(email_address, subject, body, html_content)


def get_name_by_lang(data, lang, name):
    if name[-1] == "\n":
        name = name[:-1]
    try:
        name = name.rstrip()
        return data[lang][name]
    except KeyError:
        return name
