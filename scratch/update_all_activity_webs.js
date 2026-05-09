const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const cityProfiles = {
  roma: { name: 'Rome', slug: 'roma', official: 'https://www.turismoroma.it/en', food: 'https://www.eatingeurope.com/rome/' },
  paris: { name: 'Paris', slug: 'paris', official: 'https://www.parisjetaime.com/eng/', food: 'https://www.secretfoodtours.com/paris/' },
  londres: { name: 'London', slug: 'londres', official: 'https://www.visitlondon.com', food: 'https://www.eatingeurope.com/london/' },
  elcairo: { name: 'Cairo', slug: 'el-cairo', official: 'https://egymonuments.gov.eg', food: 'https://www.viator.com/Cairo-tours/Food-Tours/d782-g6-c80' },
  ciudaddelcabo: { name: 'Cape Town', slug: 'ciudad-del-cabo', official: 'https://www.capetown.travel', food: 'https://www.eatingeurope.com/cape-town/' },
  tokyo: { name: 'Tokyo', slug: 'tokio', official: 'https://www.gotokyo.org/en/', food: 'https://www.byfood.com/food-tours/tokyo' },
  bangkok: { name: 'Bangkok', slug: 'bangkok', official: 'https://www.tourismthailand.org/Destinations/Provinces/Bangkok/219', food: 'https://achefstour.com/tour/bangkok-food-tour' },
  nyc: { name: 'New York', slug: 'nueva-york', official: 'https://www.nyctourism.com', food: 'https://www.foodsofny.com' },
  ciudaddemexico: { name: 'Mexico City', slug: 'ciudad-de-mexico', official: 'https://mexicocity.cdmx.gob.mx', food: 'https://clubtengohambre.com' },
  rio: { name: 'Rio de Janeiro', slug: 'rio-de-janeiro', official: 'https://riotur.rio/en/', food: 'https://www.eatingrio.com' },
  lima: { name: 'Lima', slug: 'lima', official: 'https://www.peru.travel/en/destinations/lima', food: 'https://www.limacookingclass.com' },
  sydney: { name: 'Sydney', slug: 'sidney', official: 'https://www.sydney.com', food: 'https://www.sydneyfoodtours.com.au' },
  madrid: { name: 'Madrid', slug: 'madrid', official: 'https://www.esmadrid.com', food: 'https://madridfoodtour.com' },
  auckland: { name: 'Auckland', slug: 'auckland', official: 'https://www.aucklandnz.com', food: 'https://www.thebigfoody.com' },
  barcelona: { name: 'Barcelona', slug: 'barcelona', official: 'https://www.barcelonaturisme.com', food: 'https://barcelonafoodexperience.com' },
  buenosaires: { name: 'Buenos Aires', slug: 'buenos-aires', official: 'https://turismo.buenosaires.gob.ar/en', food: 'https://sherpafoodtours.com' },
  estambul: { name: 'Istanbul', slug: 'estambul', official: 'https://visit.istanbul', food: 'https://culinarybackstreets.com/category/cities-category/istanbul/' },
  amsterdam: { name: 'Amsterdam', slug: 'amsterdam', official: 'https://www.iamsterdam.com/en', food: 'https://www.eatingeurope.com/amsterdam/' },
  atenas: { name: 'Athens', slug: 'atenas', official: 'https://www.thisisathens.org', food: 'https://www.athensfoodonfoot.com' },
  berlin: { name: 'Berlin', slug: 'berlin', official: 'https://www.visitberlin.de/en', food: 'https://www.secretfoodtours.com/berlin/' },
  lisboa: { name: 'Lisbon', slug: 'lisboa', official: 'https://www.visitlisboa.com/en', food: 'https://www.tasteoflisboa.com' },
  praga: { name: 'Prague', slug: 'praga', official: 'https://www.prague.eu/en', food: 'https://www.tasteofprague.com' },
  venecia: { name: 'Venice', slug: 'venecia', official: 'https://www.veneziaunica.it/en', food: 'https://www.venicebitesfoodtours.com' },
  viena: { name: 'Vienna', slug: 'viena', official: 'https://www.wien.info/en', food: 'https://www.secretfoodtours.com/vienna/' }
};

const groupByCity = {
  europa_oeste: ['paris', 'londres', 'madrid', 'barcelona', 'amsterdam', 'lisboa'],
  europa_centro_sur: ['roma', 'atenas', 'berlin', 'praga', 'venecia', 'viena', 'estambul'],
  africa_asia: ['elcairo', 'ciudaddelcabo', 'tokyo', 'bangkok'],
  americas: ['nyc', 'ciudaddemexico', 'rio', 'lima', 'buenosaires'],
  oceania: ['sydney', 'auckland']
};

function providerLinks(profile) {
  const q = encodeURIComponent(profile.name);
  return {
    getyourguide: `https://www.getyourguide.com/s/?q=${q}`,
    civitatis: `https://www.civitatis.com/es/${profile.slug}/`,
    tiqets: `https://www.tiqets.com/en/search/?query=${q}`,
    viator: `https://www.viator.com/searchResults/all?text=${q}`,
    withlocals: `https://www.withlocals.com/search/?q=${q}`,
    official: profile.official,
    food: profile.food
  };
}

function pickActivityWeb(title, place, profile) {
  const t = String(title || '').toLowerCase();
  const links = providerLinks(profile);

  if (t.includes('audioguia') || t.includes('audio')) return links.tiqets;
  if (t.includes('gastronom') || t.includes('sabores') || t.includes('mesa') || t.includes('menu') || t.includes('cocina') || t.includes('maridaje') || t.includes('degustacion')) return links.food;
  if (t.includes('fotograf')) return links.withlocals;
  if (t.includes('famil')) return links.getyourguide;
  if (t.includes('compras') || t.includes('noche') || t.includes('atardecer') || t.includes('bienestar') || t.includes('privado') || t.includes('medida')) return links.getyourguide;
  if (t.includes('barrio') || t.includes('leyendas') || t.includes('historias')) return links.civitatis;
  if (t.includes('coleccion') || t.includes('obras') || t.includes('taller') || t.includes('especialista') || t.includes('interior') || t.includes('botanico') || t.includes('verde') || t.includes('miradores')) return place.web || links.official;
  if (t.includes('tour') || t.includes('visita') || t.includes('acceso') || t.includes('ruta') || t.includes('paseo')) return links.getyourguide;

  return place.web || links.official;
}

function updateCity(city) {
  const profile = cityProfiles[city.id];
  if (!profile) return 0;

  let changed = 0;
  for (const place of city.lugares || []) {
    for (const activity of place.actividades || []) {
      if (!activity.web) {
        activity.web = pickActivityWeb(activity.titulo || activity.title, place, profile);
        changed++;
      }
    }
  }
  return changed;
}

function updateCitiesJson() {
  const file = path.join(ROOT, 'cities.json');
  const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = 0;
  for (const ids of Object.values(groupByCity)) {
    for (const id of ids) {
      const city = cities.find(c => c.id === id);
      changed += updateCity(city || {});
    }
  }
  if (changed) fs.writeFileSync(file, JSON.stringify(cities, null, 2) + '\n', 'utf8');
  return changed;
}

function updateDataFiles() {
  const dataDir = path.join(ROOT, 'data');
  let changed = 0;
  for (const fileName of fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))) {
    const file = path.join(dataDir, fileName);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const id = path.basename(fileName, '.json');
    const pseudoCity = Array.isArray(data) ? { id, lugares: data } : data;
    const fileChanged = updateCity(pseudoCity);
    changed += fileChanged;
    if (fileChanged) fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  return changed;
}

console.log('Grupos de trabajo:');
for (const [group, ids] of Object.entries(groupByCity)) console.log(`- ${group}: ${ids.join(', ')}`);
console.log(`Actualizados ${updateCitiesJson() + updateDataFiles()} campos web de actividades.`);
