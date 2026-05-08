import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
CENTRAL_PATH = ROOT / "cities.json"


def slugify(text):
    text = text.lower()
    replacements = str.maketrans("áàãâäéèêëíìîïóòõôöúùûüçñ", "aaaaaeeeeiiiiooooouuuucn")
    text = text.translate(replacements)
    return re.sub(r"[^a-z0-9]+", "", text) or "actividad"


def load(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scratch/add_city_activity_images.py <city_id>")

    city_id = sys.argv[1]
    data_path = DATA_DIR / f"{city_id}.json"
    city_data = load(data_path)

    if isinstance(city_data, list):
        places = city_data
    else:
        places = city_data["lugares"]

    for place in places:
        place_slug = slugify(place["nombre"])
        for index, activity in enumerate(place.get("actividades", []), start=1):
            activity_slug = slugify(activity["titulo"])
            activity["imagen"] = f"img/{city_id}_activities/{place_slug}_{index}_{activity_slug}.png"

    if isinstance(city_data, list):
        data_path.write_text(json.dumps(places, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    else:
        city_data["lugares"] = places
        data_path.write_text(json.dumps(city_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    central = load(CENTRAL_PATH)
    for city in central:
        if city.get("id") == city_id:
            city["lugares"] = places
            break
    else:
        raise SystemExit(f"No se encontro {city_id} en cities.json")

    CENTRAL_PATH.write_text(json.dumps(central, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Rutas de imagen de actividades de {city_id} actualizadas.")


if __name__ == "__main__":
    main()
