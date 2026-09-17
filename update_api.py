filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\lib\api.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old = """  if (!response.ok) {
    throw new Error((result && result.error) || response.statusText || 'API Error');
  }"""

new = """  if (!response.ok) {
    let errMsg = 'API Error';
    if (result && typeof result === 'object') {
      if (result.error) errMsg = result.error;
      else if (result.detail) errMsg = result.detail;
      else if (result.message) errMsg = result.message;
      else {
        // Parse DRF validation errors
        const errs = Object.entries(result).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`).join(', ');
        if (errs) errMsg = errs;
      }
    } else if (typeof result === 'string' && result.trim()) {
      errMsg = result.length > 200 ? 'Server Error (500)' : result;
    } else if (response.statusText) {
      errMsg = response.statusText;
    }
    throw new Error(errMsg);
  }"""

content = content.replace(old, new)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated api.ts")
