const fs = require('fs');

const baseShips = [
  { compania: 'Royal Caribbean', nombre: 'Icon of the Seas', temporada: 'Noviembre-Abril', imo: '9829930', mmsi: '311001178', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Icon_of_the_Seas_in_PortMiami,_2024.jpg' },
  { compania: 'Celebrity Cruises', nombre: 'Celebrity Beyond', temporada: 'Diciembre-Abril', imo: '9838395', mmsi: '215909000', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Celebrity_Beyond_2022.jpg' },
  { compania: 'Norwegian Cruise Line', nombre: 'Norwegian Prima', temporada: 'Noviembre-Marzo', imo: '9823986', mmsi: '311000910', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Norwegian_Prima_in_Amsterdam_2022.jpg' },
  { compania: 'Carnival Cruise Line', nombre: 'Carnival Celebration', temporada: 'Todo el año', imo: '9837456', mmsi: '311001096', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carnival_Celebration_(ship,_2022)_001.jpg' },
  { compania: 'Disney Cruise Line', nombre: 'Disney Wish', temporada: 'Todo el año', imo: '9834739', mmsi: '311001098', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Disney_Wish_Cruise_Ship.jpg' },
  { compania: 'MSC Cruceros', nombre: 'MSC Seascape', temporada: 'Noviembre-Abril', imo: '9843807', mmsi: '256059000', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/MSC_Seascape_in_Miami.jpg' },
  { compania: 'Princess Cruises', nombre: 'Caribbean Princess', temporada: 'Diciembre-Abril', imo: '9215490', mmsi: '310423000', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caribbean_Princess_(ship,_2004)_001.jpg' },
  { compania: 'Holland America Line', nombre: 'Nieuw Statendam', temporada: 'Noviembre-Marzo', imo: '9767106', mmsi: '244140580', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nieuw_Statendam_(ship,_2018)_001.jpg' },
  { compania: 'Virgin Voyages', nombre: 'Valiant Lady', temporada: 'Diciembre-Marzo', imo: '9805336', mmsi: '311000819', fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Valiant_Lady_(ship,_2021)_001.jpg' }
];

const routes = [
  { id: 'caribe-icon-oriental', nombre: 'Caribe Oriental Iconico', imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1200', ruta: [['Miami',25.7617,-80.1918],['Perfect Day at CocoCay',25.482,-77.9354],['St. Thomas',18.3419,-64.9307],['St. Maarten',18.0425,-63.0548],['Miami',25.7617,-80.1918]] },
  { id: 'caribe-antillas-premium', nombre: 'Antillas Premium', imagen: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=85&w=1200', ruta: [['San Juan',18.4655,-66.1057],['Tortola',18.4285,-64.6185],['St. Johns Antigua',17.1274,-61.8468],['Bridgetown',13.0969,-59.6145],['San Juan',18.4655,-66.1057]] },
  { id: 'caribe-maya', nombre: 'Riviera Maya y Bahamas', imagen: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=85&w=1200', ruta: [['Miami',25.7617,-80.1918],['Cozumel',20.4229,-86.9223],['Costa Maya',18.7146,-87.7094],['Nassau',25.048,-77.3554],['Miami',25.7617,-80.1918]] },
  { id: 'caribe-celebration', nombre: 'Bahamas Celebration', imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=85&w=1200', ruta: [['Miami',25.7617,-80.1918],['Nassau',25.048,-77.3554],['Half Moon Cay',24.5751,-75.9536],['Grand Turk',21.4675,-71.1389],['Miami',25.7617,-80.1918]] },
  { id: 'caribe-disney-family', nombre: 'Bahamas Familiar Disney', imagen: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1200', ruta: [['Port Canaveral',28.4158,-80.6279],['Nassau',25.048,-77.3554],['Castaway Cay',26.0833,-77.5333],['Port Canaveral',28.4158,-80.6279]] },
  { id: 'caribe-seascape', nombre: 'Caribe Seascape', imagen: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&q=85&w=1200', ruta: [['Miami',25.7617,-80.1918],['Ocean Cay',25.4218,-79.2223],['Ocho Rios',18.4074,-77.1031],['George Town',19.2866,-81.3744],['Miami',25.7617,-80.1918]] },
  { id: 'caribe-princess', nombre: 'Caribe Clasico Princess', imagen: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=85&w=1200', ruta: [['Fort Lauderdale',26.1224,-80.1373],['Princess Cays',24.6443,-76.1724],['St. Thomas',18.3419,-64.9307],['St. Maarten',18.0425,-63.0548],['Fort Lauderdale',26.1224,-80.1373]] },
  { id: 'caribe-holland', nombre: 'Islas ABC y Antillas', imagen: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=85&w=1200', ruta: [['Fort Lauderdale',26.1224,-80.1373],['Aruba',12.5211,-69.9683],['Curazao',12.1696,-68.99],['Bonaire',12.1784,-68.2385],['Fort Lauderdale',26.1224,-80.1373]] },
  { id: 'caribe-virgin', nombre: 'Caribe Solo Adultos', imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1200', ruta: [['Miami',25.7617,-80.1918],['Puerto Plata',19.8265,-70.6865],['Bimini',25.7285,-79.297],['Miami',25.7617,-80.1918]] }
];

function makeCruise(route, ship, index) {
  const ruta = route.ruta.map(([nombre, lat, lng]) => ({ nombre, lat, lng }));
  const paradas = ruta.slice(0, -1).map((p, i) => ({
    id: `stop-${route.id}-${i + 1}`,
    nombre: p.nombre,
    pais: 'Caribe',
    continente: 'América',
    emoji: '🏝️',
    lat: p.lat,
    lng: p.lng,
    imagen: route.imagen,
    orden: i + 1
  }));
  return {
    id: route.id,
    nombre: route.nombre,
    region: 'Caribe',
    imagen: route.imagen,
    emoji: '🏝️',
    temporada: ship.temporada,
    buque: {
      compania: ship.compania,
      nombre: ship.nombre,
      imagen: route.imagen,
      fotoBarco: ship.fotoBarco,
      imo: ship.imo,
      mmsi: ship.mmsi,
      trackingUrl: `https://www.vesselfinder.com/vessels/details/${ship.imo}`,
      datos: {
        eslora: ['365 m','327 m','294 m','344 m','341 m','339 m','290 m','299 m','278 m'][index] || 'Consultar',
        cubiertas: ['20','17','20','19','15','20','19','12','17'][index] || 'Consultar',
        pasajeros: ['7.600','3.260','3.099','5.282','4.000','5.877','3.140','2.666','2.770'][index] || 'Consultar',
        tripulacion: ['2.350','1.400','1.506','1.735','1.555','1.648','1.200','1.025','1.160'][index] || 'Consultar',
        restaurantes: ['20+','18','12','15','10','11','10','8','20+'][index] || 'Consultar',
        actividades: 'Piscinas, teatro, spa, restaurantes tematicos, musica en vivo, terrazas exteriores y experiencias de playa privada'
      }
    },
    ruta,
    paradas
  };
}

const cruises = JSON.parse(fs.readFileSync('cruises.json', 'utf8'));
const existing = new Set(cruises.map(c => c.id));
const additions = routes.map((route, index) => makeCruise(route, baseShips[index], index)).filter(c => !existing.has(c.id));
cruises.push(...additions);
fs.writeFileSync('cruises.json', JSON.stringify(cruises, null, 2) + '\n', 'utf8');
console.log(`Añadidos ${additions.length} cruceros de Caribe.`);
