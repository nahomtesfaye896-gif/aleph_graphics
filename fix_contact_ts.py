filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('{t.contact.working}', '{t.contact.hours}')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS error t.contact.hours")
