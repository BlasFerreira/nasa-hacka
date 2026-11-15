---
type: Component
title: Rendimientos y márgenes en el motor
description: De dónde salen el rendimiento base, el ajuste por modelo y el margen bruto.
tags:
- motor
- economia
- rendimiento
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: Motor de recomendación (engine.js)
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
---

* **Rendimiento base:** media de las últimas 10 campañas de la zona según [MAGyP](/datos/argentina/magyp-estimaciones-agricolas.md) (`observed`). Sin serie oficial (centeno, vicia, mijo, crotalaria), valor del catálogo (`assumed`).
* **Maíz tardío:** MAGyP no separa temprano y tardío; se aplica un factor de 0,83 (supuesto documentado).
* **Campaña histórica:** si el cultivo pasó el gate, se aplica la anomalía del [modelo](/modelo/modelo-rendimiento-clima.md) (`modeled`).
* **Margen bruto:** `rinde × precio × (1 − c_com) − gastos_directos`, con precios y costos de [MAGyP](/datos/argentina/magyp-resultados-economicos.md). Es margen de campo propio, sin arrendamiento ni estructura.
