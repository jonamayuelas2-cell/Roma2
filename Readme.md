# Registro de Cambios - TravelWorld PWA 🌍🛳️

## [2026-05-08] - Panel de Control Global e Integración de Cruceros

### Añadido 🆕
- **Interruptores ON/OFF**: Los antiguos checkboxes de continentes han sido sustituidos por interruptores deslizantes modernos.
- **Iconografía Redimensionada**: Se ha reducido el tamaño de los marcadores de ciudades en el globo para una visualización más limpia y profesional.
- **Sincronización Global**: Corrección de los valores de filtrado para asegurar que ciudades de todos los continentes (América, África, Asia, Oceanía, Eurasia) se visualicen correctamente.
- **Panel de Control del Globo**: Nueva interfaz flotante (`globe-controls-panel`) con efecto glassmorphism para gestionar filtros.
- **Modo Cruceros**: Toggle para activar la visualización de rutas marítimas y barcos.
- **Dataset de Cruceros**: Creación de `cruises.json` con rutas para el Mediterráneo, Países Nórdicos, Caribe y otras regiones.
- **Animación de Barcos**: Implementación de una capa personalizada en `Globe.gl` que simula el movimiento de barcos (`🚢`) entre puertos.
- **Subpáginas de Cruceros**: Las paradas de los cruceros ahora son interactivas y abren la misma estructura de detalles (clima, lugares, actividades) que las ciudades principales.

### Modificado 🛠️
- `index.html`: Inyectada la estructura del panel de controles.
- `style.css`: Añadidos estilos para el panel, toggles premium y animaciones de barcos.
- `app.js`: 
    - Implementación de la lógica de filtrado reactivo.
    - Centralización de la carga de datos (`loadCruises`).
    - Mejora del sistema de renderizado del globo con `callGlobe` y `refreshData`.
- `cities.json`: Asegurada la consistencia de datos para el filtrado por continente.

### Técnico ⚙️
- Uso de `backdrop-filter: blur(12px)` para estética premium.
- Lógica de interpolación lineal para la animación de barcos en tiempo real.
- Sistema de "Z-index" ajustado para asegurar que los controles no interfieran con la interactividad del globo pero permanezcan accesibles.
