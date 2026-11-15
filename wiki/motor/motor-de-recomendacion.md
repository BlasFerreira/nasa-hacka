---
type: Component
title: Motor de recomendación
description: Filtro de aptitud, puntaje transparente de 6 componentes y ranking; corre en el navegador.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
tags:
- motor
- scoring
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: Motor de recomendación (engine.js)
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
---

# Pipeline por lote

1. **Entrada:** parámetros del lote, fecha de siembra, prioridades, clima de NASA POWER.
2. **[Filtro de aptitud](/motor/filtro-de-aptitud.md):** índice de 0 a 1 por cultivo; fuera de rango se descarta.
3. **Puntaje:** [6 componentes](/motor/componentes-del-score.md) ponderados por las prioridades.
4. **Ranking:** top 5, incluidos cultivos de cobertura.
5. **Salida:** puntaje, desglose, fechas, alertas y texto explicativo.

# Además

* [Rendimientos y márgenes](/motor/rendimientos-y-margenes.md) con datos de MAGyP.
* [Clima diario y eventos extremos](/motor/clima-diario-y-eventos.md).
* [Stress test](/motor/stress-test.md) y [optimizador de campo](/motor/optimizador-de-campo.md).

Sin ML en la decisión: el único modelo entrenado es el de [rendimiento](/modelo/modelo-rendimiento-clima.md). Código: `prototype/src/engine.js`; ejemplo de rankings con `node prototype/src/smoke.js`.
