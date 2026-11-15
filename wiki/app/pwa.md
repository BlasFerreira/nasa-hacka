---
type: Component
title: App instalable (PWA)
description: Manifest, íconos, service worker y ajustes para celular.
tags:
- app
- pwa
- movil
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: hitos
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/hitos.md
  title: 'Roadmap: qué está hecho y qué falta'
---

* `manifest.webmanifest` e íconos PNG generados con `prototype/src/make_icons.js`.
* `sw.js`: páginas con red primero, mosaicos del mapa y Leaflet en caché, y la API de NASA POWER siempre por red.
* Botón de instalación, márgenes seguros y objetivos táctiles de 44 px; sin scroll horizontal a 375 px.
* **No verificado en un celular real** (FS-20): el navegador embebido no permite registrar el service worker.
