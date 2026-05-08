# Registro de Prompts - Cruceros Interactivos 🛳️✍️

## Sesión: 08 de Mayo de 2026

### Prompt 1: Centrado en el crucero por el Caribe
**Usuario:** "vamos a centrarnos en el crucero por caribe con salida en miami.. quiero ver indicados en mapamundi cada uno de los puntros de amarre donde hace escala y una linea de navegación entre cada uno de ellos. al pinchar en uno de ellos quiero que nos lleve a otra nueva pantalla donde aparezcan todas las ciudades en plano y el recorrido entre ellas. pulsando cada una de las ciudades de escala debemos acceder a una pantalla identica a las que ya tenemos de ciudades y actividades, en cada escala deben aparecer datos de la ciudad y actividades a realizar. en la parte superior de la pagina debe aparecer foto del barco, caracteristicas posición de escala dentro del viaje completo..."

**Objetivo:** Implementar navegación multinivel para cruceros: Globo -> Itinerario -> Plano de Escala -> Guía de Ciudad.

### Prompt 2: Vistosidad y Animaciones
**Usuario:** "me gustaria darle vistosidad y meter alguna animacion"

**Objetivo:** Elevar la calidad visual con efectos interactivos y transiciones cinematográficas.

### Prompt 3: Circuitos Completos y Navegación Unificada
**Usuario:** "pinchando en cualquiera de las escalas de un crucero concreto nos llevará a la misma pantalla de ese crucero, por eso debemos tener en el mapamundi todas las ciudades de escala del mismo crucero conectadas con una linea que simule el circuito que hace el barco"

**Objetivo:** Garantizar que todas las escalas sean puntos de entrada al crucero y que las rutas sean circuitos cerrados realistas.

### Prompt 4: Control Manual del Globo
**Usuario:** "necesito que el maap mundi no gire solo, sino cuando lo mueva yo desde ratón o pantalla táctil"

**Objetivo:** Desactivar la rotación automática del globo para mejorar la precisión de la navegación manual.

### Prompt 5: Exclusividad de Filtros (Ciudades vs Cruceros)
**Usuario:** "vamos a poner un botón on/off en Continentes. Si está habilitado (por defecto) se dehabilita cruceros y si se habilita cruceros se deshabilita continentes. Pero si se deshabilita uno de ellos no se habilita el otro."

**Objetivo:** Implementar una lógica de filtrado excluyente para evitar la saturación de elementos en el globo.

### Prompt 6: Visibilidad Persistente y Deshabilitación Visual
**Usuario:** "si habilito continentes debo permitir habilitar cualquier continente y debo deshabilitar cruceros, además deben aparecer todas las zonas de los cruceros, pero se deshabilitarán también. Si habilito cruceros, se permitirá habilitar las zonas de los cruceros y deshabilitará continentes y cada uno de los continentes"

**Objetivo:** Mantener todos los filtros visibles pero deshabilitar visualmente (`grayscale`, `opacity`) y funcionalmente (`disabled`) aquellos que no pertenezcan al grupo activo.

### Prompt 7: Mapamundi Vacío al Inicio y Refinamiento de Lógica Excluyente
**Usuario:** "no funciona.vamos a definirlo de nuevo. de inicio mapamundi sin ciudades. si activo continentes permitirá habilitar los continentes que quiera. y deshabilitará cruceros y cada uno de las áreas de cruceros. Si habilito cruceros permitirá habilitar cualquier zona y deshabilitará continentes y cada uno de los continentes. POor cierto el mapamundi ahora no aparece"

**Objetivo:** Reiniciar el estado del mapa a vacío, corregir errores de visualización del globo y asegurar que la exclusividad entre grupos de filtros sea total y afecte tanto al grupo como a sus sub-opciones individuales.

### Prompt 8: Deshabilitación por Defecto de Sub-opciones
**Usuario:** "igual que resto de zonas Caribe debe aparecer deshabilitado. Al habilitar continentes no se deben habilitar cada uno de ellos a no ser que se active manualmente. Igual pasa con las zonas de cruceros"

**Objetivo:** Garantizar que al activar un grupo principal (Ciudades o Cruceros), ninguna sub-opción se active automáticamente. El usuario debe elegir específicamente qué continentes o zonas de crucero quiere ver. Además, unificar el comportamiento de "El Caribe" con el resto de zonas.

### Acciones Realizadas:
1.  **HTML**: Eliminado el atributo `checked` de todos los continentes y regiones de crucero.
2.  **Conversión a Checkboxes**: Cambiadas las regiones de crucero de `radio` a `checkbox` para permitir selección múltiple manual y estado inicial "todo apagado".
3.  **Lógica JS**: Actualizado el estado inicial a arrays vacíos y ajustado el filtrado para soportar múltiples regiones simultáneas.
