# Plan de Implementación: PWA Multi-Ciudad 🌍✨

Este plan detalla los pasos para transformar la guía de Roma en una plataforma global con un carrusel inicial de 20 ciudades.

## 1. Estructura de Datos 📂
- **`cities.json`**: Nuevo archivo con la lista de 20 ciudades (id, nombre, país, lat, lng, imagen).
- **Carpeta `data/`**: Contendrá archivos JSON individuales para cada ciudad (ej. `roma.json`, `paris.json`).
- **Migración**: Renombrar `lista.json` a `data/roma.json`.

## 2. Cambios en la Lógica (`app.js`) 🧠
- **Estado Global**: Añadir `currentCity` y `citiesList`.
- **Modo Selección**: Implementar una vista inicial que muestre el carrusel.
- **Carga Dinámica**: Función para cargar el JSON de la ciudad seleccionada y actualizar el estado (incluyendo coordenadas para el clima).
- **Navegación**: Botón "Volver" para regresar al carrusel de ciudades.

## 3. Cambios en el Diseño (`index.html` & `style.css`) 🎨
- **Carrusel**: Crear una sección `city-selection` con un carrusel fluido (CSS Scroll Snap).
- **Hero Dinámico**: El título y la descripción del Hero cambiarán según la ciudad seleccionada.
- **Transiciones**: Animaciones suaves al entrar y salir de una ciudad.

## 4. Lista de Ciudades Seleccionadas 📍
1.  **Roma** 🇮🇹
2.  **París** 🇫🇷
3.  **Londres** 🇬🇧
4.  **Nueva York** 🇺🇸
5.  **Tokio** 🇯🇵
6.  **Barcelona** 🇪🇸
7.  **Madrid** 🇪🇸
8.  **Berlín** 🇩🇪
9.  **Ámsterdam** 🇳🇱
10. **Praga** 🇨🇿
11. **Estambul** 🇹🇷
12. **Dubái** 🇦🇪
13. **Sídney** 🇦🇺
14. **Río de Janeiro** 🇧🇷
15. **Buenos Aires** 🇦🇷
16. **Ciudad de México** 🇲🇽
17. **Lisboa** 🇵🇹
18. **Venecia** 🇮🇹
19. **Florencia** 🇮🇹
20. **Kioto** 🇯🇵

## 5. Próximos Pasos 🛠️
1.  Crear `cities.json`.
2.  Preparar la carpeta `data/` con datos de ejemplo para las ciudades principales.
3.  Actualizar la lógica de `app.js`.
4.  Refactorizar `index.html` para el carrusel.
5.  Pulir estilos.

---
*¡Vamos a hacer que esta PWA sea impresionante!* 🚀🌟
