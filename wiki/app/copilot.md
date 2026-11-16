---
type: Component
title: Copilot
description: Asistente flotante local que interpreta comandos y ejecuta las funciones reales de la app, sin IA generativa.
tags:
- app
- copilot
generated:
  by: claude-code/claude-sonnet-5-5
  at: '2026-11-16T01:09:21Z'
sources:
- id: app
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/app.tpl.html
  title: app.tpl.html
---

# Qué es

Botón flotante y panel lateral en todas las vistas. Es un **intérprete determinístico local**: no usa IA generativa y los datos no salen del navegador. Entiende comandos en inglés y en español. Deja un punto de extensión para un LLM futuro. Ver [declaración de IA](/proyecto/declaracion-de-ia.md).

# Qué puede hacer

* Explicar recomendaciones y el estrés de un lote.
* Escenarios de clima (sequía, lluvia, calor), con las hipótesis rotuladas como tales.
* Comparar el plan actual con el optimizado y correr el [optimizador](/motor/optimizador-de-campo.md), pidiendo confirmación antes de reemplazar un resultado o cambiar prioridades, e informando las restricciones no soportadas.
* Manejar el [Climate Twin 3D](/app/climate-twin-3d.md): momento crítico, enfocar un lote, capas, comparar.
* El [qué-pasaría-si de riego](/motor/riego-que-pasaria-si.md).

Mantiene el historial entre vistas y marca como desactualizadas las tarjetas calculadas con otra configuración.
