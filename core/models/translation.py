from django.db import models


class Translation(models.Model):
    namespace = models.CharField(max_length=20, null=True, blank=True)
    text = models.TextField(max_length=2000, null=True, blank=True)
    language = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        unique_together = (("namespace", "language"),)
        db_table = "translation"
