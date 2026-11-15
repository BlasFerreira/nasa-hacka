"""Rutas y constantes compartidas del pipeline de rendimiento (Field Shift)."""
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROC = ROOT / "data" / "processed"
for _d in (RAW / "magyp", RAW / "power", RAW / "georef", PROC):
    _d.mkdir(parents=True, exist_ok=True)

# Zonas del MVP (mismos ids que prototype/src/engine.js). Cada zona es un conjunto de departamentos
# (código INDEC). Los nombres difieren entre fuentes, así que se resuelve una sola vez por (provincia, nombre)
# contra MAGyP y de ahí en adelante se une siempre por depto_id.
ZONAS = {
    "pampa_humeda": {
        "Buenos Aires": ["Pergamino", "Colón", "Rojas", "Salto", "Arrecifes", "Capitán Sarmiento", "Baradero",
                          "San Pedro", "Ramallo", "San Nicolás", "Junín", "General Arenales", "Lincoln", "Chacabuco",
                          "Bragado", "Chivilcoy", "General Pinto", "Leandro N. Alem"],
        "Santa Fe": ["Villa Constitución", "Caseros", "Belgrano", "San Lorenzo", "Iriondo", "General López", "Rosario"],
        "Córdoba": ["Marcos Juárez", "Unión"],
    },
    "entre_rios": {
        "Entre Ríos": ["Paraná", "Diamante", "Nogoyá", "Victoria", "Tala", "Villaguay", "La Paz", "San Salvador"],
    },
}
CULTIVOS = ["soja", "maiz", "trigo", "girasol", "sorgo", "cebada", "avena"]
