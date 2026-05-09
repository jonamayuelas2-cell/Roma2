const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

for (const place of miami.lugares) {
  const fallbackImage = place.imagenCard || place.imagen;
  for (const activity of place.actividades || []) {
    if (!activity.imagen) activity.imagen = fallbackImage;
  }
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
console.log('Miami activity images filled');
