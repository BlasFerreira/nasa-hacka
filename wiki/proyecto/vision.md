---
type: Project Overview
title: 'Field Shift: visión del proyecto'
description: Herramienta de apoyo a la decisión que compara rotaciones de cultivos con datos de NASA, información local y prioridades del productor.
resource: https://asistente-rotacion-cultivos.vercel.app/
tags:
- proyecto
- vision
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: claude-md
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/CLAUDE.md
  title: CLAUDE.md — guía del proyecto
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
---

# Qué es

Field Shift es el proyecto del equipo para el reto [Field Shift: Adapting Farms with NASA Data](/reto/desafio-field-shift.md) de NASA Space Apps Challenge 2026 (14 y 15 de noviembre de 2026). Responde a una pregunta del productor:

> «Tengo este lote. Con sus condiciones y mis prioridades, ¿qué rotaciones vale la pena explorar en las próximas campañas, y por qué?»

Compara la rotación actual contra alternativas y explica los compromisos de cada una: agua, salud del suelo, resiliencia climática, ingreso y riesgo.[^claude-md]

# Problema

Decidir qué sembrar, dónde y cuándo tiene alto impacto económico y ambiental. Hoy se decide con experiencia y datos dispersos, y la presión por rendir este ciclo puede degradar el suelo para los siguientes.[^doc-funcional]

# Mensaje central

**Cuidar la tierra no es solo ecológico: también es rentable.** Field Shift no le dice al productor qué hacer: le da una forma de probar qué podría pasar antes de decidir. Es [apoyo a la decisión, no reemplazo](/proyecto/principios.md) del criterio del productor ni del agrónomo.

# Dónde está

* App en producción: https://asistente-rotacion-cultivos.vercel.app/ (landing en `/`, app en `/app`, recorrido del campo en `/campo`). Ver [páginas y rutas](/app/paginas-y-rutas.md).
* Código: https://github.com/BlasFerreira/nasa-hacka
* Estado y pendientes: [roadmap](/proyecto/roadmap.md).

# Mapa de la wiki

* [Concepto de producto](/proyecto/concepto-de-producto.md) y [alcance](/proyecto/alcance.md).
* [Datos](/datos/inventario.md): NASA POWER (usado), MAGyP (usado), SMAP, MODIS/VIIRS, GPM y otros.
* [Motor de recomendación](/motor/motor-de-recomendacion.md) y [modelo de rendimiento](/modelo/modelo-rendimiento-clima.md).
* [Glosario](/glosario/evapotranspiracion.md) con los términos científicos que pide explicar el reto.

[^claude-md]: CLAUDE.md — guía del proyecto
[^doc-funcional]: Documento funcional
