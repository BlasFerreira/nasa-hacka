---
type: Dataset
title: INTA — Mapa Nacional de Cultivos
description: Mapas de cultivos de campañas consecutivas 2018/19 a 2024/25; permite describir rotaciones reales.
tags:
- argentina
- cultivos
- rotacion
- dataset
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: plan-accion
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/plan_de_accion.md
  title: 'Plan de acción: EDA + desarrollo'
---

# Qué es

Mapas del INTA hechos con Landsat 8/9 y Sentinel-2, de unas 7 campañas consecutivas (2018/19 a 2024/25), distribuidos por INTA.GEO, el repositorio del INTA y Zenodo.

# Para qué serviría

Con ~6 transiciones antecesor → cultivo por píxel se puede describir **qué secuencias son frecuentes** en la zona (definir la rotación «actual» típica con datos). **No alcanza para entrenar** un modelo del efecto de la rotación, y cualquier análisis del antecesor es observacional, sin lectura causal.

# Estado

**Pendiente (FS-15).** Falta confirmar formato y resolución.
