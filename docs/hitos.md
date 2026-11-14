# TerraFutures — Roadmap de Desarrollo

## Objetivo

Desarrollar una plataforma de apoyo a decisiones agrícolas utilizando datos satelitales de NASA, modelos predictivos y simulaciones para mejorar la resiliencia de los cultivos frente al cambio climático.

El desarrollo se divide en **8 hitos incrementales**, cada uno con funcionalidades concretas y criterios de aceptación.

---

## V0.1 — Gestión de lotes

**Objetivo:** Tener una aplicación funcional donde el productor pueda gestionar sus terrenos.

### Funcionalidades
- [ ] Visualizar un mapa interactivo.
- [ ] Seleccionar una ubicación geográfica.
- [ ] Crear, editar y eliminar lotes.
- [ ] Registrar características del terreno.
- [ ] Registrar tipo de suelo.
- [ ] Registrar cultivo actual.
- [ ] Visualizar el detalle de cada lote.

### Criterio de aceptación
El usuario puede crear un lote, visualizarlo en el mapa y consultar su información.

---

## V0.2 — Integración con NASA

**Objetivo:** Obtener información climática real para cada lote.

### Funcionalidades
- [ ] Integrar NASA POWER API.
- [ ] Obtener temperaturas históricas.
- [ ] Obtener precipitaciones históricas.
- [ ] Obtener radiación solar.
- [ ] Asociar datos climáticos a cada lote.
- [ ] Implementar caché de datos.
- [ ] Visualizar gráficos históricos.

### Criterio de aceptación
Al seleccionar un lote, el usuario puede consultar sus condiciones climáticas históricas utilizando datos reales de NASA.

---

## V0.3 — Análisis climático

**Objetivo:** Transformar los datos obtenidos en indicadores útiles.

### Funcionalidades
- [ ] Calcular indicadores de sequía.
- [ ] Calcular indicadores de estrés térmico.
- [ ] Detectar anomalías de precipitación.
- [ ] Analizar tendencias climáticas.
- [ ] Generar indicadores de riesgo.
- [ ] Visualizar riesgos mediante gráficos.
- [ ] Explicar el significado de cada indicador.

### Criterio de aceptación
El usuario puede identificar los principales riesgos climáticos de su lote y comprender qué variables los generan.

---

## V0.4 — Modelo predictivo con Machine Learning

**Objetivo:** Incorporar un modelo real para predecir condiciones futuras.

### Funcionalidades
- [ ] Construir un dataset de entrenamiento.
- [ ] Integrar datos históricos de NASA.
- [ ] Incorporar observaciones de humedad del suelo.
- [ ] Implementar ingeniería de características.
- [ ] Entrenar un modelo predictivo con LightGBM.
- [ ] Predecir humedad del suelo a 7 días.
- [ ] Validar el modelo con períodos históricos no utilizados durante el entrenamiento.
- [ ] Evaluar métricas de error.
- [ ] Crear endpoint de predicción.
- [ ] Mostrar predicciones en la interfaz.
- [ ] Visualizar incertidumbre.

### Criterio de aceptación
El sistema genera predicciones reproducibles de humedad del suelo con métricas de validación documentadas.

**Nota:** las predicciones a futuro requieren información meteorológica prevista o escenarios climáticos explícitos, además de los datos históricos NASA.

---

## V0.5 — Sistema de recomendaciones agrícolas

**Objetivo:** Recomendar cultivos según las condiciones y prioridades del productor.

### Funcionalidades
- [ ] Crear catálogo de cultivos.
- [ ] Registrar requerimientos hídricos.
- [ ] Registrar tolerancia al estrés climático.
- [ ] Incorporar compatibilidad con tipos de suelo.
- [ ] Implementar reglas agronómicas.
- [ ] Integrar resultados del modelo predictivo.
- [ ] Generar ranking de cultivos.
- [ ] Permitir definir prioridades del productor.
- [ ] Explicar las recomendaciones.
- [ ] Mostrar ventajas, riesgos y limitaciones.

### Criterio de aceptación
El usuario puede comparar al menos tres cultivos y entender por qué el sistema recomienda cada alternativa.

---

## V0.6 — Simulador de rotaciones y escenarios

**Objetivo:** Permitir comparar decisiones agrícolas frente a distintos escenarios climáticos.

### Funcionalidades
- [ ] Crear estrategias de rotación de cultivos.
- [ ] Configurar secuencias de varias campañas.
- [ ] Definir escenarios climáticos.
- [ ] Simular condiciones históricas de sequía.
- [ ] Simular condiciones climáticas habituales.
- [ ] Comparar exposición al estrés hídrico.
- [ ] Evaluar indicadores de resiliencia.
- [ ] Comparar dos o más estrategias.
- [ ] Mostrar resultados mediante gráficos.
- [ ] Explicar diferencias entre escenarios.
- [ ] Visualizar incertidumbre y supuestos.

### Criterio de aceptación
El usuario puede configurar dos rotaciones, someterlas al mismo escenario climático y comparar sus resultados.

**Importante:** el simulador debe incorporar reglas o modelos agronómicos que representen las diferencias entre cultivos. Un modelo climático por sí solo no puede estimar los efectos de cambiar una rotación.

---

## V0.7 — Sistema de alertas tempranas

**Objetivo:** Anticipar riesgos que puedan afectar los cultivos.

### Funcionalidades
- [ ] Definir umbrales de riesgo.
- [ ] Detectar condiciones de estrés hídrico.
- [ ] Detectar riesgos por temperatura extrema.
- [ ] Generar alertas por lote.
- [ ] Clasificar alertas según su severidad.
- [ ] Mostrar fecha y horizonte de predicción.
- [ ] Explicar las causas de cada alerta.
- [ ] Recomendar acciones de monitoreo.
- [ ] Mostrar alertas en el dashboard.
- [ ] Registrar historial de alertas.

### Criterio de aceptación
El sistema identifica condiciones de riesgo y genera alertas explicables basadas en datos y predicciones.

Las notificaciones externas quedan fuera del alcance inicial.

---

## V1.0 — Producto integrado

**Objetivo:** Unificar las funcionalidades en una experiencia completa.

### Funcionalidades
- [ ] Integrar los módulos en un único flujo.
- [ ] Mejorar la experiencia de navegación.
- [ ] Optimizar visualizaciones y mapas.
- [ ] Implementar estados de carga y manejo de errores.
- [ ] Mostrar fuentes y fechas de los datos.
- [ ] Documentar limitaciones del modelo.
- [ ] Preparar escenarios de demostración.
- [ ] Implementar pruebas end-to-end.
- [ ] Optimizar rendimiento.
- [ ] Publicar la aplicación.

### Criterio de aceptación
El usuario puede completar el siguiente recorrido:

1. Seleccionar un lote.
2. Consultar información climática de NASA.
3. Analizar riesgos.
4. Obtener predicciones.
5. Recibir recomendaciones agrícolas.
6. Comparar rotaciones.
7. Simular escenarios climáticos.
8. Consultar alertas tempranas.

---

## Priorización para el hackathon

| Versión | Funcionalidad | Prioridad |
|---|---|---|
| V0.1 | Gestión de lotes | Crítica |
| V0.2 | Integración NASA | Crítica |
| V0.3 | Análisis climático | Alta |
| V0.4 | Modelo predictivo | Alta |
| V0.5 | Recomendaciones | Crítica |
| V0.6 | Simulador de rotaciones | Crítica |
| V0.7 | Alertas tempranas | Media |
| V1.0 | Producto integrado | Alta |

### Objetivo recomendado: V0.6

El entregable principal del hackathon debe permitir:

**Seleccionar un lote → analizar datos NASA → obtener recomendaciones → comparar rotaciones → simular riesgos climáticos.**

El modelo predictivo debe desarrollarse con un baseline verificable. Si no alcanza una calidad aceptable, el sistema debe poder utilizar indicadores históricos y reglas agronómicas explícitas sin presentar estimaciones no validadas como predicciones confiables.

### Principios de desarrollo

1. Cada versión debe ser funcional de manera independiente.
2. Priorizar funcionalidades demostrables sobre infraestructura compleja.
3. Utilizar datos reales NASA desde las primeras versiones.
4. Separar predicciones de recomendaciones agronómicas.
5. Documentar supuestos e incertidumbre.
6. Priorizar la comparación de rotaciones como diferencial principal del producto.
7. Evitar funcionalidades empresariales innecesarias para el MVP.
