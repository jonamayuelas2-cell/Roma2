/**
 * CIUDADES DEL MUNDO PWA - Global Travel Guide
 * Dinámicamente carga datos de ciudades del mundo con un selector 3D (Globe.gl).
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
    isTransitioning: false
};

// ══ INICIALIZACIÓN ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    await loadCities();
    initGlobe();
    setupEventListeners();
});

// ══ CARGA DE DATOS ══════════════════════════════════════════

async function loadCities() {
    try {
        const response = await fetch(`cities.json?v=${Date.now()}`, { cache: 'no-store' });
        state.cities = await response.json();
    } catch (error) {
        console.error('Error cargando ciudades:', error);
    }
}

// ══ SELECTOR 3D (GLOBE) ══════════════════════════════════════

function initGlobe() {
    const globeContainer = document.getElementById('globeViz');
    
    state.globe = Globe()
        (globeContainer)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor('#7de4ff')
        .atmosphereAltitude(0.22)
        .pointsData(state.cities)
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointAltitude(0.04)
        .pointRadius(0.34)
        .pointColor(() => '#fdbb2d')
        .ringsData(state.cities)
        .ringLat(d => d.lat)
        .ringLng(d => d.lng)
        .ringColor(() => t => `rgba(125, 228, 255, ${0.55 * (1 - t)})`)
        .ringMaxRadius(4.2)
        .ringPropagationSpeed(1.2)
        .ringRepeatPeriod(1900)
        .arcsData(buildGlobeArcs())
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(() => ['rgba(125,228,255,0.25)', 'rgba(253,187,45,0.78)'])
        .arcAltitude(0.24)
        .arcStroke(0.55)
        .arcDashLength(0.42)
        .arcDashGap(1.6)
        .arcDashAnimateTime(3600)
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
        .htmlElement(d => {
            const el = document.createElement('div');
            el.className = 'globe-city-marker';
            el.innerHTML = `
                <div class="globe-thumb-container">
                    <img src="${d.imagen}" class="globe-thumb">
                    <span class="globe-emoji">${d.emoji}</span>
                    
                    <div class="globe-preview-panel">
                        <img src="${d.imagen}" class="preview-img">
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
    heroSection.style.backgroundImage = `url('${city.imagen}')`;
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
        <img src="${place.imagenCard}" alt="${place.nombre}" class="card-img" loading="lazy">
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
                            <span class="forecast-day">${new Date(time).toLocaleDateString('es-ES', {weekday: 'long'})}</span>
                            <span class="forecast-icon">${getWeatherIcon(daily.weathercode[i+1])}</span>
                            <div class="forecast-temp">
                                <span class="temp-max">${Math.round(daily.temperature_2m_max[i+1])}°</span>
                                <span class="temp-min">${Math.round(daily.temperature_2m_min[i+1])}°</span>
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

function showPlaceDetails(place) {
    const modal = document.getElementById('place-modal');
    document.getElementById('modal-place-img').src = place.imagen || place.imagenCard;
    document.getElementById('modal-place-img').alt = place.nombre;
    document.getElementById('modal-place-tag').textContent = getTypeLabel(place.tipo);
    document.getElementById('modal-place-title').textContent = place.nombre;
    document.getElementById('modal-place-desc').textContent = place.descripcion || place.descripcionCorta;
    document.getElementById('modal-place-price').textContent = `Precio: ${place.precio || 'Consultar'}`;
    document.getElementById('modal-place-hours').textContent = `Horario: ${place.horario || 'Consultar'}`;
    document.getElementById('modal-place-rating').textContent = `Valoracion: ${place.rating || '4.7'} / 5`;
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
