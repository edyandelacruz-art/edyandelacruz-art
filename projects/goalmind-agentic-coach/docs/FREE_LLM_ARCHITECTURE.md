# GoalMind — arquitectura LLM independiente de créditos AppDeploy

Estado: IMPLEMENTADO EN RAMA / NO DESPLEGADO TODAVÍA

## Objetivo

Separar la inferencia del Coach y del generador de partidos de `@appdeploy/sdk ai.run` para que GoalMind pueda operar con un LLM externo OpenAI-compatible. Cuando el proveedor externo está configurado, el flujo principal no consume créditos de IA de AppDeploy.

La persistencia de conversaciones, planes y resultados sigue siendo una preocupación separada de la inferencia. Este cambio no convierte AppDeploy DB en la base canónica futura; únicamente desacopla el modelo del proveedor de IA.

## Ruta recomendada sin coste por llamada

Modelo recomendado inicial: `qwen3:4b` servido mediante Ollama.

Razones:
- pesos abiertos bajo Apache 2.0;
- variante cuantizada de aproximadamente 2.5 GB en Ollama;
- soporte multilingüe y de conversación;
- API de Ollama compatible con OpenAI Chat Completions;
- cero coste de API cuando se ejecuta en hardware propio.

Referencias:
- https://ollama.com/library/qwen3:4b
- https://github.com/QwenLM/Qwen3
- https://ollama.com/blog/openai-compatibility

## Contrato implementado

Archivo: `backend/llmProvider.ts`

El proveedor lee configuración únicamente desde secretos backend y nunca desde el cliente.

Nombres de configuración:
- `GOALMIND_LLM_BASE_URL` — obligatorio para activar el proveedor externo. Debe usar HTTPS salvo localhost.
- `GOALMIND_LLM_MODEL` — opcional; por defecto `qwen3:4b`.
- `GOALMIND_LLM_API_KEY` — opcional para proveedores/túneles que exijan bearer token.
- `GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK` — opcional; por defecto falso.

No se deben versionar valores de estos secretos.

## Política de coste

1. Sin `GOALMIND_LLM_BASE_URL`, GoalMind conserva el comportamiento existente y usa AppDeploy AI.
2. Con proveedor externo configurado y disponible, Chat y Plan usan el LLM externo.
3. Si el proveedor externo falla, GoalMind NO cae a AppDeploy AI por defecto.
4. Solo se permite fallback de pago si `GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK=true` fue configurado explícitamente.

Esto evita consumo accidental de créditos.

## Flujo Coach

`POST /api/coach/chat`

- conserva `guestId`, `conversationId`, `requestId` e idempotencia actuales;
- incorpora memoria reciente de aprendizaje;
- usa primero el proveedor externo cuando está configurado;
- registra `inferenceProvider` en la respuesta pública sin exponer URL, modelo, claves ni secretos.

## Flujo Game Master / Referee

`POST /api/coach/plan`

Con proveedor externo:
1. Scout recupera fuentes de GoalMind Library, Wikipedia y OpenAlex de forma determinista en backend;
2. se consulta el historial reciente del jugador;
3. el LLM recibe únicamente la petición, fuentes recuperadas e historial necesario;
4. devuelve un plan JSON;
5. el core GoalMind vuelve a validar estructura, cuatro opciones, índice correcto y `sourceRefs` permitidos;
6. Game Master instala el partido y Referee rechaza contenido inválido;
7. el plan se persiste junto con `inferenceProvider`.

La IA propone; las validaciones y reglas del juego siguen en código determinista.

## Estado y observabilidad

`GET /api/llm/status` expone solo datos derivados:
- si existe proveedor externo configurado;
- tipo de proveedor (`openai-compatible`);
- si se autorizó explícitamente fallback de pago;
- si AppDeploy AI sigue siendo requerido por falta de configuración externa.

Nunca devuelve URL, API key ni valor de secretos.

Healthcheck del backend: `0.7-external-llm-provider`.

## Activación local prevista

En la máquina que vaya a servir el modelo:

```bash
ollama pull qwen3:4b
ollama run qwen3:4b
```

Ollama expone localmente una API OpenAI-compatible bajo `/v1/chat/completions`.

Para una aplicación pública, `localhost` de la máquina del usuario NO es accesible desde un backend cloud. Hace falta uno de estos pasos antes de activar producción:
- ejecutar el backend GoalMind en la misma máquina/red del modelo;
- publicar el endpoint mediante un túnel HTTPS autenticado;
- usar un proveedor OpenAI-compatible externo con cuota gratuita.

No se publicará un Ollama local sin autenticación en Internet.

## Bloqueos para activación real

Pendiente elegir dónde vivirá el proceso de inferencia gratuito. Esta decisión implica infraestructura/credenciales fuera del repositorio y no se ejecuta automáticamente:
- PC/nodo propio siempre encendido + túnel HTTPS autenticado; o
- proveedor gratuito externo + token.

El código queda preparado para ambos sin cambiar el contrato del frontend.

## QA requerido antes de marcarlo funcional

- proveedor externo configurado en staging;
- `GET /api/llm/status` confirma externo activo sin secretos;
- chat responde con `inferenceProvider=external-openai-compatible`;
- plan genera al menos 3 preguntas válidas;
- `sourceRefs` fuera del conjunto Scout son descartados;
- caída del endpoint externo NO consume AppDeploy AI con fallback apagado;
- repetición del mismo `requestId` no duplica turnos;
- pruebas móvil y escritorio de Coach → plan → partido → resultado;
- smoke test posterior al deploy.
