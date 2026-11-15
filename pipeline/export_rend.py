"""Exporta el resultado del modelo al formato que consume el motor de la app: prototype/src/rend_magyp.json.

Por zona y cultivo: rendimiento de referencia (MAGyP, media de las últimas 10 campañas), P10 relativo, resultado del gate y,
si el modelo pasó, la anomalía de rendimiento prevista por campaña (siempre fuera de muestra).
"""
import datetime
import json

import numpy as np
import pandas as pd

from common import PROC, ROOT

DESDE, HASTA = 2000, 2024
MIN_AÑOS = 10
ULTIMAS = 10   # el rendimiento de referencia es la media de las últimas 10 campañas (nivel tecnológico actual); n, desde y hasta describen la serie 2000-2024 usada para p10_rel


def serie_zona(y):
    """Rendimiento de la zona por campaña: producción total / superficie total (ponderado por área)."""
    g = y.groupby("campana").agg(prod=("produccion_t", "sum"), cosech=("sup_cosechada", "sum"), sembr=("sup_sembrada", "sum"))
    g = g[(g["cosech"] > 0) & (g["sembr"] > 0)]
    return g["prod"] / g["cosech"], g["prod"] / g["sembr"]


def main():
    deps = pd.read_csv(PROC / "departamentos.csv", dtype={"depto_id": str})
    zona_de = deps.set_index("depto_id").zona
    yl = pd.read_csv(PROC / "yields.csv", dtype={"depto_id": str})
    modelo = json.loads((PROC / "model_results.json").read_text(encoding="utf-8"))
    salida = {}
    for zona in deps.zona.unique():
        salida[zona] = {}
        for cultivo in sorted(yl.cultivo.unique()):
            y = yl[(yl.cultivo == cultivo) & (yl.depto_id.map(zona_de) == zona) & yl.campana.between(DESDE, HASTA)]
            if y.empty:
                continue
            cos, sem = serie_zona(y)
            if len(cos) < MIN_AÑOS:
                continue
            tend = np.polyval(np.polyfit(cos.index, cos.values, 1), cos.index)
            reg = {"t_ha": round(float(cos.iloc[-ULTIMAS:].mean()), 2), "t_ha_sembrada": round(float(sem.iloc[-ULTIMAS:].mean()), 2),
                   "p10_rel": round(float(np.percentile(cos.values / tend, 10)), 2),
                   "n": int(len(cos)), "desde": int(cos.index.min()), "hasta": int(cos.index.max())}
            m = modelo.get(zona, {}).get(cultivo)
            if m:
                e = m["modelos"][m["elegido"]]
                reg.update({"modelo": m["elegido"], "r2_loyo": round(e["habilidad_zona"], 2),
                            "r2_loyo_depto": round(e["habilidad_depto"], 2),
                            "r2_bloques": [round(b, 2) for b in e["bloques"]],
                            "pasa_gate": m["pasa_gate"], "resid_sd": round(e["resid_sd"], 3),
                            "cobertura80": round(e["cobertura80"], 2), "deptos": m["deptos"],
                            "features": m["features"], "coef": m["coef_ridge"]})
                if m["pasa_gate"]:
                    reg["anomalia_prevista"] = {str(k): v for k, v in m["anomalia_prevista"].items()}
            salida[zona][cultivo] = reg
    salida["_meta"] = {"generado": datetime.date.today().isoformat(),
                       "fuente": "MAGyP Estimaciones Agrícolas (rendimiento departamental) + NASA POWER diario",
                       "validacion": "leave-one-year-out, tendencia por departamento ajustada dentro de cada fold",
                       "criterio": "docs/decisions.md D1 (habilidad >= 0,20 y > 0 en 3 bloques)"}
    dest = ROOT / "prototype" / "src" / "rend_magyp.json"
    dest.write_text(json.dumps(salida, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("OK", dest, dest.stat().st_size, "bytes")
    for z, cs in salida.items():
        if z.startswith("_"):
            continue
        for c, r in cs.items():
            print(f"{z:13s} {c:8s} t_ha={r['t_ha']:5.2f} p10={r['p10_rel']:.2f} n={r['n']} gate={r.get('pasa_gate', '-')} r2={r.get('r2_loyo', '-')}")


if __name__ == "__main__":
    main()
