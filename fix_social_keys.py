filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove telegram and telegramChannel from the root of DEFAULT_SETTINGS
content = content.replace('  telegram: CONTACT.telegram,\n', '  telegram: "",\n')
content = content.replace('  telegramChannel: (CONTACT as any).telegramChannel || "",\n', '')

# 2. Add telegramChannel to SOCIAL_KEYS
content = content.replace(
    'const SOCIAL_KEYS: (keyof SiteSettings["social"])[] = ["facebook", "instagram", "tiktok", "telegram", "youtube", "linkedin"];',
    'const SOCIAL_KEYS: (keyof SiteSettings["social"])[] = ["facebook", "instagram", "tiktok", "telegram", "telegramChannel", "youtube", "linkedin"];'
)

# 3. Remove telegram and telegramChannel from root of fillDefaults return
content = content.replace(
    '    telegram: typeof raw.telegram === "string" ? raw.telegram : DEFAULT_SETTINGS.telegram,\n',
    '    telegram: "",\n'
)
content = content.replace(
    '    telegramChannel: typeof (raw as any).telegramChannel === "string" ? (raw as any).telegramChannel : DEFAULT_SETTINGS.telegramChannel || "",\n',
    ''
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed social fields")
