# Vendor

Three.js r147 (`three@0.147.0` from npm, MIT licence, see `LICENSE-three.txt`):

- `three-0.147.0.min.js`: `build/three.min.js`
- `OrbitControls-0.147.0.js`: `examples/js/controls/OrbitControls.js`

`build.js` embeds both into `mvp-rotacion.html` as inert text (`<script type="text/plain">`). They only run when the user opens Climate Twin, so the 3D view works offline and does not depend on the CDN during a demo. If they are missing, the app falls back to jsDelivr.
