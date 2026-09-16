filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Testimonials.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re
# We just want to remove the block between `const go = ...` and `return (`
regex = r'(const go = \(dir: number\) => setIndex\(\(i\) => \(i \+ dir \+ items\.length\) % items\.length\);).*?(return \()'
content = re.sub(regex, r'\1\n\n  \2', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up orphaned lines")
