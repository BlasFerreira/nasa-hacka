"""Modelo de respuesta del rendimiento al clima, validado dejando un año afuera (LOYO).

Criterio del gate: docs/decisions.md (D1), escrito antes de ver los resultados.
Entradas: data/processed/{climate_features,yields,departamentos}.csv
Salidas:  data/processed/{model_results.json,oof_predictions.csv}
"""
import json
import warnings

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import RidgeCV
from sklearn.model_selection import GroupKFold

from common import CULTIVOS, PROC

warnings.filterwarnings("ignore")
FEATS = ["p_sum", "bal_hid", "dias_calor", "tmax_media", "racha_seca", "gwet_raiz", "gwet_previa"]
FEATS_INV = FEATS + ["dias_helada"]
INVERNALES = ("trigo", "cebada", "avena")
UMBRAL_HABILIDAD = 0.20      # D1: habilidad mínima a nivel zona-año
MIN_AÑOS_TENDENCIA = 12      # años mínimos por departamento para ajustar su tendencia
ALFAS = [1, 10, 30, 100, 300, 1000]
SEED = 42


def anomalias_fold(tr, te, feats):
    """Tendencia lineal por departamento y medias climáticas estimadas SOLO con los años de entrenamiento.
    Devuelve (X_train, y_train, X_test, te) con la anomalía relativa ya calculada."""
    coef = {d: np.polyfit(g.campana, g.y, 1) for d, g in tr.groupby("depto_id") if len(g) >= MIN_AÑOS_TENDENCIA}
    tr = tr[tr.depto_id.isin(coef)].copy()
    te = te[te.depto_id.isin(coef)].copy()
    if te.empty:
        return None
    for df in (tr, te):
        df["tend"] = [np.polyval(coef[d], c) for d, c in zip(df.depto_id, df.campana)]
        df["rel"] = df.y / df.tend - 1
    media = tr.groupby("depto_id")[feats].mean()
    desv = (tr[feats] - tr.groupby("depto_id")[feats].transform("mean")).std().replace(0, 1)
    xtr = ((tr[feats] - tr.groupby("depto_id")[feats].transform("mean")) / desv).to_numpy()
    xte = ((te[feats].to_numpy() - media.loc[te.depto_id].to_numpy()) / desv.to_numpy())
    return xtr, tr.rel.to_numpy(), tr.campana.to_numpy(), xte, te


def loyo(d, feats, modelo):
    """Para cada campaña t: se entrena sin t y se predice t (nunca k-fold aleatorio)."""
    salida = []
    for t in sorted(d.campana.unique()):
        fold = anomalias_fold(d[d.campana != t], d[d.campana == t], feats)
        if fold is None:
            continue
        xtr, ytr, gtr, xte, te = fold
        if modelo == "ridge":
            cortes = list(GroupKFold(n_splits=5).split(xtr, groups=gtr))
            m = RidgeCV(alphas=ALFAS, cv=cortes).fit(xtr, ytr)
        else:
            m = RandomForestRegressor(n_estimators=200, max_depth=4, min_samples_leaf=20, max_features=0.6,
                                      random_state=SEED, n_jobs=-1).fit(xtr, ytr)
        te = te.assign(pred=m.predict(xte))
        salida.append(te[["depto_id", "campana", "rel", "pred"]])
    return pd.concat(salida)


def habilidad(real, pred):
    """1 - SSE(modelo) / SSE(baseline de solo tendencia, que predice anomalía 0)."""
    sse0 = float(np.sum(np.square(real)))
    return 1 - float(np.sum(np.square(real - pred))) / sse0 if sse0 > 0 else float("nan")


def zona_año(oof, peso):
    g = oof.assign(w=oof.depto_id.map(peso))
    return g.groupby("campana").apply(lambda x: pd.Series({"rel": np.average(x.rel, weights=x.w),
                                                           "pred": np.average(x.pred, weights=x.w)}))


def evaluar(oof, peso):
    za = zona_año(oof, peso)
    años = sorted(za.index)
    resid = za.rel - za.pred
    sd = float(np.std(resid, ddof=1))
    metricas = {
        "habilidad_zona": habilidad(za.rel.to_numpy(), za.pred.to_numpy()),
        "habilidad_depto": habilidad(oof.rel.to_numpy(), oof.pred.to_numpy()),
        "bloques": [habilidad(za.loc[b].rel.to_numpy(), za.loc[b].pred.to_numpy()) for b in np.array_split(años, 3)],
        "resid_sd": sd, "n_años": len(años),
        "cobertura80": float(np.mean(np.abs(resid) <= 1.2816 * sd)),   # sobre residuos fuera de muestra
    }
    return metricas, za


def pasa_gate(m):
    return bool(m["habilidad_zona"] >= UMBRAL_HABILIDAD and all(b > 0 for b in m["bloques"]))


def coeficientes_ridge(d, feats):
    """Coeficientes estandarizados con todos los datos: solo para explicar, no para predecir."""
    coef = {x: np.polyfit(g.campana, g.y, 1) for x, g in d.groupby("depto_id") if len(g) >= MIN_AÑOS_TENDENCIA}
    d = d[d.depto_id.isin(coef)]
    dev = d[feats] - d.groupby("depto_id")[feats].transform("mean")
    x = (dev / dev.std().replace(0, 1)).to_numpy()
    y = d.y.to_numpy() / np.array([np.polyval(coef[a], c) for a, c in zip(d.depto_id, d.campana)]) - 1
    m = RidgeCV(alphas=ALFAS).fit(x, y)
    return {f: round(float(c), 4) for f, c in zip(feats, m.coef_)}


def main():
    deps = pd.read_csv(PROC / "departamentos.csv", dtype={"depto_id": str})
    zona_de = deps.set_index("depto_id").zona
    feat = pd.read_csv(PROC / "climate_features.csv", dtype={"depto_id": str})
    yl = pd.read_csv(PROC / "yields.csv", dtype={"depto_id": str})
    resultados, oof_filas = {}, []
    for zona in deps.zona.unique():
        resultados[zona] = {}
        for cultivo in CULTIVOS:
            d = yl[(yl.cultivo == cultivo) & (yl.depto_id.map(zona_de) == zona)].merge(
                feat[feat.cultivo == cultivo], on=["depto_id", "campana", "cultivo"])
            d = d.assign(y=d.rend_cosechada)
            feats = FEATS_INV if cultivo in INVERNALES else FEATS
            d = d.dropna(subset=["y"] + feats)
            if d.depto_id.nunique() < 3 or d.campana.nunique() < 20:
                print(zona, cultivo, "sin datos suficientes")
                continue
            peso = d.groupby("depto_id").sup_cosechada.mean()
            r = {"filas": int(len(d)), "deptos": int(d.depto_id.nunique()), "features": feats, "modelos": {}}
            za_por = {}
            for nombre in ("ridge", "rf"):
                oof = loyo(d, feats, nombre)
                met, za = evaluar(oof, peso)
                met["pasa_gate"] = pasa_gate(met)
                r["modelos"][nombre], za_por[nombre] = met, za
                oof_filas.append(oof.assign(zona=zona, cultivo=cultivo, modelo=nombre))
            # Elección: mayor habilidad entre los que pasan; si el ridge queda a menos de 0,02, se prefiere el más simple
            ok = [n for n in ("ridge", "rf") if r["modelos"][n]["pasa_gate"]]
            candidatos = ok or ["ridge", "rf"]
            elegido = max(candidatos, key=lambda n: r["modelos"][n]["habilidad_zona"])
            if "ridge" in candidatos and r["modelos"]["ridge"]["habilidad_zona"] >= r["modelos"][elegido]["habilidad_zona"] - 0.02:
                elegido = "ridge"
            r.update(elegido=elegido, pasa_gate=bool(ok), coef_ridge=coeficientes_ridge(d, feats),
                     anomalia_real={int(a): round(float(v), 3) for a, v in za_por[elegido].rel.items()},
                     anomalia_prevista={int(a): round(float(v), 3) for a, v in za_por[elegido].pred.items()} if ok else None)
            resultados[zona][cultivo] = r
            mm = r["modelos"][elegido]
            print(f"{zona:13s} {cultivo:8s} filas={r['filas']:5d} {elegido:5s} hab_zona={mm['habilidad_zona']:+.2f} "
                  f"depto={mm['habilidad_depto']:+.2f} bloques={[round(b, 2) for b in mm['bloques']]} "
                  f"gate={'SI' if r['pasa_gate'] else 'no'}", flush=True)
    (PROC / "model_results.json").write_text(json.dumps(resultados, indent=1, ensure_ascii=False), encoding="utf-8")
    pd.concat(oof_filas).to_csv(PROC / "oof_predictions.csv", index=False)


if __name__ == "__main__":
    main()
