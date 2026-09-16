filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Testimonials.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'comments.filter((c) => c.approved).map((c) => ({ key: c.id, name: c.name, role: c.role, text: c.text }))',
    'comments.filter((c) => c.approved && c.name !== "Ffffff" && !c.text.includes("Rrrrff")).map((c) => ({ key: c.id, name: c.name, role: c.role, text: c.text }))'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Filtered out the test comment")
