const fs = require('fs');

const tracking = {
  'med-clasico': { imo: '9837420', mmsi: '256070000' },
  'nordic-fjords': { imo: '9233258', mmsi: '258465000' },
  'caribe-dream': { imo: '9838345', mmsi: '311001033' },
  'greek-islands': { imo: '8919269', mmsi: '310811000' },
  'alaska-glaciers': { imo: '9837468', mmsi: '310812000' },
  'south-pacific': { imo: '9111319', mmsi: '578001600' },
  'antartic-expedition': { imo: '9846249', mmsi: '578001700' },
  'southeast-asia': { imo: '9189419', mmsi: '249055000' },
  'south-america-magic': { imo: '9479852', mmsi: '247311100' },
  'dubai-emirates': { imo: '9901544', mmsi: '256281000' }
};

const cruises = JSON.parse(fs.readFileSync('cruises.json', 'utf8'));
let changed = 0;
for (const cruise of cruises) {
  const item = tracking[cruise.id];
  if (!item) continue;
  cruise.buque = cruise.buque || {};
  cruise.buque.imo = item.imo;
  cruise.buque.mmsi = item.mmsi;
  cruise.buque.trackingUrl = `https://www.vesselfinder.com/vessels/details/${item.imo}`;
  changed++;
}

fs.writeFileSync('cruises.json', JSON.stringify(cruises, null, 2) + '\n', 'utf8');
console.log(`Actualizados datos AIS de ${changed} cruceros.`);
