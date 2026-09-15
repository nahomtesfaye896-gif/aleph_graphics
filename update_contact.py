import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove getMapAddress and update displayAddress and validPhones
old_map_logic = """  const getMapAddress = (url: string) => {
    if (!url) return '';
    try {
      const parsedUrl = new URL(url);
      const query = parsedUrl.searchParams.get('q') || parsedUrl.searchParams.get('query');
      if (query) {
        return query.split('+').join(' ');
      }
    } catch (e) {
      // Ignore
    }
    return '';
  };

  const statusObj = getWorkingHoursStatus();
  const generatedAddress = getMapAddress(settings.mapUrl);
  const displayAddress = (lang === 'am' ? settings.addressAm : settings.addressEn) || generatedAddress || t.contact.addressValue;
  const displayPhones = [settings.phone, settings.phone2, settings.phoneAlt].filter(Boolean).join('  \u2022  ');"""

new_map_logic = """  const statusObj = getWorkingHoursStatus();
  const displayAddress = (lang === 'am' ? settings.addressAm : settings.addressEn) || t.contact.addressValue;
  const validPhones = [settings.phone, settings.phoneAlt].filter(p => p && p.trim().length > 0);"""

content = content.replace(old_map_logic, new_map_logic)
# If the joined string was not exactly '  \u2022  ' but '    ', let's use regex.
content = re.sub(r'  const getMapAddress.*join\([^)]+\);', new_map_logic, content, flags=re.DOTALL)

# 2. Update phone HTML
old_phone_html = """                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.phone}</p>
                    <a href={`tel:${settings.phone.replace(/\\s+/g, '')}`} className="mt-1 block whitespace-pre-line text-sm font-medium leading-relaxed text-white/90 hover:text-white hover:underline">
                      {displayPhones}
                    </a>
                  </div>"""

new_phone_html = """                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.phone}</p>
                    <div className="mt-1 space-y-1">
                      {validPhones.map((p, i) => (
                        <a key={i} href={`tel:${p.replace(/\\s+/g, '')}`} className="block whitespace-pre-line text-sm font-medium leading-relaxed text-white/90 hover:text-white hover:underline">
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>"""

content = content.replace(old_phone_html, new_phone_html)

# 3. Fix Map bottom UI
content = re.sub(r'\{displayAddress\.split\([^)]+\) \|\| generatedAddress \|\| \'Our Location\'\}', "{displayAddress.split(',')[0] || 'Our Location'}", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Contact.tsx")
