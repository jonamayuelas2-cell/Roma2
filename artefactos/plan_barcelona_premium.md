# 🏙️ Plan Barcelona Premium 🇪🇸

Este documento detalla la hoja de ruta para elevar a Barcelona al estándar "Premium" de TravelWorld PWA, siguiendo el modelo de Roma y Estambul.

## 🏗️ Estado de la Estructura de Datos
- [x] **Lugares (9/9)**: Todos los puntos de interés definidos con descripciones editoriales.
- [x] **Actividades (54/54)**: 6 actividades por lugar con proveedor, contacto y horario sincronizados en `cities.json` y `data/barcelona.json`.
- [x] **Metadatos**: Precios, ratings y horarios actualizados.

## 📸 Catálogo de Prompts para Imágenes (Ejecutado)

### 🏙️ Ciudad (Hero)
1. **Barcelona Hero**: "Professional cinematic 8k travel photograph of Barcelona skyline at sunset. Sagrada Familia towers dominating, the Mediterranean sea in the background, warm golden light, ultra-realistic."

### 🏛️ Lugares de Interés
1. **Sagrada Familia**: "Professional cinematic 8k travel photograph of the Sagrada Familia, Barcelona. Detailed facade, vibrant sunset sky, architectural masterpiece."
2. **Park Guell**: "Professional cinematic 8k travel photograph of the main terrace of Park Guell. Colorful mosaics, dragon stairway, views over Barcelona."
3. **Barrio Gotico**: "Professional cinematic 8k travel photograph of a narrow street in the Gothic Quarter, Barcelona. Stone walls, medieval arches, soft morning light."
4. **Casa Batllo**: "Professional cinematic 8k travel photograph of Casa Batllo's facade. Colorful tiles, skull-shaped balconies, magical night lighting."
5. **La Rambla**: "Professional cinematic 8k travel photograph of La Rambla, Barcelona. Flower stalls, historic buildings, busy atmosphere, wide angle."
6. **Mercado de la Boqueria**: "Professional cinematic 8k travel photograph of the entrance of La Boqueria Market. Stalls with colorful fruits and juices, vibrant atmosphere."
7. **Montjuic**: "Professional cinematic 8k travel photograph of the Magic Fountain and MNAC museum in Montjuic. Epic night view, water and light show."
8. **Barceloneta**: "Professional cinematic 8k travel photograph of Barceloneta beach at sunrise. W Hotel in the distance, blue sea, palm trees."
9. **Palau de la Musica**: "Professional cinematic 8k travel photograph of the Palau de la Musica Catalana facade. Mosaic columns, sculptures, modernist masterpiece."

### 🎭 Actividades Destacadas
*(Se generarán siguiendo el patrón `[slug]_[index].png`)*

1. **Visita Sagrada**: "Professional travel photo of the interior of Sagrada Familia, light coming through stained glass, forest of columns."
2. **Picnic Park Guell**: "A couple having a picnic in the gardens of Park Guell, Barcelona, peaceful atmosphere."
3. **Cena Gotico**: "Cozy candlelit table in a historic tavern in the Gothic Quarter, Barcelona, authentic tapas."

## ⏳ Próximos Pasos
1. [x] **Generación de Activos**: Fotos principales disponibles en `img/` y 54 actividades creadas.
2. [x] **Despliegue**: Imágenes de actividades ubicadas en `img/barcelona_activities/`.
3. [x] **Validación**: Verificadas las rutas esperadas por `getActivityImage()`.

---
*Estado actual: Barcelona Premium con datos e imágenes de actividades listas.* 🇪🇸 🏁
