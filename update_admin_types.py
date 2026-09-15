filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\types\admin.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'telegram: string;',
    'telegram: string;\n  telegramChannel?: string;'
)

# And add the working hours schema changes while we're here
# Replace single workingHoursStart/End with monFri/sat/sun breakdown
old_wh = """  workingHoursStart?: string;
  workingHoursEnd?: string;
  workingDays?: string;"""

new_wh = """  workingHoursStart?: string;
  workingHoursEnd?: string;
  workingDays?: string;
  satHoursStart?: string;
  satHoursEnd?: string;
  sunHoursStart?: string;
  sunHoursEnd?: string;"""

content = content.replace(old_wh, new_wh)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated admin.ts")
