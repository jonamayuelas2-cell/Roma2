const fs = require('fs');

const file = 'cruises.json';
const cruises = JSON.parse(fs.readFileSync(file, 'utf8'));

const existingIds = new Set(cruises.map((cruise) => cruise.id));

const stopData = {
  Barcelona: { lat: 41.3851, lng: 2.1734, pais: 'España', imagen: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=900' },
  Roma: { lat: 41.9028, lng: 12.4964, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=900' },
  Marsella: { lat: 43.2965, lng: 5.3698, pais: 'Francia', imagen: 'https://images.unsplash.com/photo-1565158226067-160173693246?auto=format&fit=crop&q=80&w=900' },
  Venecia: { lat: 45.4408, lng: 12.3155, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=900' },
  Génova: { lat: 44.4056, lng: 8.9463, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=900' },
  Nápoles: { lat: 40.8518, lng: 14.2681, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?auto=format&fit=crop&q=80&w=900' },
  Palermo: { lat: 38.1157, lng: 13.3615, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&q=80&w=900' },
  Cagliari: { lat: 39.2238, lng: 9.1217, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=900' },
  'Palma de Mallorca': { lat: 39.5696, lng: 2.6502, pais: 'España', imagen: 'https://images.unsplash.com/photo-1588534510807-86dfb5ed5d2b?auto=format&fit=crop&q=80&w=900' },
  Valencia: { lat: 39.4699, lng: -0.3763, pais: 'España', imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=900' },
  Ibiza: { lat: 38.9067, lng: 1.4206, pais: 'España', imagen: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=900' },
  Atenas: { lat: 37.9838, lng: 23.7275, pais: 'Grecia', imagen: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&q=80&w=900' },
  Mykonos: { lat: 37.4467, lng: 25.3289, pais: 'Grecia', imagen: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&q=80&w=900' },
  Santorini: { lat: 36.3932, lng: 25.4615, pais: 'Grecia', imagen: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=900' },
  Rodas: { lat: 36.4341, lng: 28.2176, pais: 'Grecia', imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900' },
  Kusadasi: { lat: 37.8579, lng: 27.261, pais: 'Turquía', imagen: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=900' },
  Estambul: { lat: 41.0082, lng: 28.9784, pais: 'Turquía', imagen: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=900' },
  Dubrovnik: { lat: 42.6507, lng: 18.0944, pais: 'Croacia', imagen: 'https://images.unsplash.com/photo-1555990538-c48be371d0e4?auto=format&fit=crop&q=80&w=900' },
  Split: { lat: 43.5081, lng: 16.4402, pais: 'Croacia', imagen: 'https://images.unsplash.com/photo-1555990538-c48be371d0e4?auto=format&fit=crop&q=80&w=900' },
  Kotor: { lat: 42.4247, lng: 18.7712, pais: 'Montenegro', imagen: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80&w=900' },
  Corfú: { lat: 39.6243, lng: 19.9217, pais: 'Grecia', imagen: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&q=80&w=900' },
  LaValeta: { lat: 35.8989, lng: 14.5146, pais: 'Malta', imagen: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=900' },
  Túnez: { lat: 36.8065, lng: 10.1815, pais: 'Túnez', imagen: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=900' },
  Catania: { lat: 37.5079, lng: 15.083, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=900' },
  Livorno: { lat: 43.5485, lng: 10.3106, pais: 'Italia', imagen: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=900' },
  Ajaccio: { lat: 41.9192, lng: 8.7386, pais: 'Francia', imagen: 'https://images.unsplash.com/photo-1533036660144-884ec866df42?auto=format&fit=crop&q=80&w=900' }
};

function makeStop(name, index) {
  const data = stopData[name];
  return {
    id: `stop-${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}-${index}`,
    nombre: name === 'LaValeta' ? 'La Valeta' : name,
    pais: data.pais,
    continente: 'Europa',
    emoji: '',
    lat: data.lat,
    lng: data.lng,
    imagen: data.imagen,
    theme: { primary: '#0f766e', secondary: '#f8fafc', font: "'Inter', sans-serif" },
    lugares: [{
      id: 1,
      nombre: `Puerto de ${name === 'LaValeta' ? 'La Valeta' : name}`,
      tipo: 'vistas',
      descripcion: `Escala mediterránea para explorar el centro histórico, la costa y la gastronomía local de ${name === 'LaValeta' ? 'La Valeta' : name}.`,
      descripcionCorta: `Escala destacada en ${name === 'LaValeta' ? 'La Valeta' : name}.`,
      imagenCard: data.imagen,
      actividades: [{
        titulo: 'Paseo panorámico',
        descripcion: 'Recorrido breve por miradores, casco histórico y puerto.',
        proveedor: 'Excursiones locales',
        contacto: 'consultar a bordo',
        web: 'https://www.viator.com/',
        horario: 'Todo el día',
        costeEstimado: '25-70 €',
        imagen: data.imagen
      }]
    }]
  };
}

function makeCruise({ id, nombre, imagen, route, temporada, buque }) {
  return {
    id,
    nombre,
    region: 'Mediterraneo',
    imagen,
    emoji: '',
    ruta: route.map((name) => {
      const data = stopData[name];
      return { lat: data.lat, lng: data.lng, nombre: name === 'LaValeta' ? 'La Valeta' : name };
    }),
    paradas: route.map(makeStop),
    temporada,
    buque
  };
}

const newCruises = [
  makeCruise({
    id: 'med-riviera-italiana',
    nombre: 'Riviera Italiana y Provenza',
    imagen: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=85&w=1200',
    route: ['Barcelona', 'Marsella', 'Génova', 'Livorno', 'Nápoles', 'Palma de Mallorca', 'Barcelona'],
    temporada: 'Abril - Octubre',
    buque: {
      nombre: 'Costa Smeralda',
      compania: 'Costa Cruceros',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Costa_Smeralda_ship_2020.jpg',
      datos: { eslora: '337 m', plantas: '20 cubiertas', pasajeros: '6.554', tripulacion: '1.646', restaurantes: '11', actividades: 'Teatro, spa, piscinas, parque acuático, gimnasio y zona comercial' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9781889'
    }
  }),
  makeCruise({
    id: 'med-islas-baleares',
    nombre: 'Baleares y Costa Azul',
    imagen: 'https://images.unsplash.com/photo-1588534510807-86dfb5ed5d2b?auto=format&fit=crop&q=85&w=1200',
    route: ['Valencia', 'Ibiza', 'Palma de Mallorca', 'Marsella', 'Génova', 'Barcelona', 'Valencia'],
    temporada: 'Mayo - Septiembre',
    buque: {
      nombre: 'MSC Seaview',
      compania: 'MSC Cruceros',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/MSC_Seaview_in_Genoa.jpg',
      datos: { eslora: '323 m', plantas: '18 cubiertas', pasajeros: '5.331', tripulacion: '1.413', restaurantes: '10', actividades: 'Aqua park, teatro, MSC Yacht Club, spa, tiendas y bares panorámicos' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9745378'
    }
  }),
  makeCruise({
    id: 'med-grecia-clasica',
    nombre: 'Grecia Clásica y Egeo',
    imagen: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=85&w=1200',
    route: ['Atenas', 'Mykonos', 'Santorini', 'Rodas', 'Kusadasi', 'Atenas'],
    temporada: 'Abril - Noviembre',
    buque: {
      nombre: 'Celebrity Infinity',
      compania: 'Celebrity Cruises',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Celebrity_Infinity_(ship%2C_2001)_001.jpg',
      datos: { eslora: '294 m', plantas: '12 cubiertas', pasajeros: '2.170', tripulacion: '999', restaurantes: '8', actividades: 'Teatro, spa, casino, solárium, piscinas y restaurantes de especialidad' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9189421'
    }
  }),
  makeCruise({
    id: 'med-adriatico-premium',
    nombre: 'Adriático Premium',
    imagen: 'https://images.unsplash.com/photo-1555990538-c48be371d0e4?auto=format&fit=crop&q=85&w=1200',
    route: ['Venecia', 'Split', 'Dubrovnik', 'Kotor', 'Corfú', 'Atenas'],
    temporada: 'Mayo - Octubre',
    buque: {
      nombre: 'Azamara Pursuit',
      compania: 'Azamara',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Azamara_Pursuit_at_Southampton.jpg',
      datos: { eslora: '181 m', plantas: '11 cubiertas', pasajeros: '702', tripulacion: '408', restaurantes: '6', actividades: 'Restaurantes de autor, spa, teatro, piscina, excursiones inmersivas y música en vivo' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9210220'
    }
  }),
  makeCruise({
    id: 'med-malta-sicilia',
    nombre: 'Malta, Sicilia y Sur de Italia',
    imagen: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=85&w=1200',
    route: ['Roma', 'Nápoles', 'Catania', 'LaValeta', 'Palermo', 'Roma'],
    temporada: 'Marzo - Noviembre',
    buque: {
      nombre: 'Norwegian Epic',
      compania: 'Norwegian Cruise Line',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Norwegian_Epic_in_Cannes.jpg',
      datos: { eslora: '329 m', plantas: '19 cubiertas', pasajeros: '4.100', tripulacion: '1.724', restaurantes: '15', actividades: 'Teatro, circo, spa, casino, piscinas, clubes y restaurantes freestyle' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9410569'
    }
  }),
  makeCruise({
    id: 'med-iberico',
    nombre: 'Mediterráneo Ibérico',
    imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=85&w=1200',
    route: ['Barcelona', 'Valencia', 'Palma de Mallorca', 'Ibiza', 'Marsella', 'Barcelona'],
    temporada: 'Mayo - Octubre',
    buque: {
      nombre: 'AIDAcosma',
      compania: 'AIDA Cruises',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/AIDAcosma_in_Kiel.jpg',
      datos: { eslora: '337 m', plantas: '20 cubiertas', pasajeros: '5.228', tripulacion: '1.500', restaurantes: '17', actividades: 'Beach club, teatro, spa, zonas familiares, toboganes, restaurantes y bares temáticos' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9781877'
    }
  }),
  makeCruise({
    id: 'med-tesoros-levantinos',
    nombre: 'Tesoros Levantinos',
    imagen: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&q=85&w=1200',
    route: ['Atenas', 'Santorini', 'Rodas', 'Kusadasi', 'Estambul', 'Atenas'],
    temporada: 'Abril - Octubre',
    buque: {
      nombre: 'Celestyal Discovery',
      compania: 'Celestyal Cruises',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/AIDAaura_in_Tallinn_2014.JPG',
      datos: { eslora: '203 m', plantas: '12 cubiertas', pasajeros: '1.266', tripulacion: '500', restaurantes: '5', actividades: 'Piscina, spa, teatro, casino, lounges, tiendas y gastronomía griega' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9221566'
    }
  }),
  makeCruise({
    id: 'med-corsega-cerdena',
    nombre: 'Córcega, Cerdeña y Riviera',
    imagen: 'https://images.unsplash.com/photo-1533036660144-884ec866df42?auto=format&fit=crop&q=85&w=1200',
    route: ['Marsella', 'Ajaccio', 'Cagliari', 'Palermo', 'Nápoles', 'Génova', 'Marsella'],
    temporada: 'Junio - Septiembre',
    buque: {
      nombre: 'MSC Orchestra',
      compania: 'MSC Cruceros',
      imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/MSC_Orchestra_in_Kiel_Canal.jpg',
      datos: { eslora: '294 m', plantas: '16 cubiertas', pasajeros: '3.223', tripulacion: '1.054', restaurantes: '5', actividades: 'Teatro, spa, piscinas, minigolf, casino, bares y zona infantil' },
      trackingUrl: 'https://www.vesselfinder.com/vessels/details/9320099'
    }
  })
];

for (const cruise of newCruises) {
  if (!existingIds.has(cruise.id)) cruises.push(cruise);
}

fs.writeFileSync(file, `${JSON.stringify(cruises, null, 2)}\n`, 'utf8');
console.log(`Mediterraneo: ${cruises.filter((cruise) => cruise.region === 'Mediterraneo').length}`);
