const fs = require('fs');

const images = {
  'med-clasico': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=85&w=1200',
  'nordic-fjords': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=85&w=1200',
  'caribe-dream': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1200',
  'greek-islands': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=85&w=1200',
  'alaska-glaciers': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1200',
  'south-pacific': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=85&w=1200',
  'antartic-expedition': 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&q=85&w=1200',
  'southeast-asia': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1200',
  'south-america-magic': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=85&w=1200',
  'dubai-emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=1200'
};

const cruises = JSON.parse(fs.readFileSync('cruises.json', 'utf8'));
let changed = 0;
for (const cruise of cruises) {
  if (images[cruise.id] && cruise.imagen !== images[cruise.id]) {
    cruise.imagen = images[cruise.id];
    changed++;
  }
}

fs.writeFileSync('cruises.json', JSON.stringify(cruises, null, 2) + '\n', 'utf8');
console.log(`Actualizadas ${changed} imagenes de cruceros.`);
