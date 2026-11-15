---
type: Model
title: Modelo de respuesta del rendimiento al clima
description: Estima cuánto se aparta el rendimiento de una zona de su tendencia según el clima de la ventana crítica; validado dejando un año afuera.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
tags:
- modelo
- ml
- rendimiento
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
- id: decisiones
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/decisions.md
  title: Registro de decisiones
---

# Qué es y qué no es

* **Es** un modelo estadístico de la anomalía de rendimiento respecto de la tendencia tecnológica, según el clima de la [ventana crítica](/glosario/ventana-critica.md). Alimenta el selector de campañas históricas y el [stress test](/motor/stress-test.md).
* **No es** una predicción de la mejor rotación ni del efecto de rotar, y no es un modelo de lote.
* **No predice el futuro:** las anomalías publicadas son de campañas pasadas, fuera de muestra (un *backtest*).

# Datos

[MAGyP](/datos/argentina/magyp-estimaciones-agricolas.md) (rendimiento) + [NASA POWER](/datos/nasa/power.md) diario en 35 centroides, 1981–2024. Zonas `pampa_humeda` (27 departamentos) y `entre_rios` (8).

# Cómo se construye

* Target: [anomalía de rendimiento](/glosario/anomalia-de-rendimiento.md) relativa.
* Features: ver [features por ventana fenológica](/modelo/features-por-ventana.md).
* Modelos: baseline de tendencia → ridge → random forest conservador.
* Validación: [leave-one-year-out](/modelo/validacion-loyo.md), con [criterio del gate](/modelo/criterio-del-gate.md) fijado antes.

# Resultado

Pasan el gate soja, maíz y sorgo de pampa húmeda y soja y maíz de Entre Ríos. Ver [resultados](/modelo/resultados-de-validacion.md) y [limitaciones](/modelo/limitaciones.md).

# Cómo lo usa la app

Si el cultivo pasó el gate y se elige una campaña histórica: `rendimiento base × aptitud × (1 + anomalía prevista)`. Si no pasó, se usa el índice de aptitud climática.
