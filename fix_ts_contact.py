import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 'p' possibly undefined: validPhones is typed as (string | undefined)[] because of .filter()
content = content.replace(
    'const validPhones = [settings.phone, settings.phoneAlt].filter(p => p && p.trim().length > 0);',
    'const validPhones = [settings.phone, settings.phoneAlt].filter((p): p is string => typeof p === "string" && p.trim().length > 0);'
)

# Fix generatedAddress still present in the HTML (I guess my previous regex missed one)
# There is a second place with generatedAddress in the map section?
# Let's remove any `{... generatedAddress ...}` entirely from the file by finding the exact string.
content = content.replace(" || generatedAddress", "")
content = content.replace(" || 'Our Location'", " || 'Our Location'") # just in case

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS errors")
