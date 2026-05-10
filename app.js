/**
 * 🌍 TravelWorld PWA - Central Application Logic
 * Versión: 2.5.0 - Estabilizada y con Mapas Interactivos
 */

// ══ CONFIGURACIÓN Y ESTADO ═══════════════════════════════════════════

const state = {
    cities: [],
    cruises: [],
    currentCity: null,
    currentCruise: null,
    currentPlace: null,
    currentPort: null,
    viewMode: 'grid', // 'grid', 'list', 'map'
    activeTab: 'lugares', // 'lugares', 'meteo'
    activeFilters: {
        continents: [],
        showCities: false,
        showCruises: false,
        cruiseRegions: []
    },
    globe: null,
    map: null, // Mapa general/cruceros
    cityExplorerMap: null, // Mapa específico de la ciudad
    portMap: null,
    countryPolygons: [],
    isTransitioning: false,
    fromCruise: false
};

const GLOBE_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const GLOBE_BUMP_URL = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const COUNTRIES_GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

// ══ UTILIDADES ═══════════════════════════════════════════════════════

function assetUrl(path) {
    if (!path) return 'https://images.unsplash.com/photo-1500835595353-b0ad2e58b8df?auto=format&fit=crop&q=80&w=800';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return path.startsWith('/') ? path.substring(1) : path;
}

function normalizeContinentName(continent) {
    return String(continent || '')
        .replace('Europa/Asia', 'Europa')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function normalizeCruiseRegion(region) {
    return String(region || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeHtml(value) {
    return cleanDisplayText(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
}

function cleanDisplayText(value) {
    return String(value ?? '')
        .replace(/â\W?a¬|â‚¬|Ã¢â€šÂ¬|¢â€šÂ¬/g, '€')
        .replace(/Â°/g, '°')
        .replace(/Â·/g, '·')
        .replace(/Ã¡|ÃƒÂ¡/g, 'á')
        .replace(/Ã©|ÃƒÂ©/g, 'é')
        .replace(/Ã­|ÃƒÂ­/g, 'í')
        .replace(/Ã³|ÃƒÂ³/g, 'ó')
        .replace(/Ãº|ÃƒÂº/g, 'ú')
        .replace(/Ã±|ÃƒÂ±/g, 'ñ')
        .replace(/Ã¼|ÃƒÂ¼/g, 'ü')
        .replace(/Ã£|ÃƒÂ£/g, 'ã')
        .trim();
}

function safeDisplayIcon(value, fallback = '•') {
    const text = String(value || '').trim();
    return /[ÃÂâðï]|Å|¢â/.test(text) ? fallback : text || fallback;
}

function getTypeLabel(type) {
    const labels = {
        history: 'Historia', nature: 'Naturaleza', food: 'Gastronomía', 
        culture: 'Cultura', shopping: 'Compras', nightlife: 'Ocio nocturno',
        monument: 'Monumento', park: 'Parque', museum: 'Museo'
    };
    return labels[type] || type;
}

function getCityIataCode(city) {
    const codes = { roma: 'FCO', paris: 'CDG', londres: 'LHR', miami: 'MIA', madrid: 'MAD', barcelona: 'BCN' };
    return city.iata || codes[city.id] || String(city.nombre || '').slice(0, 3).toUpperCase();
}

// ══ CARGA DE DATOS ══════════════════════════════════════════════════

async function loadCities() {
    try {
        const response = await fetch(`cities.json?v=${Date.now()}`);
        const data = await response.json();
        state.cities = data.map(c => ({
            ...c,
            lat: Number(c.lat),
            lng: Number(c.lng),
            continente: normalizeContinentName(c.continente)
        }));
        updateSelectionStats();
    } catch (error) {
        console.error('Error cargando ciudades:', error);
    }
}

async function loadCruises() {
    try {
        const response = await fetch('cruises.json');
        const data = await response.json();
        state.cruises = data.map(c => ({
            ...c,
            puntuacion: parseFloat((4.5 + (c.nombre.length % 5) / 10).toFixed(1))
        }));
    } catch (error) {
        console.warn('Error cargando cruceros:', error);
    }
}

async function loadCountryPolygons() {
    try {
        const response = await fetch(COUNTRIES_GEOJSON_URL);
        const geojson = await response.json();
        state.countryPolygons = geojson.features || [];
    } catch (error) {
        console.warn('Error cargando fronteras:', error);
    }
}

// ══ GLOBO 3D ═════════════════════════════════════════════════════════

function initGlobe() {
    const globeContainer = document.getElementById('globeViz');
    if (!globeContainer || !window.Globe) return;

    state.globe = Globe()(globeContainer)
        .globeImageUrl(GLOBE_TEXTURE_URL)
        .bumpImageUrl(GLOBE_BUMP_URL)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#8ee8ff')
        .atmosphereAltitude(0.28);

    const controls = state.globe.controls();
    if (controls) {
        controls.autoRotate = false;
        controls.enableDamping = true;
    }

    window.triggerRefresh = refreshGlobeData;
    setTimeout(refreshGlobeData, 500);
    state.globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 2000);
}

function refreshGlobeData() {
    if (!state.globe) return;

    const filteredCities = state.activeFilters.showCities 
        ? state.cities.filter(c => 
            state.activeFilters.continents.length === 0 || 
            state.activeFilters.continents.includes(normalizeContinentName(c.continente))
          )
        : [];

    const activeCruises = getFilteredCruiseList();
    const cruiseStops = state.activeFilters.showCruises
        ? activeCruises.flatMap(cruise => (cruise.paradas || []).map(stop => ({
            ...stop,
            cruiseId: cruise.id,
            isCruiseStop: true,
            imagen: stop.imagen || cruise.imagen || cruise.buque?.imagen
        })))
        : [];
    const stopCoords = new Set(cruiseStops.map(stop => `${Number(stop.lat).toFixed(4)},${Number(stop.lng).toFixed(4)}`));
    const displayPoints = [
        ...filteredCities.filter(city => !stopCoords.has(`${Number(city.lat).toFixed(4)},${Number(city.lng).toFixed(4)}`)),
        ...cruiseStops
    ];

    state.globe.pointsData(displayPoints)
        .pointAltitude(0.03)
        .pointRadius(d => d.isCruiseStop ? 1.5 : 1.2)
        .pointColor(d => d.isCruiseStop ? '#38bdf8' : '#ffdf5d')
        .pointLabel(d => d.nombre);

    state.globe.htmlElementsData(displayPoints)
        .htmlElement(d => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = `globe-city-marker ${d.isCruiseStop ? 'cruise-stop' : ''}`;
            el.innerHTML = `
                <div class="globe-thumb-container">
                    <img src="${assetUrl(d.imagen)}" class="globe-thumb" onerror="this.style.display='none'">
                    ${d.isCruiseStop ? '' : `<span class="globe-iata">${getCityIataCode(d)}</span>`}
                </div>
            `;
            el.onclick = (e) => {
                e.stopPropagation();
                if (d.isCruiseStop) {
                    const cruise = state.cruises.find(c => c.id === d.cruiseId);
                    if (cruise) selectCruise(cruise);
                    return;
                }
                selectCity(d);
            };
            return el;
        });

    const cruisePaths = state.activeFilters.showCruises
        ? activeCruises.map(cruise => ({
            path: (cruise.ruta || cruise.paradas || []).map(p => [p.lat, p.lng]),
            name: cruise.nombre
        })).filter(route => route.path.length > 1)
        : [];

    state.globe.pathsData(cruisePaths)
        .pathColor(() => '#38bdf8')
        .pathDashLength(0.01)
        .pathDashGap(0.005)
        .pathDashAnimateTime(12000)
        .pathStroke(2);

    if (state.countryPolygons.length > 0) {
        state.globe.polygonsData(state.countryPolygons)
            .polygonCapColor(() => 'rgba(255, 255, 255, 0.03)')
            .polygonSideColor(() => 'rgba(0,0,0,0)')
            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.1)');
    }
}

// ══ NAVEGACIÓN ═══════════════════════════════════════════════════════

async function selectCity(city) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.currentCity = city;
    state.places = city.lugares || [];
    state.filteredPlaces = [...state.places];

    applyTheme(city);
    updateUIForCity(city);

    const selection = document.getElementById('city-selection');
    const app = document.getElementById('main-app');

    selection.classList.add('fade-out');
    setTimeout(() => {
        selection.style.display = 'none';
        selection.classList.remove('fade-out');
        app.style.display = 'block';
        app.classList.add('fade-in');
        
        renderPlaces();
        renderCityExplorerMap(city);

        setTimeout(() => {
            app.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

function backToSelection() {
    if (state.isTransitioning) return;
    
    if (state.fromCruise) {
        state.fromCruise = false;
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('cruise-app').style.display = 'block';
        return;
    }

    state.isTransitioning = true;
    cleanupCityExplorerMap();

    const selection = document.getElementById('city-selection');
    const app = document.getElementById('main-app');

    app.classList.add('fade-out');
    setTimeout(() => {
        app.style.display = 'none';
        app.classList.remove('fade-out');
        selection.style.display = 'flex';
        selection.classList.add('fade-in');
        
        state.currentCity = null;
        setTimeout(() => {
            selection.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

// ══ MAPA DE CIUDAD (LEAFLET) ══════════════════════════════════════════

function renderCityExplorerMap(city) {
    const container = document.getElementById('city-explorer-map');
    if (!container) return;

    cleanupCityExplorerMap();

    state.cityExplorerMap = L.map('city-explorer-map', {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
    }).setView([city.lat, city.lng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(state.cityExplorerMap);

    const places = city.lugares || [];
    places.forEach(place => {
        if (!place.lat || !place.lng) return;

        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="marker-pin-place">
                    <div class="marker-img-wrapper">
                        <img src="${assetUrl(place.imagenCard || place.imagen)}" alt="${place.nombre}">
                    </div>
                </div>
            `,
            iconSize: [44, 44],
            iconAnchor: [22, 22]
        });

        const marker = L.marker([place.lat, place.lng], { icon }).addTo(state.cityExplorerMap);
        marker.on('click', () => showPlaceDetails(place));
        marker.bindTooltip(`<strong>${place.nombre}</strong>`, { direction: 'top', offset: [0, -10] });
    });

    if (places.length > 0) {
        const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
        state.cityExplorerMap.fitBounds(bounds, { padding: [50, 50] });
    }
}

function cleanupCityExplorerMap() {
    if (state.cityExplorerMap) {
        state.cityExplorerMap.remove();
        state.cityExplorerMap = null;
    }
}

// ══ RENDERIZADO DE LUGARES ═══════════════════════════════════════════

function renderPlaces() {
    const container = document.getElementById('places-container');
    if (!container) return;
    container.innerHTML = '';

    state.filteredPlaces.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <div class="place-img-wrapper">
                <img src="${assetUrl(place.imagenCard)}" alt="${place.nombre}" class="place-img" loading="lazy">
            </div>
            <div class="card-content">
                <span class="card-tag">${getTypeLabel(place.tipo)}</span>
                <h3 class="card-title">${place.nombre}</h3>
                <p class="card-desc">${place.descripcionCorta}</p>
            </div>
        `;
        card.onclick = () => showPlaceDetails(place);
        container.appendChild(card);
    });
    
    const countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = `${state.filteredPlaces.length} lugares encontrados`;
}

function showPlaceDetails(place) {
    state.currentPlace = place;
    const modal = document.getElementById('place-modal');
    if (!modal) return;
    
    document.getElementById('modal-place-title').textContent = place.nombre;
    document.getElementById('modal-place-desc').textContent = place.descripcion;
    document.getElementById('modal-place-img').src = assetUrl(place.imagen);
    document.getElementById('modal-place-tag').textContent = getTypeLabel(place.tipo);
    
    // Facts
    const priceEl = document.getElementById('modal-place-price');
    const hoursEl = document.getElementById('modal-place-hours');
    const ratingEl = document.getElementById('modal-place-rating');
    
    if (priceEl) priceEl.innerHTML = `💰 <strong>Precio:</strong> ${place.precio || 'Gratis / Variable'}`;
    if (hoursEl) hoursEl.innerHTML = `⏰ <strong>Horario:</strong> ${place.horario || '9:00 - 18:00'}`;
    if (ratingEl) ratingEl.innerHTML = `⭐ <strong>Puntuación:</strong> ${place.puntuacion || '4.8/5'}`;

    // Actividades
    const actContainer = document.getElementById('modal-place-activities');
    const actSection = document.getElementById('modal-activities-section');
    
    if (actContainer && place.actividades && place.actividades.length > 0) {
        actSection.hidden = false;
        actContainer.innerHTML = place.actividades.map(act => `
            <div class="activity-card">
                <img src="${assetUrl(act.imagen)}" alt="${act.titulo}" class="activity-img" loading="lazy">
                <div class="activity-info">
                    <h4>${act.titulo}</h4>
                    <p>${act.descripcion}</p>
                    <div class="activity-meta">
                        <span>⏱️ ${act.duracion || '2h'}</span>
                        <span>💰 ${act.costeEstimado || 'Consultar'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else if (actSection) {
        actSection.hidden = true;
    }

    modal.style.display = 'flex';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closePlaceDetails() {
    const modal = document.getElementById('place-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.hidden = true;
    }
    document.body.style.overflow = '';
}

// ══ TEMAS Y UI ═══════════════════════════════════════════════════════

function applyTheme(city) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', city.theme.primary);
    root.style.setProperty('--secondary-color', city.theme.secondary);
    document.body.style.fontFamily = city.theme.font;
}

function updateUIForCity(city) {
    document.getElementById('app-title').innerHTML = `${city.nombre} <span class="logo-sub">Guía de Viaje · ${city.pais}</span>`;
    document.getElementById('app-logo-icon').textContent = city.emoji;
}

function updateSelectionStats() {
    const citiesCount = document.getElementById('selection-cities-count');
    if (citiesCount) citiesCount.textContent = `${state.cities.length} ciudades`;
}

// ══ CRUCEROS (SIMPLIFICADO PARA ESTABILIDAD) ═════════════════════════

async function selectCruise(cruise) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.currentCruise = cruise;

    const selection = document.getElementById('city-selection');
    const cruiseApp = document.getElementById('cruise-app');

    selection.classList.add('fade-out');
    setTimeout(() => {
        selection.style.display = 'none';
        selection.classList.remove('fade-out');
        cruiseApp.style.display = 'block';
        cruiseApp.classList.add('fade-in');
        
        renderCruiseMap();
        renderCruiseItinerary(cruise);

        setTimeout(() => {
            cruiseApp.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

function renderCruiseMap() {
    const cruise = state.currentCruise;
    if (!cruise) return;

    if (state.map) {
        state.map.remove();
        state.map = null;
    }
    
    state.map = L.map('cruise-map', {
        zoomControl: false,
        attributionControl: false
    }).setView([cruise.paradas[0].lat, cruise.paradas[0].lng], 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png').addTo(state.map);
    
    const pathCoords = cruise.ruta ? cruise.ruta.map(p => [p.lat, p.lng]) : cruise.paradas.map(p => [p.lat, p.lng]);
    const routeLine = L.polyline(pathCoords, { color: '#38bdf8', weight: 4, opacity: 0.8 }).addTo(state.map);

    cruise.paradas.forEach(stop => {
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin-cruise"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(state.map);
        marker.bindTooltip(`<strong>${stop.nombre}</strong>`, { direction: 'top' });
        
        marker.on('click', () => {
            const matchedCity = state.cities.find(c => c.nombre.toLowerCase().includes(stop.nombre.toLowerCase()));
            if (matchedCity) {
                state.fromCruise = true;
                selectCity(matchedCity);
                document.getElementById('cruise-app').style.display = 'none';
            }
        });
    });

    state.map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
}

function renderCruiseItinerary(cruise) {
    const container = document.getElementById('cruise-itinerary-timeline');
    if (!container) return;

    container.innerHTML = cruise.paradas.map(stop => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-info">
                <span class="timeline-city">${stop.nombre}</span>
                <span class="timeline-country">${stop.pais}</span>
            </div>
        </div>
    `).join('');
}

function getFilteredCruiseList() {
    if (!state.activeFilters.showCruises) return [];
    if (!state.activeFilters.cruiseRegions.length) return state.cruises.slice(0, 10);

    const selectedRegions = state.activeFilters.cruiseRegions.map(normalizeCruiseRegion);
    const hasOthers = selectedRegions.includes(normalizeCruiseRegion('Otros'));
    const mainRegions = ['Caribe', 'Mediterraneo', 'Paises Nordicos'].map(normalizeCruiseRegion);

    return state.cruises
        .filter(cruise => {
            const cruiseRegion = normalizeCruiseRegion(cruise.region);
            if (selectedRegions.includes(cruiseRegion)) return true;
            return hasOthers && !mainRegions.includes(cruiseRegion);
        })
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, 10);
}

function getCruiseShipInfo(cruise) {
    return {
        company: cruise.compania || cruise.naviera || cruise.buque?.compania || 'Naviera premium',
        shipName: cruise.buque?.nombre || cruise.barco || cruise.nombre
    };
}

function updateCruiseList() {
    const panel = document.getElementById('cruise-list-panel');
    const container = document.getElementById('cruise-items-container');
    if (!panel || !container) return;

    const filteredCruises = getFilteredCruiseList();
    panel.style.display = filteredCruises.length ? 'flex' : 'none';
    container.innerHTML = '';

    filteredCruises.forEach((cruise, index) => {
        const route = cruise.ruta || cruise.paradas || [];
        const origin = route[0]?.nombre || 'Origen';
        const destination = route[route.length - 1]?.nombre || 'Destino';
        const shipInfo = getCruiseShipInfo(cruise);
        const image = cruise.buque?.imagen || cruise.buque?.fotoBarco || cruise.fotoBarco || cruise.imagen || 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800';
        const cities = route.map(stop => stop.nombre).filter(Boolean).join(' -> ');

        const card = document.createElement('div');
        card.className = `cruise-card ${state.currentCruise?.id === cruise.id ? 'active' : ''}`;
        card.innerHTML = `
            <span class="cruise-rank-badge">${index + 1}</span>
            <img src="${assetUrl(image)}" class="cruise-card-img" alt="${escapeHtml(cruise.nombre)}">
            <div class="cruise-card-content">
                <div class="cruise-card-title">${escapeHtml(cruise.nombre)}</div>
                <div class="cruise-ship-meta">
                    <span>${escapeHtml(shipInfo.company)}</span>
                    <strong>${escapeHtml(shipInfo.shipName)}</strong>
                </div>
                <div class="cruise-info-row">
                    <span class="cruise-info-icon">Ruta</span>
                    <span>${escapeHtml(origin)} - ${escapeHtml(destination)}</span>
                </div>
                <div class="cruise-itinerary-list">${escapeHtml(cities)}</div>
                <div class="cruise-rating-row">
                    <div class="cruise-rating">
                        <span class="stars">★ ${cruise.puntuacion}</span>
                        <span class="duration">${route.length || 0} escalas</span>
                    </div>
                    <button class="cruise-detail-btn" type="button">Ver Detalle</button>
                </div>
            </div>
        `;

        card.onclick = () => {
            state.currentCruise = cruise;
            document.querySelectorAll('.cruise-card').forEach(el => el.classList.remove('active'));
            card.classList.add('active');
            refreshGlobeData();
        };
        card.querySelector('.cruise-detail-btn').onclick = (event) => {
            event.stopPropagation();
            selectCruise(cruise);
        };

        container.appendChild(card);
    });
}

// ══ INICIALIZACIÓN ══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TravelWorld Iniciando...');
    Promise.all([loadCities(), loadCruises(), loadCountryPolygons()]).then(() => {
        initGlobe();
        setupEventListeners();
    });
});

function setupEventListeners() {
    document.getElementById('back-to-cities').onclick = backToSelection;
    document.getElementById('back-from-cruise').onclick = () => {
        document.getElementById('cruise-app').style.display = 'none';
        document.getElementById('city-selection').style.display = 'flex';
    };
    
    document.querySelectorAll('[data-close-modal]').forEach(el => el.onclick = closePlaceDetails);

    const citiesToggle = document.getElementById('cities-toggle');
    const cruiseToggle = document.getElementById('cruise-toggle');
    const continentsSub = document.getElementById('continents-sub-options');
    const cruiseRegions = document.getElementById('cruise-regions');
    const continentChecks = continentsSub ? Array.from(continentsSub.querySelectorAll('input[type="checkbox"]')) : [];
    const regionChecks = cruiseRegions ? Array.from(cruiseRegions.querySelectorAll('input[type="checkbox"]')) : [];

    const syncContinents = () => {
        state.activeFilters.continents = continentChecks
            .filter(input => input.checked)
            .map(input => normalizeContinentName(input.dataset.continent || input.value));
    };

    const syncCruiseRegions = () => {
        state.activeFilters.cruiseRegions = regionChecks
            .filter(input => input.checked)
            .map(input => input.value);
    };

    const updateFilterVisuals = () => {
        if (continentsSub) continentsSub.classList.toggle('disabled-group', !state.activeFilters.showCities);
        if (cruiseRegions) cruiseRegions.classList.toggle('disabled-group', !state.activeFilters.showCruises);
    };

    if (citiesToggle) {
        citiesToggle.checked = state.activeFilters.showCities;
        citiesToggle.addEventListener('change', () => {
            state.activeFilters.showCities = citiesToggle.checked;
            if (!citiesToggle.checked) {
                continentChecks.forEach(input => input.checked = false);
            }
            syncContinents();
            updateFilterVisuals();
            refreshGlobeData();
        });
    }

    continentChecks.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked && citiesToggle && !citiesToggle.checked) {
                citiesToggle.checked = true;
                state.activeFilters.showCities = true;
            }
            syncContinents();
            updateFilterVisuals();
            refreshGlobeData();
        });
    });

    if (cruiseToggle) {
        cruiseToggle.checked = state.activeFilters.showCruises;
        cruiseToggle.addEventListener('change', () => {
            state.activeFilters.showCruises = cruiseToggle.checked;
            if (!cruiseToggle.checked) {
                regionChecks.forEach(input => input.checked = false);
                state.currentCruise = null;
            }
            syncCruiseRegions();
            updateFilterVisuals();
            updateCruiseList();
            refreshGlobeData();
        });
    }

    regionChecks.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked && cruiseToggle && !cruiseToggle.checked) {
                cruiseToggle.checked = true;
                state.activeFilters.showCruises = true;
            }
            state.currentCruise = null;
            syncCruiseRegions();
            updateFilterVisuals();
            updateCruiseList();
            refreshGlobeData();
        });
    });

    syncContinents();
    syncCruiseRegions();
    updateFilterVisuals();
}
