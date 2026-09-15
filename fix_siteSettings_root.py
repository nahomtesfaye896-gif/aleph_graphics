filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add them back to DEFAULT_SETTINGS
content = content.replace(
    '  telegram: "",\n  email: CONTACT.email,',
    '  telegram: "https://t.me/alephcontact",\n  telegramChannel: "https://t.me/alephgraphics",\n  email: CONTACT.email,'
)

# Add them back to fillDefaults
content = content.replace(
    '    telegram: "",\n    email: typeof raw.email === "string" ? raw.email : DEFAULT_SETTINGS.email,',
    '    telegram: typeof raw.telegram === "string" ? raw.telegram : DEFAULT_SETTINGS.telegram,\n    telegramChannel: typeof (raw as any).telegramChannel === "string" ? (raw as any).telegramChannel : DEFAULT_SETTINGS.telegramChannel,\n    email: typeof raw.email === "string" ? raw.email : DEFAULT_SETTINGS.email,'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Restored root level properties")
