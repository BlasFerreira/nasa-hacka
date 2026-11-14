# Prototype

- `mvp-rotacion.html`: self-contained interactive MVP (open it in a browser). Published as an artifact too.
- `src/`: sources. `engine.js` is the recommendation engine (suitability filter + transparent score), `app.tpl.html` is the UI, `build.js` inlines the engine into `mvp-rotacion.html` (`node prototype/src/build.js`), `smoke.js` prints sample rankings (`node prototype/src/smoke.js`).
- `deck/`: source files of the 7-slide demo deck (English, per the Space Apps submission rules).

Climate comes from NASA POWER (monthly climatology 2001-2025 at one reference point per zone). Refresh it with `node prototype/src/fetch_power.js`, then rebuild with `node prototype/src/build.js`. Crop values, soils and plots are illustrative. See `docs/documento_funcional.md`.

Live: https://asistente-rotacion-cultivos.vercel.app/ (Vercel, serves the committed `mvp-rotacion.html` as is, with no build step). After editing anything in `src/`, run `node prototype/src/build.js` and commit the regenerated HTML; `.github/workflows/check-build.yml` fails if you forget.
