import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminSiteSettings.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Working Hours
old_working = """          <div className="grid gap-6 sm:grid-cols-2">
            <h3 className="col-span-full text-lg font-bold text-white border-b border-white/10 pb-2 mt-4">Working Hours</h3>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Working Days</label>
              <input type="text" value={settings.workingDays || ""} onChange={(e) => updateSettings("workingDays", e.target.value)} placeholder="Mon-Sat" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>

            <div className="col-span-full grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Opening Time (Ethiopian Time)</label>
                <input type="time" value={settings.workingHoursStart || ""} onChange={(e) => updateSettings("workingHoursStart", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Closing Time (Ethiopian Time)</label>
                <input type="time" value={settings.workingHoursEnd || ""} onChange={(e) => updateSettings("workingHoursEnd", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
              </div>
            </div>
          </div>"""

new_working = """          <div className="grid gap-6 sm:grid-cols-2">
            <h3 className="col-span-full text-lg font-bold text-white border-b border-white/10 pb-2 mt-4">Working Hours (Ethiopian Time)</h3>
            
            <div className="col-span-full border border-white/10 p-4 rounded-xl space-y-4">
              <h4 className="text-brand-300 font-bold text-sm mb-2">Monday - Friday</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/70">Opening Time</label>
                  <input type="time" value={settings.workingHoursStart || ""} onChange={(e) => updateSettings("workingHoursStart", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/70">Closing Time</label>
                  <input type="time" value={settings.workingHoursEnd || ""} onChange={(e) => updateSettings("workingHoursEnd", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-500" />
                </div>
              </div>
            </div>

            <div className="col-span-full border border-white/10 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-brand-300 font-bold text-sm">Saturday</h4>
                <span className="text-xs text-white/40 italic">Leave empty if closed</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/70">Opening Time</label>
                  <input type="time" value={settings.satHoursStart || ""} onChange={(e) => updateSettings("satHoursStart", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/70">Closing Time</label>
                  <input type="time" value={settings.satHoursEnd || ""} onChange={(e) => updateSettings("satHoursEnd", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-500" />
                </div>
              </div>
            </div>

            <div className="col-span-full border border-white/10 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-brand-300 font-bold text-sm">Sunday</h4>
                <span className="text-xs text-white/40 italic">Leave empty if closed</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/70">Opening Time</label>
                  <input type="time" value={settings.sunHoursStart || ""} onChange={(e) => updateSettings("sunHoursStart", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/70">Closing Time</label>
                  <input type="time" value={settings.sunHoursEnd || ""} onChange={(e) => updateSettings("sunHoursEnd", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-500" />
                </div>
              </div>
            </div>
          </div>"""

content = content.replace(old_working, new_working)

# 2. Update Telegram Channel
old_telegram = """            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Telegram Channel</label>
              <input type="url" value={settings.social.telegram || ""} onChange={(e) => updateSettings("telegram", e.target.value)} placeholder="https://t.me/alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>"""

new_telegram = """            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Telegram Username (For Contact)</label>
              <input type="url" value={settings.social.telegram || ""} onChange={(e) => updateSettings("telegram", e.target.value)} placeholder="https://t.me/alephcontact" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">Used in footer social icons.</p>
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Telegram Channel (For Join Group)</label>
              <input type="url" value={settings.social.telegramChannel || ""} onChange={(e) => updateSettings("telegramChannel", e.target.value)} placeholder="https://t.me/alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">Used for the 'Join Channel' links.</p>
            </div>"""

content = content.replace(old_telegram, new_telegram)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AdminSiteSettings.tsx")
