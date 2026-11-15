---
type: Architecture
title: Arquitectura de la app
description: 'Sitio estático: HTML autocontenido generado desde plantillas, con el motor y los datos inlineados; sin backend.'
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/build.js
tags:
- app
- arquitectura
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: prototype-readme
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/README.md
  title: README del prototipo
- id: build
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/build.js
  title: prototype/src/build.js
---

# Piezas

```text
prototype/src/app.tpl.html   + engine.js + power_climatology.json + power_diario.json
                              + rend_magyp.json + team.json + assets/nasa-logo.svg
        │  node prototype/src/build.js
        ▼
prototype/mvp-rotacion.html  (autocontenido, commiteado)
```

* `build_mundo.js` genera `mundo.html` (recorrido del campo de 60 ha) de la misma forma.
* `experiencia.html` es la landing inmersiva (scroll guiado).
* El mapa usa Leaflet 1.9.4 (CDN) con imágenes satelitales de Esri.
* Los datos del modelo los genera el [pipeline de Python](/pipeline/pipeline-rendimiento.md).

# Por qué así

Cero costo, nada que se caiga en la demo y funciona sin conexión (los datos van en la página). La contra: **hay que reconstruir el HTML y commitearlo** después de cada cambio en `src/`; nada lo verifica automáticamente.
