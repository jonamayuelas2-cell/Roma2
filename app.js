/* ============================================================
   app.js — Roma Eterna PWA
   ============================================================ */

'use strict';

// ── Estado global ──────────────────────────────────────────
const state = {
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

// Coordenadas de Roma para el tiempo
const ROMA_LAT = 41.9028;
const ROMA_LNG = 12.4964;

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

// ── Cargar datos ───────────────────────────────────────────
async function loadPlaces() {
  const res = await fetch('./lista.json');
  state.places = await res.json();
  state.filtered = [...state.places];
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
      <img class="card-img" src="${p.imagenCard}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://picsum.photos/400/300?random=${p.id}'">
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
      <img class="list-img" src="${p.imagenCard}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://picsum.photos/400/300?random=${p.id}'">
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

  // Init map once
  if (!state.map) {
    state.map = L.map('map-container').setView([ROMA_LAT, ROMA_LNG], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(state.map);
  }

  // Limpia markers
  state.markers.forEach(m => m.remove());
  state.markers = [];

  // Iconos personalizados por tipo
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
      <img class="modal-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://picsum.photos/800/600?random=${p.id}'">
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

  const shareText = `🏛️ ¡Descubre ${p.nombre} en Roma!\n\n${p.descripcionCorta}\n\n📍 ${p.direccion}\n⭐ ${p.rating}/5 · 💶 ${p.precio}\n\n¡No te lo pierdas en tu visita a Roma! 🇮🇹`;
  const shareUrl = `https://maps.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}&zoom=16`;

  // Intentar Web Share API nativa
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
  const mailSubj = encodeURIComponent(`🏛️ ${p.nombre} — Roma Eterna`);
  const mailBody = encodeURIComponent(shareText + '\n\n' + shareUrl);
  const tgText = encodeURIComponent(shareText);

  box.innerHTML = `
    <div class="share-box">
      <h3>📤 Enviar a un amigo</h3>
      <p>Comparte <strong style="color:var(--gold-light)">${p.nombre}</strong> con tus amigos</p>
      <div class="share-options">
        <button class="share-option" onclick="window.open('https://wa.me/?text=${waText}','_blank')">
          <span class="share-option-icon">💬</span>WhatsApp
        </button>
        <button class="share-option" onclick="window.open('https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${tgText}','_blank')">
          <span class="share-option-icon">✈️</span>Telegram
        </button>
        <button class="share-option" onclick="window.open('mailto:?subject=${mailSubj}&body=${mailBody}','_blank')">
          <span class="share-option-icon">📧</span>Email
        </button>
        <button class="share-option" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}','_blank')">
          <span class="share-option-icon">🐦</span>Twitter/X
        </button>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem">O copia el enlace:</p>
      <div class="share-link-row">
        <input id="share-link-input" type="text" value="${shareUrl}" readonly>
        <button class="btn-primary" onclick="copyShareLink()">📋 Copiar</button>
      </div>
      <button class="btn-secondary" style="width:100%" onclick="closeShareModal()">✕ Cerrar</button>
    </div>`;

  document.body.appendChild(box);
  box.addEventListener('click', e => { if (e.target === box) closeShareModal(); });
}

function copyShareLink() {
  const input = $('#share-link-input');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => showToast('📋 ¡Enlace copiado!')).catch(() => {
    input.select(); document.execCommand('copy'); showToast('📋 ¡Enlace copiado!');
  });
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

function getWMO(code) { return WMO_CODES[code] || '🌡️ Variable'; }
function getWMOIcon(code) { return (WMO_CODES[code] || '🌡️').split(' ')[0]; }

async function loadWeather() {
  const container = $('#weather-container');
  if (!container) return;
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Cargando datos meteorológicos...</div>';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ROMA_LAT}&longitude=${ROMA_LNG}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max` +
      `&timezone=Europe%2FRome&forecast_days=8`;

    const res = await fetch(url);
    const data = await res.json();
    state.weather = data;
    renderWeather(data);
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Error de conexión</h3><p>No se pudo obtener el pronóstico. Comprueba tu conexión a Internet.</p></div>`;
  }
}

function renderWeather(data) {
  const c = data.current;
  const d = data.daily;
  const container = $('#weather-container');
  if (!container) return;

  const today = new Date();
  const days = d.time.map((t, i) => {
    const date = new Date(t + 'T12:00:00');
    const isToday = i === 0;
    const name = isToday ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    return `
      <div class="weather-day">
        <div class="weather-day-name">${name}</div>
        <div class="weather-day-icon">${getWMOIcon(d.weather_code[i])}</div>
        <div class="weather-day-temps">
          <span class="temp-max">${Math.round(d.temperature_2m_max[i])}°</span>
          <span class="temp-min">${Math.round(d.temperature_2m_min[i])}°</span>
        </div>
        <div class="weather-day-rain">💧 ${d.precipitation_probability_max[i]}%</div>
      </div>`;
  });

  container.innerHTML = `
    <div class="weather-section">
      <div class="weather-header">
        <div>
          <div class="weather-city">🏛️ Roma, Italia</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">Actualizado: ${new Date().toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})}</div>
        </div>
      </div>

      <div class="weather-today">
        <div style="text-align:center">
          <div class="weather-icon-main">${getWMOIcon(c.weather_code)}</div>
          <div class="weather-temp-main">${Math.round(c.temperature_2m)}°C</div>
          <div class="weather-desc">${getWMO(c.weather_code).replace(/^.+?\s/,'')}</div>
        </div>
        <div class="weather-details">
          <div class="weather-detail">
            <div class="weather-detail-label">🌡️ Sensación</div>
            <div class="weather-detail-value">${Math.round(c.apparent_temperature)}°C</div>
          </div>
          <div class="weather-detail">
            <div class="weather-detail-label">💧 Humedad</div>
            <div class="weather-detail-value">${c.relative_humidity_2m}%</div>
          </div>
          <div class="weather-detail">
            <div class="weather-detail-label">💨 Viento</div>
            <div class="weather-detail-value">${Math.round(c.wind_speed_10m)} km/h</div>
          </div>
          <div class="weather-detail">
            <div class="weather-detail-label">☀️ UV</div>
            <div class="weather-detail-value">${c.uv_index}</div>
          </div>
          <div class="weather-detail">
            <div class="weather-detail-label">🌧️ Precip.</div>
            <div class="weather-detail-value">${c.precipitation} mm</div>
          </div>
          <div class="weather-detail">
            <div class="weather-detail-label">📅 Pronóstico</div>
            <div class="weather-detail-value">8 días</div>
          </div>
        </div>
      </div>

      <h3 style="font-family:Cinzel,serif;color:var(--gold-light);margin-bottom:1rem">📅 Próximos 8 días</h3>
      <div class="weather-days">${days.join('')}</div>

      <div style="margin-top:1.5rem;padding:1rem;background:rgba(201,150,60,0.07);border:1px solid rgba(201,150,60,0.15);border-radius:12px">
        <p style="font-size:0.8rem;color:var(--text-muted)">⚡ Datos proporcionados por <a href="https://open-meteo.com" target="_blank" style="color:var(--gold);text-decoration:none">Open-Meteo API</a> — Completamente gratuita y sin clave API requerida.</p>
      </div>
    </div>`;
}

// ── Inicialización ─────────────────────────────────────────
async function init() {
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  await loadPlaces();

  // Tab navigation
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.tab;

      const lugaresSection = $('#lugares-section');
      const weatherSection = $('#weather-section');

      if (state.activeTab === 'lugares') {
        lugaresSection.style.display = '';
        weatherSection.style.display = 'none';
        renderCurrentView();
      } else {
        lugaresSection.style.display = 'none';
        weatherSection.style.display = '';
        loadWeather();
      }
    });
  });

  // Búsqueda
  const searchInput = $('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      state.search = e.target.value.trim();
      applyFilters();
    });
  }

  // Filtros por tipo
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeType = chip.dataset.type;
      applyFilters();
    });
  });

  // View toggles
  $$('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeView = btn.dataset.view;
      renderCurrentView();
    });
  });

  // Render inicial
  renderCurrentView();
  updateResultsCount();
}

document.addEventListener('DOMContentLoaded', init);
