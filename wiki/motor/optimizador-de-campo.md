---
type: Component
title: Optimizar mi campo
description: 'Optimizador de rotaciones a nivel campo: busca combinaciones por lote acopladas por el riesgo del campo entero.'
tags:
- motor
- optimizacion
- campo
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: commit-optimizador
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/src/app.tpl.html
  title: app.tpl.html (commit 0108dfd, «Optimizar mi campo»)
---

# Qué hace

Vista `#/optimizar/<campo>`, que se abre desde el resumen del campo:

1. Para cada lote genera las rotaciones comerciales de 1 a 3 cultivos y sus variantes con cobertura, y las evalúa con el mismo motor.
2. Arma una lista corta y diversa (mejor puntaje, margen, cobertura, resiliencia) más la rotación actual.
3. Corre cada candidato sobre las 22 ventanas del [stress test](/motor/stress-test.md).
4. Acopla los lotes por el **riesgo del campo**: el margen del año malo es el P10 de la **suma** de todos los lotes en la misma ventana. Regla opcional: ningún cultivo por encima del 70 % del área en una campaña.
5. Búsqueda determinística sobre todas las combinaciones (beam search si pasan de 60.000), con desempates fijos. **Nunca dice haber encontrado el óptimo global.**

# Salida

Tres propuestas: balanceada según las prioridades, mayor margen típico y mayor margen en el año malo. Mapas antes/después por campaña, plan lote × campaña, indicadores ponderados por área y explicaciones con los números del evaluador. Restricciones: excluir cultivos, exigir cobertura, mantener la rotación de un lote. Los lotes y sus rotaciones actuales nunca se modifican.

# Perfil y navegación

Cada propuesta se perfila con el [DNA del campo](/motor/adn-del-campo.md) (seis dimensiones). Un dock fijo en la parte inferior permite cambiar de propuesta y de campaña sin perder el contexto, y el [Copilot](/app/copilot.md) tiene puntos de entrada desde esta vista.
