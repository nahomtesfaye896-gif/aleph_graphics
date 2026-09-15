import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Contact.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add getMapAddress logic back, but improved
old_logic = """  const statusObj = getWorkingHoursStatus();
  const displayAddress = (lang === 'am' ? settings.addressAm : settings.addressEn) || t.contact.addressValue;"""

new_logic = """  const getMapAddress = (url: string) => {
    if (!url) return '';
    try {
      const parsedUrl = new URL(url);
      
      // Try to extract from /place/Name path
      const placeMatch = parsedUrl.pathname.match(/\\/place\\/([^/@]+)/);
      if (placeMatch && placeMatch[1]) {
        return decodeURIComponent(placeMatch[1].replace(/\\+/g, ' '));
      }
      
      // Try to extract from ?q=Name
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
  // Prioritize generated address if mapUrl exists, fallback to manual or default
  const displayAddress = generatedAddress || (lang === 'am' ? settings.addressAm : settings.addressEn) || t.contact.addressValue;"""

content = content.replace(old_logic, new_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Contact.tsx")
