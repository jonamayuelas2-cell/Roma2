/**
 * TRAVELWORLD PWA - Global Travel Guide
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
    markers: []
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
        const response = await fetch('cities.json');
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

    // Desactivar rotación automática según petición del usuario
    state.globe.controls().autoRotate = false;
    
    // Posicionar la cámara para ver Europa/África inicialmente (donde están la mayoría de nuestras ciudades actuales)
    state.globe.pointOfView({ lat: 40, lng: 10, altitude: 2.5 });
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
    document.getElementById('city-selection').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    renderPlaces();
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
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('city-selection').style.display = 'flex';
    state.currentCity = null;
    cleanupMap();
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

async function loadWeather() {
    const container = document.getElementById('weather-container');
    const { lat, lng, nombre } = state.currentCity;
    
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();
        
        const weather = data.current_weather;
        const daily = data.daily;

        container.innerHTML = `
            <div class="weather-card main-weather">
                <h2>El tiempo en ${nombre}</h2>
                <div class="weather-now">
                    <span class="temp-now">${Math.round(weather.temperature)}°C</span>
                    <span class="weather-icon-big">${getWeatherIcon(weather.weathercode)}</span>
                </div>
            </div>
            <div class="forecast-grid">
                ${daily.time.slice(0, 5).map((time, i) => `
                    <div class="forecast-item">
                        <span class="forecast-day">${new Date(time).toLocaleDateString('es-ES', {weekday: 'short'})}</span>
                        <span class="forecast-icon">${getWeatherIcon(daily.weathercode[i])}</span>
                        <span class="forecast-temp">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</span>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        container.innerHTML = '<div class="error">❌ Error de meteorología.</div>';
    }
}

// ══ EVENT LISTENERS Y UTILIDADES ═════════════════════════════

function setupEventListeners() {
    document.getElementById('back-to-cities').onclick = backToSelection;

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
    if (code === 0) return '☀️';
    if (code <= 3) return '🌤️';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌦️';
    if (code <= 82) return '🌧️';
    if (code <= 99) return '⛈️';
    return '🌡️';
}

function showPlaceDetails(place) {
    alert(`${place.nombre}\n\n${place.descripcion}\n\nPrecio: ${place.precio}\nHorario: ${place.horario}`);
}

window.showPlaceDetailsById = (id) => {
    const place = state.places.find(p => p.id === id);
    if (place) showPlaceDetails(place);
};
