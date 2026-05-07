import json
from pathlib import Path

from generate_missing_activities import build_activities


ROOT = Path(__file__).resolve().parents[1]

NEW_PLACES = [
    {
        "id": 4,
        "nombre": "Templo de Debod",
        "tipo": "cultura",
        "descripcion": "Un templo egipcio del siglo II a. C. reconstruido en Madrid como regalo de Egipto a España. Sus estanques, la piedra dorada y las vistas hacia la Casa de Campo lo convierten en uno de los atardeceres mas especiales de la ciudad.",
        "descripcionCorta": "Un templo egipcio con uno de los mejores atardeceres de Madrid.",
        "direccion": "Calle de Ferraz, 1, 28008 Madrid",
        "lat": 40.424,
        "lng": -3.7178,
        "horario": "10:00 - 20:00",
        "precio": "Gratis",
        "rating": 4.6,
        "imagen": "img/madrid_debod.png",
        "imagenCard": "img/madrid_debod.png",
        "tags": ["egipto", "atardecer", "mirador"],
        "web": "https://www.madrid.es/templodebod",
    },
    {
        "id": 5,
        "nombre": "Gran Via",
        "tipo": "barrios",
        "descripcion": "La avenida mas cinematografica de Madrid concentra teatros, edificios historicos, tiendas, azoteas y neones. Caminarla desde Alcala hasta Plaza de España es ver la ciudad en movimiento constante.",
        "descripcionCorta": "La gran arteria teatral, comercial y luminosa de Madrid.",
        "direccion": "Gran Via, 28013 Madrid",
        "lat": 40.4203,
        "lng": -3.7058,
        "horario": "24h",
        "precio": "Gratis",
        "rating": 4.7,
        "imagen": "img/madrid_granvia.png",
        "imagenCard": "img/madrid_granvia.png",
        "tags": ["teatros", "compras", "arquitectura"],
    },
    {
        "id": 6,
        "nombre": "Plaza Mayor",
        "tipo": "cultura",
        "descripcion": "El gran salon urbano del Madrid de los Austrias. Sus soportales, balcones y la estatua de Felipe III resumen siglos de mercado, celebraciones, historia popular y vida de terraza.",
        "descripcionCorta": "La plaza porticada mas historica del centro de Madrid.",
        "direccion": "Plaza Mayor, 28012 Madrid",
        "lat": 40.4155,
        "lng": -3.7074,
        "horario": "24h",
        "precio": "Gratis",
        "rating": 4.7,
        "imagen": "img/madrid_plazamayor.png",
        "imagenCard": "img/madrid_plazamayor.png",
        "tags": ["historia", "austrias", "plaza"],
    },
    {
        "id": 7,
        "nombre": "Mercado de San Miguel",
        "tipo": "restaurantes",
        "descripcion": "Un mercado historico transformado en escaparate gastronomico. Entre hierro, cristal y barras animadas se prueban tapas, conservas, vinos, arroces y dulces en pleno centro.",
        "descripcionCorta": "El mercado gourmet mas famoso del casco historico.",
        "direccion": "Plaza de San Miguel, s/n, 28005 Madrid",
        "lat": 40.4154,
        "lng": -3.7089,
        "horario": "10:00 - 0:00",
        "precio": "Segun consumo",
        "rating": 4.5,
        "imagen": "img/madrid_sanmiguel.png",
        "imagenCard": "img/madrid_sanmiguel.png",
        "tags": ["tapas", "mercado", "gastronomia"],
        "web": "https://mercadodesanmiguel.es",
    },
    {
        "id": 8,
        "nombre": "Puerta del Sol",
        "tipo": "cultura",
        "descripcion": "Kilometro cero simbolico de España y punto de encuentro permanente. El reloj de la Real Casa de Correos, el Oso y el Madroño y el ir y venir de gente condensan la energia del centro.",
        "descripcionCorta": "El kilometro cero y punto de encuentro clasico de Madrid.",
        "direccion": "Puerta del Sol, 28013 Madrid",
        "lat": 40.4169,
        "lng": -3.7035,
        "horario": "24h",
        "precio": "Gratis",
        "rating": 4.6,
        "imagen": "img/madrid_sol.png",
        "imagenCard": "img/madrid_sol.png",
        "tags": ["kilometro cero", "centro", "icono"],
    },
    {
        "id": 9,
        "nombre": "Chocolateria San Gines",
        "tipo": "restaurantes",
        "descripcion": "Desde 1894, este clasico junto a la Puerta del Sol sirve chocolate con churros a cualquier hora. Es una parada castiza, dulce y perfecta para cerrar una ruta por el centro.",
        "descripcionCorta": "El chocolate con churros mas emblematico de Madrid.",
        "direccion": "Pasadizo de San Gines, 5, 28013 Madrid",
        "lat": 40.4167,
        "lng": -3.7069,
        "horario": "24h",
        "precio": "Desde 5 EUR",
        "rating": 4.5,
        "imagen": "img/madrid_sangines.png",
        "imagenCard": "img/madrid_sangines.png",
        "tags": ["churros", "chocolate", "clasico"],
        "web": "https://chocolateriasangines.com",
    },
]


def complete_places(places):
    by_name = {place["nombre"]: place for place in places}
    for new_place in NEW_PLACES:
        if new_place["nombre"] not in by_name:
            place = dict(new_place)
            place["actividades"] = build_activities(place, "Madrid")
            places.append(place)
    places.sort(key=lambda place: place["id"])


def main():
    madrid_path = ROOT / "data" / "madrid.json"
    madrid_places = json.loads(madrid_path.read_text(encoding="utf-8"))
    complete_places(madrid_places)
    madrid_path.write_text(json.dumps(madrid_places, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    cities_path = ROOT / "cities.json"
    cities = json.loads(cities_path.read_text(encoding="utf-8"))
    for city in cities:
        if city.get("id") == "madrid":
            complete_places(city.setdefault("lugares", []))
            break
    cities_path.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("Madrid completado con", len(madrid_places), "lugares.")


if __name__ == "__main__":
    main()
