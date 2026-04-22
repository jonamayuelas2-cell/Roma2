# 🏛️ Roma Eterna — PWA Turismo de Viaje

> Tu guía definitiva para descubrir los tesoros de la Ciudad Eterna 🇮🇹

---

## 📋 Descripción del Proyecto

**Roma Eterna** es una Progressive Web App (PWA) de turismo orientada a visitantes de Roma. Ofrece una guía completa de puntos de interés con filtros, múltiples vistas y datos meteorológicos en tiempo real.

---

## ✨ Funcionalidades

| Feature | Descripción |
|---|---|
| 🗺️ **Mapa Interactivo** | OpenStreetMap con marcadores por tipo de lugar |
| ⊞ **Vista Tarjetas** | Grid responsivo con imágenes de picsum.photos |
| ≡ **Vista Lista** | Lista compacta con miniatura e información clave |
| 🔍 **Filtro de texto** | Búsqueda por nombre, descripción o tags |
| 🏷️ **Filtros por tipo** | Cultura, Museos, Restaurantes, Barrios, Parques, Mercados, Cafés |
| 📤 **Compartir lugar** | WhatsApp, Telegram, Email, Twitter/X o copiar enlace |
| 🌤️ **Tiempo en tiempo real** | Hoy + 8 días vía API Open-Meteo (sin clave) |
| 📱 **PWA** | Instalable, Service Worker, caché offline |

---

## 📁 Estructura de Archivos

```
Roma/
├── index.html          # HTML principal de la PWA
├── style.css           # Estilos completos (diseño oscuro dorado)
├── app.js              # Lógica JS: filtros, vistas, mapa, tiempo, compartir
├── sw.js               # Service Worker (caché offline)
├── manifest.json       # Manifiesto PWA
├── lista.json          # 20 puntos de interés en Roma
└── Readme.md           # Este fichero
```

---

## 📍 Puntos de Interés (`lista.json`)

20 lugares cubriendo todos los tipos:

| # | Lugar | Tipo |
|---|---|---|
| 1 | Coliseo Romano | 🏛️ Cultura |
| 2 | Vaticano - Basílica de San Pedro | 🏛️ Cultura |
| 3 | Museos Vaticanos | 🖼️ Museo |
| 4 | Fontana di Trevi | 🏛️ Cultura |
| 5 | Panteón de Agripa | 🏛️ Cultura |
| 6 | Plaza Navona | 🏛️ Cultura |
| 7 | Foro Romano | 🏛️ Cultura |
| 8 | Galería Borghese | 🖼️ Museo |
| 9 | Castel Sant'Angelo | 🖼️ Museo |
| 10 | Altar de la Patria | 🏛️ Cultura |
| 11 | La Pergola (3* Michelin) | 🍝 Restaurante |
| 12 | Tonnarello Trastevere | 🍝 Restaurante |
| 13 | Pizzarium Bonci | 🍝 Restaurante |
| 14 | Trastevere | 🏘️ Barrio |
| 15 | Campo de' Fiori | 🏘️ Barrio |
| 16 | Colina del Aventino | 🌿 Parque |
| 17 | Villa Borghese | 🌿 Parque |
| 18 | Mercado de Testaccio | 🛍️ Mercado |
| 19 | Catacumbas de San Calixto | 🖼️ Museo |
| 20 | Bar San Calisto - Gelato | ☕ Café |

---

## 🌤️ API Meteorológica

Utiliza **Open-Meteo** ([open-meteo.com](https://open-meteo.com)):
- ✅ Completamente gratuita
- ✅ Sin registro ni clave API
- ✅ Datos actuales + pronóstico 8 días
- ✅ Temperatura, humedad, viento, UV, precipitación

---

## 🚀 Cómo Ejecutar

Para un correcto funcionamiento como PWA (Service Worker) se recomienda un servidor local:

```bash
# Opción 1: con Python
python -m http.server 8080

# Opción 2: con Node.js
npx serve .

# Opción 3: con VS Code
# Usar extensión "Live Server" y abrir index.html
```

Luego abrir: `http://localhost:8080`

---

## 🎨 Diseño

- **Paleta**: Dorado (#c9963c) sobre oscuro (#0d0500)  
- **Tipografías**: Cinzel (títulos romanos) + Inter (cuerpo)  
- **Estética**: Glassmorphism oscuro, gradientes cálidos, animaciones suaves
- **Responsive**: Mobile-first, adaptado a todas las pantallas

---

## 📜 Historial de Cambios

### v1.1.1 — 2026-04-22 📤
- 📂 **Prompts**: Creada carpeta `prompts/` con el historial de interacciones.
- 🧹 **Git**: Añadido `.gitignore` y configurada la sincronización.
- 🌐 **GitHub**: Proyecto subido a `https://github.com/jonamayuelas2-cell/Roma2.git`.

### v1.0.1 — 2026-04-22 🛠️
- 🔍 Consulta sobre la disponibilidad del modo **Planning** en la interfaz de Antigravity.
- 💡 Explicación de las diferencias entre *Planning Mode* y *Fast Mode*.
- 🚀 **Arranque del sistema**: Servidor estático lanzado en el puerto **8080** para servir el Front/Back de la PWA.
- 🌐 **Verificación**: Comprobado el acceso a `http://localhost:8080` con éxito.

### v1.0.0 — 2026-04-22 🎉
- 🆕 Creación inicial del proyecto PWA
- 🆕 `lista.json` con 20 puntos de interés en Roma
- 🆕 Vista tarjetas, lista y mapa (OpenStreetMap/Leaflet)
- 🆕 Filtros por texto y por tipo de lugar
- 🆕 Modal de detalle con opción de compartir (WhatsApp, Telegram, Email, Twitter)
- 🆕 Tab meteorología con Open-Meteo API (hoy + 8 días)
- 🆕 Service Worker + manifest.json (PWA instalable)
- 🆕 Diseño oscuro dorado con tipografía Cinzel

### v1.0.1 — 2026-04-22 🛠️
- 🔍 Consulta sobre la disponibilidad del modo **Planning** en la interfaz de Antigravity.
- 💡 Explicación de las diferencias entre *Planning Mode* y *Fast Mode*.
- 🚀 **Arranque del sistema**: Servidor estático lanzado en el puerto **8080** para servir el Front/Back de la PWA.
- 🌐 **Verificación**: Comprobado el acceso a `http://localhost:8080` con éxito.

---

*Creado con ❤️ y IA para explorar la Ciudad Eterna* 🏛️
