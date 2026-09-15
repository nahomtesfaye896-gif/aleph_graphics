import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\data\site.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace old map url
content = re.sub(r'mapUrl:\s*".*?",', 'mapUrl: "https://www.google.com/maps/place/Tsega+event+and+communication/@9.0315052,38.7618636,914m/data=!3m2!1e3!4b1!4m6!3m5!1s0x164b85b5eea6ab89:0xb5fa874f5e18ec7f!8m2!3d9.0315052!4d38.7618636!16s%2Fg%2F11ydwh329v!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated site.ts")
