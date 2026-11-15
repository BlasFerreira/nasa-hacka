---
type: Principles
title: Principios del proyecto
description: 'Reglas de trabajo y de diseño: transparencia antes que ML, procedencia visible, apoyo y no reemplazo del productor.'
tags:
- principios
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: claude-md
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/CLAUDE.md
  title: CLAUDE.md — guía del proyecto
- id: doc-funcional
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/documento_funcional.md
  title: Documento funcional
---

# Ciencia y datos

1. **Puntaje transparente antes que ML.** Un modelo entra solo si le gana a un baseline simple, validado correctamente (ver [criterio del gate](/modelo/criterio-del-gate.md)).
2. **Nada de ground truth inventado.** No hay etiquetas de «mejor rotación»; no se entrena para eso.
3. **Procedencia en cada número:** `observed`, `derived`, `modeled`, `assumed` o `unknown` ([glosario](/glosario/procedencia-de-datos.md)).
4. **Sin precisión falsa:** no afirmar escala de lote con datos de 9 km o de 0,5°.
5. **Correlación no es causalidad**, en particular para el efecto del cultivo antecesor.
6. **Un caso bien fundamentado vale más que un producto global sin respaldo** (por eso el foco en [Argentina](/proyecto/decisiones.md)).

# Producto

1. **El conocimiento del productor manda.**
2. **Una recomendación sin explicación no sirve.**
3. **Rentabilidad y sustentabilidad son una sola historia.**
4. **Granularidad por lote.**
5. **El MVP se muestra funcionando; las promesas técnicas, con plan.**
6. **La herramienta apoya, no reemplaza**, el criterio del productor y del agrónomo local, como pide el reto.

# Ingeniería

* Datos crudos separados y sin modificar; transformaciones documentadas; scripts reproducibles.
* Notebooks para explorar, scripts y módulos para producción.
* No agregar infraestructura que no haga falta (la app es estática, ver [arquitectura](/app/arquitectura.md)).
