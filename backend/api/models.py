from django.db import models
import uuid

class AdminUser(models.Model):
    username = models.CharField(max_length=255, primary_key=True)
    password_hash = models.CharField(max_length=255)
    salt = models.CharField(max_length=255)
    name = models.CharField(max_length=255, default='Academy Administrator')
    role = models.CharField(max_length=255, default='Super Admin')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admin_users'

class Applicant(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    course = models.CharField(max_length=255)
    schedule = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'applicants'

class SiteSettings(models.Model):
    id = models.IntegerField(primary_key=True, default=1)
    phone = models.CharField(max_length=255, blank=True, null=True)
    phone_raw = models.CharField(max_length=255, blank=True, null=True)
    phone2 = models.CharField(max_length=255, blank=True, null=True)
    whatsapp = models.CharField(max_length=255, blank=True, null=True)
    telegram = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    map_url = models.CharField(max_length=1000, blank=True, null=True)
    logo_image = models.CharField(max_length=1000, blank=True, null=True)
    address_en = models.CharField(max_length=500, blank=True, null=True)
    address_am = models.CharField(max_length=500, blank=True, null=True)
    prices = models.JSONField(default=dict)
    social = models.JSONField(default=dict)
    phone_alt = models.CharField(max_length=255, blank=True, null=True)
    working_hours_start = models.CharField(max_length=10, blank=True, null=True)
    working_hours_end = models.CharField(max_length=10, blank=True, null=True)
    working_days = models.CharField(max_length=100, blank=True, null=True)
    
    sat_hours_start = models.CharField(max_length=10, blank=True, null=True)
    sat_hours_end = models.CharField(max_length=10, blank=True, null=True)
    sun_hours_start = models.CharField(max_length=10, blank=True, null=True)
    sun_hours_end = models.CharField(max_length=10, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'site_settings'

class SavedPassword(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    service_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    password = models.TextField()
    category = models.CharField(max_length=100, default='Other')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'saved_passwords'

class StudentComment(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'student_comments'

class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.SlugField(max_length=100, unique=True)
    name_en = models.CharField(max_length=255)
    name_am = models.CharField(max_length=255, blank=True, default='')
    tagline_en = models.CharField(max_length=255, blank=True, default='')
    tagline_am = models.CharField(max_length=255, blank=True, default='')
    desc_en = models.TextField(blank=True, default='')
    desc_am = models.TextField(blank=True, default='')
    long_en = models.TextField(blank=True, default='')
    long_am = models.TextField(blank=True, default='')
    learn_en = models.JSONField(default=list)  # ["item1", "item2", ...]
    learn_am = models.JSONField(default=list)
    tools = models.JSONField(default=list)  # ["Photoshop", "Figma", ...]
    image = models.TextField(blank=True, default='')
    accent = models.CharField(max_length=255, default='from-sky-500 to-blue-700')
    fee_etb = models.CharField(max_length=50, blank=True, default='')
    popular = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        ordering = ['sort_order', 'created_at']

