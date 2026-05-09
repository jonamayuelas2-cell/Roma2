const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');
const wynwood = miami?.lugares.find((place) => place.nombre === 'Wynwood Walls');
const activity = wynwood?.actividades.find((item) => item.titulo === 'Tour fotografico de murales');

if (!activity) throw new Error('Tour fotografico de murales not found');

activity.imagen = 'img/miami_wynwood_mural_photo_tour.png';

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
console.log(activity.imagen);
