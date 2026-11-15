---
type: Component
title: Stress test de rotaciones
description: Cada rotación se corre sobre 22 ventanas de 3 campañas reales consecutivas de NASA POWER.
tags:
- motor
- escenarios
- resiliencia
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: prototype-readme
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/README.md
  title: README del prototipo
---

# Qué hace

En lugar de repetir un mismo año, cada rotación se evalúa sobre **todas las ventanas de 3 campañas reales consecutivas** (22 ventanas con el clima 2001–2025). Los escenarios seco y húmedo arrancan una secuencia real.

# Qué muestra

* Distribución de resultados por rotación (el año típico y el [año malo, P10](/glosario/p10.md)).
* «Análisis climático avanzado»: eventos por rotación y qué explica las caídas.
* Línea de tiempo diaria de la campaña.

# Relación con el modelo

En las campañas históricas, los cultivos que pasaron el gate usan la anomalía del [modelo de rendimiento](/modelo/modelo-rendimiento-clima.md); el resto, el índice de aptitud con los [eventos diarios](/motor/clima-diario-y-eventos.md).

# Límite

Supone clima estacionario. Las proyecciones CMIP6 de POWER no tienen datos para Argentina, así que no hay escenarios de clima futuro. Pendiente: filtro por [ENSO](/datos/socios/enso-oni.md).
