from core.models.tenant import Tenant
from django.http import Http404
from urllib.parse import urlparse
from core.models.users import User


def get_user_tenant(request):
    path = request.build_absolute_uri()
    url_parse = urlparse(path)
    base_url = url_parse.hostname
    try:
        if request.user.is_authenticated:
            user = User.objects.get(email=request.user)
            tenant = Tenant.objects.get(id=user.tenant.id)
        else:
            if base_url == "127.0.0.1" or base_url == "localhost":
                return Tenant.objects.get(id=1)
            else:
                tenant = Tenant.objects.get(base_url=base_url)
    except Tenant.DoesNotExist:
        raise Http404("Tenant Not found")
    return tenant
