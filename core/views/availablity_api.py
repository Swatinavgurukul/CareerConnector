from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from core.models.users import User
from core.serializers.available_serializer import AvailabilitySerializer
from core.helpers import api_response


class AvailabilityApiView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, pk, *args, **kwargs):
        availability = get_object_or_404(
            User.objects.filter(tenant=request.user.tenant.id), pk=pk)
        if availability:
            data = request.data
            availability.is_available = data["is_available"]
            availability.save()
            serializer = AvailabilitySerializer(availability)
            return api_response(200, "status changed ", serializer.data)
        else:
            return api_response(404, "No Data ", {})
