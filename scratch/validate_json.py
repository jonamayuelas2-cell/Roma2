import json
import sys

try:
    with open('cities.json', 'r', encoding='utf-8') as f:
        json.load(f)
    print("JSON_VALID")
except Exception as e:
    print(f"JSON_INVALID: {e}")
    sys.exit(1)
