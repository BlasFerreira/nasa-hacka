---
type: Component
title: DNA del campo (perfil de resiliencia)
description: Perfil de seis dimensiones de 0 a 100 que compara el plan actual con el propuesto y explica qué cambió.
tags:
- motor
- resiliencia
- optimizador
generated:
  by: claude-code/claude-sonnet-5-5
  at: '2026-11-16T01:09:21Z'
sources:
- id: engine
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/engine.js
  title: engine.js
- id: app
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/app.tpl.html
  title: app.tpl.html
---

# Dimensiones (calculadas por el motor)

| Dimensión | Cómo se calcula |
|---|---|
| Agua | Lluvia frente a Kc × ET0 ([evapotranspiración](/glosario/evapotranspiracion.md)) |
| Sequía | Margen en la ventana mala sobre el margen típico, del plan completo; a nivel campo suma todos los lotes en cada ventana real |
| Calor | Multiplicador de calor del motor |
| Suelo | Salud del suelo del motor |
| Nutrientes | 1 − N a reponer / 250 kg/ha |
| Cobertura | Días cubiertos en la campaña |

Agua y calor necesitan la serie diaria de [NASA POWER](/datos/nasa/power.md); sin ella la dimensión dice «sin dato».

# Qué muestra

Radares (SVG) del plan actual y del propuesto, tabla de diferencias con la fuente de cada dimensión, radares por lote con panel de detalle, y «¿Por qué cambió tu DNA?»: las 3 mayores diferencias, el lote que más empuja en esa dirección (diferencia × área) y qué cambió en su rotación, con el dato o supuesto que lo respalda. **Sin afirmaciones causales.** Se actualiza con la estrategia y la campaña elegidas.
