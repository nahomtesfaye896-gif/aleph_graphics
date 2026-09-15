filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'social[key] = raw.social && typeof raw.social[key] === "string" ? (raw.social[key] as string) : DEFAULT_SETTINGS.social[key];',
    'social[key] = (raw.social && typeof raw.social[key] === "string" ? raw.social[key] : (DEFAULT_SETTINGS.social[key] || "")) as any;'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS error on line 42")
