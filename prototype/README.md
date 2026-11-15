# Prototype

- `mvp-rotacion.html`: self-contained interactive MVP (open it in a browser). Published as an artifact too.
- `src/`: sources. `engine.js` is the recommendation engine (suitability filter + transparent score), `app.tpl.html` is the UI, `build.js` inlines the engine into `mvp-rotacion.html` (`node prototype/src/build.js`), `smoke.js` prints sample rankings (`node prototype/src/smoke.js`).
- `deck/`: source files of the 7-slide demo deck (English, per the Space Apps submission rules).

Climate comes from NASA POWER, 2001-2025, for the NASA POWER cell of each plot:

| File | Source | Variables (units) | Used for |
|---|---|---|---|
| `src/power_climatology.json` (`fetch_power.js`) | POWER monthly API, community AG | `T2M` (°C), `PRECTOTCORR` (mm/month) per month and per year | Crop suitability, real-campaign scenarios |
| `src/power_diario.json` (`fetch_power_diario.js`) | POWER daily API, community AG (MERRA-2, SYN1DEG) | `PRECTOTCORR` (mm/day), `T2M_MAX`, `T2M_MIN`, `T2M` (°C), `GWETROOT` (0-1, modelled root-zone wetness), ET0 (mm/day) | Extreme events, water deficit, daily stress test, campaign timeline |

ET0 is FAO-56 Penman-Monteith computed from `T2M_MAX`, `T2M_MIN`, `RH2M`, `WS2M` and `ALLSKY_SFC_SW_DWN` (those three are not stored). Both files cover the bundled example cells; plots elsewhere query the monthly API live from the browser. Refresh with `node prototype/src/fetch_power.js` and `node prototype/src/fetch_power_diario.js`, then rebuild with `node prototype/src/build.js`.

Stress test: each rotation runs over every window of 3 consecutive real campaigns (22 windows). With daily data each crop cycle is also checked for extreme heat in its critical period (above the cell's own 90th percentile of summer maxima, at least 35 °C), frost, dry spells and rain below 60 % of crop demand (Kc x ET0). Thresholds, Kc and penalties are documented assumptions in `engine.js` (`UMBRALES`, `KC`, `climaDiarioCiclo`). They flag risk; they are not validated yield losses.

NASA POWER climate projections (CMIP6, Projection API v2.6.4-beta) were tested on 2026-11-14 and return only fill values (-999) for Argentina, so no future-climate scenarios are included. Crop values, soils and plots are illustrative. See `docs/documento_funcional.md`.

Live: https://asistente-rotacion-cultivos.vercel.app/ (Vercel, serves the committed `mvp-rotacion.html` as is, with no build step). After editing anything in `src/`, run `node prototype/src/build.js` and commit the regenerated HTML. Nothing checks it automatically, so if you forget, your change will not reach the site.
