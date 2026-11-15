---
type: Dataset
title: NASA POWER
description: Clima, radiación y agroclimatología diaria y mensual por punto, sin login; el dataset principal del proyecto.
resource: https://power.larc.nasa.gov/
tags:
- nasa
- dataset
- clima
generated:
  by: codex/gpt-6
  at: '2026-11-15T02:27:09Z'
sources:
- id: datasets
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/datasets.md
  title: Datasets del reto (pestaña Resources)
- id: reto-recursos
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources
  title: Pestaña Resources del reto
- id: oficial
  resource: https://power.larc.nasa.gov/
  title: NASA POWER (sitio oficial)
- id: api-diaria
  resource: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
  title: NASA POWER Daily API
- id: metodologia
  resource: https://power.larc.nasa.gov/docs/methodology/communities/
  title: Metodología y comunidades de NASA POWER
---

# Qué es

NASA POWER (Prediction Of Worldwide Energy Resources) entrega series de temperatura, lluvia, radiación, humedad, viento y variables agroclimáticas por punto o región, a través de una API REST sin login. La comunidad usada es **AG** (agricultura).

# Variables usadas

| Variable | Qué es | Unidad |
|---|---|---|
| `T2M`, `T2M_MAX`, `T2M_MIN` | Temperatura del aire a 2 m (media, máxima, mínima) | °C |
| `PRECTOTCORR` | Precipitación corregida | mm/día |
| `ALLSKY_SFC_SW_DWN` | Radiación solar en superficie | MJ/m²/día |
| `RH2M`, `WS2M` | Humedad relativa y viento a 2 m | %, m/s |
| `GWETROOT`, `GWETTOP` | Humedad de la zona de raíces y superficial (modelada, MERRA-2) | 0 a 1 |

# Resolución

Grilla gruesa: la meteorología viene de MERRA-2 (~0,5° × 0,625°) y la radiación de CERES SYN1deg (1°). Un valor describe una celda, **no un lote**. Los faltantes vienen como `-999` y hay que filtrarlos. La API distingue UTC de hora solar local; especificar y registrar el estándar temporal para las nuevas consultas.[^api-diaria][^metodologia]


# Estado en el proyecto

**Usado.** Mensual 2001–2025 para la climatología y los escenarios de la app; diario 2001–2025 para los [eventos extremos](/motor/clima-diario-y-eventos.md); diario 1981–2025 en 35 centroides departamentales para el [modelo de rendimiento](/modelo/modelo-rendimiento-clima.md). Las proyecciones CMIP6 de POWER devolvieron solo `-999` para Argentina.

[^api-diaria]: NASA POWER Daily API: https://power.larc.nasa.gov/docs/services/api/temporal/daily/.
[^metodologia]: Metodología NASA POWER: https://power.larc.nasa.gov/docs/methodology/communities/.
