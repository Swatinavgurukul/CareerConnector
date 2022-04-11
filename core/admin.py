from django.contrib import admin
from core.models.users import User
from django.contrib.sessions.models import Session
from core.models.profile_setting import ProfileSetting
from resume.models.user_preferences import IndustryPreference, BlockedCompany
from core.models.location import Location
from core.models import ExcludeUser


class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "tenant", "username", "email", "is_available", "location"]
    search_fields = (
        "tenant__id",
        "username",
        "id",
    )


class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()

    list_display = ["session_key", "_session_data", "expire_date"]


admin.site.register(User, UserAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(ProfileSetting)
admin.site.register(Location)
admin.site.register(IndustryPreference)
admin.site.register(BlockedCompany)
admin.site.register(ExcludeUser)
