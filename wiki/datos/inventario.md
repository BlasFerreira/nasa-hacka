---
type: Reference
title: Inventario de datos
description: Qué datasets se usan, cuáles son evidencia, cuáles están pendientes y cuáles se descartaron.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/data_inventory.md
tags:
- datos
- inventario
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: inventario
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/data_inventory.md
  title: Inventario de datos
- id: datasets
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/datasets.md
  title: Datasets del reto (pestaña Resources)
---

| Dataset | Estado |
|---|---|
| [NASA POWER](/datos/nasa/power.md) diario y mensual | usado |
| [MAGyP Estimaciones Agrícolas](/datos/argentina/magyp-estimaciones-agricolas.md) | usado |
| [MAGyP resultados económicos](/datos/argentina/magyp-resultados-economicos.md) | usado |
| [Georef](/datos/argentina/georef-departamentos.md) | usado |
| [SMAP](/datos/nasa/smap.md), [MODIS/VIIRS](/datos/nasa/modis-viirs.md), [GPM IMERG](/datos/nasa/gpm-imerg.md), [SoilGrids/INTA](/datos/argentina/soilgrids-inta.md), [Mapa de cultivos INTA](/datos/argentina/mapa-nacional-de-cultivos.md), [ONI](/datos/socios/enso-oni.md) | pendiente |
| [SRTM](/datos/nasa/srtm.md) | pendiente, probable descarte |
| [GRACE](/datos/nasa/grace.md), [ECOSTRESS](/datos/nasa/ecostress.md), [GEDI](/datos/nasa/gedi.md), [NLDAS](/datos/nasa/nldas-gldas.md) | descartado |

El inventario detallado (resolución, período, acceso, licencia) está en `docs/data_inventory.md`.

# Tamaño

Los archivos completos de NASA suman muchísimo (Earthdata supera los 100 PB), pero el proyecto **consulta, no descarga**: recorta por punto o región, variable y fechas. Lo usado pesa unos 100 MB crudos y 3 MB procesados.
