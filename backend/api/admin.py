from django.contrib import admin
from .models import AdminUser, Applicant, SiteSettings, SavedPassword, StudentComment

admin.site.register(AdminUser)
admin.site.register(Applicant)
admin.site.register(SiteSettings)
admin.site.register(SavedPassword)
admin.site.register(StudentComment)
