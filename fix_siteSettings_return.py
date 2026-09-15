filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_return = """  return {
    phone: typeof raw.phone === "string" ? raw.phone : DEFAULT_SETTINGS.phone,
    phone2: typeof raw.phone2 === "string" ? raw.phone2 : DEFAULT_SETTINGS.phone2,
    phoneAlt: typeof raw.phoneAlt === "string" ? raw.phoneAlt : DEFAULT_SETTINGS.phoneAlt,
    whatsapp: typeof raw.whatsapp === "string" ? raw.whatsapp : DEFAULT_SETTINGS.whatsapp,
    telegram: typeof raw.telegram === "string" ? raw.telegram : DEFAULT_SETTINGS.telegram,
    email: typeof raw.email === "string" ? raw.email : DEFAULT_SETTINGS.email,
    mapUrl: typeof raw.mapUrl === "string" ? raw.mapUrl : DEFAULT_SETTINGS.mapUrl,
    logoImage: typeof raw.logoImage === "string" ? raw.logoImage : DEFAULT_SETTINGS.logoImage,
    addressEn: typeof raw.addressEn === "string" ? raw.addressEn : DEFAULT_SETTINGS.addressEn,
    addressAm: typeof raw.addressAm === "string" ? raw.addressAm : DEFAULT_SETTINGS.addressAm,
    workingHoursStart: typeof raw.workingHoursStart === "string" ? raw.workingHoursStart : DEFAULT_SETTINGS.workingHoursStart,
    workingHoursEnd: typeof raw.workingHoursEnd === "string" ? raw.workingHoursEnd : DEFAULT_SETTINGS.workingHoursEnd,
    workingDays: typeof raw.workingDays === "string" ? raw.workingDays : DEFAULT_SETTINGS.workingDays,
    prices,
    social,
  };"""

new_return = """  return {
    phone: typeof raw.phone === "string" ? raw.phone : DEFAULT_SETTINGS.phone,
    phone2: typeof raw.phone2 === "string" ? raw.phone2 : DEFAULT_SETTINGS.phone2,
    phoneAlt: typeof raw.phoneAlt === "string" ? raw.phoneAlt : DEFAULT_SETTINGS.phoneAlt,
    whatsapp: typeof raw.whatsapp === "string" ? raw.whatsapp : DEFAULT_SETTINGS.whatsapp,
    telegram: typeof raw.telegram === "string" ? raw.telegram : DEFAULT_SETTINGS.telegram,
    telegramChannel: typeof (raw as any).telegramChannel === "string" ? (raw as any).telegramChannel : DEFAULT_SETTINGS.telegramChannel || "",
    email: typeof raw.email === "string" ? raw.email : DEFAULT_SETTINGS.email,
    mapUrl: typeof raw.mapUrl === "string" ? raw.mapUrl : DEFAULT_SETTINGS.mapUrl,
    logoImage: typeof raw.logoImage === "string" ? raw.logoImage : DEFAULT_SETTINGS.logoImage,
    addressEn: typeof raw.addressEn === "string" ? raw.addressEn : DEFAULT_SETTINGS.addressEn,
    addressAm: typeof raw.addressAm === "string" ? raw.addressAm : DEFAULT_SETTINGS.addressAm,
    workingHoursStart: typeof raw.workingHoursStart === "string" ? raw.workingHoursStart : DEFAULT_SETTINGS.workingHoursStart,
    workingHoursEnd: typeof raw.workingHoursEnd === "string" ? raw.workingHoursEnd : DEFAULT_SETTINGS.workingHoursEnd,
    workingDays: typeof raw.workingDays === "string" ? raw.workingDays : DEFAULT_SETTINGS.workingDays,
    satHoursStart: typeof raw.satHoursStart === "string" ? raw.satHoursStart : DEFAULT_SETTINGS.satHoursStart,
    satHoursEnd: typeof raw.satHoursEnd === "string" ? raw.satHoursEnd : DEFAULT_SETTINGS.satHoursEnd,
    sunHoursStart: typeof raw.sunHoursStart === "string" ? raw.sunHoursStart : DEFAULT_SETTINGS.sunHoursStart,
    sunHoursEnd: typeof raw.sunHoursEnd === "string" ? raw.sunHoursEnd : DEFAULT_SETTINGS.sunHoursEnd,
    prices,
    social,
  };"""

content = content.replace(old_return, new_return)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed return")
