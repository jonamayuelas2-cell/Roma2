const fs = require('fs');

const file = 'app.js';
let source = fs.readFileSync(file, 'utf8');

source = source.replace(
  /if \(portSubtitle\) portSubtitle\.textContent = `[^`]+`;\s*\n\s*setTimeout\(\(\) => renderPortMap\(stop\), 100\);/,
  (match) => match.replace('setTimeout(() => renderPortMap(stop), 100);', 'renderPortInfoPanel(stop);\n\n    setTimeout(() => renderPortMap(stop), 100);')
);

const helper = `
function getPortFacts(stop) {
    const factsByCountry = {
        'España': { poblacion: 'Consultar por municipio', idioma: 'Español', moneda: 'Euro' },
        'Francia': { poblacion: 'Consultar por municipio', idioma: 'Francés', moneda: 'Euro' },
        'Italia': { poblacion: 'Consultar por municipio', idioma: 'Italiano', moneda: 'Euro' },
        'Grecia': { poblacion: 'Consultar por municipio', idioma: 'Griego', moneda: 'Euro' },
        'Turquía': { poblacion: 'Consultar por municipio', idioma: 'Turco', moneda: 'Lira turca' },
        'Noruega': { poblacion: 'Consultar por municipio', idioma: 'Noruego', moneda: 'Corona noruega' },
        'Dinamarca': { poblacion: 'Consultar por municipio', idioma: 'Danés', moneda: 'Corona danesa' },
        'Suecia': { poblacion: 'Consultar por municipio', idioma: 'Sueco', moneda: 'Corona sueca' },
        'Finlandia': { poblacion: 'Consultar por municipio', idioma: 'Finés y sueco', moneda: 'Euro' },
        'Islandia': { poblacion: 'Consultar por municipio', idioma: 'Islandés', moneda: 'Corona islandesa' },
        'Estados Unidos': { poblacion: 'Consultar por municipio', idioma: 'Inglés', moneda: 'Dólar estadounidense' },
        'Canadá': { poblacion: 'Consultar por municipio', idioma: 'Inglés y francés', moneda: 'Dólar canadiense' },
        'Bahamas': { poblacion: 'Consultar por municipio', idioma: 'Inglés', moneda: 'Dólar bahameño' },
        'Puerto Rico': { poblacion: 'Consultar por municipio', idioma: 'Español e inglés', moneda: 'Dólar estadounidense' },
        'República Dominicana': { poblacion: 'Consultar por municipio', idioma: 'Español', moneda: 'Peso dominicano' },
        'Croacia': { poblacion: 'Consultar por municipio', idioma: 'Croata', moneda: 'Euro' },
        'Montenegro': { poblacion: 'Consultar por municipio', idioma: 'Montenegrino', moneda: 'Euro' },
        'Malta': { poblacion: 'Consultar por municipio', idioma: 'Maltés e inglés', moneda: 'Euro' },
        'Túnez': { poblacion: 'Consultar por municipio', idioma: 'Árabe', moneda: 'Dinar tunecino' },
        'Argentina': { poblacion: 'Consultar por municipio', idioma: 'Español', moneda: 'Peso argentino' },
        'Brasil': { poblacion: 'Consultar por municipio', idioma: 'Portugués', moneda: 'Real brasileño' },
        'Uruguay': { poblacion: 'Consultar por municipio', idioma: 'Español', moneda: 'Peso uruguayo' },
        'Emiratos Árabes Unidos': { poblacion: 'Consultar por municipio', idioma: 'Árabe', moneda: 'Dírham emiratí' },
        'Catar': { poblacion: 'Consultar por municipio', idioma: 'Árabe', moneda: 'Riyal catarí' },
        'Omán': { poblacion: 'Consultar por municipio', idioma: 'Árabe', moneda: 'Rial omaní' },
        'Tailandia': { poblacion: 'Consultar por municipio', idioma: 'Tailandés', moneda: 'Baht tailandés' },
        'Singapur': { poblacion: 'Consultar por municipio', idioma: 'Inglés, malayo, mandarín y tamil', moneda: 'Dólar de Singapur' },
        'Vietnam': { poblacion: 'Consultar por municipio', idioma: 'Vietnamita', moneda: 'Dong vietnamita' },
        'China': { poblacion: 'Consultar por municipio', idioma: 'Chino', moneda: 'Yuan chino' },
        'Polinesia Francesa': { poblacion: 'Consultar por municipio', idioma: 'Francés y tahitiano', moneda: 'Franco CFP' }
    };
    return {
        poblacion: stop.poblacion || factsByCountry[stop.pais]?.poblacion || 'Consultar',
        idioma: stop.idioma || factsByCountry[stop.pais]?.idioma || 'Consultar',
        moneda: stop.moneda || factsByCountry[stop.pais]?.moneda || 'Consultar'
    };
}

function renderPortInfoPanel(stop) {
    const panel = document.getElementById('port-info-panel');
    if (!panel) return;
    const facts = getPortFacts(stop);
    const places = (stop.lugares && stop.lugares.length > 0) ? stop.lugares : [{
        nombre: \`Centro histórico de \${stop.nombre}\`,
        descripcionCorta: \`Paseo recomendado por el entorno de \${stop.nombre}.\`,
        actividades: []
    }];
    const activities = places.flatMap(place => (place.actividades || []).map(activity => ({
        title: activity.titulo || activity.title || 'Actividad recomendada',
        description: activity.descripcion || activity.description || activity.horario || 'Experiencia local recomendada durante la escala.',
        cost: activity.costeEstimado || activity.coste || activity.precio || 'Consultar'
    }))).slice(0, 6);
    const fallbackActivities = activities.length ? activities : [
        { title: 'Paseo panorámico', description: 'Recorrido por miradores, puerto y principales calles del centro.', cost: '25-70 €' },
        { title: 'Ruta gastronómica local', description: 'Degustación de productos típicos y cocina de la zona.', cost: '25-90 €' },
        { title: 'Visita cultural guiada', description: 'Introducción a la historia, arquitectura y vida local de la escala.', cost: '20-60 €' }
    ];
    const bg = stop.imagen || places[0]?.imagenCard || places[0]?.imagen || '';
    panel.style.setProperty('--port-bg-img', \`url('\${assetUrl(bg)}')\`);
    panel.innerHTML = \`
        <div class="port-info-hero">
            <span class="port-kicker">Escala de crucero</span>
            <h3>\${escapeHtml(stop.nombre)}</h3>
            <p>\${escapeHtml(stop.pais || 'Destino internacional')}</p>
        </div>
        <div class="port-facts-grid">
            <div><span>Nombre</span><strong>\${escapeHtml(stop.nombre)}</strong></div>
            <div><span>Población</span><strong>\${escapeHtml(facts.poblacion)}</strong></div>
            <div><span>Idioma</span><strong>\${escapeHtml(facts.idioma)}</strong></div>
            <div><span>Moneda oficial</span><strong>\${escapeHtml(facts.moneda)}</strong></div>
        </div>
        <div class="port-info-columns">
            <section>
                <h4>Lugares a visitar</h4>
                <div class="port-mini-list">
                    \${places.slice(0, 6).map(place => \`
                        <article>
                            <strong>\${escapeHtml(place.nombre)}</strong>
                            <p>\${escapeHtml(place.descripcionCorta || place.descripcion || 'Punto recomendado durante la escala.')}</p>
                        </article>
                    \`).join('')}
                </div>
            </section>
            <section>
                <h4>Actividades a realizar</h4>
                <div class="port-mini-list">
                    \${fallbackActivities.map(activity => \`
                        <article>
                            <strong>\${escapeHtml(activity.title)}</strong>
                            <p>\${escapeHtml(activity.description)}</p>
                            <span>\${escapeHtml(activity.cost)}</span>
                        </article>
                    \`).join('')}
                </div>
            </section>
        </div>
    \`;
}

`;

if (!source.includes('function renderPortInfoPanel(stop)')) {
  source = source.replace('\nfunction renderPortMap(stop) {', `\n${helper}function renderPortMap(stop) {`);
}

fs.writeFileSync(file, source, 'utf8');
console.log('Port info panel added');
