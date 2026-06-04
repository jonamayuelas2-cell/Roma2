/**
 * Descarga fotos reales de Wikimedia Commons para Viena y las
 * redimensiona a 1200×800 JPEG usando sharp.
 * Uso: node scratch/download_vienna_photos.js
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const sharp = require('sharp');

const UA = 'TravelWorldApp/1.0 (https://github.com/jonamayuelas2-cell/Roma2; jon.amayuelas2@gmail.com)';
const B  = 'https://upload.wikimedia.org/wikipedia/commons';

const photos = [
  { file: 'img/vienna_hero.png',
    url:  `${B}/9/9f/Vienna_Austria_Skyline_Aerial%2C_October_2024.jpg` },
  { file: 'img/vienna_schonbrunn.png',
    url:  `${B}/c/c9/Wien_-_Schloss_Sch%C3%B6nbrunn.JPG` },
  { file: 'img/vienna_stephansdom.png',
    url:  `${B}/d/dd/Wien_-_Stephansdom_%281%29.JPG` },
  { file: 'img/vienna_belvedere.png',
    url:  `${B}/8/84/Palacio_Belvedere%2C_Viena%2C_Austria%2C_2020-02-01%2C_DD_93-95_HDR.jpg` },
  { file: 'img/vienna_cafecentral.png',
    url:  `${B}/9/92/Palais_Ferstel.jpg` },
  { file: 'img/vienna_hofburg.png',
    url:  `${B}/3/31/Wien_-_Neue_Hofburg.JPG` },
  { file: 'img/vienna_museumsquartier.png',
    url:  `${B}/0/06/MuseumsQuartier_Wien_Sept_2020_1.jpg` },
  { file: 'img/vienna_naschmarkt.png',
    url:  `${B}/a/a4/Naschmarkt_Market_Scene%2C_Vienna.jpg` },
  { file: 'img/vienna_prater.png',
    url:  `${B}/3/30/Wien_Riesenrad.jpg` },
  { file: 'img/vienna_stateopera.png',
    url:  `${B}/9/94/Wiener_Staatsoper_Front.jpg` },
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
