from django.db import models
from timezone_field import TimeZoneField


class Location(models.Model):
    street_number = models.CharField(max_length=191, null=True, blank=True)
    street_name = models.CharField(max_length=191, null=True, blank=True)
    sub_premise = models.CharField(max_length=191, null=True, blank=True)
    city = models.CharField(db_index=True, max_length=191, null=True, blank=True)
    state = models.CharField(max_length=191, null=True, blank=True)
    country = models.CharField(max_length=191, null=True, blank=True)
    postal_code = models.CharField(max_length=191, null=True, blank=True)
    state_code = models.CharField(max_length=191, null=True, blank=True)
    country_code = models.CharField(max_length=191, null=True, blank=True)
    timezone = TimeZoneField(default="Asia/Kolkata")
    latitude = models.DecimalField(max_digits=18, decimal_places=15, null=True, blank=True)
    longitude = models.DecimalField(max_digits=18, decimal_places=15, null=True, blank=True)
    google_place_id = models.CharField(max_length=191, null=True, blank=True)
    google_processed = models.BooleanField(default=False)
    preferred = models.BooleanField(default=False)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "locations"
