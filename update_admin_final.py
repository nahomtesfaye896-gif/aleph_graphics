import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminSiteSettings.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Display Address Text (Manual Override)", "Physical Address")
content = content.replace("If you use a shortened map link (like maps.app.goo.gl), the site cannot auto-detect the name. Type the name manually here.", "The text address displayed to users.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AdminSiteSettings.tsx")
