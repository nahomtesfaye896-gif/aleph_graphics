import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('phone2: CONTACT.phone2,', 'phone2: "",')
content = content.replace('whatsapp: CONTACT.whatsapp,', 'whatsapp: "",')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated siteSettings.ts!")
