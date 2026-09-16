filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Testimonials.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove unused lucide icons
content = content.replace(', Loader2, MessageSquarePlus', '')
content = content.replace(', Send', '')
# Remove FormEvent import
content = content.replace(', type FormEvent', '')

# Remove unused functions
content = content.replace('addStudentComment, ', '')

# Remove unused states
content = re.sub(r'  const \[cName, setCName\] = useState\(""\);\n', '', content)
content = re.sub(r'  const \[cRole, setCRole\] = useState\(""\);\n', '', content)
content = re.sub(r'  const \[cText, setCText\] = useState\(""\);\n', '', content)
content = re.sub(r'  const \[cErrors, setCErrors\] = useState.*?;\n', '', content)
content = re.sub(r'  const \[cStatus, setCStatus\] = useState.*?;\n', '', content)

# Remove unused handleCommentSubmit
regex = r'  const handleCommentSubmit = \(e: FormEvent\) => \{.*?\};'
content = re.sub(regex, '', content, flags=re.DOTALL)

# Remove unused inputCls
regex = r'  const inputCls = \(hasError\?: string\) =>\s*cn\(\s*".*?",\s*hasError \? ".*?" : ".*?",\s*\);'
content = re.sub(regex, '', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up Testimonials.tsx")
