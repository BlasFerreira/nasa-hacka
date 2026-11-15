---
type: Dataset
title: GPM IMERG
description: Precipitación global por satélite (0,1°, cada 30 minutos, desde 2000); útil para extremos y rachas secas.
resource: https://gpm.nasa.gov/data/imerg
tags:
- nasa
- dataset
- lluvia
generated:
  by: codex/gpt-6
  at: '2026-11-15T02:27:09Z'
sources:
- id: datasets
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/datasets.md
  title: Datasets del reto (pestaña Resources)
- id: reto-recursos
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources
  title: Pestaña Resources del reto
- id: oficial
  resource: https://gpm.nasa.gov/data/imerg
  title: GPM IMERG (sitio oficial)
- id: documentacion-tecnica
  resource: https://gpm.nasa.gov/resources/documents/imerg-v07-technical-documentation
  title: Documentación técnica de IMERG V07
---

# Qué es

IMERG combina estimaciones de sensores satelitales de precipitación, las calibra e interpola a campos globales de lluvia. La documentación V07 especifica malla de 0,1° × 0,1° e intervalo de media hora; para cobertura y versión exactas consultar el catálogo.[^documentacion-tecnica] Las capas de IMERG también se pueden ver en Worldview.[^oficial]

# Para qué sirve

Confiabilidad de la lluvia, tormentas extremas, riesgo de erosión, rachas secas y comparación de rotaciones bajo distintos regímenes de lluvia.


# Estado en el proyecto

**Pendiente, opcional (FS-08).** Se suma solo si cambia la decisión frente a la lluvia de POWER; si no, queda como evidencia.

[^documentacion-tecnica]: Documentación técnica NASA GPM IMERG V07: https://gpm.nasa.gov/resources/documents/imerg-v07-technical-documentation.
[^oficial]: Portal NASA GPM IMERG: https://gpm.nasa.gov/data/imerg.
