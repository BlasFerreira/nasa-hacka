---
type: Runbook
title: Despliegue en Vercel
description: Cada push a main publica automáticamente; plan Hobby gratuito, sin cargos.
resource: https://asistente-rotacion-cultivos.vercel.app/
tags:
- app
- despliegue
- vercel
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: vercel
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/vercel.json
  title: prototype/vercel.json
---

# Cómo funciona

* Proyecto de Vercel con raíz `prototype/`, conectado al repo de GitHub: **cada push o merge a `main` despliega solo**.
* Sin paso de build: se sirve el HTML commiteado. Las rutas y cabeceras están en `prototype/vercel.json` (`sw.js` sin caché; tipo de contenido del manifest).
* Producción: https://asistente-rotacion-cultivos.vercel.app/

# Costo

Plan **Hobby** gratuito, sin método de pago y con la facturación por exceso desactivada: si se pasan los límites, Vercel pausa en vez de cobrar. Gasto registrado: USD 0. El plan Hobby es para uso personal y no comercial.

# Límites

Vercel sirve sitios y funciones serverless; **no ejecuta contenedores Docker**. Si hiciera falta un backend con contenedor, iría en otro servicio (Render, Railway, Cloud Run, Fly.io) y el frontend seguiría en Vercel.
