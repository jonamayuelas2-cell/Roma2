const fs = require('fs');

const file = 'app.js';
let source = fs.readFileSync(file, 'utf8');

source = source.replace(/container\.innerHTML = '<div class="no-results">.*?No hay resultados\.<\/div>';/, "container.innerHTML = '<div class=\"no-results\">No hay resultados.</div>';");
source = source.replace(/ship\.innerHTML = '.*?';/, "ship.innerHTML = '&bull;';");
source = source.replace(
  /document\.getElementById\('app-title'\)\.innerHTML = `[\s\S]*?`;/,
  "document.getElementById('app-title').innerHTML = `${escapeHtml(city.nombre)} <span class=\"logo-sub\">Guía de Viaje · ${escapeHtml(city.pais)}</span>`;"
);
source = source.replace(
  /document\.getElementById\('app-logo-icon'\)\.textContent = safeDisplayIcon\(city\.emoji, '.*?'\);/,
  "document.getElementById('app-logo-icon').textContent = safeDisplayIcon(city.emoji, '•');"
);
source = source.replace(
  /function getWeatherIcon\(code\) \{[\s\S]*?\n\}/,
  `function getWeatherIcon(code) {
    if (code === 0) return '\\u2600\\uFE0F';
    if (code === 1 || code === 2) return '\\u26C5';
    if (code === 3) return '\\u2601\\uFE0F';
    if (code === 45 || code === 48) return '\\uD83C\\uDF2B\\uFE0F';
    if (code >= 51 && code <= 55) return '\\uD83C\\uDF26\\uFE0F';
    if (code >= 61 && code <= 65) return '\\uD83C\\uDF27\\uFE0F';
    if (code >= 71 && code <= 77) return '\\u2744\\uFE0F';
    if (code >= 80 && code <= 82) return '\\uD83C\\uDF27\\uFE0F';
    if (code >= 95) return '\\u26C8\\uFE0F';
    return '\\uD83C\\uDF21\\uFE0F';
}`
);

fs.writeFileSync(file, source, 'utf8');
console.log('Fixed visible app texts');
