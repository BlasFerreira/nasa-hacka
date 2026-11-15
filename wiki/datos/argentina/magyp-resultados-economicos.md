---
type: Dataset
title: MAGyP — Resultados agrícolas (márgenes y precios)
description: Precios a cosecha, costos directos y margen bruto por región; alimenta el componente de ingreso.
tags:
- argentina
- economia
- dataset
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: Motor de recomendación (engine.js)
- id: inventario
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/data_inventory.md
  title: Inventario de datos
---

# Qué es

Informe de resultados agrícolas de MAGyP (campaña 2026/27, septiembre de 2026) con precios a cosecha (cotizaciones a futuro de la Bolsa de Cereales de Buenos Aires), gastos directos, comercialización y estructura por región.

# Uso

Margen bruto de campo propio en el motor: `MB = rinde × precio × (1 − c_com) − gastos_directos` (ver [rendimientos y márgenes](/motor/rendimientos-y-margenes.md)).

# Estado

**Usado** (`ECON_MAGYP` en `engine.js`).
