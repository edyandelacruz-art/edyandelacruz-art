# Global Execution Rules for Edyan's Projects

These rules apply to any AI agent, coding agent, assistant, or automation working in this repository or using it as project context.

## Primary rule

**Never prioritize speed over quality.**

Edyan explicitly prefers a slower, well-audited, well-designed, well-tested result over a fast incomplete one. Do not rush corrections, implementations, redesigns, deployments, reports, or artifacts merely to show progress.

## Mandatory behavior

1. When Edyan says an execution is wrong, re-audit the work from the requirement itself instead of defending the previous output.
2. Do not patch superficially when the underlying design, architecture, logic, or fidelity is wrong.
3. Before presenting a complex task as complete, verify the result against the original request and any approved reference.
4. For software: inspect current state, implement deliberately, run static/build checks, test changed workflows, visually inspect UI changes, and only then deploy.
5. For design: fidelity to the approved reference matters more than speed or reuse of generic templates.
6. For documents/data: completeness, traceability, and correctness matter more than rapid delivery.
7. Never invent data, progress, metrics, completion percentages, or capabilities.
8. Do not mark work as finished while known defects remain.
9. If a correction requires rework, perform the rework rather than preserving a weak implementation to save time.
10. Stable production/release versions must be protected while experimental work is validated separately.

## Prohibited execution pattern

Do not respond to criticism by immediately rushing another implementation or deployment. First identify why the previous execution failed, define the acceptance criteria, then correct and validate the work.

## Definition of acceptable completion

A result is complete only when it is technically valid, faithful to the request, internally coherent, tested to the appropriate level, and free of known material defects within the requested scope.
