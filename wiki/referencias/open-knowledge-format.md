---
type: Reference
title: Open Knowledge Format (OKF)
description: Formato abierto de Google Cloud para bases de conocimiento legibles por personas y agentes.
resource: https://github.com/GoogleCloudPlatform/open-knowledge-format
tags:
- okf
- referencia
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: okf-spec
  resource: https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md
  title: OKF SPEC v0.2
---

OKF (v0.2) representa conocimiento como un directorio de archivos Markdown con frontmatter YAML: sin registro de esquemas, sin autoridad central y sin herramientas obligatorias. Formaliza el patrón de «wiki para LLM».

Puntos clave de la especificación:
* Un concepto por archivo; su ID es la ruta sin `.md`.
* `index.md` (listado para descubrimiento progresivo) y `log.md` (historial) son nombres reservados.
* Familias opcionales de procedencia (`sources`), confianza (`generated`, `verified`) y ciclo de vida (`status`, `stale_after`).
* Los consumidores no deben rechazar tipos desconocidos, claves extra ni links rotos.
