---
type: Dataset
title: MAGyP — Estimaciones Agrícolas
description: Superficie, producción y rendimiento oficiales por departamento y campaña; el target del modelo.
resource: https://datos.magyp.gob.ar/
tags:
- argentina
- rendimiento
- dataset
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: inventario
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/data_inventory.md
  title: Inventario de datos
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
---

# Qué es

Series oficiales del Ministerio de Agricultura (datos.magyp.gob.ar) con superficie sembrada y cosechada, producción y rendimiento por **departamento** (código INDEC) y **campaña**. Soja total desde 1941; soja 1ra y 2da por separado desde 2000.

# Uso

* Target del [modelo de rendimiento](/modelo/modelo-rendimiento-clima.md): rendimiento sobre superficie cosechada, 1981–2024, 7 cultivos, 35 departamentos.
* Rendimiento de referencia por zona en la app: media de las últimas 10 campañas.

# Cuidado

* El rendimiento oficial es sobre superficie **cosechada**: en una sequía fuerte los lotes perdidos no aparecen. Para resiliencia, `producción / superficie sembrada` es más honesto.
* Hay que **quitar la tendencia tecnológica** (ver [anomalía de rendimiento](/glosario/anomalia-de-rendimiento.md)).
* Los nombres de departamento difieren entre fuentes: **unir siempre por código INDEC**, nunca por nombre.
* El CSV viene en latin-1.

# Estado

**Usado.** Descarga: `pipeline/fetch_magyp.py`; procedencia en `data/processed/magyp_fuentes.json`.
