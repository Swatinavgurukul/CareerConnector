# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
# from core.helpers import api_response
# from core.models.users import User
# from core.models.profile_setting import ProfileSetting
# from core.get_tenant import get_user_tenant

"""NOT USING"""
# class LanguageSettingView(APIView):
#     permission_classes = (IsAuthenticated,)

#     def get(self, request):
#         user = request.user
#         return api_response(200, "Language preference fetched.", {"language": user.locale})

#     def put(self, request):
#         tenant = get_user_tenant(request)
#         data = request.data
#         user = request.user
#         user.locale = data["language"]
#         user.save()
#         try:
#             profile_setting = ProfileSetting.objects.get(tenant=tenant, user=user)
#         except ProfileSetting.DoesNotExist:
#             return api_response(404, "Not found.", {})
#         profile_setting.language_preference = data["language"]
#         profile_setting.save()
#         return api_response(200, "Language preference set successfully.", {"language": user.locale})
