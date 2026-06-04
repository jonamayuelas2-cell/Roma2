/**
 * Descarga fotos reales de Wikimedia Commons para Venecia y las
 * redimensiona a 1200×800 JPEG usando sharp.
 * Uso: node scratch/download_venice_photos.js
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const sharp = require('sharp');

const UA = 'TravelWorldApp/1.0 (https://github.com/jonamayuelas2-cell/Roma2; jon.amayuelas2@gmail.com)';
const B  = 'https://upload.wikimedia.org/wikipedia/commons';

const photos = [
  { file: 'img/venice_hero.png',
    url:  `${B}/4/4f/Venezia_aerial_view.jpg` },
  { file: 'img/venice_sanmarco.png',
    url:  `${B}/1/17/Piazza_San_Marco_%28Venice%29_at_night-msu-2021-6449-.jpg` },
  { file: 'img/venice_rialto.png',
    url:  `${B}/0/0b/Rialto_2025_4.jpg` },
  { file: 'img/venice_accademia.png',
    url:  `${B}/1/1c/Accademia_%28Venice%29.jpg` },
  { file: 'img/venice_basilica.png',
    url:  `${B}/6/61/Venezia_Basilica_di_San_Marco_Fassade_2.jpg` },
  { file: 'img/venice_burano.png',
    url:  `${B}/c/c7/0_Burano%2C_Fondamenta_di_Cao_Moleca%2C_Rio_San_Mauro_et_Fondamenta_Cavanella_%281%29.jpg` },
  { file: 'img/venice_dogespalace.png',
    url:  `${B}/0/00/%28Venice%29_Doge%27s_Palace_and_campanile_of_St._Mark%27s_Basilica_facing_the_sea.jpg` },
  { file: 'img/venice_dorsoduro.png',
    url:  `${B}/a/a9/Basilica_Santa_Maria_della_Salute_Venice_2.jpg` },
  { file: 'img/venice_grandcanal.png',
    url:  `${B}/5/51/View_of_the_Grand_Canal_from_Rialto_to_Ca%27Foscari.jpg` },
  { file: 'img/venice_rialtomarket.png',
    url:  `${B}/5/57/Gondola_convoy%2C_Grand_Canal%2C_Venice.jpg` },
];

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
