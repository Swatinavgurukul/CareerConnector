from rest_framework import serializers
from core.models.users import User


class LocationSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = User
        fields = ('location', 'user')
