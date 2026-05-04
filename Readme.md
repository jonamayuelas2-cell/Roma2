# 🌍 TravelWorld PWA — Tu Guía Global de Viaje

> Explora las ciudades más fascinantes del mundo desde una sola aplicación 🏛️🗼🗽

---

## 📋 Descripción del Proyecto

**TravelWorld** es una evolución de la PWA "Roma Eterna", ahora transformada en una plataforma global multi-ciudad. Permite a los usuarios seleccionar entre más de 20 destinos mundiales, cargando dinámicamente guías personalizadas, mapas interactivos y pronósticos meteorológicos en tiempo real para cada ubicación.

---

## ✨ Funcionalidades

| Feature | Descripción |
|---|---|
| 🎡 **Selector de Ciudades** | Carrusel interactivo premium con 20 destinos globales |
| 🗺️ **Mapa Interactivo** | OpenStreetMap con marcadores dinámicos por ciudad |
| 📥 **Carga Dinámica** | Datos JSON cargados bajo demanda para optimizar rendimiento |
| 🌤️ **Tiempo Dinámico** | Pronóstico basado en las coordenadas de la ciudad seleccionada |
| 🔍 **Filtros Avanzados** | Búsqueda y filtrado por categorías (Cultura, Museos, etc.) |
| 📱 **PWA Premium** | Instalable, offline y con diseño Glassmorphism |

---

## 📁 Estructura de Archivos

```
Roma/
├── data/               # 📂 Datos específicos por ciudad
│   ├── roma.json       # Guía de Roma
│   ├── paris.json      # Guía de París
│   ├── londres.json    # Guía de Londres
│   └── ...             # Otros destinos
├── artefactos/         # 📄 Documentación del proceso
├── prompts/            # 📝 Historial de prompts IA
├── cities.json         # Metadata de las 20 ciudades
├── app.js              # Lógica core multi-ciudad
├── index.html          # Estructura principal
├── style.css           # Estilos (Selector + App)
├── sw.js               # Service Worker
└── Readme.md           # Este fichero
```

---

## 🌤️ API Meteorológica

Utiliza **Open-Meteo** adaptándose a la latitud/longitud de la ciudad activa:
- ✅ Datos actuales + pronóstico 8 días
- ✅ Ajuste automático de zona horaria

---

## 🚀 Cómo Ejecutar

```bash
# Servidor local recomendado
npx serve .
```
Luego abrir: `http://localhost:3000` (o el puerto indicado).

---

## 📜 Historial de Cambios

### v1.2.0 — 2026-05-04 🌍
- 🚀 **Multi-Ciudad**: Implementado carrusel de selección con 20 ciudades.
- 📂 **Arquitectura Dinámica**: Refactorización de `app.js` para carga de datos asíncrona desde `/data/`.
- 🌤️ **Meteo Adaptativo**: Clima dinámico basado en coordenadas de la ciudad seleccionada.
- 🎨 **UI/UX**: Nuevo diseño para el selector de ciudades y navegación de retorno.
- 📦 **Nuevos Destinos**: Añadidos datos iniciales para París, Londres y Barcelona.

### v1.1.1 — 2026-04-22 📤
- 📂 **Prompts**: Creada carpeta `prompts/` con el historial de interacciones.
- 🧹 **Git**: Añadido `.gitignore` y configurada la sincronización.

### v1.0.0 — 2026-04-22 🎉
- 🆕 Creación inicial del proyecto PWA "Roma Eterna".

---

*Creado con ❤️ y IA para explorar el mundo* 🌍

