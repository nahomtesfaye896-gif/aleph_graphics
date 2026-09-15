filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\App.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update TelegramJobsCTA to use telegramChannel instead of telegram
content = content.replace(
    'href={settings.social?.telegram || "https://t.me/alephgraphics"}',
    'href={settings.social?.telegramChannel || "https://t.me/alephgraphics"}'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.tsx")
