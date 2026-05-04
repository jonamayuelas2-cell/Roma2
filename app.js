/* ============================================================
   app.js — Multi-City Travel Guide PWA
   ============================================================ */

'use strict';

// ── Estado global ──────────────────────────────────────────
const state = {
  cities: [],
  currentCity: null,
  places: [],
  filtered: [],
  activeTab: 'lugares',
  activeView: 'cards',
  activeType: 'todos',
  search: '',
  map: null,
  markers: [],
  selectedPlace: null,
  weather: null
};

// ── Helpers ────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function getTypeLabel(tipo) {
  const labels = {
    cultura: '🏛️ Cultura', museos: '🖼️ Museo', restaurantes: '🍝 Restaurante',
    barrios: '🏘️ Barrio', parques: '🌿 Parque', mercados: '🛍️ Mercado', cafes: '☕ Café'
  };
  return labels[tipo] || tipo;
}

// ── Carga de Ciudades ──────────────────────────────────────
async function loadCities() {
  try {
    const res = await fetch('./cities.json');
    state.cities = await res.json();
    renderCityCarousel();
  } catch (e) {
    console.error("Error loading cities:", e);
    $('#city-carousel').innerHTML = '<p class="error">Error al cargar destinos. Intenta de nuevo.</p>';
  }
}

function renderCityCarousel() {
  const container = $('#city-carousel');
  if (!container) return;

  container.innerHTML = state.cities.map(city => `
    <div class="city-card-item" onclick="selectCity('${city.id}')">
      <img src="${city.imagen}" alt="${city.nombre}" class="city-card-img" loading="lazy">
      <div class="city-card-overlay">
        <div class="city-card-name">${city.emoji} ${city.nombre}</div>
        <div class="city-card-pais">${city.pais}</div>
      </div>
    </div>
  `).join('');
}

// ── Selección de Ciudad ────────────────────────────────────
async function selectCity(cityId) {
  const city = state.cities.find(c => c.id === cityId);
  if (!city) return;

  state.currentCity = city;
  
  // Actualizar UI
  $('#city-selection').style.display = 'none';
  $('#main-app').style.display = 'block';
  
  // Actualizar Hero y Títulos
  $('#app-title').innerHTML = `${city.nombre} <span class="logo-sub" id="app-subtitle">${city.pais} · Guía de Viaje</span>`;
  $('#hero-title').textContent = `${city.emoji} Descubre ${city.nombre}`;
  $('#hero-subtitle').textContent = `Lugares imprescindibles para vivir la experiencia en ${city.nombre}`;
  
  // Resetear filtros
  state.search = '';
  $('#search-input').value = '';
  state.activeType = 'todos';
  $$('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.type === 'todos'));

  // Cargar lugares de la ciudad
  await loadPlaces(cityId);
  
  // Resetear mapa si existe
  if (state.map) {
    state.map.remove();
    state.map = null;
  }
  
  // Ir a la pestaña de lugares por defecto
  showTab('lugares');
}

function backToCitySelection() {
  $('#main-app').style.display = 'none';
  $('#city-selection').style.display = 'flex';
  state.currentCity = null;
  state.places = [];
  state.filtered = [];
  if (state.map) {
    state.map.remove();
    state.map = null;
  }
}

// ── Cargar datos de lugares ────────────────────────────────
async function loadPlaces(cityId) {
  const container = $('#places-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Cargando lugares...</div>';
  
  try {
    const res = await fetch(`./data/${cityId}.json`);
    if (!res.ok) throw new Error("No data for this city");
    state.places = await res.json();
    state.filtered = [...state.places];
    updateResultsCount();
    renderCurrentView();
  } catch (e) {
    console.error("Error loading places:", e);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>Próximamente</h3>
        <p>Estamos preparando la guía de ${state.currentCity.nombre}.<br>¡Vuelve pronto!</p>
        <button class="btn-primary" onclick="backToCitySelection()" style="margin-top:1rem">Elegir otra ciudad</button>
      </div>`;
  }
}

// ── Filtrado ───────────────────────────────────────────────
function applyFilters() {
  let result = [...state.places];
  if (state.activeType !== 'todos') result = result.filter(p => p.tipo === state.activeType);
  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  state.filtered = result;
  updateResultsCount();
  renderCurrentView();
}

function updateResultsCount() {
  const el = $('#results-count');
  if (el) el.textContent = `${state.filtered.length} lugar${state.filtered.length !== 1 ? 'es' : ''} encontrado${state.filtered.length !== 1 ? 's' : ''}`;
}

// ── Render: Cards ──────────────────────────────────────────
function renderCards() {
  const container = $('#places-container');
  container.className = 'cards-grid';
  if (!state.filtered.length) { renderEmpty(container); return; }
  container.innerHTML = state.filtered.map((p, i) => `
    <div class="place-card" data-id="${p.id}" style="animation-delay:${i * 0.04}s" onclick="openModal(${p.id})">
      <img class="card-img" src="${p.imagenCard}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://picsum.photos/400/300?seed=${p.id}_${state.currentCity.id}'">
      <div class="card-body">
        <span class="card-type type-${p.tipo}">${getTypeLabel(p.tipo)}</span>
        <div class="card-title">${p.nombre}</div>
        <div class="card-desc">${p.descripcionCorta}</div>
        <div class="card-footer">
          <span class="card-rating">⭐ ${p.rating}</span>
          <span class="card-price">${p.precio}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Render: Lista ──────────────────────────────────────────
function renderList() {
  const container = $('#places-container');
  container.className = 'list-view';
  if (!state.filtered.length) { renderEmpty(container); return; }
  container.innerHTML = state.filtered.map((p, i) => `
    <div class="list-item" style="animation-delay:${i * 0.04}s" onclick="openModal(${p.id})">
      <img class="list-img" src="${p.imagenCard}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://picsum.photos/400/300?seed=${p.id}_${state.currentCity.id}'">
      <div class="list-body">
        <div class="list-title">${p.nombre}</div>
        <div class="list-meta">
          <span class="card-type type-${p.tipo}">${getTypeLabel(p.tipo)}</span>
          <span>⭐ ${p.rating}</span>
          <span>💶 ${p.precio}</span>
        </div>
        <div class="list-desc">${p.descripcionCorta}</div>
        <div class="list-meta" style="margin-top:0.25rem"><span>🕐 ${p.horario}</span></div>
      </div>
    </div>
  `).join('');
}

// ── Render: Mapa ───────────────────────────────────────────
function renderMap() {
  const container = $('#places-container');
  container.className = '';
  container.innerHTML = '<div id="map-container"></div>';

  if (!state.currentCity) return;

  // Init map
  if (!state.map) {
    state.map = L.map('map-container').setView([state.currentCity.lat, state.currentCity.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(state.map);
  } else {
    state.map.setView([state.currentCity.lat, state.currentCity.lng], 13);
  }

  // Limpia markers
  state.markers.forEach(m => m.remove());
  state.markers = [];

  const typeColors = {
    cultura: '#e88', museos: '#88aaff', restaurantes: '#8ddb8d',
    barrios: '#c4a1f5', parques: '#88cc88', mercados: '#c9963c', cafes: '#cc9966'
  };

  state.filtered.forEach(p => {
    const color = typeColors[p.tipo] || '#c9963c';
    const icon = L.divIcon({
      className: '',
      html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const marker = L.marker([p.lat, p.lng], { icon })
      .addTo(state.map)
      .bindPopup(`
        <div class="popup-content" style="min-width:200px">
          <img class="popup-img" src="${p.imagenCard}" alt="${p.nombre}" onerror="this.style.display='none'">
          <div class="popup-title">${p.nombre}</div>
          <div class="popup-desc">${p.descripcionCorta}</div>
          <button class="popup-btn" onclick="openModal(${p.id});this.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button').click()">Ver más →</button>
        </div>
      `, { maxWidth: 240 });

    state.markers.push(marker);
  });

  setTimeout(() => state.map.invalidateSize(), 100);
}

// ── Empty state ────────────────────────────────────────────
function renderEmpty(container) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Sin resultados</h3>
      <p>No hay lugares que coincidan con tu búsqueda.<br>Intenta con otros filtros.</p>
    </div>`;
}

// ── Render actual view ─────────────────────────────────────
function renderCurrentView() {
  if (state.activeView === 'cards') renderCards();
  else if (state.activeView === 'list') renderList();
  else if (state.activeView === 'map') renderMap();
}

// ── Modal ──────────────────────────────────────────────────
function openModal(id) {
  const p = state.places.find(x => x.id === id);
  if (!p) return;
  state.selectedPlace = p;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" id="main-modal">
      <img class="modal-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://picsum.photos/800/600?seed=${p.id}_${state.currentCity.id}'">
      <div class="modal-body">
        <div class="modal-header">
          <h2 class="modal-title">${p.nombre}</h2>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-type"><span class="card-type type-${p.tipo}">${getTypeLabel(p.tipo)}</span> &nbsp;⭐ ${p.rating}/5</div>
        <p class="modal-desc">${p.descripcion}</p>
        <div class="modal-info-grid">
          <div class="modal-info-item"><div class="modal-info-label">🕐 Horario</div><div class="modal-info-value">${p.horario}</div></div>
          <div class="modal-info-item"><div class="modal-info-label">💶 Precio</div><div class="modal-info-value">${p.precio}</div></div>
          <div class="modal-info-item"><div class="modal-info-label">📍 Dirección</div><div class="modal-info-value">${p.direccion}</div></div>
          ${p.telefono ? `<div class="modal-info-item"><div class="modal-info-label">📞 Teléfono</div><div class="modal-info-value">${p.telefono}</div></div>` : ''}
        </div>
        <div class="modal-tags">${p.tags.map(t => `<span class="modal-tag">#${t}</span>`).join('')}</div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="sharePlace(${p.id})">📤 Enviar a un amigo</button>
          ${p.web ? `<button class="btn-secondary" onclick="window.open('${p.web}','_blank')">🌐 Web oficial</button>` : ''}
          <button class="btn-secondary" onclick="openInMaps(${p.lat},${p.lng})">🗺️ Ver en mapa</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}

function closeModal() {
  const overlay = $('#modal-overlay');
  if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
}

function openInMaps(lat, lng) {
  window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`, '_blank');
}

// ── Share ──────────────────────────────────────────────────
function sharePlace(id) {
  const p = state.places.find(x => x.id === id);
  if (!p) return;

  const cityName = state.currentCity ? state.currentCity.nombre : 'la ciudad';
  const shareText = `🏛️ ¡Descubre ${p.nombre} en ${cityName}!\n\n${p.descripcionCorta}\n\n📍 ${p.direccion}\n⭐ ${p.rating}/5 · 💶 ${p.precio}`;
  const shareUrl = `https://maps.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}&zoom=16`;

  if (navigator.share) {
    navigator.share({ title: p.nombre, text: shareText, url: shareUrl })
      .then(() => showToast('✅ ¡Compartido!'))
      .catch(() => showShareModal(p, shareText, shareUrl));
    return;
  }
  showShareModal(p, shareText, shareUrl);
}

function showShareModal(p, shareText, shareUrl) {
  const box = document.createElement('div');
  box.className = 'share-modal';
  box.id = 'share-modal';

  const waText = encodeURIComponent(shareText + '\n' + shareUrl);
  const mailSubj = encodeURIComponent(`🏛️ ${p.nombre} — Guía de Viaje`);
  const mailBody = encodeURIComponent(shareText + '\n\n' + shareUrl);

  box.innerHTML = `
    <div class="share-box">
      <h3>📤 Enviar a un amigo</h3>
      <p>Comparte <strong style="color:var(--gold-light)">${p.nombre}</strong></p>
      <div class="share-options">
        <button class="share-option" onclick="window.open('https://wa.me/?text=${waText}','_blank')">
          <span class="share-option-icon">💬</span>WhatsApp
        </button>
        <button class="share-option" onclick="window.open('https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}','_blank')">
          <span class="share-option-icon">✈️</span>Telegram
        </button>
        <button class="share-option" onclick="window.open('mailto:?subject=${mailSubj}&body=${mailBody}','_blank')">
          <span class="share-option-icon">📧</span>Email
        </button>
      </div>
      <div class="share-link-row">
        <input id="share-link-input" type="text" value="${shareUrl}" readonly>
        <button class="btn-primary" onclick="copyShareLink()">📋 Copiar</button>
      </div>
      <button class="btn-secondary" style="width:100%" onclick="closeShareModal()">✕ Cerrar</button>
    </div>`;

  document.body.appendChild(box);
}

function copyShareLink() {
  const input = $('#share-link-input');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => showToast('📋 ¡Enlace copiado!'));
}

function closeShareModal() {
  const m = $('#share-modal');
  if (m) m.remove();
}

// ── Meteorología ───────────────────────────────────────────
const WMO_CODES = {
  0:'☀️ Despejado', 1:'🌤️ Mayormente despejado', 2:'⛅ Parcialmente nublado', 3:'☁️ Cubierto',
  45:'🌫️ Niebla', 48:'🌫️ Niebla con escarcha', 51:'🌦️ Llovizna ligera', 53:'🌦️ Llovizna moderada',
  55:'🌧️ Llovizna intensa', 61:'🌧️ Lluvia ligera', 63:'🌧️ Lluvia moderada', 65:'🌧️ Lluvia intensa',
  71:'🌨️ Nieve ligera', 73:'🌨️ Nieve moderada', 75:'🌨️ Nieve intensa', 80:'🌦️ Chubascos',
  81:'🌧️ Chubascos moderados', 82:'⛈️ Chubascos fuertes', 95:'⛈️ Tormenta', 99:'⛈️ Tormenta con granizo'
};

function getWMOIcon(code) { return (WMO_CODES[code] || '🌡️').split(' ')[0]; }
function getWMO(code) { return WMO_CODES[code] || '🌡️ Variable'; }

async function loadWeather() {
  if (!state.currentCity) return;
  const container = $('#weather-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Cargando meteorología...</div>';

  try {
    const { lat, lng } = state.currentCity;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max` +
      `&timezone=auto&forecast_days=8`;

    const res = await fetch(url);
    const data = await res.json();
    state.weather = data;
    renderWeather(data);
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><h3>⚠️ Error</h3><p>No se pudo obtener el clima.</p></div>`;
  }
}

function renderWeather(data) {
  const c = data.current;
  const d = data.daily;
  const container = $('#weather-container');
  
  const days = d.time.map((t, i) => {
    const date = new Date(t + 'T12:00:00');
    const name = i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    return `
      <div class="weather-day">
        <div class="weather-day-name">${name}</div>
        <div class="weather-day-icon">${getWMOIcon(d.weather_code[i])}</div>
        <div class="weather-day-temps">
          <span class="temp-max">${Math.round(d.temperature_2m_max[i])}°</span>
          <span class="temp-min">${Math.round(d.temperature_2m_min[i])}°</span>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="weather-section">
      <div class="weather-today">
        <div class="weather-city">${state.currentCity.emoji} ${state.currentCity.nombre}</div>
        <div class="weather-temp-main">${Math.round(c.temperature_2m)}°C</div>
        <div class="weather-desc">${getWMO(c.weather_code)}</div>
        <div class="weather-details">
          <span>💧 ${c.relative_humidity_2m}%</span>
          <span>💨 ${Math.round(c.wind_speed_10m)} km/h</span>
          <span>☀️ UV ${c.uv_index}</span>
        </div>
      </div>
      <div class="weather-days">${days}</div>
    </div>`;
}

// ── Navegación de Pestañas ─────────────────────────────────
function showTab(tabId) {
  state.activeTab = tabId;
  $$('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
  
  const lugaresSection = $('#lugares-section');
  const weatherSection = $('#weather-section');
  const filtersBar = $('#filters-bar');

  if (tabId === 'lugares') {
    lugaresSection.style.display = 'block';
    filtersBar.style.display = 'block';
    weatherSection.style.display = 'none';
    renderCurrentView();
  } else {
    lugaresSection.style.display = 'none';
    filtersBar.style.display = 'none';
    weatherSection.style.display = 'block';
    loadWeather();
  }
}

// ── Inicialización ─────────────────────────────────────────
async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  await loadCities();

  // Listeners
  $('#back-to-cities').onclick = backToCitySelection;

  $$('.tab-btn').forEach(btn => {
    btn.onclick = () => showTab(btn.dataset.tab);
  });

  $('#search-input').oninput = (e) => {
    state.search = e.target.value.trim();
    applyFilters();
  };

  $$('.filter-chip').forEach(chip => {
    chip.onclick = () => {
      $$('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeType = chip.dataset.type;
      applyFilters();
    };
  });

  $$('.view-btn').forEach(btn => {
    btn.onclick = () => {
      $$('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeView = btn.dataset.view;
      renderCurrentView();
    };
  });
}

document.addEventListener('DOMContentLoaded', init);
