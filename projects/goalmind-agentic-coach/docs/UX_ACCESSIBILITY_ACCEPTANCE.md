# GoalMind — UX, accesibilidad y QA: gate de aceptación

Este gate se aplica al circuito público `Coach -> Material -> Scout -> Game Master -> Referee -> Partido -> Memoria` antes de declarar una preview funcional.

## 1. Jerarquía y flujo

- El Coach es la acción primaria de estudio; Material es una entrada de evidencia al mismo circuito, no un producto paralelo.
- Una pantalla debe tener una acción primaria inequívoca.
- Estados obligatorios: vacío, cargando, éxito, error recuperable y sin resultados.
- La transición `plan -> partido` debe conservar tema, rival, OVR, tiempo por pregunta y referencias.
- El resultado debe indicar aciertos/total, precisión, puntuación y siguiente acción.

## 2. Accesibilidad mínima

- Todo control interactivo es alcanzable por teclado y tiene foco visible.
- Botones de respuesta A–D conservan texto/etiqueta accesible; el significado no depende solo del color.
- Objetivos táctiles: mínimo 44x44 CSS px.
- Contraste de texto normal >= 4.5:1; texto grande >= 3:1.
- Estados `gol`, `atajada`, `timeout`, `cargando` y errores se anuncian mediante región viva apropiada.
- Animaciones no esenciales respetan `prefers-reduced-motion`.
- La escena de penalti no bloquea zoom, orientación ni navegación por teclado.
- Inputs de Coach/Material tienen `label` persistente, instrucciones y errores asociados semánticamente.
- Fuentes externas muestran nombre/origen y el enlace tiene nombre comprensible fuera de contexto.

## 3. Coach y Material

- Envío vacío no llama al backend.
- Durante generación se evita doble submit.
- Fallo de Wikipedia/OpenAlex no rompe el plan cuando existe evidencia GoalMind/privada suficiente.
- Token `GMATERIAL` nunca se presenta como contenido pedagógico al estudiante.
- Material privado solo aparece en la sesión autorizada.
- Si Referee elimina todas las preguntas, se muestra error recuperable; nunca se inicia un partido vacío.

## 4. Partido

- Solo se acepta una respuesta por pregunta.
- Timeout y respuesta manual son mutuamente excluyentes.
- Feedback muestra resultado y explicación antes de avanzar.
- La opción correcta no queda expuesta antes de responder.
- Puntuación, racha y precisión no pueden producir NaN, Infinity ni valores negativos imposibles.
- Al finalizar, el resultado se persiste una sola vez aun con doble clic/refresco defensivo.

## 5. Viewports obligatorios

QA visual mínimo:

- móvil: 390x844;
- escritorio: 1440x900.

En ambos: sin scroll horizontal accidental, controles visibles, modal/panel sin clipping, portería utilizable y fuentes legibles.

## 6. Evidencia de QA

Cada preview marcada `verified` debe registrar:

- URL exacta y fecha;
- commit SHA/branch desplegada;
- healthcheck;
- recorrido Coach -> partido -> resultado;
- recorrido Material -> Coach -> partido;
- consola: 0 errores no justificados;
- red: 0 requests fallidas no justificadas;
- captura móvil y escritorio;
- incidencias conocidas explícitas.

## 7. Política de publicación

`ready` del proveedor no equivale a `verified`. Solo se marca funcional después de completar este gate. `main` no se fusiona sin aprobación explícita del usuario.
