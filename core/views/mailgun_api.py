import requests
from decouple import config
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class MailDomainListView(APIView):
    """
    hepful to integrate mailgun API,get all dominas and create domain.
    """

    # authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        url = "https://api.mailgun.net/v3/domains"
        res = requests.get(url, auth=("api", config("MAILGUN_API_KEY")))
        return Response(res)

    def post(self, request, *args, **kwargs):
        url = "https://api.mailgun.net/v3/domains"
        res = requests.post(url, auth=("api", config("MAILGUN_API_KEY")), data=request.data)
        return Response(res)


class MailDomainDetailView(APIView):
    """
    hepful to integrate mailgun API,get domain based on name and delete the
    domain based on name.
    """

    # authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, domain_name, *args, **kwargs):
        url = "https://api.mailgun.net/v3/domains/" + domain_name
        res = requests.get(url, auth=("api", config("MAILGUN_API_KEY")))
        return Response(res)

    def delete(self, request, domain_name, *args, **kwargs):
        url = "https://api.mailgun.net/v3/domains/" + domain_name
        res = requests.delete(url, auth=("api", config("MAILGUN_API_KEY")))
        return Response(res)
