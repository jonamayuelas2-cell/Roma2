# Configuracion inicial del mapamundi

Fecha de guardado: 2026-05-10

## Comportamiento esperado

- Todos los switches arrancan en `off`.
- Al cargar la app, el mapamundi no muestra ciudades ni cruceros.
- Activar `Continentes` no muestra ciudades por si solo.
- Solo aparecen ciudades cuando se activa uno o varios continentes concretos.
- Si se desactiva el ultimo continente, el mapamundi vuelve a quedar sin ciudades.
- Activar `Cruceros` desactiva `Continentes` y todos sus switches.
- Activar `Continentes` o cualquier continente concreto desactiva `Cruceros`, sus zonas y la lista de cruceros.
- Activar `Cruceros` no muestra ninguna lista hasta seleccionar una o varias zonas concretas.
- Activar una zona de cruceros muestra la lista filtrada, pero no pinta cruceros en el mapamundi.
- Solo se pinta un crucero en el mapamundi al pinchar una tarjeta de la lista de cruceros.

## Puntos clave en `app.js`

- `state.activeFilters.showCities` debe arrancar en `false`.
- `state.activeFilters.showCruises` debe arrancar en `false`.
- `state.activeFilters.continents` debe arrancar como `[]`.
- `state.activeFilters.cruiseRegions` debe arrancar como `[]`.
- `refreshGlobeData()` solo debe mostrar ciudades si `showCities` es `true` y hay continentes seleccionados.
- `refreshGlobeData()` solo debe mostrar cruceros si `showCruises` es `true` y existe `state.currentCruise`.
- `getFilteredCruiseList()` debe devolver `[]` si no hay zonas de crucero seleccionadas.
- `clearContinents()` y `clearCruises()` mantienen los modos de continentes y cruceros como excluyentes.

## Mapamundi base

- Textura del globo: `https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg`
- Relieve del globo: `https://unpkg.com/three-globe/example/img/earth-topology.png`
- GeoJSON de paises: `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson`
