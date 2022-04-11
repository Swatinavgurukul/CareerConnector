from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.helpers import api_response
from core.models.audit import Audit
from core.serializers.useractivity import AuditSerializer
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant


class UserActivityAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk=None):
        tenant = get_user_tenant(request)
        if pk:
            audits = Audit.objects.filter(user_id=pk, tenant_id=tenant.id)
            if audits:
                if request.user.is_superuser or pk == request.user.id:
                    serializer = AuditSerializer(audits, many=True)
                    return api_response(200, "User Activities retrieved successfully ", serializer.data)
                else:
                    return api_response(403, "not authorized", {})
            else:
                return api_response(404, "user data doesn't exists ", {})

        else:
            if request.user.is_superuser:
                audits = Audit.objects.filter(tenant_id=tenant.id)
                if audits:
                    serializer = AuditSerializer(audits, many=True)
                    return api_response(200, "Users Activities retrieved successfully", serializer.data)
                else:
                    return api_response(404, "user data doesn't exists ", {})
            else:
                audits = Audit.objects.filter(tenant_id=tenant.id, user_id=request.user.id)
                if audits:
                    serializer = AuditSerializer(audits, many=True)
                    return api_response(200, "UserActivity", serializer.data)
                else:
                    return api_response(404, "user data doesn't exists ", {})