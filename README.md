# Field Shift: Adapting Farms with NASA Data

NASA Space Apps Challenge 2026. A decision-support prototype for crop rotation.

Field Shift helps a farmer explore which crops and rotations fit a field, combining NASA Earth observations, local soil and crop information, and the farmer's own priorities. It supports the decision. It does not replace farmer or agronomist judgment.

## Status

- **Working:** interactive MVP. Pick a plot, a sowing date and a priority, and get a ranked recommendation with the reasons behind it.
- **Real data:** NASA POWER climate (monthly, 2001-2025) and MAGyP yields and margins.
- **Illustrative:** the crop catalog, soils and rotation effects (to be replaced with cited parameters).
- **Next:** a second NASA product (MODIS/VIIRS NDVI, SMAP), a reproducible yield model, 25-year climate scenarios and the submission package. See [`docs/hitos.md`](docs/hitos.md) for the full status and task list.

## Run

Open `prototype/mvp-rotacion.html` in a browser.

```bash
node prototype/src/build.js   # rebuild the HTML from src/
node prototype/src/smoke.js   # print sample rankings
```

Yield model (Argentina, 35 departments, NASA POWER + MAGyP). See [`docs/model_card.md`](docs/model_card.md):

```bash
pip install -r pipeline/requirements.txt
python pipeline/run_all.py                    # download, features, leave-one-year-out validation (~8 min), export
python -m unittest discover -s tests -v       # pipeline tests
```

## Repo

- `prototype/`: MVP, recommendation engine and demo deck
- `docs/`: action plan, functional document, datasets
- `wiki/`: project knowledge base in [Open Knowledge Format (OKF) v0.2](https://github.com/GoogleCloudPlatform/open-knowledge-format) (start at `wiki/index.md`). Rebuild indexes with `python tools/okf_wiki.py index`, validate with `python tools/okf_wiki.py check` (needs `pip install pyyaml`)
- `CLAUDE.md`: project guide and working rules

## Principles

- Transparent scoring before any ML.
- Every number is labeled `observed`, `derived`, `modeled`, `assumed` or `unknown`.
- No invented ground truth.
