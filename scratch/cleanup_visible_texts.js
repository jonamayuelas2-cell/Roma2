const fs = require('fs');

const files = ['cities.json', 'cruises.json'];

function clean(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/â\W?a¬|â‚¬|Ã¢â€šÂ¬|¢â€šÂ¬/g, '€')
    .replace(/Â°/g, '°')
    .replace(/Â·/g, '·')
    .replace(/Ã¡|ÃƒÂ¡/g, 'á')
    .replace(/Ã©|ÃƒÂ©/g, 'é')
    .replace(/Ã­|ÃƒÂ­/g, 'í')
    .replace(/Ã³|ÃƒÂ³/g, 'ó')
    .replace(/Ãº|ÃƒÂº/g, 'ú')
    .replace(/Ã±|ÃƒÂ±/g, 'ñ')
    .replace(/Ã¼|ÃƒÂ¼/g, 'ü')
    .replace(/Ã£|ÃƒÂ£/g, 'ã')
    .replace(/Ã|ÃƒÂ/g, 'Á')
    .replace(/Ã‰|ÃƒÂ‰/g, 'É')
    .replace(/Ã|ÃƒÂ/g, 'Í')
    .replace(/Ã“|ÃƒÂ“/g, 'Ó')
    .replace(/Ãš|ÃƒÂš/g, 'Ú')
    .replace(/Ã‘|ÃƒÂ‘/g, 'Ñ')
    .replace(/ҳ/g, 'ó')
    .replace(/ҭ/g, 'í')
    .replace(/(\d)€/g, '$1 €')
    .replace(/\s+€/g, ' €')
    .replace(/�/g, '');
}

function walk(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => walk(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => {
      if (childKey === 'emoji' && typeof child === 'string' && /[ÃÂâðï�]|Å|¢â/.test(child)) {
        return [childKey, ''];
      }
      return [childKey, walk(child, childKey)];
    }));
  }
  return clean(value);
}

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file, `${JSON.stringify(walk(data), null, 2)}\n`, 'utf8');
  console.log(`Cleaned ${file}`);
}
