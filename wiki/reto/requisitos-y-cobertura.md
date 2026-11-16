---
type: Requirements Coverage
title: Requisitos del reto y cobertura del proyecto
description: Cada requisito o sugerencia del reto, con lo que el proyecto ya cubre y lo que falta.
tags:
- reto
- requisitos
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
stale_after: '2026-11-16T12:00:00Z'
sources:
- id: reto
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/
  title: 'Field Shift: Adapting Farms with NASA Data (página oficial del reto)'
- id: hitos
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/hitos.md
  title: 'Roadmap: qué está hecho y qué falta'
---

| Requisito | Estado | Qué hay | Qué falta |
|---|---|---|---|
| Herramienta de apoyo a la decisión | hecho | App web con recomendación, comparación y optimizador | — |
| Al menos un dataset de NASA | hecho | [NASA POWER](/datos/nasa/power.md) mensual y diario | — |
| Otros datos de NASA | falta | — | [MODIS/VIIRS](/datos/nasa/modis-viirs.md), [SMAP](/datos/nasa/smap.md) |
| Suelo local | parcial | Valores ilustrativos por lote | [SoilGrids/INTA](/datos/argentina/soilgrids-inta.md) |
| Características de cultivos | parcial | Catálogo ilustrativo + rendimientos y márgenes de MAGyP | Parámetros con cita (FS-04) |
| Prioridades del productor | hecho | 6 pesos ajustables | Restricciones de agua y maquinaria |
| ≥3 rotaciones, incluida la actual | hecho | Comparador de 3 rotaciones | — |
| Por qué, evidencia, beneficios, riesgos | parcial | Tarjetas de evidencia e incertidumbre | Procedencia en el esquema (FS-13) |
| Escenarios de clima | parcial | [Stress test](/motor/stress-test.md) con 22 ventanas de 3 campañas reales y [qué-pasaría-si de riego](/motor/riego-que-pasaria-si.md) | Filtro ENSO, sliders |
| Calor, helada, lluvia extrema, ET, humedad | parcial | [Eventos diarios](/motor/clima-diario-y-eventos.md) con POWER | Vegetación (NDVI) |
| Armonizar resoluciones | parcial | Agregación por departamento y campaña en el [pipeline](/pipeline/pipeline-rendimiento.md) | Sumar NDVI/SMAP a la misma grilla |
| Mapa interactivo | parcial | Selección de área y punto, popup con recomendación y [Climate Twin 3D](/app/climate-twin-3d.md) con capas de estrés | Capa de NDVI o anomalía |
| Explicar términos científicos | parcial | Esta wiki tiene el [glosario](/glosario/evapotranspiracion.md) | Glosario dentro de la app (FS-16) |
| Apoyar, no reemplazar | parcial | Presente en textos | Visible en cada resultado (FS-19) |
| Entrega | parcial | Deck final, README con [declaración de IA](/proyecto/declaracion-de-ia.md), licencia MIT | Formulario de Space Apps: ver [entrega](/reto/entrega.md) |
