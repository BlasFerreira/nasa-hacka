---
type: Glossary Term
title: Leave-one-year-out (LOYO)
description: Validación que deja afuera una campaña entera por vez.
tags:
- glosario
- modelo
- validacion
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

Se entrena con todas las campañas menos una y se predice la que quedó afuera; se repite para cada campaña. Agrupar por año es clave porque el clima de un mismo año es casi igual en todos los departamentos: mezclarlos con k-fold aleatorio inflaría el resultado. Ver [validación](/modelo/validacion-loyo.md).
