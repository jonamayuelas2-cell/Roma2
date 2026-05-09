import json

ship_photos = {
    "Celestyal Crystal": "https://commons.wikimedia.org/wiki/Special:FilePath/Celestyal_Crystal_at_Kusadasi.jpg",
    "Star Flyer": "https://commons.wikimedia.org/wiki/Special:FilePath/Star_Flyer_cruiseship.jpg",
    "Costa Deliziosa": "https://commons.wikimedia.org/wiki/Special:FilePath/Costa_Deliziosa_-_Venice_2012.jpg",
    "Disney Dream": "https://commons.wikimedia.org/wiki/Special:FilePath/Disney_Dream_Port_Canaveral_1.jpg",
    "Celebrity Edge": "https://commons.wikimedia.org/wiki/Special:FilePath/Celebrity_Edge_in_Southampton.jpg",
    "Resilient Lady": "https://commons.wikimedia.org/wiki/Special:FilePath/Resilient_Lady_in_Piraeus.jpg",
    "Viking Jupiter": "https://commons.wikimedia.org/wiki/Special:FilePath/Viking_Jupiter_in_Split,_2019.jpg",
    "Seven Seas Explorer": "https://commons.wikimedia.org/wiki/Special:FilePath/Seven_Seas_Explorer_in_Tallinn_2017.jpg",
    "Scenic Eclipse": "https://commons.wikimedia.org/wiki/Special:FilePath/Scenic_Eclipse_in_Antarctica.jpg",
    "Hanseatic Nature": "https://commons.wikimedia.org/wiki/Special:FilePath/Hanseatic_Nature_in_Hamburg.jpg",
    "Ovation of the Seas": "https://commons.wikimedia.org/wiki/Special:FilePath/Ovation_of_the_Seas_in_Sydney_Harbour_Dec_2016.jpg",
    "Diamond Princess": "https://commons.wikimedia.org/wiki/Special:FilePath/Diamond_Princess_ship_2004.jpg",
    "Genting Dream": "https://commons.wikimedia.org/wiki/Special:FilePath/Genting_Dream_ship_2016.jpg",
    "Noordam": "https://commons.wikimedia.org/wiki/Special:FilePath/MS_Noordam_in_Venice.jpg",
    "Paul Gauguin": "https://commons.wikimedia.org/wiki/Special:FilePath/MS_Paul_Gauguin_in_Moorea.jpg",
    "Aranui 5": "https://commons.wikimedia.org/wiki/Special:FilePath/Aranui_5_in_Papeete.jpg",
    "Silver Shadow": "https://commons.wikimedia.org/wiki/Special:FilePath/Silver_Shadow_in_Copenhagen.jpg",
    "Celebrity Solstice": "https://commons.wikimedia.org/wiki/Special:FilePath/Celebrity_Solstice_in_Sydney_2014.jpg",
    "Radiance of the Seas": "https://commons.wikimedia.org/wiki/Special:FilePath/Radiance_of_the_Seas_in_Juneau.jpg",
    "Coral Discoverer": "https://commons.wikimedia.org/wiki/Special:FilePath/Coral_Discoverer_in_Darwin.jpg",
    "MSC World Europa": "https://commons.wikimedia.org/wiki/Special:FilePath/MSC_World_Europa_(ship,_2022).jpg",
    "Norwegian Epic": "https://commons.wikimedia.org/wiki/Special:FilePath/Norwegian_Epic_in_Cannes.jpg",
    "Costa Toscana": "https://commons.wikimedia.org/wiki/Special:FilePath/Costa_Toscana_in_Savona.jpg",
    "Odyssey of the Seas": "https://commons.wikimedia.org/wiki/Special:FilePath/Odyssey_of_the_Seas_in_Civitavecchia.jpg",
    "Norwegian Prima": "https://commons.wikimedia.org/wiki/Special:FilePath/Norwegian_Prima_in_Amsterdam_2022.jpg",
    "Harmony of the Seas": "https://commons.wikimedia.org/wiki/Special:FilePath/Harmony_of_the_Seas_in_Southampton.jpg"
}

with open('cruises.json', 'r', encoding='utf-8') as f:
    cruises = json.load(f)

for cruise in cruises:
    buque = cruise.get('buque', {})
    ship_name = buque.get('nombre')
    
    # 1. Normalizar fotoBarco en la raíz del objeto buque
    if ship_name in ship_photos:
        buque['fotoBarco'] = ship_photos[ship_name]
    
    # 2. Si buque.datos existe, asegurar que también lo tenga ahí por consistencia legacy
    if 'datos' in buque:
        if ship_name in ship_photos:
            buque['datos']['fotoBarco'] = ship_photos[ship_name]
            
    # 3. Eliminar campos redundantes si los hay
    # (Mantendremos 'imagen' como fallback de Unsplash por si acaso, pero priorizaremos fotoBarco)

with open('cruises.json', 'w', encoding='utf-8') as f:
    json.dump(cruises, f, indent=2, ensure_ascii=False)
