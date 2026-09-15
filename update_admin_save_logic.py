import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminSiteSettings.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure telegramChannel is handled in the updateSettings
old_update = """    if (["facebook", "instagram", "tiktok", "telegram", "youtube", "linkedin"].includes(key)) {"""
new_update = """    if (["facebook", "instagram", "tiktok", "telegram", "telegramChannel", "youtube", "linkedin"].includes(key)) {"""

if "telegramChannel" not in old_update:
    content = content.replace(old_update, new_update)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AdminSiteSettings.tsx update logic")
