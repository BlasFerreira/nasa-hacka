---
type: Component
title: 'Qué pasaría si: riego'
description: Compara el mismo campo con y sin riego en las 22 ventanas reales y calcula el costo de equilibrio del riego.
tags:
- motor
- riego
- escenarios
generated:
  by: claude-code/claude-sonnet-5-5
  at: '2026-11-16T01:09:21Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: engine.js
---

# Qué hace

Corre el mismo campo con y sin riego sobre las 22 ventanas de 3 campañas reales del [stress test](/motor/stress-test.md) y reporta:

* diferencia de margen típica, en año malo y en la ventana de la sequía 2022/23;
* el **costo de equilibrio del riego** (cuánto puede costar el riego para que convenga);
* un veredicto si el usuario ingresa un costo.

# Supuestos (documentados en el código)

* El riego elimina las penalizaciones diarias por déficit de lluvia y rachas secas.
* El rendimiento regado es el mayor entre el modelo de secano de MAGyP y la aptitud con riego.

Ningún lote de ejemplo tiene riego, así que los resultados existentes no cambian. Se usa desde el [Copilot](/app/copilot.md).
