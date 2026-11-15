"""Baja clima diario de NASA POWER (comunidad AG) 1981-2024 en el centroide de cada departamento.
JSON crudo en data/raw/power/<depto_id>.json (caché: si existe no se vuelve a bajar). Sin login."""
import json, time, urllib.request
import pandas as pd
from common import RAW, PROC

PARAMS = "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M,WS2M,GWETROOT,GWETTOP"
# Dos tramos: 1981-2024 y 2025 (la campaña 2024/25 necesita ene-mar 2025). Se piden por separado para poder ampliar sin rebajar todo.
TRAMOS = [(1981, 2024, ""), (2025, 2025, "_2025")]

def bajar(lat, lon, ini, fin):
    url = ("https://power.larc.nasa.gov/api/temporal/daily/point?parameters=" + PARAMS +
           f"&community=AG&longitude={lon}&latitude={lat}&start={ini}0101&end={fin}1231&format=JSON")
    for intento in range(4):
        try:
            with urllib.request.urlopen(url, timeout=180) as r:
                return json.load(r)
        except Exception as e:
            print("  reintento", intento + 1, e); time.sleep(5 * (intento + 1))
    raise SystemExit("POWER no respondió para " + url)

def main():
    deps = pd.read_csv(PROC / "departamentos.csv", dtype={"depto_id": str})
    for i, r in deps.iterrows():
        for ini, fin, suf in TRAMOS:
            dest = RAW / "power" / f"{r.depto_id}{suf}.json"
            if dest.exists():
                continue
            print(f"[{i + 1}/{len(deps)}] {r.provincia}/{r.departamento} {ini}-{fin}", flush=True)
            dest.write_text(json.dumps(bajar(r.lat, r.lon, ini, fin)), encoding="utf-8")
            time.sleep(1)

if __name__ == "__main__":
    main()
