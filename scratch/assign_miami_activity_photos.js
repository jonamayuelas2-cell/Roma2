const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

function photoUrl(place, activity, index) {
  const query = [
    'miami',
    place.nombre,
    activity.titulo,
    'travel'
  ]
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .replace(/\s+/g, ',')
    .toLowerCase();

  return `https://source.unsplash.com/900x650/?${query}&sig=miami-${place.id || place.nombre}-${index}`;
}

for (const place of miami.lugares) {
  (place.actividades || []).forEach((activity, index) => {
    activity.imagen = photoUrl(place, activity, index + 1);
  });
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');

const allImages = miami.lugares.flatMap((place) => (place.actividades || []).map((activity) => activity.imagen));
console.log(`Miami activities: ${allImages.length}`);
console.log(`Unique images: ${new Set(allImages).size}`);
