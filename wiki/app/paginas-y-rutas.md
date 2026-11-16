---
type: Reference
title: Páginas y rutas
description: Qué sirve cada URL de producción y qué vistas tiene la app.
resource: https://asistente-rotacion-cultivos.vercel.app/
tags:
- app
- rutas
generated:
  by: claude-code/claude-sonnet-5-5
  at: '2026-11-16T01:09:21Z'
sources:
- id: vercel
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/vercel.json
  title: vercel.json
- id: app
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/app.tpl.html
  title: app.tpl.html
---

# URLs (Vercel, `vercel.json`)

| Ruta | Archivo | Qué es |
|---|---|---|
| `/` | `experiencia.html` | Landing inmersiva en inglés: seis capítulos sobre lo que funciona hoy y un séptimo «From Earth to the stars» marcado como trabajo futuro |
| `/app` | `mvp-rotacion.html` | App de recomendación, rotaciones, optimizador, Climate Twin y Copilot |
| `/campo` | `mundo.html` | Recorrido de un campo de 60 ha, hectárea por hectárea |

Producción: https://asistente-rotacion-cultivos.vercel.app/. Toda la interfaz está en inglés (los nombres propios de los ejemplos y las claves internas se mantienen).

# Vistas de la app (hash)

`#/inicio` (resumen general) · `#/campo/<campo>` · `#/rotaciones/<lote>` («Plan a 3 años») · `#/cultivo/<lote>` («Qué sembrar ahora») · `#/optimizar/<campo>` ([optimizador](/motor/optimizador-de-campo.md)) · [Climate Twin 3D](/app/climate-twin-3d.md) · `#/recorrido`.

Primero va el veredicto y los ajustes; el análisis climático avanzado, el detalle de rotaciones, la comparación por eje y la evidencia son secciones plegables.

# Mapa

Selección por área (rectángulo editable con manijas) o por punto, pantalla completa y popup con la recomendación y el «por qué».
