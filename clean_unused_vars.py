filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Testimonials.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('const { t, lang } = useLang();', 'const { t } = useLang();')
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminPanel.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('Key,\n', '')
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up unused variables")
