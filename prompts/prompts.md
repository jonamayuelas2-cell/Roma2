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

**Objetivo:** Implementar una lógica de filtrado excluyente para evitar la saturación de elementos en el globo, dando prioridad a la intención del usuario.

### Acciones Realizadas:
1.  **UI**: Añadido interruptor principal (`#cities-toggle`) al grupo de Continentes.
2.  **Lógica JS**: Sincronización de interruptores para que al encender uno se apague el otro.
3.  **Visual**: Las sub-opciones se ocultan automáticamente cuando el interruptor de grupo está apagado.
4.  **Refactor**: Actualizada la función `refreshData` para respetar el estado de `showCities`.
