from rest_framework.views import APIView
from core.helpers import api_response
from oauth2_provider.models import Application
from rest_framework import serializers


class Oauth2ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"


class Oauth2ApplicationDataView(APIView):
    def post(self, request):
        name = request.POST.get("name", None)
        try:
            application_object = Application.objects.filter(name=name)[0]
            serializer = Oauth2ApplicationSerializer(application_object)
            return api_response(200, "Oauth2 application data retrieved successfully", serializer.data)
        except IndexError:
            return api_response(404, "Application doesn't exists", {})
