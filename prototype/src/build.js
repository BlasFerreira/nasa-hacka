const fs = require('fs');
const path = require('path');
const dir = __dirname;
const tpl = fs.readFileSync(path.join(dir, 'app.tpl.html'), 'utf8');
const engine = fs.readFileSync(path.join(dir, 'engine.js'), 'utf8');
const power = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'power_climatology.json'), 'utf8')));
const rend = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'rend_magyp.json'), 'utf8')));
const team = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'team.json'), 'utf8')));
// Se normalizan los saltos de línea: en Windows git puede dejar el .svg con \r\n y el base64 cambiaría,
// así el build da el mismo resultado en cualquier sistema.
const logo = Buffer.from(fs.readFileSync(path.join(dir, 'assets', 'nasa-logo.svg'), 'utf8').replace(/\r\n/g, '\n'), 'utf8');
if (engine.includes('</script>')) throw new Error('engine.js contiene </script>');
// Serie diaria de NASA POWER (fetch_power_diario.js): se inlinea para que la demo funcione sin conexión.
const diario = fs.existsSync(path.join(dir, 'power_diario.json')) ? JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'power_diario.json'), 'utf8'))) : 'null';
const datos = 'window.POWER_CLIMATOLOGY = ' + power + ';\nwindow.POWER_DIARIO = ' + diario + ';\nwindow.REND_MAGYP = ' + rend + ';\nwindow.TEAM = ' + team + ';\n';
const logoUri = 'data:image/svg+xml;base64,' + logo.toString('base64');
// Three.js r147 empaquetado (src/vendor, MIT) como texto inerte: el Climate Twin lo ejecuta al abrirse y no depende del CDN.
const vend = f => { const p = path.join(dir, 'vendor', f); if (!fs.existsSync(p)) return null; const t = fs.readFileSync(p, 'utf8'); if (/<\/script/i.test(t)) throw new Error(f + ' contiene </script>'); return t; };
const three = vend('three-0.147.0.min.js'), orbit = vend('OrbitControls-0.147.0.js');
const threeSrc = three && orbit ? '<script type="text/plain" id="three-src">' + three + '</script>\n<script type="text/plain" id="orbit-src">' + orbit + '</script>' : '';
const out = tpl.replace('/*ENGINE*/', () => datos + engine).replace('/*NASA_LOGO_URI*/', () => logoUri).replace('<!--THREE_SRC-->', () => threeSrc);
const dest = process.argv[2] || path.join(dir, '..', 'mvp-rotacion.html');
fs.writeFileSync(dest, out, 'utf8');
console.log('OK', dest, out.length, 'bytes');
