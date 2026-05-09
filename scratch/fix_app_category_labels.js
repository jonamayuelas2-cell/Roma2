const fs = require('fs');

const file = 'app.js';
let source = fs.readFileSync(file, 'utf8');

const replacement = `function getTypeLabel(type) {
    const labels = {
        cultura: 'Cultura',
        museos: 'Museos',
        restaurantes: 'Restaurantes',
        barrios: 'Barrios',
        parques: 'Parques',
        mercados: 'Mercados',
        cafes: 'Cafes'
    };
    return labels[type] || type;
}`;

source = source.replace(/function getTypeLabel\(type\) \{[\s\S]*?\n\}/, replacement);
fs.writeFileSync(file, source, 'utf8');
console.log('Fixed category labels in app.js');
