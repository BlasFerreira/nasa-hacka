---
type: Reference
title: Convenciones de esta wiki
description: Cómo está armada la wiki en formato OKF v0.2 y cómo mantenerla.
tags:
- wiki
- okf
generated:
  by: claude-code/claude-opus-5-5
  at: '2026-11-15T02:27:09Z'
sources:
- id: okf-spec
  resource: https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md
  title: OKF SPEC v0.2
---

# Formato

Bundle [OKF v0.2](/referencias/open-knowledge-format.md): un concepto por archivo Markdown con frontmatter YAML. Único campo obligatorio: `type`. Se usan también `title`, `description`, `resource`, `tags`, `status`, `generated`, `stale_after` y `sources`.

# Tipos usados

`Project Overview`, `Product Concept`, `Principles`, `Scope`, `Team`, `Roadmap`, `Decision Record`, `Decision`, `Risk Register`, `Challenge`, `Requirements Coverage`, `Submission Rules`, `Playbook`, `Dataset`, `Method`, `Model`, `Reference`, `Component`, `Architecture`, `Runbook`, `Pipeline`, `Glossary Term`.

# Confianza

* `generated.by` usa la convención de actores: `claude-code/claude-opus-5-5` para lo generado por el agente, `human:<usuario>` para lo escrito por una persona.
* Ningún concepto tiene `verified` todavía: según OKF son **unverified**. Cuando alguien del equipo revise una página, agregar `verified: { by: human:<usuario-de-github>, at: <fecha ISO> }`.
* Las páginas que cambian rápido (roadmap, cobertura) tienen `stale_after`.

# Mantenimiento

```bash
python tools/okf_wiki.py index   # regenera los index.md desde el frontmatter
python tools/okf_wiki.py check   # verifica la conformidad con OKF v0.2
```

Registrar cada cambio en [log.md](/log.md). Links entre conceptos con rutas absolutas del bundle (`/datos/nasa/power.md`).
