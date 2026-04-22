# 🎨 Plan de Modernización Visual: Roma Eterna 🏛️✨

Este plan detalla los cambios para eliminar los tonos marrones y sustituirlos por una estética más moderna, premium y vibrante, manteniendo la esencia de la "Ciudad Eterna".

## 🎯 Objetivos
*   **Eliminar** los marrones terrosos y el fondo `#0d0500`.
*   **Implementar** una paleta "Midnight Gold": Negros profundos, grises pizarra y un dorado más eléctrico/metálico.
*   **Mejorar** el contraste y la legibilidad.
*   **Añadir** efectos de *Glassmorphism* más pronunciados.

## 🌈 Nueva Paleta de Colores
| Elemento | Color Actual (Marrón) | Nuevo Color (Moderno) |
| :--- | :--- | :--- |
| **Fondo Principal** | `#0d0500` (Marrón oscuro) | `#02040a` (Deep Space Black/Blue) |
| **Tarjetas/Contenedores** | `#1a0f00` | `rgba(15, 20, 30, 0.7)` (Glass Blue-Grey) |
| **Bordes/Detalles** | `#3d2b10` | `#2a313d` (Steel Grey) |
| **Acento (Oro)** | `#c9963c` | `#ffd700` (Bright Gold) o `#e5b80b` |

## 🛠️ Pasos de Implementación

### 1. Actualización de Variables CSS (`style.css`) 📝
Modificar el bloque `:root` para redefinir los colores base:
*   `--bg-color`: De marrón oscuro a un negro azulado profundo.
*   `--card-bg`: De marrón a gris oscuro translúcido.
*   `--accent-color`: Refinar el dorado para que brille más sobre el nuevo fondo.

### 2. Refinamiento de Gradientes 🌊
Cambiar los gradientes que usan tonos marrones por gradientes que vayan de negro a gris oscuro o azul medianoche.

### 3. Ajuste de Sombras y Luces ✨
Usar sombras más sutiles pero con un ligero tinte azulado/frío para contrarrestar el calor del dorado, creando un look más "Apple-style" o "Cyber-Roman".

### 4. Verificación en Tiempo Real 🌐
Comprobar cómo se ve la lista de puntos de interés y el mapa con la nueva estética.

---
**¿Te gusta esta dirección "Midnight Gold"?** 🌙✨ Si me das el visto bueno, ¡procedo a actualizar el CSS! 🚀🏛️🔥
