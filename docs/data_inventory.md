# Inventario de datos

Una fila por dataset usado o evaluado. Estado: **usado** (en la app o en el modelo), **evidencia** (se muestra pero no entrena), **pendiente** o **descartado**. Actualizado 2026-11-14. Alcance: Argentina.

| Dataset | Proveedor / producto | Res. espacial | Res. temporal | Cobertura usada | Acceso | Licencia / condiciones | Estado | Para qué |
|---|---|---|---|---|---|---|---|---|
| **NASA POWER diario** | NASA LaRC, comunidad AG (MERRA-2 + CERES) | ~0,5° × 0,625° (grilla) | Diario | 1981–2025, 35 centroides departamentales | API REST sin login | Abierto, citar a NASA POWER | **usado** | Features del modelo de rendimiento: lluvia, temperatura, radiación, humedad de raíz (`GWETROOT`), ET0 |
| **NASA POWER mensual** | NASA LaRC, comunidad AG | ~0,5° × 0,625° | Mensual | 2001–2025, 2 puntos de referencia (Paraná, Pergamino) | API REST sin login | Ídem | **usado** | Climatología y escenarios seco/promedio/húmedo de la app (`power_climatology.json`) |
| **Estimaciones Agrícolas** | MAGyP, datos.magyp.gob.ar | Departamento | Campaña (anual) | 1981–2024, 7 cultivos, 35 departamentos | CSV por CKAN | Datos abiertos del Estado | **usado** | Target del modelo (rendimiento) y rendimiento de referencia por zona |
| **Resultados agrícolas (márgenes y precios)** | MAGyP, informe de campaña 2026/27 | Región | Campaña | Pampa húmeda y Entre Ríos | Informe publicado | Datos abiertos | **usado** | Margen bruto en el motor (`ECON_MAGYP`) |
| **Centroides departamentales** | API Georef, datos.gob.ar | Departamento | — | 35 departamentos | API REST | Abierto | **usado** | Coordenadas para pedir POWER; unión por código INDEC |
| **SMAP L4 humedad de suelo** | NASA | 9 km | 3 horas | — | Earthdata Login / AppEEARS | Abierto, requiere cuenta | pendiente (FS-07) | Evidencia: comprobar que `GWETROOT` de POWER sigue a SMAP (2015+) |
| **MODIS / VIIRS NDVI** | NASA LP DAAC | 250 m | 16 días | — | Earthdata Login / AppEEARS | Abierto, requiere cuenta | pendiente (FS-06) | Integral y pico de NDVI por zona; preferir NOAA-20 (`VJ1…`) |
| **GPM IMERG** | NASA | 0,1° | 30 min | — | Earthdata Login | Abierto, requiere cuenta | pendiente (FS-08) | Extremos de lluvia; solo si cambia la decisión |
| **SoilGrids / INTA** | ISRIC / INTA | 250 m | Estático | — | API / descarga | Abierto | pendiente (FS-05) | Suelo real por zona (hoy es ilustrativo) |
| **SRTM** | NASA | 30 m | Estático | — | Earthdata | Abierto | pendiente, probable descarte | La Zona Núcleo es muy plana; comprobar en 30 min |
| GRACE/GRACE-FO, ECOSTRESS, GEDI | NASA | Gruesa / sin serie larga | — | — | — | — | descartado | Muy gruesos o sin serie larga para un lote |

## Notas

- **Resolución:** POWER es una grilla gruesa; el valor de un departamento describe su centroide, no un lote. Rendimiento y clima se alinean por **campaña** (año de siembra), no por año calendario.
- **Faltantes:** POWER marca los faltantes con `-999`; se filtran antes de agregar (hay una prueba que lo verifica).
- **Procedencia de los CSV de MAGyP:** `data/processed/magyp_fuentes.json` (dataset, recurso, URL y tamaño de cada descarga).
- Los datos crudos no se versionan (≈100 MB): `python pipeline/run_all.py` los regenera.
