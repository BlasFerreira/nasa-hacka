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

- [ ] `git init`, la estructura del repo y `pyproject.toml`.
- [ ] **Crear ya las cuentas de Earthdata Login** (https://urs.earthdata.nasa.gov/).
- [ ] **Pedir ya los recortes en AppEEARS** (MODIS NDVI, SMAP L4) para los polígonos de los departamentos. Las solicitudes quedan en cola entre minutos y horas, así que conviene lanzarlas en la hora 1 para no bloquearse después.
- [ ] Fijar `case_study.yaml`:
  - **Región:** Zona Núcleo, unos 15–25 departamentos (Pergamino, Rojas, General López, Marcos Juárez, Caseros, etc.).
  - **Cultivos:** soja (1ra y 2da), maíz, trigo y cultivo de cobertura.
  - **Lote demo:** un punto en Pergamino.

**Por qué departamentos y no un lote:** los labels de rendimiento son departamentales. Entrenar a esa escala y aplicar al lote como "contexto regional" es honesto. Entrenar al lote no es posible con estos datos.

---

## Fase 1 — EDA en 4 tracks paralelos (h2–h10)

> Si somos menos de 4, fusionar los tracks C y D.

### Track A — Labels (el más crítico, porque decide si hay ML)

Fuente: **Estimaciones Agrícolas** (datos.magyp.gob.ar).

Preguntas a responder:

- **Cobertura:** cuántas filas útiles quedan por departamento, cultivo y campaña, y cuánto falta.
- **Soja 1ra / 2da:** ¿la serie las distingue a nivel departamento? Si lo hace, permite modelar el doble cultivo trigo/soja, que es justamente una de las rotaciones alternativas.
- **Tendencia tecnológica:** el rendimiento sube por genética y manejo, no por el clima. **Hay que quitar la tendencia** (lineal o LOESS por departamento). El target es la **anomalía**; si no, el modelo aprende "el año" y no el clima.
- **Alineación campaña ↔ clima:** la campaña 2020/21 de maíz depende del clima de oct-2020 a mar-2021. Este error es fácil de cometer y no da ningún aviso.

**Entregables:**
- `notebooks/00_labels_exploration.ipynb`
- `data/processed/yields_detrended.parquet`

### Track B — Clima (NASA POWER y GPM)

- POWER diario desde 1981 en el centroide de cada departamento. **Filtrar los `-999`** (valor faltante de POWER; si no se filtran, contaminan medias y anomalías sin dar error).
- **Variable clave:** POWER incluye humedad de suelo (`GWETTOP`, `GWETROOT`, de MERRA-2) desde 1981. Es una serie larga de humedad que SMAP (desde 2015) no da.
- Agregar por **ventana fenológica**, no por año calendario:
  - maíz → período crítico alrededor de la floración (dic–ene)
  - soja → llenado de grano (feb–mar)
  - trigo → espigazón (sep–oct)

  Esto vale más que cualquier truco de modelado.
- Comparar la precipitación de **GPM IMERG** con la de POWER y quedarse con GPM solo si cambia algo, por ejemplo en eventos extremos.

**Entregables:**
- `notebooks/02_power_exploration.ipynb`
- `data/processed/climate_features.parquet`, con la clave `(departamento, campaña, cultivo)`

### Track C — SMAP y validación cruzada

- SMAP L4 (9 km): ¿la anomalía de humedad aporta información más allá de la precipitación acumulada? Medir la correlación parcial.
- **Uso realista:** validar que `GWETROOT` de POWER sigue a SMAP en 2015–2025. Si lo sigue, se usa POWER para entrenar (serie larga) y SMAP como **evidencia observada** en la UI.

**Entregable:** `notebooks/04_smap_exploration.ipynb`

### Track D — Vegetación y suelo

- **MODIS MOD13Q1** (NDVI 250 m, 16 días, desde 2000): integral y pico estacional por departamento, enmascarando por cultivo si hay mapa disponible.
- **Mapa Nacional de Cultivos (INTA):** verificar disponibilidad y campañas. Si existe para varias campañas, permite **observar secuencias de rotación reales** por píxel. Es el único camino para mirar el efecto antecesor con datos.
- **Suelo:** SoilGrids (250 m) o la cartografía de suelos de INTA, para textura, carbono orgánico y capacidad de retención. Va como feature estática y como contexto en la UI.
- **Visual de la demo:** Sentinel-2 o HLS sobre el lote. No hace falta para el modelo.

**Entregable:** `notebooks/05_remote_sensing_exploration.ipynb`

### Análisis transversales del EDA

1. **Tamaño muestral efectivo.** Unos 20 departamentos × 25 años × 3 cultivos ≈ 1.500 filas. Pero el clima está muy correlacionado espacialmente dentro de un mismo año, así que **la unidad efectiva es el año: ~25 realizaciones independientes**. Esto define la validación y descarta modelos con muchos parámetros.
2. **Sanity check físico:** correlación entre las anomalías de rendimiento y los features por ventana. La sequía en el período crítico debería bajar el rendimiento del maíz.
3. **Años de referencia:** identificarlos (por ejemplo 2008/09 y 2022/23, ambos secos con La Niña) y verificar que aparezcan como outliers negativos.

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

Estos puntos los damos por **probables, no por confirmados**:

- [ ] Si Estimaciones Agrícolas separa **soja 1ra / 2da** a nivel departamento.
- [ ] Qué campañas cubre el **Mapa Nacional de Cultivos (INTA)** y en qué formato está disponible.
- [ ] Cobertura reciente de MODIS (Terra está cerca del fin de su vida útil). Si faltan años recientes, usar VIIRS (VNP13A1) para continuidad.
