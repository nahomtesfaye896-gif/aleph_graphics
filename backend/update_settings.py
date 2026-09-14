import os
import re

filepath = r'C:\Users\hp\Desktop\aleph_graphics\backend\config\settings.py'
with open(filepath, 'r') as f:
    content = f.read()

if 'import dj_database_url' not in content:
    content = content.replace('import os', 'import os\nimport dj_database_url')

content = content.replace("ALLOWED_HOSTS = ['localhost', '127.0.0.1']", "ALLOWED_HOSTS = ['*']")

if 'whitenoise.middleware.WhiteNoiseMiddleware' not in content:
    content = content.replace(
        "'django.middleware.security.SecurityMiddleware',",
        "'django.middleware.security.SecurityMiddleware',\n    'whitenoise.middleware.WhiteNoiseMiddleware',"
    )

db_config = '''DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}'''

content = re.sub(r'DATABASES = \{.*?\n\}', db_config, content, flags=re.DOTALL)

if 'STATICFILES_STORAGE' not in content:
    content = content.replace(
        "STATIC_URL = 'static/'",
        "STATIC_URL = 'static/'\nSTATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')\nSTATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'"
    )

content = content.replace(
    "CORS_ALLOWED_ORIGINS = [\n    os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173'),\n]",
    "CORS_ALLOW_ALL_ORIGINS = True"
)

with open(filepath, 'w') as f:
    f.write(content)
print('Done!')
