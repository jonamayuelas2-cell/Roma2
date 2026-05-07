import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ACTIVITY_COUNT = 6


TEMPLATES = {
    "museos": [
        ("Visita guiada a la coleccion", "Recorrido para entender las piezas clave de {place} y su papel en la identidad de {city}.", "{place} Educacion", "educacion@{slug}.local", "10:00 - 12:00"),
        ("Ruta de obras imprescindibles", "Seleccion comentada de salas, objetos y relatos para aprovechar la visita sin perderse lo esencial.", "Guias de {city}", "reservas@{city_slug}tours.local", "12:30 - 14:00"),
        ("Taller creativo", "Actividad practica inspirada en las colecciones del museo, pensada para viajeros curiosos y familias.", "Atelier {city}", "talleres@{city_slug}atelier.local", "16:00 - 18:00"),
        ("Audioguia express", "Formato autonomo y breve para recorrer {place} con contexto historico y buenas pausas.", "Audio Travel", "audio@travel.local", "Durante apertura"),
        ("Encuentro con especialista", "Charla divulgativa sobre restauracion, archivo o seleccion de piezas destacadas.", "Cultura {city}", "info@cultura{city_slug}.local", "Consultar calendario"),
        ("Paseo fotografico interior", "Ruta de encuadres permitidos, arquitectura y detalles visuales sin interferir con la visita.", "Photo Walk {city}", "foto@{city_slug}walk.local", "Ultima hora de apertura"),
    ],
    "cultura": [
        ("Tour historico esencial", "Recorrido guiado por {place} para conectar arquitectura, personajes y momentos clave de {city}.", "Historia Viva {city}", "reservas@historia{city_slug}.local", "10:00 - 12:00"),
        ("Acceso con contexto local", "Visita pausada con explicaciones practicas para comprender por que este lugar sigue siendo imprescindible.", "Guias Locales {city}", "hola@{city_slug}local.local", "12:00 - 14:00"),
        ("Paseo fotografico", "Itinerario para capturar fachadas, perspectivas y detalles con la mejor luz disponible.", "Photo Walk {city}", "foto@{city_slug}walk.local", "Atardecer"),
        ("Ruta de leyendas", "Historias, simbolos y anecdotas alrededor de {place}, con tono narrativo y facil de seguir.", "Relatos de {city}", "relatos@{city_slug}.local", "18:00 - 19:30"),
        ("Visita familiar", "Version didactica con paradas breves, preguntas y claves sencillas para ninos y adultos.", "Familias Viajeras", "familias@viaje.local", "11:00 - 12:30"),
        ("Audioguia express", "Recorrido autonomo para ver lo principal de {place} con contexto claro y sin prisas.", "Audio Travel", "audio@travel.local", "Durante apertura"),
    ],
    "barrios": [
        ("Paseo de barrio", "Ruta a pie por calles, plazas y rincones cotidianos para entender el caracter de {place}.", "Walks {city}", "walks@{city_slug}.local", "10:30 - 12:30"),
        ("Ruta gastronomica local", "Paradas escogidas para probar sabores representativos y conocer pequenos comercios de la zona.", "Sabores de {city}", "sabores@{city_slug}.local", "13:00 - 15:00"),
        ("Fotografia urbana", "Paseo para buscar fachadas, mercados, escenas de calle y detalles con personalidad.", "Photo Walk {city}", "foto@{city_slug}walk.local", "Atardecer"),
        ("Historias del vecindario", "Relato guiado sobre cambios urbanos, vida local y memoria del barrio.", "Cronicas {city}", "cronicas@{city_slug}.local", "17:00 - 18:30"),
        ("Compras con guia local", "Seleccion de tiendas, talleres y productos con criterio local y sin prisas.", "Local Shops {city}", "shops@{city_slug}.local", "11:00 - 13:00"),
        ("Noche de ambiente", "Recorrido suave por bares, plazas y locales recomendados para tomar el pulso nocturno.", "After Dark {city}", "noche@{city_slug}.local", "20:00 - 22:00"),
    ],
    "parques": [
        ("Paseo botanico", "Recorrido por senderos, jardines y miradores para reconocer especies y entender el paisaje de {place}.", "Green {city}", "green@{city_slug}.local", "10:00 - 11:30"),
        ("Picnic con producto local", "Experiencia relajada con cesta preparada y recomendaciones de zonas tranquilas.", "Picnic {city}", "picnic@{city_slug}.local", "13:00 - 15:00"),
        ("Ruta fotografica natural", "Paseo para capturar luz, vegetacion, agua y vistas con ritmo tranquilo.", "Photo Walk {city}", "foto@{city_slug}walk.local", "Atardecer"),
        ("Actividad familiar al aire libre", "Juego de observacion y pequenas misiones para recorrer {place} con ninos.", "Familias Viajeras", "familias@viaje.local", "11:00 - 12:30"),
        ("Bienestar y estiramientos", "Sesion suave para empezar el dia respirando mejor y disfrutando del entorno.", "Wellness {city}", "wellness@{city_slug}.local", "08:30 - 09:30"),
        ("Miradores y rincones tranquilos", "Ruta breve por bancos, sombras y puntos de descanso para bajar el ritmo del viaje.", "Slow Travel {city}", "slow@{city_slug}.local", "16:30 - 18:00"),
    ],
    "restaurantes": [
        ("Mesa recomendada", "Reserva orientada para probar los platos mas representativos de {place} sin complicarse.", "{place}", "reservas@{slug}.local", "Comida y cena"),
        ("Menu degustacion", "Seleccion de platos para entender la propuesta de cocina y los sabores de {city}.", "Sabores de {city}", "sabores@{city_slug}.local", "Consultar servicio"),
        ("Charla con cocina", "Experiencia breve para conocer ingredientes, tecnica y pequenos detalles del equipo.", "Food Stories {city}", "food@{city_slug}.local", "Antes de comer"),
        ("Maridaje local", "Propuesta de bebidas o productos locales para acompanar la comida con criterio.", "Catas {city}", "catas@{city_slug}.local", "Cena"),
        ("Ruta gastronomica cercana", "Paseo por la zona antes o despues de comer, enlazando mercado, barrio y mesa.", "Food Walk {city}", "foodwalk@{city_slug}.local", "12:00 - 14:00"),
        ("Clase de sabor local", "Taller sencillo inspirado en recetas, ingredientes o tecnicas vinculadas al restaurante.", "Talleres {city}", "talleres@{city_slug}.local", "Consultar calendario"),
    ],
}

DEFAULT_TEMPLATES = [
    ("Visita guiada esencial", "Recorrido interpretado por {place} y su contexto dentro de {city}.", "Guias Locales {city}", "hola@{city_slug}local.local", "10:00 - 12:00"),
    ("Paseo fotografico", "Actividad para encontrar buenos encuadres, detalles y luz adecuada en {place}.", "Photo Walk {city}", "foto@{city_slug}walk.local", "Atardecer"),
    ("Tour privado a medida", "Experiencia flexible con guia local segun intereses, ritmo y tiempo disponible.", "Travel Designers {city}", "plan@{city_slug}travel.local", "Bajo reserva"),
    ("Ruta familiar", "Version didactica y ligera para visitar sin saturar a los mas pequenos.", "Familias Viajeras", "familias@viaje.local", "11:00 - 12:30"),
    ("Experiencia al atardecer", "Visita en la franja mas fotogenica del dia, con paradas para disfrutar el ambiente.", "Slow Travel {city}", "slow@{city_slug}.local", "Atardecer"),
    ("Audioguia express", "Formato breve para entender lo esencial de {place} con autonomia.", "Audio Travel", "audio@travel.local", "Durante apertura"),
]


def slugify(text):
    replacements = str.maketrans(
        "áéíóúÁÉÍÓÚñÑüÜçÇàèìòùäëïöüâêîôûãõåø",
        "aeiouAEIOUnNuUcCaeiouaeiouaeiouaoao",
    )
    text = text.translate(replacements).lower()
    return "".join(ch if ch.isalnum() else "-" for ch in text).strip("-") or "actividad"


def build_activities(place, city_name):
    place_name = place.get("nombre", "este lugar")
    city_slug = slugify(city_name).replace("-", "")
    slug = slugify(place_name).replace("-", "")
    templates = TEMPLATES.get(place.get("tipo"), DEFAULT_TEMPLATES)
    activities = []
    for title, description, provider, contact, schedule in templates[:ACTIVITY_COUNT]:
        activities.append(
            {
                "titulo": title.format(place=place_name, city=city_name),
                "descripcion": description.format(place=place_name, city=city_name),
                "proveedor": provider.format(place=place_name, city=city_name, city_slug=city_slug, slug=slug),
                "contacto": contact.format(place=place_name, city=city_name, city_slug=city_slug, slug=slug),
                "horario": schedule.format(place=place_name, city=city_name),
            }
        )
    return activities


def update_places(places, city_name):
    added = 0
    for place in places:
        if not place.get("actividades"):
            place["actividades"] = build_activities(place, city_name)
            added += 1
    return added


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    cities_path = ROOT / "cities.json"
    cities = json.loads(cities_path.read_text(encoding="utf-8"))
    added_places = 0
    city_name_by_id = {}

    for city in cities:
        city_name = city.get("nombre", "la ciudad")
        city_name_by_id[city.get("id")] = city_name
        added_places += update_places(city.get("lugares", []), city_name)

    write_json(cities_path, cities)

    for path in sorted((ROOT / "data").glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, list):
            city_id = path.stem
            city_name = city_name_by_id.get(city_id, city_id.replace("-", " ").title())
            update_places(data, city_name)
        else:
            city_name = data.get("nombre") or city_name_by_id.get(data.get("id")) or path.stem.title()
            update_places(data.get("lugares", []), city_name)
        write_json(path, data)

    print(f"Actividades generadas en cities.json para {added_places} lugares.")


if __name__ == "__main__":
    main()
