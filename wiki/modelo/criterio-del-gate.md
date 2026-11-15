---
type: Decision
title: Criterio del gate de ML (D1)
description: Un cultivo usa modelo solo si explica al menos 20 % de la anomalía y mejora en los tres bloques de años.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/decisions.md
tags:
- modelo
- decision
- validacion
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: decisiones
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/decisions.md
  title: Registro de decisiones
---

# Pregunta

¿Un modelo con clima le gana al baseline de solo tendencia, validado dejando un año afuera?

# Regla (escrita antes de ver los resultados)

Un cultivo en una zona **pasa** si:

1. [Habilidad](/glosario/habilidad-frente-a-tendencia.md) a nivel zona-año **≥ 0,20**, y
2. habilidad **> 0 en cada uno de 3 bloques** consecutivos de campañas (estabilidad).

Si no pasa, no usa modelo y el motor lo marca.

# Elección del modelo

Mayor habilidad entre los que pasan; si el ridge queda a menos de 0,02 del mejor, se prefiere el ridge por simple.

El umbral de 0,20 es un criterio del equipo, no un estándar.
