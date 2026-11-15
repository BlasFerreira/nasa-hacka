---
type: Method
title: Validación dejando un año afuera
description: Para cada campaña se entrena sin ella y se predice; la tendencia se ajusta dentro de cada fold para evitar fugas.
tags:
- modelo
- validacion
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
---

# Procedimiento

Para cada campaña *t*:

1. Se separan los datos de *t* (test) del resto (entrenamiento).
2. Se ajusta la tendencia lineal de cada departamento **solo con el entrenamiento**.
3. Se calculan las anomalías de entrenamiento y las medias climáticas por departamento con ese mismo entrenamiento.
4. Se entrena el modelo y se predice la anomalía de *t*.

Ver [leave-one-year-out](/glosario/leave-one-year-out.md).

# Por qué así

El clima de un año es casi el mismo en todos los departamentos de una zona: un k-fold aleatorio dejaría el mismo año en entrenamiento y test, y el resultado saldría inflado. **Está prohibido.**

# Métricas

* [Habilidad frente a la tendencia](/glosario/habilidad-frente-a-tendencia.md), por zona-año y por departamento.
* Habilidad en 3 bloques de campañas (estabilidad).
* Desvío de los residuos y cobertura del intervalo del 80 %.

Pruebas automáticas: `tests/test_pipeline.py` verifica que el año retenido no influye en la tendencia ni en el entrenamiento.
