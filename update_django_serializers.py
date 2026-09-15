filepath = r'C:\Users\hp\Desktop\aleph_graphics\backend\api\serializers.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_fields = """            'address_am', 'working_hours_start', 'working_hours_end',
            'working_days', 'prices', 'social'
        ]"""

new_fields = """            'address_am', 'working_hours_start', 'working_hours_end',
            'working_days', 'sat_hours_start', 'sat_hours_end',
            'sun_hours_start', 'sun_hours_end',
            'prices', 'social'
        ]"""

if "sat_hours_start" not in content:
    content = content.replace(old_fields, new_fields)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated serializers.py")
