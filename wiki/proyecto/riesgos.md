---
type: Risk Register
title: Riesgos y mitigaciones
description: Riesgos de datos, modelo, producto y entrega, con su mitigación.
tags:
- riesgos
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
---

| Riesgo | Mitigación |
|---|---|
| Alcance inflado, nada demostrable | Un solo flujo de punta a punta; niveles de [alcance](/proyecto/alcance.md) |
| Puntaje poco creíble | Procedencia de cada componente; validación con datos reales ([modelo](/modelo/validacion-loyo.md)) |
| Fuga temporal en la validación | Solo *leave-one-year-out*; tendencia ajustada dentro de cada fold; pruebas automáticas |
| Cola de Earthdata/AppEEARS lenta | NASA POWER no requiere login y alcanza como plan B |
| El modelo no pasa el gate | El motor usa el índice de aptitud climática y lo dice |
| Datos de una región usados en otra | Entrenamiento por zona; no extrapolar fuera de Argentina |
| Marca NASA en el material | Logo reemplazado en app y landing; verificar que el deck tampoco lo use (FS-23) |
| Olvidar reconstruir el HTML | Vercel sirve el HTML commiteado: correr `node prototype/src/build.js` antes de commitear |
| El LLM (futuro chat) inventa datos | Limitarlo a datos del modelo, exigir citas, permitir «no hay dato» |
