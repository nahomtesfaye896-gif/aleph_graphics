filepath = r'C:\Users\hp\Desktop\aleph_graphics\backend\api\serializers.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add the missing sat/sun serializer field declarations
old_line = "    workingDays = serializers.CharField(source='working_days', required=False, allow_blank=True, allow_null=True)"
new_line = """    workingDays = serializers.CharField(source='working_days', required=False, allow_blank=True, allow_null=True)
    satHoursStart = serializers.CharField(source='sat_hours_start', required=False, allow_blank=True, allow_null=True)
    satHoursEnd = serializers.CharField(source='sat_hours_end', required=False, allow_blank=True, allow_null=True)
    sunHoursStart = serializers.CharField(source='sun_hours_start', required=False, allow_blank=True, allow_null=True)
    sunHoursEnd = serializers.CharField(source='sun_hours_end', required=False, allow_blank=True, allow_null=True)"""
content = content.replace(old_line, new_line)

# Add the new fields to the Meta.fields list
old_fields = "fields = ['id', 'phone', 'phoneRaw', 'phone2', 'phoneAlt', 'whatsapp', 'telegram', 'email', 'mapUrl', 'logoImage', 'addressEn', 'addressAm', 'prices', 'social', 'workingHoursStart', 'workingHoursEnd', 'workingDays']"
new_fields = "fields = ['id', 'phone', 'phoneRaw', 'phone2', 'phoneAlt', 'whatsapp', 'telegram', 'email', 'mapUrl', 'logoImage', 'addressEn', 'addressAm', 'prices', 'social', 'workingHoursStart', 'workingHoursEnd', 'workingDays', 'satHoursStart', 'satHoursEnd', 'sunHoursStart', 'sunHoursEnd']"
content = content.replace(old_fields, new_fields)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed serializers.py - added sat/sun hours fields")
