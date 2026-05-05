# Registro de Prompts - TravelWorld 🎨

## Estilo Visual General
- **Concepto**: Fotografía profesional de viajes, estilo National Geographic / Revista Condé Nast.
- **Iluminación**: Golden hour (atardecer), iluminación cinematográfica.
- **Calidad**: 8k, ultra-res, realista, enfoque nítido.

---

## [2026-05-05] - Consolidación de Datasets 🔄
**Acción**: Ejecución de script de fusión para unir 20 ciudades en el archivo central `cities.json`.
**Resultado**: 20 ciudades globales integradas con éxito. Base de datos final lista para la fase de inyección visual.

---

## [2026-05-05] - Generación Masiva de Datasets (20 ciudades) 🌍
**Objetivo**: Poblar la PWA con 20 destinos globales y 180 lugares de interés con descripciones de alta calidad.

**Prompts de Datos**:
"Genera la información técnica y descriptiva para las 20 ciudades del proyecto (Barcelona, Madrid, París, Londres, Nueva York, Tokio, El Cairo, Río, Ciudad de México, Lima, Buenos Aires, Estambul, Ámsterdam, Atenas, Berlín, Sídney, Auckland, Roma, Kioto, Venecia). 
- Para cada ciudad: 9 lugares con nombre, tipo (cultura, barrios, museos, parques), descripción premium, horario, precio, rating y tags.
- Define un tema visual único (primary color, font) para cada destino.
- Utiliza URLs de picsum.photos como placeholders de alta calidad hasta el reinicio de la cuota de generación de imágenes."

**Estado**: Datos generados, validados y fusionados en `cities.json`. Los archivos temporales han sido eliminados.

---

## [2026-05-05] - Mejora Interfaz Meteorológica 🌦️
**Objetivo**: Crear una experiencia de usuario "wow" al consultar el tiempo, similar a las apps de clima premium (Apple Weather, Yahoo Weather).

**Prompt de Diseño**:
"Diseña una interfaz de clima moderna usando CSS Vanilla. 
- Usa un degradado dinámico como fondo de la tarjeta principal.
- Implementa un panel de estadísticas con efecto de cristal (glassmorphism).
- Asegura que los datos sean legibles y estén bien jerarquizados (Temperatura > Condición > Detalles).
- Añade una lista de pronóstico limpia con iconos claros."

**Lógica de Datos**:
- API: Open-Meteo (Hourly + Daily).
- Nuevos parámetros: `apparent_temperature`, `relativehumidity_2m`, `uv_index_max`, `precipitation_probability_max`.

---

## [2026-05-05] - Imágenes de Lugares 📸
(Prompts detallados para Roma, París, Londres, NYC, Tokio, El Cairo... se mantienen en el histórico)

---
