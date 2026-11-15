"""Arma la tabla de features climáticos por ventana fenológica y la tabla de rendimientos.
Clave de unión: (depto_id, campana, cultivo). campana = año de siembra (campaña 2020/21 -> 2020).
Salidas: data/processed/climate_features.csv y yields.csv"""
import json, math
import numpy as np, pandas as pd
from common import RAW, PROC, CULTIVOS

# Ventanas críticas (mes, día) de inicio y fin; el fin puede caer en el año siguiente (+1).
# Maíz/girasol: floración y llenado; soja: llenado de grano; trigo/cebada/avena: espigazón y llenado.
# El maíz tardío corre su período crítico a febrero; la ventana ancha dic-15feb cubre ambos (supuesto documentado).
VENTANAS = {
    "maiz":    ((12, 1, 0), (2, 15, 1)),
    "girasol": ((12, 1, 0), (2, 15, 1)),
    "soja":    ((1, 1, 1),  (3, 15, 1)),
    "sorgo":   ((1, 1, 1),  (3, 15, 1)),
    "trigo":   ((9, 1, 0),  (11, 30, 0)),
    "cebada":  ((9, 1, 0),  (11, 30, 0)),
    "avena":   ((9, 1, 0),  (11, 30, 0)),
}
INVERNALES = {"trigo", "cebada", "avena"}
T_CALOR = {"maiz": 32, "girasol": 32, "soja": 32, "sorgo": 35, "trigo": 30, "cebada": 30, "avena": 30}
CAMP_MIN, CAMP_MAX = 1981, 2024   # POWER diario 1981-2025: la campaña 2024/25 (ene-mar 2025) es la última completa

def cargar_power(depto_id):
    partes = []
    for suf in ("", "_2025"):
        f = RAW / "power" / f"{depto_id}{suf}.json"
        if f.exists():
            partes.append(pd.DataFrame(json.loads(f.read_text(encoding="utf-8"))["properties"]["parameter"]))
    df = pd.concat(partes)
    df.index = pd.to_datetime(df.index, format="%Y%m%d")
    return df.where(df > -900)                     # -999 = sin dato en POWER: si no se filtra contamina las medias

def ra_mm_dia(lat, doy):
    """Radiación extrema (FAO-56) en mm/día equivalentes, para ET0 de Hargreaves-Samani."""
    phi = math.radians(lat)
    dr = 1 + 0.033 * np.cos(2 * math.pi * doy / 365)
    dec = 0.409 * np.sin(2 * math.pi * doy / 365 - 1.39)
    ws = np.arccos(np.clip(-math.tan(phi) * np.tan(dec), -1, 1))
    ra = 24 * 60 / math.pi * 0.0820 * dr * (ws * math.sin(phi) * np.sin(dec) + math.cos(phi) * np.cos(dec) * np.sin(ws))
    return ra * 0.408

def racha_seca_max(p):
    mx = cur = 0
    for v in (p.fillna(0) < 1).to_numpy():
        cur = cur + 1 if v else 0
        mx = max(mx, cur)
    return mx

def features_depto(dep, df):
    df = df.copy()
    doy = df.index.dayofyear.to_numpy()
    tmean = (df["T2M_MAX"] + df["T2M_MIN"]) / 2
    df["ET0"] = (0.0023 * (tmean + 17.8) * np.sqrt((df["T2M_MAX"] - df["T2M_MIN"]).clip(lower=0)) * ra_mm_dia(dep.lat, doy)).clip(lower=0)
    filas = []
    for cultivo in CULTIVOS:
        (m1, d1, o1), (m2, d2, o2) = VENTANAS[cultivo]
        for camp in range(CAMP_MIN, CAMP_MAX + 1):
            w = df.loc[pd.Timestamp(camp + o1, m1, d1): pd.Timestamp(camp + o2, m2, d2)]
            # humedad de suelo previa a la ventana: los 30 días anteriores (agua almacenada al llegar al período crítico)
            ini = pd.Timestamp(camp + o1, m1, d1)
            pre = df.loc[ini - pd.Timedelta(days=30): ini - pd.Timedelta(days=1)]
            if len(w) < 60:
                continue
            f = {"depto_id": dep.depto_id, "campana": camp, "cultivo": cultivo,
                 "p_sum": w["PRECTOTCORR"].sum(), "bal_hid": w["PRECTOTCORR"].sum() - w["ET0"].sum(),
                 "dias_calor": int((w["T2M_MAX"] > T_CALOR[cultivo]).sum()), "tmax_media": w["T2M_MAX"].mean(),
                 "racha_seca": racha_seca_max(w["PRECTOTCORR"]), "gwet_raiz": w["GWETROOT"].mean(),
                 "gwet_previa": pre["GWETROOT"].mean(), "rad_media": w["ALLSKY_SFC_SW_DWN"].mean(),
                 "dias_helada": int((w["T2M_MIN"] < 0).sum()) if cultivo in INVERNALES else 0}
            filas.append(f)
    return filas

def main():
    deps = pd.read_csv(PROC / "departamentos.csv", dtype={"depto_id": str})
    filas = []
    for dep in deps.itertuples():
        filas += features_depto(dep, cargar_power(dep.depto_id))
    feat = pd.DataFrame(filas)
    # Rendimientos oficiales: kg/ha sobre superficie cosechada y producción/superficie sembrada (más honesto en sequías)
    ys = []
    for c in CULTIVOS:
        d = pd.read_csv(RAW / "magyp" / f"{c}.csv", encoding="latin-1", dtype={"departamento_id": str})
        d = d[d.departamento_id.isin(deps.depto_id)].copy()
        d["cultivo"] = c
        ys.append(d.rename(columns={"departamento_id": "depto_id", "anio": "campana"}))
    y = pd.concat(ys)
    y["rend_cosechada"] = pd.to_numeric(y["rendimiento_kgxha"], errors="coerce") / 1000
    y["sup_sembrada"] = pd.to_numeric(y["superficie_sembrada_ha"], errors="coerce")
    y["sup_cosechada"] = pd.to_numeric(y["superficie_cosechada_ha"], errors="coerce")
    y["produccion_t"] = pd.to_numeric(y["produccion_tm"], errors="coerce")
    y["rend_sembrada"] = y["produccion_t"] / y["sup_sembrada"]
    y = y[(y.campana >= CAMP_MIN) & (y.campana <= CAMP_MAX) & (y.sup_cosechada > 0) & (y.rend_cosechada > 0)]
    y = y[["depto_id", "campana", "cultivo", "rend_cosechada", "rend_sembrada", "sup_sembrada", "sup_cosechada", "produccion_t"]]
    feat.to_csv(PROC / "climate_features.csv", index=False); y.to_csv(PROC / "yields.csv", index=False)
    # Control de unión: contar filas antes y después, sin pérdidas silenciosas
    m = y.merge(feat, on=["depto_id", "campana", "cultivo"], how="left", indicator=True)
    print("rendimientos:", len(y), "| features:", len(feat), "| rend. sin features:", int((m["_merge"] == "left_only").sum()))
    print(y.groupby("cultivo").agg(filas=("campana", "size"), desde=("campana", "min"), hasta=("campana", "max")).to_string())

if __name__ == "__main__":
    main()
