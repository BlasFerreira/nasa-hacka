---
type: Method
title: Features climáticos por ventana fenológica
description: Qué variables se calculan en la ventana crítica de cada cultivo y con qué umbrales.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/pipeline/build_features.py
tags:
- modelo
- features
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
- id: build-features
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/pipeline/build_features.py
  title: pipeline/build_features.py
---

# Ventanas (supuestos agronómicos)

| Cultivo | Ventana crítica |
|---|---|
| Maíz, girasol | 1-dic a 15-feb (cubre maíz temprano y tardío) |
| Soja, sorgo | 1-ene a 15-mar |
| Trigo, cebada, avena | 1-sep a 30-nov |

# Features (como anomalía respecto de la media del departamento)

| Feature | Cálculo |
|---|---|
| `p_sum` | Lluvia acumulada en la ventana (mm) |
| `bal_hid` | Lluvia − ET0 de Hargreaves-Samani (ver [balance hídrico](/glosario/balance-hidrico.md)) |
| `dias_calor` | Días con Tmax > 32 °C (35 en sorgo; 30 en cereales de invierno) |
| `tmax_media` | Temperatura máxima media |
| `racha_seca` | Racha más larga de días con lluvia < 1 mm |
| `gwet_raiz` | `GWETROOT` medio en la ventana |
| `gwet_previa` | `GWETROOT` medio en los 30 días previos (agua almacenada al llegar) |
| `dias_helada` | Días con Tmin < 0 °C (solo cultivos de invierno) |

Código: `pipeline/build_features.py`.
