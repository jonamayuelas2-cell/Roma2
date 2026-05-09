const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function estimateCost(title = '') {
  const t = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  if (t.includes('helicoptero') || t.includes('vuelo')) return '180-350 €';
  if (t.includes('privado') || t.includes('medida')) return '90-180 €';
  if (t.includes('menu degustacion') || t.includes('maridaje')) return '80-160 €';
  if (t.includes('mesa recomendada') || t.includes('cena')) return '45-120 €';
  if (t.includes('clase') || t.includes('taller')) return '45-95 €';
  if (t.includes('gastronomia') || t.includes('gastronomica') || t.includes('sabores') || t.includes('degustacion') || t.includes('food') || t.includes('charla con cocina') || t.includes('sabor')) return '35-90 €';
  if (t.includes('escalada') || t.includes('paddle') || t.includes('senderismo') || t.includes('capoeira') || t.includes('voley')) return '25-80 €';
  if (t.includes('famil')) return '25-70 €';
  if (t.includes('fotograf')) return '40-120 €';
  if (t.includes('noche') || t.includes('nocturn') || t.includes('atardecer') || t.includes('amanecer')) return '25-75 €';
  if (t.includes('audioguia') || t.includes('audio')) return '5-20 €';
  if (t.includes('coleccion') || t.includes('obras') || t.includes('interior') || t.includes('especialista') || t.includes('museo')) return '20-65 €';
  if (t.includes('botanico') || t.includes('picnic') || t.includes('bienestar') || t.includes('miradores') || t.includes('rincones') || t.includes('verde')) return '15-50 €';
  if (t.includes('compras')) return '20-60 €';
  if (t.includes('paseo') || t.includes('barrio') || t.includes('historias') || t.includes('leyendas')) return '15-45 €';
  if (t.includes('tour') || t.includes('visita') || t.includes('ruta') || t.includes('acceso')) return '25-70 €';

  return '20-60 €';
}

function updatePlaces(places) {
  let changed = 0;
  for (const place of places || []) {
    for (const activity of place.actividades || []) {
      if (!activity.costeEstimado) {
        activity.costeEstimado = estimateCost(activity.titulo || activity.title || '');
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
  if (changed) fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return changed;
}

let total = updateJsonFile(path.join(ROOT, 'cities.json'));
for (const fileName of fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.json'))) {
  total += updateJsonFile(path.join(ROOT, 'data', fileName));
}

console.log(`Actualizados ${total} costes estimados de actividades.`);
