from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.models.tenant import Tenant
from core.models.users import User
from job.models.job_applications import JobApplication
from job.models.jobs import Job
from datetime import datetime
import pytz
from core.views.users_csv import download_job_application_File, download_job_File, download_tenant_File, downloadFile


class UsersCsvView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        users_obj = (
            User.objects.select_related("tenant")
            .filter(is_ca=True)
            .exclude(tenant__erd=0)
            .values(
                "id",
                "tenant_id",
                "is_active",
                "is_user",
                "is_locked",
                "is_verified_email",
                "is_resume_parsed",
                "timezone",
                "locale",
                "last_login",
                "created_at",
                "updated_at",
                "city",
                "country",
                "latitude",
                "longitude",
                "place_id",
                "state",
                "role_id",
                "is_superuser",
            )
        )

        for i in users_obj:
            id = i.get("id", "")
            tenant_id = i.get("tenant_id", "")
            is_active = i.get("is_active", "")
            is_user = i.get("is_user", "")
            is_locked = i.get("is_locked", "")
            is_verified_email = i.get("is_verified_email", "")
            is_resume_parsed = i.get("is_resume_parsed", "")
            locale = i.get("locale", "")
            last_login = i.get("last_login", "")
            created_at = i.get("created_at", "")
            updated_at = i.get("updated_at", "")
            timezone = i.get("timezone")
            city = i.get("city")
            country = i.get("country")
            latitude = i.get("latitude")
            longitude = i.get("longitude")
            place_id = i.get("place_id")
            state = i.get("state")
            role = i.get("role_id")
            superuser = i.get("is_superuser")
            if role is None and superuser is False:
                jobseeker = 1
            else:
                jobseeker = 0
            i["jobseeker"] = jobseeker
            if id is None or id == "":
                i["id"] = "null"
            else:
                i["id"] = id
            if tenant_id is None or tenant_id == "":
                i["tenant_id"] = "null"
            else:
                i["tenant_id"] = tenant_id
            if is_active is None or is_active == "":
                i["is_active"] = "null"
            else:
                i["is_active"] = is_active
            if is_user is None or is_user == "":
                i["is_user"] = "null"
            else:
                i["is_user"] = is_user
            if is_locked is None or is_locked == "":
                i["is_locked"] = "null"
            else:
                i["is_locked"] = is_locked
            if is_verified_email is None or is_verified_email == "":
                i["is_verified_email"] = "null"
            else:
                i["is_verified_email"] = is_verified_email
            if is_resume_parsed is False or is_resume_parsed == "":
                i["is_resume_parsed"] = False
            else:
                i["is_resume_parsed"] = is_resume_parsed
            if locale is None or locale == "":
                i["locale"] = "null"
            else:
                i["locale"] = locale
            if city is None or city == "":
                i["city"] = "null"
            else:
                i["city"] = city
            if country is None or country == "":
                i["country"] = "null"
            else:
                i["country"] = country
            if latitude is None or latitude == "":
                i["latitude"] = "null"
            else:
                i["latitude"] = latitude
            if longitude is None or longitude == "":
                i["longitude"] = "null"
            else:
                i["longitude"] = longitude
            if place_id is None or place_id == "":
                i["place_id"] = "null"
            else:
                i["place_id"] = place_id
            if state is None or state == "":
                i["state"] = "null"
            else:
                i["state"] = state
            if last_login is None or last_login == "":
                i["last_login"] = "null"
            else:
                i["last_login"] = datetime.strftime(last_login, "%Y-%m-%d %H:%M:%S")
            if created_at is None or created_at == "":
                i["created_at"] = "null"
            else:
                i["created_at"] = datetime.strftime(created_at, "%Y-%m-%d %H:%M:%S")
            if updated_at is None or updated_at == "":
                i["updated_at"] = "null"
            else:
                i["updated_at"] = datetime.strftime(updated_at, "%Y-%m-%d %H:%M:%S")
            if timezone is None or timezone == "" or timezone == pytz.timezone("Asia/Kolkata"):
                i["timezone"] = str(pytz.timezone("UTC"))
            else:
                i["timezone"] = str(timezone)
        stream_response = downloadFile(users_obj)
        return stream_response


class UserApplicationsCsvView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        users_obj = (
            JobApplication.objects.select_related("user", "job")
            .filter(user__is_ca=True)
            .exclude(tenant__erd=0)
            .values(
                "id",
                "tenant_id",
                "user_id",
                "job_id",
                "current_status",
                "created_at",
                "updated_at",
                "job_tenant",
                "hired",
                "interviewed",
            )
        )
        for i in users_obj:
            id = i.get("id", "")
            tenant_id = i.get("tenant_id", "")
            user_id = i.get("user_id", "")
            job_id = i.get("job_id", "")
            current_status = i.get("current_status", "")
            created_at = i.get("created_at", "")
            updated_at = i.get("updated_at", "")
            job_tenant = i.get("job_tenant", "")
            hired = i.get("hired", "")
            interviewed = i.get("interviewed")
            if id is None or id == "":
                i["id"] = "null"
            else:
                i["id"] = id
            if tenant_id is None or tenant_id == "":
                i["tenant_id"] = "null"
            else:
                i["tenant_id"] = tenant_id
            if user_id is None or user_id == "":
                i["user_id"] = "null"
            else:
                i["user_id"] = user_id
            if job_id is None or job_id == "":
                i["job_id"] = "null"
            else:
                i["job_id"] = job_id
            if current_status is None or current_status == "":
                i["current_status"] = "null"
            else:
                i["current_status"] = current_status
            if created_at is None or created_at == "":
                i["created_at"] = "null"
            else:
                i["created_at"] = datetime.strftime(created_at, "%Y-%m-%d %H:%M:%S")
            if updated_at is None or updated_at == "":
                i["updated_at"] = "null"
            else:
                i["updated_at"] = datetime.strftime(updated_at, "%Y-%m-%d %H:%M:%S")
            if job_tenant is None or job_tenant == "":
                i["job_tenant"] = "null"
            else:
                i["job_tenant"] = job_tenant
            if hired is None or hired == "":
                i["hired"] = "null"
            else:
                i["hired"] = hired
            if interviewed is None or interviewed == "":
                i["interviewed"] = "null"
            else:
                i["interviewed"] = interviewed
        stream_response = download_job_application_File(users_obj)
        return stream_response


class JobsCsvView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        users_obj = (
            Job.objects.select_related("user")
            .filter(user__is_ca=True)
            .exclude(tenant__erd=0)
            .values(
                "id",
                "tenant_id",
                "user_id",
                "category_id__name",
                "job_type_id__name",
                "industry_id__name",
                "title",
                "description",
                "remote_location",
                "status",
                "openings",
                "is_processed",
                "language",
                "display_name",
                "latitude",
                "longitude",
                "place_id",
                "country",
                "state",
                "created_at",
                "updated_at",
                "job_end_date",
            )
        )
        bad_char = [";", ":", "!", "*", ","]

        for i in users_obj:
            id = i.get("id", "")
            tenant_id = i.get("tenant_id", "")
            user_id = i.get("user_id", "")
            category_id = i.get("category_id__name", "")
            job_type_id = i.get("job_type_id__name", "")
            industry_id = i.get("industry_id__name", "")
            remote_location = i.get("remote_location", "")
            status = i.get("status", "")
            job_end_date = i.get("job_end_date", "")
            tit_val = i.get("title", "")
            des = i.get("description", "")
            if id is None or id == "":
                i["id"] = "null"
            else:
                i["id"] = id
            if tenant_id is None or tenant_id == "":
                i["tenant_id"] = "null"
            else:
                i["tenant_id"] = tenant_id
            if user_id is None or user_id == "":
                i["user_id"] = "null"
            else:
                i["user_id"] = user_id
            if category_id is None or category_id == "":
                i["category_id__name"] = "null"
            else:
                i["category_id__name"] = category_id
            if job_type_id is None or job_type_id == "":
                i["job_type_id__name"] = "null"
            else:
                i["job_type_id__name"] = job_type_id
            if industry_id is None or industry_id == "":
                i["industry_id__name"] = "null"
            else:
                i["industry_id__name"] = industry_id
            if remote_location is None or remote_location == "":
                i["remote_location"] = "null"
            else:
                i["remote_location"] = remote_location
            if status is None or status == "":
                i["status"] = "null"
            else:
                i["status"] = status
            if job_end_date is None or job_end_date == "":
                i["job_end_date"] = "null"
            else:
                i["job_end_date"] = str(job_end_date)

            if tit_val is None or tit_val == "":
                i["title"] = "null"
            else:
                test_string = "".join(j for j in tit_val if not j in bad_char)
                i["title"] = test_string
            if des is None or des == "":
                i["description"] = "null"
            else:
                desc = "".join(j for j in des.decode("utf-8") if not j in bad_char)
                i["description"] = desc
            openings = i.get("openings")
            is_processed = i.get("is_processed")
            language = i.get("language")
            display_name = i.get("display_name")
            latitude = i.get("latitude")
            longitude = i.get("longitude")
            place_id = i.get("place_id")
            country = i.get("country")
            state = i.get("state")
            if openings is None or openings == "":
                i["openings"] = 1
            else:
                i["openings"] = openings
            if is_processed is None or is_processed == "":
                i["is_processed"] = "null"
            else:
                i["is_processed"] = is_processed
            if language is None or language == "":
                i["language"] = "en"
            else:
                i["language"] = language
            if display_name is None or display_name == "":
                i["display_name"] = "null"
            else:
                i["display_name"] = display_name
            if latitude is None or latitude == "":
                i["latitude"] = "null"
            else:
                i["latitude"] = latitude
            if longitude is None or longitude == "":
                i["longitude"] = "null"
            else:
                i["longitude"] = longitude
            if place_id is None or place_id == "":
                i["place_id"] = "null"
            else:
                i["place_id"] = place_id
            if country is None or country == "":
                i["country"] = "null"
            else:
                i["country"] = country
            if state is None or state == "":
                i["state"] = "null"
            else:
                i["state"] = state
            created_at = i.get("created_at", "")
            updated_at = i.get("updated_at", "")
            if created_at is None or created_at == "":
                i["created_at"] = "null"
            else:
                i["created_at"] = datetime.strftime(created_at, "%Y-%m-%d %H:%M:%S")
            if updated_at is None or updated_at == "":
                i["updated_at"] = "null"
            else:
                i["updated_at"] = datetime.strftime(updated_at, "%Y-%m-%d %H:%M:%S")
        stream_response = download_job_File(users_obj)
        return stream_response


class TenantsCsvView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        users_obj = Tenant.objects.filter(erd=True, is_canada=True).values(
            "id",
            "name",
            "is_active",
            "config_facebook_id",
            "job_url",
            "approved",
            "gated",
            "detect_location",
            "created_at",
            "updated_at",
            "b_address",
            "key",
            "primary_user_id",
            "custom_field2",
        )
        for i in users_obj:
            id = i.get("id", "")
            organization_name = i.get("name", "")
            is_active = i.get("is_active", "")
            config_facebook_id = i.get("config_facebook_id", "")
            job_url = i.get("job_url", "")
            approved = i.get("approved", "")
            gated = i.get("gated", "")
            detect_location = i.get("detect_location", "")
            b_address = i.get("b_address", "")
            signup_comment = i.get("custom_field2", "")

            if signup_comment is None or signup_comment == "":
                i["signup_comment"] = "null"
            else:
                i["signup_comment"] = signup_comment

            if id is None or id == "":
                i["id"] = "null"
            else:
                i["id"] = id
            if is_active is None or is_active == "":
                i["is_active"] = "null"
            else:
                i["is_active"] = is_active
            if config_facebook_id is None or config_facebook_id == "":
                i["config_facebook_id"] = "null"
            else:
                i["config_facebook_id"] = config_facebook_id
            if job_url is None:
                i["job_url"] = "null"
            else:
                i["job_url"] = job_url
            if approved is None or approved == "":
                i["approved"] = "null"
            else:
                i["approved"] = approved
            if gated is None or gated == "":
                i["gated"] = "null"
            else:
                i["gated"] = gated
            if detect_location is None or detect_location == "":
                i["detect_location"] = "null"
            else:
                i["detect_location"] = detect_location

            user_id = i.get("primary_user_id", "")
            if user_id is None or user_id == "":
                city = "null"
                state = "null"
                country = "null"
            else:
                user = User.objects.get(id=user_id)
                city = "null" if user.city is None or user.city == "" else user.city
                state = "null" if user.state is None or user.state == "" else user.state
                country = "null" if user.country is None or user.country == "" else user.country
            if b_address is None or b_address == "":
                i["b_address"] = "null"
            else:
                i["b_address"] = str(b_address)
            i["address"] = b_address
            i["city"] = city
            i["state"] = state
            i["country"] = country
            tit_val = i.get("key", "")
            if tit_val:
                i["Org_type"] = "SkillingPartner"
            else:
                i["Org_type"] = "EmployeePartner"
            i.pop("key", "No Key found")
            created_at = i.get("created_at", "")
            updated_at = i.get("updated_at", "")
            if created_at is None or created_at == "":
                i["created_at"] = "null"
            else:
                i["created_at"] = datetime.strftime(created_at, "%Y-%m-%d %H:%M:%S")
            if updated_at is None or updated_at == "":
                i["updated_at"] = "null"
            else:
                i["updated_at"] = datetime.strftime(updated_at, "%Y-%m-%d %H:%M:%S")
            if organization_name is None or organization_name == "":
                i["organization_name"] = ""
            else:
                i["organization_name"] = organization_name
        stream_response = download_tenant_File(users_obj)
        return stream_response
