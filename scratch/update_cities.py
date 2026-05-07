import json

def update_cities_json():
    with open('cities.json', 'r', encoding='utf-8') as f:
        cities = json.load(f)
    
    with open('scratch/rio_updated.json', 'r', encoding='utf-8') as f:
        new_rio_lugares = json.load(f)
    
    found = False
    for city in cities:
        if city['id'] == 'rio':
            city['lugares'] = new_rio_lugares
            found = True
            break
    
    if found:
        with open('cities_updated.json', 'w', encoding='utf-8') as f:
            json.dump(cities, f, ensure_ascii=False, indent=2)
        print("cities.json updated and saved to cities_updated.json")
    else:
        print("Rio not found in cities.json")

if __name__ == "__main__":
    update_cities_json()
