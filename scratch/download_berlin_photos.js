/**
 * Descarga fotos reales de Wikimedia Commons para Berlín y las
 * redimensiona a 1200×800 JPEG usando sharp.
 * Uso: node scratch/download_berlin_photos.js
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const sharp = require('sharp');

const UA = 'TravelWorldApp/1.0 (https://github.com/jonamayuelas2-cell/Roma2; jon.amayuelas2@gmail.com)';
const B  = 'https://upload.wikimedia.org/wikipedia/commons';

const photos = [
  { file: 'img/berlin_hero.png',
    url:  `${B}/f/f7/Museumsinsel_Berlin_Juli_2021_1_%28cropped%29_b.jpg` },
  { file: 'img/berlin_brandenburg.png',
    url:  `${B}/a/a6/Brandenburger_Tor_abends.jpg` },
  { file: 'img/berlin_eastsidegallery.png',
    url:  `${B}/2/2b/Segment_with_Graffiti_of_the_Berlin_Wall_%283_of_4%29_%28cropped%29.jpg` },
  { file: 'img/berlin_museumisland.png',
    url:  `${B}/c/c9/Berlin_Museumsinsel_Fernsehturm.jpg` },
  { file: 'img/berlin_reichstag.png',
    url:  `${B}/0/0d/Berlin_reichstag_west_panorama_2.jpg` },
  { file: 'img/berlin_checkpointcharlie.png',
    url:  `${B}/7/75/Berlin_-_Checkpoint_Charlie_1963.jpg` },
  { file: 'img/berlin_tiergarten.png',
    url:  `${B}/0/08/Berlin_Tiergarten_Siegess%C3%A4ule_Luftansicht.jpg` },
  { file: 'img/berlin_alexanderplatz.png',
    url:  `${B}/2/28/Alexanderplatz_in_Berlin_-_Panorama.jpg` },
  { file: 'img/berlin_holocaustmemorial.png',
    url:  `${B}/f/f3/Memorial_to_the_Murdered_Jews_of_Europeabove.jpg` },
  { file: 'img/berlin_kreuzberg.png',
    url:  `${B}/1/1c/KreuzbergStreet.jpg` },
];

/** Descarga URL a un Buffer (sigue redireccionamientos) */
function fetchBuffer(url, depth = 0) {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const opts  = { headers: { 'User-Agent': UA } };
    proto.get(url, opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location, depth + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  for (const { file, url } of photos) {
    process.stdout.write(`⬇  ${file} ... `);
    try {
      const buf     = await fetchBuffer(url);
      const resized = await sharp(buf)
        .resize(1200, 800, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 82 })
        .toBuffer();
      fs.writeFileSync(file, resized);
      const kb = Math.round(resized.length / 1024);
      console.log(`✓  ${kb} KB`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }
    await wait(500);
  }
  console.log('\n✅ Listo.');
})();
