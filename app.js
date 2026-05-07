/*
 * CIUDADES DEL MUNDO PWA - Global Travel Guide
    * Dinámicamente carga datos de ciudades del mundo con un selector 3D(Globe.gl).
 */

const state = {
    cities: [],
    currentCity: null,
    places: [],
    filteredPlaces: [],
    viewMode: 'cards', // 'cards', 'list', 'map'
    activeTab: 'lugares', // 'lugares', 'meteo'
    map: null,
    globe: null,
    markers: [],
    countryPolygons: [],
    isTransitioning: false
};

const ASSET_VERSION = '2026-05-07-barcelona-activities-v1';
const GLOBE_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const GLOBE_BUMP_URL = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const COUNTRIES_GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

function assetUrl(src) {
    if (!src || src.startsWith('http') || src.startsWith('data:')) return src;
    return `${src}${src.includes('?') ? '&' : '?'}v=${ASSET_VERSION}`;
}

// ══ INICIALIZACIÓN ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    await loadCities();
    await loadCountryPolygons();
    await ensureGlobeLibrary();
    initGlobe();
    setupEventListeners();
});

// ══ CARGA DE DATOS ══════════════════════════════════════════

async function loadCities() {
    try {
        const response = await fetch(`cities.json?v=${Date.now()}`, { cache: 'no-store' });
        state.cities = await response.json();
        updateSelectionStats();
    } catch (error) {
        console.error('Error cargando ciudades:', error);
    }
}

async function loadCountryPolygons() {
    try {
        const response = await fetch(COUNTRIES_GEOJSON_URL, { cache: 'force-cache' });
        const geojson = await response.json();
        state.countryPolygons = geojson.features || [];
    } catch (error) {
        console.warn('No se pudieron cargar las fronteras del mapa mundi:', error);
        state.countryPolygons = [];
    }
}

function getTotalActivitiesCount() {
    return state.cities.reduce((total, city) => {
        return total + (city.lugares || []).reduce((cityTotal, place) => {
            return cityTotal + (place.actividades?.length || 0);
        }, 0);
    }, 0);
}

function updateSelectionStats() {
    const stats = document.querySelectorAll('.selection-stats span');
    const totalPlaces = state.cities.reduce((total, city) => total + (city.lugares?.length || 0), 0);
    const totalActivities = getTotalActivitiesCount();

    if (stats[1]) stats[1].textContent = `${state.cities.length} ciudades`;
    if (stats[2]) stats[2].textContent = `${totalPlaces} lugares`;

    const activitiesEl = document.getElementById('selection-activities-count');
    if (activitiesEl) activitiesEl.textContent = `${totalActivities} actividades`;
}

function ensureGlobeLibrary() {
    if (window.Globe) return Promise.resolve();

    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/globe.gl';
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });
}

// ══ SELECTOR 3D (GLOBE) ══════════════════════════════════════

function initGlobe() {
    const globeContainer = document.getElementById('globeViz');
    if (!window.Globe) {
        renderGlobeFallback(globeContainer);
        return;
    }

    state.globe = Globe()
        (globeContainer)
        .globeImageUrl(GLOBE_TEXTURE_URL)
        .bumpImageUrl(GLOBE_BUMP_URL)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#8ee8ff')
        .atmosphereAltitude(0.28)
        .pointsData(state.cities)
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointAltitude(0.07)
        .pointRadius(0.44)
        .pointColor(() => '#ffdf5d')
        .ringsData(state.cities)
        .ringLat(d => d.lat)
        .ringLng(d => d.lng)
        .ringColor(() => t => `rgba(255, 223, 93, ${0.62 * (1 - t)})`)
        .ringMaxRadius(4.2)
        .ringPropagationSpeed(1.2)
        .ringRepeatPeriod(1900)
        .arcsData(buildGlobeArcs())
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(() => ['rgba(125,228,255,0.42)', 'rgba(255,223,93,0.86)'])
        .arcAltitude(0.24)
        .arcStroke(0.55)
        .arcDashLength(0.42)
        .arcDashGap(1.6)
        .arcDashAnimateTime(3600)
        .polygonsData(state.countryPolygons)
        .polygonCapColor(() => 'rgba(76, 175, 118, 0.22)')
        .polygonSideColor(() => 'rgba(76, 175, 118, 0.08)')
        .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.42)')
        .polygonAltitude(0.008)
        // Etiquetas de texto
        .labelsData(state.cities)
        .labelLat(d => d.lat)
        .labelLng(d => d.lng)
        .labelText(d => d.nombre)
        .labelSize(1.0)
        .labelDotRadius(0.2)
        .labelColor(() => 'rgba(255, 255, 255, 0.8)')
        .onLabelClick(city => selectCity(city))

        // Fotos directamente en el mapa (HTML Elements)
        .htmlElementsData(state.cities)
        .htmlLat(d => d.lat)
        .htmlLng(d => d.lng)
        .htmlAltitude(0.1)
        .htmlElement(d => {
            const el = document.createElement('div');
            el.className = 'globe-city-marker';
            el.innerHTML = `
                <div class="globe-thumb-container">
                    <img src="${assetUrl(d.imagen)}" class="globe-thumb">
                    <span class="globe-emoji">${d.emoji}</span>
                    
                    <div class="globe-preview-panel">
                        <img src="${assetUrl(d.imagen)}" class="preview-img">
                        <span class="preview-name">${d.nombre}</span>
                        <span class="preview-country">${d.pais}</span>
                    </div>
                </div>
            `;
            el.style.cursor = 'pointer';
            el.onclick = () => selectCity(d);
            return el;
        });

    state.globe.controls().autoRotate = true;
    state.globe.controls().autoRotateSpeed = 0.45;

    state.globe.pointOfView({ lat: 15, lng: -20, altitude: 2.25 });
}

function buildGlobeArcs() {
    return state.cities.map((city, index) => {
        const nextCity = state.cities[(index + 1) % state.cities.length];
        return {
            startLat: city.lat,
            startLng: city.lng,
            endLat: nextCity.lat,
            endLng: nextCity.lng
        };
    });
}

// ══ NAVEGACIÓN Y ESTADO ══════════════════════════════════════

function renderGlobeFallback(container) {
    container.innerHTML = `
        <div class="fallback-globe" aria-label="Bola del mundo decorativa">
            <div class="fallback-globe-map"></div>
        </div>
    `;
}

async function selectCity(city) {
    if (!city.lugares || city.lugares.length === 0) {
        alert(`Lo sentimos, la información para ${city.nombre} aún no está disponible.`);
        return;
    }

    state.currentCity = city;
    state.places = city.lugares;
    state.filteredPlaces = [...state.places];

    applyTheme(city);
    updateUIForCity(city);

    // Transición suave
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    const selection = document.getElementById('city-selection');
    const app = document.getElementById('main-app');

    selection.classList.add('fade-out');

    setTimeout(() => {
        selection.style.display = 'none';
        selection.classList.remove('fade-out');

        app.style.display = 'block';
        app.classList.add('fade-in');

        renderPlaces();

        setTimeout(() => {
            app.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

function applyTheme(city) {
    const root = document.documentElement;
    const theme = city.theme;

    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    document.body.style.fontFamily = theme.font;

    document.querySelectorAll('.logo-text, .hero h1, .tab-btn').forEach(el => {
        el.style.fontFamily = theme.font;
    });
}

function updateUIForCity(city) {
    document.getElementById('app-title').innerHTML = `${city.nombre} <span class="logo-sub">Guía de Viaje · ${city.pais}</span>`;
    document.getElementById('app-logo-icon').textContent = city.emoji;

    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroSection = document.getElementById('city-hero');

    heroTitle.textContent = `Descubre ${city.nombre}`;
    heroSubtitle.textContent = `Explora los secretos de la ciudad de ${city.nombre}`;
    heroSection.style.backgroundImage = `url('${assetUrl(city.imagen)}')`;
}

function backToSelection() {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    const selection = document.getElementById('city-selection');
    const app = document.getElementById('main-app');

    app.classList.add('fade-out');

    setTimeout(() => {
        app.style.display = 'none';
        app.classList.remove('fade-out');

        selection.style.display = 'flex';
        selection.classList.add('fade-in');

        state.currentCity = null;
        cleanupMap();

        setTimeout(() => {
            selection.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

// ══ RENDERIZADO DE LUGARES ═══════════════════════════════════

function renderPlaces() {
    const container = document.getElementById('places-container');
    container.innerHTML = '';

    if (state.viewMode === 'map') {
        container.innerHTML = '<div id="map"></div>';
        initMap();
        return;
    }

    if (state.filteredPlaces.length === 0) {
        container.innerHTML = '<div class="no-results">🔍 No hay resultados.</div>';
        return;
    }

    state.filteredPlaces.forEach(place => {
        const card = createPlaceCard(place);
        container.appendChild(card);
    });

    document.getElementById('results-count').textContent = `${state.filteredPlaces.length} lugares`;
}

function createPlaceCard(place) {
    const div = document.createElement('div');
    div.className = `place-card ${state.viewMode === 'list' ? 'list-view' : ''}`;
    div.innerHTML = `
        <div class="place-img-wrapper">
            <img src="${assetUrl(place.imagenCard)}" alt="${place.nombre}" class="place-img" loading="lazy">
        </div>
        <div class="card-content">
            <span class="card-tag">${getTypeLabel(place.tipo)}</span>
            <h3 class="card-title">${place.nombre}</h3>
            <p class="card-desc">${place.descripcionCorta}</p>
        </div>
    `;
    div.onclick = () => showPlaceDetails(place);
    return div;
}

// ══ MAPA ════════════════════════════════════════════════════

function initMap() {
    cleanupMap();
    const { lat, lng } = state.currentCity;
    state.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO'
    }).addTo(state.map);

    state.filteredPlaces.forEach(place => {
        L.marker([place.lat, place.lng]).addTo(state.map)
            .bindPopup(`<strong>${place.nombre}</strong><br>${place.descripcionCorta}`);
    });
}

function cleanupMap() {
    if (state.map) {
        state.map.remove();
        state.map = null;
    }
}

// ══ METEOROLOGÍA ════════════════════════════════════════════

// ══ METEOROLOGÍA ════════════════════════════════════════════

async function loadWeather() {
    const container = document.getElementById('weather-container');
    const { lat, lng, nombre } = state.currentCity;

    container.innerHTML = '<div class="loading"><div class="spinner"></div> Consultando satélites...</div>';

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weathercode,uv_index_max,precipitation_probability_max&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        const weather = data.current_weather;
        const daily = data.daily;
        const hourly = data.hourly;

        // Obtener humedad actual (aproximada de la hora actual)
        const currentHourIndex = new Date().getHours();
        const humidity = hourly.relativehumidity_2m[currentHourIndex];
        const feelsLike = hourly.apparent_temperature[currentHourIndex];

        container.innerHTML = `
            <div class="weather-card main-weather">
                <div class="weather-header">
                    <span class="weather-date">${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    <h2>${nombre}</h2>
                </div>
                
                <div class="weather-main-info">
                    <span class="temp-now">${Math.round(weather.temperature)}°</span>
                    <div class="weather-condition">
                        <span class="weather-icon-big">${getWeatherIcon(weather.weathercode)}</span>
                        <span class="condition-text">${getWeatherDescription(weather.weathercode)}</span>
                    </div>
                </div>

                <div class="weather-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Sensación</span>
                        <span class="stat-value">${Math.round(feelsLike)}°C</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Humedad</span>
                        <span class="stat-value">${humidity}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Viento</span>
                        <span class="stat-value">${Math.round(weather.windspeed)} km/h</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Índice UV</span>
                        <span class="stat-value">${daily.uv_index_max[0]}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Lluvia</span>
                        <span class="stat-value">${daily.precipitation_probability_max[0]}%</span>
                    </div>
                </div>
            </div>

            <div class="forecast-section">
                <h3>Próximos días</h3>
                <div class="forecast-grid">
                    ${daily.time.slice(1, 6).map((time, i) => `
                        <div class="forecast-item">
                            <span class="forecast-day">${new Date(time).toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                            <span class="forecast-icon">${getWeatherIcon(daily.weathercode[i + 1])}</span>
                            <div class="forecast-temp">
                                <span class="temp-max">${Math.round(daily.temperature_2m_max[i + 1])}°</span>
                                <span class="temp-min">${Math.round(daily.temperature_2m_min[i + 1])}°</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="error">❌ No pudimos conectar con la estación meteorológica.</div>';
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Cielo despejado',
        1: 'Principalmente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla con escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna densa',
        61: 'Lluvia débil',
        63: 'Lluvia moderada',
        65: 'Lluvia fuerte',
        71: 'Nieve débil',
        73: 'Nieve moderada',
        75: 'Nieve fuerte',
        77: 'Granizo',
        80: 'Chubascos leves',
        81: 'Chubascos moderados',
        82: 'Chubascos violentos',
        95: 'Tormenta eléctrica',
        96: 'Tormenta con granizo leve',
        99: 'Tormenta con granizo fuerte'
    };
    return descriptions[code] || 'Condiciones variables';
}

// ══ EVENT LISTENERS Y UTILIDADES ═════════════════════════════

function setupEventListeners() {
    document.getElementById('back-to-cities').onclick = backToSelection;
    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.onclick = closePlaceDetails;
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closePlaceDetails();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeTab = btn.dataset.tab;
            document.getElementById('lugares-section').style.display = state.activeTab === 'lugares' ? 'block' : 'none';
            document.getElementById('weather-section').style.display = state.activeTab === 'meteo' ? 'block' : 'none';
            document.getElementById('filters-bar').style.display = state.activeTab === 'lugares' ? 'block' : 'none';
            if (state.activeTab === 'meteo') loadWeather();
            else renderPlaces();
        };
    });

    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.onclick = () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterPlaces(chip.dataset.type, document.getElementById('search-input').value);
        };
    });

    document.getElementById('search-input').oninput = (e) => {
        const activeType = document.querySelector('.filter-chip.active').dataset.type;
        filterPlaces(activeType, e.target.value);
    };

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.viewMode = btn.dataset.view;
            renderPlaces();
        };
    });
}

function filterPlaces(type, query) {
    state.filteredPlaces = state.places.filter(p => {
        const matchesType = type === 'todos' || p.tipo === type;
        const matchesQuery = !query || p.nombre.toLowerCase().includes(query.toLowerCase()) || p.descripcion.toLowerCase().includes(query.toLowerCase());
        return matchesType && matchesQuery;
    });
    renderPlaces();
}

function getTypeLabel(type) {
    const labels = { cultura: '🏛️ Cultura', museos: '🖼️ Museos', restaurantes: '🍝 Restaurantes', barrios: '🏘️ Barrios', parques: '🌿 Parques', mercados: '🛍️ Mercados', cafes: '☕ Cafés' };
    return labels[type] || type;
}

function getWeatherIcon(code) {
    if (code === 0) return '☀️'; // Despejado
    if (code === 1 || code === 2) return '🌤️'; // Parcialmente
    if (code === 3) return '☁️'; // Nublado
    if (code === 45 || code === 48) return '🌫️'; // Niebla
    if (code >= 51 && code <= 55) return '🌦️'; // Llovizna
    if (code >= 61 && code <= 65) return '🌧️'; // Lluvia
    if (code >= 71 && code <= 77) return '❄️'; // Nieve
    if (code >= 80 && code <= 82) return '🌧️'; // Chubascos
    if (code >= 95) return '⛈️'; // Tormenta
    return '🌡️';
}

function getPlaceExtraInfo(place) {
    const cityName = state.currentCity?.nombre || 'la ciudad';
    const typeLabel = getTypeLabel(place.tipo).replace(/[^\p{L}\p{N}\s]/gu, '').trim().toLowerCase();
    const tags = (place.tags || []).slice(0, 3).join(', ');
    const rating = place.rating ? `Su valoracion de ${place.rating} sobre 5 lo situa entre las paradas mas recomendables del itinerario.` : '';
    const tagSentence = tags ? `Destaca especialmente por ${tags}, asi que funciona muy bien para viajeros que quieran algo mas que una visita rapida.` : '';

    return `Este lugar encaja dentro de ${typeLabel || 'los imprescindibles'} de ${cityName}. ${tagSentence} ${rating}`.replace(/\s+/g, ' ').trim();
}

function getRomeActivityProviders(place) {
    const common = [
        { name: 'GetYourGuide Roma', contact: 'getyourguide.com/rome', schedule: 'Salidas diarias segun disponibilidad' },
        { name: 'Civitatis Roma', contact: 'civitatis.com/roma', schedule: 'Manana y tarde, reserva online' },
        { name: 'Tiqets Roma', contact: 'tiqets.com/rome', schedule: 'Horarios variables por actividad' },
        { name: 'Walks of Italy', contact: 'walksofitaly.com/rome', schedule: 'Tours de manana, tarde y atardecer' },
        { name: 'Withlocals Roma', contact: 'withlocals.com/rome', schedule: 'Experiencias privadas bajo reserva' },
        { name: 'Roma Experience', contact: 'romaexperience.com', schedule: 'Tours privados y grupos reducidos' }
    ];

    const official = {
        'Coliseo Romano': { name: 'Parco archeologico del Colosseo', contact: 'colosseo.it', schedule: place.horario },
        'Foro Romano': { name: 'Parco archeologico del Colosseo', contact: 'colosseo.it', schedule: place.horario },
        'Fontana di Trevi': { name: 'Turismo Roma', contact: 'turismoroma.it', schedule: 'Espacio abierto 24h' },
        'Panteón de Agripa': { name: 'Pantheon Roma', contact: 'pantheonroma.com', schedule: place.horario },
        'Museos Vaticanos': { name: 'Musei Vaticani', contact: 'museivaticani.va', schedule: place.horario },
        'Trastevere': { name: 'Eating Europe', contact: 'eatingeurope.com/rome', schedule: 'Tarde y noche, reserva online' },
        'Villa Borghese': { name: 'Galleria Borghese', contact: 'galleriaborghese.beniculturali.it', schedule: place.horario },
        "Campo de' Fiori": { name: 'Mercato Campo de Fiori', contact: 'turismoroma.it', schedule: place.horario },
        'Salumeria Roscioli': { name: 'Roscioli', contact: 'roscioli.com', schedule: place.horario }
    };

    return [official[place.nombre] || common[0], ...common].slice(0, 6);
}

function getRomeActivityIdeas(place) {
    const byPlace = {
        'Coliseo Romano': [
            ['Visita guiada a la arena', 'Acceso interpretado a la zona de arena para entender el anfiteatro desde dentro.'],
            ['Subterraneos y tercer anillo', 'Recorrido por pasajes tecnicos, hipogeos y miradores superiores cuando hay cupo.'],
            ['Tour Coliseo + Foro + Palatino', 'Ruta clasica combinada para hilar la Roma imperial en una sola manana.'],
            ['Experiencia nocturna exterior', 'Paseo fotografico al caer el sol alrededor del anfiteatro iluminado.'],
            ['Ruta familiar de gladiadores', 'Actividad narrativa pensada para ninos y familias con contexto historico ligero.'],
            ['Sesion fotografica historica', 'Reportaje privado en exteriores con el Coliseo como escenario principal.']
        ],
        'Foro Romano': [
            ['Ruta arqueologica guiada', 'Lectura de templos, basilicas y vias antiguas con guia especializado.'],
            ['Palatino y origen de Roma', 'Paseo por la colina palatina para conectar mito, poder y paisaje.'],
            ['Tour de emperadores', 'Itinerario centrado en Julio Cesar, Augusto y la transformacion imperial.'],
            ['Paseo fotografico al atardecer', 'Composiciones entre ruinas, cipreses y luz dorada sobre el Foro.'],
            ['Visita combinada con Coliseo', 'Entrada y explicacion conjunta para aprovechar el billete arqueologico.'],
            ['Ruta de arquitectura romana', 'Actividad centrada en arcos, columnas, templos y tecnicas constructivas.']
        ],
        'Fontana di Trevi': [
            ['Paseo barroco nocturno', 'Ruta a pie por Trevi, plazas y fuentes iluminadas del centro historico.'],
            ['Sesion fotografica temprano', 'Fotos sin aglomeraciones en las primeras horas del dia.'],
            ['Tour de fuentes de Roma', 'Recorrido tematico por el agua, los acueductos y las fuentes monumentales.'],
            ['Ruta cine en Roma', 'Paseo por escenarios iconicos vinculados al imaginario cinematografico romano.'],
            ['Helado y plazas cercanas', 'Experiencia ligera por heladerias artesanas y rincones proximos.'],
            ['Audioguia express', 'Visita breve con contexto artistico para entender la composicion barroca.']
        ],
        'Panteón de Agripa': [
            ['Visita guiada del oculo', 'Explicacion arquitectonica de la cupula, el oculo y la luz interior.'],
            ['Tour de templos antiguos', 'Ruta por el Panteon y restos romanos del Campo Marzio.'],
            ['Concierto o experiencia musical', 'Actividad cultural cuando hay programacion especial en el entorno.'],
            ['Paseo plazas del centro', 'Itinerario por Piazza della Rotonda, Navona y calles historicas cercanas.'],
            ['Visita privada de arquitectura', 'Lectura tecnica de materiales, proporciones y transformaciones historicas.'],
            ['Ruta fotografica interior-exterior', 'Sesion para captar fachada, columnas y luz cenital.']
        ],
        'Museos Vaticanos': [
            ['Entrada guiada Museos Vaticanos', 'Recorrido por galerias esenciales, Estancias de Rafael y Capilla Sixtina.'],
            ['Primer acceso de manana', 'Visita temprana para reducir esperas y optimizar el recorrido.'],
            ['Tour arte renacentista', 'Actividad centrada en Miguel Angel, Rafael y los grandes programas papales.'],
            ['Museos + Basilica de San Pedro', 'Ruta combinada por colecciones vaticanas y entorno basilical.'],
            ['Visita familiar con guia', 'Recorrido didactico para ninos con paradas seleccionadas.'],
            ['Tour privado de arte sacro', 'Experiencia a medida para profundizar en iconografia y colecciones.']
        ],
        'Trastevere': [
            ['Tour gastronomico de noche', 'Ruta por trattorias, vinos, suppli y sabores romanos de barrio.'],
            ['Paseo de iglesias y callejones', 'Recorrido por Santa Maria in Trastevere y rincones medievales.'],
            ['Clase de pasta en Trastevere', 'Taller practico para aprender pasta fresca y salsas clasicas.'],
            ['Ruta de aperitivo romano', 'Experiencia de tarde entre bares locales y plazas animadas.'],
            ['Sesion fotografica urbana', 'Fotos entre hiedra, adoquines y fachadas ocres.'],
            ['Tour privado de vida local', 'Paseo contextual por historia, artesanos y vida cotidiana.']
        ],
        'Villa Borghese': [
            ['Galeria Borghese con guia', 'Visita a Bernini, Caravaggio y Canova con explicacion experta.'],
            ['Paseo en bicicleta o carrito', 'Recorrido relajado por jardines, lagos y miradores del parque.'],
            ['Picnic panoramico', 'Experiencia tranquila con parada en el Pincio sobre Piazza del Popolo.'],
            ['Ruta arte y naturaleza', 'Itinerario por esculturas, fuentes y paisajismo historico.'],
            ['Visita familiar al parque', 'Actividad suave para ninos con lago, jardines y espacios abiertos.'],
            ['Fotografia al atardecer', 'Sesion en miradores y avenidas arboladas con luz dorada.']
        ],
        "Campo de' Fiori": [
            ['Tour de mercado por la manana', 'Visita a puestos de frutas, flores, quesos y productos romanos.'],
            ['Clase de cocina con compra previa', 'Compra en mercado y taller de pasta o cocina romana.'],
            ['Ruta aperitivo Campo-Navona', 'Paseo de tarde por bares, plazas y calles cercanas.'],
            ['Degustacion gourmet', 'Actividad de quesos, embutidos, vinos y especialidades locales.'],
            ['Paseo historico del centro', 'Contexto de la plaza, Giordano Bruno y el tejido urbano cercano.'],
            ['Tour fotografico de mercado', 'Sesion matinal con colores, flores y vida diaria.']
        ],
        'Salumeria Roscioli': [
            ['Cata de vinos y salumi', 'Degustacion guiada de vinos italianos, quesos y embutidos seleccionados.'],
            ['Cena romana en Roscioli', 'Reserva para probar clasicos como carbonara, amatriciana y producto gourmet.'],
            ['Clase de cocina Roscioli', 'Taller culinario vinculado a pasta, producto y tecnicas romanas.'],
            ['Ruta gourmet del centro', 'Paseo por forno, salumeria y tiendas gastronomicas historicas.'],
            ['Maridaje privado', 'Experiencia a medida para vino, quesos y conservas italianas.'],
            ['Compra asesorada delicatessen', 'Seleccion de producto para llevar: pasta, vino, aceite y embutidos.']
        ]
    };

    return byPlace[place.nombre] || [
        ['Visita guiada esencial', `Recorrido interpretado por ${place.nombre} y su contexto historico.`],
        ['Paseo fotografico', 'Actividad pensada para encontrar buenos encuadres y luz adecuada.'],
        ['Tour privado a medida', 'Experiencia flexible con guia local segun intereses del viajero.'],
        ['Ruta familiar', 'Version didactica y ligera para visitar sin saturar a los mas pequenos.'],
        ['Experiencia al atardecer', 'Visita en la franja mas fotogenica del dia.'],
        ['Audioguia express', 'Formato breve para entender lo esencial con autonomia.']
    ];
}

function getIstanbulActivityProviders(place) {
    const common = [
        { name: 'Istanbul Welcome Card', contact: 'istanbulwelcomecard.com', schedule: 'Diario, recogida en hotel o punto' },
        { name: 'GetYourGuide Istanbul', contact: 'getyourguide.com/istanbul', schedule: 'Varios horarios segun temporada' },
        { name: 'Civitatis Estambul', contact: 'civitatis.com/estambul', schedule: 'Reserva previa online 24h' },
        { name: 'Tiqets Istanbul', contact: 'tiqets.com/istanbul', schedule: 'Tickets inmediatos en smartphone' },
        { name: 'Withlocals Istanbul', contact: 'withlocals.com/istanbul', schedule: 'Tours privados personalizados' },
        { name: 'Turkish Heritage', contact: 'turkishheritagetravel.com', schedule: 'Experiencias culturales profundas' }
    ];

    const official = {
        'Santa Sofia': { name: 'Ayasofya-i Kebir Cami', contact: 'muze.gen.tr', schedule: place.horario },
        'Mezquita Azul': { name: 'Sultanahmet Camii', contact: 'sultanahmetcamii.org', schedule: place.horario },
        'Palacio Topkapi': { name: 'Topkapi Sarayi', contact: 'millisaraylar.gov.tr', schedule: place.horario },
        'Gran Bazar': { name: 'Kapalicarsi Management', contact: 'kapalicarsi.com.tr', schedule: place.horario },
        'Torre de Galata': { name: 'Galata Kulesi Muze', contact: 'muze.gen.tr', schedule: place.horario },
        'Cisterna Basilica': { name: 'Yerebatan Sarnici', contact: 'yerebatan.com', schedule: place.horario }
    };

    return [official[place.nombre] || common[0], ...common].slice(0, 6);
}

function getIstanbulActivityIdeas(place) {
    const byPlace = {
        'Santa Sofia': [
            ['Tour historico bizantino', 'Recorrido centrado en los mosaicos, la cupula y la conversion en mezquita.'],
            ['Acceso prioritario y guia', 'Evita las colas principales con explicacion de un guia oficial.'],
            ['Paseo por Sultanahmet', 'Ruta a pie por la plaza que une Santa Sofia y la Mezquita Azul.'],
            ['Sesion de fotos exteriores', 'Captura la luz del atardecer sobre los minaretes y la cupula.'],
            ['Audioguia interactiva', 'Explora a tu ritmo con contexto historico en tu dispositivo.'],
            ['Charla de arquitectura', 'Actividad especializada en las tecnicas de construccion del siglo VI.']
        ],
        'Mezquita Azul': [
            ['Visita de espiritualidad', 'Explicacion del culto, los azulejos de Iznik y la arquitectura sagrada.'],
            ['Ruta de mezquitas imperiales', 'Recorrido por las principales mezquitas del centro historico.'],
            ['Fotografia de minaretes', 'Busqueda de los mejores angulos para captar los seis minaretes.'],
            ['Tour por el Hipodromo', 'Contexto sobre el obelisco y la historia romana frente a la mezquita.'],
            ['Visita nocturna iluminada', 'Paseo por los patios cuando la iluminacion resalta su silueta.'],
            ['Charla sobre artesania turca', 'Actividad centrada en los azulejos y la caligrafia del interior.']
        ],
        'Palacio Topkapi': [
            ['Ruta por el Harem', 'Visita detallada a las estancias privadas de las sultanas y el sultan.'],
            ['Tesoro y Vistas del Bosforo', 'Recorrido por las joyas imperiales y los miradores al mar.'],
            ['Jardines del Cuarto Patio', 'Paseo relajado por los pabellones y fuentes sobre el Cuerno de Oro.'],
            ['Tour de Reliquias Sagradas', 'Visita a la coleccion de objetos religiosos de gran valor historico.'],
            ['Visita a las Cocinas Reales', 'Explicacion de la logistica y la gastronomia del imperio.'],
            ['Historia del Imperio Otomano', 'Ruta contextual sobre la administracion desde este centro de poder.']
        ],
        'Gran Bazar': [
            ['Tour de compras y regateo', 'Consejos de un local para navegar y comprar alfombras o joyas.'],
            ['Ruta de artesanos ocultos', 'Visita a talleres tradicionales de orfebreria y ceramica.'],
            ['Paseo por los Hanes', 'Exploracion de los antiguos caravasares que rodean el bazar.'],
            ['Degustacion de Cafe Turco', 'Parada en los cafes mas antiguos y con mas encanto del laberinto.'],
            ['Fotografia de lamparas', 'Sesion centrada en los colores y luces de los pasillos interiores.'],
            ['Historia de la Ruta de la Seda', 'Contexto sobre el papel de Estambul en el comercio mundial.']
        ],
        'Bazar de las Especias': [
            ['Ruta de Sabores y Aromas', 'Cata guiada de especias, frutos secos y delicias turcas.'],
            ['Taller de Lokum (Turkish Delight)', 'Demostracion y degustacion de los dulces mas famosos.'],
            ['Compra de Te Guiada', 'Seleccion de mezclas de flores y hierbas locales.'],
            ['Mercado de Eminonu', 'Paseo por los alrededores del bazar y el puerto.'],
            ['Fotografia de Montanas de Especias', 'Captura el colorido visual de los puestos tradicionales.'],
            ['Degustacion de Quesos y Olivas', 'Exploracion de los productos frescos del mercado exterior.']
        ],
        'Torre de Galata': [
            ['Vistas 360 grados', 'Acceso al mirador para ver toda Estambul desde las alturas.'],
            ['Barrio Genoves de Galata', 'Paseo por las calles empinadas, tiendas de diseño y musica.'],
            ['Ruta de Cafes en Beyoglu', 'Exploracion de la vida social y bohemia de los alrededores.'],
            ['Atardecer sobre el Cuerno de Oro', 'Experiencia fotografica con la mejor luz del dia.'],
            ['Historia Medieval de la Torre', 'Contexto sobre la defensa de la ciudad y los genoveses.'],
            ['Paseo hasta el Puente de Galata', 'Ruta descendente conectando con los pescadores del puente.']
        ],
        'Crucero por el Bosforo': [
            ['Navegacion al Atardecer', 'Crucero publico o compartido para ver las siluetas de la ciudad.'],
            ['Crucero Privado de Lujo', 'Experiencia exclusiva para ver palacios y yalis de madera.'],
            ['Desayuno en el Barco', 'Mañana relajada navegando entre Europa y Asia.'],
            ['Ruta de Palacios Costeros', 'Explicacion de Dolmabahce y Beylerbeyi desde el agua.'],
            ['Tour Nocturno con Cena', 'Espectaculo de danzas tradicionales y vistas iluminadas.'],
            ['Paseo por la Costa Asiatica', 'Parada en barrios como Kanlica o Kuzguncuk.']
        ],
        'Cisterna Basilica': [
            ['Bosque Subterraneo', 'Recorrido por las columnas romanas y las cabezas de Medusa.'],
            ['Leyendas de Bizancio', 'Historias y mitos asociados a este deposito de agua.'],
            ['Experiencia Sonora y Eco', 'Momento de silencio para apreciar la acustica del lugar.'],
            ['Fotografia de Reflejos', 'Captura de la luz sobre el agua y las columnas milenarias.'],
            ['Ingenieria Hidraulica Romana', 'Charla tecnica sobre como se abastecia la ciudad.'],
            ['Visita Privada Nocturna', 'Acceso exclusivo con iluminacion especial segun calendario.']
        ],
        'Palacio Dolmabahce': [
            ['Tour de Lujo y Cristal', 'Visita al salon de ceremonias y la gran escalera de baccarat.'],
            ['Jardines Imperiales', 'Paseo por los jardines frente al Bosforo y la Torre del Reloj.'],
            ['Estancias de Ataturk', 'Visita a la parte del palacio vinculada a la historia moderna.'],
            ['Ruta de Pintura y Arte', 'Exploracion de las colecciones de arte europeo y otomano.'],
            ['Arquitectura del Siglo XIX', 'Contexto sobre la transicion del estilo otomano al europeo.'],
            ['Fotografia de Puertas Imperiales', 'Captura de la majestuosidad de las entradas al palacio.']
        ]
    };

    return byPlace[place.nombre] || [
        ['Visita guiada esencial', `Recorrido interpretado por ${place.nombre} y su contexto historico.`],
        ['Paseo fotografico', 'Actividad pensada para encontrar buenos encuadres y luz adecuada.'],
        ['Tour privado a medida', 'Experiencia flexible con guia local segun intereses del viajero.'],
        ['Ruta familiar', 'Version didactica y ligera para visitar sin saturar a los mas pequenos.'],
        ['Experiencia al atardecer', 'Visita en la franja mas fotogenica del dia.'],
        ['Audioguia express', 'Formato breve para entender lo esencial con autonomia.']
    ];
}

function getPlaceActivities(place) {
    const cityId = state.currentCity?.id;

    // Soporte para actividades estructuradas en el JSON (Premium)
    if (place.actividades && place.actividades.length > 0) {
        return place.actividades.map((act, index) => ({
            title: act.titulo || act.title,
            description: act.descripcion || act.description,
            image: act.imagen || act.image || place.imagenCard || place.imagen || getActivityImage(cityId, place, index),
            provider: act.proveedor || act.provider,
            contact: act.contacto || act.contact,
            schedule: act.horario || act.schedule
        }));
    }

    if (cityId === 'roma') {
        const providers = getRomeActivityProviders(place);
        return getRomeActivityIdeas(place).slice(0, 6).map(([title, description], index) => ({
            title,
            description,
            image: getActivityImage(cityId, place, index),
            provider: providers[index].name,
            contact: providers[index].contact,
            schedule: providers[index].schedule
        }));
    } else if (cityId === 'estambul') {
        const providers = getIstanbulActivityProviders(place);
        return getIstanbulActivityIdeas(place).slice(0, 6).map(([title, description], index) => ({
            title,
            description,
            image: getActivityImage(cityId, place, index),
            provider: providers[index].name,
            contact: providers[index].contact,
            schedule: providers[index].schedule
        }));
    }

    return [];
}

function getActivityImage(cityId, place, index) {
    const slug = place.nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '')
        .replace(/^$/, 'actividad');

    return `img/${cityId}_activities/${slug}_${index + 1}.png`;
}

function renderPlaceActivities(place) {
    const section = document.getElementById('modal-activities-section');
    const container = document.getElementById('modal-place-activities');
    const activities = getPlaceActivities(place);

    if (!activities.length) {
        section.hidden = true;
        container.innerHTML = '';
        return;
    }

    section.hidden = false;
    container.innerHTML = activities.map(activity => `
        <article class="activity-card">
            <img src="${assetUrl(activity.image)}" alt="${activity.title}">
            <div class="activity-card-body">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <dl>
                    <div><dt>Empresa</dt><dd>${activity.provider}</dd></div>
                    <div><dt>Contacto</dt><dd>${activity.contact}</dd></div>
                    <div><dt>Horario</dt><dd>${activity.schedule}</dd></div>
                </dl>
            </div>
        </article>
    `).join('');
}

function showPlaceDetails(place) {
    const modal = document.getElementById('place-modal');
    document.getElementById('modal-place-img').src = assetUrl(place.imagen || place.imagenCard);
    document.getElementById('modal-place-img').alt = place.nombre;
    document.getElementById('modal-place-tag').textContent = getTypeLabel(place.tipo);
    document.getElementById('modal-place-title').textContent = place.nombre;
    document.getElementById('modal-place-desc').textContent = place.descripcion || place.descripcionCorta;
    document.getElementById('modal-place-extra').textContent = getPlaceExtraInfo(place);
    document.getElementById('modal-place-price').textContent = `Precio: ${place.precio || 'Consultar'}`;
    document.getElementById('modal-place-hours').textContent = `Horario: ${place.horario || 'Consultar'}`;
    document.getElementById('modal-place-rating').textContent = `Valoracion: ${place.rating || '4.7'} / 5`;
    renderPlaceActivities(place);
    document.getElementById('modal-place-tags').innerHTML = (place.tags || [])
        .map(tag => `<span>${tag}</span>`)
        .join('');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closePlaceDetails() {
    const modal = document.getElementById('place-modal');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
}

window.showPlaceDetailsById = (id) => {
    const place = state.places.find(p => p.id === id);
    if (place) showPlaceDetails(place);
};
