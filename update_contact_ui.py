import re
filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add 12 hour formatter
formatter = """  const format12h = (timeStr?: string) => {
    if (!timeStr) return "";
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${mStr} ${ampm}`;
  };

  const getWorkingHoursStatus ="""
if "format12h" not in content:
    content = content.replace("  const getWorkingHoursStatus =", formatter)

ui_regex = r'<p className="text-xs font-bold uppercase tracking-\[0\.18em\] text-brand-300 flex items-center gap-2">.*?</p>\s*<p className="mt-1 whitespace-pre-line text-sm font-medium leading-relaxed text-white/90">.*?</p>'

new_ui = """<div className="flex items-center gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.working}</p>
                      {statusObj && (
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider", statusObj.isOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                          {statusObj.text}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1 text-sm font-medium leading-relaxed text-white/90">
                      {settings.workingHoursStart && settings.workingHoursEnd && (
                        <p>{settings.workingDays || 'Mon-Fri'}: {format12h(settings.workingHoursStart)} - {format12h(settings.workingHoursEnd)}</p>
                      )}
                      
                      {settings.satHoursStart && settings.satHoursEnd ? (
                        <p>Saturday: {format12h(settings.satHoursStart)} - {format12h(settings.satHoursEnd)}</p>
                      ) : (
                        <p>Saturday: Closed</p>
                      )}
                      
                      {settings.sunHoursStart && settings.sunHoursEnd ? (
                        <p>Sunday: {format12h(settings.sunHoursStart)} - {format12h(settings.sunHoursEnd)}</p>
                      ) : (
                        <p>Sunday: Closed</p>
                      )}
                    </div>"""

content = re.sub(ui_regex, new_ui, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Contact.tsx UI")
