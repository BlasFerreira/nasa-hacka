---
type: Component
title: Clima diario y eventos extremos
description: 'Cada ciclo de cultivo se revisa día a día con NASA POWER: calor extremo, heladas, rachas secas, lluvia intensa y déficit hídrico.'
resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/fetch_power_diario.js
tags:
- motor
- clima
- eventos-extremos
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: prototype-readme
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/README.md
  title: README del prototipo
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: Motor de recomendación (engine.js)
---

# Datos

`power_diario.json` (`fetch_power_diario.js`): NASA POWER diario 2001–2025 para las celdas de ejemplo, con ET0 FAO-56 Penman-Monteith calculada con `T2M_MAX`, `T2M_MIN`, `RH2M`, `WS2M` y `ALLSKY_SFC_SW_DWN`. Se inlinea en la página para que el demo funcione sin conexión.

# Eventos revisados

| Evento | Umbral (`UMBRALES` en `engine.js`) |
|---|---|
| Calor extremo en el período crítico | Por encima del p90 de las máximas de verano de la celda, y al menos 35 °C |
| Helada | Tmin < 0 °C (−4 °C para cultivos de invierno) |
| Racha seca | 20 días seguidos sin lluvia útil (≥ 1 mm) |
| Lluvia intensa | ≥ 50 mm en un día |
| Déficit hídrico | Lluvia < 60 % de la demanda del cultivo (Kc × ET0) |
| Humedad de raíz baja | `GWETROOT` < 0,4 |

Los umbrales, los [coeficientes Kc](/glosario/coeficiente-de-cultivo.md) y las penalizaciones son **supuestos documentados**: marcan riesgo, no son pérdidas de rendimiento validadas.
