---
type: Dataset
title: Índice ONI de ENSO (NOAA)
description: Clasificación de cada campaña como Niña, neutra o Niño, para filtrar escenarios.
resource: https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_v5.php
tags:
- clima
- escenarios
- dataset
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
---

# Qué es

El ONI (Oceanic Niño Index) de NOAA es la anomalía de la temperatura del mar en la región Niño 3.4, en promedios móviles de tres meses. Ver [ENSO](/glosario/enso.md).

# Para qué serviría

Filtrar los años históricos del [stress test](/motor/stress-test.md) por fase: «si la próxima campaña viene Niña, ¿cómo le iría a cada rotación?». Conecta con los pronósticos estacionales que el productor ya consulta.

# Estado

**Pendiente (FS-11).**
