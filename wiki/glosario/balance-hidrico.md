---
type: Glossary Term
title: Balance hídrico
description: Oferta de agua (lluvia) menos demanda (evapotranspiración) en un período.
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

`balance = lluvia − ET0` (o `lluvia − Kc × ET0` para un cultivo). Negativo significa déficit: el cultivo pide más agua de la que llega. En el proyecto se calcula por [ventana crítica](/glosario/ventana-critica.md) para el modelo (`bal_hid`) y día a día en los [eventos del motor](/motor/clima-diario-y-eventos.md) (lluvia por debajo del 60 % de la demanda).
