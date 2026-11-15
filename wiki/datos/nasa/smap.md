---
type: Dataset
title: SMAP (Soil Moisture Active Passive)
description: Producto satelital y modelado de humedad superficial y de zona radicular; L4 entrega estimaciones globales a 9 km cada 3 horas.
resource: https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/smap
tags:
- nasa
- dataset
- agua
- humedad
generated:
  by: codex/gpt-6
  at: '2026-11-15T02:27:09Z'
sources:
- id: datasets
  resource: https://github.com/BlasFerreira/nasa-hacka/blob/main/docs/datasets.md
  title: Datasets del reto (pestaña Resources)
- id: reto-recursos
  resource: https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources
  title: Pestaña Resources del reto
- id: oficial
  resource: https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/smap
  title: SMAP (Soil Moisture Active Passive) (sitio oficial)
- id: catalogo-nsidc
  resource: https://nsidc.org/data/smap/data
  title: Catálogo oficial de productos SMAP en NSIDC DAAC
---

# Qué es

Misión de NASA (desde 2015) que mide la humedad del suelo superficial y el estado de congelamiento. El producto L4 combina observaciones con un modelo y estima también humedad superficial y de la zona de raíces. El catálogo actual de NSIDC lista SPL4SMAU v8 con malla de 9 km y frecuencia de 3 horas desde el 31 de marzo de 2015.[^catalogo-nsidc]

# Para qué sirve

Estrés por sequía, disponibilidad de agua, infiltración y señales tempranas de estrés del cultivo. Ver [humedad de suelo](/glosario/humedad-de-suelo.md).

# Cuidado

9 km es mucho más grueso que un lote: sirve como contexto regional. Requiere cuenta de Earthdata Login (o AppEEARS).


# Estado en el proyecto

**Pendiente (FS-07).** Plan: comprobar que `GWETROOT` de POWER sigue a SMAP en 2015–2025. Si lo sigue, se entrena con POWER (serie desde 1981) y SMAP se muestra como evidencia observada.

[^catalogo-nsidc]: Catálogo de datos de SMAP, NSIDC DAAC: https://nsidc.org/data/smap/data.
