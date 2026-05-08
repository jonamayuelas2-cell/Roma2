import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "rio.json"
CENTRAL_PATH = ROOT / "cities.json"


def slugify(text):
    text = text.lower()
    replacements = str.maketrans("áàãâäéèêëíìîïóòõôöúùûüçñ", "aaaaaeeeeiiiiooooouuuucn")
    text = text.translate(replacements)
    return re.sub(r"[^a-z0-9]+", "", text) or "actividad"


def load(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def add_images_to_places(places):
    for place in places:
        place_slug = slugify(place["nombre"])
        for index, activity in enumerate(place.get("actividades", []), start=1):
            activity_slug = slugify(activity["titulo"])
            activity["imagen"] = f"img/rio_activities/{place_slug}_{index}_{activity_slug}.png"


def main():
    rio_places = load(DATA_PATH)
    add_images_to_places(rio_places)
    DATA_PATH.write_text(json.dumps(rio_places, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    central = load(CENTRAL_PATH)
    for city in central:
        if city.get("id") == "rio":
            city["lugares"] = rio_places
            break
    else:
        raise SystemExit("No se encontro Rio en cities.json")

    CENTRAL_PATH.write_text(json.dumps(central, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Rutas de imagen de actividades de Rio actualizadas.")


if __name__ == "__main__":
    main()
