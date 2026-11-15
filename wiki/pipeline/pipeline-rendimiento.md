---
type: Pipeline
title: Pipeline del modelo de rendimiento
description: Descarga, features, validación y exportación al motor con un solo comando.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/pipeline/run_all.py
tags:
- pipeline
- reproducibilidad
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
- id: run-all
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/pipeline/run_all.py
  title: pipeline/run_all.py
---

# Pasos (`python pipeline/run_all.py`)

| Paso | Script | Salida |
|---|---|---|
| 1 | `fetch_magyp.py` | CSV de MAGyP en `data/raw/magyp/` + `data/processed/magyp_fuentes.json` |
| 2 | `build_departamentos.py` | `data/processed/departamentos.csv` (código INDEC, zona, centroide) |
| 3 | `fetch_power.py` | JSON diario de NASA POWER por departamento en `data/raw/power/` (con caché) |
| 4 | `build_features.py` | `climate_features.csv` y `yields.csv` |
| 5 | `train_validate.py` | `model_results.json` y `oof_predictions.csv` (~8 minutos) |
| 6 | `export_rend.py` | `prototype/src/rend_magyp.json`, que lee el motor |

Después: `node prototype/src/build.js && node prototype/src/build_mundo.js`.

# Requisitos

Python 3.12, `pip install -r pipeline/requirements.txt` (pandas, numpy, scikit-learn). Semilla fija. Los crudos (~100 MB) no se versionan; los procesados sí.

Ver [modelo](/modelo/modelo-rendimiento-clima.md) y [pruebas](/pipeline/pruebas.md).
