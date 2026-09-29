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

El 29 de septiembre de 2026 se intentó desplegar esta capa sobre el AppDeploy público de GoalMind. El código pasó a la fase de deploy, pero AppDeploy bloqueó nuevas publicaciones por agotamiento del presupuesto diario Free tier hasta `2026-09-30T00:00:00Z`. La versión pública previa sigue activa y estable. Esta rama conserva la nueva capa para reintentar el despliegue sin reconstruirla.

## Referencias internas reutilizadas

La arquitectura sigue el patrón ya definido en HILO: orquestador, herramientas especializadas, persistencia, evidencia y trazabilidad. No se copia el prompt de Fable como runtime; se reutiliza el patrón manager + tools + memory + verification.
