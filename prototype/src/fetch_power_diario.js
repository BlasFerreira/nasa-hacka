// Baja la serie DIARIA de NASA POWER (2001–2025) para los puntos de referencia del MVP y la guarda en
// power_diario.json (la build la inlinea en la página: la demo funciona sin conexión).
//   node prototype/src/fetch_power_diario.js
// API: https://power.larc.nasa.gov/docs/services/api/temporal/daily/ (sin login)
//
// Variables (comunidad AG):
//   PRECTOTCORR  precipitación corregida (mm/día)
//   T2M_MAX, T2M_MIN, T2M  temperatura máxima, mínima y media a 2 m (°C)
//   GWETROOT     humedad de la zona radicular (0 = seco, 1 = saturado). Modelada (MERRA-2), regional: NO es una medición del lote.
//   RH2M, WS2M, ALLSKY_SFC_SW_DWN  humedad relativa (%), viento a 2 m (m/s), radiación solar (MJ/m²/día):
//                se usan para calcular ET0 y no se guardan, para que el archivo no pese de más.
// Derivada:
//   et0          evapotranspiración de referencia (mm/día), FAO-56 Penman-Monteith (Allen et al., 1998, ec. 6),
//                con la elevación que devuelve la API y radiación extraterrestre según la latitud.
const fs = require('fs');
const path = require('path');

const INI = '20010101', FIN = '20251231';
const PARAMS = ['PRECTOTCORR', 'T2M_MAX', 'T2M_MIN', 'T2M', 'GWETROOT', 'RH2M', 'WS2M', 'ALLSKY_SFC_SW_DWN'];
// Mismos puntos que fetch_power.js (misma celda de NASA POWER que los campos de ejemplo).
const PUNTOS = {
  entre_rios:   { lat: -31.73, lon: -60.53 },
  pampa_humeda: { lat: -33.89, lon: -60.57 },
};

function et0FAO56(tmax, tmin, rh, u2, rs, latDeg, z, doy) {
  const T = (tmax + tmin) / 2;
  const P = 101.3 * Math.pow((293 - 0.0065 * z) / 293, 5.26), gamma = 0.000665 * P;
  const eo = t => 0.6108 * Math.exp(17.27 * t / (t + 237.3));
  const delta = 4098 * eo(T) / Math.pow(T + 237.3, 2);
  const es = (eo(tmax) + eo(tmin)) / 2, ea = Math.max(0, rh / 100 * es);
  const phi = latDeg * Math.PI / 180, dr = 1 + 0.033 * Math.cos(2 * Math.PI * doy / 365);
  const dec = 0.409 * Math.sin(2 * Math.PI * doy / 365 - 1.39);
  const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dec))));
  const Ra = 24 * 60 / Math.PI * 0.0820 * dr * (ws * Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.sin(ws));
  const Rso = (0.75 + 2e-5 * z) * Ra;
  const Rns = 0.77 * rs;
  const rel = Rso > 0 ? Math.min(1, rs / Rso) : 1;
  const Rnl = 4.903e-9 * (Math.pow(tmax + 273.16, 4) + Math.pow(tmin + 273.16, 4)) / 2 * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * rel - 0.35);
  const Rn = Rns - Rnl;
  const et0 = (0.408 * delta * Rn + gamma * 900 / (T + 273) * u2 * (es - ea)) / (delta + gamma * (1 + 0.34 * u2));
  return Math.max(0, et0);
}

async function bajar(id, p) {
  const url = 'https://power.larc.nasa.gov/api/temporal/daily/point?parameters=' + PARAMS.join(',') +
    '&community=AG&longitude=' + p.lon + '&latitude=' + p.lat + '&start=' + INI + '&end=' + FIN + '&format=JSON';
  const r = await fetch(url);
  if (!r.ok) throw new Error('NASA POWER respondió ' + r.status + ' para ' + id);
  const j = await r.json();
  const V = j.properties.parameter, z = j.geometry.coordinates[2] || 0;
  const dias = Object.keys(V.T2M).sort();
  const ok = v => v !== undefined && v !== null && v > -900;
  const r1 = v => ok(v) ? Math.round(v * 10) / 10 : null;
  const out = { lat: p.lat, lon: p.lon, elevacion_m: Math.round(z), inicio: dias[0], n: dias.length,
    prec: [], tmax: [], tmin: [], t2m: [], gwet: [], et0: [] };
  let faltan = 0;
  for (const d of dias) {
    const y = +d.slice(0, 4), m = +d.slice(4, 6), dd = +d.slice(6, 8);
    const doy = Math.round((Date.UTC(y, m - 1, dd) - Date.UTC(y, 0, 0)) / 864e5);
    const tx = V.T2M_MAX[d], tn = V.T2M_MIN[d], rh = V.RH2M[d], u2 = V.WS2M[d], rs = V.ALLSKY_SFC_SW_DWN[d];
    out.prec.push(r1(V.PRECTOTCORR[d])); out.tmax.push(r1(tx)); out.tmin.push(r1(tn)); out.t2m.push(r1(V.T2M[d]));
    out.gwet.push(ok(V.GWETROOT[d]) ? Math.round(V.GWETROOT[d] * 100) / 100 : null);
    const e = [tx, tn, rh, u2, rs].every(ok) ? et0FAO56(tx, tn, rh, u2, rs, p.lat, z, doy) : null;
    out.et0.push(e === null ? null : Math.round(e * 10) / 10);
    if (e === null) faltan++;
  }
  const suma = a => a.reduce((s, v) => s + (v || 0), 0), anios = dias.length / 365.25;
  console.log(id, dias[0], '→', dias[dias.length - 1], '·', dias.length, 'días · elevación', Math.round(z), 'm · lluvia',
    Math.round(suma(out.prec) / anios), 'mm/año · ET0', Math.round(suma(out.et0) / anios), 'mm/año · días sin ET0:', faltan);
  return out;
}

(async () => {
  const out = {
    fuente: 'NASA POWER, API diaria, comunidad AG (fuentes MERRA-2, SYN1DEG)',
    url: 'https://power.larc.nasa.gov/',
    periodo: INI.slice(0, 4) + '–' + FIN.slice(0, 4),
    descargado: new Date().toISOString().slice(0, 10),
    variables: {
      prec: 'PRECTOTCORR · precipitación corregida (mm/día)',
      tmax: 'T2M_MAX · temperatura máxima a 2 m (°C)',
      tmin: 'T2M_MIN · temperatura mínima a 2 m (°C)',
      t2m: 'T2M · temperatura media a 2 m (°C)',
      gwet: 'GWETROOT · humedad de la zona radicular, 0–1 (modelada, regional; no es una medición del lote)',
      et0: 'ET0 FAO-56 Penman-Monteith (mm/día), calculada con T2M_MAX, T2M_MIN, RH2M, WS2M y ALLSKY_SFC_SW_DWN',
    },
    nota: 'Un valor por día desde "inicio". null = sin dato. Mismos puntos (y celdas) que power_climatology.json.',
    zonas: {},
  };
  for (const [id, p] of Object.entries(PUNTOS)) out.zonas[id] = await bajar(id, p);
  fs.writeFileSync(path.join(__dirname, 'power_diario.json'), JSON.stringify(out) + '\n');
  console.log('OK power_diario.json', fs.statSync(path.join(__dirname, 'power_diario.json')).size, 'bytes');
})().catch(e => { console.error(e.message); process.exit(1); });
