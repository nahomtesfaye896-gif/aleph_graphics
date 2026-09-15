import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\backend\api\models.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_fields = """    working_hours_start = models.CharField(max_length=10, blank=True, null=True)
    working_hours_end = models.CharField(max_length=10, blank=True, null=True)
    working_days = models.CharField(max_length=100, blank=True, null=True)"""

new_fields = """    working_hours_start = models.CharField(max_length=10, blank=True, null=True)
    working_hours_end = models.CharField(max_length=10, blank=True, null=True)
    working_days = models.CharField(max_length=100, blank=True, null=True)
    
    sat_hours_start = models.CharField(max_length=10, blank=True, null=True)
    sat_hours_end = models.CharField(max_length=10, blank=True, null=True)
    sun_hours_start = models.CharField(max_length=10, blank=True, null=True)
    sun_hours_end = models.CharField(max_length=10, blank=True, null=True)"""

if "sat_hours_start" not in content:
    content = content.replace(old_fields, new_fields)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated models.py")
