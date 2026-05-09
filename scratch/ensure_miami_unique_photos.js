const fs = require('fs');
const path = require('path');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

const preferred = {
  'Tour fotografico de murales': 'img/miami_wynwood_mural_photo_tour.png',
  'Cata de cervezas artesanas': 'img/miami_wynwood_craft_beer_tasting.png'
};

const localImages = fs.readdirSync('img')
  .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
  .map((name) => `img/${name}`);

const placeImages = new Set(miami.lugares.map((place) => place.imagenCard || place.imagen).filter(Boolean));
const used = new Set();

for (const place of miami.lugares) {
  const img = place.imagenCard || place.imagen;
  if (img) used.add(img);
}

for (const place of miami.lugares) {
  for (const activity of place.actividades || []) {
    const preferredImage = preferred[activity.titulo];
    if (preferredImage && fs.existsSync(preferredImage)) {
      activity.imagen = preferredImage;
      used.add(preferredImage);
    }
  }
}

function scoreImage(activity, image) {
  const text = `${activity.titulo || ''} ${activity.descripcion || ''}`.toLowerCase();
  const name = image.toLowerCase();
  let score = 0;
  for (const word of text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/)) {
    if (word.length > 3 && name.includes(word)) score += 3;
  }
  if (name.includes('miami')) score += 4;
  if (text.includes('mural') && (name.includes('wynwood') || name.includes('gallery') || name.includes('eastside'))) score += 9;
  if (text.includes('cerve') && (name.includes('beer') || name.includes('market') || name.includes('food'))) score += 9;
  if (text.includes('cafe') && (name.includes('cafe') || name.includes('food'))) score += 6;
  if (text.includes('marisco') && (name.includes('food') || name.includes('stone') || name.includes('market'))) score += 6;
  if (text.includes('playa') && (name.includes('beach') || name.includes('ocean'))) score += 6;
  if (text.includes('arquitect') && (name.includes('design') || name.includes('art') || name.includes('deco'))) score += 6;
  if (text.includes('jardin') && (name.includes('garden') || name.includes('park'))) score += 6;
  if (text.includes('kayak') && (name.includes('harbour') || name.includes('bay') || name.includes('water'))) score += 6;
  return score;
}

function pickImage(activity) {
  if (preferred[activity.titulo] && fs.existsSync(preferred[activity.titulo]) && !used.has(preferred[activity.titulo])) {
    return preferred[activity.titulo];
  }
  const candidates = localImages
    .filter((image) => !used.has(image))
    .sort((a, b) => scoreImage(activity, b) - scoreImage(activity, a) || a.localeCompare(b));
  return candidates[0];
}

for (const place of miami.lugares) {
  for (const activity of place.actividades || []) {
    if (preferred[activity.titulo] && activity.imagen === preferred[activity.titulo]) continue;
    const picked = pickImage(activity);
    if (!picked) throw new Error(`No image available for ${activity.titulo}`);
    activity.imagen = picked;
    used.add(picked);
  }
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');

const placeList = miami.lugares.map((place) => place.imagenCard || place.imagen).filter(Boolean);
const activityList = miami.lugares.flatMap((place) => (place.actividades || []).map((activity) => activity.imagen));
console.log(`place images: ${placeList.length}/${new Set(placeList).size}`);
console.log(`activity images: ${activityList.length}/${new Set(activityList).size}`);
console.log(`activity/place overlap: ${activityList.filter((image) => placeImages.has(image)).length}`);
