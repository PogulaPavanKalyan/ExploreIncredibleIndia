import urllib.request
import json

try:
    response = urllib.request.urlopen("http://51.21.159.47:8081/api/webinars", timeout=5)
    data = json.loads(response.read().decode('utf-8'))
    print(json.dumps(data, indent=2))
except Exception as e:
    print("Error:", e)
