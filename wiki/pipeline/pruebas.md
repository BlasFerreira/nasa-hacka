---
type: Reference
title: Pruebas automáticas
description: Qué verifican las 12 pruebas del pipeline y cómo correrlas.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/tests/test_pipeline.py
tags:
- pruebas
- calidad
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: tests
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/tests/test_pipeline.py
  title: tests/test_pipeline.py
---

`python -m unittest discover -s tests -v`

| Grupo | Qué verifica |
|---|---|
| Sin fuga temporal | El año retenido no cambia la tendencia ni el entrenamiento; cada fold deja afuera un solo año |
| Regla del gate | Umbral de 0,20, bloques negativos y habilidad del baseline nulo |
| Datos procesados | Unión rendimientos ↔ features sin pérdidas; clave única; códigos INDEC de 5 dígitos; sin `-999` de POWER |
| JSON del motor | Solo hay anomalías si el cultivo pasó el gate y cumple el criterio; valores en rangos plausibles |

Además, `node prototype/src/smoke.js` imprime rankings de ejemplo del motor.
