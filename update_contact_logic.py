import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = "const displayAddress = generatedAddress || (lang === 'am' ? settings.addressAm : settings.addressEn) || t.contact.addressValue;"
new_logic = "const manualAddress = lang === 'am' ? settings.addressAm : settings.addressEn;\n  const displayAddress = (manualAddress && manualAddress.trim() !== '') ? manualAddress : (generatedAddress || t.contact.addressValue);"

content = content.replace(old_logic, new_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Contact.tsx displayAddress logic")
