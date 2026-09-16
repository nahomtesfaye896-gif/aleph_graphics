filepath = r'C:\Users\hp\Desktop\aleph_graphics\backend\api\models.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "image = models.CharField(max_length=1000, blank=True, default='')",
    "image = models.TextField(blank=True, default='')"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated models.py image field")
