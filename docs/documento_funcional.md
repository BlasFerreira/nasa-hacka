# Documento funcional detallado: Asistente de rotación y planificación de cultivos

> **Nombre:** provisorio, a definir por el equipo.
> **Contexto:** NASA Space Apps Challenge (desafío exacto por confirmar).
> **Propósito del documento:** base común para construir el MVP, la presentación (PPT) y el video.
> **Convención:** lo que surgió textualmente del brainstorming del equipo se marca como **[Equipo]**. Lo que es una propuesta de diseño para concretar la idea se marca como **[Propuesta]** y se puede cambiar. Los datos y fuentes externas se marcan **[A validar]**.

---

## Índice

1. Visión, problema y propuesta de valor
2. Usuarios y personas
3. Principios de diseño
4. Alcance por niveles
5. Casos de uso detallados
6. Requisitos funcionales
7. Modelo de dominio y datos
8. Motor de recomendación y scoring
9. Simulaciones y modo supervivencia
10. Chat con LLM
11. Privacidad, datos compartidos y comunidad
12. Módulo de normativa
13. Pantallas y flujos
14. Arquitectura técnica propuesta
15. Fuentes de datos y mapeo NASA
16. Requisitos no funcionales
17. Métricas de éxito y validación
18. Hoja de ruta por fases
19. Estrategia de entrega: demo, PPT y video
20. Riesgos y mitigaciones
21. Preguntas abiertas
22. Glosario

---

## 1. Visión, problema y propuesta de valor

### 1.1 Problema
Decidir qué sembrar, dónde y cuándo es una decisión de alto impacto económico y ambiental. Hoy el productor la toma con experiencia, intuición y datos dispersos. Los datos satelitales y climáticos existen pero son difíciles de usar, y suelen estar al alcance de grandes empresas. Además, la presión por maximizar la cosecha de este ciclo puede degradar el suelo y arruinar los ciclos siguientes.

### 1.2 Solución
Una plataforma que, para cada lote de cada campo del productor:

- filtra qué cultivos son viables;
- rankea las mejores opciones con un score que mezcla ingreso, salud del suelo y cumplimiento ambiental;
- permite planificar con fechas de siembra y cosecha;
- explica cada recomendación en lenguaje natural;
- aprende del historial y del conocimiento del propio productor;
- opcionalmente conecta con la comunidad de su zona, sin exponer datos privados.

### 1.3 Mensaje central **[Equipo]**
**Cuidar la tierra no es solo ecológico: también es rentable.** Si se agota el suelo, se sacan más resultados hoy pero a mediano plazo cae el rendimiento y deja de monetizar. Un suelo sano mejora calidad y producción, y eso aumenta el retorno de la inversión. El challenge pide explícitamente tener en cuenta el cuidado de la tierra entre ciclos, por lo que esto es **pilar central, no extra**.

### 1.4 Diferenciales
| # | Diferencial | Por qué importa |
|---|---|---|
| 1 | Score que une producción y salud del suelo | Alineado con el challenge y con la rentabilidad real a largo plazo |
| 2 | Privacidad por diseño con comunidad opt-in | Los productores vecinos son competencia: sin privacidad no hay adopción |
| 3 | Granularidad por lote y multitenant | Un productor grande tiene lotes muy distintos, a veces en provincias distintas |
| 4 | Conocimiento del productor como dato de primera clase | Datos propios entrenan mejor que datos genéricos de la nube |
| 5 | Chat explicativo y trazable | El productor hands-on entiende el porqué, sin que el LLM tome decisiones |
| 6 | Normativa ambiental actualizada con revisión humana | Cumplimiento y vanguardia eco-friendly |
| 7 | Proyección de ingresos a varios años | Convierte "cuidar la tierra" en un argumento económico |

### 1.5 Vocabulario para el pitch **[Equipo]**
"Democratizar" el acceso a datos satelitales y al conocimiento, comunidad agrícola, producción sustentable y rentable, competencia sana y productiva, soberanía del productor sobre sus datos.

---

## 2. Usuarios y personas

### 2.1 Productor con campo propio
- Conoce su suelo y su historial, pero no tiene herramientas para cruzarlo con datos satelitales.
- Quiere saber qué sembrar y cuándo, y no gastar de más en fertilizante.

### 2.2 Gran terrateniente
**[Equipo]** Ejemplo extremo planteado: "el terrateniente más grande de Entre Ríos". Tiene muchos lotes, a veces en distintas provincias, y necesita una vista centralizada de estado, riesgo y cosecha próxima.

### 2.3 Productor hands-on
Quiere entender. Usa el chat para preguntar "¿por qué me recomienda esto?" y explorar gráficos a medida.

### 2.4 Productor que no usa el chat
**[Equipo]** El chat es opcional: quien no tiene ganas de profundizar usa solo el dashboard y el top 5.

### 2.5 Miembro de comunidad zonal
Participa en un grupo de su zona (similar a los comités mensuales entre campos vecinos). Quiere comparar y aprender sin regalar su ventaja competitiva.

### 2.6 Administrador de comunidad
Aprueba afiliaciones al grupo y modera lo que se comparte.

---

## 3. Principios de diseño

1. **Privado por defecto, compartido por elección.**
2. **El conocimiento del productor manda.** Sus datos pesan más que los datasets públicos.
3. **Una recomendación sin explicación no sirve.** Todo score debe poder justificarse.
4. **El LLM explica, no decide.**
5. **Rentabilidad y sustentabilidad son una sola historia.**
6. **Granularidad por lote.** Nada se decide a nivel de campo entero si el lote cambia la respuesta.
7. **Las promesas técnicas se muestran con plan, el MVP se muestra funcionando.**

---

## 4. Alcance por niveles

### Nivel 1: MVP (se demuestra funcionando, aunque con datos simulados)
- Cuenta multitenant con campos y lotes.
- Carga de parámetros del lote por el productor.
- Filtro de aptitud con índice gradual.
- Score de performance de la rotación actual, relativo a alternativas.
- Top 5 de cultivos por lote con score, considerando fecha de siembra y ventana de cosecha.
- Cultivos de cobertura dentro del ranking.
- Explicación básica del score (aunque sea sin chat completo).

### Nivel 2: Promesa técnica (se explica en la PPT con plan de implementación)
- Historial propio del productor para entrenar con datos propios.
- Análisis de suelo por zona dentro del campo.
- Balance de nutrientes por lote.
- Alerta temprana.
- Simulaciones y comparación de estrategias, con modo supervivencia.
- Dashboard central de todos los lotes (Metabase).
- Chat con LLM con generación de gráficos.
- Proyección de ingresos a 5 o 10 años y ROI.
- Módulo de normativa con revisión humana.
- Comunidad por zona con muro y ranking opt-in.

### Nivel 3: Visión
- Mapa interactivo tipo Google Earth con zoom y clic por lote.
- Expansión a Perú, Brasil y otros climas.
- Aprendizaje por refuerzo para estrategias.

---

## 5. Casos de uso detallados

### CU-01: Saber qué sembrar hoy
- **Actor:** productor.
- **Disparador:** "Hoy es 14 de noviembre y tengo este lote: ¿qué siembro y en qué ventana?" **[Equipo]**
- **Flujo:**
  1. El productor elige un lote.
  2. El sistema toma la fecha actual, la humedad del suelo, la temperatura y el pronóstico.
  3. Aplica el filtro de aptitud.
  4. Calcula y muestra el top 5 con fecha óptima de siembra y cosecha estimada.
  5. Si conviene esperar, muestra una alerta con la ventana recomendada.
- **Resultado:** top 5 con score, fechas y alertas.
- **Nota:** es la escena de apertura de la demo y el video.

### CU-02: Planificar con fechas elegidas
- **Disparador:** "Estoy planificando sembrar en enero: ¿qué conviene?" **[Equipo]**
- **Flujo:**
  1. El productor ingresa la **fecha tentativa de siembra** y la **fecha tentativa de cosecha**, o acepta una ventana sugerida.
  2. El sistema recalcula el top 5 para esas fechas.
  3. El productor puede comparar dos fechas distintas para el mismo lote.
- **Regla:** el top 5 cambia con la fecha, porque lo que conviene hoy no es lo mismo que en enero.
- **Contexto de calendario** (dato de la charla, a validar con INTA): en Argentina la soja y el maíz de segunda suelen sembrarse a fin de año, y el trigo a mitad de año.

### CU-03: Evaluar la rotación actual
- **Flujo:** el sistema muestra estadísticas de la rotación vigente del lote, con un porcentaje de idoneidad o score de performance **relativo a las otras opciones**.
- **Resultado:** el productor ve si su rotación está entre las mejores o si hay alternativas claramente superiores.

### CU-04: Ver el estado de todos los lotes
- **Actor:** terrateniente o productor con varios campos.
- **Flujo:** dashboard centralizado con todos los lotes, filtrable por campo o provincia.
- **Muestra:** estado general, lotes de mayor riesgo a corto y mediano plazo, y lotes más próximos a cosecha.

### CU-05: Entender una recomendación
- **Disparador:** "¿Por qué me recomienda esto?"
- **Flujo:** el productor pregunta por escrito, el chat traduce la pregunta a una consulta sobre los datos del modelo y responde en lenguaje natural, citando de dónde sale cada número.

### CU-06: Probar dos estrategias parecidas
- **Disparador:** "Veo dos opciones parecidas, me juego a las dos y veo cuál sale." **[Equipo]**
- **Flujo:**
  1. El productor asigna cada estrategia a un lote distinto (o a sectores de un lote).
  2. El sistema registra la decisión y sus parámetros.
  3. Al ciclo siguiente compara resultados reales contra lo proyectado.

### CU-07: Evaluar resiliencia
- **Flujo:** el productor lanza una simulación de "supervivencia" sobre un lote (por ejemplo, repetir una sequía histórica de hace 10 años). El sistema devuelve un indicador de resiliencia.

### CU-08: Cargar historial y conocimiento propio
- **Flujo:** el productor sube historial de humedad, clima, rendimientos y notas sobre su campo. El modelo lo incorpora y se ajusta a ese lote.

### CU-09: Unirse a una comunidad zonal
- **Flujo:** el productor solicita afiliarse a un grupo de su zona, un administrador aprueba, y el productor elige qué nivel de datos comparte.

### CU-10: Mirar el dashboard de la zona
- **Flujo:** el productor ve datos agregados y anonimizados de su zona: qué cultivos rinden mejor, qué estrategias funcionan, qué riesgos se vienen.

### CU-11: Compartir una estrategia en el muro
- **Flujo:** el productor decide publicar su estrategia en el muro de su comunidad. Es opt-in y revocable.

### CU-12: Participar del ranking de estrategias
- **Flujo:** el productor se inscribe opcionalmente. El ranking premia a quien mejor acierta, medido con score de performance y de resiliencia, sin exponer datos privados.

---

## 6. Requisitos funcionales

### 6.1 Cuentas, campos y lotes
| ID | Requisito | Nivel |
|---|---|---|
| RF-01 | Registro e inicio de sesión de productores, con aislamiento total de datos entre cuentas | MVP |
| RF-02 | Un productor puede tener varios campos con ubicaciones distintas, incluso en distintas provincias | MVP (modelo), Nivel 2 (UI completa) |
| RF-03 | Cada campo se divide en lotes; cada lote es una instancia con su configuración y parámetros | MVP |
| RF-04 | Configuración del lote: ubicación, superficie, tipo de suelo, pH, drenaje, pendiente, riego | MVP |
| RF-05 | El productor puede editar parámetros y cargar conocimiento propio del lote | MVP |
| RF-06 | Los valores cargados por el productor tienen prioridad sobre los de datasets públicos | MVP |

### 6.2 Recomendación
| ID | Requisito | Nivel |
|---|---|---|
| RF-10 | Filtro de aptitud previo al ranking, con índice gradual por cultivo y lote | MVP |
| RF-11 | Score de performance de la rotación actual, relativo a alternativas | MVP |
| RF-12 | Top 5 por lote con score particular de cada cultivo | MVP |
| RF-13 | Ingreso de fecha de siembra y ventana de cosecha, o sugerencia automática | MVP |
| RF-14 | Cultivos de cobertura incluidos como opción del ranking | MVP |
| RF-15 | Explicación de cada score: factores que lo componen | MVP |
| RF-16 | Comparación de dos fechas o dos estrategias para el mismo lote | Nivel 2 |

### 6.3 Datos del productor
| ID | Requisito | Nivel |
|---|---|---|
| RF-20 | Carga de historial: humedad, clima, rendimientos y cultivos realizados | Nivel 2 |
| RF-21 | Trazabilidad de los cultivos realizados por lote | Nivel 2 |
| RF-22 | Carga y trazabilidad de la base de conocimiento del productor sobre su tierra | Nivel 2 |
| RF-23 | Entrenamiento o ajuste del modelo con datos propios | Nivel 2 |
| RF-24 | Análisis de suelo por sectores dentro del campo (por hectárea) | Nivel 2 |

### 6.4 Suelo y nutrientes
| ID | Requisito | Nivel |
|---|---|---|
| RF-30 | Balance de nutrientes por lote: extracción por cultivo, reposición por rotación y por fertilizante | Nivel 2 |
| RF-31 | Recomendación de reposición dirigida, sin fertilizar de más | Nivel 2 |
| RF-32 | Score de salud del suelo a lo largo de los ciclos | Nivel 2 |

### 6.5 Monitoreo
| ID | Requisito | Nivel |
|---|---|---|
| RF-40 | Dashboard central de todos los lotes | Nivel 2 |
| RF-41 | Identificación de lotes con más riesgo a corto y mediano plazo | Nivel 2 |
| RF-42 | Identificación de lotes más próximos a cosecha | Nivel 2 |
| RF-43 | Alerta temprana basada en evolución en el tiempo | Nivel 2 |

### 6.6 Simulación
| ID | Requisito | Nivel |
|---|---|---|
| RF-50 | Simulación de estrategias sobre un set de variables de un lote | Nivel 2 |
| RF-51 | Comparación de estrategias | Nivel 2 |
| RF-52 | Modo supervivencia con eventos extremos de la zona | Nivel 2 |
| RF-53 | Indicador de resiliencia por lote | Nivel 2 |
| RF-54 | Aprendizaje por refuerzo para optimizar estrategias | Nivel 3 |

### 6.7 Económico
| ID | Requisito | Nivel |
|---|---|---|
| RF-60 | Proyección de ingreso acumulado a 5 o 10 años | Nivel 2 |
| RF-61 | Comparación "exprimir el lote" contra "rotar con cuidado" | Nivel 2 |
| RF-62 | ROI a largo plazo como métrica destacada | Nivel 2 |

### 6.8 Chat
| ID | Requisito | Nivel |
|---|---|---|
| RF-70 | Chat que explica recomendaciones en lenguaje natural | Nivel 2 |
| RF-71 | Respuestas basadas solo en datos y modelo propios, con citas del origen de cada número | Nivel 2 |
| RF-72 | Generación de gráficos o dashboards desde preguntas escritas | Nivel 2 |
| RF-73 | El chat no toma decisiones ni ejecuta cambios | Nivel 2 |

### 6.9 Comunidad y privacidad
| ID | Requisito | Nivel |
|---|---|---|
| RF-80 | Niveles de privacidad por productor (nada, resultados generales, resultados y estrategia) | Nivel 2 |
| RF-81 | Comunidades por zona o tipo de cultivo, con afiliación por aprobación | Nivel 2 |
| RF-82 | Dashboard zonal con datos agregados y anonimizados | Nivel 2 |
| RF-83 | Muro opt-in de estrategias | Nivel 2 |
| RF-84 | Ranking opcional de estrategias | Nivel 2 |

### 6.10 Normativa
| ID | Requisito | Nivel |
|---|---|---|
| RF-90 | Revisión periódica de regulaciones ambientales | Nivel 2 |
| RF-91 | Revisión humana antes de modificar reglas o scores | Nivel 2 |
| RF-92 | Registro de qué norma cambió qué regla y cuándo | Nivel 2 |

### 6.11 Visión
| ID | Requisito | Nivel |
|---|---|---|
| RF-100 | Mapa interactivo con zoom y clic por lote | Nivel 3 |
| RF-101 | Soporte de otros climas y países con datos de entrenamiento propios | Nivel 3 |

---

## 7. Modelo de dominio y datos **[Propuesta]**

### 7.1 Entidades principales

**Productor (tenant)**
- id, nombre, email, configuración de privacidad por defecto.

**Campo**
- id, productor_id, nombre, provincia, ubicación (coordenadas o polígono).

**Lote**
- id, campo_id, nombre, superficie, polígono, parámetros de suelo (tipo, textura, pH, drenaje, pendiente), riego, estado actual, cultivo actual.
- Cada lote es una instancia con su propia configuración y su propio análisis.

**Zona de suelo (sector)**
- id, lote_id, polígono, tipo de suelo propio. Permite el análisis por hectárea.

**Cultivo (catálogo)**
- id, nombre, tipo (comercial o cobertura), leguminosa (sí o no), requisitos (rangos de temperatura, agua, pH, textura, drenaje), ciclo, nutrientes que extrae, nutrientes que repone.

**Ciclo (campaña)**
- id, lote_id, cultivo_id, fecha de siembra, fecha de cosecha (estimada y real), rendimiento real, insumos usados, notas.

**Historial**
- series de humedad, clima y rendimiento por lote cargadas por el productor.

**Conocimiento del productor**
- notas y datos cualitativos sobre el lote (por ejemplo, "este sector se anega"), con fecha y autor.

**Recomendación**
- id, lote_id, fecha de cálculo, fecha de siembra y cosecha usadas, lista de top 5 con score y desglose de factores, versión del modelo.

**Simulación**
- id, lote_id, escenario (por ejemplo sequía histórica), parámetros, resultados, indicador de resiliencia.

**Comunidad**
- id, nombre, zona, tipo de cultivo, administradores.

**Membresía**
- productor_id, comunidad_id, estado de aprobación, nivel de privacidad elegido.

**Publicación (muro)**
- id, productor_id, comunidad_id, estrategia, visibilidad, fecha.

**Regla normativa**
- id, norma de origen, descripción, parámetros afectados, estado de revisión (propuesta, revisada, vigente), revisor, fecha.

### 7.2 Reglas de datos
- Todo dato de un lote pertenece a un solo productor y no se expone a otros salvo vía agregación anonimizada con consentimiento.
- Un valor cargado por el productor se guarda con su origen para poder priorizarlo frente a uno de dataset público.
- Cada recomendación guarda la versión del modelo y de las reglas normativas con las que se calculó, para poder reproducirla.

---

## 8. Motor de recomendación y scoring

### 8.1 Pipeline por lote **[Propuesta]**

1. **Entrada**
   - Parámetros del lote, historial propio, conocimiento del productor.
   - Fecha de siembra y ventana de cosecha (elegidas o sugeridas).
   - Datos climáticos y de humedad (históricos y pronóstico).
2. **Filtro de aptitud**
   - Compara requisitos del cultivo contra parámetros del lote: temperatura, agua, pH, textura, drenaje, pendiente y época.
   - Devuelve un **índice de aptitud entre 0 y 1**:
     - dentro del rango óptimo: cerca de 1;
     - en el borde: el índice baja;
     - fuera de rango: se descarta.
   - Esto refleja la "flexibilidad que tiene la tierra a los distintos cultivos" **[Equipo]**.
3. **Score por cultivo**
   - Combina varios componentes (ver 8.2).
4. **Ranking**
   - Ordena y muestra el top 5, incluyendo cultivos de cobertura.
5. **Salida**
   - Score total, desglose por componente, fechas, alertas y texto explicativo.

### 8.2 Componentes del score **[Propuesta]**

| Componente | Qué mide | Ejemplo de dato |
|---|---|---|
| Aptitud | Qué tan bien encaja el cultivo con clima y suelo del lote | Índice de aptitud |
| Rendimiento esperado | Producción proyectada para la fecha elegida | Modelo con historial propio y datos satelitales |
| Ingreso proyectado | Ingreso esperado a la ventana de cosecha, y a 5 o 10 años | Precio y rendimiento |
| Salud del suelo | Efecto del cultivo sobre materia orgánica, estructura y erosión | Balance de nutrientes, cobertura |
| Balance de nutrientes | Qué extrae el cultivo y qué debe reponerse | Extracción por cultivo |
| Ahorro de fertilizante | Cuánta reposición se evita (fijación de nitrógeno, reciclaje de cobertura) | Cultivo anterior y cobertura |
| Riesgo | Sensibilidad a eventos extremos de la zona | Resultado de simulación |
| Cumplimiento | Adecuación a normativa ambiental vigente | Reglas normativas |

**Fórmula ilustrativa [Propuesta]:**

```
score = índice_aptitud × ( w1·ingreso + w2·salud_suelo + w3·ahorro_insumos + w4·resiliencia + w5·cumplimiento )
```

Los pesos `w` se calibran con datos y pueden ser ajustados por el productor dentro de límites. Los valores concretos están **por definir**.

### 8.3 Score de la rotación actual
- Se calcula con la misma lógica sobre el cultivo y la secuencia vigentes.
- Se expresa como **porcentaje de idoneidad** y como **posición relativa** frente al resto de opciones.

### 8.4 Cultivos de cobertura **[Equipo]**
- También llamados abonos verdes o cultivos de transición.
- Se siembran entre cultivos comerciales, crecen, y luego se cortan o incorporan para alimentar el suelo.
- Es un enfoque eco-friendly.
- Valor técnico:
  - toman nutrientes mientras crecen y los devuelven reciclados al descomponerse;
  - las leguminosas fijan nitrógeno del aire y suman nitrógeno nuevo;
  - protegen contra la erosión y suman materia orgánica.
- Límite técnico importante: **no crean minerales de la nada**. El fósforo y el potasio que salen con la cosecha igual hay que reponerlos. Por eso la rotación **reduce** el fertilizante pero **no lo elimina**.

### 8.5 Balance de nutrientes **[Equipo + Propuesta]**
- Cada cultivo extrae nutrientes distintos, por lo que rotar permite que lo gastado en un cultivo se recupere mientras se gastan otros.
- El sistema lleva, por lote:
  - nutrientes extraídos por la cosecha;
  - nutrientes repuestos por cobertura y leguminosas;
  - nutrientes a reponer con fertilizante;
  - el balance neto proyectado a varios ciclos.
- La recomendación es reponer lo justo, no fertilizar de más.

### 8.6 Proyección económica **[Equipo]**
- Gráfico de **ingreso acumulado a 5 o 10 años** comparando:
  - "exprimir el lote" (máximo rendimiento inmediato, degradando el suelo);
  - "rotar con cuidado de la tierra" (más cobertura, menos insumos, suelo sano).
- La curva por lote muestra el punto donde la rotación cuidadosa supera a la explotación intensiva.
- **ROI a largo plazo** como métrica estrella junto al score.

### 8.7 Alerta temprana **[Equipo]**
- Seguimiento periódico de la evolución de los indicadores de cada lote.
- Detecta tendencias adversas (por ejemplo, caída de humedad o de vegetación) y avisa **antes** de que el productor tenga que decidir cambiar de cultivo.

---

## 9. Simulaciones y modo supervivencia

### 9.1 Objetivo
Permitir al productor probar estrategias sobre un lote sin riesgo real, y medir cuánto aguanta ante eventos extremos.

### 9.2 Simulación de estrategias **[Equipo]**
- Sobre un set de variables de un lote determinado, el productor genera distintas simulaciones.
- Puede comparar estrategias entre sí para ese mismo set de datos.

### 9.3 Modo supervivencia **[Equipo]**
- Somete los cultivos a situaciones extremas:
  - una sequía histórica ocurrida hace 10 años;
  - una inundación;
  - otros eventos que se definan tras investigar.
- Los eventos se eligen **según los problemas típicos de cada zona**. Por ejemplo, una zona que se inunda mucho se prueba contra inundaciones, y otra con sequías recurrentes, contra sequías.
- Resultado: un **indicador de resiliencia** basado en las características del propio terreno.

### 9.4 Aprendizaje por refuerzo **[Equipo, a futuro]**
- Idea planteada: un modelo de reinforcement learning que aprenda estrategias óptimas dentro del simulador.
- Es un plus que demanda mucho tiempo. Se ubica en hoja de ruta y no en el MVP.

### 9.5 Alcance sugerido **[Propuesta]**
- Para la demo, una sola simulación simple (por ejemplo, una sequía histórica) como muestra del potencial.
- Qué opciones de simulación existen se debe investigar.

---

## 10. Chat con LLM

### 10.1 Rol **[Equipo]**
- Herramienta para dar contexto natural a quien quiere entender más.
- **Aconseja, no decide.**
- Todo se basa en los datos y el modelo propios del sistema.

### 10.2 Capacidades
1. Responder "¿por qué me recomienda esto?" con el desglose del score.
2. Traducir preguntas escritas a consultas sobre los datos y devolver **gráficos o dashboards en tiempo real**. Ejemplo planteado: preguntar cuál es el estudiante con mejor calificación y que genere el gráfico, aplicado acá a preguntas sobre lotes y cultivos.
3. Integrar el conocimiento propio del productor sobre su campo.

### 10.3 Reglas **[Propuesta]**
- Citar el origen de cada número o dato mostrado.
- Responder solo con información del modelo y del productor; si no hay dato, decirlo.
- No ejecutar acciones (no cambia lotes, ni fechas, ni configuraciones).
- Respetar la privacidad: nunca mostrar datos de otros productores salvo agregados anonimizados de su comunidad.

### 10.4 Relación con el dashboard
- Usa los mismos datos que el dashboard.
- Herramienta candidata para dashboards: **Metabase** (open source, embebible), que el equipo ya está usando.

---

## 11. Privacidad, datos compartidos y comunidad

### 11.1 Principio **[Equipo]**
Si un productor tiene un campo, no quiere que otro vea qué cultivo le conviene a él, porque suelen ser de la misma zona y competencia. Por eso lo privado es la base.

### 11.2 Niveles de privacidad **[Equipo + Propuesta]**

| Nivel | Qué se comparte | Qué no se comparte |
|---|---|---|
| 0. Nada | Nada | Todo |
| 1. Resultados generales | Resultados agregados y anonimizados | Estrategia y datos del lote |
| 2. Resultados y estrategia | Resultados y la estrategia usada | Datos crudos, ubicación exacta y identidad (salvo que decida mostrarla) |

- El productor elige el nivel, y puede decidir **qué datos sí comparte y cuáles no**: "ciertos datos sí tengo ganas de compartirlos, ciertos otros no".
- El nivel se puede cambiar y revocar.
- El modelo es **opt-in**.
- Pendiente de definir: **qué información se considera sensible y cuál no**.

### 11.3 Comunidades por zona **[Equipo]**
- Los productores se **afilian a un grupo por zona** (departamento, cuenca) o por tipo de cultivo.
- La afiliación es por invitación o con aprobación de un administrador.
- Inspiración real: un comité mensual donde los dueños de campos vecinos se juntan a comparar y compartir conocimiento, aunque compitan. Es una **competencia productiva**: compiten, pero se ayudan.

### 11.4 Dashboard zonal **[Equipo]**
- Vista general de la zona **sin información privada**.
- Muestra datos agregados: qué cultivos rinden mejor, qué estrategias funcionan, qué riesgos se vienen.
- Se puede expresar como "los campos de tu zona rindieron tanto con esta estrategia".

### 11.5 Muro de estrategias **[Equipo]**
- Feed opt-in donde cada productor puede publicar su estrategia ("voy a hacer esto").
- Espacio para aprender entre todos sin regalar la ventaja propia.

### 11.6 Ranking o premio **[Equipo]**
- Premio a quien mejor le pega a la estrategia.
- **Opcional** y opt-in.
- Medido con el score de performance y el de resiliencia.
- No expone datos privados.

### 11.7 Argumento para la presentación
La privacidad por diseño y el control fino de qué se comparte es un diferencial que casi nadie considera. Se presenta como un pilar: tecnología agrícola abierta a la comunidad, con **soberanía del productor sobre sus datos**.

---

## 12. Módulo de normativa **[Equipo]**

### 12.1 Objetivo
Mantener las recomendaciones en cumplimiento y a la vanguardia de las medidas eco-friendly, adaptándose cuando cambian las regulaciones.

### 12.2 Flujo cíclico **[Propuesta sobre la idea del equipo]**

1. **Recolección:** el sistema revisa periódicamente las regulaciones ambientales.
2. **Detección de cambios:** identifica normas nuevas o modificadas.
3. **Revisión humana:** una persona o experto valida la interpretación.
4. **Actualización:** recién entonces se ajustan reglas, scores y simulaciones.
5. **Aviso al productor:** se le informa que el modelo cambió y por qué.
6. **Registro:** se guarda qué norma cambió qué regla y cuándo.

### 12.3 Por qué con revisión humana
Para no cambiar scores por una mala lectura automática. Es un control de calidad y de responsabilidad.

---

## 13. Pantallas y flujos **[Propuesta]**

### 13.1 Mapa de pantallas

1. **Inicio de sesión y registro.**
2. **Mis campos:** lista de campos y acceso a lotes.
3. **Detalle de lote:**
   - parámetros y conocimiento del productor;
   - rotación actual con su score relativo;
   - selector de fecha de siembra y ventana de cosecha;
   - top 5 con scores y desglose;
   - alerta temprana.
4. **Dashboard central:** estado de todos los lotes, riesgos y próximas cosechas.
5. **Simulaciones:** crear escenario, ver resultado, comparar estrategias, indicador de resiliencia.
6. **Proyección económica:** curva de ingreso acumulado y ROI.
7. **Chat:** conversación con respuestas y gráficos.
8. **Carga de historial y conocimiento.**
9. **Comunidad:** dashboard zonal, muro, ranking.
10. **Privacidad:** control de qué se comparte.
11. **Mapa (visión):** vista tipo Google Earth.

### 13.2 Flujo principal de la demo

1. Entrar a "Mis campos" y elegir un campo con 2 o 3 lotes.
2. Abrir un lote y ver su rotación actual con score relativo.
3. Poner la fecha ("hoy es 14 de noviembre" o "siembro en enero").
4. Ver el top 5 con score y fecha de cosecha, incluyendo un cultivo de cobertura.
5. Abrir el chat y preguntar "¿por qué me recomienda esto?".
6. Mostrar la curva de ingreso acumulado: rotación cuidadosa contra explotación intensiva.

---

## 14. Arquitectura técnica propuesta **[Propuesta]**

### 14.1 Capas

1. **Ingesta de datos:** descarga y normalización de datos satelitales y públicos (NASA, INTA, FAO), y carga de datos del productor.
2. **Almacenamiento:** base transaccional multitenant (cuentas, campos, lotes, ciclos) y almacenamiento de series temporales y datos geoespaciales.
3. **Servicio de aptitud y scoring:** motor que aplica el filtro y calcula los scores.
4. **Servicio de simulación:** corre escenarios y calcula resiliencia.
5. **Servicio de normativa:** administra reglas y su flujo de revisión.
6. **API:** expone todo a la aplicación, con autenticación y aislamiento por tenant.
7. **Capa de LLM:** traduce preguntas a consultas sobre la API y los datos, y redacta respuestas con citas.
8. **Capa de visualización:** Metabase embebido para dashboards y gráficos.
9. **Frontend:** web con pantallas descritas arriba, mapa en nivel 3.

### 14.2 Decisiones clave
- **Multitenant desde el modelo de datos**, con aislamiento por productor.
- **Prioridad de datos del productor** sobre los públicos, con trazabilidad del origen.
- **Versionado** de modelo y reglas en cada recomendación.
- **El LLM nunca accede a datos de otros tenants** ni modifica datos.
- **Filtrado regional** de datos de entrenamiento, para poder extender a otros climas.

### 14.3 Qué se construye y qué se promete
- **Construido (MVP):** modelo de datos, filtro de aptitud, scoring, top 5 y un mockup o demo navegable.
- **Prometido con plan:** procesamiento de datos satelitales a escala, simulaciones, chat, normativa, comunidad.

---

## 15. Fuentes de datos y mapeo NASA **[A validar]**

Fuentes mencionadas durante la charla, a confirmar antes de ponerlas en la PPT:

| Necesidad | Fuente candidata | Para qué se usaría |
|---|---|---|
| Requisitos de cultivos | EcoCrop (FAO) | Rangos para el filtro de aptitud |
| Clima, temperatura, radiación, precipitación | NASA POWER | Aptitud, rendimiento esperado, simulaciones |
| Humedad del suelo | NASA SMAP | Fecha de siembra, alerta temprana, sequías |
| Vegetación y estado del cultivo | MODIS o Landsat | Seguimiento de evolución y alerta temprana |
| Suelo | SoilGrids y mapas de suelo del INTA | Valores por defecto de suelo |
| Calendarios de siembra y cosecha | INTA | Ventanas sugeridas por zona |
| Historial del productor | Carga manual | Entrenamiento con datos propios |
| Normativa | Fuentes oficiales por definir | Módulo de normativa |

**Mapeo sugerido de datos a scores [Propuesta]:**
- Aptitud: EcoCrop, NASA POWER, SoilGrids o INTA, y datos del productor.
- Rendimiento esperado: NASA POWER, SMAP, MODIS o Landsat, e historial propio.
- Alerta temprana: SMAP y MODIS o Landsat.
- Resiliencia: series históricas de NASA POWER y SMAP para reproducir eventos extremos.

**Nota para otros países:** cada región requiere su propio periodo de entrenamiento y parametrizaciones. No se puede predecir un campo de una región con datos de otra con clima distinto.

---

## 16. Requisitos no funcionales **[Propuesta]**

| Categoría | Requisito |
|---|---|
| Privacidad y seguridad | Aislamiento por tenant, cifrado en tránsito y en reposo, consentimiento explícito para compartir |
| Trazabilidad | Cada recomendación guarda versión de modelo, reglas y datos usados |
| Explicabilidad | Todo score debe poder desglosarse en sus componentes |
| Escalabilidad | Soportar un productor con muchos lotes y múltiples provincias |
| Disponibilidad de datos | Funcionar con datos del productor aunque falle una fuente pública |
| Usabilidad | Interfaz simple para productores con poca experiencia digital |
| Extensibilidad | Poder agregar cultivos, regiones y reglas sin reescribir el motor |
| Calidad de respuestas del chat | Sin invención de datos: si no hay dato, lo dice |

---

## 17. Métricas de éxito y validación **[Propuesta]**

### 17.1 Del producto
- Precisión de la aptitud contra lo que realmente se cultiva en cada zona.
- Diferencia entre rendimiento proyectado y real por lote, cuando exista historial.
- Porcentaje de recomendaciones que el productor acepta o adapta.
- Ahorro estimado de fertilizante.
- Evolución de indicadores de salud del suelo entre ciclos.

### 17.2 Del uso
- Productores activos y lotes cargados.
- Uso del chat y del dashboard.
- Adopción de la comunidad y nivel de privacidad elegido.

### 17.3 Cómo validar el score
- Contrastar con rendimientos históricos de la zona y con el historial propio del productor.
- Comparar las recomendaciones con prácticas locales (por ejemplo, calendarios del INTA).
- A largo plazo, el modo de "dos estrategias en dos lotes" genera datos reales para comparar al año siguiente. **[Equipo]**

---

## 18. Hoja de ruta por fases **[Propuesta]**

### Fase 0: Definición (previa a la entrega)
- Confirmar el desafío del challenge y los datos NASA a usar.
- Definir fórmula inicial del score y datos sensibles.
- Elegir nombre.

### Fase 1: MVP / demo
- Cuentas multitenant, campos y lotes.
- Parámetros del lote.
- Filtro de aptitud y top 5 con score.
- Fecha de siembra y cosecha.
- Cultivos de cobertura en el ranking.
- Demo navegable con datos simulados.

### Fase 2: Datos propios y suelo
- Carga de historial y conocimiento del productor.
- Análisis de suelo por sector.
- Balance de nutrientes.
- Proyección de ingresos y ROI.

### Fase 3: Monitoreo y asistente
- Dashboard central con Metabase.
- Alerta temprana.
- Chat con LLM y generación de gráficos.

### Fase 4: Simulación y normativa
- Simulaciones y comparación de estrategias.
- Modo supervivencia e indicador de resiliencia.
- Módulo de normativa con revisión humana.

### Fase 5: Comunidad
- Grupos por zona, dashboard zonal, muro y ranking opt-in.
- Controles finos de privacidad.

### Fase 6: Visión
- Mapa tipo Google Earth.
- Expansión a Perú, Brasil y otros climas.
- Aprendizaje por refuerzo.

---

## 19. Estrategia de entrega: demo, PPT y video

### 19.1 Enfoque acordado **[Equipo]**
- Enfocarse mucho en una **buena PPT con buena información**, especificando toda la parte técnica.
- Presentar lo técnico como **la mejor promesa posible**, con un **plan de implementación**.
- Implementar solo lo necesario y dejar el procesamiento de datos y lo demás como promesa.
- Se recomienda sumar una **demo mínima o mockup navegable** de 2 o 3 pantallas, porque los jurados valoran ver algo funcionando.

### 19.2 Estructura sugerida de la PPT **[Propuesta]**

1. **Portada:** nombre, frase de valor y "democratizar".
2. **Problema:** el productor decide con datos dispersos y presión por rendir hoy.
3. **Alineación con el challenge:** con la redacción del desafío, destacando cuidado de la tierra entre ciclos.
4. **Solución:** visión en una sola imagen.
5. **Caso de uso de apertura:** "hoy es 14 de noviembre".
6. **Cómo funciona:** filtro de aptitud, score, top 5.
7. **Score que une rentabilidad y salud del suelo.**
8. **Curva de ingreso acumulado:** explotar contra rotar con cuidado.
9. **Cultivos de cobertura y balance de nutrientes.**
10. **Datos NASA y públicos:** qué dato alimenta qué score.
11. **Datos del productor:** historial y conocimiento propio.
12. **Chat explicativo y dashboard.**
13. **Simulaciones y modo supervivencia.**
14. **Privacidad y comunidad:** soberanía de datos, opt-in, dashboard zonal.
15. **Normativa y cumplimiento.**
16. **Arquitectura técnica.**
17. **Plan de implementación por fases.**
18. **Visión:** mapa, otros países.
19. **Impacto y cierre.**

### 19.3 Guion de demo **[Propuesta]**
1. Abrir el campo con 2 o 3 lotes.
2. Elegir un lote y mostrar la rotación actual con su score relativo.
3. Poner la fecha y mostrar el top 5.
4. Señalar un cultivo de cobertura y su efecto en el score.
5. Preguntar al chat por qué se recomienda un cultivo.
6. Mostrar la curva de ingreso acumulado.
7. Cerrar mencionando el control de privacidad y la comunidad.

### 19.4 Video
- Abrir con el caso "hoy es 14 de noviembre".
- Mostrar el problema, luego el flujo de la demo, y cerrar con el mensaje: *cuidar la tierra es rentable*.

---

## 20. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Demasiadas ideas, alcance inflado | No se llega a nada demostrable | Mantener los tres niveles y un solo flujo de punta a punta en la demo |
| Score poco creíble | Pérdida de confianza del jurado y del productor | Documentar el origen de cada componente y validar con datos reales |
| Falta de datos reales para validar | No se puede medir si la recomendación funciona | Usar series históricas públicas y datos del productor; planificar validación al ciclo siguiente |
| El LLM inventa datos | Recomendaciones engañosas | Limitarlo a datos del modelo, exigir citas, permitir "no hay dato" |
| Mala interpretación de normativa | Cambios erróneos en scores | Revisión humana obligatoria |
| Fuga de datos entre productores | Pérdida de confianza y daño competitivo | Privado por defecto, anonimización, agregación mínima |
| Aprendizaje por refuerzo consume el tiempo | Se pierde foco | Dejarlo en hoja de ruta |
| Datos de una región usados en otra | Predicciones incorrectas | Filtrado regional y entrenamiento propio por clima |
| Dependencia de fuentes externas | Caídas o cambios de formato | Priorizar datos del productor y guardar copias normalizadas |

---

## 21. Preguntas abiertas

1. ¿Qué desafío exacto del NASA Space Apps Challenge eligieron y qué datos NASA alimentan cada score?
2. ¿Cuál es la fórmula inicial del score y cómo se calibran los pesos?
3. ¿Cómo se mide que una recomendación funcionó?
4. ¿De dónde sacan datos reales para validar?
5. ¿Qué información se considera sensible y cuál no?
6. ¿Qué niveles de privacidad ofrecen finalmente?
7. ¿Qué cultivos y qué regiones cubre la primera versión?
8. ¿Qué eventos extremos entran en el modo supervivencia inicial?
9. ¿Qué normativa se toma como base y quién la revisa?
10. ¿Cuánto tiempo hay hasta la entrega y qué entra en la demo?
11. ¿Cómo se define y se mantiene un "ranking de estrategias" justo?
12. ¿Qué nombre definitivo tiene el proyecto?

---

## 22. Glosario

- **Abono verde / cultivo de cobertura / cultivo de transición:** cultivo que se siembra entre cultivos comerciales para proteger y enriquecer el suelo y luego se corta o incorpora.
- **Aptitud (índice de):** medida gradual de qué tan bien se adapta un cultivo a un lote.
- **Balance de nutrientes:** diferencia entre lo que extrae la cosecha y lo que se repone.
- **Lote:** subdivisión de un campo, con parámetros y análisis propios.
- **Multitenant:** varios usuarios comparten la plataforma con datos aislados.
- **Opt-in:** el usuario debe elegir activamente participar o compartir.
- **Resiliencia (indicador de):** medida de cuánto aguanta un lote ante un evento extremo.
- **ROI:** retorno de la inversión.
- **MVP:** producto mínimo viable.
- **Modo supervivencia:** simulación que somete un lote a eventos extremos propios de su zona.
- **NASA POWER:** datos de clima y radiación de la NASA.
- **SMAP:** misión de la NASA que mide humedad del suelo.
- **MODIS / Landsat:** sensores satelitales de vegetación y superficie.
- **SoilGrids:** mapas globales de propiedades del suelo.
- **EcoCrop:** base de la FAO con requisitos ecológicos de cultivos.
- **INTA:** Instituto Nacional de Tecnología Agropecuaria (Argentina).
- **Metabase:** herramienta open source de dashboards.
