import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Testimonials.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the Student comment form
regex = r'\{\s*/\*\s*Student comment form\s*\*/\s*\}.*?</Reveal>'
new_content = re.sub(regex, '', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Removed comment form")
