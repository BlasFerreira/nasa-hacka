// Baja la climatología mensual de NASA POWER para los puntos de referencia del MVP
// y la guarda en power_climatology.json (se inlinea en la página al construirla).
//   node prototype/src/fetch_power.js
// API: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/ (sin login)
const fs = require('fs');
const path = require('path');

const START = 2001, END = 2025;
const PUNTOS = {
  entre_rios:   { nombre: 'Entre Ríos',   referencia: 'cerca de Paraná',    lat: -31.73, lon: -60.53 },
  pampa_humeda: { nombre: 'Pampa húmeda', referencia: 'cerca de Pergamino', lat: -33.89, lon: -60.57 },
};
const dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m = 1..12

async function bajar(p) {
  const url = 'https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR&community=AG' +
    `&longitude=${p.lon}&latitude=${p.lat}&start=${START}&end=${END}&format=JSON`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('NASA POWER respondió ' + r.status + ' para ' + url);
  const j = await r.json();
  const T = j.properties.parameter.T2M, P = j.properties.parameter.PRECTOTCORR;
  const temp = [], precip = [];
  for (let m = 1; m <= 12; m++) {
    let ts = 0, ps = 0, n = 0;
    for (let y = START; y <= END; y++) {
      const k = String(y) + String(m).padStart(2, '0');
      const t = T[k], pr = P[k];
      if (t === undefined || pr === undefined || t <= -900 || pr <= -900) continue; // -999 = sin dato
      ts += t; ps += pr * dim(y, m); n++;
    }
    if (!n) throw new Error('Sin datos para el mes ' + m);
    temp.push(Math.round((ts / n) * 10) / 10);
    precip.push(Math.round(ps / n));
  }
  return { temp, precip, api: j.header && j.header.api_version };
}

(async () => {
  const out = {
    fuente: 'NASA POWER (Prediction Of Worldwide Energy Resources), comunidad AG, resolución mensual',
    url: 'https://power.larc.nasa.gov/',
    parametros: { T2M: 'Temperatura del aire a 2 m (°C)', PRECTOTCORR: 'Precipitación corregida (mm/día, convertida a mm/mes)' },
    periodo: START + '–' + END,
    descargado: new Date().toISOString().slice(0, 10),
    nota: 'Promedio mensual de los años del período. Son puntos de referencia de la zona, no del campo exacto.',
    zonas: {},
  };
  for (const [id, p] of Object.entries(PUNTOS)) {
    const d = await bajar(p);
    out.zonas[id] = { nombre: p.nombre, referencia: p.referencia, lat: p.lat, lon: p.lon, temp: d.temp, precip: d.precip };
    console.log(id, 'T2M', d.temp.join(' '), '| precip', d.precip.join(' '), '| total', d.precip.reduce((a, b) => a + b, 0), 'mm/año');
  }
  fs.writeFileSync(path.join(__dirname, 'power_climatology.json'), JSON.stringify(out, null, 2) + '\n');
  console.log('OK power_climatology.json');
})().catch(e => { console.error(e.message); process.exit(1); });
