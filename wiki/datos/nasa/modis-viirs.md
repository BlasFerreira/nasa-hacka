---
type: Dataset
title: MODIS y VIIRS
description: Índices de vegetación de 250 a 1000 m con alta frecuencia temporal y series desde 2000.
resource: https://lpdaac.usgs.gov/products/
tags:
- nasa
- dataset
- vegetacion
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
  resource: https://lpdaac.usgs.gov/products/
  title: MODIS y VIIRS (sitio oficial)
- id: modis-guia
  resource: https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf
  title: Guía oficial MODIS Vegetation Indices Collection 6.1
- id: cese-viirs-snpp
  resource: https://forum.earthdata.nasa.gov/viewtopic.php?t=8331
  title: Aviso Earthdata/NSIDC actualizado sobre Suomi NPP
---

# Qué es

Sensores de órbita polar con índices de vegetación. MOD13Q1 produce NDVI/EVI con compuesto de 16 días y resolución de 250 m.[^modis-guia] VIIRS ofrece productos análogos en resoluciones y plataformas que dependen del producto seleccionado.

# Para qué sirve

Integral y pico estacional del NDVI, período de suelo desnudo y tendencias regionales.

# Cuidado

El aviso de Earthdata/NSIDC publicado el 22-oct-2026 actualizó la fecha prevista para el cese de nuevas observaciones Suomi NPP del 1 al 2-nov-2026; el mismo aviso indicó que la fecha podía cambiar. Como la fecha ya pasó, confirmar disponibilidad en Earthdata Search antes de elegir fuente. El aviso recomienda considerar productos equivalentes de NOAA-20 y NOAA-21; no limitar la transición a NOAA-20 sin comparar el producto y colección específicos.[^cese-viirs-snpp]


# Estado en el proyecto

**Pendiente (FS-06).** Es el segundo producto NASA recomendado: NDVI por zona como evidencia observada.

[^modis-guia]: Guía de usuario oficial de MODIS VI Collection 6.1: https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf.
[^cese-viirs-snpp]: Aviso de Earthdata/NSIDC sobre Suomi NPP: https://forum.earthdata.nasa.gov/viewtopic.php?t=8331.
