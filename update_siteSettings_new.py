filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\utils\siteSettings.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update DEFAULT_SETTINGS to include the new fields
old_defaults = """  telegram: CONTACT.telegram,
  email: CONTACT.email,"""

new_defaults = """  telegram: CONTACT.telegram,
  telegramChannel: "",
  email: CONTACT.email,"""
content = content.replace(old_defaults, new_defaults)

old_working = """  workingHoursStart: "08:30",
  workingHoursEnd: "17:30",
  workingDays: "Mon-Sat",
  prices:"""

new_working = """  workingHoursStart: "08:30",
  workingHoursEnd: "17:30",
  workingDays: "Mon-Fri",
  satHoursStart: "08:30",
  satHoursEnd: "12:30",
  sunHoursStart: "",
  sunHoursEnd: "",
  prices:"""
content = content.replace(old_working, new_working)

# 2. Update parse logic
old_parse = """    workingHoursStart: raw.working_hours_start ?? DEFAULT_SETTINGS.workingHoursStart,
    workingHoursEnd: raw.working_hours_end ?? DEFAULT_SETTINGS.workingHoursEnd,
    workingDays: raw.working_days ?? DEFAULT_SETTINGS.workingDays,
    prices: raw.prices ?? { ...DEFAULT_SETTINGS.prices },"""

new_parse = """    workingHoursStart: raw.working_hours_start ?? DEFAULT_SETTINGS.workingHoursStart,
    workingHoursEnd: raw.working_hours_end ?? DEFAULT_SETTINGS.workingHoursEnd,
    workingDays: raw.working_days ?? DEFAULT_SETTINGS.workingDays,
    satHoursStart: raw.sat_hours_start ?? DEFAULT_SETTINGS.satHoursStart,
    satHoursEnd: raw.sat_hours_end ?? DEFAULT_SETTINGS.satHoursEnd,
    sunHoursStart: raw.sun_hours_start ?? DEFAULT_SETTINGS.sunHoursStart,
    sunHoursEnd: raw.sun_hours_end ?? DEFAULT_SETTINGS.sunHoursEnd,
    prices: raw.prices ?? { ...DEFAULT_SETTINGS.prices },"""
content = content.replace(old_parse, new_parse)

# 3. Update export logic
old_export = """      working_hours_start: s.workingHoursStart,
      working_hours_end: s.workingHoursEnd,
      working_days: s.workingDays,
      prices: s.prices,"""

new_export = """      working_hours_start: s.workingHoursStart,
      working_hours_end: s.workingHoursEnd,
      working_days: s.workingDays,
      sat_hours_start: s.satHoursStart,
      sat_hours_end: s.satHoursEnd,
      sun_hours_start: s.sunHoursStart,
      sun_hours_end: s.sunHoursEnd,
      prices: s.prices,"""
content = content.replace(old_export, new_export)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated siteSettings.ts")
