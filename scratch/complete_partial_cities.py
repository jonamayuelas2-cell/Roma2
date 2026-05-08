import copy
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
CENTRAL_PATH = ROOT / "cities.json"


CITY_META = {
    "lisboa": {
        "id": "lisboa",
        "nombre": "Lisboa",
        "pais": "Portugal",
        "continente": "Europa",
        "emoji": "🇵🇹",
        "lat": 38.7223,
        "lng": -9.1393,
        "imagen": "img/lisbon_hero.png",
        "theme": {"primary": "#0f766e", "secondary": "#f59e0b", "font": "'Inter', sans-serif"},
    },
    "praga": {
        "id": "praga",
        "nombre": "Praga",
        "pais": "Republica Checa",
        "continente": "Europa",
        "emoji": "🇨🇿",
        "lat": 50.0755,
        "lng": 14.4378,
        "imagen": "img/prague_hero.png",
        "theme": {"primary": "#7f1d1d", "secondary": "#d97706", "font": "'Playfair Display', serif"},
    },
    "venecia": {
        "id": "venecia",
        "nombre": "Venecia",
        "pais": "Italia",
        "continente": "Europa",
        "emoji": "🇮🇹",
        "lat": 45.4408,
        "lng": 12.3155,
        "imagen": "img/venice_hero.png",
        "theme": {"primary": "#0e7490", "secondary": "#b45309", "font": "'Cardo', serif"},
    },
    "viena": {
        "id": "viena",
        "nombre": "Viena",
        "pais": "Austria",
        "continente": "Europa",
        "emoji": "🇦🇹",
        "lat": 48.2082,
        "lng": 16.3738,
        "imagen": "img/vienna_hero.png",
        "theme": {"primary": "#7c2d12", "secondary": "#be123c", "font": "'Cinzel', serif"},
    },
}


NEW_PLACES = {
    "lisboa": [
        ("Monasterio de los Jeronimos", "cultura", "Obra maestra manuelina ligada a la era de los descubrimientos, con claustros de piedra tallada y memoria marinera.", "El gran templo manuelino de Belem.", 38.6979, -9.2067, "10:00 - 17:30", "10 EUR", 4.8, "lisbon_jeronimos", ["manuelino", "patrimonio", "belem"]),
        ("Mirador de Santa Luzia", "vistas", "Terrazas de azulejo y buganvillas abiertas sobre Alfama, el Tajo y los tejados rojizos de la ciudad.", "Postal luminosa sobre Alfama.", 38.7117, -9.1302, "24h", "Gratis", 4.7, "lisbon_santaluzia", ["mirador", "azulejos", "alfama"]),
        ("Elevador de Santa Justa", "cultura", "Ascensor neogotico de hierro que conecta la Baixa con el Chiado y regala una vista vertical del centro.", "Hierro historico sobre la Baixa.", 38.7121, -9.1395, "7:00 - 22:00", "Desde 5 EUR", 4.4, "lisbon_santajusta", ["mirador", "hierro", "baixa"]),
        ("LX Factory", "barrios", "Antiguo complejo industrial convertido en distrito creativo con librerias, talleres, murales y terrazas.", "La Lisboa creativa bajo el puente.", 38.7033, -9.1786, "10:00 - 22:00", "Gratis", 4.6, "lisbon_lxfactory", ["arte urbano", "diseno", "gastronomia"]),
        ("Mercado da Ribeira", "mercados", "Mercado historico y food hall donde conviven producto fresco, cocina portuguesa y mesas compartidas.", "Sabores de Lisboa en una nave viva.", 38.7066, -9.1459, "10:00 - 00:00", "Segun consumo", 4.5, "lisbon_ribeira", ["mercado", "gastronomia", "local"]),
        ("Museo Nacional del Azulejo", "museos", "Coleccion dedicada al azulejo portugues dentro de un antiguo convento, con paneles que explican siglos de color y oficio.", "La historia portuguesa en ceramica.", 38.7241, -9.1139, "10:00 - 18:00", "8 EUR", 4.7, "lisbon_azulejo", ["museo", "azulejos", "arte"]),
        ("Parque Eduardo VII", "parques", "Gran eje verde con jardines geometricos, invernadero y una panoramica abierta hacia la Baixa y el Tajo.", "El mirador verde de la ciudad.", 38.7289, -9.1526, "24h", "Gratis", 4.6, "lisbon_eduardovii", ["parque", "jardin", "vistas"]),
    ],
    "praga": [
        ("Plaza de la Ciudad Vieja", "cultura", "La plaza concentra fachadas goticas, barrocas y medievales alrededor del reloj astronomico y la iglesia de Tyn.", "El escenario historico de Praga.", 50.0870, 14.4213, "24h", "Gratis", 4.9, "prague_oldtownsquare", ["plaza", "reloj", "historia"]),
        ("Reloj Astronomico", "cultura", "Mecanismo medieval que marca horas, signos y procesion de figuras en la fachada del Ayuntamiento Viejo.", "La maquinaria poetica del centro.", 50.0870, 14.4208, "9:00 - 21:00", "Desde 10 EUR", 4.7, "prague_astronomicalclock", ["reloj", "medieval", "ayuntamiento"]),
        ("Catedral de San Vito", "cultura", "Gran catedral gotica dentro del recinto del castillo, con vidrieras, capillas reales y torres dominantes.", "La catedral gotica de Bohemia.", 50.0909, 14.4006, "9:00 - 17:00", "Incluida en circuito", 4.8, "prague_stvitus", ["gotico", "catedral", "castillo"]),
        ("Mala Strana", "barrios", "Barrio de palacios, jardines y calles empedradas bajo el castillo, con una atmosfera pausada y elegante.", "El barrio barroco bajo el castillo.", 50.0886, 14.4048, "24h", "Gratis", 4.8, "prague_malastrana", ["barrio", "barroco", "palacios"]),
        ("Barrio Judio Josefov", "cultura", "Sinagogas, cementerio antiguo y memoria comunitaria condensan una parte esencial de la historia europea.", "Memoria judia en el centro historico.", 50.0906, 14.4195, "9:00 - 18:00", "Desde 15 EUR", 4.7, "prague_josefov", ["memoria", "sinagogas", "historia"]),
        ("Casa Danzante", "vistas", "Edificio contemporaneo de Gehry y Milunic que rompe la linea del Moldava con una silueta dinamica.", "Arquitectura en movimiento junto al rio.", 50.0755, 14.4142, "10:00 - 22:00", "Mirador segun consumo", 4.4, "prague_dancinghouse", ["arquitectura", "rio", "moderno"]),
        ("Parque Letna", "parques", "Colina verde con cerveceria, senderos y una de las mejores vistas de los puentes sobre el Moldava.", "La postal panoramica de los puentes.", 50.0962, 14.4178, "24h", "Gratis", 4.7, "prague_letna", ["parque", "mirador", "rio"]),
    ],
    "venecia": [
        ("Basilica de San Marcos", "cultura", "Templo de mosaicos dorados, marmoles orientales y cupulas bizantinas que resume el poder mercantil veneciano.", "Oro bizantino frente a la plaza.", 45.4346, 12.3397, "9:30 - 17:15", "Desde 3 EUR", 4.8, "venice_basilica", ["mosaicos", "bizantino", "san marcos"]),
        ("Palacio Ducal", "cultura", "Sede del gobierno veneciano, con salones monumentales, patios goticos y el paso hacia el Puente de los Suspiros.", "El poder de la Serenissima.", 45.4337, 12.3404, "9:00 - 18:00", "30 EUR", 4.8, "venice_dogespalace", ["palacio", "gotico", "historia"]),
        ("Gran Canal", "vistas", "La avenida acuatica de Venecia serpentea entre palacios, vaporetos y reflejos que cambian a cada hora.", "La gran avenida de agua.", 45.4375, 12.3326, "24h", "Vaporetto desde 9.50 EUR", 4.9, "venice_grandcanal", ["canal", "palacios", "vistas"]),
        ("Gallerie dell'Accademia", "museos", "Museo clave para leer la pintura veneciana, de Bellini a Tintoretto, en antiguas salas religiosas.", "La gran pinacoteca veneciana.", 45.4310, 12.3285, "8:15 - 19:15", "12 EUR", 4.7, "venice_accademia", ["museo", "pintura", "renacimiento"]),
        ("Dorsoduro", "barrios", "Barrio universitario y artistico con canales tranquilos, talleres, bares y una escala mas local.", "El lado creativo y sereno.", 45.4300, 12.3267, "24h", "Gratis", 4.7, "venice_dorsoduro", ["barrio", "arte", "canales"]),
        ("Mercado de Rialto", "mercados", "Puestos de pescado, frutas y verduras junto al Gran Canal, con el pulso cotidiano de la cocina veneciana.", "El mercado historico del canal.", 45.4395, 12.3338, "7:30 - 13:00", "Gratis", 4.6, "venice_rialtomarket", ["mercado", "pescado", "gastronomia"]),
        ("Isla de Burano", "barrios", "Casas de colores vivos, canales pequenos y tradicion de encaje convierten la isla en una excursion luminosa.", "Color y encaje en la laguna.", 45.4855, 12.4169, "24h", "Vaporetto", 4.8, "venice_burano", ["isla", "color", "canales"]),
    ],
    "viena": [
        ("Palacio Belvedere", "museos", "Conjunto barroco con jardines escalonados y una coleccion esencial donde brilla Klimt.", "Barroco, jardines y Klimt.", 48.1912, 16.3808, "9:00 - 18:00", "Desde 17 EUR", 4.7, "vienna_belvedere", ["museo", "klimt", "barroco"]),
        ("Opera Estatal de Viena", "cultura", "Teatro lirico de referencia mundial, con programacion intensa y una arquitectura historica en el Ring.", "El gran templo musical vienes.", 48.2028, 16.3692, "Segun funcion", "Visitas desde 13 EUR", 4.8, "vienna_stateopera", ["opera", "musica", "ring"]),
        ("Hofburg", "cultura", "Complejo imperial de los Habsburgo con patios, museos, salones y memoria politica en pleno centro.", "El palacio imperial del centro.", 48.2065, 16.3656, "9:00 - 17:30", "Desde 17 EUR", 4.7, "vienna_hofburg", ["imperio", "palacio", "habsburgo"]),
        ("MuseumsQuartier", "museos", "Distrito cultural con museos, patios publicos y vida urbana entre arquitectura historica y contemporanea.", "El barrio cultural de Viena.", 48.2033, 16.3597, "10:00 - 18:00", "Segun museo", 4.6, "vienna_museumsquartier", ["museos", "arte", "patios"]),
        ("Naschmarkt", "mercados", "Mercado de sabores internacionales, puestos tradicionales y terrazas animadas junto al Wienzeile.", "El mercado mas sabroso de Viena.", 48.1980, 16.3647, "6:00 - 21:00", "Segun consumo", 4.6, "vienna_naschmarkt", ["mercado", "gastronomia", "local"]),
        ("Prater", "parques", "Parque popular con la noria historica, avenidas largas y ambiente de feria clasica.", "La noria iconica y el gran parque.", 48.2167, 16.3972, "24h", "Parque gratis", 4.6, "vienna_prater", ["parque", "noria", "familias"]),
        ("Cafe Central", "cafes", "Cafe historico de columnas, periodicos, tartas y memoria intelectual de la Viena finisecular.", "El cafe literario por excelencia.", 48.2101, 16.3657, "8:00 - 22:00", "Segun consumo", 4.5, "vienna_cafecentral", ["cafe", "historia", "tartas"]),
    ],
}


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def activity_templates(city_name, place_name, place_type):
    base = [
        ("Visita guiada esencial", f"Recorrido interpretado por {place_name} para entender su contexto dentro de {city_name}.", f"Guias Locales {city_name}", f"hola@{city_name.lower().replace(' ', '')}.local", "10:00 - 12:00"),
        ("Paseo fotografico", f"Itinerario para capturar perspectivas, detalles y luz adecuada en {place_name}.", f"Photo Walk {city_name}", f"foto@{city_name.lower().replace(' ', '')}walk.local", "Atardecer"),
        ("Tour privado a medida", "Experiencia flexible con guia local segun intereses, ritmo y tiempo disponible.", f"Travel Designers {city_name}", f"plan@{city_name.lower().replace(' ', '')}travel.local", "Bajo reserva"),
        ("Ruta familiar", "Version didactica y ligera para visitar sin saturar a los mas pequenos.", "Familias Viajeras", "familias@viaje.local", "11:00 - 12:30"),
        ("Experiencia al atardecer", "Visita en la franja mas fotogenica del dia, con paradas para disfrutar el ambiente.", f"Slow Travel {city_name}", f"slow@{city_name.lower().replace(' ', '')}.local", "Atardecer"),
        ("Audioguia express", f"Formato breve para entender lo esencial de {place_name} con autonomia.", "Audio Travel", "audio@travel.local", "Durante apertura"),
    ]
    if place_type == "museos":
        base[0] = ("Visita guiada a la coleccion", f"Recorrido para entender las piezas clave de {place_name} y su papel cultural en {city_name}.", f"{place_name} Educacion", f"educacion@{city_name.lower().replace(' ', '')}.local", "10:00 - 12:00")
    elif place_type == "mercados":
        base[0] = ("Ruta de sabores", f"Paradas escogidas para probar producto local y entender el pulso gastronomico de {place_name}.", f"Sabores de {city_name}", f"sabores@{city_name.lower().replace(' ', '')}.local", "12:00 - 14:00")
    elif place_type in {"barrios", "parques"}:
        base[0] = ("Paseo de barrio" if place_type == "barrios" else "Paseo verde", f"Ruta a pie por rincones, miradores y escenas cotidianas de {place_name}.", f"Walks {city_name}", f"walks@{city_name.lower().replace(' ', '')}.local", "10:30 - 12:30")
    return [{"titulo": a, "descripcion": b, "proveedor": c, "contacto": d, "horario": e} for a, b, c, d, e in base]


def normalize_places(city_id, existing_places):
    city_name = CITY_META[city_id]["nombre"]
    places = copy.deepcopy(existing_places)
    next_id = len(places) + 1
    for name, kind, desc, short, lat, lng, hours, price, rating, image_slug, tags in NEW_PLACES[city_id]:
        places.append({
            "id": next_id,
            "nombre": name,
            "tipo": kind,
            "descripcion": desc,
            "descripcionCorta": short,
            "lat": lat,
            "lng": lng,
            "horario": hours,
            "precio": price,
            "rating": rating,
            "imagen": f"img/{image_slug}.png",
            "imagenCard": f"img/{image_slug}.png",
            "tags": tags,
            "actividades": activity_templates(city_name, name, kind),
        })
        next_id += 1
    return places


def main():
    completed = []
    for city_id, meta in CITY_META.items():
        raw = load_json(DATA_DIR / f"{city_id}.json")
        places = normalize_places(city_id, raw if isinstance(raw, list) else raw["lugares"])
        city = copy.deepcopy(meta)
        city["lugares"] = places
        (DATA_DIR / f"{city_id}.json").write_text(
            json.dumps(city, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        completed.append(city)

    central = load_json(CENTRAL_PATH)
    by_id = {city["id"]: city for city in central}
    for city in completed:
        by_id[city["id"]] = city

    ordered_ids = [city["id"] for city in central] + [city["id"] for city in completed if city["id"] not in {c["id"] for c in central}]
    rebuilt = [by_id[city_id] for city_id in ordered_ids]
    CENTRAL_PATH.write_text(json.dumps(rebuilt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Completadas {len(completed)} ciudades; central contiene {len(rebuilt)} ciudades.")


if __name__ == "__main__":
    main()
