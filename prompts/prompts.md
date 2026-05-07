# 📝 Registro de Prompts - Estambul Premium 🇹🇷

## 🕒 2026-05-07 17:10
**User Request:** "vamos a volver a realizar cambio para asignar foto a cada lugar en Estambul y de paso crear las actividades en cada uno de los lugares como hemos hecho en Roma"

**Plan Initial:**
1. Documentar el proceso en Readme.md. 📝
2. Generar imágenes Premium (8K, cinematográficas) para los 9 puntos de interés de Estambul. 📸
3. Estructurar las actividades en el JSON de Estambul para que coincidan con el modelo de Roma. 🏗️
4. Actualizar `app.js` para que el sistema reconozca Estambul como ciudad con actividades completas. ⚙️

---

## 🕒 2026-05-07 17:25
**Activity Image Generation Prompts:**
1. **Santa Sofia:** "Professional cinematic travel photograph of a guided historical tour inside Hagia Sophia, Istanbul. Showing gold mosaics, massive dome, and tourists listening to a guide. 8k resolution, documentary style, authentic atmosphere."
2. **Mezquita Azul:** "Professional cinematic travel photograph of a guided tour inside the Blue Mosque (Sultan Ahmed Mosque), Istanbul. Blue Iznik tiles, massive chandeliers, peaceful spiritual atmosphere. 8k resolution."
3. **Topkapi:** "Professional cinematic travel photograph of the Harem in Topkapi Palace, Istanbul. Intricate tilework, imperial chambers, historical luxury. 8k resolution."
4. **Gran Bazar:** "Professional cinematic travel photograph of shopping in the Grand Bazaar, Istanbul. Colorful lamps, carpets, busy corridors, authentic market vibe. 8k resolution."
5. **Bazar Especias:** "Professional cinematic travel photograph of spice stalls in the Spice Bazaar, Istanbul. Mountains of colorful spices, saffron, turkish delight, vibrant market. 8k resolution."

*Nota: Debido a límites de cuota, el resto de actividades usan las imágenes principales como placeholder temporal siguiendo el mismo estándar premium de nomenclatura.*

---

## 🕒 2026-05-07 18:05
**User Request:** "Vamos a hacer lo mismo con Barcelona. Creamos las fotos por cada lugar y dentro de cada lugasr metemos actividades"

**Plan Barcelona Premium:**
1. Definir 54 actividades (6 por cada uno de los 9 lugares) con datos reales/premium. ✅
2. Sincronizar `cities.json` y `data/barcelona.json` con la nueva estructura. ✅
3. Crear catálogo de prompts para regeneración visual total. ✅
4. ⚠️ **Nota:** Imágenes en espera por límite de cuota (~4h).

**Prompts Clave:**
*   **Hero:** "Professional cinematic 8k travel photograph of Barcelona skyline at sunset..."
*   **Sagrada Familia:** "Professional cinematic 8k travel photograph of the Sagrada Familia..."
*   **Park Guell:** "Professional cinematic 8k travel photograph of the main terrace..."

## 🕒 2026-05-07 17:55
**User Request:** Finalización de integración de activos y corrección de burbujas en el globo.

**Prompts de Imágenes Generales (Hero y Lugares):**
1. **Estambul Hero (Bósforo):** "Professional cinematic 8k travel photograph of the Bosphorus at sunset in Istanbul. Skyline with mosques, the bridge in the distance, seagulls flying, golden hour, ultra-realistic."
2. **Santa Sofía (Nueva):** "Professional cinematic 8k travel photograph of Hagia Sophia (Ayasofya) at sunset. Golden hour light, intricate architectural details, majestic dome, wide angle."
3. **Mezquita Azul (Nueva):** "Professional cinematic 8k travel photograph of the Blue Mosque from Sultanahmet Square. Early morning light, six minarets, vibrant colors."

**Estado de la Cuota de Imágenes:**
*   ⚠️ **Agotada:** La cuota de generación de imágenes se ha agotado (Reset en ~4h).
*   ✅ **Acción:** Se han recuperado las 5 imágenes de actividades generadas anteriormente desde los artefactos y se han asignado a sus carpetas correspondientes.
*   🔄 **Pendiente:** Generación de las 49 imágenes de actividades restantes una vez se restablezca la cuota.

**Cambios en el JSON:**
## 🕒 2026-05-07 19:05
**User Request:** "generame las actividades para cada lugar de Rio de Janeiro"

**Plan Rio Premium:**
1. Definir 54 actividades (6 por cada uno de los 9 lugares) con datos reales/premium para Rio de Janeiro. ✅
2. Sincronizar `cities.json` y `data/rio.json` con la nueva estructura. ✅
3. Documentar en `Readme.md` y guardar artefacto. ✅

**Generación de Datos:**
*   Se utilizó un script de Python (`scratch/generate_rio.py`) para estructurar los 9 lugares con sus respectivas 6 actividades cada uno, asegurando coherencia con el modelo de Estambul y Roma.
*   Las actividades incluyen proveedores ficticios pero realistas, horarios, y descripciones detalladas.
