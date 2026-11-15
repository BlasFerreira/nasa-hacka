# Field Shift — Roadmap: qué está hecho y qué falta

> NASA Space Apps Challenge 2026 · *Field Shift: Adapting Farms with NASA Data*
> Actualizado: 2026-11-14. Reemplaza el roadmap anterior de 8 hitos (V0.1–V1.0, escrito con el nombre «TerraFutures»).
> El detalle del EDA y del modelado está en [`plan_de_accion.md`](plan_de_accion.md). Este documento es el tablero: estado, pendientes y orden.

Leyenda: ✅ hecho · 🟡 parcial · ⬜ falta · ⛔ descartado a propósito

Prioridad: **P0** imprescindible para entregar · **P1** suma mucho al puntaje · **P2** si sobra tiempo.

Cada pendiente tiene un ID (`FS-xx`) y un criterio de «hecho», pensado para copiarlo tal cual como issue de GitHub. Hoy el repo no tiene issues abiertos (solo 6 pull requests cerrados).

---

## 1. Dónde estamos

Hay un MVP que funciona y está publicado (https://asistente-rotacion-cultivos.vercel.app): landing inmersiva, app de recomendación y rotaciones, vista del campo de 60 ha, PWA y sección de contribuidores. Se despliega solo con cada push a `main`.

Lo que **todavía no se sostiene frente a un jurado técnico**: casi todo lo agronómico (cultivos, suelo, efectos de la rotación) es ilustrativo, hay un solo producto NASA (POWER), y el cálculo del modelo de rendimiento no está reproducible en el repo.

---

## 2. Cobertura de los requisitos del reto

| Requisito del reto | Estado | Qué hay hoy | Qué falta |
|---|---|---|---|
| Herramienta de apoyo a decisiones | ✅ | App web con recomendación y comparación | — |
| Al menos un dataset NASA | ✅ | NASA POWER: clima mensual 2001–2025, 2 zonas | — |
| Otros datos NASA (SMAP, GPM, MODIS/VIIRS, SRTM…) | ⬜ | Ninguno | FS-06, FS-07 (FS-08 opcional) |
| Suelo local | 🟡 | Texturas y pH ilustrativos por lote | FS-05 |
| Características de los cultivos | 🟡 | Catálogo ilustrativo; rendimientos y márgenes de MAGyP | FS-04 |
| Prioridades del agricultor | ✅ | 6 pesos ajustables (ingreso, rapidez, salud del suelo, ahorro de insumos, resiliencia, cumplimiento) | Restricciones (agua, maquinaria): FS-17 |
| Comparar ≥3 rotaciones, incluida la actual | ✅ | «Las 3 rotaciones en el tiempo» | — |
| Por qué, evidencia, beneficios, riesgos | 🟡 | Tarjetas «Evidencia e incertidumbre» y «Por qué» | Procedencia en el esquema de datos: FS-13 |
| Brechas de información y revisión local | 🟡 | Mencionadas en la UI | Visibles en cada resultado: FS-19 |
| Escenarios de clima / sliders | 🟡 | Seco, promedio y húmedo («Prueba de clima») | Distribución con 25 años: FS-10; ENSO: FS-11; sliders: FS-12 |
| Indicadores: calor, helada, lluvia extrema, ET, humedad de suelo, vegetación | 🟡 | Temperatura y lluvia mensuales | FS-06, FS-07, FS-09 |
| Armonizar resoluciones distintas | ⬜ | Un punto de referencia por zona | Se resuelve agregando por zona en FS-06/07/09 |
| Mapa interactivo y vulnerabilidades por lote | 🟡 | Mapa con selección de área y de punto, popup con recomendación | Capa de datos sobre el mapa: FS-18 |
| Explicar términos científicos (ET, NDVI, anomalía) | ⬜ | Nada | FS-16 |
| Apoyar, no reemplazar, el criterio del agricultor | 🟡 | Presente en textos | FS-19 |
| Entrega (equipo, resumen, link, deck o video, datasets, uso de SI) | ⬜ | Deck de 7 slides con marcadores sin completar | FS-21 a FS-25 |

---

## 3. Lo que ya está hecho

- **App** (`prototype/mvp-rotacion.html`): campos y lotes, filtro de aptitud, ranking de cultivos para sembrar hoy con razones, comparación de 3 rotaciones, comparación por eje, «Prueba de clima», evidencia e incertidumbre.
- **Motor** (`prototype/src/engine.js`): puntaje transparente con 6 componentes, sin ML en la decisión. Incluye un modelo de rendimiento por clima con validación *leave-one-year-out* (`REND_MAGYP`: soja y maíz de pampa húmeda, maíz de Entre Ríos pasan el gate; el resto no y se descarta).
- **Datos reales:** NASA POWER (clima), MAGyP (rendimientos departamentales y márgenes brutos).
- **Landing y campo:** `experiencia.html` (scroll inmersivo) y `mundo.html` (campo de 60 ha).
- **Producto:** PWA instalable, mapa a pantalla completa, rectángulo editable y selección por clic, paleta NASA, contribuidores.
- **Operación:** Vercel conectado a GitHub, costo USD 0.
- **Documentación:** `docs/datasets.md`, `docs/documento_funcional.md`, `docs/plan_de_accion.md`.

---

## 4. Lo que falta (tablero de issues)

### A. Credibilidad y reproducibilidad

- [ ] **FS-01 · P0 · Pipeline de rendimiento reproducible.** Los números de `REND_MAGYP` están pegados en `engine.js` y el script que los generó no está en el repo. Versionar un script que descargue MAGyP, quite la tendencia, valide *leave-one-year-out* contra el baseline de solo tendencia y escriba ese JSON. *Hecho cuando:* un comando regenera los mismos valores y `docs/model_card.md` explica target, validación y límites.
- [ ] **FS-02 · P0 · Inventario de datos.** `docs/data_inventory.md` con una fila por dataset usado o descartado: resolución espacial y temporal, período, acceso, licencia, uso y motivo si se descartó.
- [ ] **FS-03 · P1 · Caso de estudio y decisiones.** `case_study.yaml` (región, cultivos, rotación actual, lote demo), `docs/assumptions.md` y `docs/decisions.md` con el criterio del gate de ML escrito.
- [ ] **FS-04 · P0 · Parámetros agronómicos con cita.** Un `crop_parameters.yaml` con Kc, ciclo, fijación de N, días de cobertura y beneficio como antecesor, cada valor con su fuente (FAO-56, INTA, AAPRESID, papers). Reemplaza al catálogo ilustrativo y respalda `salud_suelo`.
- [ ] **FS-05 · P1 · Suelo real.** SoilGrids (o cartografía INTA) por zona: textura, carbono orgánico, pH, retención de agua. Etiquetado como dato regional, no medición del lote.

### B. Más datos NASA

- [ ] **FS-06 · P1 · Vegetación (MODIS/VIIRS NDVI).** Integral, pico estacional y período de suelo desnudo por zona, pedido por AppEEARS. Preferir NOAA-20 (`VJ1…`) sobre Suomi NPP, cuya entrega terminó el 2026-11-01 (verificar). *Hecho cuando:* la UI muestra el NDVI como evidencia observada y el inventario lo registra.
- [ ] **FS-07 · P1 · Humedad de suelo.** Comprobar que `GWETROOT` de POWER sigue a SMAP en 2015–2025. Si lo sigue, entrenar con POWER y mostrar SMAP como evidencia; si no, descartar SMAP y dejar constancia.
- [ ] **FS-08 · P2 · GPM/IMERG.** Comparar con la lluvia de POWER y contar extremos y rachas secas. Si no cambia la decisión, queda solo como evidencia (decisión escrita en `docs/decisions.md`).
- [ ] **FS-09 · P1 · Indicadores diarios.** Con POWER diario: días con Tmax > 32/35 °C, heladas (Tmin < 0 °C), rachas secas y balance hídrico (ET0 − lluvia, con Kc). Filtrar los `-999`.

### C. Motor y modelo

- [ ] **FS-10 · P1 · Escenarios como distribución.** Pasar de seco/promedio/húmedo a usar cada año histórico como escenario: media, P10, desvío y % de años malos por rotación.
- [ ] **FS-11 · P2 · Filtro ENSO.** Clasificar campañas Niña / neutro / Niño con el índice ONI de NOAA y permitir «si viene Niña…».
- [ ] **FS-12 · P2 · Sliders de lluvia y temperatura** sobre el escenario.
- [ ] **FS-13 · P0 · Procedencia en el esquema.** Cada valor del motor lleva `observed | derived | modeled | assumed | unknown` como campo de datos, no solo como texto de la UI.
- [ ] **FS-14 · P1 · Test de sensibilidad automatizado.** Con agua 0,6 y con suelo/clima 0,4 el ranking cambia de forma intuitiva. Va en `smoke.js` y es un momento de la demo.
- [ ] **FS-15 · P2 · Efecto antecesor.** Tabla de frecuencias de secuencias (mapa de cultivos INTA 2018/19–2024/25) o, si no se consigue, coeficientes citados marcados `assumed`. Sin lectura causal.

### D. Interfaz y mensaje

- [ ] **FS-16 · P1 · Glosario en la app.** Qué son ET, NDVI, anomalía, helada y balance hídrico, en una o dos líneas cada uno.
- [ ] **FS-17 · P2 · Restricciones del productor.** Agua disponible, maquinaria y mercado como entradas, además de los pesos.
- [ ] **FS-18 · P2 · Capa sobre el mapa.** NDVI o anomalía de lluvia por zona.
- [ ] **FS-19 · P0 · «Apoya, no reemplaza».** En cada resultado: qué debe validar un agrónomo y qué información falta.
- [ ] **FS-20 · P1 · Prueba en celular real.** Instalación de la PWA y modo sin conexión. No se pudo verificar en el navegador embebido.

### E. Entrega

Reglas del reto: la entrega y el demo van en inglés; **≤7 slides o un video de ≤30 s**; al menos un dataset NASA; hay que declarar el uso de SI/IA.

- [ ] **FS-21 · P0 · Deck de 7 slides en inglés** (`prototype/deck/`). Actualizarlo con datos reales y el sexto criterio, y completar `[Team name]`, `[Member names]` y `[public link]`.
- [ ] **FS-22 · P0 · Página del proyecto en Space Apps.** Nombre del equipo, resumen, link público (Vercel), repo, datasets NASA usados y declaración de uso de IA.
- [ ] **FS-23 · P0 · Logo de NASA.** La guía dice que el contenido generado por equipos no debe usar el branding de NASA. El equipo decidió mantenerlo: dejar escrita la decisión y confirmarla con la guía antes de enviar.
- [ ] **FS-24 · P2 · Video de ≤30 s** (alternativa o complemento del deck).
- [ ] **FS-25 · P0 · Ensayo del demo** con el guion de 7 pasos de `CLAUDE.md` (lote → prioridades → NASA → 3 rotaciones → por qué → qué no sabemos).

---

## 5. Orden sugerido

1. **Bloque 1 — Credibilidad (P0 técnicos):** FS-01, FS-02, FS-04, FS-13, FS-19.
2. **Bloque 2 — Profundidad NASA (P1):** FS-06, FS-07, FS-09, FS-10, FS-14. Si un dataset resulta doloroso, se descarta y se documenta; no se bloquea el resto.
3. **Bloque 3 — Entendible para el productor:** FS-16, FS-20 y lo P2 que alcance.
4. **Bloque 4 — Entrega:** FS-21, FS-22, FS-23, FS-25. Reservar tiempo para esto; verificar la hora límite en la página del reto.

---

## 6. Descartado a propósito

- **GRACE/GRACE-FO, ECOSTRESS, GEDI:** muy gruesos o sin serie larga para un lote; solo se mencionan en las slides como trabajo futuro.
- **Redes profundas y series temporales complejas:** con ~25 años efectivos no se justifican.
- **Predicción de humedad a 7 días:** requiere pronóstico meteorológico; está fuera del MVP.
- **Alertas, comunidad, chat con LLM, backend FastAPI y Docker:** pertenecen al Nivel 2 del documento funcional. Se explican como plan de implementación, no se construyen.

---

## 7. Equivalencia con los hitos anteriores

| Hito anterior | Estado | Dónde queda |
|---|---|---|
| V0.1 Gestión de lotes | ✅ | App actual |
| V0.2 Integración NASA | 🟡 | POWER hecho; resto en bloque B |
| V0.3 Análisis climático | 🟡 | FS-09 |
| V0.4 Modelo predictivo | 🟡 | Rendimiento por clima hecho; falta reproducirlo (FS-01); humedad a 7 días descartada |
| V0.5 Recomendaciones | ✅ | App actual |
| V0.6 Simulador de rotaciones | 🟡 | Hecho con 3 escenarios; FS-10 a FS-12 |
| V0.7 Alertas | ⛔ | Nivel 2, solo en slides |
| V1.0 Producto integrado | 🟡 | Bloques 3 y 4 |

---

## 8. Principios

1. Decisión transparente antes que ML; el modelo entra solo si le gana al baseline de tendencia.
2. Cada número lleva su procedencia: `observed`, `derived`, `modeled`, `assumed` o `unknown`.
3. Nada de ground truth inventado ni precisión de lote que el dato no tiene.
4. Mejor un caso bien fundamentado que un producto global sin respaldo.
5. Es apoyo a la decisión: el criterio del agricultor y del agrónomo local es el último.
