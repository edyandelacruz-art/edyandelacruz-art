# Apps/Web/IA — inventario técnico verificado

Fecha de corte: 2026-10-01

Este archivo registra únicamente estados observados mediante conectores. No sustituye los documentos maestros de cada producto.

| Producto | GitHub canónico observado | AppDeploy verificado | Vercel | Estado / riesgo | Siguiente acción |
|---|---|---|---|---|---|
| GoalMind | `edyandelacruz-art/edyandelacruz-art`, workspace `projects/goalmind-agentic-coach`, rama activa `feature/goalmind-agentic-coach`, PR #6 | `goalmind-mvp-tev8mi` — `https://goalmind-mvp-tev8mi.v2.appdeploy.ai/` | No auditable: conector devuelve 0 teams | P0: snapshot público AppDeploy sigue detrás del backend canónico GitHub; `index.ts` canónico aún debe migrar sus dos rutas al `inferenceRouter` antes de afirmar cero gasto accidental | Integrar `runWithInferencePolicy` en chat/plan, ejecutar tests y después reconciliar/deployar |
| HILO | repo dedicado `HILO` observado previamente | `hilo-ttzpan` — `https://hilo-ttzpan.v2.appdeploy.ai/` | No auditable | Deploy existente; falta cerrar mapa Drive ↔ repo ↔ hosting | Auditar commit/snapshot desplegado contra repo canónico |
| BETCA AXIS | Repo dedicado no confirmado en esta auditoría | `betca-axis-ynxmhp` — `https://betca-axis-ynxmhp.v2.appdeploy.ai/` | No auditable | Fuente de verdad de código aún por identificar | Localizar repo canónico y vincular Drive/hosting |
| Predictive | Repo dedicado no confirmado en esta auditoría | `predictive-v9-staging-y5brd6` y `predictive-live-beta-6cf89a` | No auditable | Dos despliegues AppDeploy; riesgo de divergencia staging/live | Identificar repo/commit origen de ambos y marcar uno canónico |
| FocusLab | Repo dedicado no confirmado en esta auditoría | `focuslab-3x5ppr` | No auditable | Hosting existe; fuente de verdad GitHub pendiente | Recuperar repo/diseño canónico |
| EmprendeControl | Repo dedicado no confirmado en esta auditoría | `emprendecontrol-rzpfwz` | No auditable | Hosting existe; repo canónico pendiente | Identificar repo y backend Supabase correspondiente |

## AppDeploy observado

Todos los siguientes apps fueron devueltos por el conector como `deployed`: GoalMind MVP, HILO, BETCA AXIS, Predictive V9 staging, Predictive live beta, FocusLab y EmprendeControl. Este inventario no eleva `deployed` a `FUNCIONAL`: esa etiqueta requiere QA del flujo real según el Protocolo Maestro.

## Vercel

El conector de Vercel sigue devolviendo `teams: []`. Por tanto, no se concluye que no existan proyectos; únicamente que la conexión actual no permite auditarlos. No se crearán ni modificarán proyectos Vercel hasta resolver la autorización/conexión.

## GoalMind — deuda P0 vigente

La rama ya contiene `inferencePolicy.ts` e `inferenceRouter.ts`. El router garantiza que `runPaid()` sea inalcanzable salvo `paidFallbackAllowed === true` y produce indisponibilidad 503 cuando no hay proveedor autorizado. Sin embargo, `backend/index.ts` todavía conserva caminos directos a `ai.run` cuando no existe endpoint externo. Hasta migrar esas rutas, GoalMind no debe anunciarse como libre de créditos AppDeploy.
