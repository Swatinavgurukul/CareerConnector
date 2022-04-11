from django.forms import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from core.models.users import User
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
import requests
from rest_framework.utils import json
from core.helpers import password_validation, generate_username
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant
from decouple import config
from django.contrib.auth.models import Group
from django.utils import timezone

class GoogleLoginView(APIView):
    def post(self, request):
        payload = {"access_token": request.data.get(
            "access_token")}  # validate the token
        # print(payload)
        r = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo", params=payload)
        data = json.loads(r.text)

        if "error" in data:
            content = {
                "message": "wrong google token / this google token is already expired."}
            return Response(content)

        # create user if not exist
        try:
            user = User.objects.get(email=data["email"])
            user.last_login = timezone.now()
            user.save()
        except User.DoesNotExist:
            user = User()
            tenant = get_user_tenant(request)
            user.tenant = tenant
            user.username = generate_username(data["email"])
            # provider random default password
            user.password = make_password(
                BaseUserManager().make_random_password())
            user.email = data["email"]
            user.google_id = data["id"]
            user.is_verified_email = True
            user.approved = True
            user.last_login = timezone.now()
            user.first_name = data['given_name'] if 'given_name' in data else None
            user.last_name = data['family_name'] if 'family_name' in data else None
            user.profile_image = data['picture'] if 'picture' in data else None
            user.user_image = data['picture'] if 'picture' in data else None
            user.save()

        # generate token without username & password
        token = RefreshToken.for_user(user)
        response = {}
        first_name = user.first_name
        last_name = user.last_name
        if first_name is None and last_name is None:
            fullname = ""
        elif first_name is not None and last_name is None:
            fullname = first_name
        elif first_name is None and last_name is not None:
            fullname = last_name
        else:
            fullname = first_name + " " + last_name
        token["full_name"] = fullname
        token["email"] = user.email
        token["chat_id"] = str(user.chat_id)
        token["is_user"] = not user.is_superuser
        token["role_id"] = user.role_id
        token["canada"] = user.is_ca
        response["username"] = user.username
        response["access_token"] = str(token.access_token)
        response["refresh_token"] = str(token)

        return Response(response)


class LoginViaLinkedinView(APIView):
    def post(self, request):
        payload = {
            "grant_type": config("GRANT_TYPE"),
            "client_id": config("CLIENT_ID"),
            "client_secret": config("CLIENT_SECRET"),
            "redirect_uri": config("REDIRECT_URI"),
            "code": self.request.query_params.get("code"),
        }
        r = requests.get(
            "https://linkedin.com/oauth/v2/accessToken?", params=payload)
        data = json.loads(r.text)

        if "error" in data:
            raise ValidationError("Token Expired")
            # raise ValueError("Token Already Used")
            # return Response(content)

        if "access_token" in data:
            access_token = data["access_token"]
            email_endpoint = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))"
            headers = {"Authorization": "Bearer " + access_token}
            email_response = requests.get(
                email_endpoint, headers=headers).json()
            if "elements" in email_response:
                email_id = email_response["elements"][0]["handle~"]["emailAddress"]
            else:
                email_id = None
            profile_endpoint = "https://api.linkedin.com/v2/me"
            profile_name = requests.get(
                profile_endpoint, headers=headers).json()
            if "localizedFirstName" in profile_name:
                first_name = profile_name["localizedFirstName"]
            else:
                first_name = None
            if "localizedLastName" in profile_name:
                last_name = profile_name["localizedLastName"]
            else:
                last_name = None
            linkedin = profile_name["id"]
            profile_image_endpoint="https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))"
            profile_image=requests.get(profile_image_endpoint, headers=headers).json()
            try:
                user_image=profile_image["profilePicture"]["displayImage~"]["elements"][0]["identifiers"][0]["identifier"]
            except KeyError:
                user_image=None
        # create user if not exist
        try:
            user = User.objects.get(email=email_id)
            user.last_login = timezone.now()
            user.save()
        except User.DoesNotExist:
            user = User()
            user.username = generate_username(email_id)
            # provider random default password
            tenant = get_user_tenant(request)

            user.password = make_password(
                BaseUserManager().make_random_password())
            user.email = email_id
            user.tenant = tenant
            user.first_name = first_name
            user.last_name = last_name
            user.linkedin_id = linkedin
            user.approved = True
            user.user_image = user_image
            user.is_verified_email = True
            user.last_login = timezone.now()
            user.save()

        # generate token without username & password
        token = RefreshToken.for_user(user)
        response = {}
        first_name = user.first_name
        last_name = user.last_name
        if first_name is None and last_name is None:
            fullname = ""
        elif first_name is not None and last_name is None:
            fullname = first_name
        elif first_name is None and last_name is not None:
            fullname = last_name
        else:
            fullname = first_name + " " + last_name
        #group = Group.objects.get(name="candidate")

        # TODO: We need to change here once Rbac will merge.

        token["full_name"] = fullname
        token["email"] = user.email
        token["chat_id"] = str(user.chat_id)
        token["is_user"] = not user.is_superuser
        token["role_id"] = user.role_id
        #token["group"] = {"id":group.id,"name":group.name}
        response["username"] = user.username
        response["access_token"] = str(token.access_token)
        response["refresh_token"] = str(token)
        return Response(response)


class IndeedLoginView(APIView):
    def post(self, request):

        # Request Indeed Tokens API to fetch the access token
        access_token_url = "https://apis.indeed.com/oauth/v2/tokens"
        access_token_header = {"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"}
        access_token_data = {"code": request.data.get("code"),
                             "client_id": config("INDEED_CLIENT_ID"),
                             "client_secret": config("INDEED_CLIENT_SECRET"),
                             "redirect_uri": config("INDEED_REDIRECT_URI"),
                             "grant_type": config("GRANT_TYPE")}

        r = requests.request("POST", url=access_token_url, headers=access_token_header, data=access_token_data)
        access_token_data = r.json()

        if "error" in access_token_data:
            raise ValidationError("Token Expired")

        if "access_token" in access_token_data:
            # Request the get user Info Indeed API
            headers = {"Authorization": "Bearer " + access_token_data['access_token']}
            r = requests.get("https://secure.indeed.com/v2/api/userinfo", headers=headers)
            data = r.json()

            if "error" in data:
                content = {"message": "wrong indeed token."}
                return Response(content)

        # create user if not exist
        try:
            user = User.objects.get(email=data["email"])
            user.last_login = timezone.now()
            user.save()
        except User.DoesNotExist:
            user = User()
            tenant = get_user_tenant(request)
            user.tenant = tenant
            user.username = generate_username(data["email"])
            # provider random default password
            user.password = make_password(
                BaseUserManager().make_random_password())
            user.email = data["email"]
            user.approved = True
            user.is_verified_email = True
            user.indeed_id = data["sub"]
            user.last_login = timezone.now()
            user.save()

        # generate token without username & password
        token = RefreshToken.for_user(user)
        response = {}
        first_name = user.first_name
        last_name = user.last_name
        if first_name is None and last_name is None:
            fullname = ""
        elif first_name is not None and last_name is None:
            fullname = first_name
        elif first_name is None and last_name is not None:
            fullname = last_name
        else:
            fullname = first_name + " " + last_name
        token["full_name"] = fullname
        token["email"] = user.email
        token["chat_id"] = str(user.chat_id)
        token["is_user"] = not user.is_superuser
        token["role_id"] = user.role_id
        response["username"] = user.username
        response["access_token"] = str(token.access_token)
        response["refresh_token"] = str(token)

        return Response(response)
