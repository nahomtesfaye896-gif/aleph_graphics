import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminSiteSettings.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add the manual override field before the map link
old_map = """            <div className="col-span-full">
              <label className="mb-1.5 block text-sm font-medium text-white/70">Google Maps Link</label>"""

new_map = """            <div className="col-span-full">
              <label className="mb-1.5 block text-sm font-medium text-white/70">Display Address Text (Manual Override)</label>
              <input type="text" value={settings.addressEn || ""} onChange={(e) => updateSettings("addressEn", e.target.value)} placeholder="Tsega event and communication..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">If you use a shortened map link (like maps.app.goo.gl), the site cannot auto-detect the name. Type the name manually here.</p>
            </div>

            <div className="col-span-full">
              <label className="mb-1.5 block text-sm font-medium text-white/70">Google Maps Link</label>"""

if "Display Address Text" not in content:
    content = content.replace(old_map, new_map)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AdminSiteSettings.tsx")
