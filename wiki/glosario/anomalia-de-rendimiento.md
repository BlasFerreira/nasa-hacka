---
type: Glossary Term
title: Anomalía de rendimiento
description: Cuánto se aparta el rendimiento de un año de su tendencia tecnológica.
tags:
- glosario
- modelo
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

El rendimiento sube con los años por genética y manejo, no por el clima. Si se modela el rendimiento crudo, el modelo aprende «el año». Por eso el target es la **anomalía relativa**:

`anomalía = rendimiento / tendencia − 1`

Por ejemplo, −0,30 es un año 30 % por debajo de lo esperado para su época. En la validación, la tendencia se ajusta **dentro de cada fold** para que el año de test no se filtre (ver [validación](/modelo/validacion-loyo.md)).
