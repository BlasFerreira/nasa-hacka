// Arma prototype/mundo.html: el recorrido scrolleable del campo, con el motor y el clima de NASA POWER inlineados.
//   node prototype/src/build_mundo.js
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const tpl = fs.readFileSync(path.join(dir, 'mundo.tpl.html'), 'utf8');
const engine = fs.readFileSync(path.join(dir, 'engine.js'), 'utf8');
const power = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'power_climatology.json'), 'utf8')));
const rend = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, 'rend_magyp.json'), 'utf8')));
if (engine.includes('</script>')) throw new Error('engine.js contiene </script>');
const out = tpl.replace('/*ENGINE*/', () => 'window.POWER_CLIMATOLOGY = ' + power + ';\nwindow.REND_MAGYP = ' + rend + ';\n' + engine);
const dest = process.argv[2] || path.join(dir, '..', 'mundo.html');
fs.writeFileSync(dest, out, 'utf8');
console.log('OK', dest, out.length, 'bytes');
