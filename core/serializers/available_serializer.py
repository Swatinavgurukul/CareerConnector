from rest_framework import serializers
from core.models.users import User


class AvailabilitySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = User
        fields = ('user',)
