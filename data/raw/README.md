# data/raw

Datos crudos, sin modificar. **No se versionan** (≈100 MB): se regeneran con `python pipeline/run_all.py`.

| Carpeta | Contenido | Fuente | Script |
|---|---|---|---|
| `magyp/` | CSV de siembra, cosecha, producción y rendimiento por departamento y campaña | datos.magyp.gob.ar (Estimaciones Agrícolas) | `pipeline/fetch_magyp.py` |
| `power/` | Clima diario 1981–2025 en el centroide de cada departamento (JSON de la API) | NASA POWER, comunidad AG | `pipeline/fetch_power.py` |
| `georef/` | Centroide de cada departamento | API Georef (datos.gob.ar) | `pipeline/build_departamentos.py` |

La procedencia de cada CSV de MAGyP (dataset, recurso, URL, fecha) queda en `data/processed/magyp_fuentes.json`.
