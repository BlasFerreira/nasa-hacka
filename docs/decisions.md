# Decisiones del proyecto

Registro corto de decisiones técnicas. Cada una se escribe **antes** de ver los resultados que podrían influir en ella.

---

## D1 · Criterio del gate de ML para el modelo de rendimiento (2026-11-14)

**Pregunta:** ¿un modelo con clima le gana al baseline de solo tendencia, validado dejando un año afuera?

**Alcance:** Argentina. Zonas `pampa_humeda` (27 departamentos de Buenos Aires, Santa Fe y Córdoba) y `entre_rios` (8 departamentos). Cultivos: soja, maíz, trigo, girasol, sorgo, cebada y avena. Campañas 1981–2024 (clima de NASA POWER diario).

**Target:** anomalía relativa del rendimiento, `y / tendencia − 1`. La tendencia lineal por departamento y cultivo se ajusta **solo con los años de entrenamiento de cada fold**.

**Baseline:** solo tendencia (anomalía prevista = 0).

**Validación:** *leave-one-year-out* agrupado por campaña. Está prohibido el k-fold aleatorio.

**Métrica:** habilidad = `1 − SSE_modelo / SSE_baseline`, medida sobre la anomalía **promedio de la zona** en cada año (que es lo que consume la app) y, aparte, a nivel de departamento.

**Un cultivo en una zona pasa el gate si cumple las dos condiciones:**
1. Habilidad a nivel zona-año ≥ **0,20**.
2. Habilidad > 0 en cada uno de **3 bloques consecutivos** de campañas (estabilidad en el tiempo).

Si no pasa, ese cultivo **no usa modelo**: el motor sigue con el índice de aptitud climática y lo marca como tal.

**Nota:** el umbral de 0,20 es un criterio del equipo, no un estándar. Se fija acá para no ajustarlo a posteriori.

**Escalera de modelos (se sube solo si el escalón anterior no alcanza):** tendencia → ridge con pocos features agronómicos → random forest conservador. El modelo que se publica es el de mejor habilidad entre los que pasan; ante un empate, el más simple.

---

## D2 · Ventanas fenológicas y supuestos (2026-11-14)

- Las ventanas son **supuestos agronómicos** (siembra y floración típicas de la Zona Núcleo), no mediciones. Están en `pipeline/build_features.py`.
- **Maíz temprano y tardío:** MAGyP no los separa. Se usa una ventana ancha (1-dic a 15-feb) que cubre ambos.
- **Soja 1ra y 2da:** el modelo usa la serie de soja total.
- El clima se toma en el **centroide del departamento**, así que describe el departamento, no un lote.
