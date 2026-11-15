---
type: Runbook
title: Flujo de trabajo con git
description: Una rama por tarea, reconstruir antes de commitear y merge a main que despliega.
tags:
- git
- proceso
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: prototype-readme
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/prototype/README.md
  title: README del prototipo
---

1. Crear una rama por tarea (`feat/...`, `fix/...`, `docs/...`) desde `main` actualizado.
2. Editar en `prototype/src/` y **reconstruir**: `node prototype/src/build.js` y `node prototype/src/build_mundo.js`.
3. Si cambian datos del modelo: `python pipeline/run_all.py` y `python -m unittest discover -s tests`.
4. Commitear también los HTML regenerados.
5. Push de la rama y merge a `main` (Vercel despliega).

Si `main` avanzó, hacer `git fetch` y merge antes de subir. Los datos crudos (`data/raw/`) no se versionan.
