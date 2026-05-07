import json

required_fields = ['id', 'nombre', 'lat', 'lng', 'imagen']

try:
    with open('cities.json', 'r', encoding='utf-8') as f:
        cities = json.load(f)
        for i, city in enumerate(cities):
            for field in required_fields:
                if field not in city:
                    print(f"City at index {i} is missing field: {field}")
                elif city[field] is None:
                    print(f"City at index {i} has null field: {field}")
            
            # Check for invalid lat/lng
            if not isinstance(city.get('lat'), (int, float)):
                print(f"City {city.get('nombre')} has invalid lat: {city.get('lat')}")
            if not isinstance(city.get('lng'), (int, float)):
                print(f"City {city.get('nombre')} has invalid lng: {city.get('lng')}")
                
    print("CHECK_COMPLETE")
except Exception as e:
    print(f"ERROR: {e}")
