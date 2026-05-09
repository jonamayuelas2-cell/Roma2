const fs = require('fs');

const seasons = {
  'med-clasico': 'Abril-Octubre',
  'nordic-fjords': 'Mayo-Septiembre',
  'caribe-dream': 'Noviembre-Abril',
  'greek-islands': 'Mayo-Octubre',
  'alaska-glaciers': 'Mayo-Septiembre',
  'south-pacific': 'Abril-Noviembre',
  'antartic-expedition': 'Noviembre-Marzo',
  'southeast-asia': 'Noviembre-Marzo',
  'south-america-magic': 'Diciembre-Marzo',
  'dubai-emirates': 'Noviembre-Abril'
};

const ships = {
  'med-clasico': { compania: 'MSC Cruceros', nombre: 'MSC World Europa', imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1200' },
  'nordic-fjords': { compania: 'Hurtigruten', nombre: 'MS Trollfjord', imagen: 'https://images.unsplash.com/photo-1533619043845-df9bc7c32ee5?auto=format&fit=crop&q=80&w=1200' },
  'caribe-dream': { compania: 'Royal Caribbean', nombre: 'Wonder of the Seas', imagen: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&q=80&w=1200' },
  'greek-islands': { compania: 'Celestyal Cruises', nombre: 'Celestyal Journey', imagen: 'https://images.unsplash.com/photo-1516483642775-8129de216aae?auto=format&fit=crop&q=80&w=1200' },
  'alaska-glaciers': { compania: 'Princess Cruises', nombre: 'Discovery Princess', imagen: 'https://images.unsplash.com/photo-1533619043845-df9bc7c32ee5?auto=format&fit=crop&q=80&w=1200' },
  'south-pacific': { compania: 'Paul Gauguin Cruises', nombre: 'Paul Gauguin', imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1200' },
  'antartic-expedition': { compania: 'Ponant', nombre: 'Le Commandant Charcot', imagen: 'https://images.unsplash.com/photo-1533619043845-df9bc7c32ee5?auto=format&fit=crop&q=80&w=1200' },
  'southeast-asia': { compania: 'Celebrity Cruises', nombre: 'Celebrity Millennium', imagen: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200' },
  'south-america-magic': { compania: 'Costa Cruceros', nombre: 'Costa Favolosa', imagen: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=1200' },
  'dubai-emirates': { compania: 'MSC Cruceros', nombre: 'MSC Euribia', imagen: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200' }
};

const data = JSON.parse(fs.readFileSync('cruises.json', 'utf8'));
for (const cruise of data) {
  cruise.temporada = cruise.temporada || seasons[cruise.id] || 'Consultar temporada';
  cruise.buque = {
    ...ships[cruise.id],
    ...(cruise.buque || {})
  };
}
fs.writeFileSync('cruises.json', JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Actualizados ${data.length} cruceros con temporada y buque.`);
