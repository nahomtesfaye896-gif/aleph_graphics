import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminPanel.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the 'passwords' from the type definition
content = content.replace(
    'const [activeTab, setActiveTab] = useState<"applicants" | "passwords" | "settings" | "courses" | "site-settings">("applicants");',
    'const [activeTab, setActiveTab] = useState<"applicants" | "settings" | "courses" | "site-settings">("applicants");'
)

# Remove the tab button
button_regex = r'<button\s*onClick=\{\(\) => setActiveTab\("passwords"\)\}.*?<Key className="h-4 w-4" /> Password Manager & Vault\s*</button>'
content = re.sub(button_regex, '', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed password manager tab")
