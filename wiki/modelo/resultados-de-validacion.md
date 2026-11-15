---
type: Reference
title: Resultados de la validación
description: Habilidad fuera de muestra por zona y cultivo, modelo elegido y si pasa el gate.
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/data/processed/model_results.json
tags:
- modelo
- resultados
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: model-card
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/model_card.md
  title: Model card del modelo de rendimiento
- id: model-results
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/data/processed/model_results.json
  title: data/processed/model_results.json
---

| Zona | Cultivo | Ridge | RF | Elegido | Bloques | Pasa |
|---|---|---|---|---|---|---|
| pampa_humeda | soja | +0,54 | +0,51 | ridge | +0,43 / +0,29 / +0,77 | **sí** |
| pampa_humeda | maíz | +0,36 | +0,43 | rf | +0,10 / +0,46 / +0,78 | **sí** |
| pampa_humeda | sorgo | +0,23 | +0,16 | ridge | +0,26 / +0,19 / +0,27 | **sí** |
| pampa_humeda | avena | −0,05 | +0,25 | rf | +0,16 / +0,14 / +0,49 | sí (no se usa) |
| pampa_humeda | trigo | −0,00 | +0,20 | rf | −0,04 / +0,31 / +0,17 | no |
| pampa_humeda | cebada | −0,05 | +0,14 | rf | −0,15 / +0,07 / +0,34 | no |
| pampa_humeda | girasol | −0,02 | −0,00 | ridge | +0,05 / +0,20 / −1,61 | no |
| entre_rios | soja | +0,38 | +0,35 | ridge | +0,21 / +0,34 / +0,51 | **sí** |
| entre_rios | maíz | +0,35 | +0,34 | ridge | +0,22 / +0,43 / +0,43 | **sí** |
| entre_rios | sorgo | +0,14 | +0,13 | ridge | +0,27 / +0,06 / +0,10 | no |
| entre_rios | trigo | −0,05 | +0,01 | rf | −0,24 / +0,13 / −0,17 | no |
| entre_rios | girasol | −0,05 | −0,03 | ridge | −0,13 / −0,00 / −0,01 | no |

La avena pasa solo con random forest y su rendimiento oficial mezcla grano y pastoreo: la app no la usa.

# Chequeo con años conocidos

Soja, pampa húmeda (anomalía real → prevista fuera de muestra): 2008/09 −0,25 → −0,07; 2022/23 −0,57 → −0,31; 2018/19 +0,19 → +0,21. Signo correcto; **los extremos salen atenuados**.
