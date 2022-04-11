from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from core.models.users import User
from core.serializers.location_serializers import LocationSerializer
from core.helpers import api_response


class LocationApiView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, pk, *args, **kwargs):
        locality = get_object_or_404(User.objects.all(), pk=pk)
        data = request.data
        locality.location = data["location"]
        locality.save()
        serializer = LocationSerializer(locality)
        return api_response(Response.status_code, "Location Updated", serializer.data)
