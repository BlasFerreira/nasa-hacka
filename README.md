# Field Shift: Adapting Farms with NASA Data

**Test your field's future.** NASA Space Apps Challenge 2026 · Challenge: [Field Shift: Adapting Farms with NASA Data](https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/)

**Live app: https://asistente-rotacion-cultivos.vercel.app/**

Field Shift is a decision-support tool that helps a farmer explore which crops and crop rotations fit a field. It combines NASA Earth observations, local soil and crop information, and the farmer's own priorities, compares at least three rotations (the current one included), and explains why each one scores the way it does, what evidence supports it, and what still needs local validation. **It supports the decision. It does not replace farmer or agronomist judgment.**

## What it does

- **What to plant now and a 3-year plan:** filters crops by suitability, scores them on six weighted priorities (income, speed, soil health, input savings, resilience, compliance) and explains each result.
- **Stress test:** every rotation is replayed over 22 real windows of 3 consecutive campaigns (2001-2025), day by day: extreme heat, frost, dry spells, water deficit and heavy rain.
- **Farm-Wide Optimizer and Field Shift DNA:** searches rotation combinations for the whole farm, coupled by farm-level risk, and profiles resilience in six dimensions. It never claims a global optimum.
- **Climate Twin 3D:** replays a real campaign (for example the 2022/23 drought) on the field.
- **Copilot:** a local, rule-based command assistant (no generative AI; data never leaves the browser) that runs the app's own functions, including an irrigation what-if.
- **Installable PWA**, English UI, works offline with the bundled data.

## Data

| Data | Source | Use |
|---|---|---|
| Daily and monthly climate (temperature, rain, humidity, wind, solar radiation, root-zone soil wetness) | **NASA POWER** (MERRA-2 / CERES), community AG | Suitability, daily extreme events, ET0, stress test, yield model |
| Yields, prices and margins by department and campaign | MAGyP (Argentina) | Reference yields, income, yield model target |
| Department centroids | Georef API (datos.gob.ar) | Locate each department for POWER |
| Crop catalog, soils, rotation effects | **Illustrative** (to be replaced with cited parameters) | Suitability and soil-health components |

NASA POWER is regional (about 55 x 60 km), not field-level. Anything the farmer enters is marked as such and takes priority. Every number is labeled `observed`, `derived`, `modeled`, `assumed` or `unknown` in the documentation.

## Yield-response model

A statistical model of how yield departs from its technology trend given the climate in each crop's critical window. Argentina, 35 departments, 1981-2024, validated leave-one-year-out against a trend-only baseline; a crop uses the model only if it passes a pre-registered criterion (soy, maize and sorghum in the humid Pampa, soy and maize in Entre Rios). It reproduces past campaigns out of sample; it is **not** a forecast, and it softens extreme years. Details and limits: [`docs/model_card.md`](docs/model_card.md).

## Run

Open `prototype/mvp-rotacion.html` in a browser, or use the live app.

```bash
node prototype/src/build.js   # rebuild the HTML from src/
node prototype/src/smoke.js   # print sample rankings
```

Yield model:

```bash
pip install -r pipeline/requirements.txt
python pipeline/run_all.py                    # download, features, leave-one-year-out validation (~8 min), export
python -m unittest discover -s tests -v       # pipeline and wiki tests
```

## Repo

- `prototype/`: app, recommendation engine, landing and demo deck
- `pipeline/`: reproducible yield-model pipeline (Python)
- `data/processed/`: processed tables (raw downloads are not versioned)
- `docs/`: functional document, action plan, roadmap, datasets, model card, decisions
- `wiki/`: project knowledge base in [Open Knowledge Format (OKF) v0.2](https://github.com/GoogleCloudPlatform/open-knowledge-format) (start at `wiki/index.md`). Rebuild indexes with `python tools/okf_wiki.py index`, validate with `python tools/okf_wiki.py check` (needs `pip install pyyaml`)
- `CLAUDE.md`: project guide and working rules

## Principles

- Transparent scoring before any ML.
- Every number is labeled `observed`, `derived`, `modeled`, `assumed` or `unknown`.
- No invented ground truth.

## Use of AI

AI tools were used to help develop this project: the team worked with Claude Code (Anthropic) to write code, documentation and the project wiki, and to draft parts of the presentation. The team reviewed and directed the work. The decision engine itself is deterministic and rule-based; the only trained models are the statistical yield-response models described above. The in-app Copilot is a local command interpreter and does not use generative AI.

## Team

Marcos Vollert, Maxi Lombardia, Felipe Bridge, Blas Ferreira, Matias Gonzalez and Emiliano Lescuras. Profiles are linked in the app.

## License

[MIT](LICENSE)
