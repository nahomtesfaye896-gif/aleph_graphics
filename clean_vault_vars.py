filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminPanel.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Delete unused imports and states
content = content.replace(', SavedPassword', '')
content = content.replace('addSavedPassword,', '')
content = content.replace('deleteSavedPassword,', '')
content = content.replace('generateRandomPassword,', '')
content = content.replace('getSavedPasswords,', '')
content = content.replace('Copy,\n', '')
content = content.replace('EyeOff,\n', '')
content = content.replace('KeyRound,\n', '')
content = content.replace('Plus,\n', '')
content = content.replace('RefreshCw,\n', '')

# We can just remove the whole Password Generator handlers block
import re
content = re.sub(r'  // Password Generator Handler.*?// Handle Change Admin Password', '  // Handle Change Admin Password', content, flags=re.DOTALL)
content = re.sub(r'  const \[passwords, setPasswords\] = useState<any\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'  const \[passwords, setPasswords\] = useState<.*?>\(\[\]\);\n', '', content)
content = re.sub(r'  // Password Generator states.*?// Change Admin Password state', '  // Change Admin Password state', content, flags=re.DOTALL)
content = re.sub(r'      setPasswords\(getSavedPasswords\(\)\);\n', '', content)
content = re.sub(r'      setGeneratedPass\(generateRandomPassword\(16\)\);\n', '', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\data\site.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
if "telegramChannel:" not in content:
    content = content.replace(
        'telegram: "https://t.me/alephgraphics",',
        'telegram: "https://t.me/alephcontact",\n  telegramChannel: "https://t.me/alephgraphics",'
    )
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('telegramChannel: "",', 'telegramChannel: CONTACT.telegramChannel || "",')
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up unused variables and fixed site.ts type")
