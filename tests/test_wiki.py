"""La wiki (wiki/) debe cumplir OKF v0.2: frontmatter YAML válido con `type` en cada concepto (§11)."""
import contextlib
import io
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

try:
    import okf_wiki
except ImportError:  # PyYAML no instalado
    okf_wiki = None


@unittest.skipIf(okf_wiki is None, "falta PyYAML (pip install pyyaml)")
class WikiOKF(unittest.TestCase):
    def test_bundle_conforme(self):
        salida = io.StringIO()
        with contextlib.redirect_stdout(salida):
            codigo = okf_wiki.verificar()
        self.assertEqual(codigo, 0, salida.getvalue())

    def test_index_raiz_declara_version(self):
        texto = (okf_wiki.WIKI / "index.md").read_text(encoding="utf-8")
        self.assertTrue(texto.startswith('---\nokf_version: "0.2"\n---'))


if __name__ == "__main__":
    unittest.main()
