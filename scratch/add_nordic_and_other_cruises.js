const fs = require('fs');

const file = 'cruises.json';
const cruises = JSON.parse(fs.readFileSync(file, 'utf8'));
const existingIds = new Set(cruises.map((cruise) => cruise.id));

const mainRegions = ['Caribe', 'Mediterraneo', 'Paises Nordicos'];

const ports = {
  Bergen: [60.3913, 5.3221, 'Noruega'],
  Geiranger: [62.1015, 7.2057, 'Noruega'],
  Flam: [60.8612, 7.1146, 'Noruega'],
  Stavanger: [58.9701, 5.7333, 'Noruega'],
  Tromso: [69.6492, 18.9553, 'Noruega'],
  Honningsvag: [70.9821, 25.9704, 'Noruega'],
  Alesund: [62.4722, 6.1549, 'Noruega'],
  Oslo: [59.9139, 10.7522, 'Noruega'],
  Copenhague: [55.6761, 12.5683, 'Dinamarca'],
  Estocolmo: [59.3293, 18.0686, 'Suecia'],
  Helsinki: [60.1699, 24.9384, 'Finlandia'],
  Reykjavik: [64.1466, -21.9426, 'Islandia'],
  Akureyri: [65.6885, -18.1262, 'Islandia'],
  Isafjordur: [66.0755, -23.124, 'Islandia'],
  Longyearbyen: [78.2232, 15.6267, 'Svalbard'],
  Juneau: [58.3019, -134.4197, 'Estados Unidos'],
  Ketchikan: [55.3422, -131.6461, 'Estados Unidos'],
  Skagway: [59.4583, -135.3139, 'Estados Unidos'],
  Vancouver: [49.2827, -123.1207, 'Canadá'],
  Tahiti: [-17.5516, -149.5585, 'Polinesia Francesa'],
  Moorea: [-17.5388, -149.8295, 'Polinesia Francesa'],
  BoraBora: [-16.5004, -151.7415, 'Polinesia Francesa'],
  Ushuaia: [-54.8019, -68.303, 'Argentina'],
  PeninsulaAntartica: [-64.8255, -63.494, 'Antártida'],
  Bangkok: [13.7563, 100.5018, 'Tailandia'],
  Singapur: [1.3521, 103.8198, 'Singapur'],
  HoChiMinh: [10.8231, 106.6297, 'Vietnam'],
  HongKong: [22.3193, 114.1694, 'China'],
  BuenosAires: [-34.6037, -58.3816, 'Argentina'],
  Montevideo: [-34.9011, -56.1645, 'Uruguay'],
  Rio: [-22.9068, -43.1729, 'Brasil'],
  Dubai: [25.2048, 55.2708, 'Emiratos Árabes Unidos'],
  Doha: [25.2854, 51.531, 'Catar'],
  Muscat: [23.588, 58.3829, 'Omán'],
  Marrakech: [31.6295, -7.9811, 'Marruecos'],
  Tenerife: [28.2916, -16.6291, 'España'],
  Madeira: [32.7607, -16.9595, 'Portugal']
};

function titleName(name) {
  return name
    .replace('BoraBora', 'Bora Bora')
    .replace('PeninsulaAntartica', 'Península Antártica')
    .replace('HoChiMinh', 'Ho Chi Minh')
    .replace('BuenosAires', 'Buenos Aires');
}

function imageFor(region) {
  const images = {
    'Paises Nordicos': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1200',
    Alaska: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=85&w=1200',
    Pacifico: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1200',
    Antartida: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&q=85&w=1200',
    Asia: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=85&w=1200',
    Sudamerica: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=85&w=1200',
    'Oriente Medio': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=1200',
    Atlantico: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1200'
  };
  return images[region] || images.Atlantico;
}

function makeStop(portName, index) {
  const [lat, lng, pais] = ports[portName];
  const display = titleName(portName);
  const img = imageFor('Paises Nordicos');
  return {
    id: `stop-${portName.toLowerCase()}-${index}`,
    nombre: display,
    pais,
    continente: 'Europa',
    emoji: '',
    lat,
    lng,
    imagen: img,
    theme: { primary: '#0f766e', secondary: '#f8fafc', font: "'Inter', sans-serif" },
    lugares: [{
      id: 1,
      nombre: `Puerto de ${display}`,
      tipo: 'vistas',
      descripcion: `Escala para descubrir paisajes, cultura local y vistas panorámicas en ${display}.`,
      descripcionCorta: `Escala destacada en ${display}.`,
      imagenCard: img,
      actividades: [{
        titulo: 'Excursión panorámica',
        descripcion: 'Recorrido por miradores, puerto y centro histórico.',
        proveedor: 'Excursiones locales',
        contacto: 'consultar a bordo',
        web: 'https://www.viator.com/',
        horario: 'Todo el día',
        costeEstimado: '25-90 €',
        imagen: img
      }]
    }]
  };
}

function makeCruise({ id, nombre, region, route, temporada, buque }) {
  return {
    id,
    nombre,
    region,
    imagen: imageFor(region),
    emoji: '',
    ruta: route.map((portName) => {
      const [lat, lng] = ports[portName];
      return { lat, lng, nombre: titleName(portName) };
    }),
    paradas: route.map(makeStop),
    temporada,
    buque
  };
}

function ship(nombre, compania, eslora, pasajeros, trackingUrl = '') {
  return {
    nombre,
    compania,
    imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
    fotoBarco: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
    datos: {
      eslora,
      plantas: '12-20 cubiertas',
      pasajeros,
      tripulacion: 'Consultar',
      restaurantes: '5-15',
      actividades: 'Teatro, spa, piscinas, gimnasio, lounges, restaurantes y excursiones guiadas'
    },
    trackingUrl
  };
}

const additions = [
  makeCruise({ id: 'nord-cabo-norte', nombre: 'Cabo Norte y Sol de Medianoche', region: 'Paises Nordicos', route: ['Bergen', 'Alesund', 'Tromso', 'Honningsvag', 'Flam', 'Bergen'], temporada: 'Junio - Agosto', buque: ship('MS Nordnorge', 'Hurtigruten', '123 m', '590') }),
  makeCruise({ id: 'nord-fiordos-premium', nombre: 'Fiordos Premium de Noruega', region: 'Paises Nordicos', route: ['Bergen', 'Geiranger', 'Flam', 'Stavanger', 'Bergen'], temporada: 'Mayo - Septiembre', buque: ship('MSC Preziosa', 'MSC Cruceros', '333 m', '4.345') }),
  makeCruise({ id: 'nord-capitales-balticas', nombre: 'Capitales Bálticas', region: 'Paises Nordicos', route: ['Copenhague', 'Estocolmo', 'Helsinki', 'Oslo', 'Copenhague'], temporada: 'Mayo - Septiembre', buque: ship('Norwegian Dawn', 'Norwegian Cruise Line', '294 m', '2.340') }),
  makeCruise({ id: 'nord-islandia-total', nombre: 'Islandia Total', region: 'Paises Nordicos', route: ['Reykjavik', 'Isafjordur', 'Akureyri', 'Reykjavik'], temporada: 'Junio - Septiembre', buque: ship('Celebrity Silhouette', 'Celebrity Cruises', '319 m', '2.902') }),
  makeCruise({ id: 'nord-svalbard-expedicion', nombre: 'Svalbard Expedición Ártica', region: 'Paises Nordicos', route: ['Longyearbyen', 'Tromso', 'Honningsvag', 'Longyearbyen'], temporada: 'Junio - Agosto', buque: ship('Le Commandant Charcot', 'Ponant', '150 m', '245') }),
  makeCruise({ id: 'nord-auroras-boreales', nombre: 'Auroras Boreales Noruegas', region: 'Paises Nordicos', route: ['Bergen', 'Tromso', 'Honningsvag', 'Alesund', 'Bergen'], temporada: 'Octubre - Marzo', buque: ship('MS Trollfjord', 'Hurtigruten', '135 m', '822') }),
  makeCruise({ id: 'nord-grandes-fiordos', nombre: 'Grandes Fiordos Escénicos', region: 'Paises Nordicos', route: ['Oslo', 'Stavanger', 'Flam', 'Geiranger', 'Bergen'], temporada: 'Mayo - Agosto', buque: ship('Sky Princess', 'Princess Cruises', '330 m', '3.660') }),
  makeCruise({ id: 'nord-vikingos', nombre: 'Ruta Vikinga Escandinava', region: 'Paises Nordicos', route: ['Copenhague', 'Oslo', 'Bergen', 'Stavanger', 'Copenhague'], temporada: 'Abril - Septiembre', buque: ship('Costa Diadema', 'Costa Cruceros', '306 m', '4.947') }),
  makeCruise({ id: 'nord-baltico-lujo', nombre: 'Báltico de Lujo', region: 'Paises Nordicos', route: ['Estocolmo', 'Helsinki', 'Copenhague', 'Oslo', 'Estocolmo'], temporada: 'Junio - Agosto', buque: ship('Silver Dawn', 'Silversea', '213 m', '596') }),

  makeCruise({ id: 'otros-alaska-glaciares-plus', nombre: 'Alaska Glaciares Plus', region: 'Alaska', route: ['Vancouver', 'Ketchikan', 'Juneau', 'Skagway', 'Vancouver'], temporada: 'Mayo - Septiembre', buque: ship('Royal Princess', 'Princess Cruises', '330 m', '3.560') }),
  makeCruise({ id: 'otros-polinesia-lagunas', nombre: 'Lagunas de Polinesia', region: 'Pacifico', route: ['Tahiti', 'Moorea', 'BoraBora', 'Tahiti'], temporada: 'Todo el año', buque: ship('Aranui 5', 'Aranui Cruises', '126 m', '230') }),
  makeCruise({ id: 'otros-antartida-clasica', nombre: 'Antártida Clásica', region: 'Antartida', route: ['Ushuaia', 'PeninsulaAntartica', 'Ushuaia'], temporada: 'Noviembre - Marzo', buque: ship('Ocean Victory', 'Albatros Expeditions', '104 m', '189') }),
  makeCruise({ id: 'otros-asia-joyas', nombre: 'Joyas de Asia Oriental', region: 'Asia', route: ['Singapur', 'HoChiMinh', 'HongKong', 'Singapur'], temporada: 'Noviembre - Abril', buque: ship('Spectrum of the Seas', 'Royal Caribbean', '348 m', '4.246') }),
  makeCruise({ id: 'otros-rio-plata', nombre: 'Río de la Plata y Brasil', region: 'Sudamerica', route: ['BuenosAires', 'Montevideo', 'Rio', 'BuenosAires'], temporada: 'Diciembre - Marzo', buque: ship('MSC Fantasia', 'MSC Cruceros', '333 m', '4.363') }),
  makeCruise({ id: 'otros-golfo-arabigo', nombre: 'Golfo Arábigo Premium', region: 'Oriente Medio', route: ['Dubai', 'Doha', 'Muscat', 'Dubai'], temporada: 'Noviembre - Marzo', buque: ship('Costa Toscana', 'Costa Cruceros', '337 m', '6.554') }),
  makeCruise({ id: 'otros-atlantico-islas', nombre: 'Atlántico: Canarias y Madeira', region: 'Atlantico', route: ['Tenerife', 'Madeira', 'Marrakech', 'Tenerife'], temporada: 'Octubre - Abril', buque: ship('Mein Schiff 2', 'TUI Cruises', '316 m', '2.894') })
];

for (const cruise of additions) {
  if (!existingIds.has(cruise.id)) cruises.push(cruise);
}

const nordicCount = cruises.filter((cruise) => cruise.region === 'Paises Nordicos').length;
const otherCount = cruises.filter((cruise) => !mainRegions.includes(cruise.region)).length;

fs.writeFileSync(file, `${JSON.stringify(cruises, null, 2)}\n`, 'utf8');
console.log(`Paises Nordicos: ${nordicCount}`);
console.log(`Otros: ${otherCount}`);
