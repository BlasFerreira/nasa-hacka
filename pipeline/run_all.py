"""Corre el pipeline completo de punta a punta (descarga -> features -> validación -> exportación al motor).

    python pipeline/run_all.py            # usa lo ya descargado (caché en data/raw)
    python pipeline/run_all.py --fresh    # vuelve a bajar MAGyP (POWER se reutiliza desde data/raw/power)

La validación (train_validate.py) tarda unos 8 minutos por los random forests de cada fold.
"""
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PASOS = ["fetch_magyp.py", "build_departamentos.py", "fetch_power.py", "build_features.py",
         "train_validate.py", "export_rend.py"]


def main():
    fresh = "--fresh" in sys.argv
    for paso in PASOS:
        if paso == "fetch_magyp.py" and not fresh and (AQUI.parent / "data" / "raw" / "magyp" / "maiz.csv").exists():
            print("== (salteo)", paso, "- ya descargado; usar --fresh para repetirlo")
            continue
        print("==", paso, flush=True)
        subprocess.run([sys.executable, str(AQUI / paso)], cwd=AQUI, check=True)
    print("Listo. Ahora: node prototype/src/build.js && node prototype/src/build_mundo.js")


if __name__ == "__main__":
    main()
