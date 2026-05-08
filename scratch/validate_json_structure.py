import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def validate_cities_structure(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            cities = json.load(f)
        
        errors = []
        for i, city in enumerate(cities):
            city_name = city.get('nombre', f'City at index {i}')
            if 'lat' not in city or 'lng' not in city:
                errors.append(f"City '{city_name}' is missing lat or lng.")
            if 'id' not in city:
                errors.append(f"City '{city_name}' is missing id.")
            if 'lugares' not in city:
                errors.append(f"City '{city_name}' is missing lugares.")
            
        if errors:
            print("ERRORS FOUND:")
            for err in errors:
                print(f"- {err}")
        else:
            print("Structure is valid for all cities.")
            print(f"Total cities: {len(cities)}")
            for city in cities:
                print(f"  - {city.get('nombre')} ({city.get('lat')}, {city.get('lng')})")

    except Exception as e:
        print(f"CRITICAL ERROR: {e}")

if __name__ == "__main__":
    validate_cities_structure(r'c:\Users\jamayuelas\OneDrive - ELMUBAS IBERICA, SLU\Documentos\Personal\IA\Antigravity\Roma\cities.json')
