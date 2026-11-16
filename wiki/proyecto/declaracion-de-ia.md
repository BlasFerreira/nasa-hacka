---
type: Policy
title: Declaración de uso de IA
description: Qué parte del proyecto se hizo con ayuda de IA y qué parte de la app usa (o no) IA.
tags:
- ia
- entrega
- transparencia
generated:
  by: claude-code/claude-sonnet-5-5
  at: '2026-11-16T01:09:21Z'
sources:
- id: readme
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/README.md
  title: README
---

# Desarrollo

El equipo trabajó con **Claude Code (Anthropic)** para escribir código, documentación y esta wiki, y para redactar partes de la presentación. El equipo revisó y dirigió el trabajo. La declaración figura en el README y debe repetirse en el formulario de entrega y en la última slide del deck.

# Dentro de la app

* **Motor de decisión:** determinístico, con reglas y [puntaje transparente](/motor/motor-de-recomendacion.md). No es IA generativa.
* **Modelos entrenados:** solo el [modelo de rendimiento](/modelo/modelo-rendimiento-clima.md) (ridge o random forest, estadístico), validado y con límites documentados.
* **[Copilot](/app/copilot.md):** intérprete local de comandos, sin IA generativa; los datos no salen del navegador. Deja un punto de extensión para un LLM futuro.

# Por qué importa

El reto pide declarar el uso de IA y explicar cómo interpreta el modelo la incertidumbre. Ver [entrega](/reto/entrega.md).
