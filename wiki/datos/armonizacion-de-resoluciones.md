---
type: Method
title: Armonización de resoluciones espaciales y temporales
description: Cómo se llevan datos de distinta escala (celda POWER, departamento, campaña) a una misma unidad de análisis.
tags:
- metodo
- datos
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
---

# Unidad común

**Departamento × campaña × cultivo**, con clave `(depto_id, campana, cultivo)`:

* **Espacio:** el clima de NASA POWER se toma en el centroide de cada departamento ([Georef](/datos/argentina/georef-departamentos.md)); el rendimiento ya viene por departamento. Para la app, los departamentos se agregan por zona ponderando por superficie.
* **Tiempo:** el clima diario se agrega por **ventana fenológica** del cultivo, no por año calendario (ver [ventana crítica](/glosario/ventana-critica.md)), y se alinea con la [campaña agrícola](/glosario/campana-agricola.md).
* **Unión:** siempre por código INDEC; se cuentan las filas antes y después de cada unión (hay una prueba que lo verifica).

# Próximos datasets

SMAP (9 km) y NDVI (250 m) se agregarían a la misma unidad: media por departamento en cada ventana. Así entran como features o evidencia sin fingir una precisión de lote.
