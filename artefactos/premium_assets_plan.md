# Plan de Estandarización de Activos Premium 📸💎

Este documento detalla el estado actual de la migración de imágenes de `picsum.photos` a activos locales ultra-premium (8K) y establece la hoja de ruta para completar la transformación.

## 📊 Resumen de Estado
- **Total de Ciudades**: 20
- **Ciudades Completadas**: 14 (Roma, París, Londres*, El Cairo, Ciudad del Cabo, Tokio, Bangkok, NYC, Ciudad de México, Río, Lima, Sídney, Madrid, Auckland*)
- **Imágenes Pendientes**: 68 (6 Heroes + 62 Lugares)
- **Bloqueo Actual**: Cuota de generación de IA agotada (reinicio estimado en 3.5 horas).

## 🗺️ Inventario de Activos Pendientes

### 1. Barcelona 🇪🇸
- **Hero**: `img/barcelona_hero.png`
- **Lugares**: Sagrada Família, Park Güell, Barrio Gótico, Casa Batlló, La Rambla, Boquería, Montjuïc, Barceloneta, Palau de la Música.

### 2. Buenos Aires 🇦🇷
- **Hero**: `img/buenosaires_hero.png`
- **Lugares**: Teatro Colón, Caminito, Recoleta, Av. 9 de Julio, Puerto Madero, El Ateneo, San Telmo, Palermo, Floralis Genérica.

### 3. Estambul 🇹🇷
- **Hero**: `img/istanbul_hero.png`
- **Lugares**: Santa Sofía, Mezquita Azul, Palacio Topkapi, Gran Bazar, Bazar de las Especias, Torre de Gálata, Crucero Bósforo, Cisterna Basílica, Palacio Dolmabahçe.

### 4. Ámsterdam 🇳🇱
- **Hero**: `img/amsterdam_hero.png`
- **Lugares**: Casa de Ana Frank, Rijksmuseum, Museo Van Gogh, Vondelpark, Canales, Jordaan, Mercado Albert Cuyp, Bloemenmarkt, NDSM Werf.

### 5. Atenas 🇬🇷
- **Hero**: `img/athens_hero.png`
- **Lugares**: Acrópolis, Partenón, Plaka, Museo Acrópolis, Ágora Antigua, Licabeto, Monastiraki, Estadio Panatenaico, Anafiotika.

### 6. Berlín 🇩🇪
- **Hero**: `img/berlin_hero.png`
- **Lugares**: Puerta de Brandeburgo, East Side Gallery, Isla Museos, Reichstag, Checkpoint Charlie, Tiergarten, Alexanderplatz, Memorial Holocausto, Kreuzberg.

### 7. Pendientes Parciales
- **Auckland**: Viaduct Harbour, Art Gallery, Ponsonby, Britomart, One Tree Hill.
- **Londres**: Buckingham Palace, The Shard, Covent Garden.

## 📝 Estrategia de Generación
Se utilizarán prompts específicos para cada destino manteniendo el estilo **"Premium National Geographic"**:
- **Resolución**: 8K Ultra-HD.
- **Iluminación**: Golden hour / Amanecer / Atardecer cinematográfico.
- **Atmósfera**: Profesional, sin turistas (salvo donde aporten vida local), composición arquitectónica perfecta.

## 🚀 Próximos Pasos
1. **Esperar reinicio de cuota**: Aproximadamente a las 11:30 UTC.
2. **Generación por lotes**: Procesar ciudades una a una para evitar nuevos bloqueos.
3. **Sincronización JSON**: Actualizar `cities.json` y archivos en `data/` simultáneamente con la copia de archivos a `img/`.

---
*Manteniendo el estándar de excelencia visual en cada píxel.* 🌟✈️
