---
type: Product Concept
title: 'Concepto de producto: «Test your field''s future»'
description: 'Motor de escenarios what-if: lote, condiciones, prioridades, rotaciones, compromisos, por qué y qué falta saber.'
tags:
- producto
- ux
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: claude-md
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/CLAUDE.md
  title: CLAUDE.md — guía del proyecto
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
---

# Flujo

```text
LOTE → CONDICIONES ACTUALES → PRIORIDADES DEL PRODUCTOR → ESCENARIOS DE ROTACIÓN → COMPROMISOS → ¿POR QUÉ? → APOYO A LA DECISIÓN
```

# Qué entrega

1. Selección del lote en un mapa (área o punto).
2. Condiciones con datos de NASA: lluvia, temperatura, eventos extremos, humedad de raíz.
3. Prioridades del productor como pesos ajustables (ver [componentes del score](/motor/componentes-del-score.md)).
4. Al menos tres rotaciones: la actual y dos alternativas.
5. Comparación por eje (agua, suelo, resiliencia, ingreso, riesgo).
6. Explicación: por qué una opción puntúa más.
7. Evidencia: qué dataset aporta cada indicador.
8. Incertidumbre: qué es observado, derivado, modelado o supuesto (ver [procedencia de datos](/glosario/procedencia-de-datos.md)).

# Encuadre

Es **exploración de escenarios, no recomendación agronómica autónoma**. No promete rendimientos precisos donde los datos no lo sostienen. La frase del pitch: «No predecimos la mejor rotación: medimos cómo se habría comportado cada una en los últimos 25 años de clima observado por NASA».
