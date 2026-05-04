'use strict';

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

const RESTAURANT_LAT = 40.4248;
const RESTAURANT_LNG = -3.7047;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function getTypeLabel(tipo) {
  const labels = {
    tacos: 'Tacos',
    antojitos: 'Antojitos',
    principales: 'Principales',
    bebidas: 'Bebidas',
    postres: 'Postres',
    experiencias: 'Experiencias'
  };
  return labels[tipo] || tipo;
}

async function loadPlaces() {
  const res = await fetch('./lista.json');
  state.places = await res.json();
  state.filtered = [...state.places];
}

function applyFilters() {
  let result = [...state.places];

  if (state.activeType !== 'todos') {
    result = result.filter((p) => p.tipo === state.activeType);
  }

  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter((p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.descripcionCorta.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  state.filtered = result;
  updateResultsCount();
  renderCurrentView();
}

function updateResultsCount() {
  const el = $('#results-count');
  if (!el) return;
  el.textContent = `${state.filtered.length} opcion${state.filtered.length !== 1 ? 'es' : ''} en carta`;
}

function renderCards() {
  const container = $('#places-container');
  container.className = 'cards-grid';
  if (!state.filtered.length) {
    renderEmpty(container);
    return;
  }

  container.innerHTML = state.filtered.map((p, i) => `
    <article class="place-card" data-id="${p.id}" style="animation-delay:${i * 0.035}s" onclick="openModal(${p.id})">
      <img class="card-img" src="${p.imagenCard}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'">
      <div class="card-body">
        <span class="card-type type-${p.tipo}">${getTypeLabel(p.tipo)}</span>
        <h2 class="card-title">${p.nombre}</h2>
        <p class="card-desc">${p.descripcionCorta}</p>
        <div class="card-footer">
          <span class="card-rating">${p.rating}/5</span>
          <span class="card-price">${p.precio}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function renderList() {
  const container = $('#places-container');
  container.className = 'list-view';
  if (!state.filtered.length) {
    renderEmpty(container);
    return;
  }

  container.innerHTML = state.filtered.map((p, i) => `
    <article class="list-item" style="animation-delay:${i * 0.035}s" onclick="openModal(${p.id})">
      <img class="list-img" src="${p.imagenCard}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'">
      <div class="list-body">
        <h2 class="list-title">${p.nombre}</h2>
        <div class="list-meta">
          <span class="card-type type-${p.tipo}">${getTypeLabel(p.tipo)}</span>
          <span>${p.rating}/5</span>
          <span>${p.precio}</span>
        </div>
        <p class="list-desc">${p.descripcionCorta}</p>
        <div class="list-meta"><span>${p.horario}</span></div>
      </div>
    </article>
  `).join('');
}

function renderMap() {
  const container = $('#places-container');
  container.className = '';
  container.innerHTML = '<div id="map-container"></div>';

  if (!state.map) {
    state.map = L.map('map-container').setView([RESTAURANT_LAT, RESTAURANT_LNG], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(state.map);
  }

  state.markers.forEach((m) => m.remove());
  state.markers = [];

  const typeColors = {
    tacos: '#d3382f',
    antojitos: '#f2a01f',
    principales: '#0f5f3b',
    bebidas: '#2878a8',
    postres: '#7a3f98',
    experiencias: '#101820'
  };

  const restaurantIcon = L.divIcon({
    className: '',
    html: '<div class="map-pin">CN</div>',
    iconSize: [42, 42],
    iconAnchor: [21, 42]
  });

  const marker = L.marker([RESTAURANT_LAT, RESTAURANT_LNG], { icon: restaurantIcon })
    .addTo(state.map)
    .bindPopup(`
      <div class="popup-content">
        <strong class="popup-title">Casa Nopal</strong>
        <p class="popup-desc">Calle del Pez, 24, Madrid</p>
        <button class="popup-btn" onclick="openInMaps(${RESTAURANT_LAT},${RESTAURANT_LNG})">Como llegar</button>
      </div>
    `);
  state.markers.push(marker);

  state.filtered.slice(0, 8).forEach((p, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(state.filtered.slice(0, 8).length, 1);
    const lat = RESTAURANT_LAT + Math.sin(angle) * 0.00045;
    const lng = RESTAURANT_LNG + Math.cos(angle) * 0.00065;
    const color = typeColors[p.tipo] || '#0f5f3b';
    const itemIcon = L.divIcon({
      className: '',
      html: `<div class="dish-pin" style="background:${color}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const itemMarker = L.marker([lat, lng], { icon: itemIcon })
      .addTo(state.map)
      .bindPopup(`
        <div class="popup-content">
          <img class="popup-img" src="${p.imagenCard}" alt="${p.nombre}" onerror="this.style.display='none'">
          <strong class="popup-title">${p.nombre}</strong>
          <p class="popup-desc">${p.descripcionCorta}</p>
          <button class="popup-btn" onclick="openModal(${p.id})">Ver plato</button>
        </div>
      `, { maxWidth: 240 });
    state.markers.push(itemMarker);
  });

  setTimeout(() => state.map.invalidateSize(), 100);
}

function renderEmpty(container) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">Sin resultados</div>
      <h3>No encontramos ese sabor</h3>
      <p>Prueba con otra busqueda o cambia de categoria.</p>
    </div>`;
}

function renderCurrentView() {
  if (state.activeView === 'cards') renderCards();
  else if (state.activeView === 'list') renderList();
  else if (state.activeView === 'map') renderMap();
}

function openModal(id) {
  const p = state.places.find((x) => x.id === id);
  if (!p) return;
  state.selectedPlace = p;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" id="main-modal">
      <img class="modal-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'">
      <div class="modal-body">
        <div class="modal-header">
          <div>
            <span class="card-type type-${p.tipo}">${getTypeLabel(p.tipo)}</span>
            <h2 class="modal-title">${p.nombre}</h2>
          </div>
          <button class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
        </div>
        <p class="modal-desc">${p.descripcion}</p>
        <div class="modal-info-grid">
          <div class="modal-info-item"><div class="modal-info-label">Horario</div><div class="modal-info-value">${p.horario}</div></div>
          <div class="modal-info-item"><div class="modal-info-label">Precio</div><div class="modal-info-value">${p.precio}</div></div>
          <div class="modal-info-item"><div class="modal-info-label">Valoracion</div><div class="modal-info-value">${p.rating}/5</div></div>
          <div class="modal-info-item"><div class="modal-info-label">Direccion</div><div class="modal-info-value">${p.direccion}</div></div>
        </div>
        <div class="modal-tags">${p.tags.map((t) => `<span class="modal-tag">#${t}</span>`).join('')}</div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="sharePlace(${p.id})">Compartir</button>
          <button class="btn-secondary" onclick="window.open('tel:${p.telefono.replaceAll(' ', '')}','_self')">Reservar</button>
          <button class="btn-secondary" onclick="openInMaps(${p.lat},${p.lng})">Como llegar</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = $('#modal-overlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
}

function openInMaps(lat, lng) {
  window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=17`, '_blank');
}

function sharePlace(id) {
  const p = state.places.find((x) => x.id === id);
  if (!p) return;

  const shareText = `Casa Nopal recomienda: ${p.nombre}\n\n${p.descripcionCorta}\n${p.precio} · ${p.direccion}`;
  const shareUrl = `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}&zoom=17`;

  if (navigator.share) {
    navigator.share({ title: p.nombre, text: shareText, url: shareUrl })
      .then(() => showToast('Compartido'))
      .catch(() => showShareModal(p, shareText, shareUrl));
    return;
  }
  showShareModal(p, shareText, shareUrl);
}

function showShareModal(p, shareText, shareUrl) {
  const box = document.createElement('div');
  box.className = 'share-modal';
  box.id = 'share-modal';

  const waText = encodeURIComponent(`${shareText}\n${shareUrl}`);
  const mailSubj = encodeURIComponent(`${p.nombre} - Casa Nopal`);
  const mailBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

  box.innerHTML = `
    <div class="share-box">
      <h3>Compartir ${p.nombre}</h3>
      <p>Envia este plato o experiencia a quien venga contigo.</p>
      <div class="share-options">
        <button class="share-option" onclick="window.open('https://wa.me/?text=${waText}','_blank')">WhatsApp</button>
        <button class="share-option" onclick="window.open('mailto:?subject=${mailSubj}&body=${mailBody}','_blank')">Email</button>
      </div>
      <div class="share-link-row">
        <input id="share-link-input" type="text" value="${shareUrl}" readonly>
        <button class="btn-primary" onclick="copyShareLink()">Copiar</button>
      </div>
      <button class="btn-secondary full" onclick="closeShareModal()">Cerrar</button>
    </div>`;

  document.body.appendChild(box);
  box.addEventListener('click', (e) => {
    if (e.target === box) closeShareModal();
  });
}

function copyShareLink() {
  const input = $('#share-link-input');
  if (!input) return;
  navigator.clipboard.writeText(input.value)
    .then(() => showToast('Enlace copiado'))
    .catch(() => {
      input.select();
      document.execCommand('copy');
      showToast('Enlace copiado');
    });
}

function closeShareModal() {
  const m = $('#share-modal');
  if (m) m.remove();
}

const WMO_CODES = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Cubierto',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  80: 'Chubascos',
  81: 'Chubascos moderados',
  82: 'Chubascos fuertes',
  95: 'Tormenta'
};

function getWMO(code) {
  return WMO_CODES[code] || 'Variable';
}

function getWeatherIcon(code) {
  if ([0, 1].includes(code)) return 'Sol';
  if ([2, 3, 45, 48].includes(code)) return 'Nubes';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Lluvia';
  if (code >= 95) return 'Tormenta';
  return 'Clima';
}

async function loadWeather() {
  const container = $('#weather-container');
  if (!container) return;
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Cargando clima de terraza...</div>';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${RESTAURANT_LAT}&longitude=${RESTAURANT_LNG}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max' +
      '&timezone=Europe%2FMadrid&forecast_days=8';

    const res = await fetch(url);
    const data = await res.json();
    state.weather = data;
    renderWeather(data);
  } catch {
    container.innerHTML = '<div class="empty-state"><h3>No se pudo cargar el clima</h3><p>La carta sigue disponible sin conexion.</p></div>';
  }
}

function renderWeather(data) {
  const c = data.current;
  const d = data.daily;
  const container = $('#weather-container');
  if (!container) return;

  const days = d.time.map((t, i) => {
    const date = new Date(`${t}T12:00:00`);
    const name = i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    return `
      <div class="weather-day">
        <div class="weather-day-name">${name}</div>
        <div class="weather-day-icon">${getWeatherIcon(d.weather_code[i])}</div>
        <div class="weather-day-temps">
          <span class="temp-max">${Math.round(d.temperature_2m_max[i])}°</span>
          <span class="temp-min">${Math.round(d.temperature_2m_min[i])}°</span>
        </div>
        <div class="weather-day-rain">${d.precipitation_probability_max[i]}% lluvia</div>
      </div>`;
  });

  container.innerHTML = `
    <div class="weather-section">
      <div class="weather-header">
        <div>
          <h2 class="weather-city">Terraza Casa Nopal</h2>
          <div class="weather-updated">Madrid · actualizado ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      <div class="weather-today">
        <div class="weather-summary">
          <div class="weather-icon-main">${getWeatherIcon(c.weather_code)}</div>
          <div class="weather-temp-main">${Math.round(c.temperature_2m)}°C</div>
          <div class="weather-desc">${getWMO(c.weather_code)}</div>
        </div>
        <div class="weather-details">
          <div class="weather-detail"><div class="weather-detail-label">Sensacion</div><div class="weather-detail-value">${Math.round(c.apparent_temperature)}°C</div></div>
          <div class="weather-detail"><div class="weather-detail-label">Humedad</div><div class="weather-detail-value">${c.relative_humidity_2m}%</div></div>
          <div class="weather-detail"><div class="weather-detail-label">Viento</div><div class="weather-detail-value">${Math.round(c.wind_speed_10m)} km/h</div></div>
          <div class="weather-detail"><div class="weather-detail-label">UV</div><div class="weather-detail-value">${c.uv_index}</div></div>
          <div class="weather-detail"><div class="weather-detail-label">Precipitacion</div><div class="weather-detail-value">${c.precipitation} mm</div></div>
          <div class="weather-detail"><div class="weather-detail-label">Estado</div><div class="weather-detail-value">${getWMO(c.weather_code)}</div></div>
        </div>
      </div>
      <h3 class="section-title">Proximos dias</h3>
      <div class="weather-days">${days.join('')}</div>
    </div>`;
}

function syncTabButtons(activeTab) {
  $$('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === activeTab));
}

async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  await loadPlaces();

  $$('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      syncTabButtons(state.activeTab);
      const menuSection = $('#lugares-section');
      const weatherSection = $('#weather-section');

      if (state.activeTab === 'lugares') {
        menuSection.style.display = '';
        weatherSection.style.display = 'none';
        renderCurrentView();
      } else {
        menuSection.style.display = 'none';
        weatherSection.style.display = '';
        loadWeather();
      }
    });
  });

  const searchInput = $('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value.trim();
      applyFilters();
    });
  }

  $$('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeType = chip.dataset.type;
      applyFilters();
    });
  });

  $$('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeView = btn.dataset.view;
      renderCurrentView();
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'meteo') {
    $('#tab-meteo')?.click();
  } else {
    renderCurrentView();
    updateResultsCount();
  }
}

document.addEventListener('DOMContentLoaded', init);
