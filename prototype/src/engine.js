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

  // Escenarios climáticos: campañas agrícolas REALES (julio a junio) de la serie de NASA POWER.
  // promedio = climatología 2001–2025 (referencia), seco = campaña con menos lluvia, húmedo = con más lluvia.
  // No hay escenario "año normal": ninguna campaña real se parece al promedio mes a mes.
  const ESCENARIOS_ORDEN = ['promedio', 'seco', 'humedo'];
  const ESCENARIOS = {}, CAMPANIAS = {}, SECUENCIAS = {};
  const PISO_CLIMA = 0.15; // aptitud climática mínima de un cultivo ya sembrado (cosecha fallida)
  function prepararZona(zid) {
    const z = ZONAS[zid];
    const totalProm = z.precip.reduce((a, b) => a + b, 0);
    const camp = [], s = z.serie || {};
    for (const y of Object.keys(s).map(Number).sort((a, b) => a - b)) {
      if (!s[y + 1]) continue;
      const temp = s[y + 1].temp.slice(0, 6).concat(s[y].temp.slice(6));       // ene..dic
      const precip = s[y + 1].precip.slice(0, 6).concat(s[y].precip.slice(6)); // ene..jun de y+1, jul..dic de y
      if (temp.concat(precip).some(v => v === null || v === undefined)) continue;
      camp.push({ campania: y + '/' + String(y + 1).slice(2), temp, precip, total: precip.reduce((a, b) => a + b, 0) });
    }
    const esc = { promedio: { id: 'promedio', nombre: 'Clima promedio', campania: POWER.periodo, temp: z.temp, precip: z.precip, total: totalProm } };
    for (const c of camp) esc['c' + c.campania.slice(0, 4)] = Object.assign({ id: 'c' + c.campania.slice(0, 4), nombre: 'Campaña ' + c.campania }, c);
    CAMPANIAS[zid] = camp.map(c => 'c' + c.campania.slice(0, 4));
    // Secuencias: 3 campañas reales consecutivas (la que arranca y las dos siguientes), en lugar de repetir un año.
    const anioDe = c => +c.campania.slice(0, 4), hay = new Set(camp.map(anioDe));
    const seqs = camp.map(anioDe).filter(y => [1, 2].every(k => hay.has(y + k)));
    for (const y of seqs) esc['s' + y] = { id: 's' + y, nombre: 'Campañas ' + y + '/' + String(y + 1).slice(2) + ' a ' + (y + 2) + '/' + String(y + 3).slice(2),
      secuencia: y, campania: y + '/' + String(y + 1).slice(2), temp: esc['c' + y].temp, precip: esc['c' + y].precip, total: esc['c' + y].total };
    SECUENCIAS[zid] = seqs.map(y => 's' + y);
    if (camp.length) {
      const ord = camp.slice().sort((a, b) => a.total - b.total);
      const elegir = (id, nombre, c) => (esc[id] = Object.assign({ id, nombre }, c));
      elegir('seco', 'Año seco', ord[0]);
      elegir('humedo', 'Año húmedo', ord[ord.length - 1]);
      // El año seco y el húmedo arrancan una secuencia real (si hay 2 campañas después; si no, la terminan).
      const ys = new Set(seqs), ultima = seqs[seqs.length - 1];
      for (const k of ['seco', 'humedo']) {
        const y = anioDe(esc[k]);
        esc[k].secuencia = ys.has(y) ? y : (ys.has(y - 2) ? y - 2 : (ys.has(y - 1) ? y - 1 : null));
        if (esc[k].secuencia === null && ultima != null) esc[k].secuencia = ultima;
      }
    }
    for (const e of Object.values(esc)) e.anomalia_pct = Math.round(100 * (e.total - totalProm) / totalProm);
    ESCENARIOS[zid] = esc;
  }
  for (const zid of Object.keys(ZONAS)) prepararZona(zid);

  // Convierte la respuesta JSON de la API mensual de NASA POWER (T2M, PRECTOTCORR) en una zona climática:
  // promedio mensual del período + serie año por año. Misma cuenta que fetch_power.js.
  function climaDesdePower(j, ini, fin) {
    const T = j.properties.parameter.T2M, P = j.properties.parameter.PRECTOTCORR;
    const dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
    const ok = v => v !== undefined && v !== null && v > -900;
    const serie = {}, st = Array(12).fill(0), sp = Array(12).fill(0), n = Array(12).fill(0);
    for (let y = ini; y <= fin; y++) {
      const t = [], pr = [];
      for (let m = 1; m <= 12; m++) {
        const k = String(y) + String(m).padStart(2, '0'), tv = T[k], pv = P[k];
        if (ok(tv) && ok(pv)) {
          t.push(Math.round(tv * 10) / 10); pr.push(Math.round(pv * dim(y, m)));
          st[m - 1] += tv; sp[m - 1] += pv * dim(y, m); n[m - 1]++;
        } else { t.push(null); pr.push(null); }
      }
      serie[y] = { temp: t, precip: pr };
    }
    if (n.some(x => !x)) throw new Error('NASA POWER no devolvió datos para todos los meses');
    return { temp: st.map((v, i) => Math.round(v / n[i] * 10) / 10), precip: sp.map((v, i) => Math.round(v / n[i])), serie };
  }
  // Agrega una zona climática en tiempo de ejecución (p. ej. la celda de NASA POWER de un lote nuevo).
  function registrarZona(id, datos) { ZONAS[id] = datos; prepararZona(id); return ZONAS[id]; }

  /* Rendimientos oficiales de MAGyP (Estimaciones Agrícolas, por departamento) agregados por zona, y resultado del gate de ML:
     rendimiento medio 2000-2024 sobre superficie cosechada (t/ha) y, si el clima de la ventana crítica pasó la validación
     dejando un año afuera (docs/decisions.md D1), la anomalía de rendimiento prevista para cada campaña (siempre fuera de muestra).
     Lo genera pipeline/ (python pipeline/run_all.py) y queda en rend_magyp.json; en Node se lee el JSON y en la página la build
     lo inlinea como window.REND_MAGYP. Sin tocar a mano. */
  const REND_MAGYP = (typeof module !== 'undefined' && module.exports) ? require('./rend_magyp.json') : root.REND_MAGYP;
  for (const z of Object.keys(REND_MAGYP)) if (ZONAS[z]) ZONAS[z].rend = REND_MAGYP[z];
  /* Precios a cosecha y costos directos por región: informe de Resultados Agrícolas de MAGyP (campaña 2026/27,
     septiembre 2026). Precios = cotizaciones a futuro de la Bolsa de Cereales de Buenos Aires. Margen bruto de
     campo propio (sin arrendamiento ni estructura): MB = rinde x precio x (1 - c_com) - gastos_dir. */
  /* BEGIN ECON_MAGYP (generado por field-shift/scripts/export_econ_magyp.py; no editar a mano) */
  const ECON_MAGYP = {"pampa_humeda":{"trigo":{"precio_usd_t":226.0,"rinde_ref_t_ha":4.18,"c_com":0.2712,"gastos_dir_usd_ha":449.2,"mb_informe_usd_ha":239.9,"estructura_usd_ha":95.5},"maiz":{"precio_usd_t":205.5,"rinde_ref_t_ha":8.08,"c_com":0.2967,"gastos_dir_usd_ha":617.3,"mb_informe_usd_ha":551.1,"estructura_usd_ha":238.7},"soja":{"precio_usd_t":360.0,"rinde_ref_t_ha":3.65,"c_com":0.2205,"gastos_dir_usd_ha":319.5,"mb_informe_usd_ha":703.9,"estructura_usd_ha":238.7},"girasol":{"precio_usd_t":400.0,"rinde_ref_t_ha":2.81,"c_com":0.1953,"gastos_dir_usd_ha":376.3,"mb_informe_usd_ha":527.6,"estructura_usd_ha":238.7},"cebada":{"precio_usd_t":225.0,"rinde_ref_t_ha":4.13,"c_com":0.272,"gastos_dir_usd_ha":381.1,"mb_informe_usd_ha":295.1,"estructura_usd_ha":95.5},"sorgo":{"precio_usd_t":198.0,"rinde_ref_t_ha":5.92,"c_com":0.3039,"gastos_dir_usd_ha":479.2,"mb_informe_usd_ha":337.4,"estructura_usd_ha":238.7}},"entre_rios":{"trigo":{"precio_usd_t":226.0,"rinde_ref_t_ha":2.97,"c_com":0.2949,"gastos_dir_usd_ha":357.0,"mb_informe_usd_ha":116.5,"estructura_usd_ha":44.1},"maiz":{"precio_usd_t":205.5,"rinde_ref_t_ha":5.53,"c_com":0.3226,"gastos_dir_usd_ha":577.8,"mb_informe_usd_ha":191.4,"estructura_usd_ha":110.2},"soja":{"precio_usd_t":360.0,"rinde_ref_t_ha":2.49,"c_com":0.2353,"gastos_dir_usd_ha":291.5,"mb_informe_usd_ha":393.1,"estructura_usd_ha":110.2},"girasol":{"precio_usd_t":400.0,"rinde_ref_t_ha":1.94,"c_com":0.1954,"gastos_dir_usd_ha":331.7,"mb_informe_usd_ha":292.7,"estructura_usd_ha":110.2},"cebada":{"precio_usd_t":225.0,"rinde_ref_t_ha":3.28,"c_com":0.2956,"gastos_dir_usd_ha":315.7,"mb_informe_usd_ha":204.1,"estructura_usd_ha":44.1},"sorgo":{"precio_usd_t":198.0,"rinde_ref_t_ha":4.6,"c_com":0.3308,"gastos_dir_usd_ha":410.5,"mb_informe_usd_ha":198.5,"estructura_usd_ha":110.2}}};
  /* END ECON_MAGYP */
  for (const z of Object.keys(ECON_MAGYP)) if (ZONAS[z]) ZONAS[z].econ = ECON_MAGYP[z];
  const MAGYP_DE = { soja: 'soja', maiz_temprano: 'maiz', maiz_tardio: 'maiz', girasol: 'girasol', sorgo: 'sorgo',
    trigo: 'trigo', cebada: 'cebada' };
  const FACTOR_MAIZ_TARDIO = 0.83; // = 7,5 / 9 del catálogo ilustrativo; MAGyP no separa maíz temprano de tardío (supuesto)
  /* Margen bruto USD/ha para un rendimiento dado: con precios y costos oficiales si existen; si no, el catálogo. */
  function econDe(cid, zona) {
    const z = ZONAS[zona] || ZONAS.pampa_humeda, k = MAGYP_DE[cid];
    return (k && z.econ && z.econ[k]) || null;
  }
  function margenUsd(cid, zona, rend) {
    const c = CULTIVOS[cid], e = econDe(cid, zona);
    return e ? rend * e.precio_usd_t * (1 - e.c_com) - e.gastos_dir_usd_ha : rend * c.precio_usd_t - c.costo_usd_ha;
  }
  /* Rendimiento base del cultivo en la zona: observado (MAGyP) si existe; si no, el del catálogo (ilustrativo). */
  function rendBase(cid, zona) {
    const c = CULTIVOS[cid], z = ZONAS[zona] || ZONAS.pampa_humeda, k = MAGYP_DE[cid], r = k && z.rend && z.rend[k];
    if (!r) return { t_ha: c.rend_t_ha, fuente: 'ilustrativo', modelo: null };
    if (cid === 'maiz_tardio') return { t_ha: r.t_ha * FACTOR_MAIZ_TARDIO, fuente: 'observado · MAGyP (ajuste supuesto para tardío)', modelo: null, r };
    return { t_ha: r.t_ha, fuente: 'observado · MAGyP', r,
      modelo: r.pasa_gate && r.anomalia_prevista ? { anomalia_prevista: r.anomalia_prevista, r2_loyo: r.r2_loyo } : null };
  }

  /* Año de la campaña real que se está simulando (null = clima promedio). */
  // Campaña agrícola (julio a junio) de una fecha: la que empieza en julio de ese año o del anterior.
  const campDe = d => d.getUTCFullYear() - (d.getUTCMonth() < 6 ? 1 : 0);
  // Campaña HISTÓRICA que corresponde a una fecha simulada, según el escenario del lote:
  //   'cAAAA' (o seco/húmedo sin secuencia) = siempre esa campaña; 'sAAAA' = campañas consecutivas desde el inicio del plan.
  //   null = clima promedio.
  function campHist(lote, d) {
    const zz = ZONAS[lote.zona] ? lote.zona : 'pampa_humeda', e = lote.escenario && ESCENARIOS[zz] && ESCENARIOS[zz][lote.escenario];
    if (!e || lote.escenario === 'promedio' || !e.campania) return null;
    if (e.secuencia != null && lote.escC0 != null) return e.secuencia + (campDe(d) - lote.escC0);
    const y = parseInt(String(e.campania).slice(0, 4), 10);
    return isFinite(y) ? y : null;
  }
  function anioEscenario(lote, siembra) {
    if (!siembra) { const zz = ZONAS[lote.zona] ? lote.zona : 'pampa_humeda', e = lote.escenario && ESCENARIOS[zz] && ESCENARIOS[zz][lote.escenario];
      return e && lote.escenario !== 'promedio' && e.campania ? parseInt(e.campania, 10) : null; }
    return campHist(lote, siembra);
  }

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
    resiliencia: 'Cómo se sostiene en los peores años reales (NASA POWER)',
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

  function cicloClima(zona, inicio, dias, escenario, lote) {
    const zz = ZONAS[zona] ? zona : 'pampa_humeda';
    // Campaña real (repetida o en secuencia): cada día toma el mes de su año histórico en la serie mensual.
    if (lote && escenario && escenario !== 'promedio' && ZONAS[zz].serie) {
      let t = 0, p = 0, ok = true;
      for (let i = 0; i < dias && ok; i++) {
        const d = addDias(inicio, i), m = d.getUTCMonth(), ch = campHist(lote, d);
        const s = ch === null ? null : ZONAS[zz].serie[ch + (m < 6 ? 1 : 0)];
        if (!s || s.temp[m] == null || s.precip[m] == null) { ok = false; break; }
        t += s.temp[m]; p += s.precip[m] / new Date(Date.UTC(d.getUTCFullYear(), m + 1, 0)).getUTCDate();
      }
      if (ok) return [t / dias, p];
    }
    const z = (escenario && ESCENARIOS[zz][escenario]) || ZONAS[zz];
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

  /* ---------- clima diario de NASA POWER (2001–2025) ----------
     power_diario.json: precipitación, T máx/mín/media, GWETROOT (humedad radicular modelada, regional) y ET0 FAO-56
     calculada con RH2M, WS2M y radiación. Solo para las celdas precargadas; el resto usa la serie mensual.
     UMBRALES y KC son SUPUESTOS documentados: marcan eventos, no pérdidas de rendimiento confirmadas. */
  const DIARIO = (() => {
    if (typeof module !== 'undefined' && module.exports) { try { return require('./power_diario.json'); } catch (e) { return null; } }
    return root.POWER_DIARIO || null;
  })();
  // Calor: días por encima del percentil 90 de las máximas de verano (dic–feb) de la propia celda, y nunca menos de
  // 35 °C. Así "extremo" es raro para ese lugar y no depende del sesgo absoluto del reanálisis.
  const UMBRALES = { lluvia_util_mm: 1, calor_min_c: 35, calor_pct: 0.9, helada_c: 0, helada_invierno_c: -4, lluvia_intensa_mm: 50,
    seca_dias: 20, gwet_bajo: 0.4, deficit_ratio: 0.6, critico: [0.45, 0.70] };
  // Coeficiente de cultivo medio del ciclo (aprox. FAO-56, tabla 12). ETc = Kc × ET0.
  const KC = { soja: .85, maiz_temprano: .95, maiz_tardio: .95, girasol: .85, sorgo: .8, trigo: .8, cebada: .8,
    vicia: .7, avena: .7, centeno: .7, crotalaria: .7, mijo: .7 };
  const INVIERNO = new Set(['trigo', 'cebada', 'vicia', 'avena', 'centeno']); // toleran heladas leves
  const DIA = 86400000;
  const diarioDe = zid => (DIARIO && DIARIO.zonas && DIARIO.zonas[zid]) || null;
  const UMBRAL_CALOR = {};
  function umbralCalor(zid) {
    if (UMBRAL_CALOR[zid] != null) return UMBRAL_CALOR[zid];
    // Una zona hipotética (clima perturbado) conserva el umbral de su celda original: si no, al subir la
    // temperatura también subiría el percentil 90 y la ola de calor no contaría días de más.
    if (diarioDe(zid) && diarioDe(zid).umbral_calor) return (UMBRAL_CALOR[zid] = diarioDe(zid).umbral_calor);
    const z = diarioDe(zid), b = z ? baseDiario(z) : 0, v = [];
    if (z) z.tmax.forEach((t, i) => { const m = new Date(b + i * DIA).getUTCMonth(); if (t != null && (m === 11 || m <= 1)) v.push(t); });
    return (UMBRAL_CALOR[zid] = Math.max(UMBRALES.calor_min_c, v.length ? Math.round(10 * cuantil(v, UMBRALES.calor_pct)) / 10 : UMBRALES.calor_min_c));
  }
  const baseDiario = z => Date.UTC(+z.inicio.slice(0, 4), +z.inicio.slice(4, 6) - 1, +z.inicio.slice(6, 8));
  // Índice del día histórico (mismo día y mes, en el año histórico dado); 29/2 → 28/2.
  function idxHist(z, anio, d) {
    const m = d.getUTCMonth(), dd = (m === 1 && d.getUTCDate() === 29) ? 28 : d.getUTCDate();
    const i = Math.round((Date.UTC(anio, m, dd) - baseDiario(z)) / DIA);
    return i >= 0 && i < z.n ? i : -1;
  }
  // Eventos y balance hídrico de un cultivo sembrado en `siembra` con el clima diario de la campaña histórica que
  // le toca según el escenario del lote. null si no hay serie diaria o el escenario es el clima promedio.
  // `hasta` (opcional): cuenta solo los primeros `hasta` días del ciclo (mismas reglas), para ver el estrés
  // acumulado a una fecha. Sin `hasta` se recorre el ciclo completo, que es lo que usa la aptitud.
  function climaDiarioCiclo(cid, lote, siembra, hasta) {
    const zid = ZONAS[lote.zona] ? lote.zona : null, z = zid && diarioDe(zid), c = CULTIVOS[cid];
    if (!z || !lote.escenario || lote.escenario === 'promedio') return null;
    const n = c.ciclo_dias, c0 = Math.floor(UMBRALES.critico[0] * n), c1 = Math.ceil(UMBRALES.critico[1] * n);
    const frio = INVIERNO.has(cid) ? UMBRALES.helada_invierno_c : UMBRALES.helada_c, caliente = umbralCalor(zid);
    let P = 0, ET = 0, calor = 0, heladas = 0, intensas = 0, seca = 0, secaMax = 0, secaCrit = 0, gMin = 1, gBajo = 0;
    const nDias = hasta == null ? n : Math.max(0, Math.min(n, Math.floor(hasta)));
    for (let i = 0; i < nDias; i++) {
      const d = addDias(siembra, i), ch = campHist(lote, d);
      if (ch === null) return null;
      const k = idxHist(z, ch + (d.getUTCMonth() < 6 ? 1 : 0), d);
      if (k < 0) return null;
      const p = z.prec[k] ?? 0, crit = i >= c0 && i <= c1;
      P += p; ET += z.et0[k] ?? 0;
      if (z.tmax[k] != null && z.tmax[k] >= caliente && crit) calor++;
      if (z.tmin[k] != null && z.tmin[k] <= frio) heladas++;
      if (p >= UMBRALES.lluvia_intensa_mm) intensas++;
      seca = p < UMBRALES.lluvia_util_mm ? seca + 1 : 0;
      secaMax = Math.max(secaMax, seca); if (crit) secaCrit = Math.max(secaCrit, seca);
      if (crit && z.gwet[k] != null) { gMin = Math.min(gMin, z.gwet[k]); if (z.gwet[k] < UMBRALES.gwet_bajo) gBajo++; }
    }
    const etc = (KC[cid] || .8) * ET, ratio = etc > 0 ? P / etc : 1;
    // Multiplicadores de aptitud (SUPUESTOS): cada día de calor extremo en el período crítico −4 % (mín. 60 %); cada helada
    // −12 % (mín. 50 %); racha seca en el período crítico más allá de 20 días −2 %/día (mín. 60 %);
    // lluvia por debajo del 60 % de la demanda del cultivo (Kc × ET0) hasta −20 %.
    const f = {
      calor: clamp(1 - .04 * calor, .6, 1),
      helada: clamp(1 - .12 * heladas, .5, 1),
      seca: secaCrit <= UMBRALES.seca_dias ? 1 : clamp(1 - .02 * (secaCrit - UMBRALES.seca_dias), .6, 1),
      deficit: ratio >= UMBRALES.deficit_ratio ? 1 : clamp(.8 + .2 * ratio / UMBRALES.deficit_ratio, .8, 1),
    };
    return { campania: campHist(lote, siembra), umbral_calor: caliente, lluvia: Math.round(P), et0: Math.round(ET), etc: Math.round(etc),
      ratio: Math.round(ratio * 100) / 100, calor_critico: calor, heladas, lluvias_intensas: intensas,
      seca_max: secaMax, seca_critico: secaCrit, gwet_min: Math.round(gMin * 100) / 100, gwet_bajo_dias: gBajo,
      factores: f, estres: f.calor * f.helada * f.seca * f.deficit };
  }
  // Serie diaria de una campaña (julio a junio) para la línea de tiempo.
  function serieDiariaCampania(zid, campania) {
    const z = diarioDe(zid);
    if (!z) return null;
    const i0 = Math.round((Date.UTC(campania, 6, 1) - baseDiario(z)) / DIA), i1 = Math.round((Date.UTC(campania + 1, 6, 1) - baseDiario(z)) / DIA);
    if (i0 < 0 || i1 > z.n) return null;
    const sl = a => a.slice(i0, i1);
    return { campania, inicio: fmtISO(new Date(Date.UTC(campania, 6, 1))), prec: sl(z.prec), tmax: sl(z.tmax), tmin: sl(z.tmin), gwet: sl(z.gwet), et0: sl(z.et0) };
  }

  /* ---------- aptitud ---------- */
  function aptitud(cid, lote, siembra, cosechaLimite) {
    const c = CULTIVOS[cid], ciclo = c.ciclo_dias;
    const [tMedia, precip] = cicloClima(lote.zona, siembra, ciclo, lote.escenario, lote);
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
    // En una simulación de rotación el cultivo ya está sembrado: si el clima del año no alcanza,
    // la cosecha es muy mala (piso) en lugar de "no viable". SUPUESTO documentado.
    let fallo = null;
    if (lote.pisoClima) {
      const malos = ['temperatura', 'agua'].filter(k => f[k] <= 0);
      if (malos.length) fallo = malos.map(k => razon(k, siembra, tMedia, precipEff, lote)).join(' ');
      for (const k of malos) f[k] = lote.pisoClima;
    }
    const razones = [];
    for (const k of FACTORES_ORDEN) if (f[k] <= 0) razones.push(razon(k, siembra, tMedia, precipEff, lote));
    let indice = 0;
    if (!razones.length) indice = Math.exp(FACTORES_ORDEN.reduce((s, k) => s + Math.log(f[k]), 0) / FACTORES_ORDEN.length);
    // Campaña real con serie diaria: eventos extremos y déficit hídrico del ciclo multiplican la aptitud.
    const diario = lote.pisoClima || lote.escC0 != null ? climaDiarioCiclo(cid, lote, siembra) : null;
    if (diario && indice > 0) indice *= diario.estres;
    return { indice, factores: f, descartado: razones.length > 0, razones, fallo, diario, tMedia, precip: precipEff };
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
  /* ---------- resiliencia climática (desde datos de NASA POWER) ----------
     Para un cultivo sembrado en un día y mes dados, se recorre la serie anual real de NASA POWER: cada año,
     el ciclo completo con la temperatura y la lluvia mensual de ESE año (y del siguiente si el ciclo cruza
     diciembre). Se calcula la aptitud climática de cada año (media geométrica de los factores temperatura y
     agua, igual que en aptitud()).
     resiliencia = aptitud climática promedio en el 20 % de años más malos (los ~5 peores de 24).
     Se usa la cola y no el P10: con 24 años el P10 depende de 2 o 3 años y salta mucho.
     Es una propiedad del cultivo, la fecha y la zona: no depende del escenario que se esté simulando.
     Los años con exceso de lluvia también cuentan (límite superior de agua del cultivo). El anegamiento propio
     del lote (bajos, mal drenaje) sigue entrando por el factor drenaje de la aptitud. */
  const PEOR_FRAC = 0.2;
  const cacheResil = new Map();
  function climaAnio(z, y, m0, d0, dias) {
    let t = 0, p = 0;
    for (let i = 0; i < dias; i++) {
      const d = new Date(Date.UTC(y, m0, d0 + i)), yy = d.getUTCFullYear(), m = d.getUTCMonth(), s = z.serie[yy];
      if (!s || s.temp[m] == null || s.precip[m] == null) return null; // ciclo incompleto en la serie
      t += s.temp[m]; p += s.precip[m] / new Date(Date.UTC(yy, m + 1, 0)).getUTCDate();
    }
    return [t / dias, p];
  }
  function resilienciaClima(cid, lote, siembra) {
    const zid = ZONAS[lote.zona] ? lote.zona : 'pampa_humeda', z = ZONAS[zid], c = CULTIVOS[cid];
    const m0 = siembra.getUTCMonth(), d0 = siembra.getUTCDate();
    const key = cid + '|' + zid + '|' + m0 + '|' + d0 + '|' + (lote.riego ? 1 : 0);
    if (cacheResil.has(key)) return cacheResil.get(key);
    const anios = [];
    for (const y of Object.keys(z.serie || {}).map(Number).sort((a, b) => a - b)) {
      const cl = climaAnio(z, y, m0, d0, c.ciclo_dias);
      if (!cl) continue;
      const p = lote.riego ? Math.max(cl[1], c.agua_opt[0]) : cl[1];
      const ft = trapecio(cl[0], c.temp_lim[0], c.temp_opt[0], c.temp_opt[1], c.temp_lim[1]);
      const fa = trapecio(p, c.agua_lim[0], c.agua_opt[0], c.agua_opt[1], c.agua_lim[1]);
      anios.push({ y, apt: Math.sqrt(ft * fa), falta: p < c.agua_opt[0], exceso: p > c.agua_opt[1], fuera: ft * fa === 0 });
    }
    let res;
    if (!anios.length) {
      // Sin serie para la zona: se vuelve al supuesto anterior (tolerancias del catálogo y riesgos cargados).
      const rs = lote.riesgos?.sequia ?? .5, ra = lote.riesgos?.anegamiento ?? .5, tot = rs + ra;
      res = { valor: tot > 0 ? clamp(1 - (rs * (1 - c.tol_sequia) + ra * (1 - c.tol_anegamiento)) / tot) : .5, fuente: 'supuesto', n: 0 };
    } else {
      const ord = anios.slice().sort((a, b) => a.apt - b.apt), k = Math.max(1, Math.round(PEOR_FRAC * ord.length));
      const fmtCamp = y => y + '/' + String(y + 1).slice(2);
      res = {
        valor: ord.slice(0, k).reduce((s, a) => s + a.apt, 0) / k, fuente: 'NASA POWER', n: anios.length, peores: k,
        media: anios.reduce((s, a) => s + a.apt, 0) / anios.length,
        falta_agua: anios.filter(a => a.falta).length, exceso_agua: anios.filter(a => a.exceso).length,
        fuera_limites: anios.filter(a => a.fuera).length,
        peor: ord[0] ? fmtCamp(ord[0].y) : null,
      };
    }
    cacheResil.set(key, res);
    return res;
  }
  function textoResiliencia(r) {
    if (r.fuente !== 'NASA POWER') return 'Resiliencia: sin serie anual para esta zona, se usa un supuesto (tolerancias del catálogo).';
    const partes = ['Resiliencia: en los ' + r.peores + ' peores de ' + r.n + ' años reales de NASA POWER mantiene ' + Math.round(100 * r.valor) +
      ' % de aptitud climática (promedio de todos los años: ' + Math.round(100 * r.media) + ' %).'];
    const q = [];
    if (r.falta_agua) q.push(r.falta_agua + ' con menos agua que la óptima');
    if (r.exceso_agua) q.push(r.exceso_agua + ' con exceso de lluvia');
    if (q.length) partes.push('Años de ' + r.n + ': ' + q.join(', ') + '.');
    if (r.fuera_limites) partes.push(r.fuera_limites + ' fuera de los límites tolerados (peor: ' + r.peor + ').');
    return partes.join(' ');
  }
  // Resumen del clima de la zona por campaña (julio a junio), para mostrar de dónde sale la resiliencia.
  function riesgoZona(zona) {
    const zid = ZONAS[zona] ? zona : 'pampa_humeda', ids = CAMPANIAS[zid] || [], E = ESCENARIOS[zid];
    const camp = ids.map(id => E[id]);
    if (!camp.length) return null;
    const peor = camp.reduce((a, c) => c.total < a.total ? c : a);
    return { n: camp.length, periodo: POWER.periodo,
      secas: camp.filter(c => c.anomalia_pct <= -20).length, humedas: camp.filter(c => c.anomalia_pct >= 20).length,
      peor: { campania: peor.campania, anomalia_pct: peor.anomalia_pct } };
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
    // Rendimiento base oficial (MAGyP) si existe. En una campaña real, si el cultivo tiene el modelo clima->rendimiento
    // validado, la anomalía del año sale del modelo y no del índice de aptitud.
    const rb = rendBase(cid, lote.zona), anioEsc = anioEscenario(lote, siembra);
    let rend = rb.t_ha * apt.indice, rendModelo = false;
    if (anioEsc !== null && rb.modelo && rb.modelo.anomalia_prevista[anioEsc] !== undefined) {
      const aptN = aptitud(cid, Object.assign({}, lote, { escenario: null, pisoClima: null }), siembra, cosechaLimite);
      if (!aptN.descartado) { rend = rb.t_ha * aptN.indice * (1 + rb.modelo.anomalia_prevista[anioEsc]); rendModelo = true; }
    }
    const margen = margenUsd(cid, lote.zona, rend);
    const ec = econDe(cid, lote.zona);
    Object.assign(base, { rend_fuente: rb.fuente, rend_modelo: rendModelo, econ_fuente: ec ? 'observado · MAGyP' : 'ilustrativo',
      estructura_usd_ha: ec ? ec.estructura_usd_ha : null });
    const bal = balanceNutrientes(cid, lote);
    const [salud, notaDiv] = saludSuelo(cid, lote);
    const [cumpl, motivos] = cumplimiento(c, cid, lote.historial, lote.pendiente);
    const resil = resilienciaClima(cid, lote, siembra);

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
        resiliencia: resil.valor,
        cumplimiento: cumpl
      },
      resil, notaDiv, motivos, siembra: fmtISO(siembra), cosecha_estimada: fmtISO(addDias(siembra, c.ciclo_dias)),
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
    if (e.estructura_usd_ha != null && e.margen_usd_ha < e.estructura_usd_ha)
      out.push('Margen bruto bajo: USD ' + Math.round(e.margen_usd_ha) + '/ha no cubre los gastos de estructura que MAGyP estima en USD ' +
        Math.round(e.estructura_usd_ha) + '/ha. El margen neto sería negativo, y más con arrendamiento.');
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
      textoResiliencia(e.resil),
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
      const ev = evaluarCultivo(cid, Object.assign({}, lote, { historial: hist, pisoClima: PISO_CLIMA, escC0: campDe(inicio) }), siembra, null);
      const dur = diffDias(finCiclo, siembra);
      const dias = Math.max(0, diffDias(finCiclo > fin ? fin : finCiclo, siembra));
      const frac = dur > 0 ? dias / dur : 0;
      const p = { cultivo: cid, nombre: c.nombre, tipo: c.tipo, siembra: fmtISO(siembra), fin: fmtISO(finCiclo),
        desde: diffDias(siembra, inicio), dias, cortada, viable: !ev.descartado,
        aptitud: ev.descartado ? 0 : ev.apt.indice, epoca: ev.apt.factores.epoca, razones: ev.apt.razones, fallo: ev.apt.fallo || null,
        diario: ev.apt.diario || null, f_agua: ev.apt.factores.agua, f_temp: ev.apt.factores.temperatura };
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
    pasos.filter(p => p.fallo).forEach(p => alertas.push(p.nombre + ' (' + p.siembra.slice(0, 7) + '): cosecha fallida por el clima del año. ' + p.fallo));
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
        fallidos: pasos.filter(p => p.fallo).length,
      },
      clima_diario: resumenDiario(pasos.filter(p => p.viable)),
      alertas: alertas.concat(motivos),
    };
  }

  // Eventos del clima diario sumados en los cultivos de una rotación, y la causa principal de cada caída de aptitud.
  const CAUSAS = { agua: 'lluvia del ciclo', temperatura: 'temperatura media', calor: 'golpes de calor', helada: 'heladas',
    seca: 'rachas secas en el período crítico', deficit: 'déficit hídrico (lluvia < demanda)' };
  function causaPaso(p) {
    const f = { agua: p.f_agua, temperatura: p.f_temp };
    if (p.diario) Object.assign(f, p.diario.factores);
    const k = Object.keys(f).reduce((a, x) => f[x] < f[a] ? x : a, 'agua');
    return f[k] < .85 ? k : null;
  }
  function resumenDiario(pasos) {
    const con = pasos.filter(p => p.diario);
    if (!con.length) return null;
    const sum = k => con.reduce((s, p) => s + p.diario[k], 0);
    const causas = {};
    for (const p of pasos) { const c = causaPaso(p); if (c) causas[c] = (causas[c] || 0) + 1; }
    return { ciclos: con.length, calor_critico: sum('calor_critico'), heladas: sum('heladas'), lluvias_intensas: sum('lluvias_intensas'),
      seca_critico_max: Math.max(...con.map(p => p.diario.seca_critico)), ciclos_deficit: con.filter(p => p.diario.ratio < UMBRALES.deficit_ratio).length,
      gwet_bajo_dias: sum('gwet_bajo_dias'), causas };
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
    add(I.margen_anual - B.margen_anual, 50, 'Mayor margen bruto: USD ' + I.margen_anual + '/ha/año (actual: ' + B.margen_anual + ').',
      'Menor margen bruto: USD ' + I.margen_anual + '/ha/año (actual: ' + B.margen_anual + ').');
    add(100 * (r.comp.resiliencia - base.comp.resiliencia), 5, 'Se sostiene mejor en los peores años climáticos reales (NASA POWER).',
      'Sufre más en los peores años climáticos reales (NASA POWER).');
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

  // Cada rotación bajo el clima promedio, el año seco, el húmedo y TODAS las campañas reales de la serie
  // (las 3 campañas del horizonte con el clima de ese año: prueba de estrés, no pronóstico).
  const cuantil = (a, p) => { const b = a.slice().sort((x, y) => x - y), i = p * (b.length - 1), lo = Math.floor(i);
    return lo + 1 < b.length ? b[lo] + (b[lo + 1] - b[lo]) * (i - lo) : b[lo]; };
  function compararEscenarios(lote, rotaciones, inicio, pesos) {
    const zid = ZONAS[lote.zona] ? lote.zona : 'pampa_humeda';
    const escs = ESCENARIOS_ORDEN.filter(k => ESCENARIOS[zid][k]).map(k => ESCENARIOS[zid][k]);
    const filas = rotaciones.map(r => ({ id: r.id, nombre: r.nombre, scores: {}, reales: [], fallos: 0,
      ev: { calor: 0, heladas: 0, intensas: 0, deficit: 0, seca: [] }, causas: {}, causasMalas: {} }));
    const correr = esc => compararRotaciones(Object.assign({}, lote, { escenario: esc }), rotaciones, inicio, pesos).rotaciones;
    for (const e of escs) correr(e.id).forEach((rr, i) => { filas[i].scores[e.id] = rr.pasos ? rr.score : null; });
    // Prueba de estrés: cada ventana de 3 campañas reales consecutivas (no se repite un mismo año).
    const ventanas = (SECUENCIAS[zid] && SECUENCIAS[zid].length ? SECUENCIAS[zid] : CAMPANIAS[zid]) || [];
    const porVentana = rotaciones.map(() => []);
    for (const vid of ventanas) correr(vid).forEach((rr, i) => {
      if (!rr.pasos) return;
      const f = filas[i];
      f.reales.push(rr.score); porVentana[i].push(rr);
      if (rr.indicadores.fallidos) f.fallos++;
      const cd = rr.clima_diario;
      if (cd) {
        f.ev.calor += cd.calor_critico; f.ev.heladas += cd.heladas; f.ev.intensas += cd.lluvias_intensas; f.ev.deficit += cd.ciclos_deficit;
        f.ev.seca.push(cd.seca_critico_max);
      }
      for (const p of rr.pasos.filter(x => x.viable)) { const c = causaPaso(p); if (c) f.causas[c] = (f.causas[c] || 0) + 1; }
    });
    let conDiario = false;
    filas.forEach((f, i) => {
      const n = f.reales.length;
      f.n = n;
      f.mediana = n ? Math.round(10 * cuantil(f.reales, .5)) / 10 : null;
      f.malo = n ? Math.round(10 * cuantil(f.reales, .1)) / 10 : null; // año malo: 1 de cada 10
      f.peor = n ? Math.min(...f.reales) : null;
      // Causas en las ventanas malas (el 20 % de peor puntaje): qué explica la caída.
      const corte = n ? cuantil(f.reales, .2) : null;
      for (const rr of porVentana[i].filter(r => r.score <= corte))
        for (const p of rr.pasos.filter(x => x.viable)) { const c = causaPaso(p); if (c) f.causasMalas[c] = (f.causasMalas[c] || 0) + 1; }
      const nd = f.ev.seca.length;
      if (nd) conDiario = true;
      f.eventos = nd ? { ventanas: nd, calor: Math.round(10 * f.ev.calor / nd) / 10, heladas: Math.round(10 * f.ev.heladas / nd) / 10,
        intensas: Math.round(10 * f.ev.intensas / nd) / 10, deficit: Math.round(10 * f.ev.deficit / nd) / 10,
        seca_mediana: Math.round(cuantil(f.ev.seca, .5)), seca_max: Math.max(...f.ev.seca) } : null;
      delete f.reales; delete f.ev;
    });
    const conDatos = filas.filter(f => f.malo != null);
    const estable = conDatos.length ? conDatos.reduce((a, f) => f.malo > a.malo ? f : a) : null;
    const e0 = ventanas.length ? ESCENARIOS[zid][ventanas[0]] : null, e1 = ventanas.length ? ESCENARIOS[zid][ventanas[ventanas.length - 1]] : null;
    return { escenarios: escs.map(e => ({ id: e.id, nombre: e.nombre, campania: e.campania, total: e.total, anomalia_pct: e.anomalia_pct, secuencia: e.secuencia ?? null })),
      filas, n_campanias: (CAMPANIAS[zid] || []).length, n_ventanas: ventanas.length, consecutivas: !!(SECUENCIAS[zid] && SECUENCIAS[zid].length),
      rango: e0 && e1 ? [e0.secuencia ?? parseInt(e0.campania, 10), (e1.secuencia ?? parseInt(e1.campania, 10)) + 2] : null,
      diario: conDiario, estable: estable ? estable.id : null, periodo: POWER.periodo };
  }

  const API = { UMBRALES, KC, umbralCalor, CAUSAS, diarioDe, serieDiariaCampania, climaDiarioCiclo, ESCENARIOS, ESCENARIOS_ORDEN, PISO_CLIMA, PEOR_FRAC, climaDesdePower, registrarZona, POWER_PERIODO: POWER.periodo, compararEscenarios, riesgoZona, resilienciaClima, CULTIVOS, ZONAS, FUENTE_CLIMA, TEXTURAS, DRENAJES, PESOS_DEFECTO, PESO_MAX, COMPONENTES_NOMBRE, COMPONENTES_DESC, FACTORES_NOMBRE,
    HORIZONTE_ANIOS, REF_MARGEN_ANUAL, recomendar, evaluarRotacion, compararRotaciones, normalizarPesos, parseFecha, fmtISO, addDias, margenUsd, rendBase, econDe };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Motor = API;
})(typeof window !== 'undefined' ? window : globalThis);
