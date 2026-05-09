const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const placeOfficial = {
  'Coliseo Romano': 'https://colosseo.it/en/area/the-colosseum/',
  'Foro Romano': 'https://colosseo.it/en/area/roman-forum/',
  'Fontana di Trevi': 'https://www.turismoroma.it/en/places/trevi-fountain',
  'Panteón de Agripa': 'https://www.pantheonroma.com',
  'Museos Vaticanos': 'https://www.museivaticani.va',
  'Trastevere': 'https://www.turismoroma.it/en/places/trastevere',
  'Villa Borghese': 'https://www.sovrintendenzaroma.it/i_luoghi/ville_e_parchi_storici/ville_dei_nobili/villa_borghese',
  "Campo de' Fiori": 'https://www.turismoroma.it/en/places/campo-de-fiori',
  'Salumeria Roscioli': 'https://www.roscioli.com/salumeria'
};

const activityWebs = {
  'Tour historico esencial': 'https://www.walksofitaly.com/rome-tours/',
  'Acceso con contexto local': 'https://www.getyourguide.com/rome-l33/',
  'Paseo fotografico': 'https://www.withlocals.com/experiences/italy/rome/',
  'Ruta de leyendas': 'https://www.civitatis.com/es/roma/',
  'Visita familiar': 'https://www.getyourguide.com/rome-l33/family-friendly-activities-tc1094/',
  'Audioguia express': 'https://www.tiqets.com/en/rome-attractions-c71631/',
  'Visita guiada a la coleccion': 'https://www.museivaticani.va/content/museivaticani/en/visita-i-musei/scegli-la-visita.html',
  'Ruta de obras imprescindibles': 'https://www.walksofitaly.com/vatican-tours/',
  'Taller creativo': 'https://www.museivaticani.va/content/museivaticani/en/eventi-e-novita/iniziative/Eventi-in-corso.html',
  'Encuentro con especialista': 'https://www.museivaticani.va/content/museivaticani/en/visita-i-musei/scegli-la-visita.html',
  'Paseo fotografico interior': 'https://www.museivaticani.va/content/museivaticani/en/visita-i-musei.html',
  'Paseo de barrio': 'https://www.withlocals.com/experiences/italy/rome/',
  'Ruta gastronomica local': 'https://www.eatingeurope.com/rome/',
  'Fotografia urbana': 'https://www.withlocals.com/experiences/italy/rome/',
  'Historias del vecindario': 'https://www.civitatis.com/es/roma/',
  'Compras con guia local': 'https://www.getyourguide.com/rome-l33/shopping-tours-tc20/',
  'Noche de ambiente': 'https://www.getyourguide.com/rome-l33/night-tours-tc10/',
  'Paseo botanico': 'https://www.sovrintendenzaroma.it/i_luoghi/ville_e_parchi_storici/ville_dei_nobili/villa_borghese',
  'Picnic con producto local': 'https://www.withlocals.com/experiences/italy/rome/',
  'Ruta fotografica natural': 'https://www.withlocals.com/experiences/italy/rome/',
  'Actividad familiar al aire libre': 'https://www.getyourguide.com/rome-l33/family-friendly-activities-tc1094/',
  'Bienestar y estiramientos': 'https://www.getyourguide.com/rome-l33/wellness-spas-tc92/',
  'Miradores y rincones tranquilos': 'https://www.turismoroma.it/en',
  'Visita guiada esencial': 'https://www.civitatis.com/es/roma/',
  'Tour privado a medida': 'https://www.withlocals.com/experiences/italy/rome/',
  'Ruta familiar': 'https://www.getyourguide.com/rome-l33/family-friendly-activities-tc1094/',
  'Experiencia al atardecer': 'https://www.getyourguide.com/rome-l33/sunset-tours-tc306/',
  'Mesa recomendada': 'https://www.roscioli.com/salumeria',
  'Menu degustacion': 'https://www.roscioli.com/salumeria',
  'Charla con cocina': 'https://www.roscioli.com/salumeria',
  'Maridaje local': 'https://www.roscioli.com/wine-club',
  'Ruta gastronomica cercana': 'https://www.eatingeurope.com/rome/',
  'Clase de sabor local': 'https://www.roscioli.com/cooking-classes'
};

function updateRomePlaces(places) {
  let changed = 0;
  for (const place of places || []) {
    if (placeOfficial[place.nombre] && place.web !== placeOfficial[place.nombre]) {
      place.web = placeOfficial[place.nombre];
      changed++;
    }
    for (const activity of place.actividades || []) {
      const web = activityWebs[activity.titulo] || place.web;
      if (web && activity.web !== web) {
        activity.web = web;
        changed++;
      }
    }
  }
  return changed;
}

function updateCitiesJson() {
  const file = path.join(ROOT, 'cities.json');
  const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
  const city = cities.find(c => c.id === 'roma');
  const changed = updateRomePlaces(city?.lugares);
  if (changed) fs.writeFileSync(file, JSON.stringify(cities, null, 2) + '\n', 'utf8');
  return changed;
}

function updateRomeJson() {
  const file = path.join(ROOT, 'data', 'roma.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const changed = updateRomePlaces(Array.isArray(data) ? data : data.lugares);
  if (changed) fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return changed;
}

console.log(`Actualizados ${updateCitiesJson() + updateRomeJson()} campos web de Roma.`);
