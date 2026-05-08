import json
import os
import sys

# Set encoding to utf-8 for stdout
sys.stdout.reconfigure(encoding='utf-8')

def validate_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"VALID: {file_path} is valid JSON.")
        print(f"Items found: {len(data)}")
    except json.JSONDecodeError as e:
        print(f"INVALID: {file_path} is INVALID JSON: {e}")
    except Exception as e:
        print(f"ERROR: Error reading {file_path}: {e}")

if __name__ == "__main__":
    validate_json(r'c:\Users\jamayuelas\OneDrive - ELMUBAS IBERICA, SLU\Documentos\Personal\IA\Antigravity\Roma\cities.json')
