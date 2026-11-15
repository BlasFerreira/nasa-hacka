---
type: Dataset
title: API Georef — centroides de departamentos
description: Coordenadas del centroide de cada departamento por código INDEC, para pedir el clima de NASA POWER.
resource: https://apis.datos.gob.ar/georef/api/departamentos
tags:
- argentina
- geografia
- dataset
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: inventario
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/data_inventory.md
  title: Inventario de datos
---

# Qué es

API de datos.gob.ar que devuelve el centroide de cada departamento a partir de su código INDEC.

# Uso

`pipeline/build_departamentos.py` resuelve los 35 departamentos de las zonas contra MAGyP y guarda `data/processed/departamentos.csv`. El clima del departamento es el de su centroide: describe el departamento, no un lote.

# Estado

**Usado.**
