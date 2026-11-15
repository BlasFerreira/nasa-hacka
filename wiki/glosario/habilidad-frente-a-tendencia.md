---
type: Glossary Term
title: Habilidad frente a la tendencia
description: Qué fracción del error del baseline de tendencia elimina el modelo.
tags:
- glosario
- modelo
- metricas
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

`habilidad = 1 − SSE(modelo) / SSE(baseline)`, donde el baseline predice anomalía 0 (solo tendencia).

* 0: no mejora a la tendencia. Negativo: empeora.
* 0,54: el modelo explica el 54 % de lo que el rendimiento se aparta de su tendencia.

Es el número que usa el [criterio del gate](/modelo/criterio-del-gate.md).
