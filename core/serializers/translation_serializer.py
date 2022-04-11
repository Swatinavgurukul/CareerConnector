from rest_framework import fields, serializers
from core.models.translation import Translation


class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = "__all__"
