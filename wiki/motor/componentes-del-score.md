---
type: Component
title: Componentes del puntaje
description: Ingreso, rapidez, salud del suelo, ahorro de insumos, resiliencia y cumplimiento, con pesos ajustables.
tags:
- motor
- scoring
- prioridades
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: Motor de recomendación (engine.js)
---

| Componente | Peso por defecto | Qué mide |
|---|---|---|
| `ingreso` | 0,25 | Margen bruto esperado |
| `rapidez` | 0,15 | Qué tan pronto se cosecha y libera el lote |
| `salud_suelo` | 0,20 | Rastrojo, cobertura, raíces, fijación de N, diversidad de la rotación |
| `ahorro_insumos` | 0,15 | Fertilizante evitado (fijación de N, reciclaje de cobertura) |
| `resiliencia` | 0,15 | Comportamiento en años malos y ante eventos extremos |
| `cumplimiento` | 0,10 | Adecuación a reglas ambientales |

* Cada peso está limitado a un máximo de 0,60 y se normalizan para sumar 1.
* El puntaje se multiplica por el [índice de aptitud](/glosario/indice-de-aptitud.md).
* Muchos parámetros de `salud_suelo` y `ahorro_insumos` son **ilustrativos** hasta tener la tabla con citas (FS-04).
