const fs = require('fs');

const details = {
  'med-clasico': {
    fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/MSC_World_Europa_(ship,_2022).jpg',
    eslora: '333 m',
    cubiertas: '22',
    pasajeros: '6.762',
    tripulacion: '2.138',
    restaurantes: '13',
    actividades: 'Promenade exterior, parque acuatico, teatro, spa, zonas familiares y lounges panoramicos'
  },
  'nordic-fjords': {
    fotoBarco: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=85&w=800',
    eslora: '136 m',
    cubiertas: '9',
    pasajeros: '822',
    tripulacion: '80',
    restaurantes: '3',
    actividades: 'Salon panoramico, cubierta exterior, conferencias de naturaleza, sauna y observacion de fiordos'
  },
  'caribe-dream': {
    fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wonder_of_the_Seas_Jan_30_2025.jpg',
    eslora: '362 m',
    cubiertas: '18',
    pasajeros: '6.988',
    tripulacion: '2.300',
    restaurantes: '20+',
    actividades: 'Central Park, AquaTheater, toboganes, simulador de surf, tirolina, musicales y areas infantiles'
  },
  'greek-islands': {
    fotoBarco: 'https://images.unsplash.com/photo-1516483642775-8129de216aae?auto=format&fit=crop&q=85&w=800',
    eslora: '219 m',
    cubiertas: '12',
    pasajeros: '1.260',
    tripulacion: '560',
    restaurantes: '7',
    actividades: 'Piscina, teatro, casino, spa, lounges, clases culturales y experiencias gastronomicas griegas'
  },
  'alaska-glaciers': {
    fotoBarco: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=800',
    eslora: '330 m',
    cubiertas: '19',
    pasajeros: '3.660',
    tripulacion: '1.346',
    restaurantes: '14',
    actividades: 'Miradores de glaciares, cine bajo las estrellas, spa, piscinas cubiertas y teatro'
  },
  'south-pacific': {
    fotoBarco: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=85&w=800',
    eslora: '156 m',
    cubiertas: '7',
    pasajeros: '330',
    tripulacion: '209',
    restaurantes: '3',
    actividades: 'Marina deportiva, snorkel, kayak, spa, conferencias polinesias y cenas de autor'
  },
  'antartic-expedition': {
    fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Le_Commandant_Charcot_during_Operation_Tugaalik_in_June_23,_2024_(1).jpg',
    eslora: '150 m',
    cubiertas: '9',
    pasajeros: '245',
    tripulacion: '215',
    restaurantes: '2',
    actividades: 'Laboratorios cientificos, cubierta polar, piscina interior, spa, conferencias y salidas zodiac'
  },
  'southeast-asia': {
    fotoBarco: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Celebrity_Millennium_WM138.jpg',
    eslora: '294 m',
    cubiertas: '12',
    pasajeros: '2.218',
    tripulacion: '1.024',
    restaurantes: '10',
    actividades: 'Solarium, teatro, casino, spa, tiendas, clases culinarias y lounges con musica en vivo'
  },
  'south-america-magic': {
    fotoBarco: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=85&w=800',
    eslora: '290 m',
    cubiertas: '13',
    pasajeros: '3.800',
    tripulacion: '1.110',
    restaurantes: '8',
    actividades: 'Teatro, piscina, spa, casino, club infantil, discoteca y programacion latina'
  },
  'dubai-emirates': {
    fotoBarco: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=800',
    eslora: '331 m',
    cubiertas: '19',
    pasajeros: '6.334',
    tripulacion: '1.704',
    restaurantes: '10',
    actividades: 'Galeria LED, parque acuatico, spa, teatro, tiendas, simuladores y restaurantes tematicos'
  }
};

const cruises = JSON.parse(fs.readFileSync('cruises.json', 'utf8'));
for (const cruise of cruises) {
  cruise.buque = {
    ...(cruise.buque || {}),
    datos: details[cruise.id] || {}
  };
  if (details[cruise.id]?.fotoBarco) cruise.buque.fotoBarco = details[cruise.id].fotoBarco;
}

fs.writeFileSync('cruises.json', JSON.stringify(cruises, null, 2) + '\n', 'utf8');
console.log(`Actualizados datos ampliados de ${cruises.length} barcos.`);
