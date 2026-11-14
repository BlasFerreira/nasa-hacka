# Field Shift: Adapting Farms with NASA Data

NASA Space Apps Challenge 2026. A decision-support prototype for crop rotation.

Field Shift helps a farmer explore which crops and rotations fit a field, combining NASA Earth observations, local soil and crop information, and the farmer's own priorities. It supports the decision. It does not replace farmer or agronomist judgment.

## Status

- **Working:** interactive MVP. Pick a plot, a sowing date and a priority, and get a ranked recommendation with the reasons behind it.
- **Simulated:** climate and the crop catalog are illustrative. No real NASA data is connected yet.
- **Next:** NASA POWER, GPM/IMERG and SMAP; a comparison of 3 rotations over about 25 years of historical climate; a yield-response model only if it beats a trend-only baseline.

## Run

Open `prototype/mvp-rotacion.html` in a browser.

```bash
node prototype/src/build.js   # rebuild the HTML from src/
node prototype/src/smoke.js   # print sample rankings
```

## Repo

- `prototype/`: MVP, recommendation engine and demo deck
- `docs/`: action plan, functional document, datasets
- `CLAUDE.md`: project guide and working rules

## Principles

- Transparent scoring before any ML.
- Every number is labeled `observed`, `derived`, `modeled`, `assumed` or `unknown`.
- No invented ground truth.
