# Prototype

- `mvp-rotacion.html`: self-contained interactive MVP (open it in a browser). Published as an artifact too.
- `src/`: sources. `engine.js` is the recommendation engine (suitability filter + transparent score), `app.tpl.html` is the UI, `build.js` inlines the engine into `mvp-rotacion.html` (`node prototype/src/build.js`), `smoke.js` prints sample rankings (`node prototype/src/smoke.js`).
- `deck/`: source files of the 7-slide demo deck (English, per the Space Apps submission rules).

All crop values and the climate are illustrative / simulated. See `docs/documento_funcional.md`.
