---
type: Dataset
title: Landsat
description: Reflectancia e índices de vegetación a 30 m; seguimiento de vigor, transiciones y suelo desnudo.
resource: https://earthexplorer.usgs.gov/
tags:
- nasa
- dataset
- vegetacion
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: datasets
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/datasets.md
  title: Datasets del reto (pestaña Resources)
- id: reto-recursos
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources
  title: Pestaña Resources del reto
- id: oficial
  resource: https://earthexplorer.usgs.gov/
  title: Landsat (sitio oficial)
---

# Qué es

Serie de satélites (NASA/USGS) con imágenes multiespectrales de 30 m. Permite calcular [NDVI](/glosario/ndvi.md), EVI y NDMI.

# Para qué sirve

Vigor del cultivo, transiciones estacionales, períodos de suelo desnudo y monitoreo a escala de lote.


# Estado en el proyecto

**No usado.** Candidato para la vista de lote; para series largas por zona se prefiere MODIS/VIIRS.
