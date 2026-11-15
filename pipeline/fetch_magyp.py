"""Baja de datos.magyp.gob.ar las series departamentales de siembra, cosecha, producción y rendimiento.
Guarda los CSV crudos en data/raw/magyp/ (sin modificar). Fuente: Estimaciones Agrícolas, MAGyP."""
import json, sys, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "magyp"
API = "https://datos.magyp.gob.ar/api/3/action/package_show?id="
# cultivo -> (id del dataset, fragmento del nombre del recurso departamental)
DATASETS = {
    "soja":    ("soja-siembra-cosecha-produccion-rendimiento", "Soja - serie"),
    "maiz":    ("maiz-siembra-cosecha-rendimiento-produccion", "serie siembra"),
    "trigo":   ("trigo-siembra-cosecha-produccion-rendimiento", "serie siembra"),
    "girasol": ("girasol-siembra-cosecha-produccion-rendimiento", "serie siembra"),
    "sorgo":   ("sorgo-siembra-cosecha-produccion-rendimiento", "serie siembra"),
    "cebada":  ("cebada-siembra-cosecha-produccion-rendimiento", "Cebada - serie"),
    "avena":   ("avena-siembra-cosecha-produccion-rendimiento", "serie siembra"),
}

def get(url):
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()

def main():
    RAW.mkdir(parents=True, exist_ok=True)
    meta = {}
    for cultivo, (pid, frag) in DATASETS.items():
        pkg = json.loads(get(API + pid))["result"]
        recs = [r for r in pkg["resources"] if r["format"].upper() == "CSV" and frag.lower() in r["name"].lower()
                and "tiempo" not in r["name"].lower()]
        if not recs:
            print("sin recurso para", cultivo, [r["name"] for r in pkg["resources"]]); continue
        r = recs[0]
        dest = RAW / f"{cultivo}.csv"
        dest.write_bytes(get(r["url"]))
        meta[cultivo] = {"dataset": pid, "recurso": r["name"], "url": r["url"], "bytes": dest.stat().st_size,
                         "modificado": r.get("last_modified")}
        print(cultivo, dest.stat().st_size, "bytes")
    (RAW / "_fuentes.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    # copia versionada (data/raw no se sube a git): deja registrada la procedencia de cada archivo
    (ROOT / "data" / "processed").mkdir(parents=True, exist_ok=True)
    (ROOT / "data" / "processed" / "magyp_fuentes.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")

if __name__ == "__main__":
    sys.exit(main())
