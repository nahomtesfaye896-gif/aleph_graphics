import json

data = {
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}

filepath = r'C:\Users\hp\Desktop\aleph_graphics\vercel.json'
with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Saved cleanly!")
