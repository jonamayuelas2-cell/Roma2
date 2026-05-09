const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const activity = cities
  .find((city) => city.id === 'miami')
  ?.lugares.find((place) => place.nombre === 'Wynwood Walls')
  ?.actividades.find((item) => item.titulo === 'Cata de cervezas artesanas');

if (!activity) throw new Error('Cata de cervezas artesanas not found');

activity.imagen = 'img/miami_wynwood_craft_beer_tasting.png';

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
console.log(activity.imagen);
