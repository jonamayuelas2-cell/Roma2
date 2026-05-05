<p align="center">
  <img src="icons/icon-512.png" alt="Ciudades del Mundo" width="160">
</p>

# 🌍 Ciudades del Mundo PWA — Tu Guía Global de Viaje

> Explora las ciudades más fascinantes del mundo desde una sola aplicación 🏛️🗼🗽

---

## 📋 Descripción del Proyecto

**Ciudades del Mundo** es una plataforma global multi-ciudad que permite a los usuarios navegar por el mundo mediante un **globo terráqueo 3D interactivo**. La aplicación adapta su identidad visual (colores y tipografía) a cada destino seleccionado, ofreciendo una experiencia inmersiva y personalizada.

---

## ✨ Funcionalidades Premium

| Feature | Descripción |
|---|---|
| 🌎 **Globo 3D interactivo** | Selector de destinos basado en una bola del mundo que gira 360° |
| 🎨 **Identidad Dinámica** | Cada ciudad tiene su propio esquema de colores y tipografía (Cinzel, Playfair, etc.) |
| 📍 **Filtrado de Contenido** | Solo se muestran destinos con información real disponible (Roma, París, Londres, Barcelona) |
| 🗺️ **Mapa Interactivo** | Visualización de puntos de interés con Leaflet |
| 🌤️ **Tiempo Real** | Pronóstico meteorológico dinámico vía Open-Meteo |
| 📱 **PWA Completa** | Instalable, rápida y diseñada para móviles y escritorio |

---

## 📁 Estructura de Archivos

```
Ciudades-del-Mundo/
├── data/               # 📂 Datos específicos por ciudad (Lugares, coordenadas, etc.)
│   ├── roma.json       # Datos de Roma
│   ├── paris.json      # Datos de París
│   ├── londres.json    # Datos de Londres
│   └── barcelona.json  # Datos de Barcelona
├── prompts/            # 📝 Historial de prompts IA
├── cities.json         # Metadata de las ciudades, geolocalización y temas visuales
├── app.js              # Lógica core, integración de Globe.gl y gestión de temas
├── index.html          # Estructura principal y carga de librerías
├── style.css           # Estilos globales y contenedores del globo
└── Readme.md           # Este fichero
```

---

## 🚀 Cómo Ejecutar

```bash
# Servidor local recomendado
npx serve -l 8080 .
```
Luego abrir: `http://localhost:8080`.

---

## 📜 Historial de Cambios

### v1.6.0 — 2026-05-04 📦🚀
- 🏗️ **Arquitectura Simplificada**: Consolidada toda la información de ciudades y sus lugares de interés en un único archivo `cities.json`.
- ⚡ **Optimización de Carga**: Eliminadas múltiples peticiones HTTP al navegar entre ciudades; ahora todo el contenido se carga inicialmente, mejorando la velocidad de respuesta.

### v1.5.0 — 2026-05-04 📂✨
- 🌍 **Base de Datos Global**: Creados los 20 archivos JSON de datos para todas las ciudades del mundo, proporcionando lugares de interés reales para cada destino.
- 🏛️ **Contenido Enriquecido**: Añadidos monumentos, museos y barrios icónicos para ciudades como Nueva York, Tokio, El Cairo, etc.

### v1.4.0 — 2026-05-04 🌍📸
- 🏙️ **20 Ciudades**: Ampliada la base de datos a 20 destinos globales icónicos.
- 🖼️ **Hover Preview**: Al posicionarse sobre una ciudad en el globo, se muestra una previsualización en grande del destino.

### v1.3.0 — 2026-05-04 🌍💫
- 🌎 **Globe Selector**: Implementada bola del mundo 3D usando `Globe.gl` para la selección de ciudades.
- 🎨 **Dynamic Styling**: Cada ciudad ahora aplica su propio color primario y tipografía al entrar.
- 🔍 **Filtered Data**: El selector solo muestra ciudades con contenido JSON validado.
- 🏛️ **Global Branding**: Identidad visual del proyecto actualizada a "Ciudades del Mundo".

### v1.2.0 — 2026-05-04 🌍
- 🚀 **Multi-Ciudad**: Implementado carrusel inicial (ahora deprecado por el globo).
- 📂 **Arquitectura Dinámica**: Refactorización de `app.js` para carga de datos asíncrona.
- 📦 **Nuevos Destinos**: Añadidos datos iniciales para París, Londres y Barcelona.

---

*Creado con ❤️ y IA para explorar el mundo* 🌍
