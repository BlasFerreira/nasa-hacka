---
type: Component
title: Filtro de aptitud
description: Compara los requisitos de cada cultivo con el lote y devuelve un índice gradual de 0 a 1.
tags:
- motor
- aptitud
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: Motor de recomendación (engine.js)
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
---

# Factores

Época de siembra, ventana de cosecha, temperatura, agua, pH, textura, drenaje y pendiente.

# Cómo puntúa

Cada factor usa una función trapezoidal: dentro del rango óptimo vale 1, baja en el borde y fuera del rango límite descarta el cultivo. El índice resume la «flexibilidad de la tierra» para cada cultivo y explica la causa principal de cada caída.

# Datos

Rangos del catálogo de cultivos: **ilustrativos** hoy; reemplazo previsto con [EcoCrop/GAEZ](/datos/socios/fao-gaez.md) e INTA (FS-04). Clima: [NASA POWER](/datos/nasa/power.md).
