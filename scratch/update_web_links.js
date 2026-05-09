const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const placeWebs = {
  'Coliseo Romano': 'https://colosseo.it',
  'Foro Romano': 'https://colosseo.it',
  'Fontana di Trevi': 'https://www.turismoroma.it/en/places/trevi-fountain',
  'Panteón de Agripa': 'https://www.pantheonroma.com',
  'Museos Vaticanos': 'https://www.museivaticani.va',
  'Trastevere': 'https://www.turismoroma.it/en/places/trastevere',
  'Villa Borghese': 'https://www.sovrintendenzaroma.it/i_luoghi/ville_e_parchi_storici/ville_dei_nobili/villa_borghese',
  "Campo de' Fiori": 'https://www.turismoroma.it/en/places/campo-de-fiori',
  'Salumeria Roscioli': 'https://www.salumeriaroscioli.com',
  'Torre Eiffel': 'https://www.toureiffel.paris',
  'Museo del Louvre': 'https://www.louvre.fr',
  'Catedral de Notre-Dame': 'https://www.notredamedeparis.fr',
  'Montmartre': 'https://www.paris.fr/lieux/montmartre-1818',
  'Museo de Orsay': 'https://www.musee-orsay.fr',
  'Jardines de Luxemburgo': 'https://www.senat.fr/visite/jardin',
  'Le Marais': 'https://www.parisjetaime.com/eng/discovering-paris/the-marais-pc9',
  'Marché des Enfants Rouges': 'https://www.paris.fr/lieux/marche-des-enfants-rouges-5461',
  'Bistrot Paul Bert': 'https://www.bistrotpaulbert.fr',
  'Big Ben y Westminster': 'https://www.parliament.uk/visiting/visiting-and-tours/big-ben-tour',
  'British Museum': 'https://www.britishmuseum.org',
  'London Eye': 'https://www.londoneye.com',
  'Camden Market': 'https://www.camdenmarket.com',
  'Hyde Park': 'https://www.royalparks.org.uk/visit/parks/hyde-park',
  'Tower Bridge': 'https://www.towerbridge.org.uk',
  'Buckingham Palace': 'https://www.rct.uk/visit/buckingham-palace',
  'The Shard': 'https://www.the-shard.com',
  'Covent Garden': 'https://www.coventgarden.london',
  'Pirámides de Giza': 'https://egymonuments.gov.eg/archaeological-sites/giza-plateau',
  'Gran Museo Egipcio (GEM)': 'https://grandegyptianmuseum.org',
  'Museo Egipcio de Tahrir': 'https://egyptianmuseumcairo.eg',
  'Ciudadela de Saladino': 'https://egymonuments.gov.eg/archaeological-sites/salah-el-din-citadel',
  'Khan el-Khalili': 'https://egymonuments.gov.eg/archaeological-sites/khan-el-khalili',
  'Barrio Copto': 'https://egymonuments.gov.eg/archaeological-sites/coptic-cairo',
  'Parque Al-Azhar': 'https://www.azharpark.com',
  'Mezquita de Ibn Tulun': 'https://egymonuments.gov.eg/monuments/mosque-of-ibn-tulun',
  'Naguib Mahfouz Cafe': 'https://www.naguibmahfouzcafe.com',
  'Table Mountain': 'https://www.tablemountain.net',
  'V&A Waterfront': 'https://www.waterfront.co.za',
  'Robben Island': 'https://www.robben-island.org.za',
  'Bo-Kaap': 'https://www.capetown.travel/bo-kaap',
  'Kirstenbosch': 'https://www.sanbi.org/gardens/kirstenbosch',
  'Camps Bay': 'https://www.capetown.travel/camps-bay',
  'District Six Museum': 'https://www.districtsix.co.za',
  'Old Biscuit Mill': 'https://theoldbiscuitmill.co.za',
  'Boulders Beach': 'https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/boulders-penguin-colony',
  'Cruce de Shibuya': 'https://www.gotokyo.org/en/spot/52/index.html',
  'Templo Senso-ji': 'https://www.senso-ji.jp',
  'Santuario Meiji Jingu': 'https://www.meijijingu.or.jp/en',
  'TeamLab Planets': 'https://www.teamlab.art/e/planets',
  'Mercado de Tsukiji': 'https://www.tsukiji.or.jp/english',
  'Akihabara Electric Town': 'https://www.gotokyo.org/en/destinations/central-tokyo/akihabara/index.html',
  'Parque Ueno': 'https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/en_index.html',
  'Tokyo Skytree': 'https://www.tokyo-skytree.jp/en',
  'Shinjuku Golden Gai': 'https://www.gotokyo.org/en/spot/463/index.html',
  'Gran Palacio': 'https://www.royalgrandpalace.th/en/home',
  'Wat Pho': 'https://www.watpho.com/en',
  'Wat Arun': 'https://www.watarun1.com/en',
  'Chatuchak Market': 'https://www.chatuchakmarket.org',
  'Jim Thompson House': 'https://jimthompsonhouse.org',
  'Chinatown Yaowarat': 'https://www.tourismthailand.org/Attraction/yaowarat-road',
  'Lumphini Park': 'https://www.bangkok.go.th/publicpark',
  'Khlong Lat Mayom': 'https://www.tourismthailand.org/Attraction/khlong-lat-mayom-floating-market',
  'Jay Fai': 'https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/jay-fai',
  'Estatua de la Libertad': 'https://www.nps.gov/stli/index.htm',
  'Central Park': 'https://www.centralparknyc.org',
  'Metropolitan Museum of Art': 'https://www.metmuseum.org',
  'Times Square': 'https://www.timessquarenyc.org',
  'High Line': 'https://www.thehighline.org',
  'Brooklyn Bridge': 'https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml',
  'Chelsea Market': 'https://www.chelseamarket.com',
  'SoHo': 'https://www.nycgo.com/boroughs-neighborhoods/manhattan/soho',
  'Katz Delicatessen': 'https://katzsdelicatessen.com',
  'Zócalo': 'https://mexicocity.cdmx.gob.mx/venues/zocalo',
  'Museo Nacional de Antropología': 'https://www.mna.inah.gob.mx',
  'Chapultepec': 'https://chapultepec.org.mx',
  'Casa Azul': 'https://www.museofridakahlo.org.mx',
  'Xochimilco': 'https://mexicocity.cdmx.gob.mx/venues/xochimilco',
  'Templo Mayor': 'https://www.templomayor.inah.gob.mx',
  'Roma-Condesa': 'https://mexicocity.cdmx.gob.mx/neighborhoods/roma-condesa',
  'Mercado de Coyoacán': 'https://mexicocity.cdmx.gob.mx/venues/mercado-de-coyoacan',
  'Pujol': 'https://pujol.com.mx',
  'Cristo Redentor': 'https://santuariocristoredentor.com.br',
  'Pan de Azúcar': 'https://bondinho.com.br',
  'Copacabana': 'https://riotur.rio/en/que_fazer/copacabana-beach',
  'Ipanema': 'https://riotur.rio/en/que_fazer/ipanema-beach',
  'Escalera Selaron': 'https://riotur.rio/en/que_fazer/selaron-steps',
  'Jardín Botánico': 'https://jbrj.gov.br',
  'Museu do Amanhã': 'https://museudoamanha.org.br',
  'Feira de Sao Cristovao': 'https://www.feiradesaocristovao.org.br',
  'Confeitaria Colombo': 'https://www.confeitariacolombo.com.br',
  'Plaza Mayor': 'https://www.munlima.gob.pe',
  'Huaca Pucllana': 'https://huacapucllanamiraflores.pe',
  'Museo Larco': 'https://www.museolarco.org',
  'Malecón de Miraflores': 'https://www.miraflores.gob.pe',
  'Barranco': 'https://munibarranco.gob.pe',
  'Mercado Surquillo': 'https://www.miraflores.gob.pe',
  'Circuito Mágico del Agua': 'https://www.circuitomagicodelagua.com.pe',
  'MALI': 'https://mali.pe',
  'Central': 'https://centralrestaurante.com.pe',
  'Opera House': 'https://www.sydneyoperahouse.com',
  'Harbour Bridge': 'https://www.bridgeclimb.com',
  'Bondi Beach': 'https://www.sydney.com/destinations/sydney/sydney-east/bondi/attractions/bondi-beach',
  'The Rocks': 'https://www.therocks.com',
  'Royal Botanic Garden': 'https://www.botanicgardens.org.au/royal-botanic-garden-sydney',
  'Art Gallery of NSW': 'https://www.artgallery.nsw.gov.au',
  'Darling Harbour': 'https://www.darlingharbour.com',
  'Sydney Fish Market': 'https://www.sydneyfishmarket.com.au',
  'Manly Ferry': 'https://transportnsw.info/routes/details/sydney-ferries/f1/090F1',
  'Museo del Prado': 'https://www.museodelprado.es',
  'Parque del Retiro': 'https://www.esmadrid.com/informacion-turistica/parque-del-retiro',
  'Palacio Real': 'https://www.patrimonionacional.es/visita/palacio-real-de-madrid',
  'Templo de Debod': 'https://www.madrid.es/templodebod',
  'Gran Via': 'https://www.esmadrid.com/informacion-turistica/gran-via',
  'Mercado de San Miguel': 'https://mercadodesanmiguel.es',
  'Puerta del Sol': 'https://www.esmadrid.com/informacion-turistica/puerta-del-sol',
  'Chocolateria San Gines': 'https://chocolateriasangines.com',
  'Sky Tower': 'https://skycityauckland.co.nz/sky-tower',
  'Auckland War Memorial Museum': 'https://www.aucklandmuseum.com',
  'Waiheke Island': 'https://www.aucklandnz.com/visit/destinations/islands/waiheke-island',
  'Mount Eden': 'https://www.aucklandcouncil.govt.nz/parks-recreation/Pages/park-details.aspx?Location=214',
  'Viaduct Harbour': 'https://www.viaduct.co.nz',
  'Auckland Art Gallery': 'https://www.aucklandartgallery.com',
  'Ponsonby': 'https://www.iloveponsonby.co.nz',
  'Britomart': 'https://britomart.org',
  'One Tree Hill': 'https://www.aucklandcouncil.govt.nz/parks-recreation/Pages/park-details.aspx?Location=219',
  'Sagrada Familia': 'https://sagradafamilia.org',
  'Park Guell': 'https://parkguell.barcelona',
  'Barrio Gotico': 'https://www.barcelonaturisme.com/wv3/en/page/380/the-gothic-quarter.html',
  'Casa Batllo': 'https://www.casabatllo.es',
  'La Rambla': 'https://www.barcelonaturisme.com/wv3/en/page/163/la-rambla.html',
  'Mercado de la Boqueria': 'https://www.boqueria.barcelona',
  'Montjuic': 'https://www.barcelonaturisme.com/wv3/en/page/397/montjuic.html',
  'Barceloneta': 'https://www.barcelonaturisme.com/wv3/en/page/161/la-barceloneta.html',
  'Palau de la Musica Catalana': 'https://www.palaumusica.cat',
  'Teatro Colon': 'https://teatrocolon.org.ar',
  'Caminito': 'https://turismo.buenosaires.gob.ar/en/atractivo/caminito',
  'Recoleta': 'https://turismo.buenosaires.gob.ar/en/atractivo/recoleta',
  'Avenida 9 de Julio': 'https://turismo.buenosaires.gob.ar/en/atractivo/avenida-9-de-julio',
  'Puerto Madero': 'https://turismo.buenosaires.gob.ar/en/atractivo/puerto-madero',
  'El Ateneo Grand Splendid': 'https://www.yenny-elateneo.com',
  'San Telmo': 'https://turismo.buenosaires.gob.ar/en/atractivo/san-telmo',
  'Palermo': 'https://turismo.buenosaires.gob.ar/en/atractivo/palermo',
  'Floralis Generica': 'https://turismo.buenosaires.gob.ar/en/atractivo/floralis-generica',
  'Santa Sofia': 'https://muze.gen.tr/muze-detay/ayasofya',
  'Mezquita Azul': 'https://www.sultanahmetcamii.org',
  'Palacio Topkapi': 'https://www.millisaraylar.gov.tr/en/palaces/topkapi-palace',
  'Gran Bazar': 'https://www.kapalicarsi.com.tr',
  'Bazar de las Especias': 'https://www.misircarsisi.org',
  'Torre de Galata': 'https://muze.gen.tr/muze-detay/galatakulesi',
  'Crucero por el Bosforo': 'https://www.sehirhatlari.istanbul/en',
  'Cisterna Basilica': 'https://www.yerebatan.com',
  'Palacio Dolmabahce': 'https://www.millisaraylar.gov.tr/en/palaces/dolmabahce-palace',
  'Casa de Ana Frank': 'https://www.annefrank.org',
  'Rijksmuseum': 'https://www.rijksmuseum.nl',
  'Museo Van Gogh': 'https://www.vangoghmuseum.nl',
  'Vondelpark': 'https://www.iamsterdam.com/en/whats-on/calendar/nature-and-active/parks-and-beaches/vondelpark',
  'Canales de Amsterdam': 'https://www.iamsterdam.com/en/see-and-do/things-to-do/canals',
  'Jordaan': 'https://www.iamsterdam.com/en/explore/neighbourhoods/jordaan',
  'Mercado Albert Cuyp': 'https://albertcuyp-markt.amsterdam',
  'Bloemenmarkt': 'https://www.iamsterdam.com/en/see-and-do/shopping/markets/bloemenmarkt',
  'NDSM Werf': 'https://www.ndsm.nl',
  'Acropolis': 'https://etickets.tap.gr/webengines/tap_b2c/english/tap.exe?PM=P1N',
  'Partenon': 'https://odysseus.culture.gr/h/3/eh351.jsp?obj_id=2384',
  'Plaka': 'https://www.thisisathens.org/neighbourhoods/plaka',
  'Museo de la Acropolis': 'https://www.theacropolismuseum.gr',
  'Agora Antigua': 'https://odysseus.culture.gr/h/3/eh351.jsp?obj_id=2485',
  'Monte Licabeto': 'https://www.thisisathens.org/explore/venues/lycabettus-hill',
  'Monastiraki': 'https://www.thisisathens.org/neighbourhoods/monastiraki',
  'Estadio Panatenaico': 'https://www.panathenaicstadium.gr',
  'Anafiotika': 'https://www.thisisathens.org/neighbourhoods/anafiotika',
  'Puerta de Brandeburgo': 'https://www.visitberlin.de/en/brandenburg-gate',
  'East Side Gallery': 'https://www.visitberlin.de/en/east-side-gallery',
  'Isla de los Museos': 'https://www.museumsinsel-berlin.de/en',
  'Reichstag': 'https://www.bundestag.de/en/visittheBundestag',
  'Checkpoint Charlie': 'https://www.visitberlin.de/en/checkpoint-charlie',
  'Tiergarten': 'https://www.visitberlin.de/en/tiergarten',
  'Alexanderplatz': 'https://www.visitberlin.de/en/alexanderplatz',
  'Memorial del Holocausto': 'https://www.stiftung-denkmal.de/en/memorials/memorial-to-the-murdered-jews-of-europe',
  'Kreuzberg': 'https://www.visitberlin.de/en/kreuzberg',
  'Torre de Belém': 'https://www.patrimoniocultural.gov.pt/pt/museus-e-monumentos/dgpc/m/torre-de-belem',
  'Barrio de Alfama': 'https://www.visitlisboa.com/en/places/alfama',
  'Monasterio de los Jeronimos': 'https://www.patrimoniocultural.gov.pt/pt/museus-e-monumentos/dgpc/m/mosteiro-dos-jeronimos',
  'Mirador de Santa Luzia': 'https://www.visitlisboa.com/en/places/miradouro-de-santa-luzia',
  'Elevador de Santa Justa': 'https://www.carris.pt/en/travel/elevators-and-funiculars/santa-justa-lift',
  'LX Factory': 'https://lxfactory.com',
  'Mercado da Ribeira': 'https://www.timeoutmarket.com/lisboa',
  'Museo Nacional del Azulejo': 'https://www.museudoazulejo.gov.pt',
  'Parque Eduardo VII': 'https://www.visitlisboa.com/en/places/parque-eduardo-vii',
  'Puente Carlos': 'https://www.prague.eu/en/object/places/93/charles-bridge-karluv-most',
  'Castillo de Praga': 'https://www.hrad.cz/en/prague-castle-for-visitors',
  'Plaza de la Ciudad Vieja': 'https://www.prague.eu/en/object/places/183/old-town-square-staromestske-namesti',
  'Reloj Astronomico': 'https://www.prague.eu/en/object/places/312/old-town-hall-with-astronomical-clock',
  'Catedral de San Vito': 'https://www.katedralasvatehovita.cz/en',
  'Mala Strana': 'https://www.prague.eu/en/object/places/498/lesser-town-mala-strana',
  'Barrio Judio Josefov': 'https://www.jewishmuseum.cz/en',
  'Casa Danzante': 'https://www.tancici-dum.cz/en',
  'Parque Letna': 'https://www.prague.eu/en/object/places/407/letna-park',
  'Plaza de San Marcos': 'https://www.veneziaunica.it/en/content/st-marks-square',
  'Puente de Rialto': 'https://www.veneziaunica.it/en/content/rialto-bridge',
  'Basilica de San Marcos': 'https://www.basilicasanmarco.it',
  'Palacio Ducal': 'https://palazzoducale.visitmuve.it',
  'Gran Canal': 'https://www.veneziaunica.it/en/content/grand-canal',
  "Gallerie dell'Accademia": 'https://www.gallerieaccademia.it',
  'Dorsoduro': 'https://www.veneziaunica.it/en/content/dorsoduro',
  'Mercado de Rialto': 'https://www.veneziaunica.it/en/content/rialto-market',
  'Isla de Burano': 'https://www.veneziaunica.it/en/content/burano',
  'Palacio de Schönbrunn': 'https://www.schoenbrunn.at/en',
  'Catedral de San Esteban': 'https://www.stephanskirche.at',
  'Palacio Belvedere': 'https://www.belvedere.at/en',
  'Opera Estatal de Viena': 'https://www.wiener-staatsoper.at/en',
  'Hofburg': 'https://www.hofburg-wien.at/en',
  'MuseumsQuartier': 'https://www.mqw.at/en',
  'Naschmarkt': 'https://www.wien.info/en/shopping-wining-dining/markets/naschmarkt-352672',
  'Prater': 'https://www.praterwien.com/en',
  'Cafe Central': 'https://www.cafecentral.wien/en'
};

function isWebsite(value) {
  const text = String(value || '').trim();
  return Boolean(text && !text.includes('@') && /^(https?:\/\/|www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/[^\s]*)?$/i.test(text));
}

function updatePlaces(places) {
  let changed = 0;
  for (const place of places || []) {
    if (!place.web && placeWebs[place.nombre]) {
      place.web = placeWebs[place.nombre];
      changed++;
    }
    for (const activity of place.actividades || []) {
      const contact = activity.contacto || activity.contact;
      if (!activity.web && isWebsite(contact)) {
        activity.web = contact;
        changed++;
      }
    }
  }
  return changed;
}

function updateJsonFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;
  if (Array.isArray(data)) {
    if (data.length && data[0].lugares) {
      for (const city of data) changed += updatePlaces(city.lugares);
    } else {
      changed += updatePlaces(data);
    }
  } else if (data.lugares) {
    changed += updatePlaces(data.lugares);
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  return changed;
}

let total = updateJsonFile(path.join(ROOT, 'cities.json'));
const dataDir = path.join(ROOT, 'data');
for (const file of fs.readdirSync(dataDir)) {
  if (file.endsWith('.json')) total += updateJsonFile(path.join(dataDir, file));
}

console.log(`Actualizados ${total} campos web.`);
