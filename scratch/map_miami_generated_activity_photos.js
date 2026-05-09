const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

const placeSlugs = {
  'Ocean Drive (South Beach)': 'ocean_drive',
  'Wynwood Walls': 'wynwood_walls',
  'Little Havana (Calle Ocho)': 'little_havana',
  'Everglades National Park': 'everglades',
  'Vizcaya Museum & Gardens': 'vizcaya',
  "Joe's Stone Crab": 'joes_stone_crab',
  'Bayside Marketplace': 'bayside_marketplace',
  'Coconut Grove': 'coconut_grove',
  'Design District': 'design_district'
};

for (const place of miami.lugares) {
  const slug = placeSlugs[place.nombre];
  if (!slug) throw new Error(`Missing slug for ${place.nombre}`);
  (place.actividades || []).forEach((activity, index) => {
    activity.imagen = `img/miami_activity_${slug}_${index + 1}.jpg`;
  });
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
console.log('Mapped generated Miami activity photos');
