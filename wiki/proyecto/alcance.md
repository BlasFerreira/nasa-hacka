---
type: Scope
title: Alcance por niveles
description: Qué se demuestra funcionando (MVP), qué se explica como promesa técnica y qué es visión.
tags:
- alcance
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
- id: hitos
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/hitos.md
  title: 'Roadmap: qué está hecho y qué falta'
---

# Nivel 1 — MVP (funcionando)

* Campos y lotes con parámetros; filtro de aptitud gradual; ranking de cultivos con fecha de siembra y ventana de cosecha.
* Puntaje de la rotación actual relativo a las alternativas; cultivos de cobertura en el ranking.
* Explicación del puntaje; comparación de 3 rotaciones; stress test con campañas reales; optimizador de campo.

# Nivel 2 — Promesa técnica (en la presentación, con plan)

Historial propio del productor, análisis de suelo por zona, balance de nutrientes, alerta temprana, dashboard central, chat con LLM que explica (no decide), proyección de ingresos a 5–10 años, normativa con revisión humana, comunidad por zona con privacidad opt-in.

# Nivel 3 — Visión

Mapa tipo Google Earth por lote, expansión a otros países (cada región con su propio entrenamiento), aprendizaje por refuerzo para estrategias.

# Fuera de alcance a propósito

GRACE, ECOSTRESS y GEDI para decidir a escala de lote; redes profundas; predicción de humedad a 7 días; backend y contenedores. Ver [decisiones](/proyecto/decisiones.md).
