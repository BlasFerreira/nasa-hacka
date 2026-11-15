---
type: Reference
title: Limitaciones del modelo de rendimiento
description: Lo que el modelo no puede decir y dónde hace falta criterio local.
tags:
- modelo
- limitaciones
- incertidumbre
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
---

* **Pocos años independientes:** 44 campañas; el clima de un año está correlacionado entre departamentos, así que la información efectiva es del orden de los años.
* **Atenúa los extremos**, justo los años que más importan.
* **Colinealidad:** lluvia y balance hídrico se mueven juntos y sus coeficientes tienen signos opuestos; leer la atribución por grupo («agua en la ventana crítica»).
* **Maíz temprano y tardío mezclados** en la serie oficial; la ventana ancha diluye la señal.
* **Tendencia lineal:** extrapola mal si cambia el ritmo de mejora tecnológica.
* **Soja 1ra y 2da** como una sola serie.
* **Clima estacionario:** usar años pasados como escenarios supone que el futuro se parece al pasado.
* **No incluye** plagas, precios, manejo, suelo ni genética.
* **Escala:** departamento, no lote.
