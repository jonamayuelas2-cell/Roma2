const fs = require('fs');

const files = ['cities.json', 'cruises.json'];

function badness(value) {
  const text = String(value || '');
  const matches = text.match(/[ÃÂâðï�]|Å¸|Å¡|Å“|Å½|¢â|€š/g);
  return matches ? matches.length : 0;
}

function decodeOnce(value) {
  return Buffer.from(String(value), 'latin1').toString('utf8');
}

function fixText(value) {
  if (typeof value !== 'string') return value;

  let best = value;
  let bestScore = badness(best);

  for (let i = 0; i < 4; i += 1) {
    const decoded = decodeOnce(best);
    const decodedScore = badness(decoded);
    if (decodedScore <= bestScore && decoded !== best) {
      best = decoded;
      bestScore = decodedScore;
    } else {
      break;
    }
  }

  return best
    .replace(/\u00a0/g, ' ')
    .replace(/\s+€/g, ' €')
    .replace(/(\d)€/g, '$1 €');
}

function walk(value) {
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, walk(child)]));
  }
  return fixText(value);
}

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const fixed = walk(data);
  fs.writeFileSync(file, `${JSON.stringify(fixed, null, 2)}\n`, 'utf8');
  console.log(`Fixed ${file}`);
}
