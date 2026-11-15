# Model card — respuesta del rendimiento al clima (Argentina)

> Generado por `pipeline/` el 2026-11-14. Criterio de aceptación escrito antes de ver los resultados: [`decisions.md`](decisions.md#d1--criterio-del-gate-de-ml-para-el-modelo-de-rendimiento-2026-11-14).

## Qué es y qué no es

- **Es** un modelo estadístico que estima cuánto se aparta el rendimiento de una zona de su tendencia tecnológica, según el clima de la ventana crítica del cultivo. Se usa en la app para el selector de campañas históricas («cómo le habría ido a este cultivo en la campaña 2022/23»).
- **No es** una predicción de la mejor rotación, ni estima el efecto de rotar (antecesor, cobertura, nitrógeno). Eso sale de parámetros agronómicos citados y está marcado como supuesto.
- **No es** un modelo de lote: el clima se toma en el centroide del departamento y el rendimiento es el oficial del departamento.

## Datos

| Qué | Fuente | Detalle |
|---|---|---|
| Rendimiento | MAGyP, Estimaciones Agrícolas | Por departamento y campaña, 1981–2024. Se usa el rendimiento sobre superficie **cosechada** (kg/ha). |
| Clima | NASA POWER diario, comunidad AG | 1981–2025 en el centroide de cada departamento: T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, ALLSKY_SFC_SW_DWN, RH2M, WS2M, GWETROOT, GWETTOP. |
| Centroides | API Georef (datos.gob.ar) | Unión siempre por código INDEC (`depto_id`), nunca por nombre. |

**Alcance:** zona `pampa_humeda` (27 departamentos de Buenos Aires, Santa Fe y Córdoba) y `entre_rios` (8 departamentos). 1.500 filas por cultivo en la primera zona y unas 330 en la segunda.

## Target y features

- **Target:** anomalía relativa `y / tendencia − 1`. La tendencia lineal se ajusta por departamento **solo con los años de entrenamiento de cada fold**.
- **Features por ventana crítica** (como anomalía respecto de la media del departamento): lluvia acumulada, balance hídrico (lluvia − ET0 de Hargreaves-Samani), días de calor (Tmax > 32 °C; 35 para sorgo; 30 para cereales de invierno), Tmax media, racha seca máxima, humedad de raíz (`GWETROOT`) en la ventana y en los 30 días previos, y días de helada en los cultivos de invierno.
- **Ventanas** (supuestos agronómicos): maíz y girasol 1-dic a 15-feb; soja y sorgo 1-ene a 15-mar; trigo, cebada y avena 1-sep a 30-nov.

## Modelos comparados

1. Baseline de solo tendencia (anomalía prevista = 0).
2. Ridge con los features de arriba (alfa elegido por validación agrupada por año dentro del entrenamiento).
3. Random forest conservador (200 árboles, profundidad 4, mínimo 20 filas por hoja).

Se publica el de mejor habilidad entre los que pasan el gate; si el ridge queda a menos de 0,02, gana por simple.

## Validación

*Leave-one-year-out* agrupado por campaña: para cada campaña se entrena sin ella y se predice. No se usó k-fold aleatorio. Las pruebas `tests/test_pipeline.py` verifican que el año retenido no influye en la tendencia ni en el entrenamiento.

**Habilidad** = `1 − SSE(modelo) / SSE(baseline de tendencia)`, sobre la anomalía promedio de la zona (ponderada por superficie). Pasa el gate con habilidad ≥ 0,20 y habilidad > 0 en cada uno de 3 bloques consecutivos de campañas.

| Zona | Cultivo | Deptos | Ridge | RF | Elegido | Hab. depto | Bloques (1°/2°/3°) | Desvío resid. | Cobertura 80 % | Pasa |
|---|---|---|---|---|---|---|---|---|---|---|
| pampa_humeda | soja | 27 | +0,54 | +0,51 | ridge | +0,39 | +0,43 / +0,29 / +0,77 | 0,112 | 0,80 | **sí** |
| pampa_humeda | maíz | 27 | +0,36 | +0,43 | rf | +0,37 | +0,10 / +0,46 / +0,78 | 0,144 | 0,86 | **sí** |
| pampa_humeda | sorgo | 27 | +0,23 | +0,16 | ridge | +0,19 | +0,26 / +0,19 / +0,27 | 0,151 | 0,82 | **sí** |
| pampa_humeda | avena | 27 | −0,05 | +0,25 | rf | +0,13 | +0,16 / +0,14 / +0,49 | 0,163 | 0,79 | sí* |
| pampa_humeda | trigo | 27 | −0,00 | +0,20 | rf | +0,11 | −0,04 / +0,31 / +0,17 | 0,181 | 0,86 | no |
| pampa_humeda | cebada | 27 | −0,05 | +0,14 | rf | +0,07 | −0,15 / +0,07 / +0,34 | 0,186 | 0,80 | no |
| pampa_humeda | girasol | 27 | −0,02 | −0,00 | ridge | −0,06 | +0,05 / +0,20 / −1,61 | 0,114 | 0,77 | no |
| entre_rios | soja | 8 | +0,38 | +0,35 | ridge | +0,32 | +0,21 / +0,34 / +0,51 | 0,189 | 0,84 | **sí** |
| entre_rios | maíz | 8 | +0,35 | +0,34 | ridge | +0,31 | +0,22 / +0,43 / +0,43 | 0,251 | 0,77 | **sí** |
| entre_rios | sorgo | 8 | +0,14 | +0,13 | ridge | +0,08 | +0,27 / +0,06 / +0,10 | 0,187 | 0,84 | no |
| entre_rios | trigo | 8 | −0,05 | +0,01 | rf | −0,01 | −0,24 / +0,13 / −0,17 | 0,209 | 0,84 | no |
| entre_rios | girasol | 8 | −0,05 | −0,03 | ridge | −0,02 | −0,13 / −0,00 / −0,01 | 0,185 | 0,80 | no |
| entre_rios | avena | 8 | +0,01 | +0,06 | rf | +0,07 | +0,04 / +0,14 / +0,13 | 0,228 | 0,80 | no |

*Entre Ríos / cebada no tiene datos suficientes para validar.* `* avena` pasa solo con el random forest; el rendimiento oficial de avena mezcla grano y pastoreo, así que **la app no la usa** y conviene no darle peso.

**Chequeos físicos con años conocidos** (zona pampa húmeda, soja; anomalía real → prevista fuera de muestra): campaña 2008/09 (sequía) −0,25 → −0,07; 2022/23 (sequía severa) −0,57 → −0,31; 2018/19 +0,19 → +0,21. El signo y el orden son correctos, y el modelo **subestima los extremos** (los atenúa hacia la media).

## Cómo lo usa la app

Si el cultivo pasó el gate y el usuario elige una campaña histórica, el rendimiento se calcula como `rendimiento base × aptitud × (1 + anomalía prevista de esa campaña)`, donde el rendimiento base es la media de las últimas 10 campañas de la zona (nivel tecnológico actual). Si no pasó, el motor usa el índice de aptitud climática y lo marca como tal. Todas las anomalías publicadas son **fuera de muestra**.

## Limitaciones

- **Pocos años independientes.** Hay 44 campañas; el clima de un mismo año está muy correlacionado entre departamentos, así que la información efectiva es del orden de los años, no de las filas.
- **Atenúa los extremos**, que son justo los años que más importan al productor.
- **Colinealidad:** lluvia acumulada y balance hídrico se mueven juntos, y sus coeficientes tienen signos opuestos. Hay que leer la atribución por grupo («agua en la ventana crítica»), no feature por feature.
- **Maíz temprano y tardío** están mezclados en la serie oficial; la ventana ancha cubre ambos y puede diluir la señal. En maíz de pampa húmeda el primer tercio de campañas tiene habilidad baja (+0,10), coherente con el corrimiento de fechas de siembra de la última década.
- **Tendencia lineal:** extrapola mal si cambia el ritmo de mejora tecnológica.
- **Soja 1ra y 2da** se tratan como una sola serie.
- **Clima estacionario:** usar años pasados como escenarios supone que el clima futuro se parece al histórico.
- **No incluye** plagas, precios, manejo, suelo ni genética.

## Reproducir

```bash
pip install -r pipeline/requirements.txt
python pipeline/run_all.py                 # descarga + features + validación (~8 min) + exportación
node prototype/src/build.js && node prototype/src/build_mundo.js
python -m unittest discover -s tests -v
```

Semilla fija (`SEED = 42`). Los datos crudos no se versionan; los procesados están en `data/processed/`.
