"""Pruebas del pipeline de rendimiento. Correr con:  python -m unittest discover -s tests -v

Cubren lo que más fácil se rompe sin avisar: fuga temporal, uniones que pierden filas, valores -999 de POWER,
la regla del gate y la coherencia del JSON que consume la app.
"""
import json
import sys
import unittest
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "pipeline"))

import train_validate as tv  # noqa: E402

PROC = ROOT / "data" / "processed"


def panel_sintetico(n_deptos=4, años=range(1990, 2020), outlier_en=None):
    filas = []
    rng = np.random.default_rng(0)
    for d in range(n_deptos):
        for a in años:
            y = 3 + 0.05 * (a - 1990) + d * 0.1 + rng.normal(0, 0.05)
            if outlier_en is not None and a == outlier_en:
                y = 100.0
            filas.append({"depto_id": f"d{d}", "campana": a, "y": y, "x1": rng.normal(), "x2": rng.normal()})
    return pd.DataFrame(filas)


class SinFugaTemporal(unittest.TestCase):
    def test_el_año_de_test_no_influye_en_la_tendencia_ni_en_el_entrenamiento(self):
        """Si el año retenido es un valor absurdo, lo entrenado no debe cambiar: la tendencia se ajusta sin ese año."""
        normal, roto = panel_sintetico(), panel_sintetico(outlier_en=2010)
        f1 = tv.anomalias_fold(normal[normal.campana != 2010], normal[normal.campana == 2010], ["x1", "x2"])
        f2 = tv.anomalias_fold(roto[roto.campana != 2010], roto[roto.campana == 2010], ["x1", "x2"])
        np.testing.assert_allclose(f1[0], f2[0])   # X de entrenamiento idéntico
        np.testing.assert_allclose(f1[1], f2[1])   # anomalías de entrenamiento idénticas
        self.assertNotIn(2010, set(f2[2]))          # el año retenido no está en el entrenamiento

    def test_cada_fold_deja_un_solo_año_afuera(self):
        d = panel_sintetico()
        oof = tv.loyo(d, ["x1", "x2"], "ridge")
        self.assertEqual(sorted(oof.campana.unique()), list(range(1990, 2020)))
        self.assertEqual(len(oof), len(d))


class ReglaDelGate(unittest.TestCase):
    def test_pasa_si_supera_el_umbral_y_es_estable(self):
        self.assertTrue(tv.pasa_gate({"habilidad_zona": 0.30, "bloques": [0.1, 0.2, 0.5]}))

    def test_no_pasa_si_un_bloque_es_negativo(self):
        self.assertFalse(tv.pasa_gate({"habilidad_zona": 0.30, "bloques": [-0.01, 0.4, 0.5]}))

    def test_no_pasa_si_no_llega_al_umbral(self):
        self.assertFalse(tv.pasa_gate({"habilidad_zona": 0.19, "bloques": [0.2, 0.2, 0.2]}))

    def test_habilidad_del_baseline_nulo_es_cero(self):
        real = np.array([0.1, -0.2, 0.05])
        self.assertAlmostEqual(tv.habilidad(real, np.zeros(3)), 0.0)
        self.assertAlmostEqual(tv.habilidad(real, real), 1.0)


@unittest.skipUnless((PROC / "yields.csv").exists(), "falta data/processed (correr el pipeline)")
class DatosProcesados(unittest.TestCase):
    def test_union_rendimientos_features_sin_perdidas(self):
        y = pd.read_csv(PROC / "yields.csv", dtype={"depto_id": str})
        f = pd.read_csv(PROC / "climate_features.csv", dtype={"depto_id": str})
        m = y.merge(f, on=["depto_id", "campana", "cultivo"], how="left", indicator=True)
        self.assertEqual(int((m["_merge"] == "left_only").sum()), 0)
        self.assertEqual(len(m), len(y))

    def test_clave_unica_y_codigos_indec(self):
        y = pd.read_csv(PROC / "yields.csv", dtype={"depto_id": str})
        self.assertFalse(y.duplicated(["depto_id", "campana", "cultivo"]).any())
        self.assertTrue(y.depto_id.str.fullmatch(r"\d{5}").all())

    def test_features_sin_centinelas_de_power(self):
        f = pd.read_csv(PROC / "climate_features.csv")
        num = f.drop(columns=["depto_id", "campana", "cultivo"])
        self.assertTrue((num.fillna(0) > -900).all().all(), "quedó un -999 de POWER sin filtrar")

    def test_sin_años_de_entrenamiento_posteriores_a_la_ultima_campaña(self):
        f = pd.read_csv(PROC / "climate_features.csv")
        self.assertLessEqual(int(f.campana.max()), 2024)


@unittest.skipUnless((ROOT / "prototype" / "src" / "rend_magyp.json").exists(), "falta rend_magyp.json")
class JsonDelMotor(unittest.TestCase):
    def setUp(self):
        self.j = json.loads((ROOT / "prototype" / "src" / "rend_magyp.json").read_text(encoding="utf-8"))

    def test_solo_hay_anomalias_si_paso_el_gate_y_cumple_el_criterio(self):
        n = 0
        for zona, cultivos in self.j.items():
            if zona.startswith("_"):
                continue
            for cultivo, r in cultivos.items():
                if "anomalia_prevista" in r:
                    n += 1
                    self.assertTrue(r["pasa_gate"], f"{zona}/{cultivo}")
                    self.assertGreaterEqual(r["r2_loyo"], tv.UMBRAL_HABILIDAD, f"{zona}/{cultivo}")
                    self.assertTrue(all(b > 0 for b in r["r2_bloques"]), f"{zona}/{cultivo}")
                elif r.get("pasa_gate") is True:
                    self.fail(f"{zona}/{cultivo} pasó el gate pero no tiene anomalías")
        self.assertGreater(n, 0)

    def test_valores_en_rangos_plausibles(self):
        for zona, cultivos in self.j.items():
            if zona.startswith("_"):
                continue
            for cultivo, r in cultivos.items():
                self.assertTrue(0.3 < r["t_ha"] < 15, f"{zona}/{cultivo} t_ha={r['t_ha']}")
                self.assertTrue(0.4 < r["p10_rel"] <= 1.05, f"{zona}/{cultivo} p10={r['p10_rel']}")


if __name__ == "__main__":
    unittest.main()
