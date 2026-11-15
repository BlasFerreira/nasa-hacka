---
type: Decision Record
title: Decisiones del proyecto
description: Decisiones técnicas y de producto tomadas durante el hackathon, con su motivo.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/decisions.md
tags:
- decisiones
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: decisiones
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/decisions.md
  title: Registro de decisiones
- id: prototype-readme
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/README.md
  title: README del prototipo
- id: hitos
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/hitos.md
  title: 'Roadmap: qué está hecho y qué falta'
---

| # | Decisión | Motivo |
|---|---|---|
| 1 | **Foco en Argentina** (pampa húmeda y Entre Ríos) | Cadena de datos completa (MAGyP por departamento + NASA POWER) y contexto del equipo |
| 2 | **Puntaje transparente** en la decisión; ML solo para la respuesta del rendimiento al clima | No existen etiquetas de «mejor rotación» |
| 3 | **Criterio del gate escrito antes de ver resultados** (D1) | Evitar ajustar el umbral a posteriori. Ver [criterio del gate](/modelo/criterio-del-gate.md) |
| 4 | **Ventanas fenológicas como supuestos** y soja total (D2) | MAGyP no separa maíz temprano/tardío ni (antes de 2000) soja 1ra/2da |
| 5 | **App estática sin backend** en Vercel | Cero costo y nada que se caiga en la demo. Ver [arquitectura](/app/arquitectura.md) |
| 6 | **Sin Docker** | Vercel no ejecuta contenedores y no hace falta un servidor |
| 7 | **Sin escenarios de clima futuro** | Las proyecciones CMIP6 de NASA POWER devolvieron solo valores de relleno (-999) para Argentina (probado el 2026-11-14) |
| 8 | **Se quitó GitHub Pages y el chequeo de CI** | Pages nunca se habilitó; el chequeo fallaba por diferencias de fin de línea |
| 9 | **Se mantiene el logo de NASA** | Decisión del equipo; la guía del reto restringe el uso de la marca. Riesgo abierto (FS-23) |
| 10 | **Datos crudos fuera de git** (~100 MB) | Se regeneran con el pipeline; los procesados sí se versionan |

Detalle formal de D1 y D2 en `docs/decisions.md`.
