const fs = require('fs');

const exactShipPhotos = {
  'med-clasico': 'https://commons.wikimedia.org/wiki/Special:FilePath/MSC_World_Europa_(ship,_2022).jpg',
  'nordic-fjords': 'https://commons.wikimedia.org/wiki/Special:FilePath/MS_Trollfjord_i_Moldefjorden.jpg',
  'caribe-dream': 'https://commons.wikimedia.org/wiki/Special:FilePath/Wonder_of_the_Seas_Jan_30_2025.jpg',
  'greek-islands': 'https://commons.wikimedia.org/wiki/Special:FilePath/Celestyal_Journey_docked_off_of_Mykonos.jpg',
  'alaska-glaciers': 'https://commons.wikimedia.org/wiki/Special:FilePath/Discovery_Princess_(cropped).jpg',
  'south-pacific': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cruise_Ship_Paul_Gauguin_02.jpg',
  'antartic-expedition': 'https://commons.wikimedia.org/wiki/Special:FilePath/Le_Commandant_Charcot_during_Operation_Tugaalik_in_June_23,_2024_(1).jpg',
  'southeast-asia': 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Celebrity_Millennium_WM138.jpg',
  'south-america-magic': 'https://commons.wikimedia.org/wiki/Special:FilePath/Costa-favolosa_hg.jpg',
  'dubai-emirates': 'https://commons.wikimedia.org/wiki/Special:FilePath/MSC_Euribia.jpg'
};

const cruises = JSON.parse(fs.readFileSync('cruises.json', 'utf8'));
let changed = 0;
for (const cruise of cruises) {
  if (!cruise.buque) cruise.buque = {};
  const exactPhoto = exactShipPhotos[cruise.id];
  if (exactPhoto && cruise.buque.fotoBarco !== exactPhoto) {
    cruise.buque.fotoBarco = exactPhoto;
    changed++;
  }
}

fs.writeFileSync('cruises.json', JSON.stringify(cruises, null, 2) + '\n', 'utf8');
console.log(`Actualizadas ${changed} fotos exactas de barcos.`);
