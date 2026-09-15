import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\i18n\translations.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'addressValue: "Bole Road, Near Edna Mall, 3rd Floor, Addis Ababa, Ethiopia",',
    'addressValue: "Tsega event and communication",'
)
content = content.replace(
    'addressValue: "?? ??, ??? ?? ??? 3? ???, ??? ???, ?????",',
    'addressValue: "?? ??? ?? ??????",'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'addressEn: "Bole Road, Near Edna Mall, 3rd Floor, Addis Ababa, Ethiopia",',
    'addressEn: "Tsega event and communication",'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated defaults!")
