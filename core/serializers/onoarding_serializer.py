from rest_framework import serializers
from core.models.users import User
from core.models.tenant import Tenant
import random
from directsourcing.settings import MEDIA_ROOT
from resume.views.profile_api import upload_image_cloudinary
from core.helpers import api_response


class OnboardingBillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = (
            "id",
            "name",
            "b_title",
            "b_first_name",
            "b_last_name",
            "b_phone",
            "b_phone_sec",
            "b_email",
            "b_address",
            "billing",
            "logo_image",
        )


class OnboardingUserSerializer(serializers.ModelSerializer):

    billing_details = OnboardingBillingSerializer(required=False)

    class Meta:
        model = User
        fields = ("id", "email", "phone", "city", "area_code", "billing_details")

    def update(self, instance, validated_data):
        billing_details = validated_data.pop("billing_details", None)
        instance.email = validated_data.get("email", instance.email)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.area_code = validated_data.get("area_code", instance.area_code)
        instance.save()
        request = self.context["request"]
        if billing_details:
            tenant_obj = self.context["tenant"]
            b_title = billing_details.get("b_title", tenant_obj.b_title)
            name = billing_details.get("name", tenant_obj.name)
            b_first_name = billing_details.get("b_first_name", tenant_obj.b_first_name)
            b_last_name = billing_details.get("b_last_name", tenant_obj.b_last_name)
            b_phone = billing_details.get("b_phone", tenant_obj.b_phone)
            b_address = billing_details.get("b_address", tenant_obj.b_address)
            # billing = billing_details.get("billing", True)
            # print(billing)
            b_phone_sec = billing_details.get("b_phone_sec", tenant_obj.b_phone_sec)
            logo_image = billing_details.get("logo_image", tenant_obj.logo_image)

            tenant_obj.logo_image = logo_image
            tenant_obj.b_title = b_title
            tenant_obj.name = name
            tenant_obj.b_first_name = b_first_name
            tenant_obj.b_last_name = b_last_name
            tenant_obj.b_phone = b_phone
            tenant_obj.b_phone_sec = b_phone_sec
            tenant_obj.b_address = b_address
            tenant_obj.billing = True
            tenant_obj.save()

            obj = None
            try:
                obj = Tenant.objects.get(id=tenant_obj.id)
            except Tenant.DoesNotExist:
                return api_response(404, "Page not found", {})
            try:
                obj.logo_url = upload_image_cloudinary(
                    request=request,
                    image_url=str(MEDIA_ROOT) + str(tenant_obj.logo_image),
                    image_name="image_{}".format(random.randint(1, 10000)),
                    cropx=billing_details.get("cropx", 0.0),
                    cropy=billing_details.get("cropy", 0.0),
                    width=billing_details.get("width", 0.0),
                    height=billing_details.get("height", 0.0),
                    format=format,
                    radius=None,
                )
                obj.save()
            except Exception as e:
                return api_response(400, "file doesn't exists.", "Exception [{}]".format(e))

        return instance
