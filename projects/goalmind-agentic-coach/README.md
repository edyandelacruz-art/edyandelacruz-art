# GoalMind Agentic Coach

GoalMind Agentic Coach convierte una intención libre de estudio en un partido verificable y persistente.

## Flujo

`Student chat -> Coach -> Scout -> Game Master -> Referee -> Question Bank -> Match -> Result Memory`

### Coach
Interpreta el objetivo del estudiante: grado, tema, tiempo, dificultad, subtemas y formato deseado.

### Scout
Consulta fuentes conectadas. El primer conector federado incluye:

- catálogo curricular GoalMind;
- Wikipedia en español mediante MediaWiki REST Search;
- OpenAlex Works Search para metadata académica.

Los conectores devuelven metadata y fragmentos de contexto, no copias masivas de contenido.

### Game Master
Convierte el objetivo y evidencia en un partido: rival, OVR, duración, tiempo por pregunta, objetivos y banco de preguntas.

### Referee
Valida antes de publicar: cuatro opciones, una respuesta correcta, explicación no vacía, dificultad coherente y sourceRefs solo de fuentes devueltas por Scout.

### Memory
Guarda planes y resultados por sesión de jugador. Los siguientes planes pueden consultar desempeño reciente y adaptar rival, tiempo y complejidad.

## Contrato visible

Ejemplo de entrada:

> Estoy en 10.º, tengo examen de función cuadrática mañana. Me cuesta hallar el vértice y pasar a forma canónica. Quiero 15 minutos intensos.

Salida esperada:

- tema y asignatura;
- grado;
- objetivos;
- nivel estimado;
- rival y OVR;
- ruta de estudio;
- 5 o 10 preguntas verificadas;
- metadata de fuentes consultadas;
- botón directo `Jugar este partido`.

## Persistencia

Tablas lógicas por jugador invitado:

- `study_plans:<guestId>`
- `study_results:<guestId>`

Esto mantiene lecturas acotadas y evita escanear tablas crecientes.

## Estado de publicación

La URL pública verificada del flujo V2 es `https://goalmind-mvp-tev8mi.v2.appdeploy.ai/` (QA público registrado el 30 de septiembre de 2026). La rama `feature/goalmind-agentic-coach` continúa como rama de integración y el PR #6 permanece draft; `main` no se fusiona sin aprobación explícita.

### Política de inferencia y coste

Los endpoints `POST /api/coach/chat` y `POST /api/coach/plan` pasan por `runEndpointInference`. La política distingue tres estados: proveedor externo OpenAI-compatible, fallback AppDeploy pagado autorizado explícitamente, o inferencia no disponible. La ausencia de `GOALMIND_LLM_BASE_URL` no autoriza gasto: AppDeploy AI solo puede ejecutarse si `GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK=true`; de lo contrario la frontera devuelve indisponibilidad controlada (503).

El proveedor externo aplica HTTPS/controles SSRF, JSON estricto, presupuestos de entrada y límite de respuesta. No se documentan ni almacenan secretos en el repositorio.

### Gate pendiente antes de declarar esta rama lista para publicar

- ejecutar typecheck/tests/build en un runtime con toolchain disponible;
- validar E2E `sin endpoint + sin opt-in => 503` y confirmar cero llamadas pagadas;
- validar E2E con endpoint Qwen/Ollama HTTPS autenticado real;
- repetir QA móvil y escritorio sobre la preview resultante.

No hay GitHub Actions/checks asociados al HEAD actual, por lo que el código versionado no equivale todavía a validación de runtime.

## Referencias internas reutilizadas

La arquitectura sigue el patrón ya definido en HILO: orquestador, herramientas especializadas, persistencia, evidencia y trazabilidad. No se copia el prompt de Fable como runtime; se reutiliza el patrón manager + tools + memory + verification.
