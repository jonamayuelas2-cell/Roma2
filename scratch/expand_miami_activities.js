const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

const activitySets = {
  'Ocean Drive (South Beach)': [
    ['Tour fotografico de fachadas Art Deco', 'Sesión guiada para capturar fachadas pastel, neones y detalles arquitectónicos clásicos.', 'South Beach Photo Walks', 'info@southbeachphotowalks.com', 'https://www.miamiandbeaches.com/', '09:00 - 11:00', '25-45 €'],
    ['Ruta nocturna por neones', 'Paseo al caer la noche por hoteles históricos, luces de Ocean Drive y ambiente de South Beach.', 'Miami Design Preservation League', 'info@mdpl.org', 'https://mdpl.org/', '19:30 - 21:00', '20-35 €'],
    ['Clase de patinaje en el paseo', 'Actividad ligera junto al mar para recorrer el paseo con instructor y paradas panorámicas.', 'South Beach Skate Tours', 'hello@southbeachskatetours.com', 'https://www.miamiandbeaches.com/', '17:00 - 18:30', '30-55 €'],
    ['Brunch frente al mar', 'Experiencia gastronómica relajada en terraza con vistas a Ocean Drive y ambiente de fin de semana.', 'Ocean Drive Association', 'info@oceandrive.org', 'https://oceandrive.org/', '11:00 - 13:00', '35-75 €']
  ],
  'Wynwood Walls': [
    ['Taller de graffiti para principiantes', 'Sesión práctica para aprender técnicas básicas de spray y composición urbana.', 'Wynwood Art Walk', 'info@wynwoodartwalk.com', 'https://wynwoodartwalk.com/', '12:00 - 14:00', '45-80 €'],
    ['Ruta de galerías independientes', 'Recorrido por espacios de arte contemporáneo alrededor de Wynwood Walls.', 'Wynwood Business Improvement District', 'info@wynwoodmiami.com', 'https://wynwoodmiami.com/', '15:00 - 17:00', '20-40 €'],
    ['Tour fotografico de murales', 'Itinerario con los murales más fotogénicos y consejos para composición y luz.', 'Miami Photo Tours', 'info@miamiphototours.com', 'https://www.miamiandbeaches.com/', '09:30 - 11:30', '30-60 €'],
    ['Cata de cervezas artesanas', 'Parada en cervecerías locales del barrio para probar estilos de producción miamense.', 'Wynwood Brewing Company', 'info@wynwoodbrewing.com', 'https://wynwoodbrewing.com/', '18:00 - 20:00', '30-55 €'],
    ['Paseo nocturno de arte urbano', 'Recorrido al anochecer por murales iluminados, food trucks y ambiente creativo.', 'Wynwood Art Walk', 'info@wynwoodartwalk.com', 'https://wynwoodartwalk.com/', '20:00 - 22:00', '25-45 €']
  ],
  'Little Havana (Calle Ocho)': [
    ['Clase de salsa en Calle Ocho', 'Introducción divertida a pasos básicos de salsa y ritmos cubanos en el corazón del barrio.', 'Ball & Chain Miami', 'info@ballandchainmiami.com', 'https://ballandchainmiami.com/', '18:00 - 19:30', '20-45 €'],
    ['Visita a fabricas de puros', 'Demostración del torcido tradicional de puros y contexto cultural cubano.', 'Little Havana Cigar Factory', 'info@littlehavanacigarfactory.com', 'https://littlehavanacigarfactory.com/', '11:00 - 12:30', '15-35 €'],
    ['Ruta de cafe cubano', 'Degustación de cortadito, cafecito y dulces tradicionales en ventanitas locales.', 'Miami Culinary Tours', 'info@miamiculinarytours.com', 'https://www.miamiculinarytours.com/', '10:00 - 12:00', '35-65 €'],
    ['Paseo por Domino Park', 'Visita interpretativa al parque Máximo Gómez y su papel en la vida social del barrio.', 'Little Havana Tours', 'info@littlehavanatours.com', 'https://littlehavanatours.com/', '16:00 - 17:00', '10-25 €'],
    ['Noche de musica latina', 'Salida para escuchar música en directo y vivir el ambiente más animado de Calle Ocho.', 'Ball & Chain Miami', 'info@ballandchainmiami.com', 'https://ballandchainmiami.com/', '21:00 - 23:30', '20-60 €']
  ],
  'Everglades National Park': [
    ['Sendero Anhinga Trail', 'Caminata sencilla para observar aves, tortugas y caimanes desde pasarelas elevadas.', 'Everglades National Park', 'ever_information@nps.gov', 'https://www.nps.gov/ever/index.htm', '08:00 - 10:00', '5-20 €'],
    ['Ruta en kayak por manglares', 'Excursión guiada por canales tranquilos para ver fauna y vegetación de cerca.', 'Everglades Area Tours', 'info@evergladesareatours.com', 'https://evergladesareatours.com/', '09:00 - 12:00', '60-110 €'],
    ['Observacion de aves', 'Salida especializada para identificar garzas, ibis, águilas pescadoras y especies locales.', 'Tropical Audubon Society', 'info@tropicalaudubon.org', 'https://tropicalaudubon.org/', '07:30 - 10:30', '20-50 €'],
    ['Tour al atardecer', 'Recorrido vespertino para ver el cambio de luz sobre los humedales y la actividad de la fauna.', 'Everglades Safari Park', 'info@evergladessafaripark.com', 'https://www.evergladessafaripark.com/', '17:00 - 19:00', '45-85 €'],
    ['Centro Ernest F. Coe', 'Visita al centro de interpretación para entender ecosistemas, rutas y conservación del parque.', 'Everglades National Park', 'ever_information@nps.gov', 'https://www.nps.gov/ever/planyourvisit/coe-visitor-center.htm', '09:00 - 17:00', 'Gratis-15 €']
  ],
  'Vizcaya Museum & Gardens': [
    ['Recorrido por los jardines', 'Paseo guiado por terrazas, fuentes, esculturas y vistas a la bahía de Biscayne.', 'Vizcaya Museum & Gardens', 'info@vizcaya.org', 'https://vizcaya.org/', '10:30 - 12:00', '15-35 €'],
    ['Tour de arquitectura mediterranea', 'Lectura de la villa, sus patios, materiales y referencias italianas renacentistas.', 'Vizcaya Museum & Gardens', 'info@vizcaya.org', 'https://vizcaya.org/', '12:30 - 14:00', '20-45 €'],
    ['Sesion fotografica en exteriores', 'Ruta por rincones escénicos de jardines y balcones para fotografía de viaje.', 'Vizcaya Museum & Gardens', 'info@vizcaya.org', 'https://vizcaya.org/', '16:00 - 17:30', '25-60 €'],
    ['Visita a la coleccion de arte', 'Recorrido por mobiliario, pinturas y objetos decorativos de la colección histórica.', 'Vizcaya Museum & Gardens', 'info@vizcaya.org', 'https://vizcaya.org/', '11:00 - 12:30', '15-35 €'],
    ['Paseo por Coconut Grove cercano', 'Extensión tranquila para combinar la visita con calles arboladas y cafés del entorno.', 'Greater Miami Convention & Visitors Bureau', 'info@gmcvb.com', 'https://www.miamiandbeaches.com/', '17:00 - 18:30', 'Gratis-20 €']
  ],
  "Joe's Stone Crab": [
    ['Degustacion de stone crab', 'Menú centrado en el famoso cangrejo moro con salsas clásicas de la casa.', "Joe's Stone Crab", 'info@joesstonecrab.com', 'https://www.joesstonecrab.com/', '18:00 - 21:00', '80-160 €'],
    ['Almuerzo clasico de Miami Beach', 'Experiencia más informal para probar especialidades de la casa en horario de mediodía.', "Joe's Stone Crab", 'info@joesstonecrab.com', 'https://www.joesstonecrab.com/', '11:30 - 14:30', '45-90 €'],
    ['Ruta gastronomica por South of Fifth', 'Paseo por uno de los barrios culinarios más cuidados de Miami Beach.', 'Miami Culinary Tours', 'info@miamiculinarytours.com', 'https://www.miamiculinarytours.com/', '17:00 - 20:00', '65-120 €'],
    ['Maridaje de marisco y vino', 'Cena con selección de mariscos, vinos blancos y recomendaciones de temporada.', "Joe's Stone Crab", 'info@joesstonecrab.com', 'https://www.joesstonecrab.com/', '19:00 - 21:30', '100-190 €'],
    ['Postres historicos de la casa', 'Parada dulce para probar key lime pie y otros clásicos después del paseo por la zona.', "Joe's Stone Crab", 'info@joesstonecrab.com', 'https://www.joesstonecrab.com/', '15:00 - 17:00', '15-35 €']
  ],
  'Bayside Marketplace': [
    ['Paseo en barco por Millionaires Row', 'Crucero panorámico para ver mansiones, islas privadas y skyline de Miami.', 'Island Queen Cruises', 'info@islandqueencruises.com', 'https://islandqueencruises.com/', '11:00 - 18:00', '28-45 €'],
    ['Compras de marcas locales', 'Recorrido por tiendas, souvenirs y puestos con productos de inspiración miamense.', 'Bayside Marketplace', 'info@baysidemarketplace.com', 'https://www.baysidemarketplace.com/', '10:00 - 21:00', 'Gratis-80 €'],
    ['Cena con vistas al puerto', 'Reserva en terraza para cenar con vistas a la bahía y música ambiente.', 'Bayside Marketplace', 'info@baysidemarketplace.com', 'https://www.baysidemarketplace.com/', '19:00 - 21:30', '35-90 €'],
    ['Musica en vivo al aire libre', 'Plan nocturno con actuaciones en el escenario central del mercado.', 'Bayside Marketplace', 'info@baysidemarketplace.com', 'https://www.baysidemarketplace.com/', '18:00 - 22:00', 'Gratis-25 €'],
    ['Tour en bus turistico desde Bayside', 'Salida práctica para enlazar Downtown, Little Havana, Wynwood y Miami Beach.', 'Big Bus Tours Miami', 'info@bigbustours.com', 'https://www.bigbustours.com/en/miami/miami-bus-tours', '09:00 - 17:00', '45-70 €']
  ],
  'Coconut Grove': [
    ['Ruta por cafes y librerias', 'Paseo tranquilo por locales independientes, terrazas y rincones con ambiente bohemio.', 'Coconut Grove BID', 'info@coconutgrove.com', 'https://www.coconutgrove.com/', '10:00 - 12:00', '10-35 €'],
    ['Kayak por Biscayne Bay', 'Salida suave en kayak desde la zona para ver la bahía desde el agua.', 'Miami Watersports', 'info@miamiwatersports.com', 'https://www.miamiwatersports.com/', '09:00 - 11:00', '45-85 €'],
    ['Visita a The Barnacle Historic State Park', 'Recorrido por una de las casas históricas más antiguas de Miami y su jardín costero.', 'Florida State Parks', 'parks@floridadep.gov', 'https://www.floridastateparks.org/parks-and-trails/barnacle-historic-state-park', '09:00 - 17:00', '2-10 €'],
    ['Brunch bajo arboles tropicales', 'Plan de fin de semana en terraza con cocina local y ambiente relajado.', 'Coconut Grove BID', 'info@coconutgrove.com', 'https://www.coconutgrove.com/', '11:00 - 13:30', '25-60 €'],
    ['Paseo por el puerto deportivo', 'Caminata junto a veleros, parques y vistas abiertas a Biscayne Bay.', 'Coconut Grove BID', 'info@coconutgrove.com', 'https://www.coconutgrove.com/', '17:00 - 18:30', 'Gratis']
  ],
  'Design District': [
    ['Ruta de arte publico', 'Recorrido por instalaciones, esculturas y arquitectura contemporánea al aire libre.', 'Miami Design District', 'concierge@miamidesigndistrict.net', 'https://www.miamidesigndistrict.net/', '11:00 - 13:00', 'Gratis-25 €'],
    ['Tour de tiendas de diseño', 'Paseo por boutiques de moda, interiores y marcas internacionales con enfoque curatorial.', 'Miami Design District', 'concierge@miamidesigndistrict.net', 'https://www.miamidesigndistrict.net/', '12:00 - 14:00', 'Gratis-100 €'],
    ['Visita a galerias contemporaneas', 'Selección de galerías y espacios expositivos cercanos con obra actual.', 'Institute of Contemporary Art Miami', 'info@icamiami.org', 'https://icamiami.org/', '13:00 - 15:00', 'Gratis-25 €'],
    ['Cena de autor en el distrito', 'Experiencia gastronómica en restaurantes de cocina creativa del Design District.', 'Miami Design District', 'concierge@miamidesigndistrict.net', 'https://www.miamidesigndistrict.net/', '20:00 - 22:30', '70-160 €'],
    ['Fotografia de arquitectura moderna', 'Ruta para capturar fachadas, escaleras, pasajes y piezas urbanas del distrito.', 'Miami Design District', 'concierge@miamidesigndistrict.net', 'https://www.miamidesigndistrict.net/', '16:00 - 18:00', 'Gratis-35 €']
  ]
};

for (const place of miami.lugares) {
  const additions = activitySets[place.nombre] || [];
  place.actividades = place.actividades || [];
  for (const activity of additions) {
    if (place.actividades.length >= 6) break;
    const [titulo, descripcion, proveedor, contacto, web, horario, costeEstimado] = activity;
    if (place.actividades.some((existing) => existing.titulo === titulo)) continue;
    place.actividades.push({
      titulo,
      descripcion,
      proveedor,
      contacto,
      web,
      horario,
      costeEstimado,
      imagen: place.imagenCard || place.imagen
    });
  }
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');

for (const place of miami.lugares) {
  console.log(`${place.nombre}: ${place.actividades.length}`);
}
