---
type: Glossary Term
title: NDVI (índice de vegetación)
description: Índice satelital que mide verdor y vigor de la vegetación, de −1 a 1.
tags:
- glosario
- vegetacion
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

**NDVI** = (NIR − Rojo) / (NIR + Rojo). La vegetación sana refleja mucho infrarrojo cercano y absorbe el rojo, así que su NDVI es alto (0,6–0,9); el suelo desnudo da valores bajos.

Sirve para ver el ciclo del cultivo (pico en verano para soja y maíz, en primavera para trigo), el estrés y los **períodos de suelo desnudo**. Fuentes: [MODIS/VIIRS](/datos/nasa/modis-viirs.md), [Landsat](/datos/nasa/landsat.md), [Sentinel-2](/datos/socios/sentinel-2.md). Todavía no se usa en el proyecto (FS-06).
