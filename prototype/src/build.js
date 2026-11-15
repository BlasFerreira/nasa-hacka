const fs = require('fs');
const path = require('path');
const dir = __dirname;
const tpl = fs.readFileSync(path.join(dir, 'app.tpl.html'), 'utf8');
const engine = fs.readFileSync(path.join(dir, 'engine.js'), 'utf8');
const power = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'power_climatology.json'), 'utf8')));
const team = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'team.json'), 'utf8')));
// Se normalizan los saltos de línea: en Windows git puede dejar el .svg con \r\n y el base64 cambiaría,
// así el build da el mismo resultado en cualquier sistema.
const logo = Buffer.from(fs.readFileSync(path.join(dir, 'assets', 'nasa-logo.svg'), 'utf8').replace(/\r\n/g, '\n'), 'utf8');
if (engine.includes('</script>')) throw new Error('engine.js contiene </script>');
const datos = 'window.POWER_CLIMATOLOGY = ' + power + ';\nwindow.TEAM = ' + team + ';\n';
const logoUri = 'data:image/svg+xml;base64,' + logo.toString('base64');
const out = tpl.replace('/*ENGINE*/', () => datos + engine).replace('/*NASA_LOGO_URI*/', () => logoUri);
const dest = process.argv[2] || path.join(dir, '..', 'mvp-rotacion.html');
fs.writeFileSync(dest, out, 'utf8');
console.log('OK', dest, out.length, 'bytes');
