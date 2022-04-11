from django.db import models
from core.models import Tenant, User


EXCLUDE_FROM_LIST = [
    ("sp_candidates_list", "sp_candidates_list"),
]


class ExcludeUser(models.Model):
    request_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="excluderequestby")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="excludeuser")
    exclude_from = models.CharField(max_length=50, choices=EXCLUDE_FROM_LIST, default="sp_candidates_list", null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "exclude_user"
