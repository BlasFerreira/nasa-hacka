---
type: Challenge
title: 'El reto: Field Shift — Adapting Farms with NASA Data'
description: Crear una herramienta de apoyo a la decisión que combine observaciones de NASA, suelo local, cultivos y prioridades para explorar rotaciones.
resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/
tags:
- reto
- nasa-space-apps
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: reto
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/
  title: 'Field Shift: Adapting Farms with NASA Data (página oficial del reto)'
- id: reto-recursos
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources
  title: Pestaña Resources del reto
---

# Enunciado (resumen)

Los productores enfrentan temperaturas cambiantes, lluvias menos previsibles, escasez de agua, eventos extremos y suelos degradados. El reto pide una herramienta de apoyo a la decisión que use observaciones de la Tierra de NASA junto con suelo local, características de los cultivos y prioridades del productor, para explorar rotaciones que fortalezcan la salud del suelo y adapten el campo a condiciones cambiantes.[^reto]

Dificultad: intermedia y avanzada. Temas: ciencias de la Tierra, software, artes y multimedia.

# Objetivos y sugerencias

* Datasets sugeridos: [SMAP](/datos/nasa/smap.md), [ECOSTRESS](/datos/nasa/ecostress.md), [GPM](/datos/nasa/gpm-imerg.md), [Landsat](/datos/nasa/landsat.md), [MODIS](/datos/nasa/modis-viirs.md), [NASA POWER](/datos/nasa/power.md), [GRACE/GRACE-FO](/datos/nasa/grace.md) y [SRTM](/datos/nasa/srtm.md).
* Analizar temperatura, estrés por calor, lluvia, humedad de suelo, evaporación, heladas, lluvia extrema, estrés de la vegetación y tendencias de agua de largo plazo.
* Comparar **al menos tres estrategias de rotación, incluida la actual**, explicando por qué se sugiere cada una, qué evidencia la respalda, qué beneficios ofrece, qué brechas de información hay y qué riesgos requieren revisión local.
* Explicar términos como evapotranspiración, anomalías de humedad, NDVI, riesgo de helada y balance hídrico (ver [glosario](/glosario/evapotranspiracion.md)).
* Armonizar datasets de distinta resolución espacial y temporal (ver [armonización](/datos/armonizacion-de-resoluciones.md)).
* Diseño centrado en el productor: interpretable sin experiencia técnica, con entrada de prioridades y restricciones.

# Resultado esperado

Una herramienta **de apoyo**: identifica patrones y posibilidades, **sin reemplazar el criterio del productor ni la experiencia agronómica local**.

Cobertura de cada requisito por el proyecto: [requisitos y cobertura](/reto/requisitos-y-cobertura.md).

[^reto]: Field Shift: Adapting Farms with NASA Data (página oficial del reto)
