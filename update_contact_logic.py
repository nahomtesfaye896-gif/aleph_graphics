filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_working_logic = """  const getWorkingHoursStatus = () => {
    if (!settings.workingHoursStart || !settings.workingHoursEnd) return null;
    
    // Get current time in Ethiopia (UTC+3)
    const now = new Date();
    const ethiopiaTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    
    const currentHours = ethiopiaTime.getHours();
    const currentMinutes = ethiopiaTime.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    const [startH, startM] = settings.workingHoursStart.split(':').map(Number);
    const [endH, endM] = settings.workingHoursEnd.split(':').map(Number);
    
    const startTime = (startH * 60) + (startM || 0);
    const endTime = (endH * 60) + (endM || 0);
    
    // Simple day check (Mon-Sat = 1-6)
    const day = ethiopiaTime.getDay();
    const isWorkingDay = day !== 0; // Assuming Sunday is closed
    
    if (isWorkingDay && currentTime >= startTime && currentTime < endTime) {
      return { isOpen: true, text: lang === 'am' ? '??? ??' : 'Open Now' };
    }
    return { isOpen: false, text: lang === 'am' ? '?? ??' : 'Closed' };
  };"""

new_working_logic = """  const getWorkingHoursStatus = () => {
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

content = content.replace(old_working_logic, new_working_logic)

# Update the display of working hours in the UI
old_ui = """                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.working}</p>
                      {statusObj && (
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider", statusObj.isOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                          {statusObj.text}
                        </span>
                      )}
                    </div>
                    {settings.workingHoursStart && settings.workingHoursEnd && (
                      <p className="mt-1 text-sm font-medium leading-relaxed text-white/90">
                        {settings.workingDays}: {settings.workingHoursStart} - {settings.workingHoursEnd}
                        <br />
                        Sunday: Closed
                      </p>
                    )}
                  </div>
                </div>"""

new_ui = """                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.working}</p>
                      {statusObj && (
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider", statusObj.isOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                          {statusObj.text}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1 text-sm font-medium leading-relaxed text-white/90">
                      {settings.workingHoursStart && settings.workingHoursEnd && (
                        <p>Mon-Fri: {settings.workingHoursStart} - {settings.workingHoursEnd}</p>
                      )}
                      
                      {settings.satHoursStart && settings.satHoursEnd ? (
                        <p>Saturday: {settings.satHoursStart} - {settings.satHoursEnd}</p>
                      ) : (
                        <p>Saturday: Closed</p>
                      )}
                      
                      {settings.sunHoursStart && settings.sunHoursEnd ? (
                        <p>Sunday: {settings.sunHoursStart} - {settings.sunHoursEnd}</p>
                      ) : (
                        <p>Sunday: Closed</p>
                      )}
                    </div>
                  </div>
                </div>"""

content = content.replace(old_ui, new_ui)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Contact.tsx")
