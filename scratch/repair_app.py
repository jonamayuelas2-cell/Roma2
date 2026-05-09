import os

file_path = r"c:\Users\jamayuelas\OneDrive - ELMUBAS IBERICA, SLU\Documentos\Personal\IA\Antigravity\Roma\app.js"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Fix corrupted section at 1590
# We search for "rendefunction selectCruise" and restore the proper code
new_lines = []
skip = False
for i, line in enumerate(lines):
    if "rendefunction selectCruise" in line:
        # Restore the missing end of renderPlaceActivities
        new_lines.append('                    ${!getWebsiteUrl(activity.contact) ? `<div><dt>Contacto</dt><dd>${renderContactValue(activity.contact)}</dd></div>` : ""}\n')
        new_lines.append('                    ${activity.web ? `<div><dt>Web</dt><dd>${renderWebValue(activity.web)}</dd></div>` : ""}\n')
        new_lines.append('                    <div><dt>Coste</dt><dd>${escapeHtml(activity.cost || "Consultar")}</dd></div>\n')
        new_lines.append('                    <div><dt>Horario</dt><dd>${activity.schedule}</dd></div>\n')
        new_lines.append('                </dl>\n')
        new_lines.append('            </div>\n')
        new_lines.append('        </article>\n')
        new_lines.append('    `).join("");\n')
        new_lines.append('}\n\n')
        new_lines.append('function showPlaceDetails(place) {\n')
        new_lines.append('    const modal = document.getElementById("place-modal");\n')
        new_lines.append('    document.getElementById("modal-place-img").src = assetUrl(place.imagen || place.imagenCard);\n')
        new_lines.append('    document.getElementById("modal-place-img").alt = place.nombre;\n')
        new_lines.append('    document.getElementById("modal-place-tag").textContent = getTypeLabel(place.tipo);\n')
        new_lines.append('    document.getElementById("modal-place-title").textContent = place.nombre;\n')
        new_lines.append('    document.getElementById("modal-place-desc").textContent = place.descripcion || place.descripcionCorta;\n')
        new_lines.append('    document.getElementById("modal-place-extra").textContent = getPlaceExtraInfo(place);\n')
        new_lines.append('    document.getElementById("modal-place-price").textContent = `Precio: ${place.precio || "Consultar"}`;\n')
        new_lines.append('    document.getElementById("modal-place-hours").textContent = `Horario: ${place.horario || "Consultar"}`;\n')
        new_lines.append('    document.getElementById("modal-place-rating").textContent = `Valoracion: ${place.rating || "4.7"} / 5`;\n')
        new_lines.append('    const placeWeb = renderWebValue(place.web);\n')
        new_lines.append('    const placeContact = document.getElementById("modal-place-contact");\n')
        new_lines.append('    placeContact.hidden = !placeWeb;\n')
        new_lines.append('    placeContact.innerHTML = placeWeb ? `Web: ${placeWeb}` : "";\n')
        new_lines.append('    renderPlaceActivities(place);\n')
        new_lines.append('    document.getElementById("modal-place-tags").innerHTML = (place.tags || [])\n')
        new_lines.append('        .map(tag => `<span>${tag}</span>`)\n')
        new_lines.append('        .join("");\n')
        new_lines.append('    modal.hidden = false;\n')
        new_lines.append('    document.body.style.overflow = "hidden";\n')
        new_lines.append('}\n\n')
        new_lines.append('function closePlaceDetails() {\n')
        new_lines.append('    const modal = document.getElementById("place-modal");\n')
        new_lines.append('    if (!modal) return;\n')
        new_lines.append('    modal.hidden = true;\n')
        new_lines.append('    document.body.style.overflow = "";\n')
        new_lines.append('}\n\n')
        new_lines.append('function selectCruise(idOrCruise) {\n')
        # The line already contains some of selectCruise but it's messy, so we'll skip ahead
        skip = True
        continue
    
    if skip:
        # Skip until we find a stable point, like the start of updateCruiseDetailUI
        if "function updateCruiseDetailUI(cruise)" in line:
            skip = False
            # We don't append the line here because we want to replace the whole updateCruiseDetailUI too
            # Actually, let's just append the clean selectCruise first
            pass
        else:
            continue

    if not skip:
        new_lines.append(line)

# Clean selectCruise and updateCruiseDetailUI
content = "".join(new_lines)

# We define the clean versions of both functions
clean_code = """
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
        // Prioridad: fotoBarco > imagenBuque > imagenItinerario
        const photoUrl = cruise.buque?.fotoBarco || cruise.buque?.imagen || cruise.imagen;
        shipImg.src = assetUrl(photoUrl);
        shipImg.alt = shipInfo.shipName;
        
        // Fallback premium si la imagen falla
        shipImg.onerror = () => {
            console.warn(`Error cargando imagen del barco ${shipInfo.shipName}, usando fallback.`);
            shipImg.src = 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800';
            shipImg.onerror = null;
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
"""

# Now we need to remove the messy tail that the tool left
# We find the start of getVesselFinderApiKey which is stable
tail_start = content.find("async function getVesselFinderApiKey()")
if tail_start != -1:
    content = content[:tail_start]

# Also remove the broken selectCruise/updateCruiseDetailUI we just added if it's there
head_end = content.find("function selectCruise(idOrCruise)")
if head_end != -1:
    content = content[:head_end]

final_content = content + clean_code + "\n\n" + """
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
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(final_content)

print("File repaired successfully.")
