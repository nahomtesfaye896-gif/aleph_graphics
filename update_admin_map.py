import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminSiteSettings.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the manual address input
block_to_remove = """            <div className="col-span-full">
              <label className="mb-1.5 block text-sm font-medium text-white/70">Physical Address</label>
              <input type="text" value={settings.addressEn} onChange={(e) => updateSettings("addressEn", e.target.value)} placeholder="Bole Road, Near Edna Mall..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">The text address displayed to users.</p>
            </div>"""

content = content.replace(block_to_remove, "")
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AdminSiteSettings.tsx")
