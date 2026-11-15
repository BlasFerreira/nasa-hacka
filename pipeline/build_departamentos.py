"""Resuelve las zonas a códigos INDEC (desde MAGyP) y baja los centroides desde la API Georef (datos.gob.ar)."""
import json, urllib.request
import pandas as pd
from common import RAW, PROC, ZONAS

def main():
    mz = pd.read_csv(RAW / "magyp" / "maiz.csv", encoding="latin-1", dtype=str)
    ref = mz[["provincia", "departamento", "departamento_id"]].drop_duplicates()
    filas = []
    for zona, provs in ZONAS.items():
        for prov, nombres in provs.items():
            for nom in nombres:
                m = ref[(ref.provincia == prov) & (ref.departamento == nom)]
                if len(m) != 1:
                    raise SystemExit(f"No se pudo resolver {prov}/{nom}: {len(m)} coincidencias")
                did = m.departamento_id.iloc[0]
                url = f"https://apis.datos.gob.ar/georef/api/departamentos?id={did}&campos=id,nombre,centroide&max=1"
                with urllib.request.urlopen(url, timeout=60) as r:
                    j = json.load(r)
                (RAW / "georef" / f"{did}.json").write_text(json.dumps(j, ensure_ascii=False), encoding="utf-8")
                c = j["departamentos"][0]["centroide"]
                filas.append({"depto_id": did, "provincia": prov, "departamento": nom, "zona": zona,
                              "lat": round(c["lat"], 4), "lon": round(c["lon"], 4)})
    df = pd.DataFrame(filas)
    df.to_csv(PROC / "departamentos.csv", index=False, encoding="utf-8")
    print(df.groupby("zona").size().to_string()); print(df.head(3).to_string())

if __name__ == "__main__":
    main()
