# Casa Nopal - Restaurante Mexicano

Web/PWA estatica para un restaurante mexicano contemporaneo en Madrid. Incluye carta filtrable, vistas en tarjetas/lista/mapa, detalle de cada plato, compartir, reserva por telefono y clima para la terraza.

## Funcionalidades

| Feature | Descripcion |
|---|---|
| Carta filtrable | Busqueda por nombre, descripcion y tags |
| Categorias | Tacos, antojitos, principales, bebidas, postres y experiencias |
| Vista tarjetas | Grid responsivo con fotografias gastronomicas |
| Vista lista | Lectura compacta de precios, horarios y platos |
| Mapa | Ubicacion de Casa Nopal en Madrid con marcadores de platos destacados |
| Detalle | Modal con descripcion, precio, horario, direccion y acciones |
| Compartir | Web Share API con fallback a WhatsApp, email y copiar enlace |
| Terraza | Clima actual y prevision de 8 dias con Open-Meteo |
| PWA | Manifest y Service Worker para instalacion/cache basica |

## Estructura

```text
Roma/
├── index.html       # HTML principal
├── style.css        # Estilos de Casa Nopal
├── app.js           # Filtros, vistas, mapa, clima y compartir
├── lista.json       # Carta del restaurante
├── manifest.json    # Manifiesto PWA
├── sw.js            # Service Worker
└── Readme.md
```

## Ejecutar

La app usa `fetch` para cargar `lista.json`, asi que conviene servirla por HTTP:

```bash
python -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```

## Diseno

- Identidad: Casa Nopal, taqueria y cocina mexicana.
- Paleta: verde nopal, rojo chile, amarillo maiz, azul cielo y base clara.
- Tipografias: Fraunces para titulares e Inter para interfaz.
- Primer viewport: experiencia real de restaurante con marca, reserva y acceso directo a carta.

## Datos

`lista.json` contiene 16 opciones de carta y experiencias, todas con:

- nombre
- categoria
- descripcion larga y corta
- precio
- horario
- rating
- imagen
- tags
- ubicacion del restaurante

## Verificacion

- `node --check app.js`
- Parseo de `lista.json` y `manifest.json`
- Servidor local en `http://127.0.0.1:8080/`
- Prueba en navegador integrado: carga de tarjetas, mapa y clima
