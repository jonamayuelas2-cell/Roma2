const fs = require('fs');

const file = 'app.js';
let source = fs.readFileSync(file, 'utf8');

source = source.replace(
  /function backToSelection\(\) \{[\s\S]*?\n\}/,
  `function backToSelection() {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    const selection = document.getElementById('city-selection');
    const app = document.getElementById('main-app');

    app.classList.add('fade-out');

    setTimeout(() => {
        app.style.display = 'none';
        app.classList.remove('fade-out');
        state.currentCity = null;
        cleanupMap();

        if (state.fromCruise) {
            state.fromCruise = false;
            if (selection) {
                selection.style.display = 'none';
                selection.classList.remove('fade-in');
            }
            document.getElementById('cruise-app').style.display = 'block';
            state.isTransitioning = false;
            return;
        }

        selection.style.display = 'flex';
        selection.classList.add('fade-in');

        setTimeout(() => {
            selection.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}`
);

if (!source.includes('function openCityFromCruise(city)')) {
  source = source.replace(
    '\n// Ã¢â€¢ÂÃ¢â€¢Â CRUCEROS',
    `\nfunction openCityFromCruise(city) {
    state.fromCruise = true;
    const cruiseApp = document.getElementById('cruise-app');
    if (cruiseApp) cruiseApp.style.display = 'none';
    selectCity(city);
}\n\n// Ã¢â€¢ÂÃ¢â€¢Â CRUCEROS`
  );
}

source = source.replace(/selectCity\(matchedCity\);\s*document\.getElementById\('cruise-app'\)\.style\.display = 'none';\s*state\.fromCruise = true;/g, 'openCityFromCruise(matchedCity);');
source = source.replace(/selectCity\(fullCityData\);\s*\/\/ Ocultar app de crucero para mostrar app de ciudad\s*document\.getElementById\('cruise-app'\)\.style\.display = 'none';\s*\/\/ Marcar que venimos de un crucero para el botÃƒÂ³n volver\s*state\.fromCruise = true;/g, 'openCityFromCruise(fullCityData);');

fs.writeFileSync(file, source, 'utf8');
console.log('Cruise city back flow fixed');
