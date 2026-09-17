filepath = r'C:\Users\hp\Desktop\aleph_graphics\backend\api\serializers.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Change desc/long fields from CharField to no-limit by allowing them explicitly
# The issue is DRF CharField defaults to max_length from the model for CharField,
# but for TextField-backed fields it should not impose a limit.
# Fix: override them explicitly or remove the max_length constraint.

old = """    descEn = serializers.CharField(source='desc_en', required=False, allow_blank=True)
    descAm = serializers.CharField(source='desc_am', required=False, allow_blank=True)
    longEn = serializers.CharField(source='long_en', required=False, allow_blank=True)
    longAm = serializers.CharField(source='long_am', required=False, allow_blank=True)"""

new = """    descEn = serializers.CharField(source='desc_en', required=False, allow_blank=True, max_length=None)
    descAm = serializers.CharField(source='desc_am', required=False, allow_blank=True, max_length=None)
    longEn = serializers.CharField(source='long_en', required=False, allow_blank=True, max_length=None)
    longAm = serializers.CharField(source='long_am', required=False, allow_blank=True, max_length=None)"""

content = content.replace(old, new)

# Also fix tagline fields in case those are long too
old_tag = """    taglineEn = serializers.CharField(source='tagline_en', required=False, allow_blank=True)
    taglineAm = serializers.CharField(source='tagline_am', required=False, allow_blank=True)"""

new_tag = """    taglineEn = serializers.CharField(source='tagline_en', required=False, allow_blank=True, max_length=None)
    taglineAm = serializers.CharField(source='tagline_am', required=False, allow_blank=True, max_length=None)"""

content = content.replace(old_tag, new_tag)

# Also fix nameEn/nameAm
old_name = """    nameEn = serializers.CharField(source='name_en')
    nameAm = serializers.CharField(source='name_am', required=False, allow_blank=True)"""

new_name = """    nameEn = serializers.CharField(source='name_en', max_length=None)
    nameAm = serializers.CharField(source='name_am', required=False, allow_blank=True, max_length=None)"""

content = content.replace(old_name, new_name)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed CourseSerializer - removed max_length limits")
