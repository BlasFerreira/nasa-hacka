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

## Climate Twin (`#/climate-twin/<field>`)

Geospatial 3D twin of a field (Three.js r147, vendored in `src/vendor/` and embedded in the HTML as inert text that only runs when the view opens, so it works offline; jsDelivr is a fallback; 2D fallback without WebGL). Layers: the engine evaluates (`evaluarRotacion()` per plot under the chosen scenario and plan), `twinEstado`/`twinCritico` adapt results and NASA POWER data for each instant, and the Three.js layer only renders.

- Terrain: the same Esri World Imagery tiles the Leaflet map uses, shown live (not stored or exported for offline use, which the layer does not allow) with "Powered by Esri" and source attribution, as Esri's attribution rules require. The imagery is licensed under the Esri Master License Agreement; we could not confirm from Esri whether non-commercial use without an ArcGIS account is covered, so it can be switched off ("Imagen satelital") and the procedural materials work on their own. Tiles are stitched at zoom <= 15 (<= 64 tiles) on the plots' real coordinates (Web Mercator to the local projection; negligible difference over a few km) and fade out radially.
- Plots: flat polygons on the terrain (no thickness, no relief, same relative positions). Crops use schematic colour materials (rows of plants on soil, spacing and tone per crop, oriented along each plot's longest side); fallow is translucent so the real imagery shows through. They illustrate the planned crop, not observations or phenology. The view opens on the date with most plots under a crop in the plan ("🌱 Con cultivos").
- Crop-stress 3D layer ("Estrés" mode): a translucent prism per plot with its exact outline; height and colour = crop-stress index of the cycle (1 - engine suitability, 0 to 1, relative, not a loss probability), uniform per plot and constant for each cycle (no invented daily or intra-plot variation). Shown on both sides of the comparison.
  - With daily climate the stress accumulates through the cycle: the structural part of the engine's suitability times the daily event factors (`climaDiarioCiclo(..., hasta)`, same rules) counted up to the timeline date. Heat, frost and dry-spell factors are counts and grow naturally; the rain-vs-demand penalty is weighted by the elapsed fraction of the cycle (otherwise the first rainless days would get the maximum penalty). At harvest it equals the cycle value exactly (checked in code). With the monthly 'habitual' climate it stays static.
- Weather visuals are synced with the date and illustrative: drought warms and desaturates the scene with the accumulated climatic deficit (ET0 - rain since 1 July, shown as data); heat raises sun intensity and a light haze with the day's maximum vs the extreme-heat threshold; rain streaks, fog and cooler light follow the day's mm. No flooding or crop death is drawn. Thin border; a low glowing rim only on hover, selection, extreme heat or the critical moment; other plots dim when one is selected.
- Camera: oblique (~52°) perspective with a 30° lens; automatic framing (~80 % of the viewer) for any field; compact controls: center, top view, oblique view, focus plot.
- Scenarios, timeline, critical moment, comparison and limitations: as in 2.0 (see the "Ver momento crítico" metrics and the scissor-based current | optimized comparison). Environmental effects only tint the light (no background color change) and draw rain streaks on rainy days; they illustrate the type of event, not damage, and can be turned off.
- Limitations: ET0 is not recomputed for perturbed temperatures; the engine does not model waterlogging from intense rain; perturbed zones keep the original cell's heat threshold (engine `umbralCalor`); the crop-stress index derives from the crop-cycle suitability from the engine (not a loss probability); risk is uniform per plot (no invented intra-plot heterogeneity).
