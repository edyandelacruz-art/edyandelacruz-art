# Agent Toolbox

Colección curada de repositorios externos que pueden integrarse con AION, BETCA y otros agentes.

> Esta página funciona como índice estable. Los proyectos siguen perteneciendo a sus autores originales; aquí se registra para qué sirven, su prioridad y el estado de adopción.

## Prioridad A — integrar

| Repositorio | Uso | Estado |
|---|---|---|
| [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) | Convertir libros, PDFs y documentación en Agent Skills cargadas bajo demanda | **Integrar primero** |
| [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) | Base de conocimiento privada, RAG, búsqueda y API REST | **Integrar como memoria documental** |
| [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) | Mejorar redacción y eliminar patrones genéricos de IA | **Instalar/adaptar como skill transversal** |
| [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | Respuestas operativas, breves, numeradas y orientadas a acción | **Adaptar como regla global de agentes** |

## Prioridad B — integrar por módulo

| Repositorio | Uso | Estado |
|---|---|---|
| [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) | Gateway multi-proveedor, fallback y routing de modelos | **Probar en sandbox antes de producción** |
| [usestrix/strix](https://github.com/usestrix/strix) | Pentesting automatizado y seguridad CI/CD | **Usar solo en sistemas propios o autorizados** |
| [every-app/open-seo](https://github.com/every-app/open-seo) | SEO, keywords, backlinks, auditorías y MCP | **Integrar en marketing cuando haya necesidad** |
| [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search) | Workflow de búsqueda de empleo, CV, cartas, ranking e entrevistas | **Reutilizar patrones y adaptar portales** |

## Laboratorio

| Repositorio | Uso | Estado |
|---|---|---|
| [Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | Generación de imagen, video y audio | **Evaluar como laboratorio creativo; no núcleo** |

## Orden de adopción

1. `book-to-skill`
2. `no-ai-slop`
3. `i-have-adhd`
4. `open-notebook`
5. `OmniRoute`
6. `strix`
7. `open-seo`
8. `ai-job-search`
9. `Open-Generative-AI`

## Reglas de integración

- No ejecutar instaladores o scripts de terceros sin revisar primero `README`, `LICENSE`, dependencias y scripts de instalación.
- Mantener las credenciales fuera del repositorio y usar variables de entorno/secret stores.
- Para herramientas con acceso a código, documentos o cuentas, aplicar mínimo privilegio.
- Las herramientas de seguridad solo deben apuntar a sistemas propios o expresamente autorizados.
- Antes de elevar un proyecto a producción, probarlo en un entorno aislado.

## Registro técnico

La evaluación detallada y el script de sincronización están en [`edyandelacruz-art/proyecto-bitacora-aion`](https://github.com/edyandelacruz-art/proyecto-bitacora-aion), archivos `AION_AGENT_TOOLBOX.md` y `agent-toolbox/sync-repos.sh`.
