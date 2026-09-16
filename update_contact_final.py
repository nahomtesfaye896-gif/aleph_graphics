filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the status logic
import re
new_logic = """  const getWorkingHoursStatus = () => {
    const now = new Date();
    const ethiopiaTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    const currentTime = ethiopiaTime.getHours() * 60 + ethiopiaTime.getMinutes();
    const day = ethiopiaTime.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

    let startStr, endStr;
    if (day === 0) {
      startStr = settings.sunHoursStart;
      endStr = settings.sunHoursEnd;
    } else if (day === 6) {
      startStr = settings.satHoursStart;
      endStr = settings.satHoursEnd;
    } else {
      startStr = settings.workingHoursStart;
      endStr = settings.workingHoursEnd;
    }

    if (!startStr || !endStr) return { isOpen: false, text: lang === 'am' ? 'ዝግ ነው' : 'Closed' };

    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    const startTime = (startH * 60) + (startM || 0);
    const endTime = (endH * 60) + (endM || 0);

    if (currentTime >= startTime && currentTime < endTime) {
      return { isOpen: true, text: lang === 'am' ? 'ክፍት ነው' : 'Open Now' };
    }
    return { isOpen: false, text: lang === 'am' ? 'ዝግ ነው' : 'Closed' };
  };"""

content = re.sub(r'  const getWorkingHoursStatus = \(\) => \{.*?  \};', new_logic, content, flags=re.DOTALL)

# 2. Add 12 hour formatter
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
content = content.replace("  const getWorkingHoursStatus =", formatter)

# 3. Update the UI layout
ui_regex = r'<p className="text-xs font-bold uppercase tracking-\[0\.18em\] text-brand-300">\{t\.contact\.working\}</p>\s*\{statusObj && \(\s*<span className=\{cn\("rounded-full px-2 py-0\.5 text-\[10px\] font-bold tracking-wider", statusObj\.isOpen \? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"\)\}>\s*\{statusObj\.text\}\s*</span>\s*\)\}\s*</div>\s*\{settings\.workingHoursStart && settings\.workingHoursEnd && \(\s*<p className="mt-1 text-sm font-medium leading-relaxed text-white/90">\s*\{settings\.workingDays \|\| \'Mon-Sat\'\}: \{settings\.workingHoursStart\} - \{settings\.workingHoursEnd\}\s*<br />\s*Sunday: Closed\s*</p>\s*\)\}'

new_ui = """<p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.working}</p>
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
print("Updated Contact.tsx")
