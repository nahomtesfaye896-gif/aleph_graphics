import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\data\site.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace phone strings
content = re.sub(r'phoneRaw:.*?,', '', content)
content = re.sub(r'phone2:.*?,', '', content)
content = re.sub(r'whatsapp:.*?,', '', content)

# Change phone to just be empty or the one they want? Let's make it the one they want or just empty
content = re.sub(r'phone: "\+251 928 745 053",', 'phone: "+251 911 123 456",', content) 

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated site.ts!")
