/* Motor de recomendación (port a JS del diseño del documento funcional, §8).
   Clima: NASA POWER (real). Catálogo de cultivos: ILUSTRATIVO. Sin ML: scorer transparente. */
(function (root) {
  'use strict';

  const TEX_GENERAL = { arenoso: .40, franco_arenoso: .70, franco: 1, franco_limoso: 1, franco_arcilloso: .85, arcilloso: .60 };
  const TEX_LIVIANA = { arenoso: .80, franco_arenoso: 1, franco: 1, franco_limoso: .90, franco_arcilloso: .70, arcilloso: .50 };
  const TEX_PESADA  = { arenoso: .30, franco_arenoso: .60, franco: 1, franco_limoso: 1, franco_arcilloso: 1, arcilloso: .80 };
  const DREN_GENERAL   = { bueno: 1, moderado: .85, excesivo: .60, pobre: .30 };
  const DREN_TOLERANTE = { bueno: 1, moderado: .90, excesivo: .60, pobre: .50 };

  const TEXTURAS = ['arenoso', 'franco_arenoso', 'franco', 'franco_limoso', 'franco_arcilloso', 'arcilloso'];
  const DRENAJES = ['excesivo', 'bueno', 'moderado', 'pobre'];

  function crop(o) {
    return Object.assign({
      tipo: 'comercial', leguminosa: false, familia: '',
      ph_opt: [6.0, 7.2], ph_lim: [5.0, 8.2],
      textura: TEX_GENERAL, drenaje: DREN_GENERAL,
      pend_opt_max: 3, pend_lim_max: 12, margen_siembra_dias: 20,
      rend_t_ha: 0, precio_usd_t: 0, costo_usd_ha: 0,
      n_ext: 0, p_ext: 0, k_ext: 0, n_fijado: 0, n_residual: 0,
      rastrojo: .5, erosion: .5, raiz: .5, tol_sequia: .5, tol_anegamiento: .5,
    }, o);
  }

  const CULTIVOS = {
    soja: crop({ nombre: 'Soja', leguminosa: true, familia: 'fabaceae',
      temp_opt: [20, 26], temp_lim: [14, 32], agua_opt: [450, 700], agua_lim: [250, 1000],
      siembra_opt: [11, 1, 12, 15], ciclo_dias: 150, rend_t_ha: 3.2, precio_usd_t: 300, costo_usd_ha: 450,
      n_ext: 190, p_ext: 20, k_ext: 80, n_fijado: 140, n_residual: 20,
      rastrojo: .30, erosion: .30, raiz: .40, tol_sequia: .40, tol_anegamiento: .30 }),
    maiz_temprano: crop({ nombre: 'Maíz temprano', familia: 'poaceae',
      temp_opt: [18, 26], temp_lim: [12, 32], agua_opt: [500, 800], agua_lim: [300, 1100],
      siembra_opt: [9, 10, 10, 31], ciclo_dias: 150, rend_t_ha: 9, precio_usd_t: 190, costo_usd_ha: 700,
      n_ext: 200, p_ext: 35, k_ext: 50,
      rastrojo: .90, erosion: .70, raiz: .60, tol_sequia: .40, tol_anegamiento: .30 }),
    maiz_tardio: crop({ nombre: 'Maíz tardío', familia: 'poaceae',
      temp_opt: [18, 26], temp_lim: [12, 32], agua_opt: [450, 750], agua_lim: [300, 1100],
      siembra_opt: [11, 25, 1, 10], ciclo_dias: 155, margen_siembra_dias: 25,
      rend_t_ha: 7.5, precio_usd_t: 190, costo_usd_ha: 650, n_ext: 190, p_ext: 30, k_ext: 45,
      rastrojo: .90, erosion: .70, raiz: .60, tol_sequia: .40, tol_anegamiento: .30 }),
    girasol: crop({ nombre: 'Girasol', familia: 'asteraceae',
      temp_opt: [18, 26], temp_lim: [12, 32], agua_opt: [400, 650], agua_lim: [250, 900],
      siembra_opt: [8, 15, 10, 15], ciclo_dias: 140, textura: TEX_LIVIANA,
      rend_t_ha: 2.5, precio_usd_t: 340, costo_usd_ha: 400, n_ext: 90, p_ext: 15, k_ext: 80,
      rastrojo: .50, erosion: .40, raiz: .80, tol_sequia: .70, tol_anegamiento: .20 }),
    sorgo: crop({ nombre: 'Sorgo granífero', familia: 'poaceae',
      temp_opt: [22, 30], temp_lim: [16, 36], agua_opt: [350, 600], agua_lim: [200, 900],
      siembra_opt: [10, 20, 12, 20], ciclo_dias: 130, margen_siembra_dias: 25,
      textura: TEX_LIVIANA, drenaje: DREN_TOLERANTE,
      rend_t_ha: 6, precio_usd_t: 150, costo_usd_ha: 380, n_ext: 130, p_ext: 20, k_ext: 40,
      rastrojo: .80, erosion: .60, raiz: .70, tol_sequia: .90, tol_anegamiento: .40 }),
    trigo: crop({ nombre: 'Trigo', familia: 'poaceae',
      temp_opt: [10, 18], temp_lim: [4, 24], agua_opt: [350, 550], agua_lim: [200, 800],
      ph_opt: [6.0, 7.5], ph_lim: [5.2, 8.3],
      siembra_opt: [6, 1, 7, 15], ciclo_dias: 180, margen_siembra_dias: 25, textura: TEX_PESADA,
      rend_t_ha: 3.8, precio_usd_t: 230, costo_usd_ha: 500, n_ext: 120, p_ext: 20, k_ext: 25,
      rastrojo: .80, erosion: .70, raiz: .50, tol_sequia: .50, tol_anegamiento: .40 }),
    cebada: crop({ nombre: 'Cebada', familia: 'poaceae',
      temp_opt: [10, 17], temp_lim: [4, 23], agua_opt: [300, 500], agua_lim: [180, 750],
      siembra_opt: [6, 10, 7, 20], ciclo_dias: 170, textura: TEX_PESADA,
      rend_t_ha: 3.5, precio_usd_t: 210, costo_usd_ha: 430, n_ext: 100, p_ext: 18, k_ext: 25,
      rastrojo: .80, erosion: .70, raiz: .50, tol_sequia: .50, tol_anegamiento: .30 }),
    vicia: crop({ nombre: 'Vicia', tipo: 'cobertura', leguminosa: true, familia: 'fabaceae',
      temp_opt: [10, 18], temp_lim: [3, 24], agua_opt: [200, 400], agua_lim: [120, 700],
      siembra_opt: [3, 15, 6, 15], ciclo_dias: 150, textura: TEX_PESADA, pend_opt_max: 8, pend_lim_max: 25,
      costo_usd_ha: 55, n_fijado: 90, n_residual: 60,
      rastrojo: .70, erosion: .80, raiz: .50, tol_sequia: .50, tol_anegamiento: .30 }),
    avena: crop({ nombre: 'Avena', tipo: 'cobertura', familia: 'poaceae',
      temp_opt: [8, 18], temp_lim: [2, 25], agua_opt: [200, 450], agua_lim: [120, 750],
      siembra_opt: [3, 15, 7, 15], ciclo_dias: 140, drenaje: DREN_TOLERANTE, pend_opt_max: 8, pend_lim_max: 25,
      costo_usd_ha: 35, rastrojo: .90, erosion: .90, raiz: .60, tol_sequia: .60, tol_anegamiento: .50 }),
    centeno: crop({ nombre: 'Centeno', tipo: 'cobertura', familia: 'poaceae',
      temp_opt: [6, 16], temp_lim: [0, 22], agua_opt: [180, 400], agua_lim: [100, 700],
      siembra_opt: [4, 1, 7, 1], ciclo_dias: 150, textura: TEX_LIVIANA, drenaje: DREN_TOLERANTE,
      pend_opt_max: 8, pend_lim_max: 25, costo_usd_ha: 35,
      rastrojo: 1, erosion: .90, raiz: .60, tol_sequia: .80, tol_anegamiento: .40 }),
    crotalaria: crop({ nombre: 'Crotalaria', tipo: 'cobertura', leguminosa: true, familia: 'fabaceae',
      temp_opt: [22, 30], temp_lim: [16, 35], agua_opt: [300, 600], agua_lim: [150, 900],
      ph_opt: [5.5, 7.0], ph_lim: [4.8, 8.0],
      siembra_opt: [11, 1, 1, 15], ciclo_dias: 120, margen_siembra_dias: 25, textura: TEX_LIVIANA,
      pend_opt_max: 8, pend_lim_max: 25, costo_usd_ha: 60, n_fijado: 80, n_residual: 55,
      rastrojo: .80, erosion: .70, raiz: .70, tol_sequia: .70, tol_anegamiento: .30 }),
    mijo: crop({ nombre: 'Mijo', tipo: 'cobertura', familia: 'poaceae',
      temp_opt: [22, 32], temp_lim: [16, 38], agua_opt: [250, 500], agua_lim: [130, 850],
      siembra_opt: [11, 1, 2, 1], ciclo_dias: 90, margen_siembra_dias: 25, textura: TEX_LIVIANA,
      drenaje: DREN_TOLERANTE, pend_opt_max: 8, pend_lim_max: 25, costo_usd_ha: 30,
      rastrojo: .90, erosion: .80, raiz: .60, tol_sequia: .90, tol_anegamiento: .30 }),
  };

  const PESOS_DEFECTO = { ingreso: .25, rapidez: .15, salud_suelo: .20, ahorro_insumos: .15, resiliencia: .15, cumplimiento: .10 };
  const PESO_MAX = 0.60;
  const N_BASE_SUELO = 60;

  // Clima: climatología mensual real de NASA POWER (ver fetch_power.js y power_climatology.json).
  // En Node se lee el JSON; en la página la build lo inlinea como window.POWER_CLIMATOLOGY.
  const POWER = (typeof module !== 'undefined' && module.exports) ? require('./power_climatology.json') : root.POWER_CLIMATOLOGY;
  const ZONAS = {};
  for (const id of Object.keys(POWER.zonas)) ZONAS[id] = POWER.zonas[id];
  const FUENTE_CLIMA = { nombre: 'NASA POWER', periodo: POWER.periodo, url: POWER.url, descargado: POWER.descargado };

  const FACTORES_ORDEN = ['epoca', 'cosecha', 'temperatura', 'agua', 'ph', 'textura', 'drenaje', 'pendiente'];
  const FACTORES_NOMBRE = {
    epoca: 'época de siembra', cosecha: 'ventana de cosecha', temperatura: 'temperatura del ciclo',
    agua: 'agua del ciclo', ph: 'pH', textura: 'textura', drenaje: 'drenaje', pendiente: 'pendiente',
  };
  const COMPONENTES_NOMBRE = {
    ingreso: 'Mayor rendimiento',
    rapidez: 'Menor espera a siembra',
    salud_suelo: 'Mejor salud de suelo',
    ahorro_insumos: 'Ahorro de insumos',
    resiliencia: 'Resiliencia climática',
    cumplimiento: 'Cumplimiento',
  };
  const COMPONENTES_DESC = {
    ingreso: 'Prioriza rinde esperado y margen económico',
    rapidez: 'Siembra inmediata en ventana óptima y ciclo más corto',
    salud_suelo: 'Rastrojo, rotación de familias y menor erosión',
    ahorro_insumos: 'Aprovecha fijación de N y crédito del antecesor',
    resiliencia: 'Tolerancia a sequía o anegamiento del lote',
    cumplimiento: 'Evita monocultivo y erosión en pendiente',
  };

  /* ---------- fechas (UTC) ---------- */
  const DAY = 86400000;
  function parseFecha(s) { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); }
  function fmtISO(d) { return d.toISOString().slice(0, 10); }
  function addDias(d, n) { return new Date(d.getTime() + n * DAY); }
  function diffDias(a, b) { return Math.round((a.getTime() - b.getTime()) / DAY); }
  function doy(d) { return Math.min(Math.round((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 0)) / DAY), 365); }
  function doyMD(m, dd) { return doy(new Date(Date.UTC(2001, m - 1, dd))); }
  function distCirc(a, b) { const d = Math.abs(a - b) % 365; return Math.min(d, 365 - d); }
  function diasFueraVentana(d, w) {
    const a = doyMD(w[0], w[1]), b = doyMD(w[2], w[3]), x = doy(d);
    const dentro = a <= b ? (x >= a && x <= b) : (x >= a || x <= b);
    return dentro ? 0 : Math.min(distCirc(x, a), distCirc(x, b));
  }
  function diasHastaVentana(d, w) {
    const a = doyMD(w[0], w[1]), x = doy(d);
    const delta = (((a - x) % 365) + 365) % 365;
    return [delta, addDias(d, delta)];
  }

  function cicloClima(zona, inicio, dias) {
    const z = ZONAS[zona] || ZONAS.pampa_humeda;
    let t = 0, p = 0;
    for (let i = 0; i < dias; i++) {
      const d = addDias(inicio, i), m = d.getUTCMonth();
      const dim = new Date(Date.UTC(d.getUTCFullYear(), m + 1, 0)).getUTCDate();
      t += z.temp[m]; p += z.precip[m] / dim;
    }
    return [t / dias, p];
  }

  const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
  function trapecio(x, limLo, optLo, optHi, limHi) {
    if (x < limLo || x > limHi) return 0;
    if (x >= optLo && x <= optHi) return 1;
    if (x < optLo) return optLo > limLo ? (x - limLo) / (optLo - limLo) : 1;
    return limHi > optHi ? (limHi - x) / (limHi - optHi) : 1;
  }

  function normalizarPesos(pesos) {
    const p = Object.assign({}, PESOS_DEFECTO);
    if (pesos) for (const k of Object.keys(PESOS_DEFECTO)) {
      if (k in pesos) {
        const v = Number(pesos[k]);
        if (!isFinite(v) || v < 0) throw new Error("Peso inválido para '" + k + "'");
        p[k] = v;
      }
    }
    let total = Object.values(p).reduce((a, b) => a + b, 0);
    if (total <= 0) throw new Error('La suma de pesos debe ser mayor que 0');
    for (const k in p) p[k] /= total;
    for (let it = 0; it < 5; it++) {
      let exceso = 0;
      for (const k in p) exceso += Math.max(0, p[k] - PESO_MAX);
      if (exceso <= 1e-9) break;
      const libres = Object.keys(p).filter(k => p[k] < PESO_MAX);
      const sl = libres.reduce((a, k) => a + p[k], 0) || 1;
      for (const k in p) p[k] = p[k] >= PESO_MAX ? PESO_MAX : p[k] + exceso * p[k] / sl;
    }
    return p;
  }

  /* ---------- aptitud ---------- */
  function aptitud(cid, lote, siembra, cosechaLimite) {
    const c = CULTIVOS[cid], ciclo = c.ciclo_dias;
    const [tMedia, precip] = cicloClima(lote.zona, siembra, ciclo);
    const precipEff = lote.riego ? Math.max(precip, c.agua_opt[0]) : precip;
    const f = {};
    f.epoca = clamp(1 - diasFueraVentana(siembra, c.siembra_opt) / c.margen_siembra_dias);
    f.cosecha = cosechaLimite ? clamp((diffDias(cosechaLimite, siembra) - 0.75 * ciclo) / (0.20 * ciclo)) : 1;
    f.temperatura = trapecio(tMedia, c.temp_lim[0], c.temp_opt[0], c.temp_opt[1], c.temp_lim[1]);
    f.agua = trapecio(precipEff, c.agua_lim[0], c.agua_opt[0], c.agua_opt[1], c.agua_lim[1]);
    f.ph = trapecio(lote.ph, c.ph_lim[0], c.ph_opt[0], c.ph_opt[1], c.ph_lim[1]);
    f.textura = c.textura[lote.textura] ?? .5;
    f.drenaje = c.drenaje[lote.drenaje] ?? .5;
    f.pendiente = trapecio(lote.pendiente, -1, 0, c.pend_opt_max, c.pend_lim_max);
    const razones = [];
    for (const k of FACTORES_ORDEN) if (f[k] <= 0) razones.push(razon(k, siembra, tMedia, precipEff, lote));
    let indice = 0;
    if (!razones.length) indice = Math.exp(FACTORES_ORDEN.reduce((s, k) => s + Math.log(f[k]), 0) / FACTORES_ORDEN.length);
    return { indice, factores: f, descartado: razones.length > 0, razones, tMedia, precip: precipEff };
  }
  function razon(k, siembra, t, p, lote) {
    const fmt = d => String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0');
    switch (k) {
      case 'epoca': return 'Fuera de la ventana de siembra (' + fmt(siembra) + ').';
      case 'cosecha': return 'El ciclo no llega a completarse antes de la fecha de cosecha elegida.';
      case 'temperatura': return 'Temperatura media esperada del ciclo (' + t.toFixed(1) + ' °C) fuera del rango tolerado.';
      case 'agua': return 'Agua esperada del ciclo (' + Math.round(p) + ' mm) fuera del rango tolerado.';
      case 'ph': return 'pH ' + lote.ph + ' fuera del rango tolerado.';
      case 'pendiente': return 'Pendiente ' + lote.pendiente + ' % excede el límite del cultivo.';
      default: return FACTORES_NOMBRE[k] + ' no apta.';
    }
  }

  /* ---------- componentes ---------- */
  const antecesor = lote => lote.historial.length ? lote.historial[lote.historial.length - 1] : null;

  function balanceNutrientes(cid, lote) {
    const c = CULTIVOS[cid], ant = antecesor(lote);
    const credito = ant && CULTIVOS[ant] ? CULTIVOS[ant].n_residual : 0;
    const aporte = N_BASE_SUELO + c.n_fijado + credito;
    const nRep = Math.max(0, c.n_ext - aporte);
    const cob = c.tipo === 'cobertura';
    return { n_extraido: c.n_ext, p_extraido: c.p_ext, k_extraido: c.k_ext, n_aportado: aporte,
      credito_antecesor_n: credito, n_a_reponer: Math.round(nRep),
      p_a_reponer: cob ? 0 : c.p_ext, k_a_reponer: cob ? 0 : c.k_ext };
  }
  function saludSuelo(cid, lote) {
    const c = CULTIVOS[cid], ant = antecesor(lote);
    let div, nota;
    if (!ant) { div = .7; nota = 'sin historial de antecesor'; }
    else if (ant === cid) { div = 0; nota = 'repite el cultivo del ciclo anterior'; }
    else if (CULTIVOS[ant].familia === c.familia) { div = .5; nota = 'misma familia botánica que el antecesor'; }
    else { div = 1; nota = 'rota la familia botánica respecto del antecesor'; }
    const pw = clamp(lote.pendiente / 8, .25, 1);
    const eros = 1 - pw * (1 - c.erosion);
    return [clamp(.30 * c.rastrojo + .25 * eros + .15 * c.raiz + .30 * div), nota];
  }
  function resiliencia(cid, lote) {
    const c = CULTIVOS[cid], rs = lote.riesgos.sequia ?? .5, ra = lote.riesgos.anegamiento ?? .5, tot = rs + ra;
    if (tot <= 0) return .5;
    return clamp(1 - (rs * (1 - c.tol_sequia) + ra * (1 - c.tol_anegamiento)) / tot);
  }
  function cumplimiento(c, cid, hist, pend) {
    let f = 1; const m = [];
    if (hist.length >= 2 && hist[hist.length - 1] === cid && hist[hist.length - 2] === cid) {
      f = Math.min(f, .5); m.push('R1: tercer ciclo consecutivo del mismo cultivo (monocultivo).');
    } else if (hist.length >= 1 && hist[hist.length - 1] === cid && c.tipo === 'comercial') {
      f = Math.min(f, .8); m.push('R1: repite el cultivo del ciclo anterior.');
    }
    if (pend > 5 && c.erosion < .4) { f = Math.min(f, .7); m.push('R2: pendiente > 5 % con baja protección contra la erosión.'); }
    return [f, m];
  }

  function evaluarCultivo(cid, lote, siembra, cosechaLimite) {
    const c = CULTIVOS[cid], apt = aptitud(cid, lote, siembra, cosechaLimite);
    const base = { cultivo: cid, nombre: c.nombre, tipo: c.tipo, apt };
    if (apt.descartado) { base.descartado = true; return base; }
    const rend = c.rend_t_ha * apt.indice;
    const margen = rend * c.precio_usd_t - c.costo_usd_ha;
    const bal = balanceNutrientes(cid, lote);
    const [salud, notaDiv] = saludSuelo(cid, lote);
    const [cumpl, motivos] = cumplimiento(c, cid, lote.historial, lote.pendiente);

    // Rapidez: siembra inmediata en ventana óptima (65%) + ciclo corto para liberar el lote antes (35%)
    const factorCicloCorto = clamp(1 - (c.ciclo_dias - 90) / 100);
    const rapidezScore = clamp(0.65 * apt.factores.epoca + 0.35 * factorCicloCorto);

    Object.assign(base, {
      descartado: false, margen_usd_ha: Math.round(margen), rend_relativo_t_ha: Math.round(rend * 100) / 100,
      ciclo_dias: c.ciclo_dias,
      balance: bal,
      comp: {
        ingreso: null,
        rapidez: rapidezScore,
        salud_suelo: salud,
        ahorro_insumos: 1 - clamp(bal.n_a_reponer / 150),
        resiliencia: resiliencia(cid, lote),
        cumplimiento: cumpl
      },
      notaDiv, motivos, siembra: fmtISO(siembra), cosecha_estimada: fmtISO(addDias(siembra, c.ciclo_dias)),
    });
    return base;
  }

  function alertas(e, siembra) {
    const c = CULTIVOS[e.cultivo], out = [], f = e.apt.factores;
    if (f.epoca < .7) {
      const [dias, cuando] = diasHastaVentana(siembra, c.siembra_opt);
      if (dias > 0 && dias <= 90) {
        out.push('Conviene esperar: la ventana óptima de siembra empieza el ' +
          String(cuando.getUTCDate()).padStart(2, '0') + '/' + String(cuando.getUTCMonth() + 1).padStart(2, '0') + ' (en ' + dias + ' días).');
      } else out.push('La fecha elegida está en el borde de la ventana de siembra: aptitud reducida.');
    }
    if (f.cosecha < 1) out.push('La fecha de cosecha elegida deja poco margen para completar el ciclo.');
    for (const m of e.motivos) out.push(m);
    if (f.agua < .6) out.push('Agua esperada del ciclo en el borde del rango: riesgo hídrico.');
    return out;
  }

  function explicacion(e) {
    const ord = Object.entries(e.componentes).sort((a, b) => b[1] - a[1]);
    const f = e.apt.factores;
    const peor = Object.keys(f).reduce((a, k) => (f[k] < f[a] ? k : a), 'epoca');
    const partes = [
      e.nombre + ': score ' + Math.round(e.score) + '/100, con aptitud de ' + Math.round(e.apt.indice * 100) + ' % para este lote en esta fecha.',
      'Puntos fuertes: ' + ord.slice(0, 2).map(([k, v]) => COMPONENTES_NOMBRE[k] + ' (' + Math.round(v) + ')').join(' y ') + '.',
      'Punto más débil: ' + COMPONENTES_NOMBRE[ord[ord.length - 1][0]].toLowerCase() + ' (' + Math.round(ord[ord.length - 1][1]) + ').',
      'Factor de aptitud más limitante: ' + FACTORES_NOMBRE[peor] + ' (' + Math.round(f[peor] * 100) + ' %).',
      'Rotación: ' + e.notaDiv + '.',
    ];
    if (e.balance.credito_antecesor_n) partes.push('El antecesor deja ~' + e.balance.credito_antecesor_n + ' kg N/ha disponibles para este ciclo.');
    if (e.tipo === 'cobertura') partes.push('Es un cultivo de cobertura: su valor está en el suelo y en el ahorro de insumos del ciclo siguiente, no en el ingreso directo.');
    return partes.join(' ');
  }

  function recomendar(lote, siembra, cosechaLimite, pesos, topN) {
    const pn = normalizarPesos(pesos);
    const evals = {};
    for (const cid of Object.keys(CULTIVOS)) evals[cid] = evaluarCultivo(cid, lote, siembra, cosechaLimite || null);
    const viables = Object.values(evals).filter(e => !e.descartado);
    const ref = Math.max(0, ...viables.filter(e => e.tipo === 'comercial' && e.margen_usd_ha > 0).map(e => e.margen_usd_ha));
    for (const e of viables) e.comp.ingreso = (ref > 0 && e.margen_usd_ha > 0) ? clamp(e.margen_usd_ha / ref) : 0;
    for (const e of viables) {
      const mezcla = Object.keys(pn).reduce((s, k) => s + pn[k] * e.comp[k], 0);
      e.score = Math.round(1000 * e.apt.indice * mezcla) / 10;
      e.componentes = {}; e.aporte = {};
      for (const k of Object.keys(e.comp)) {
        e.componentes[k] = Math.round(1000 * e.comp[k]) / 10;
        e.aporte[k] = 100 * e.apt.indice * pn[k] * e.comp[k]; // suma = score
      }
      e.alertas = alertas(e, siembra);
      e.explicacion = explicacion(e);
      e.aptitud_pct = Math.round(1000 * e.apt.indice) / 10;
    }
    viables.sort((a, b) => b.score - a.score);
    viables.forEach((e, i) => { e.posicion = i + 1; });
    return {
      fecha_siembra: fmtISO(siembra), pesos: pn, top: viables.slice(0, topN || 5), ranking: viables,
      descartados: Object.values(evals).filter(e => e.descartado).map(e => ({ cultivo: e.cultivo, nombre: e.nombre, tipo: e.tipo, razones: e.apt.razones })),
      rotacion_actual: rotacionActual(lote, viables, evals),
    };
  }

  function rotacionActual(lote, viables, evals) {
    const seq = lote.rotacion_habitual.filter(c => CULTIVOS[c]);
    if (!seq.length) return { disponible: false };
    const ant = antecesor(lote), idx = seq.indexOf(ant);
    const prox = idx >= 0 ? seq[(idx + 1) % seq.length] : seq[0];
    const ev = evals[prox], mejor = viables[0] || null;
    const out = { disponible: true, secuencia: seq, proximo: prox, nombre: CULTIVOS[prox].nombre, total: viables.length,
      mejor: mejor ? { cultivo: mejor.cultivo, nombre: mejor.nombre, score: mejor.score } : null };
    if (ev.descartado) return Object.assign(out, { viable: false, score: 0, idoneidad: 0, posicion: null, razones: ev.apt.razones,
      nota: 'El próximo cultivo de tu rotación habitual no es viable en esta fecha.' });
    const pos = viables.find(e => e.cultivo === prox).posicion;
    const idon = mejor && mejor.score > 0 ? Math.round(1000 * ev.score / mejor.score) / 10 : 0;
    const nota = pos === 1 ? 'Tu rotación habitual coincide con la mejor opción.'
      : idon >= 90 ? 'Tu rotación habitual está muy cerca de la mejor opción.'
      : 'Hay ' + (pos - 1) + ' alternativa(s) con mejor score para este lote y fecha.';
    return Object.assign(out, { viable: true, score: ev.score, idoneidad: idon, posicion: pos, nota });
  }

  /* ---------- rotaciones de varias campañas ----------
     Encadena el mismo evaluador campaña por campaña durante un horizonte fijo.
     Referencias fijas (no relativas a otros cultivos) para que el puntaje de una
     rotación no dependa de qué otras rotaciones se comparan. Valores ILUSTRATIVOS. */
  const HORIZONTE_ANIOS = 3;
  const REF_MARGEN_ANUAL = 900; // USD/ha/año que equivale a ingreso = 100
  const REF_N_ANUAL = 250;      // kg N/ha/año a reponer que equivale a ahorro = 0
  const PAUSA_DIAS = 7;         // entre cosecha y siembra siguiente
  const COB_MIN_DIAS = 45;      // una cobertura más corta que esto no se siembra

  function proximaSiembra(cid, cursor) {
    const c = CULTIVOS[cid], w = c.siembra_opt;
    const fuera = diasFueraVentana(cursor, w);
    if (fuera === 0) return cursor;
    const atrasado = distCirc(doy(cursor), doyMD(w[2], w[3])) === fuera;
    if (atrasado && fuera <= c.margen_siembra_dias * 0.4) return cursor; // tarde pero todavía razonable
    return diasHastaVentana(cursor, w)[1];
  }

  // Arranca la secuencia por el cultivo que se puede sembrar antes, sin cambiar el orden.
  // Evita arrancar repitiendo el último cultivo del lote.
  function offsetInicio(seq, inicio, ant) {
    let mejor = 0, min = Infinity;
    seq.forEach((cid, i) => {
      const w = diffDias(proximaSiembra(cid, inicio), inicio) + (cid === ant && seq.length > 1 ? 120 : 0);
      if (w < min) { min = w; mejor = i; }
    });
    return mejor;
  }

  function evaluarRotacion(lote, secuencia, inicio, pesos) {
    const seq = secuencia.filter(c => CULTIVOS[c]);
    const pn = normalizarPesos(pesos);
    const fin = addDias(inicio, Math.round(HORIZONTE_ANIOS * 365.25));
    const H = diffDias(fin, inicio), anios = H / 365.25;
    const pasos = [], omitidos = [];
    if (!seq.length) return null;
    let hist = lote.historial.slice(), cursor = inicio, i = offsetInicio(seq, inicio, antecesor(lote));
    for (let guard = 0; guard < 60; guard++) {
      const cid = seq[i % seq.length], c = CULTIVOS[cid];
      i++;
      const siembra = proximaSiembra(cid, cursor);
      if (siembra >= fin) break;
      let finCiclo = addDias(siembra, c.ciclo_dias), cortada = false;
      if (c.tipo === 'cobertura' && seq.length > 1) {
        const sigue = proximaSiembra(seq[i % seq.length], addDias(siembra, COB_MIN_DIAS));
        const tope = addDias(sigue, -10);
        if (tope < finCiclo) { finCiclo = tope; cortada = true; }
        if (diffDias(finCiclo, siembra) < COB_MIN_DIAS) {
          omitidos.push({ cultivo: cid, nombre: c.nombre, fecha: fmtISO(siembra) });
          cursor = addDias(siembra, 1);
          continue;
        }
      }
      const ev = evaluarCultivo(cid, Object.assign({}, lote, { historial: hist }), siembra, null);
      const dur = diffDias(finCiclo, siembra);
      const dias = Math.max(0, diffDias(finCiclo > fin ? fin : finCiclo, siembra));
      const frac = dur > 0 ? dias / dur : 0;
      const p = { cultivo: cid, nombre: c.nombre, tipo: c.tipo, siembra: fmtISO(siembra), fin: fmtISO(finCiclo),
        desde: diffDias(siembra, inicio), dias, cortada, viable: !ev.descartado,
        aptitud: ev.descartado ? 0 : ev.apt.indice, epoca: ev.apt.factores.epoca, razones: ev.apt.razones };
      if (p.viable) Object.assign(p, { margen: ev.margen_usd_ha * frac, n_rep: ev.balance.n_a_reponer * frac,
        salud: ev.comp.salud_suelo, rapidez: ev.comp.rapidez, resil: ev.comp.resiliencia, cumpl: ev.comp.cumplimiento, motivos: ev.motivos });
      pasos.push(p);
      if (p.viable) hist = hist.concat([cid]);
      cursor = addDias(finCiclo, c.tipo === 'cobertura' ? 1 : PAUSA_DIAS);
    }
    const ok = pasos.filter(p => p.viable);
    const cubiertos = ok.reduce((s, p) => s + p.dias, 0);
    const cobertura = clamp(cubiertos / H);
    const wmean = k => cubiertos > 0 ? ok.reduce((s, p) => s + p[k] * p.dias, 0) / cubiertos : 0;
    const margenAnual = ok.reduce((s, p) => s + p.margen, 0) / anios;
    const nAnual = ok.reduce((s, p) => s + p.n_rep, 0) / anios;
    const comp = {
      ingreso: clamp(margenAnual / REF_MARGEN_ANUAL),
      rapidez: ok.length ? ok.reduce((s, p) => s + p.rapidez, 0) / ok.length : 0,
      salud_suelo: clamp(.5 * wmean('salud') + .5 * cobertura),
      ahorro_insumos: 1 - clamp(nAnual / REF_N_ANUAL),
      resiliencia: wmean('resil'),
      cumplimiento: ok.length ? Math.min(...ok.map(p => p.cumpl)) : 0,
    };
    const aptMedia = pasos.length ? pasos.reduce((s, p) => s + p.aptitud, 0) / pasos.length : 0;
    const mezcla = Object.keys(pn).reduce((s, k) => s + pn[k] * comp[k], 0);
    const componentes = {}, aporte = {};
    for (const k of Object.keys(comp)) { componentes[k] = Math.round(1000 * comp[k]) / 10; aporte[k] = 100 * aptMedia * pn[k] * comp[k]; }
    const alertas = [];
    pasos.filter(p => !p.viable).forEach(p => alertas.push(p.nombre + ' (' + p.siembra.slice(0, 7) + '): no viable. ' + (p.razones[0] || '')));
    pasos.filter(p => p.viable && p.epoca < .7).forEach(p => alertas.push(p.nombre + ' se siembra fuera de la ventana óptima (' + p.siembra + ').'));
    omitidos.forEach(o => alertas.push(o.nombre + ' no entra entre cultivos (' + o.fecha.slice(0, 7) + '): queda barbecho.'));
    const motivos = [...new Set(ok.flatMap(p => p.motivos))];
    return {
      secuencia: seq, pasos, inicio: fmtISO(inicio), fin: fmtISO(fin), horizonte_dias: H,
      comp, componentes, aporte, aptitud_media: aptMedia, score: Math.round(1000 * aptMedia * mezcla) / 10,
      indicadores: {
        cobertura_pct: Math.round(100 * cobertura), barbecho_dias: H - cubiertos,
        margen_anual: Math.round(margenAnual), n_anual: Math.round(nAnual),
        familias: new Set(ok.map(p => CULTIVOS[p.cultivo].familia)).size,
        cultivos_anio: Math.round(10 * ok.length / anios) / 10,
        coberturas: ok.filter(p => p.tipo === 'cobertura').length,
      },
      alertas: alertas.concat(motivos),
    };
  }

  // Diferencias legibles de una rotación frente a la actual: [signo, texto].
  function diferencias(r, base) {
    const I = r.indicadores, B = base.indicadores, out = [];
    const add = (d, u, pos, neg) => { if (d >= u) out.push(['+', pos]); else if (d <= -u) out.push(['-', neg]); };
    add(I.cobertura_pct - B.cobertura_pct, 5, 'Suelo cubierto el ' + I.cobertura_pct + ' % del tiempo (actual: ' + B.cobertura_pct + ' %).',
      'Suelo cubierto solo el ' + I.cobertura_pct + ' % del tiempo (actual: ' + B.cobertura_pct + ' %).');
    add(I.familias - B.familias, 1, 'Más diversidad: ' + I.familias + ' familias botánicas (actual: ' + B.familias + ').',
      'Menos diversidad: ' + I.familias + ' familias botánicas (actual: ' + B.familias + ').');
    add(B.n_anual - I.n_anual, 15, 'Menos nitrógeno a reponer: ~' + I.n_anual + ' kg/ha/año (actual: ' + B.n_anual + ').',
      'Más nitrógeno a reponer: ~' + I.n_anual + ' kg/ha/año (actual: ' + B.n_anual + ').');
    add(I.margen_anual - B.margen_anual, 50, 'Mayor margen ilustrativo: USD ' + I.margen_anual + '/ha/año (actual: ' + B.margen_anual + ').',
      'Menor margen ilustrativo: USD ' + I.margen_anual + '/ha/año (actual: ' + B.margen_anual + ').');
    add(100 * (r.comp.resiliencia - base.comp.resiliencia), 5, 'Cultivos más tolerantes a la sequía y al anegamiento de este lote.',
      'Cultivos menos tolerantes a la sequía y al anegamiento de este lote.');
    add(100 * (r.comp.cumplimiento - base.comp.cumplimiento), 5, 'Evita repetir el mismo cultivo.', 'Repite el mismo cultivo.');
    if (I.cultivos_anio - B.cultivos_anio >= .4) out.push(['-', 'Más campañas por año: más trabajo y más complejidad de manejo.']);
    return out;
  }

  function compararRotaciones(lote, rotaciones, inicio, pesos) {
    const evs = rotaciones.map(r => Object.assign({ id: r.id, nombre: r.nombre }, evaluarRotacion(lote, r.seq, inicio, pesos)));
    const base = evs[0];
    evs.forEach((e, i) => { e.diferencias = i === 0 || !e.pasos ? [] : diferencias(e, base); });
    const orden = evs.filter(e => e.pasos).slice().sort((a, b) => b.score - a.score);
    orden.forEach((e, i) => { e.posicion = i + 1; });
    return { rotaciones: evs, mejor: orden[0] || null, pesos: normalizarPesos(pesos), horizonte_anios: HORIZONTE_ANIOS };
  }

  const API = { CULTIVOS, ZONAS, FUENTE_CLIMA, TEXTURAS, DRENAJES, PESOS_DEFECTO, PESO_MAX, COMPONENTES_NOMBRE, COMPONENTES_DESC, FACTORES_NOMBRE,
    HORIZONTE_ANIOS, REF_MARGEN_ANUAL, recomendar, evaluarRotacion, compararRotaciones, normalizarPesos, parseFecha, fmtISO, addDias };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Motor = API;
})(typeof window !== 'undefined' ? window : globalThis);
