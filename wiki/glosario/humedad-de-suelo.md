---
type: Glossary Term
title: Humedad de suelo y anomalía de humedad
description: Agua disponible en el suelo; la anomalía compara con lo normal para esa época.
tags:
- glosario
- agua
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

* **Humedad superficial:** los primeros centímetros (lo que ve [SMAP](/datos/nasa/smap.md) directamente).
* **Zona de raíces:** donde toma agua el cultivo. `GWETROOT` de [NASA POWER](/datos/nasa/power.md) es una estimación **modelada** (0 = seco, 1 = saturado).
* **Anomalía de humedad:** diferencia con la media de esa época del año; −18 % significa más seco que lo normal.

Satélite y medición en campo no son lo mismo: el satélite promedia kilómetros y la sonda mide un punto. Combinarlos mejora la estimación.
