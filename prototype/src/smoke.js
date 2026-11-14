const M = require('./engine.js');
const loma = { zona: 'entre_rios', textura: 'franco_limoso', ph: 6.4, drenaje: 'bueno', pendiente: 1, riego: false,
  riesgos: { sequia: .5, anegamiento: .5 }, rotacion_habitual: ['soja', 'maiz_tardio'], historial: ['maiz_tardio', 'soja'] };
const bajo = { zona: 'entre_rios', textura: 'arcilloso', ph: 6.9, drenaje: 'pobre', pendiente: .5, riego: false,
  riesgos: { sequia: .3, anegamiento: .7 }, rotacion_habitual: ['soja'], historial: ['soja', 'soja', 'soja'] };
const arenoso = { zona: 'entre_rios', textura: 'franco_arenoso', ph: 5.8, drenaje: 'excesivo', pendiente: 3, riego: false,
  riesgos: { sequia: .7, anegamiento: .1 }, rotacion_habitual: ['girasol', 'sorgo', 'trigo'], historial: ['trigo', 'girasol'] };
function show(n, l, f, cos) {
  const r = M.recomendar(l, M.parseFecha(f), cos ? M.parseFecha(cos) : null);
  console.log('==', n, f, cos || '');
  r.top.forEach(e => console.log(`  ${e.posicion}. ${e.nombre.padEnd(16)} ${String(e.score).padStart(5)}  apt ${String(e.aptitud_pct).padStart(5)} ` + JSON.stringify(e.componentes)));
  console.log('  descartados:', r.descartados.map(d => d.cultivo).join(','));
  const ra = r.rotacion_actual; console.log('  rot:', ra.proximo, ra.score, ra.idoneidad, ra.posicion, '-', ra.nota);
}
for (const f of ['2026-11-14', '2027-01-10', '2027-05-10', '2027-06-20']) show('loma', loma, f);
show('bajo', bajo, '2026-11-14');
show('arenoso', arenoso, '2026-11-14');
show('loma c/cosecha corta', loma, '2026-11-14', '2027-03-01');
