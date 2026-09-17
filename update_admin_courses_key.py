filepath = r'C:\Users\hp\Desktop\aleph_graphics\src\components\Admin\AdminCourses.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_input = '<input required type="text" value={currentCourse.key || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, key: e.target.value })}'
new_input = '<input required type="text" value={currentCourse.key || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, key: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-") })}'

content = content.replace(old_input, new_input)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AdminCourses.tsx key input")
