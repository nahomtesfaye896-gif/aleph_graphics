filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\lib\api.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_error = """    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }"""

new_error = """    if (!res.ok) {
      let errMsg = data.message || "API Error";
      // Try to parse DRF validation errors
      if (typeof data === "object" && !data.message) {
        const errors = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(", ");
        if (errors) errMsg = errors;
      }
      throw new Error(errMsg);
    }"""

content = content.replace(old_error, new_error)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated api.ts")
