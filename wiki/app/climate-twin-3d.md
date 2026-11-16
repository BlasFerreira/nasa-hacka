---
type: Component
title: Climate Twin 3D
description: Réplica 3D del campo que reproduce una campaña real, por ejemplo la sequía 2022/23, con capas de estrés.
tags:
- app
- visualizacion
- 3d
generated:
  by: claude-code/claude-sonnet-5-5
  at: '2026-11-16T01:09:21Z'
sources:
- id: app
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/app.tpl.html
  title: app.tpl.html
---

# Qué es

Vista 3D del campo («Climate Twin») que reproduce el clima de una campaña real de [NASA POWER](/datos/nasa/power.md) día a día y muestra el estrés de cada lote en capas. Materiales agrícolas, capa satelital y cámara de entrada baja; los volúmenes de estrés suben recién cuando la cámara se detiene.

# Uso

* Se abre desde «Herramientas del campo» del menú o desde el [Copilot](/app/copilot.md) (momento crítico, enfocar un lote, capas, comparar).
* Etiqueta «Con evento hoy» para los lotes con un [evento extremo](/motor/clima-diario-y-eventos.md) ese día.
* Es una visualización de resultados del motor, no una medición.
