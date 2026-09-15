import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminPanel.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove from Tabs Navigation
content = re.sub(
    r'<button\s*onClick=\{\(\) => setActiveTab\("passwords"\)\}\s*className=\{cn\([^>]+>\s*<Key className="h-4 w-4" /> Password Manager & Vault\s*</button>',
    '',
    content,
    flags=re.DOTALL
)

# 2. Remove the Vault UI Block
content = re.sub(
    r'\{\/\* TAB 2: PASSWORD MANAGER & VAULT \*\/\}.*?\{\/\* TAB 3: SECURITY & ADMIN PASSWORD CHANGE \*\/\}',
    '{/* TAB 3: SECURITY & ADMIN PASSWORD CHANGE */}',
    content,
    flags=re.DOTALL
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed password manager from UI")
