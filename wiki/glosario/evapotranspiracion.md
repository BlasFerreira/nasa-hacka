---
type: Glossary Term
title: Evapotranspiración (ET y ET0)
description: Agua que pasa del suelo y las plantas a la atmósfera; ET0 es la de un cultivo de referencia.
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

**Evapotranspiración (ET):** suma de la evaporación del suelo y la transpiración de las plantas. Es la «salida» de agua del lote.

**ET0 (de referencia):** la ET de un pasto de referencia bien regado, calculada con el clima. La demanda de un cultivo se estima como `Kc × ET0` (ver [coeficiente de cultivo](/glosario/coeficiente-de-cultivo.md)).

En el proyecto:
* Motor de la app: ET0 FAO-56 Penman-Monteith con datos diarios de [NASA POWER](/datos/nasa/power.md).
* Modelo de rendimiento: ET0 de Hargreaves-Samani (solo temperatura y radiación teórica) para el [balance hídrico](/glosario/balance-hidrico.md).
