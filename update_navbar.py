filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Navbar.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the useEffect that touches document.body
effect_to_remove = """  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);"""

content = content.replace(effect_to_remove, "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Navbar.tsx")
