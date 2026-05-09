const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

function slug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ',')
    .replace(/^,+|,+$/g, '');
}

let counter = 1;
for (const place of miami.lugares) {
  for (const activity of place.actividades || []) {
    const keywords = slug(`miami ${place.nombre} ${activity.titulo}`);
    activity.imagen = `https://loremflickr.com/900/650/${keywords}?lock=${9000 + counter}`;
    counter += 1;
  }
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
console.log(`Assigned ${counter - 1} stable Miami activity images`);
