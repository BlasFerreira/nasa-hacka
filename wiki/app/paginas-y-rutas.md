---
type: Reference
title: Páginas y rutas
description: Qué sirve cada URL de producción y qué vistas tiene la app.
resource: https://asistente-rotacion-cultivos.vercel.app/
tags:
- app
- rutas
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: vercel
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/vercel.json
  title: prototype/vercel.json
---

# URLs (Vercel, `vercel.json`)

| Ruta | Archivo | Qué es |
|---|---|---|
| `/` | `experiencia.html` | Landing inmersiva con botón a la app y panel del equipo |
| `/app` | `mvp-rotacion.html` | App de recomendación y rotaciones |
| `/campo` | `mundo.html` | Recorrido de un campo de 60 ha, hectárea por hectárea |

Producción: https://asistente-rotacion-cultivos.vercel.app/

# Vistas de la app (hash)

`#/inicio` (resumen general) · `#/campo/<campo>` · `#/rotaciones/<lote>` (comparar rotaciones) · `#/cultivo/<lote>` (próximo cultivo) · `#/optimizar/<campo>` ([optimizador](/motor/optimizador-de-campo.md)) · `#/recorrido`.

# Mapa

Selección por área (rectángulo editable con manijas) o por punto, pantalla completa y popup con la recomendación y el «por qué».
