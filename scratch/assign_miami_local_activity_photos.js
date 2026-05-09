const fs = require('fs');

const file = 'cities.json';
const cities = JSON.parse(fs.readFileSync(file, 'utf8'));
const miami = cities.find((city) => city.id === 'miami');

if (!miami) throw new Error('Miami not found');

const localPhotos = {
  'Ocean Drive (South Beach)': [
    'img/miami_ocean_drive_1778349577630.png',
    'img/miami_art_deco_tour_4k_1778349831863.png',
    'img/miami_main_hero_1778349495230.png',
    'img/miami_ocean_drive_1778349577630.png',
    'img/miami_art_deco_tour_4k_1778349831863.png',
    'img/miami_main_hero_1778349495230.png'
  ],
  'Wynwood Walls': [
    'img/miami_wynwood_walls_1778349523607.png',
    'img/miami_design_district_4k_1778349811817.png',
    'img/miami_art_deco_tour_4k_1778349831863.png',
    'img/miami_wynwood_walls_1778349523607.png',
    'img/miami_design_district_4k_1778349811817.png',
    'img/miami_main_hero_1778349495230.png'
  ],
  'Little Havana (Calle Ocho)': [
    'img/miami_little_havana_1778349542244.png',
    'img/miami_cuban_food_4k_1778349861702.png',
    'img/miami_little_havana_1778349542244.png',
    'img/miami_cuban_food_4k_1778349861702.png',
    'img/miami_little_havana_1778349542244.png',
    'img/miami_cuban_food_4k_1778349861702.png'
  ],
  'Everglades National Park': [
    'img/miami_everglades_1778349559790.png',
    'img/miami_everglades_safari_4k_1778349845932.png',
    'img/miami_everglades_1778349559790.png',
    'img/miami_everglades_safari_4k_1778349845932.png',
    'img/miami_everglades_1778349559790.png',
    'img/miami_everglades_safari_4k_1778349845932.png'
  ],
  'Vizcaya Museum & Gardens': [
    'img/miami_vizcaya_gardens_1778349593591.png',
    'img/miami_vizcaya_gardens_detail_4k_1778349874903.png',
    'img/miami_vizcaya_gardens_1778349593591.png',
    'img/miami_vizcaya_gardens_detail_4k_1778349874903.png',
    'img/miami_vizcaya_gardens_1778349593591.png',
    'img/miami_coconut_grove_4k_1778349798005.png'
  ],
  "Joe's Stone Crab": [
    'img/miami_joes_stone_crab_1778349616347.png',
    'img/miami_cuban_food_4k_1778349861702.png',
    'img/miami_bayside_marketplace_4k_1778349782938.png',
    'img/miami_joes_stone_crab_1778349616347.png',
    'img/miami_cuban_food_4k_1778349861702.png',
    'img/miami_main_hero_1778349495230.png'
  ],
  'Bayside Marketplace': [
    'img/miami_bayside_marketplace_4k_1778349782938.png',
    'img/miami_main_hero_1778349495230.png',
    'img/miami_ocean_drive_1778349577630.png',
    'img/miami_bayside_marketplace_4k_1778349782938.png',
    'img/miami_main_hero_1778349495230.png',
    'img/miami_bayside_marketplace_4k_1778349782938.png'
  ],
  'Coconut Grove': [
    'img/miami_coconut_grove_4k_1778349798005.png',
    'img/miami_bayside_marketplace_4k_1778349782938.png',
    'img/miami_vizcaya_gardens_1778349593591.png',
    'img/miami_coconut_grove_4k_1778349798005.png',
    'img/miami_main_hero_1778349495230.png',
    'img/miami_coconut_grove_4k_1778349798005.png'
  ],
  'Design District': [
    'img/miami_design_district_4k_1778349811817.png',
    'img/miami_wynwood_walls_1778349523607.png',
    'img/miami_design_district_4k_1778349811817.png',
    'img/miami_joes_stone_crab_1778349616347.png',
    'img/miami_art_deco_tour_4k_1778349831863.png',
    'img/miami_design_district_4k_1778349811817.png'
  ]
};

for (const place of miami.lugares) {
  const photos = localPhotos[place.nombre] || [];
  (place.actividades || []).forEach((activity, index) => {
    activity.imagen = photos[index] || place.imagenCard || place.imagen || 'img/miami_main_hero_1778349495230.png';
  });
}

fs.writeFileSync(file, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
console.log('Miami activities now use local photo files');
