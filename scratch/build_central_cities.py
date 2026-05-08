import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CENTRAL_PATH = ROOT / "cities.json"
DATA_DIR = ROOT / "data"
EXPECTED_PLACES = 9
EXPECTED_ACTIVITIES = 6


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def validate_city(city):
    places = city.get("lugares") or []
    if len(places) != EXPECTED_PLACES:
        return False

    return all(len(place.get("actividades") or []) == EXPECTED_ACTIVITIES for place in places)


def image_exists(src):
    if not src or src.startswith(("http://", "https://", "data:")):
        return True
    return (ROOT / src.split("?", 1)[0]).exists()


def preserve_valid_image_paths(city, previous_city):
    previous_places = {
        place.get("nombre"): place
        for place in previous_city.get("lugares", [])
        if isinstance(place, dict)
    }

    for place in city.get("lugares", []):
        previous_place = previous_places.get(place.get("nombre"))
        if not previous_place:
            continue

        for key in ("imagen", "imagenCard"):
            if not image_exists(place.get(key)) and image_exists(previous_place.get(key)):
                place[key] = previous_place[key]


def main():
    current_cities = load_json(CENTRAL_PATH)
    central_order = [city["id"] for city in current_cities]
    current_by_id = {city["id"]: city for city in current_cities}
    data_by_id = {}
    skipped = []

    for path in sorted(DATA_DIR.glob("*.json")):
        city_id = path.stem
        raw = load_json(path)
        if isinstance(raw, dict) and "id" in raw and "lugares" in raw:
            city = raw
        elif isinstance(raw, list) and city_id in current_by_id:
            city = dict(current_by_id[city_id])
            city["lugares"] = raw
        else:
            skipped.append((path.name, "formato no ciudad"))
            continue

        if not isinstance(city, dict) or "id" not in city or "lugares" not in city:
            skipped.append((path.name, "formato no ciudad"))
            continue

        if not validate_city(city):
            skipped.append((path.name, "incompleto"))
            continue

        data_by_id[city["id"]] = city

    central_cities = []
    missing = []
    for city_id in central_order:
        city = data_by_id.get(city_id)
        if city is None:
            missing.append(city_id)
            continue
        preserve_valid_image_paths(city, current_by_id[city_id])
        central_cities.append(city)

    if missing:
        raise SystemExit(f"Faltan ciudades completas para el central: {', '.join(missing)}")

    CENTRAL_PATH.write_text(
        json.dumps(central_cities, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Central actualizado: {len(central_cities)} ciudades en cities.json")
    if skipped:
        print("Archivos omitidos:")
        for filename, reason in skipped:
            print(f"- {filename}: {reason}")


if __name__ == "__main__":
    main()
