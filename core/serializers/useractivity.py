from core.models.audit import Audit
from rest_framework_mongoengine import serializers


class AuditSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Audit
        fields = "__all__"
