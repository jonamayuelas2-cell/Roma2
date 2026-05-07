# 🗺️ Plan de Implementación: Estambul Premium 🇹🇷

## 🎯 Objetivo
Transformar Estambul en un destino de nivel Premium, con imágenes de alta fidelidad y un sistema de actividades completo integrado en los datos, superando la lógica hardcoded actual.

## 📦 Entregables

### 1. Imágenes Premium (Carpeta `img/`)
Se generarán nuevas imágenes con estilo cinematográfico, iluminación dramática y resolución percibida de 8K para:
- `istanbul_hagiasophia.png` (Santa Sofía)
- `istanbul_bluemosque.png` (Mezquita Azul)
- `istanbul_topkapi.png` (Palacio Topkapi)
- `istanbul_grandbazaar.png` (Gran Bazar)
- `istanbul_spicebazaar.png` (Bazar de las Especias)
- `istanbul_galata.png` (Torre de Galata)
- `istanbul_bosphorus.png` (Crucero por el Bósforo)
- `istanbul_basilicacistern.png` (Cisterna Basílica)
- `istanbul_dolmabahce.png` (Palacio Dolmabahce)

### 2. Actividades Estambul (Carpeta `img/estambul_activities/`)
Se generarán imágenes representativas para las actividades más destacadas.
- Formato: `slug_actividad_index.png`

### 3. Reestructuración de Datos
- **`data/estambul.json`**: Añadir campo `actividades` a cada lugar con:
    - `titulo`
    - `descripcion`
    - `imagen`
    - `proveedor`
    - `contacto`
    - `horario`
- **`cities.json`**: Sincronizar los cambios de Estambul.

### 4. Actualización de Lógica (`app.js`)
- Actualizar `getTotalActivitiesCount` para incluir Estambul.
- (Opcional) Modificar `getPlaceActivities` para leer del JSON si los datos están presentes, manteniendo el fallback actual.

## ⏳ Cronograma de Tareas
1. **Fase 1**: Generación de imágenes de lugares (9 imágenes).
2. **Fase 2**: Generación de imágenes de actividades principales (selección de 9-18 imágenes clave).
3. **Fase 3**: Actualización del JSON de Estambul con toda la info de actividades.
4. **Fase 4**: Actualización de `cities.json` y `app.js`.

---
🌟 *Nota: Para mantener la eficiencia, generaremos primero las imágenes de los lugares y luego procederemos con los datos.*
