# Field Shift — Plan de acción: EDA + desarrollo

> NASA Space Apps Challenge 2026 · *Field Shift: Adapting Farms with NASA Data*
> Borrador: 2026-11-14 · Las horas (h0–h48) son relativas al inicio del trabajo.

---

## 0. Antes del plan: qué modelo sí y cuál no

Que vayamos a entrenar un modelo es razonable, con una condición: tiene que predecir algo para lo que existan **labels reales**.

| Target posible | ¿Hay labels? | Veredicto |
|---|---|---|
| "Mejor rotación" para un lote | No existen | ❌ No entrenar. Habría que inventar el ground truth |
| Rendimiento por cultivo × año × departamento | **Sí**: Estimaciones Agrícolas (MAGyP), series desde ~1970 | ✅ Target principal |
| Respuesta de vegetación (integral de NDVI en la temporada) por cultivo | **Sí**, si se cruza con mapas de cultivos (INTA) | ✅ Target secundario, a escala más fina |
| Efecto del cultivo antecesor sobre el rendimiento | Solo observacional y con confounding | ⚠️ Exploratorio. Por defecto, coeficientes de literatura marcados como `assumed` |

### Arquitectura propuesta: híbrida

```text
NASA (POWER, GPM, SMAP, MODIS) + suelo + labels de rendimiento
                    │
                    ▼
     MODELO ML: respuesta de cada cultivo al clima
     (rendimiento esperado + su distribución)
                    │
                    ▼
     SCORER TRANSPARENTE multi-objetivo
     (componentes yield / climate_resilience vienen del modelo;
      water / soil_health de índices observados + supuestos documentados)
                    │
                    ▼
     Ranking de rotaciones según los pesos del productor
```

El ML aporta algo **real y validable** (cómo responde cada cultivo al clima), y no pretende responder una pregunta que no tiene labels ("cuál es la mejor rotación").

### La idea central para la demo

Usar los **~25 años de clima histórico como un ensamble de escenarios**. Para cada rotación se simula el rendimiento bajo cada año climático y sale una **distribución**, no un número:

- media
- P10 (el "año malo")
- desvío
- % de años por debajo de un umbral

Eso es **resiliencia medida con datos de NASA**, y responde bien al "what-if" que pide el challenge.

---

## Fase 0 — Setup y fijar el caso (h0–h2)

- [ ] Estructura del repo (`data/`, `notebooks/`, `src/`, …) y `pyproject.toml`. El repo git ya existe.
- [ ] **Inventario de datos** (`docs/data_inventory.md` o `notebooks/01_data_inventory.ipynb`): para cada dataset, resolución espacial y temporal, período cubierto, método de acceso, latencia y faltantes. Es el primer entregable del EDA y evita bajar datasets grandes a ciegas.
- [ ] **Crear ya las cuentas de Earthdata Login** (https://urs.earthdata.nasa.gov/), **los 6**.
- [ ] **Pedir ya los recortes en AppEEARS** (MODIS NDVI, SMAP L4) para el bounding box de la región; no hace falta esperar los polígonos exactos. Las solicitudes quedan en cola entre minutos y horas, así que conviene lanzarlas en la hora 1 para no bloquearse después. Lo hacen los Tracks D y E.
- [ ] Fijar `case_study.yaml`:
  - **Región:** Zona Núcleo, unos 15–25 departamentos (Pergamino, Rojas, General López, Marcos Juárez, Caseros, etc.).
  - **Cultivos:** soja (1ra y 2da), maíz, trigo y cultivo de cobertura.
  - **Lote demo:** un punto en Pergamino.

**Por qué departamentos y no un lote:** los labels de rendimiento son departamentales. Entrenar a esa escala y aplicar al lote como "contexto regional" es honesto. Entrenar al lote no es posible con estos datos.

---

## Fase 1 — EDA en 6 tracks paralelos (h2–h10)

Hay un track por persona. Cada track además **completa su fila en el inventario de datos** y tiene asignado un rol para después del EDA, así nadie queda sin tarea cuando se pasa a desarrollo.

| Track | Tema | Criticidad | Después del EDA pasa a… |
|---|---|---|---|
| **A** | Labels de rendimiento (MAGyP) | 🔴 Decide si hay ML | Modelado (Fase 3) |
| **B** | Clima NASA POWER + ventanas fenológicas | 🔴 Features principales | Modelado (Fase 3) |
| **C** | Precipitación GPM + ENSO | 🟡 | Motor de escenarios what-if |
| **D** | Agua: SMAP + evapotranspiración | 🟡 | Componente `water` del scorer |
| **E** | Vegetación + mapa de cultivos INTA | 🟡 | Efecto antecesor + mapa de la UI |
| **F** | Geometría, suelo y parámetros agronómicos | 🔴 Bloquea a todos en h2 | Componente `soil_health` + API |

### Contrato común (se fija en h2, antes de que cada uno arranque)

Todos los tracks producen tablas con la **misma clave**:

```text
depto_id   código INDEC del departamento (string, 5 dígitos)
campana    "2020/21"  — campaña agrícola, no año calendario
cultivo    soja_1ra | soja_2da | maiz | trigo
```

- **Gotcha:** los nombres de los departamentos difieren entre fuentes ("General López" vs "Gral. López", tildes, mayúsculas). **Nunca joinear por nombre**, siempre por código INDEC. El Track F publica la tabla de equivalencias.
- Formato de salida: `parquet` en `data/processed/`. Los datos crudos van a `data/raw/<fuente>/` y no se modifican.

### Puntos de sincronización

| Hora | Qué |
|---|---|
| **h2** | El Track F publica los polígonos y centroides de los departamentos. Se fija el contrato. |
| **h6** | Stand-up de 15 min. Cada track muestra 1 gráfico y dice qué funciona y qué está bloqueado. Se decide qué datasets se descartan (gate de "dataset doloroso"). |
| **h9** | Join de todas las tablas (A + B como mínimo). Se corren los análisis transversales. |
| **h10** | Gate de ML (Fase 2). |

---

### Track A — Labels de rendimiento (el más crítico, porque decide si hay ML)

Fuente: **Estimaciones Agrícolas** (datos.magyp.gob.ar).

Preguntas a responder:

- **Cobertura:** cuántas filas útiles quedan por departamento, cultivo y campaña, y cuánto falta.
- **Soja 1ra / 2da:** *verificado:* datos.magyp.gob.ar tiene datasets separados de "Soja 1ra" y "Soja 2da" por departamento **desde 2000**. La soja total va desde 1941. Con esto se puede modelar el doble cultivo trigo/soja, que es una de las rotaciones alternativas, pero solo para el período 2000+.
- **Rendimiento sobre superficie cosechada vs sembrada:** el rendimiento oficial se calcula sobre la superficie **cosechada**. En una sequía fuerte se pierden lotes enteros, y eso **no aparece en el rendimiento**. Comparar el rendimiento oficial con `producción / superficie sembrada`. Para medir resiliencia, el segundo suele ser el target más honesto.
- **Tendencia tecnológica:** el rendimiento sube por genética y manejo, no por el clima. **Hay que quitar la tendencia** (lineal o LOESS por departamento). El target es la **anomalía**; si no, el modelo aprende "el año" y no el clima.
  - Gotcha de leakage: si la tendencia se ajusta con todos los años, el año de test se filtra en el target. En la validación, **ajustar la tendencia dentro de cada fold**, o al menos medir cuánto cambia el resultado.
- **Alineación campaña ↔ clima:** la campaña 2020/21 de maíz depende del clima de oct-2020 a mar-2021. Este error es fácil de cometer y no da ningún aviso.

**Entregables:**
- `notebooks/00_labels_exploration.ipynb`
- `data/processed/yields_detrended.parquet`
- Lista de los peores años por cultivo (insumo de los sanity checks).

### Track B — Clima NASA POWER y ventanas fenológicas

- Implementar el cliente de POWER (Tarea 3 del `CLAUDE.md`): coordenadas, rango de fechas y variables configurables, reintentos, caché y JSON crudo en `data/raw/power/`.
- POWER diario desde 1981 en el centroide de cada departamento. **Filtrar los `-999`** (valor faltante de POWER; si no se filtran, contaminan medias y anomalías sin dar error).
- **Variable clave:** POWER incluye humedad de suelo (`GWETTOP`, `GWETROOT`, de MERRA-2) desde 1981. Es una serie larga de humedad que SMAP (desde 2015) no da.
- Agregar por **ventana fenológica**, no por año calendario:
  - maíz → período crítico alrededor de la floración (dic–ene)
  - soja → llenado de grano (feb–mar)
  - trigo → espigazón (sep–oct)

  Esto vale más que cualquier truco de modelado.
- **Gotcha agronómico — maíz temprano vs tardío:** en la Zona Núcleo, el maíz tardío (siembra en diciembre) pasó de ser marginal a ocupar una parte grande del área en la última década. Su período crítico se corre a febrero. Una ventana fija de dic–ene mezcla dos cultivos distintos y genera un **cambio estructural en la serie**. Opciones: ventanas más anchas, features para las dos ventanas, o restringir el período de entrenamiento y documentarlo.
- Features por ventana: lluvia acumulada, `T2M_MAX` media, días con Tmax > 32–35 °C (golpe de calor en floración), heladas (Tmin < 0 °C, importante para trigo), días secos consecutivos y `GWETROOT` medio.
- Si C o D necesitan clima diario, B se los pasa: **un solo cliente de POWER para todo el equipo**.

**Entregables:**
- `src/data/power.py` (cliente)
- `notebooks/02_power_exploration.ipynb`
- `data/processed/climate_features.parquet`, con la clave del contrato

### Track C — Precipitación GPM IMERG + ENSO

- **GPM IMERG** (0,1°, desde 2000): ¿coincide con la lluvia de POWER? Comparar por departamento, en totales mensuales y en eventos extremos (p95 diario, días con más de 50 mm). Si la correlación mensual es muy alta y los extremos no cambian, **GPM no se usa para entrenar** y queda como evidencia en la UI. *No mantener GPM solo porque es de NASA.*
- **Extremos:** con GPM, contar lluvias intensas (riesgo de erosión) y la duración de las rachas secas. Son insumos para el scorer.
- **ENSO:** bajar el índice ONI de NOAA y clasificar cada campaña como Niña / neutro / Niño. Verificar que las campañas Niña estén sobrerrepresentadas entre las peores (cruzar con el Track A).
- Prototipar el **remuestreo de años por fase ENSO**, que después es la base del motor de escenarios.

**Entregables:**
- `notebooks/03_gpm_exploration.ipynb`
- `data/processed/enso_by_campaign.parquet`
- `data/processed/precip_extremes.parquet`
- Decisión "GPM sí/no para entrenar", escrita en `docs/decisions.md`.

### Track D — Agua: SMAP + evapotranspiración

- **SMAP L4** (9 km, desde 2015): ¿la anomalía de humedad aporta información más allá de la lluvia acumulada? Medir la correlación parcial.
- **Uso realista:** validar que `GWETROOT` de POWER sigue a SMAP en 2015–2025. Si lo sigue, se usa POWER para entrenar (serie larga) y SMAP como **evidencia observada** en la UI. *Este resultado habilita o no la mitad de los features del Track B, así que hay que comunicarlo en h6.*
- **Demanda hídrica:** calcular la ET de referencia (ET0) con las variables de POWER, que ya trae radiación, temperatura, humedad y viento. Combinarla con coeficientes de cultivo `Kc` de FAO-56 para estimar la demanda de cada cultivo. Con eso sale un **balance hídrico simple** (oferta − demanda por ventana), que es la base del componente `water` del scorer.
- Opcional, solo si sobra tiempo: ECOSTRESS ET. No tiene serie larga; puede servir como visual.

**Entregables:**
- `notebooks/04_smap_exploration.ipynb`
- `data/processed/water_balance.parquet`

### Track E — Vegetación + mapa de cultivos INTA

- **MODIS MOD13Q1** (NDVI 250 m, 16 días, desde 2000): integral y pico estacional por departamento, enmascarando por cultivo si hay mapa disponible. **Pedir los recortes en AppEEARS en h0–h1** (lo hace este track).
- Sanity check: el NDVI tiene que mostrar la estacionalidad (picos en verano para soja/maíz, en primavera para trigo), y la integral estacional debería correlacionar con el rendimiento del Track A.
- **Mapa Nacional de Cultivos (INTA):** *verificado:* hay mapas de campañas consecutivas **desde 2018/19 hasta 2024/25**, unas 7 campañas. Se distribuyen por INTA.GEO, el repositorio institucional del INTA y Zenodo, y están hechos con Landsat 8/9 + Sentinel-2. Con 7 campañas se observan unas **6 transiciones antecesor → cultivo por píxel**: alcanza para describir las rotaciones reales de la zona (qué secuencias son frecuentes) y para un análisis exploratorio del efecto antecesor. **No alcanza para entrenar un modelo de efecto rotación.** Falta confirmar el formato de descarga (raster vs vector) y la resolución.
- Producto concreto: una **tabla de frecuencias de secuencias** (por ejemplo, "soja → soja → maíz aparece en un X % de los píxeles"). Define cuál es la rotación "actual" típica del caso de estudio con datos, no de memoria.
- **Visual de la demo:** Sentinel-2 o HLS sobre el lote. No hace falta para el modelo.

**Entregables:**
- `notebooks/05_remote_sensing_exploration.ipynb`
- `data/processed/ndvi_seasonal.parquet`
- `data/processed/rotation_sequences.parquet`

### Track F — Geometría, suelo y parámetros agronómicos

**Bloquea a todos, así que su primera entrega es para h2:**

- **Polígonos de los departamentos** (IGN) con código INDEC, centroides y la **tabla de equivalencias de nombres** entre MAGyP e IGN → `data/processed/departamentos.geojson`.
- Completar `case_study.yaml` (lote demo, cultivos, rotaciones candidatas) junto con el Track E.

**Después de h2:**

- **Suelo:** SoilGrids (250 m) o la cartografía de suelos de INTA, para textura, carbono orgánico, pH y capacidad de retención de agua. Se agrega por departamento y sale el valor puntual del lote. Va como feature estática y como contexto en la UI.
- **Terreno:** SRTM, pendiente media por departamento. En la Zona Núcleo es bastante plana, así que es probable que **no aporte**. Verificarlo en 30 minutos y descartarlo si es el caso.
- **Tabla de parámetros agronómicos con fuente:** por cultivo, `Kc`, longitud del ciclo, aporte de rastrojo, relación C:N, fijación de N, días de cobertura del suelo y beneficio como antecesor. **Cada valor con su cita** (FAO-56, INTA, AAPRESID, papers). Es lo que respalda el componente `soil_health` y los valores `assumed`.
- **Dueño del inventario de datos:** consolida las filas que manda cada track.

**Entregables:**
- `data/processed/departamentos.geojson`
- `data/processed/soil_static.parquet`
- `data/reference/crop_parameters.yaml` (con las fuentes)
- `docs/data_inventory.md`
- `docs/assumptions.md`

### Análisis transversales del EDA (h9–h10, dueños: A + B)

1. **Tamaño muestral efectivo.** Unos 20 departamentos × 25 años × 3 cultivos ≈ 1.500 filas. Pero el clima está muy correlacionado espacialmente dentro de un mismo año, así que **la unidad efectiva es el año: ~25 realizaciones independientes**. Esto define la validación y descarta modelos con muchos parámetros.
2. **Trade-off ventana de entrenamiento vs features.** Cada fuente agregada como feature recorta la serie al año en que empieza:

   | Set de features | Desde | Campañas aprox. | Uso |
   |---|---|---|---|
   | Solo POWER (clima + `GWETROOT`) | 1981 | ~44 | Modelo principal candidato |
   | + MODIS NDVI | 2000 | ~25 | Comparar: ¿el NDVI compensa perder 19 años? |
   | + soja 1ra/2da separadas | 2000 | ~25 | Necesario para el doble cultivo |
   | + SMAP | 2015 | ~10 | ❌ No usar para entrenar: solo evidencia en la UI |

   Entrenar las dos variantes (1981+ y 2000+) y comparar en la misma validación. Es un resultado del EDA en sí mismo.
3. **Sanity check físico:** correlación entre las anomalías de rendimiento y los features por ventana. La sequía en el período crítico debería bajar el rendimiento del maíz.
4. **Años de referencia:** identificarlos (por ejemplo 2008/09 y 2022/23, ambos secos con La Niña) y verificar que aparezcan como outliers negativos.
5. **Colinealidad entre features climáticos** (lluvia, humedad de suelo, ET, temperatura máxima en la misma ventana): mirar la matriz de correlación. Si es alta, SHAP reparte la atribución de forma arbitraria entre features. En ese caso conviene agrupar features ("estrés hídrico en período crítico") y reportar la atribución por grupo.

### Definition of done del EDA (gate para pasar a la Fase 2)

- [ ] Inventario de datos completo, con resolución y período de cada fuente.
- [ ] Tabla `(departamento, campaña, cultivo) → anomalía de rendimiento` limpia, con la decisión cosechada vs sembrada documentada.
- [ ] Tabla de features por ventana fenológica, joineable con la anterior sin pérdidas silenciosas: contar filas antes y después del join.
- [ ] Sanity checks físicos pasados, o documentado por qué no pasan.
- [ ] Ventana de entrenamiento elegida (1981+ vs 2000+), con la justificación.

---

## Fase 2 — Gate de ML (h10–h12)

Una sola pregunta:

> **¿Un modelo con clima le gana al baseline de solo tendencia en validación dejando un año afuera?**

| Resultado | Acción |
|---|---|
| R² fuera de muestra sobre las anomalías claramente > 0 (orientativo: ≥ 0,2) y estable entre folds | Se sigue con ML |
| R² ≈ 0 o inestable | Se descarta el ML y se usa un scorer con índices climáticos (días de estrés, déficit hídrico). El pipeline del EDA no se pierde |

El umbral de 0,2 es un **criterio nuestro**, no un estándar. Lo importante es que la decisión quede escrita en `docs/decisions.md` **antes** de ver los resultados finales, para no ajustar el criterio a posteriori.

---

## Fase 3 — Modelado (h12–h24)

### Setup

- **Target:** anomalía de rendimiento sin tendencia, por cultivo. Empezar con un modelo por cultivo; si hay pocos datos, un modelo único con el cultivo como feature.
- **Features:** clima por ventana fenológica, humedad de suelo, suelo estático. **No incluir el año ni el ID de departamento** sin pensarlo, porque abren la puerta a leakage.
- **Validación:**
  - Principal: *leave-one-year-out* (agrupado por campaña).
  - Secundaria: *leave-department-out*, para estimar cómo generaliza el modelo a un lugar nuevo.
  - ⛔ **Prohibido k-fold aleatorio** (leakage temporal).

### Escalera de modelos

Se sube un escalón solo si el anterior queda superado:

1. Solo tendencia (baseline nulo).
2. Regresión lineal con 3–5 features agronómicos (baseline interpretable).
3. Random Forest.
4. LightGBM o XGBoost con hiperparámetros conservadores (poca profundidad, `min_child_samples` alto), porque n es chico.

### Explicabilidad e incertidumbre

- **SHAP** sobre el modelo elegido. En la UI se traduce en el "por qué": *"en este escenario pesa el déficit hídrico en enero"*.
- **Intervalos** con regresión cuantílica (LightGBM `objective="quantile"`) o con los residuos de la validación cruzada. Esto alimenta directamente el P10 de cada rotación.

### Efecto de la rotación (antecesor)

- **Si el Track D obtuvo mapas multi-campaña:** análisis observacional de la integral de NDVI según el antecesor. Va en la UI como *evidencia exploratoria*, **sin lectura causal**, porque el productor elige la rotación según el lote y eso confunde el efecto.
- **Si no:** coeficientes de literatura (por ejemplo, el beneficio de maíz sobre soja), etiquetados `assumed` y **citados**.

### Simulación de escenarios (el motor what-if)

```text
para cada rotación R:
  para cada año climático histórico y:
    rendimiento(R, y) = Σ cultivos de R: modelo(clima_y, suelo) + efecto_antecesor
  → distribución por rotación: media, P10, desvío, % de años malos
```

**Dos refinamientos que suman mucho a la demo:**

- **Escenarios condicionados por ENSO:** filtrar los años históricos por fase (Niña / neutro / Niño, según el índice ONI de NOAA). Así se puede responder *"si la próxima campaña viene Niña, ¿cómo le iría a cada rotación?"*. Es un what-if concreto y conecta con los pronósticos estacionales que el productor ya consulta.
- **Propagar las dos incertidumbres:** a la variabilidad climática (entre años) se le suma el error del modelo, usando los residuos de la validación cruzada. Si no, la distribución sale artificialmente angosta.

**Limitación a explicitar:** usar años pasados como escenarios supone **clima estacionario**. Mencionarlo en la UI y en el pitch. Como mejora opcional, mostrar la tendencia de temperatura/precipitación de POWER 1981–2025 en la zona.

---

## Fase 4 — Scorer e integración (h20–h30, solapada con la Fase 3)

**Componentes del score:**

| Componente | Fuente | Procedencia |
|---|---|---|
| `yield` | media de la distribución simulada | `modeled` |
| `climate_resilience` | P10 / desvío de la distribución | `modeled` |
| `water` | demanda hídrica del cultivo frente a la oferta observada (POWER/SMAP) | `derived` + `assumed` |
| `soil_health` | días de cobertura, aporte de rastrojo, fijación de N | `assumed` (con fuente) |

- Cada número lleva su etiqueta de procedencia: `observed | derived | modeled | assumed | unknown`. Implementarla como **campo en el esquema de datos**, no solo en la UI.
- **Test de sensibilidad:** con prioridad agua 0,6 y con prioridad suelo/clima 0,4 el ranking tiene que cambiar de forma intuitiva. Es un test automatizado **y** un momento de la demo.

---

## Fase 5 — API y UI (h26–h42)

- **API:** FastAPI con un endpoint `/scenarios`.
- **Front:**
  1. mapa
  2. sliders de prioridades
  3. comparación de 3 rotaciones, mostrando la **distribución** y no solo la media
  4. "¿por qué?"
  5. evidencia (qué dataset aporta cada indicador)
  6. gaps de información y qué requiere validación local
- Se puede arrancar con datos mock a partir de la hora 20, cuando el contrato de la API esté fijo.

---

## Fase 6 — Pitch (h42–h48)

Frase central:

> *"No predecimos la mejor rotación: medimos cómo se habría comportado cada una en los últimos 25 años de clima observado por NASA."*

Es honesta y además mucho más fuerte.

---

## Riesgos principales

| Riesgo | Mitigación |
|---|---|
| La cola de AppEEARS o Earthdata se atrasa | Pedir todo en la hora 1. POWER no requiere login y alcanza como plan B |
| No se le quita la tendencia al target | Revisarlo en la Fase 2: el baseline de solo tendencia tiene que estar en la tabla |
| Leakage temporal con k-fold aleatorio | Prohibido: solo validación agrupada por campaña |
| Mapas INTA no disponibles | El efecto antecesor pasa a `assumed`, con fuente bibliográfica |
| El modelo no pasa el gate | El scorer con índices climáticos ya está construido con los mismos features |

---

## ⚠️ Pendiente de verificar en las primeras horas

Chequeados por búsqueda web el 2026-11-14. Igual conviene confirmarlos abriendo los archivos:

- [x] **Soja 1ra / 2da por departamento:** hay datasets separados desde 2000 en datos.magyp.gob.ar. *Falta:* confirmar nombres de columnas y formato CSV.
- [x] **Mapa Nacional de Cultivos (INTA):** hay campañas 2018/19 a 2024/25 en INTA.GEO, el repositorio del INTA y Zenodo. *Falta:* confirmar formato y resolución.
- [x] **MODIS:** la recolección científica termina en **feb-2027 (Terra)** y **sep-2027 (Aqua)**, así que la serie 2000–2025 está completa para entrenar. Para continuidad hacia adelante, usar VIIRS. ⚠️ Según el foro de Earthdata, la entrega de productos de **Suomi NPP terminó el 1-nov-2026**, así que hay que preferir los productos de **NOAA-20 (prefijo `VJ1…`)** sobre los `VNP…`. Falta verificarlo en AppEEARS.
