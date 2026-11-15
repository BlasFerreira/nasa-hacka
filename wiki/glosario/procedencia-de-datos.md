---
type: Glossary Term
title: Procedencia de los datos
description: 'Etiqueta de cada número: observado, derivado, modelado, supuesto o desconocido.'
tags:
- glosario
- incertidumbre
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
- id: claude-md
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/CLAUDE.md
  title: CLAUDE.md — guía del proyecto
---

| Etiqueta | Significa | Ejemplo |
|---|---|---|
| `observed` | Sale directo de un dataset | Lluvia de NASA POWER; rendimiento de MAGyP |
| `derived` | Calculado a partir de observaciones | Balance hídrico; días de calor |
| `modeled` | Producido por un modelo estadístico | Anomalía prevista del [modelo de rendimiento](/modelo/modelo-rendimiento-clima.md) |
| `assumed` | Valor del equipo por falta de datos | Kc, catálogo de cultivos, factor de maíz tardío |
| `unknown` | No hay evidencia suficiente | Efecto causal del antecesor |

Nunca presentar un supuesto como si fuera una medición satelital. Pendiente: llevar la etiqueta al esquema de datos del motor (FS-13).
