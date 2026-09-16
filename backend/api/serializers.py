from rest_framework import serializers
from .models import AdminUser, Applicant, SiteSettings, SavedPassword, StudentComment, Course

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['username', 'password_hash', 'salt', 'name', 'role', 'updated_at']

class ApplicantSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Applicant
        fields = ['id', 'name', 'phone', 'email', 'course', 'schedule', 'message', 'status', 'createdAt']

class SiteSettingsSerializer(serializers.ModelSerializer):
    phoneRaw = serializers.CharField(source='phone_raw', required=False, allow_blank=True, allow_null=True)
    mapUrl = serializers.CharField(source='map_url', required=False, allow_blank=True, allow_null=True)
    logoImage = serializers.CharField(source='logo_image', required=False, allow_blank=True, allow_null=True)
    addressEn = serializers.CharField(source='address_en', required=False, allow_blank=True, allow_null=True)
    addressAm = serializers.CharField(source='address_am', required=False, allow_blank=True, allow_null=True)
    phoneAlt = serializers.CharField(source='phone_alt', required=False, allow_blank=True, allow_null=True)
    workingHoursStart = serializers.CharField(source='working_hours_start', required=False, allow_blank=True, allow_null=True)
    workingHoursEnd = serializers.CharField(source='working_hours_end', required=False, allow_blank=True, allow_null=True)
    workingDays = serializers.CharField(source='working_days', required=False, allow_blank=True, allow_null=True)
    satHoursStart = serializers.CharField(source='sat_hours_start', required=False, allow_blank=True, allow_null=True)
    satHoursEnd = serializers.CharField(source='sat_hours_end', required=False, allow_blank=True, allow_null=True)
    sunHoursStart = serializers.CharField(source='sun_hours_start', required=False, allow_blank=True, allow_null=True)
    sunHoursEnd = serializers.CharField(source='sun_hours_end', required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = SiteSettings
        fields = ['id', 'phone', 'phoneRaw', 'phone2', 'phoneAlt', 'whatsapp', 'telegram', 'email', 'mapUrl', 'logoImage', 'addressEn', 'addressAm', 'prices', 'social', 'workingHoursStart', 'workingHoursEnd', 'workingDays', 'satHoursStart', 'satHoursEnd', 'sunHoursStart', 'sunHoursEnd']

class SavedPasswordSerializer(serializers.ModelSerializer):
    serviceName = serializers.CharField(source='service_name')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = SavedPassword
        fields = ['id', 'serviceName', 'username', 'password', 'category', 'createdAt']

class StudentCommentSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = StudentComment
        fields = ['id', 'name', 'role', 'text', 'approved', 'createdAt']

class CourseSerializer(serializers.ModelSerializer):
    nameEn = serializers.CharField(source='name_en')
    nameAm = serializers.CharField(source='name_am', required=False, allow_blank=True)
    taglineEn = serializers.CharField(source='tagline_en', required=False, allow_blank=True)
    taglineAm = serializers.CharField(source='tagline_am', required=False, allow_blank=True)
    descEn = serializers.CharField(source='desc_en', required=False, allow_blank=True)
    descAm = serializers.CharField(source='desc_am', required=False, allow_blank=True)
    longEn = serializers.CharField(source='long_en', required=False, allow_blank=True)
    longAm = serializers.CharField(source='long_am', required=False, allow_blank=True)
    learnEn = serializers.JSONField(source='learn_en', required=False)
    learnAm = serializers.JSONField(source='learn_am', required=False)
    feeEtb = serializers.CharField(source='fee_etb', required=False, allow_blank=True)
    sortOrder = serializers.IntegerField(source='sort_order', required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'key', 'nameEn', 'nameAm', 'taglineEn', 'taglineAm',
            'descEn', 'descAm', 'longEn', 'longAm', 'learnEn', 'learnAm',
            'tools', 'image', 'accent', 'feeEtb', 'popular', 'sortOrder', 'createdAt'
        ]
