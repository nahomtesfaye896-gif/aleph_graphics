filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\data\site.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's make sure telegramChannel is in CONTACT
if "telegramChannel: " not in content:
    content = content.replace(
        'telegram: "https://t.me/alephcontact",',
        'telegram: "https://t.me/alephcontact",\n  telegramChannel: "https://t.me/alephgraphics",'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
    
# Fix the strict undefined type
content = content.replace(
    'telegramChannel: CONTACT.telegramChannel || "",',
    'telegramChannel: (CONTACT as any).telegramChannel || "",'
)
content = content.replace(
    'telegramChannel: "",',
    'telegramChannel: (CONTACT as any).telegramChannel || "",'
)

# And fix line 44:
content = content.replace(
    'telegramChannel: raw.telegramChannel ?? DEFAULT_SETTINGS.telegramChannel,',
    'telegramChannel: typeof raw.telegramChannel === "string" ? raw.telegramChannel : DEFAULT_SETTINGS.telegramChannel,'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed types")
