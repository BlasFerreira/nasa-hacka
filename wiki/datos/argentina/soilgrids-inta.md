---
type: Dataset
title: 'Suelo: SoilGrids e INTA'
description: Textura, carbono orgánico, pH y retención de agua; hoy el suelo de la app es ilustrativo.
resource: https://soilgrids.org
tags:
- argentina
- suelo
- dataset
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: inventario
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/data_inventory.md
  title: Inventario de datos
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
---

# Qué es

* **SoilGrids** (ISRIC): propiedades del suelo globales a 250 m, con API.
* **Cartografía de suelos del INTA**: mapas e índice de productividad para Argentina.

# Estado

**Pendiente (FS-05).** Plan: valores por zona, etiquetados como dato regional y no como medición del lote.
