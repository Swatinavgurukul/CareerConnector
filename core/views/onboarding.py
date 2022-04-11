from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from core.helpers import api_response, compile_email
from core.models.users import User
from core.serializers.onoarding_serializer import OnboardingUserSerializer
from core.get_tenant import get_user_tenant
from rest_framework.parsers import MultiPartParser, FormParser


class OnboardingView(APIView):

    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, *args, **kwargs):

        """
        Update Onboarding for hiring manager
        """
        data = request.data
        tenant = get_user_tenant(request)
        try:
            user_obj = User.objects.filter(id=request.user.id, tenant=tenant).first()
        except User.DoesNotExist:
            return api_response(404, "User Does Not Exist", {})

        context = {
            "request": request,
            "tenant": tenant,
            "user_obj": user_obj,
        }
        address = str(request.user.tenant.b_address) + " " + str(request.user.city)
        compile_email(
            "onboarding.internal",
            request,
            request.user,
            data={
                "email": request.user.email,
                "company": request.user.tenant.name.title(),
                "address": address,
                "phone": request.user.phone,
                "phone_alt": request.user.phone,
                "b_firstname": request.user.tenant.b_first_name,
                "last": request.user.tenant.b_last_name,
                "b_phone": request.user.tenant.b_phone,
                "b_phone_alt": request.user.tenant.b_phone_sec,
                "b_email": request.user.tenant.b_email,
            },

        )

        billing_name = request.user.tenant.b_first_name + " " + request.user.tenant.b_last_name
        compile_email(
            "onboarding.external",
            request,
            request.user,
            data={
                "email": request.user.email,
                "company": request.user.tenant.name.title(),
                "phone": request.user.phone,
                "first_name": request.user.first_name.title(),
                "last_name": request.user.last_name.title(),
                "to_email": request.user.tenant.b_email,
                "candidate_name": billing_name,
            },
            toemail=True,
        )

        if user_obj.id == request.user.id:
            serializer = OnboardingUserSerializer(user_obj, data, context=context)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
        return api_response(200, "Onboarding data updated successfully", {})
