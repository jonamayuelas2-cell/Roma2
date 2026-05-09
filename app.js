/**
 * TravelWorld PWA - Main Application Script
 * Optimized for premium experience and 3D globe visualization
 */

const state = {
    cities: [],
    cruises: [],
    activeFilters: {
        showCities: true,
        showCruises: false,
        continents: [],
        cruiseRegions: []
    },
    currentCity: null,
    places: [],
    filteredPlaces: [],
    viewMode: 'cards',
    activeTab: 'lugares',
    map: null,
    globe: null,
    markers: [],
    countryPolygons: [],
    isTransitioning: false,
    currentCruise: null,
    currentPort: null,
    portMap: null
};

const ASSET_VERSION = '2026-05-08-auckland-activity-photos-v1';
const GLOBE_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const GLOBE_BUMP_URL = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const COUNTRIES_GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

function assetUrl(src) {
    if (!src || src.startsWith('http') || src.startsWith('data:')) return src;
    const baseSrc = src.split('?')[0];
    return `${baseSrc}?v=${ASSET_VERSION}`;
}

// FunciÃ³n para llamar a mÃ©todos de Globe.gl de forma segura
function callGlobe(method, ...args) {
    if (!state.globe || typeof state.globe[method] !== 'function') return false;
    try {
        state.globe[method](...args);
        return true;
    } catch (error) {
        console.warn(`Globe.gl no pudo aplicar ${method}:`, error);
        return false;
    }
}


// â•â• INICIALIZACIÃ“N â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
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
        .replace(/Ã|ÃƒÂ/g, 'Á')
        .replace(/Ã‰|ÃƒÂ‰/g, 'É')
        .replace(/Ã|ÃƒÂ/g, 'Í')
        .replace(/Ã“|ÃƒÂ“/g, 'Ó')
        .replace(/Ãš|ÃƒÂš/g, 'Ú')
        .replace(/Ã‘|ÃƒÂ‘/g, 'Ñ')
        .replace(/ҳ/g, 'ó')
        .replace(/ҭ/g, 'í')
        .replace(/�/g, '')
        .replace(/\s+€/g, ' €')
        .replace(/(\d)€/g, '$1 €')
        .trim();
}

function safeDisplayIcon(value, fallback = '•') {
    const text = String(value || '').trim();
    return /[ÃÂâðï�]|Å|¢â/.test(text) ? fallback : text || fallback;
}

function getWebsiteUrl(value) {
    const text = String(value || '').trim();
    if (!text || text.includes('@')) return null;

    const match = text.match(/^(https?:\/\/|www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/[^\s]*)?$/i);
    if (!match) return null;

    return /^https?:\/\//i.test(text) ? text : `https://${text.replace(/^www\./i, 'www.')}`;
}

function renderContactValue(value) {
    const text = String(value || 'Consultar').trim();
    const url = getWebsiteUrl(text);
    if (!url) return escapeHtml(text);

    return `<a class="external-contact-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
}

function renderWebValue(value) {
    const text = String(value || '').trim();
    const url = getWebsiteUrl(text);
    if (!url) return '';

    return `<a class="external-contact-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('ðŸš€ Iniciando TravelWorld PWA...');
    Promise.all([loadCities(), loadCruises()]).then(() => {
        ensureGlobeLibrary().then(() => {
            initGlobe();
            setupEventListeners();
            setupGlobeFilters();
        });
    });
    loadCountryPolygons();
});

async function loadCruises() {
    try {
        const response = await fetch('cruises.json');
        const data = await response.json();
        state.cruises = data.map(c => ({
            ...c,
            puntuacion: parseFloat((4.5 + (c.nombre.length % 5) / 10).toFixed(1))
        }));
        console.log('ðŸ›³ï¸ Cruceros cargados con puntuaciones');
    } catch (error) {
        console.warn('No se pudieron cargar los cruceros:', error);
    }
}

// â•â• CARGA DE DATOS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function loadCities() {
    try {
        console.log('ðŸ“¦ Solicitando cities.json...');
        const response = await fetch(`cities.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        state.cities = data.map(c => ({
            ...c,
            lat: Number(c.lat),
            lng: Number(c.lng),
            continente: normalizeContinentName(c.continente)
        }));
        console.log('ðŸ“ Datos de ciudades obtenidos y normalizados');
        updateSelectionStats();
    } catch (error) {
        console.error('Error cargando ciudades:', error);
        state.cities = [];
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


// â•â• SELECTOR 3D (GLOBE) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function initGlobe() {
    const globeContainer = document.getElementById('globeViz');
    if (!globeContainer) return;

    if (!window.Globe) {
        console.warn('âš ï¸ Globe.gl no disponible, usando fallback');
        renderGlobeFallback(globeContainer);
        return;
    }

    console.log('ðŸŒ Inicializando globo 3D...');
    state.globe = Globe()
        (globeContainer)
        .globeImageUrl(GLOBE_TEXTURE_URL)
        .bumpImageUrl(GLOBE_BUMP_URL)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#8ee8ff')
        .atmosphereAltitude(0.28);

    // ConfiguraciÃ³n de controles inicial
    const controls = state.globe.controls();
    if (controls) {
        controls.autoRotate = false;
        controls.enableDamping = true;
    }

    // FunciÃ³n para refrescar datos de forma segura
    const refreshData = () => {
        if (!state.globe) return;
        
        // Filtrar ciudades por continente (solo si showCities está activo)
        const filteredCities = state.activeFilters.showCities 
            ? state.cities.filter(c => state.activeFilters.continents.includes(normalizeContinentName(c.continente)))
            : [];

        // Obtener cruceros activos para el globo
        let activeCruises = [];
        if (state.activeFilters.showCruises) {
            if (state.currentCruise) {
                activeCruises = [state.currentCruise];
            }
        }

        // Combinar paradas de cruceros con ciudades (si activo)
        let displayPoints = [...filteredCities];
        if (state.activeFilters.showCruises) {
            // Para evitar duplicados y dar prioridad al crucero, 
            // filtramos ciudades que coincidan en coordenadas con las paradas
            const stopCoords = activeCruises.flatMap(c => c.paradas.map(p => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`));
            displayPoints = displayPoints.filter(city => !stopCoords.includes(`${city.lat.toFixed(4)},${city.lng.toFixed(4)}`));
            
            activeCruises.forEach(cruise => {
                displayPoints = [...displayPoints, ...cruise.paradas];
            });
        }

        console.log(`ðŸ“ Aplicando ${displayPoints.length} puntos al globo...`);
        
        callGlobe('pointsData', displayPoints);
        callGlobe('pointAltitude', 0.035);
        callGlobe('pointRadius', 1.5);
        callGlobe('pointColor', d => d.id && d.id.toString().startsWith('stop-') ? '#38bdf8' : '#ffdf5d');
        
        callGlobe('labelsData', displayPoints);
        callGlobe('labelLat', d => d.lat);
        callGlobe('labelLng', d => d.lng);
        callGlobe('labelText', d => d.nombre);
        callGlobe('labelSize', d => d.id && d.id.toString().startsWith('stop-') ? 1.4 : 1.8);
        callGlobe('labelColor', d => d.id && d.id.toString().startsWith('stop-') ? '#38bdf8' : '#ffffff');
        callGlobe('labelAltitude', 0.05);

        callGlobe('htmlElementsData', displayPoints);
        callGlobe('htmlElement', d => {
            const el = document.createElement('button');
            el.type = 'button';
            const isStop = d.id && d.id.toString().startsWith('stop-');
            el.className = `globe-city-marker ${isStop ? 'cruise-stop' : ''}`;
            el.innerHTML = `
                <div class="globe-thumb-container">
                    <img src="${assetUrl(d.imagen)}" class="globe-thumb" onerror="this.style.display='none'">
                    ${!isStop ? `<span class="globe-emoji">${safeDisplayIcon(d.emoji)}</span>` : ''}
                </div>
            `;
            el.onclick = (ev) => { 
                ev.stopPropagation(); 
                if (isStop) {
                    // Si es una parada de crucero, buscamos el crucero al que pertenece
                    const cruise = state.cruises.find(c => c.paradas.some(p => p.id === d.id));
                    if (cruise) selectCruise(cruise);
                } else {
                    selectCity(d); 
                }
            };
            return el;
        });

        // Dibujar rutas de cruceros (Rutas en superficie para barcos con estilo premium)
        const cruisePaths = activeCruises.map(cruise => ({
            path: cruise.ruta.map(p => [p.lat, p.lng]),
            name: cruise.nombre,
            color: '#facc15', // Amarillo
            opacity: 0.8
        }));

        callGlobe('pathsData', cruisePaths);
        callGlobe('pathColor', () => '#38bdf8');
        callGlobe('pathDashLength', 0.01);
        callGlobe('pathDashGap', 0.005);
        callGlobe('pathDashAnimateTime', 12000);
        callGlobe('pathStroke', 2);
        
        // Limpiar arcos si existÃ­an
        callGlobe('arcsData', []);

        // AnimaciÃ³n de barcos
        if (state.activeFilters.showCruises) {
            animateShips(activeCruises);
        } else {
            callGlobe('customLayerData', []);
        }

        // Renderizar polígonos de países si están cargados
        if (state.countryPolygons.length > 0) {
            callGlobe('polygonsData', state.countryPolygons);
            callGlobe('polygonCapColor', () => 'rgba(255, 255, 255, 0.03)');
            callGlobe('polygonSideColor', () => 'rgba(0, 0, 0, 0)');
            callGlobe('polygonStrokeColor', () => 'rgba(255, 255, 255, 0.15)');
            callGlobe('polygonLabel', ({ properties: d }) => `
                <div class="globe-country-label" style="background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    <b>${d.name || d.NAME || d.ADMIN || 'País'}</b>
                </div>
            `);
        }
    };

    window.triggerRefresh = refreshData;

    // Inyectar datos con retardos progresivos para asegurar el renderizado
    setTimeout(refreshData, 100);
    setTimeout(refreshData, 1000);
    setTimeout(refreshData, 3000);

    state.globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 2000);
}



function setupGlobeFilters() {
    const citiesToggle = document.getElementById('cities-toggle');
    const cruiseToggle = document.getElementById('cruise-toggle');
    const continentsSub = document.getElementById('continents-sub-options');
    const cruiseRegions = document.getElementById('cruise-regions');
    const continentChecks = continentsSub.querySelectorAll('input');
    const regionChecks = cruiseRegions.querySelectorAll('input');
    const syncCruiseRegions = () => {
        state.activeFilters.cruiseRegions = Array.from(regionChecks)
            .filter(c => c.checked)
            .map(c => c.value);
    };

    const updateFilterVisuals = () => {
        // Ciudades
        continentsSub.classList.toggle('disabled-group', !citiesToggle.checked);
        continentChecks.forEach(i => i.disabled = false);
        
        // Cruceros
        cruiseRegions.classList.toggle('disabled-group', !cruiseToggle.checked);
        regionChecks.forEach(i => i.disabled = false);
    };

    citiesToggle.addEventListener('change', () => {
        state.activeFilters.showCities = citiesToggle.checked;
        
        if (citiesToggle.checked) {
            cruiseToggle.checked = false;
            state.activeFilters.showCruises = false;
            state.activeFilters.continents = Array.from(continentChecks)
                .filter(c => c.checked)
                .map(c => normalizeContinentName(c.value));
        } else {
            continentChecks.forEach(check => {
                check.checked = false;
            });
            state.activeFilters.continents = [];
        }
        
        updateFilterVisuals();
        updateCruiseList();
        window.refreshGlobe();
    });

    continentChecks.forEach(check => {
        check.addEventListener('change', () => {
            if (check.checked && !citiesToggle.checked) {
                citiesToggle.checked = true;
                cruiseToggle.checked = false;
                state.activeFilters.showCities = true;
                state.activeFilters.showCruises = false;
                state.currentCruise = null;
            }

            state.activeFilters.continents = Array.from(continentChecks)
                .filter(c => c.checked)
                .map(c => normalizeContinentName(c.value));
            updateFilterVisuals();
            updateCruiseList();
            window.refreshGlobe();
        });
    });

    cruiseToggle.addEventListener('change', () => {
        state.activeFilters.showCruises = cruiseToggle.checked;
        
        if (cruiseToggle.checked) {
            citiesToggle.checked = false;
            state.activeFilters.showCities = false;
            state.currentCruise = null; // Reset al cambiar de modo
            syncCruiseRegions();
        } else {
            regionChecks.forEach(check => {
                check.checked = false;
            });
            state.activeFilters.cruiseRegions = [];
            state.currentCruise = null;
        }
        
        updateFilterVisuals();
        updateCruiseList(); // Actualizar la lista lateral
        window.refreshGlobe();
    });

    regionChecks.forEach(check => {
        check.addEventListener('change', () => {
            if (check.checked && !cruiseToggle.checked) {
                cruiseToggle.checked = true;
                citiesToggle.checked = false;
                state.activeFilters.showCruises = true;
                state.activeFilters.showCities = false;
            }

            syncCruiseRegions();
            state.currentCruise = null; // Limpiar selecciÃ³n al cambiar filtros de zona
            updateFilterVisuals();
            updateCruiseList();
            window.refreshGlobe();
        });
    });

    // Sincronizar estado inicial con el DOM
    state.activeFilters.showCities = citiesToggle.checked;
    state.activeFilters.showCruises = cruiseToggle.checked;
    state.activeFilters.continents = Array.from(continentChecks).filter(c => c.checked).map(c => normalizeContinentName(c.value));
    syncCruiseRegions();

    // Estado inicial visual
    updateFilterVisuals();
}

function getFilteredCruiseList() {
    if (!state.activeFilters.showCruises) return [];
    if (state.activeFilters.cruiseRegions.length === 0) return [];

    const selectedRegions = state.activeFilters.cruiseRegions.map(normalizeCruiseRegion);
    const hasOthers = selectedRegions.includes(normalizeCruiseRegion('Otros'));
    const mainRegions = ['Caribe', 'Mediterraneo', 'Paises Nordicos'].map(normalizeCruiseRegion);

    // 1. Obtener cruceros de las regiones seleccionadas
    const prioritizedCruises = state.cruises.filter(c => {
        const cruiseRegion = normalizeCruiseRegion(c.region);
        if (selectedRegions.includes(cruiseRegion)) return true;
        if (hasOthers && !mainRegions.includes(cruiseRegion)) return true;
        return false;
    }).sort((a, b) => b.puntuacion - a.puntuacion);

    return prioritizedCruises.slice(0, 10);
}



function getCruiseShipInfo(cruise) {
    const companyByRegion = {
        Caribe: 'Royal Caribbean',
        Mediterraneo: 'MSC Cruceros',
        'Paises Nordicos': 'Hurtigruten',
        Alaska: 'Princess Cruises',
        Pacifico: 'Paul Gauguin Cruises',
        Antartida: 'Ponant',
        Asia: 'Celebrity Cruises',
        Sudamerica: 'Costa Cruceros',
        'Oriente Medio': 'Celestyal Cruises'
    };

    return {
        company: cruise.compania || cruise.naviera || cruise.buque?.compania || companyByRegion[cruise.region] || 'Naviera premium',
        shipName: cruise.buque?.nombre || cruise.barco || `Buque ${cruise.nombre}`
    };
}

function updateCruiseList() {
    const panel = document.getElementById('cruise-list-panel');
    const container = document.getElementById('cruise-items-container');
    
    if (!panel || !container) return;

    const filteredCruises = getFilteredCruiseList();

    if (filteredCruises.length === 0) {
        panel.style.display = 'none';
        return;
    }


    panel.style.display = filteredCruises.length > 0 ? 'flex' : 'none';
    container.innerHTML = '';

    filteredCruises.forEach((cruise, index) => {
        const origin = cruise.ruta[0]?.nombre || 'N/A';
        const destination = cruise.ruta[cruise.ruta.length - 1]?.nombre || 'N/A';
        const duration = cruise.ruta.length + 2; 
        const rating = cruise.puntuacion;
        const stopsCount = cruise.paradas.length;
        const shipInfo = getCruiseShipInfo(cruise);
        
        // Usar imagen de buque si existe, si no la del crucero, si no un placeholder premium
        const displayImg = cruise.buque?.imagen || cruise.imagen || 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800';

        const card = document.createElement('div');
        card.className = `cruise-card ${state.currentCruise?.id === cruise.id ? 'active' : ''}`;
        card.innerHTML = `
            <span class="cruise-rank-badge">${index + 1}</span>
            <img src="${assetUrl(displayImg)}" class="cruise-card-img" alt="${cruise.nombre}">
            <div class="cruise-card-content">
                <div class="cruise-card-title">${cruise.nombre}</div>
                <div class="cruise-ship-meta">
                    <span>${shipInfo.company}</span>
                    <strong>${shipInfo.shipName}</strong>
                </div>
                <div class="cruise-info-row">
                    <span class="cruise-info-icon">Meses</span>
                    <span>${cruise.temporada || 'Consultar temporada'}</span>
                </div>
                <div class="cruise-info-row">
                    <span class="cruise-info-icon">Ruta</span>
                    <span>${origin} - ${destination}</span>
                </div>
                <div class="cruise-itinerary-list">Itinerario: ${cities}</div>
                <div class="cruise-info-row">
                    <span class="cruise-info-icon">Esc.</span>
                    <span>${stopsCount} ciudades visitadas</span>
                </div>
                <div class="cruise-rating-row">
                    <div class="cruise-rating">
                        <span class="stars">★ ${rating}</span>
                        <span class="duration">${duration} dias</span>
                    </div>
                    <button class="cruise-detail-btn" onclick="event.stopPropagation(); window.selectCruise('${cruise.id}')">Ver Detalle</button>
                </div>
            </div>
        `;

        card.onclick = () => {
            state.currentCruise = cruise;
            document.querySelectorAll('.cruise-card').forEach(el => el.classList.remove('active'));
            card.classList.add('active');
            window.refreshGlobe();
        };

        container.appendChild(card);
    });
}

// Exponer refreshGlobe para el contexto
window.refreshGlobe = () => {
    const refreshFunc = window.triggerRefresh;
    if (refreshFunc) refreshFunc();
};

function animateShips(activeCruises) {
    const ships = activeCruises.map(c => ({
        lat: c.ruta[0].lat,
        lng: c.ruta[0].lng,
        cruise: c,
        index: 0,
        t: 0
    }));

    callGlobe('customLayerData', ships);
    callGlobe('customLayerElement', d => {
        const container = document.createElement('div');
        container.className = 'ship-animation-container';
        
        const ship = document.createElement('div');
        ship.className = 'ship-icon';
        ship.innerHTML = '&bull;';
        
        const wake = document.createElement('div');
        wake.className = 'ship-wake';
        
        container.appendChild(wake);
        container.appendChild(ship);
        return container;
    });

    if (window.shipInterval) clearInterval(window.shipInterval);
    window.shipInterval = setInterval(() => {
        ships.forEach(s => {
            // Velocidad variable segÃºn el tramo (opcional, aquÃ­ constante)
            s.t += 0.008; 
            
            if (s.t >= 1) {
                s.t = 0;
                s.index = (s.index + 1) % (s.cruise.ruta.length - 1);
            }
            
            const start = s.cruise.ruta[s.index];
            const end = s.cruise.ruta[s.index + 1];
            
            // InterpolaciÃ³n esfÃ©rica simplificada (Lerp en lat/lng es aceptable para distancias de crucero)
            s.lat = start.lat + (end.lat - start.lat) * s.t;
            s.lng = start.lng + (end.lng - start.lng) * s.t;
            
            // CÃ¡lculo de rotaciÃ³n (rumbo)
            const angle = Math.atan2(end.lat - start.lat, end.lng - start.lng) * (180 / Math.PI);
            s.rotation = 90 - angle; // Ajustar segÃºn el emoji
        });
        
        callGlobe('customLayerData', ships);
        
        // Actualizar rotaciÃ³n en el DOM si es necesario (el customLayerElement se encarga de posicionar)
        const shipElements = document.querySelectorAll('.ship-icon');
        ships.forEach((s, i) => {
            if (shipElements[i]) {
                shipElements[i].style.transform = `rotate(${s.rotation}deg)`;
            }
        });
    }, 50);
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

// â•â• NAVEGACIÃ“N Y ESTADO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function renderGlobeFallback(container) {
    container.innerHTML = `
        <div class="fallback-globe" aria-label="Bola del mundo decorativa">
            <div class="fallback-globe-map"></div>
        </div>
    `;
}

async function selectCity(city) {
    if (!city.lugares || city.lugares.length === 0) {
        alert(`Lo sentimos, la informaciÃ³n para ${city.nombre} aÃºn no estÃ¡ disponible.`);
        return;
    }

    state.currentCity = city;
    state.places = city.lugares;
    state.filteredPlaces = [...state.places];

    applyTheme(city);
    updateUIForCity(city);

    // TransiciÃ³n suave
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
    document.getElementById('app-title').innerHTML = `${escapeHtml(city.nombre)} <span class="logo-sub">Guía de Viaje · ${escapeHtml(city.pais)}</span>`;
    document.getElementById('app-logo-icon').textContent = safeDisplayIcon(city.emoji, '•');

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

        // Si venimos de un crucero, volver al crucero en lugar de a la selecciÃ³n
        if (state.fromCruise) {
            state.fromCruise = false;
            app.style.display = 'none';
            document.getElementById('cruise-app').style.display = 'block';
            state.isTransitioning = false;
            return;
        }

        setTimeout(() => {
            selection.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

// â•â• CRUCEROS LÃ“GICA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function selectCruise(cruise) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.currentCruise = cruise;

    const selection = document.getElementById('city-selection');
    const cruiseApp = document.getElementById('cruise-app');
    
    // Renderizar datos antes de mostrar
    renderCruiseHeader(cruise);
    
    selection.classList.add('fade-out');
    
    setTimeout(() => {
        selection.style.display = 'none';
        selection.classList.remove('fade-out');
        
        cruiseApp.style.display = 'block';
        cruiseApp.classList.add('fade-in');
        
        // Mostrar vista de itinerario por defecto
        showItineraryView();
        
        setTimeout(() => {
            cruiseApp.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

function renderCruiseHeader(cruise) {
    updateCruiseDetailUI(cruise);
}

function showItineraryView() {
    const itineraryView = document.getElementById('cruise-itinerary-view') || document.getElementById('cruise-itinerary-section');
    const portView = document.getElementById('cruise-port-view') || document.getElementById('port-detail-section');
    if (itineraryView) {
        itineraryView.classList.remove('hidden');
        itineraryView.style.display = '';
    }
    if (portView) {
        portView.classList.add('hidden');
        portView.style.display = 'none';
    }

    setTimeout(renderCruiseMap, 100);
}

function renderCruiseMap() {
    const cruise = state.currentCruise;
    const cruiseMap = document.getElementById('cruise-map');
    
    // Limpiar si ya existe
    if (state.map) {
        state.map.remove();
        state.map = null;
    }
    
    state.map = L.map('cruise-map', {
        zoomControl: false,
        attributionControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
    }).setView([cruise.paradas[0].lat, cruise.paradas[0].lng], 2);

    // Capa base más detallada y legible para navegación
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png').addTo(state.map);
    // Añadir etiquetas por encima de la ruta para mejor legibilidad
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        pane: 'shadowPane',
        zIndex: 650
    }).addTo(state.map);

    // Zoom cinematográfico al cargar
    setTimeout(() => {
        state.map.flyTo([cruise.paradas[0].lat, cruise.paradas[0].lng], 5, {
            duration: 2.5,
            easeLinearity: 0.25
        });
    }, 100);

    // Dibujar ruta con efecto premium (Línea de estela náutica)
    const pathCoords = cruise.ruta.map(p => [p.lat, p.lng]);
    
    // Brillo exterior (glow)
    L.polyline(pathCoords, { 
        color: '#0ea5e9', 
        weight: 15, 
        opacity: 0.15,
        lineJoin: 'round'
    }).addTo(state.map);

    // Línea principal
    const mainRoute = L.polyline(pathCoords, { 
        color: '#0ea5e9', 
        weight: 4, 
        opacity: 0.8, 
        dashArray: '1, 10', // Efecto de puntos náuticos
        lineJoin: 'round'
    }).addTo(state.map);


    // Añadir marcadores de escalas
    cruise.paradas.forEach(stop => {
        // Buscar si esta parada es una de nuestras ciudades guía
        const matchedCity = state.cities.find(c => 
            stop.nombre.toLowerCase().includes(c.nombre.toLowerCase()) || 
            c.nombre.toLowerCase().includes(stop.nombre.toLowerCase())
        );

        let icon;
        if (matchedCity) {
            icon = L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div class="marker-pin-featured" title="Ver guía de ${matchedCity.nombre}">
                        <div class="img-container">
                            <img src="${assetUrl(matchedCity.imagen)}" alt="${matchedCity.nombre}">
                        </div>
                    </div>
                `,
                iconSize: [48, 48],
                iconAnchor: [24, 24]
            });
        } else {
            icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="marker-pin-cruise"></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
        }

        const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(state.map);
        marker.bindTooltip(`<strong>${stop.nombre}</strong>${matchedCity ? '<br><span style="color:#facc15; font-size:10px">✨ Guía disponible</span>' : ''}`, { 
            permanent: false, 
            direction: 'top',
            className: 'custom-tooltip'
        });
        
        marker.on('click', () => {
            if (matchedCity) {
                // Navegación directa a la ciudad si tiene guía
                selectCity(matchedCity);
                document.getElementById('cruise-app').style.display = 'none';
                state.fromCruise = true;
            } else {
                showPortDetails(stop);
            }
        });
    });

    // Ajustar vista para que quepa toda la ruta
    state.map.fitBounds(mainRoute.getBounds(), { padding: [50, 50] });
    renderShipTrackingControl(cruise);
    renderLiveShipPosition(cruise);
    renderCruiseTimeline(cruise);
}

function renderCruiseTimeline(cruise) {
    const container = document.getElementById('cruise-itinerary-timeline');
    if (!container) return;

    container.innerHTML = '';

    cruise.paradas.forEach(stop => {
        // Buscar ciudad guía
        const matchedCity = state.cities.find(c => 
            stop.nombre.toLowerCase().includes(c.nombre.toLowerCase()) || 
            c.nombre.toLowerCase().includes(stop.nombre.toLowerCase())
        );

        const item = document.createElement('div');
        item.className = `timeline-item ${matchedCity ? 'is-featured' : ''}`;
        
        item.innerHTML = `
            <div class="timeline-dot">
                ${matchedCity ? `<img src="${assetUrl(matchedCity.imagen)}" alt="${matchedCity.nombre}">` : ''}
            </div>
            <div class="timeline-info">
                <span class="timeline-city">${stop.nombre}</span>
                <span class="timeline-country">${stop.pais}</span>
                ${matchedCity ? '<div class="timeline-badge">✨ Guía disponible</div>' : ''}
            </div>
        `;

        item.onclick = () => {
            if (matchedCity) {
                selectCity(matchedCity);
                document.getElementById('cruise-app').style.display = 'none';
                state.fromCruise = true;
            } else {
                showPortDetails(stop);
            }
        };

        container.appendChild(item);
    });
}


function showPortDetails(stop) {
    state.currentPort = stop;
    const itineraryView = document.getElementById('cruise-itinerary-view') || document.getElementById('cruise-itinerary-section');
    const portView = document.getElementById('cruise-port-view') || document.getElementById('port-detail-section');
    if (itineraryView) {
        itineraryView.classList.add('hidden');
        itineraryView.style.display = 'none';
    }
    if (portView) {
        portView.classList.remove('hidden');
        portView.style.display = '';
    }

    const portTitle = document.getElementById('port-title') || document.getElementById('port-name');
    const portSubtitle = document.getElementById('port-subtitle');
    if (portTitle) portTitle.textContent = stop.nombre;
    if (portSubtitle) portSubtitle.textContent = `Escala tecnica y turistica · ${state.currentCruise.nombre}`;

    setTimeout(() => renderPortMap(stop), 100);
}

function renderPortMap(stop) {
    const container = document.getElementById('port-map');
    if (!container) return;
    
    if (state.portMap) {
        state.portMap.remove();
    }
    
    state.portMap = L.map('port-map', {
        zoomControl: true,
        attributionControl: false
    }).setView([stop.lat, stop.lng], 14);

    // Capa de mapa híbrida premium para puertos (satélite + etiquetas)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(state.portMap);

    // Marcador del Puerto Principal
    const portIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin-featured" style="background:#0ea5e9; border-color:#fff"><div class="img-container"><img src="https://img.icons8.com/ios-filled/50/ffffff/anchor.png" style="padding:8px"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    L.marker([stop.lat, stop.lng], { icon: portIcon }).addTo(state.portMap)
        .bindTooltip(`<strong>Puerto de ${stop.nombre}</strong>`, { permanent: true, direction: 'top', className: 'custom-tooltip' });

    // Dibujar ciudades/puntos dentro de la escala
    if (stop.ciudades && stop.ciudades.length > 0) {
        const points = stop.ciudades.map(c => [c.lat, c.lng]);
        
        // Línea de conexión turística
        L.polyline([[stop.lat, stop.lng], ...points], {
            color: '#facc15',
            weight: 3,
            dashArray: '8, 12',
            opacity: 0.6
        }).addTo(state.portMap);

        stop.ciudades.forEach(city => {
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="marker-pin-city"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const marker = L.marker([city.lat, city.lng], { icon }).addTo(state.portMap);
            
            // Popup Premium
            const popupContent = document.createElement('div');
            popupContent.className = 'port-popup';
            popupContent.innerHTML = `
                <strong>${city.nombre}</strong>
                <p>${city.tipo || 'Punto de interés'}</p>
                <button class="back-btn small" style="width:100%; margin-top:5px; justify-content:center">Explorar Ciudad</button>
            `;
            
            popupContent.querySelector('button').onclick = () => {
                // Encontrar los datos completos de la ciudad en state.cities
                const fullCityData = state.cities.find(c => c.nombre === city.nombre);
                if (fullCityData) {
                    selectCity(fullCityData);
                    // Ocultar app de crucero para mostrar app de ciudad
                    document.getElementById('cruise-app').style.display = 'none';
                    // Marcar que venimos de un crucero para el botÃ³n volver
                    state.fromCruise = true;
                } else {
                    alert("Datos de la ciudad no encontrados");
                }
            };

            marker.bindPopup(popupContent);
        });
        
        // Ajustar vista
        const bounds = L.latLngBounds(points);
        state.portMap.fitBounds(bounds, { padding: [40, 40] });
    }
}

function backToItinerary() {
    const itineraryView = document.getElementById('cruise-itinerary-view') || document.getElementById('cruise-itinerary-section');
    const portView = document.getElementById('cruise-port-view') || document.getElementById('port-detail-section');
    if (portView) {
        portView.classList.add('hidden');
        portView.style.display = 'none';
    }
    if (itineraryView) {
        itineraryView.classList.remove('hidden');
        itineraryView.style.display = '';
    }
    if (state.portMap) {
        state.portMap.remove();
        state.portMap = null;
    }
    renderCruiseMap();
}

function backFromCruise() {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    const selection = document.getElementById('city-selection');
    const cruiseApp = document.getElementById('cruise-app');

    cruiseApp.classList.add('fade-out');

    setTimeout(() => {
        cruiseApp.style.display = 'none';
        cruiseApp.classList.remove('fade-out');

        selection.style.display = 'flex';
        selection.classList.add('fade-in');

        state.currentCruise = null;
        if (state.map) {
            state.map.remove();
            state.map = null;
        }

        setTimeout(() => {
            selection.classList.remove('fade-in');
            state.isTransitioning = false;
        }, 500);
    }, 500);
}

// â•â• RENDERIZADO DE LUGARES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function renderPlaces() {
    const container = document.getElementById('places-container');
    container.innerHTML = '';

    if (state.viewMode === 'map') {
        container.innerHTML = '<div id="map"></div>';
        initMap();
        return;
    }

    if (state.filteredPlaces.length === 0) {
        container.innerHTML = '<div class="no-results">No hay resultados.</div>';
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
            <img src="${assetUrl(place.imagenCard)}" alt="${escapeHtml(place.nombre)}" class="place-img" loading="lazy">
        </div>
        <div class="card-content">
            <span class="card-tag">${escapeHtml(getTypeLabel(place.tipo))}</span>
            <h3 class="card-title">${escapeHtml(place.nombre)}</h3>
            <p class="card-desc">${escapeHtml(place.descripcionCorta)}</p>
        </div>
    `;
    div.onclick = () => showPlaceDetails(place);
    return div;
}

// â•â• MAPA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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

// â•â• METEOROLOGÃA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â•â• METEOROLOGÃA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function loadWeather() {
    const container = document.getElementById('weather-container');
    const { lat, lng, nombre } = state.currentCity;

    container.innerHTML = '<div class="loading"><div class="spinner"></div> Consultando satÃ©lites...</div>';

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
                    <span class="temp-now">${Math.round(weather.temperature)}Â°</span>
                    <div class="weather-condition">
                        <span class="weather-icon-big">${getWeatherIcon(weather.weathercode)}</span>
                        <span class="condition-text">${getWeatherDescription(weather.weathercode)}</span>
                    </div>
                </div>

                <div class="weather-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">SensaciÃ³n</span>
                        <span class="stat-value">${Math.round(feelsLike)}Â°C</span>
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
                        <span class="stat-label">Ãndice UV</span>
                        <span class="stat-value">${daily.uv_index_max[0]}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Lluvia</span>
                        <span class="stat-value">${daily.precipitation_probability_max[0]}%</span>
            </div>
            </div>

            <div class="forecast-section">
                <h3>PrÃ³ximos dÃ­as</h3>
                <div class="forecast-grid">
                    ${daily.time.slice(1, 6).map((time, i) => `
                        <div class="forecast-item">
                            <span class="forecast-day">${new Date(time).toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                            <span class="forecast-icon">${getWeatherIcon(daily.weathercode[i + 1])}</span>
                            <div class="forecast-temp">
                                <span class="temp-max">${Math.round(daily.temperature_2m_max[i + 1])}Â°</span>
                                <span class="temp-min">${Math.round(daily.temperature_2m_min[i + 1])}Â°</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="error">âŒ No pudimos conectar con la estaciÃ³n meteorolÃ³gica.</div>';
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
        61: 'Lluvia dÃ©bil',
        63: 'Lluvia moderada',
        65: 'Lluvia fuerte',
        71: 'Nieve dÃ©bil',
        73: 'Nieve moderada',
        75: 'Nieve fuerte',
        77: 'Granizo',
        80: 'Chubascos leves',
        81: 'Chubascos moderados',
        82: 'Chubascos violentos',
        95: 'Tormenta elÃ©ctrica',
        96: 'Tormenta con granizo leve',
        99: 'Tormenta con granizo fuerte'
    };
    return descriptions[code] || 'Condiciones variables';
}

// â•â• EVENT LISTENERS Y UTILIDADES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function setupEventListeners() {
    document.getElementById('back-to-cities').onclick = backToSelection;
    
    // Nuevos botones de crucero
    document.getElementById('back-from-cruise').onclick = backFromCruise;
    document.getElementById('back-to-itinerary').onclick = backToItinerary;
    
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
    const labels = {
        cultura: 'Cultura',
        museos: 'Museos',
        restaurantes: 'Restaurantes',
        barrios: 'Barrios',
        parques: 'Parques',
        mercados: 'Mercados',
        cafes: 'Cafés'
    };
    return labels[type] || type;
}

function getWeatherIcon(code) {
    if (code === 0) return '\u2600\uFE0F';
    if (code === 1 || code === 2) return '\u26C5';
    if (code === 3) return '\u2601\uFE0F';
    if (code === 45 || code === 48) return '\uD83C\uDF2B\uFE0F';
    if (code >= 51 && code <= 55) return '\uD83C\uDF26\uFE0F';
    if (code >= 61 && code <= 65) return '\uD83C\uDF27\uFE0F';
    if (code >= 71 && code <= 77) return '\u2744\uFE0F';
    if (code >= 80 && code <= 82) return '\uD83C\uDF27\uFE0F';
    if (code >= 95) return '\u26C8\uFE0F';
    return '\uD83C\uDF21\uFE0F';
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
        'PanteÃ³n de Agripa': { name: 'Pantheon Roma', contact: 'pantheonroma.com', schedule: place.horario },
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
        'PanteÃ³n de Agripa': [
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
            ['Barrio Genoves de Galata', 'Paseo por las calles empinadas, tiendas de diseÃ±o y musica.'],
            ['Ruta de Cafes en Beyoglu', 'Exploracion de la vida social y bohemia de los alrededores.'],
            ['Atardecer sobre el Cuerno de Oro', 'Experiencia fotografica con la mejor luz del dia.'],
            ['Historia Medieval de la Torre', 'Contexto sobre la defensa de la ciudad y los genoveses.'],
            ['Paseo hasta el Puente de Galata', 'Ruta descendente conectando con los pescadores del puente.']
        ],
        'Crucero por el Bosforo': [
            ['Navegacion al Atardecer', 'Crucero publico o compartido para ver las siluetas de la ciudad.'],
            ['Crucero Privado de Lujo', 'Experiencia exclusiva para ver palacios y yalis de madera.'],
            ['Desayuno en el Barco', 'MaÃ±ana relajada navegando entre Europa y Asia.'],
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
            web: act.web || act.website || act.url || (getWebsiteUrl(act.contacto || act.contact) ? (act.contacto || act.contact) : ''),
            cost: act.costeEstimado || act.coste || act.cost || act.precio || act.price,
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
            web: getWebsiteUrl(providers[index].contact) ? providers[index].contact : '',
            cost: '25-70 â‚¬',
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
            web: getWebsiteUrl(providers[index].contact) ? providers[index].contact : '',
            cost: '25-70 â‚¬',
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
            <img src="${assetUrl(activity.image)}" alt="${escapeHtml(activity.title)}">
            <div class="activity-card-body">
                <h4>${escapeHtml(activity.title)}</h4>
                <p>${escapeHtml(activity.description)}</p>
                <dl>
                    <div><dt>Empresa</dt><dd>${escapeHtml(activity.provider || "Consultar")}</dd></div>
                    ${!getWebsiteUrl(activity.contact) ? `<div><dt>Contacto</dt><dd>${renderContactValue(activity.contact)}</dd></div>` : ""}
                    ${activity.web ? `<div><dt>Web</dt><dd>${renderWebValue(activity.web)}</dd></div>` : ""}
                    <div><dt>Coste</dt><dd>${escapeHtml(activity.cost || "Consultar")}</dd></div>
                    <div><dt>Horario</dt><dd>${escapeHtml(activity.schedule || "Consultar")}</dd></div>
                </dl>
            </div>
        </article>
    `).join("");
}

function showPlaceDetails(place) {
    const modal = document.getElementById("place-modal");
    document.getElementById("modal-place-img").src = assetUrl(place.imagen || place.imagenCard);
    document.getElementById("modal-place-img").alt = cleanDisplayText(place.nombre);
    document.getElementById("modal-place-tag").textContent = getTypeLabel(place.tipo);
    document.getElementById("modal-place-title").textContent = cleanDisplayText(place.nombre);
    document.getElementById("modal-place-desc").textContent = cleanDisplayText(place.descripcion || place.descripcionCorta);
    document.getElementById("modal-place-extra").textContent = cleanDisplayText(getPlaceExtraInfo(place));
    document.getElementById("modal-place-price").textContent = `Precio: ${cleanDisplayText(place.precio || "Consultar")}`;
    document.getElementById("modal-place-hours").textContent = `Horario: ${cleanDisplayText(place.horario || "Consultar")}`;
    document.getElementById("modal-place-rating").textContent = `Valoracion: ${cleanDisplayText(place.rating || "4.7")} / 5`;
    const placeWeb = renderWebValue(place.web);
    const placeContact = document.getElementById("modal-place-contact");
    placeContact.hidden = !placeWeb;
    placeContact.innerHTML = placeWeb ? `Web: ${placeWeb}` : "";
    renderPlaceActivities(place);
    document.getElementById("modal-place-tags").innerHTML = (place.tags || [])
        .map(tag => `<span>${escapeHtml(tag)}</span>`)
        .join("");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closePlaceDetails() {
    const modal = document.getElementById("place-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
}


function selectCruise(idOrCruise) {
    const cruise = typeof idOrCruise === 'string' 
        ? state.cruises.find(c => c.id === idOrCruise) 
        : idOrCruise;
    
    if (!cruise) return;

    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.currentCruise = cruise;

    const selection = document.getElementById('city-selection');
    const cruiseApp = document.getElementById('cruise-app');
    
    // Renderizar datos antes de mostrar
    renderCruiseHeader(cruise);
    
    if (selection) {
        selection.classList.add('fade-out');
        setTimeout(() => {
            selection.style.display = 'none';
            selection.classList.remove('fade-out');
            
            if (cruiseApp) {
                cruiseApp.style.display = 'block';
                cruiseApp.classList.add('fade-in');
                
                // Mostrar vista de itinerario por defecto
                showItineraryView();
                
                setTimeout(() => {
                    cruiseApp.classList.remove('fade-in');
                    state.isTransitioning = false;
                }, 500);
            }
        }, 500);
    }
}

function updateCruiseDetailUI(cruise) {
    const shipImg = document.getElementById('ship-img');
    const shipName = document.getElementById('ship-name');
    const shipStats = document.getElementById('ship-stats');
    const header = document.querySelector('.cruise-header-premium');
    const shipInfo = getCruiseShipInfo(cruise);
    const shipData = cruise.buque?.datos || {};
    const duration = cruise.ruta.length + 2;

    // Actualizar fondo de cabecera con la imagen del itinerario
    if (header && cruise.imagen) {
        header.style.setProperty('--cruise-bg-img', `url('${assetUrl(cruise.imagen)}')`);
    }

    if (shipImg) {
        const photoOptions = [
            cruise.buque?.fotoBarco,
            cruise.buque?.imagen,
            cruise.imagen,
            'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800'
        ].filter(Boolean);
        let photoIndex = 0;
        shipImg.referrerPolicy = 'no-referrer';
        shipImg.src = assetUrl(photoOptions[photoIndex]);
        shipImg.alt = shipInfo.shipName;
        
        shipImg.onerror = () => {
            photoIndex += 1;
            const nextPhoto = photoOptions[photoIndex];
            if (nextPhoto) {
                shipImg.src = assetUrl(nextPhoto);
            } else {
                shipImg.onerror = null;
            }
        };

        // Re-añadir efecto parallax
        const photoWrapper = shipImg.parentElement;
        if (photoWrapper) {
            photoWrapper.onmousemove = (e) => {
                const { left, top, width, height } = photoWrapper.getBoundingClientRect();
                const x = (e.clientX - left) / width - 0.5;
                const y = (e.clientY - top) / height - 0.5;
                shipImg.style.transform = `scale(1.1) translate(${x * 25}px, ${y * 25}px) rotate(${x * 3}deg)`;
            };
            photoWrapper.onmouseleave = () => {
                shipImg.style.transform = '';
            };
        }
    }

    const shipBadge = document.getElementById('ship-badge');
    if (shipBadge) shipBadge.textContent = shipInfo.shipName;
    if (shipName) shipName.textContent = `${cruise.nombre} · ${shipInfo.shipName}`;
    
    if (shipStats) {
        shipStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${cruise.puntuacion}</span>
                <span class="stat-label">Valoracion</span>
            </div>
            <div class="stat-item stat-item-wide">
                <span class="stat-value">${cruise.temporada || 'Consultar'}</span>
                <span class="stat-label">Meses</span>
            </div>
            <div class="stat-item stat-item-wide">
                <span class="stat-value">${shipInfo.company}</span>
                <span class="stat-label">Compania</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${duration}</span>
                <span class="stat-label">Dias</span>
            </div>
            <div class="ship-summary-card">
                <h3>Datos técnicos del buque</h3>
                <dl>
                    <div><dt>Eslora</dt><dd>${shipData.eslora || '333 m'}</dd></div>
                    <div><dt>Plantas</dt><dd>${shipData.cubiertas || '18'}</dd></div>
                    <div><dt>Pasajeros</dt><dd>${shipData.pasajeros || '5.400'}</dd></div>
                    <div><dt>Tripulación</dt><dd>${shipData.tripulacion || '2.100'}</dd></div>
                    <div><dt>Restaurantes</dt><dd>${shipData.restaurantes || '12'}</dd></div>
                    <div class="ship-summary-wide"><dt>Actividades internas</dt><dd>${shipData.actividades || 'Piscinas, Teatro, Spa, Casino y zonas deportivas'}</dd></div>
                </dl>
            </div>
        `;
    }
    const progressBar = document.getElementById('voyage-progress-bar');
    const status = document.getElementById('voyage-status');
    if (progressBar) progressBar.style.width = `${Math.round((1 / cruise.paradas.length) * 100)}%`;
    if (status) {
        status.innerHTML = `
            <span>Circuito ofertado: ${cruise.temporada || 'Todo el año'} · Inicio: ${cruise.ruta[0]?.nombre || 'Consultar'}</span>
            ${cruise.buque?.trackingUrl ? `<a class="ship-tracking-link" href="${cruise.buque.trackingUrl}" target="_blank" rel="noopener noreferrer">🚢 Ver posición AIS en tiempo real</a>` : ''}
        `;
    }

    renderLiveShipPosition(cruise);

    if (window.initCruiseItineraryMap) {
        window.initCruiseItineraryMap(cruise);
    }
}



async function getVesselFinderApiKey() {
    return window.VESSELFINDER_API_KEY || localStorage.getItem('vesselfinder_api_key') || '';
}

async function fetchLiveShipPosition(cruise) {
    const apiKey = await getVesselFinderApiKey();
    const imo = cruise.buque?.imo;
    if (!apiKey || !imo) return null;

    const url = `https://api.vesselfinder.com/vessels?userkey=${encodeURIComponent(apiKey)}&imo=${encodeURIComponent(imo)}&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`VesselFinder ${response.status}`);
    const data = await response.json();
    const vessel = Array.isArray(data) ? data[0] : data?.AIS?.[0] || data?.[0] || data;
    const lat = Number(vessel?.LATITUDE ?? vessel?.lat);
    const lng = Number(vessel?.LONGITUDE ?? vessel?.lng ?? vessel?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
        lat,
        lng,
        speed: vessel?.SPEED,
        course: vessel?.COURSE,
        timestamp: vessel?.TIMESTAMP,
        destination: vessel?.DESTINATION
    };
}

async function renderLiveShipPosition(cruise) {
    try {
        const position = await fetchLiveShipPosition(cruise);
        if (!position || !state.map) return;

        if (state.liveShipMarker) {
            state.map.removeLayer(state.liveShipMarker);
            state.liveShipMarker = null;
        }

        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="live-ship-marker"></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        state.liveShipMarker = L.marker([position.lat, position.lng], { icon }).addTo(state.map);
        state.liveShipMarker.bindTooltip(
            `<span class="ais-tooltip-title">AIS EN VIVO</span><strong>${cruise.buque?.nombre || cruise.nombre}</strong>${position.destination ? `<br><small>Destino: ${position.destination}</small>` : ''}`,
            { permanent: true, direction: 'top', offset: [0, -18], className: 'live-ship-tooltip' }
        );
        state.liveShipMarker.on('click', () => {
            if (cruise.buque?.trackingUrl) {
                window.open(cruise.buque.trackingUrl, '_blank', 'noopener,noreferrer');
            }
        });
    } catch (error) {
        console.warn('No se pudo obtener la posicion AIS del barco:', error);
    }
}

function renderShipTrackingControl(cruise) {
    const mapContainer = document.getElementById('cruise-map');
    if (!mapContainer) return;

    mapContainer.querySelector('.ship-tracking-map-link')?.remove();
    if (!cruise.buque?.trackingUrl) return;

    const link = document.createElement('a');
    link.className = 'ship-tracking-map-link';
    link.href = cruise.buque.trackingUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `
        <span class="ship-tracking-map-kicker">AIS</span>
        <strong>${cruise.buque?.nombre || cruise.nombre}</strong>
        <span>Ver posicion actual</span>
    `;
    mapContainer.appendChild(link);
}
window.showPlaceDetailsById = (id) => {
    const place = state.places.find(p => p.id === id);
    if (place) showPlaceDetails(place);
};

window.selectCruise = selectCruise;
