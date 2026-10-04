function fmt(v, dec) {
  if (!isFinite(v) || isNaN(v)) return '—';
  return parseFloat(v.toFixed(dec)).toString();
}

function renderFormula(el, tex) {
  if (!el) return;
  if (typeof katex === 'undefined') {
    el.textContent = tex;
    return;
  }
  try {
    katex.render(tex, el, { throwOnError: false, displayMode: true });
  } catch (_) {
    el.textContent = tex;
  }
}

function renderAllFormulas() {
  document.querySelectorAll('.formula[data-latex]').forEach((el) => {
    renderFormula(el, el.getAttribute('data-latex'));
  });
}

function calcVSWR() {
  const s = parseFloat(document.getElementById('vswr-in').value);
  if (!s || s < 1) return;
  const rho = (s - 1) / (s + 1);
  const rl = -20 * Math.log10(rho);
  const prefl = rho * rho * 100;
  const ml = -10 * Math.log10(1 - rho * rho);
  document.getElementById('rl-out').innerHTML = fmt(rl, 2) + '<span class="result-unit">dB</span>';
  document.getElementById('rho-out').innerHTML = fmt(rho, 4);
  document.getElementById('prefl-out').innerHTML = fmt(prefl, 2) + '<span class="result-unit">%</span>';
  document.getElementById('ml-out').innerHTML = fmt(ml, 3) + '<span class="result-unit">dB</span>';
}

function calcRL() {
  const rl = parseFloat(document.getElementById('rl-in').value);
  if (!isFinite(rl) || rl < 0) return;
  const rho = Math.pow(10, -rl / 20);
  const vswr = (1 + rho) / (1 - rho);
  document.getElementById('vswr-out').innerHTML = fmt(vswr, 3);
  document.getElementById('rho2-out').innerHTML = fmt(rho, 4);
}

function calcDB() {
  const db = parseFloat(document.getElementById('db-in').value);
  const lin = Math.pow(10, db / 10);
  const volt = Math.pow(10, db / 20);
  document.getElementById('lin-out').innerHTML = fmt(lin, 4);
  document.getElementById('volt-out').innerHTML = fmt(volt, 4);
}

function calcDBm() {
  const dbm = parseFloat(document.getElementById('dbm-in').value);
  const mw = Math.pow(10, dbm / 10);
  const w = mw / 1000;
  const dbw = dbm - 30;
  const uv = Math.sqrt(mw * 1e-3 * 50) * 1e6;
  document.getElementById('mw-out').innerHTML =
    mw >= 1000
      ? fmt(mw / 1000, 3) + '<span class="result-unit">W</span>'
      : fmt(mw, 3);
  document.getElementById('w-out').innerHTML =
    w < 1e-6 ? fmt(w * 1e9, 3) + '<span class="result-unit">nW</span>' :
    w < 1e-3 ? fmt(w * 1e6, 3) + '<span class="result-unit">μW</span>' :
    w < 1     ? fmt(w * 1e3, 3) + '<span class="result-unit">mW</span>' :
                fmt(w, 4);
  document.getElementById('dbw-out').innerHTML = fmt(dbw, 2) + '<span class="result-unit">dBW</span>';
  document.getElementById('uv-out').innerHTML =
    uv >= 1e6   ? fmt(uv / 1e6, 3)  + '<span class="result-unit">V</span>' :
    uv >= 1000  ? fmt(uv / 1000, 3) + '<span class="result-unit">mV</span>' :
                  fmt(uv, 2)         + '<span class="result-unit">μV</span>';
}

function calcZ() {
  const r  = parseFloat(document.getElementById('zr-in').value) || 0;
  const x  = parseFloat(document.getElementById('zx-in').value) || 0;
  const z0 = parseFloat(document.getElementById('z0-in').value) || 50;
  const nr = r - z0, ni = x, dr = r + z0, di = x;
  const denom = dr * dr + di * di;
  const gr = (nr * dr + ni * di) / denom;
  const gi = (ni * dr - nr * di) / denom;
  const mag   = Math.sqrt(gr * gr + gi * gi);
  const angle = Math.atan2(gi, gr) * 180 / Math.PI;
  const vswr  = mag < 1 ? (1 + mag) / (1 - mag) : Infinity;
  const rl    = mag > 0 ? -20 * Math.log10(mag) : Infinity;
  document.getElementById('gz-out').innerHTML    = fmt(mag, 4);
  document.getElementById('gangle-out').innerHTML = fmt(angle, 1) + '<span class="result-unit">°</span>';
  document.getElementById('vswr-z-out').innerHTML = isFinite(vswr) ? fmt(vswr, 3) : '∞';
  document.getElementById('rl-z-out').innerHTML   = (isFinite(rl) ? fmt(rl, 2) : '∞') + '<span class="result-unit">dB</span>';
}

function calcFreq() {
  const f    = parseFloat(document.getElementById('freq-in').value);
  const unit = document.getElementById('freq-unit').value;
  const er   = parseFloat(document.getElementById('er-in').value) || 1;
  const mul  = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 }[unit] || 1e6;
  const fHz  = f * mul;
  const c    = 299792458;
  const lambda = c / (fHz * Math.sqrt(er));
  const period = 1 / fHz;

  function fmtLen(m) {
    if (m >= 1)     return fmt(m, 4)       + ' m';
    if (m >= 0.01)  return fmt(m * 100, 3) + ' cm';
    return                  fmt(m * 1000, 3) + ' mm';
  }

  function fmtPeriod(s) {
    if (s >= 1e-3) return fmt(s * 1e3,  3) + ' ms';
    if (s >= 1e-6) return fmt(s * 1e6,  3) + ' μs';
    if (s >= 1e-9) return fmt(s * 1e9,  3) + ' ns';
    return                 fmt(s * 1e12, 3) + ' ps';
  }

  document.getElementById('lambda-out').innerHTML  = fmtLen(lambda);
  document.getElementById('lambda2-out').innerHTML = fmtLen(lambda / 2);
  document.getElementById('lambda4-out').innerHTML = fmtLen(lambda / 4);
  document.getElementById('period-out').innerHTML  = fmtPeriod(period);
}

function calcNoise() {
  const nf  = parseFloat(document.getElementById('nf-in').value);
  const F   = Math.pow(10, nf / 10);
  const Teq = 290 * (F - 1);
  document.getElementById('nfactor-out').innerHTML = fmt(F, 4);
  document.getElementById('teq-out').innerHTML     = fmt(Teq, 1) + '<span class="result-unit">K</span>';
}

function calcFriis() {
  const F1  = Math.pow(10, parseFloat(document.getElementById('nf1').value) / 10);
  const G1  = Math.pow(10, parseFloat(document.getElementById('g1').value)  / 10);
  const F2  = Math.pow(10, parseFloat(document.getElementById('nf2').value) / 10);
  const Ftot  = F1 + (F2 - 1) / G1;
  const NFtot = 10 * Math.log10(Ftot);
  document.getElementById('nf-total-out').innerHTML = fmt(NFtot, 2) + '<span class="result-unit">dB</span>';
  document.getElementById('f-total-out').innerHTML  = fmt(Ftot, 4);
}

// ── Sweep / filtros RF (S-params + VSWR) ────────────────────────────

const VNA_FORMULAS = {
  lpf: String.raw`|H| = \frac{1}{\sqrt{1 + \left(\frac{f}{f_c}\right)^{2n}}} \qquad |S_{21}| \approx |H|\,10^{-IL_0/20} \qquad P_{\mathrm{ref}} + P_{\mathrm{trans}} + P_{\mathrm{dis}} = 1`,
  hpf: String.raw`|H| = \frac{1}{\sqrt{1 + \left(\frac{f_c}{f}\right)^{2n}}} \qquad |S_{21}| \approx |H|\,10^{-IL_0/20}`,
  bpf: String.raw`|H| = \frac{1}{\sqrt{1 + \left(\left(\frac{f}{f_0} - \frac{f_0}{f}\right)\frac{f_0}{BW}\right)^2}}`,
  bsf: String.raw`|H| = \frac{\left|f^2 - f_0^2\right|}{\sqrt{\left(f^2 - f_0^2\right)^2 + (f \cdot BW)^2}}`,
  rlc: String.raw`S_{21} = \frac{2Z_0}{2Z_0 + Z} \qquad S_{11} = \frac{Z}{2Z_0 + Z} \qquad Z = R + jX \qquad \mathrm{VSWR} = \frac{1 + |\Gamma|}{1 - |\Gamma|}`,
};

function onFilterTypeChange() {
  const type = document.getElementById('filter-type').value;
  const showOrder = type === 'lpf' || type === 'hpf';
  const showBw = type === 'bpf' || type === 'bsf';
  const showRlc = type === 'rlc';

  document.getElementById('params-order').hidden = !showOrder;
  document.getElementById('params-bw').hidden = !showBw;
  document.getElementById('params-rlc').hidden = !showRlc;
  document.getElementById('field-order').hidden = !showOrder;
  document.getElementById('field-il0').hidden = showRlc;
  renderFormula(document.getElementById('vna-formula'), VNA_FORMULAS[type] || '');
}

function magToDb(mag) {
  return 20 * Math.log10(Math.max(mag, 1e-12));
}

function rhoToVswr(rho) {
  if (rho >= 1 - 1e-9) return Infinity;
  return (1 + rho) / (1 - rho);
}

function butterworthLPF(f, fc, n) {
  if (f <= 0 || fc <= 0) return 0;
  return 1 / Math.sqrt(1 + Math.pow(f / fc, 2 * n));
}

function butterworthHPF(f, fc, n) {
  if (f <= 0 || fc <= 0) return 0;
  return 1 / Math.sqrt(1 + Math.pow(fc / f, 2 * n));
}

function bandpassMag(f, f0, bw) {
  if (f <= 0 || f0 <= 0 || bw <= 0) return 0;
  const x = (f / f0 - f0 / f) * (f0 / bw);
  return 1 / Math.sqrt(1 + x * x);
}

function bandstopMag(f, f0, bw) {
  if (f <= 0 || f0 <= 0 || bw <= 0) return 0;
  const num = f * f - f0 * f0;
  const den = Math.sqrt(num * num + Math.pow(f * bw, 2));
  return den > 0 ? Math.abs(num) / den : 0;
}

/** Filtro ideal pasivo: transmisión |H|, reflexión y pérdida por IL₀. */
function idealFilterSparams(hIdeal, il0Db) {
  const s21 = Math.min(1, Math.max(0, hIdeal)) * Math.pow(10, -(il0Db || 0) / 20);
  const pTrans = s21 * s21;
  const pDiss = 1 - Math.pow(10, -(il0Db || 0) / 10);
  const pRefl = Math.max(0, 1 - pTrans - pDiss);
  const s11 = Math.sqrt(pRefl);
  const rho = s11;
  return { s21, s11, rho, vswr: rhoToVswr(rho) };
}

/** Elemento serie Z=R+jX entre dos puertos Z₀ (puerto 2 terminado en Z₀). */
function rlcSeriesSparams(fHz, R, L_H, C_F, Z0) {
  if (fHz <= 0 || L_H <= 0 || C_F <= 0) return { s21: 0, s11: 1, rho: 1, vswr: Infinity };
  const w = 2 * Math.PI * fHz;
  const X = w * L_H - 1 / (w * C_F);
  const denR = 2 * Z0 + R;
  const denI = X;
  const den2 = denR * denR + denI * denI;
  const s21r = (2 * Z0 * denR) / den2;
  const s21i = (-2 * Z0 * denI) / den2;
  const s11r = (R * denR + X * denI) / den2;
  const s11i = (X * denR - R * denI) / den2;
  const s21 = Math.sqrt(s21r * s21r + s21i * s21i);
  const s11 = Math.sqrt(s11r * s11r + s11i * s11i);
  const rho = Math.min(0.9999, s11);
  return { s21, s11, rho, vswr: rhoToVswr(rho) };
}

function computeSparamsAtFreq(type, fGHz) {
  const fHz = fGHz * 1e9;
  const il0 = parseFloat(document.getElementById('il0')?.value) || 0;

  if (type === 'lpf') {
    const fc = parseFloat(document.getElementById('fc').value) || 1;
    const n = Math.max(1, Math.min(8, parseInt(document.getElementById('order').value, 10) || 1));
    return idealFilterSparams(butterworthLPF(fGHz, fc, n), il0);
  }
  if (type === 'hpf') {
    const fc = parseFloat(document.getElementById('fc').value) || 1;
    const n = Math.max(1, Math.min(8, parseInt(document.getElementById('order').value, 10) || 1));
    return idealFilterSparams(butterworthHPF(fGHz, fc, n), il0);
  }
  if (type === 'bpf') {
    const f0 = parseFloat(document.getElementById('fc-bw').value) || 1;
    const bw = parseFloat(document.getElementById('bw').value) || 0.1;
    return idealFilterSparams(bandpassMag(fGHz, f0, bw), il0);
  }
  if (type === 'bsf') {
    const f0 = parseFloat(document.getElementById('fc-bw').value) || 1;
    const bw = parseFloat(document.getElementById('bw').value) || 0.1;
    return idealFilterSparams(bandstopMag(fGHz, f0, bw), il0);
  }
  if (type === 'rlc') {
    const R = parseFloat(document.getElementById('r-vna').value) || 1;
    const L = parseFloat(document.getElementById('l-vna').value) * 1e-9;
    const C = parseFloat(document.getElementById('c-vna').value) * 1e-12;
    const Z0 = parseFloat(document.getElementById('z0-vna').value) || 50;
    return rlcSeriesSparams(fHz, R, L, C, Z0);
  }
  return { s21: 0, s11: 1, rho: 1, vswr: Infinity };
}

function estimateF0GHz(type) {
  if (type === 'lpf' || type === 'hpf') return parseFloat(document.getElementById('fc').value) || null;
  if (type === 'bpf' || type === 'bsf') return parseFloat(document.getElementById('fc-bw').value) || null;
  if (type === 'rlc') {
    const L = parseFloat(document.getElementById('l-vna').value) * 1e-9;
    const C = parseFloat(document.getElementById('c-vna').value) * 1e-12;
    if (L > 0 && C > 0) return 1 / (2 * Math.PI * Math.sqrt(L * C)) / 1e9;
  }
  return null;
}

function interpAtFreq(freqs, values, fTarget) {
  if (!freqs.length) return null;
  if (fTarget <= freqs[0]) return values[0];
  if (fTarget >= freqs[freqs.length - 1]) return values[values.length - 1];
  for (let i = 0; i < freqs.length - 1; i++) {
    if (fTarget >= freqs[i] && fTarget <= freqs[i + 1]) {
      const t = (fTarget - freqs[i]) / (freqs[i + 1] - freqs[i]);
      return values[i] + t * (values[i + 1] - values[i]);
    }
  }
  return values[values.length - 1];
}

function setupCanvas(canvas, wrap, height) {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(200, wrap.clientWidth - 24);
  canvas.width = w * dpr;
  canvas.height = height * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h: height };
}

function drawGrid(ctx, w, h, pad, fMin, fMax, yMin, yMax, yUnit) {
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  const xOf = f => pad.l + ((f - fMin) / (fMax - fMin)) * plotW;
  const yOf = y => pad.t + (1 - (y - yMin) / (yMax - yMin)) * plotH;

  ctx.fillStyle = '#0b1218';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#243643';
  ctx.lineWidth = 1;
  ctx.font = '10px IBM Plex Mono, monospace';
  ctx.fillStyle = '#7a909d';

  for (let i = 0; i <= 5; i++) {
    const y = yMin + (i / 5) * (yMax - yMin);
    const py = yOf(y);
    ctx.beginPath();
    ctx.moveTo(pad.l, py);
    ctx.lineTo(pad.l + plotW, py);
    ctx.stroke();
    const label = yUnit === 'vswr'
      ? (y >= 10 ? y.toFixed(0) : y.toFixed(1))
      : y.toFixed(0) + ' dB';
    ctx.fillText(label, 4, py + 3);
  }

  for (let i = 0; i <= 5; i++) {
    const f = fMin + (i / 5) * (fMax - fMin);
    const px = xOf(f);
    ctx.beginPath();
    ctx.moveTo(px, pad.t);
    ctx.lineTo(px, pad.t + plotH);
    ctx.stroke();
    ctx.fillText(f.toFixed(2), px - 14, h - 8);
  }

  ctx.fillStyle = '#9db0bc';
  ctx.fillText('GHz', w - 36, h - 8);

  return { plotW, plotH, xOf, yOf };
}

function drawTrace(ctx, freqs, values, xOf, yOf, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < freqs.length; i++) {
    if (!isFinite(values[i])) continue;
    const x = xOf(freqs[i]);
    const y = yOf(values[i]);
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawMarkerLine(ctx, xOf, pad, plotH, markerGHz, fMin, fMax) {
  if (markerGHz == null || markerGHz < fMin || markerGHz > fMax) return;
  const mx = xOf(markerGHz);
  ctx.strokeStyle = 'rgba(136, 146, 168, 0.45)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(mx, pad.t);
  ctx.lineTo(mx, pad.t + plotH);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSparamChart(freqs, s21Db, s11Db, markerGHz) {
  const canvas = document.getElementById('vnaChart');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  const pad = { l: 52, r: 16, t: 16, b: 36 };
  const { ctx, w, h } = setupCanvas(canvas, wrap, 280);

  let yMin = -50;
  let yMax = 2;
  for (const arr of [s21Db, s11Db]) {
    for (const v of arr) {
      if (isFinite(v)) {
        yMin = Math.min(yMin, v);
        yMax = Math.max(yMax, v);
      }
    }
  }
  yMin = Math.floor(yMin / 10) * 10;
  yMax = Math.ceil(Math.max(yMax, 0) / 5) * 5;
  if (yMax - yMin < 25) yMax = yMin + 25;

  const fMin = freqs[0];
  const fMax = freqs[freqs.length - 1];
  const grid = drawGrid(ctx, w, h, pad, fMin, fMax, yMin, yMax, 'db');
  drawMarkerLine(ctx, grid.xOf, pad, grid.plotH, markerGHz, fMin, fMax);
  drawTrace(ctx, freqs, s11Db, grid.xOf, grid.yOf, '#e8a838');
  drawTrace(ctx, freqs, s21Db, grid.xOf, grid.yOf, '#3fd0a8');
}

function drawVswrChart(freqs, vswrArr, markerGHz) {
  const canvas = document.getElementById('vnaChartVswr');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  const pad = { l: 52, r: 16, t: 12, b: 32 };
  const { ctx, w, h } = setupCanvas(canvas, wrap, 140);

  let yMax = 2;
  for (const v of vswrArr) {
    if (isFinite(v) && v < 50) yMax = Math.max(yMax, v);
  }
  yMax = Math.min(50, Math.ceil(yMax * 1.15 * 2) / 2);
  const yMin = 1;
  const fMin = freqs[0];
  const fMax = freqs[freqs.length - 1];
  const grid = drawGrid(ctx, w, h, pad, fMin, fMax, yMin, yMax, 'vswr');
  drawMarkerLine(ctx, grid.xOf, pad, grid.plotH, markerGHz, fMin, fMax);

  ctx.strokeStyle = '#6eb5ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < freqs.length; i++) {
    const v = vswrArr[i];
    if (!isFinite(v) || v > 50) continue;
    const x = grid.xOf(freqs[i]);
    const y = grid.yOf(v);
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function generateSweep() {
  const fstart = parseFloat(document.getElementById('fstart').value);
  const fstop = parseFloat(document.getElementById('fstop').value);
  let nPts = parseInt(document.getElementById('points').value, 10) || 401;
  nPts = Math.max(51, Math.min(2001, nPts));

  if (!isFinite(fstart) || !isFinite(fstop) || fstop <= fstart) return;

  const type = document.getElementById('filter-type').value;
  const freqs = [];
  const s21Db = [];
  const s11Db = [];
  const vswrArr = [];
  const step = (fstop - fstart) / (nPts - 1);

  let vswrMax = 1;
  for (let i = 0; i < nPts; i++) {
    const f = fstart + i * step;
    const sp = computeSparamsAtFreq(type, f);
    freqs.push(f);
    s21Db.push(magToDb(sp.s21));
    s11Db.push(magToDb(sp.s11));
    const vswr = isFinite(sp.vswr) ? Math.min(sp.vswr, 99) : 99;
    vswrArr.push(vswr);
    if (vswr > vswrMax && vswr < 99) vswrMax = vswr;
  }

  const fMark = estimateF0GHz(type);
  const s21Mark = fMark != null ? interpAtFreq(freqs, s21Db, fMark) : null;
  const s11Mark = fMark != null ? interpAtFreq(freqs, s11Db, fMark) : null;
  const vswrMark = fMark != null ? interpAtFreq(freqs, vswrArr, fMark) : null;
  const rhoMark = s11Mark != null ? Math.pow(10, s11Mark / 20) : null;
  const rlMark = s11Mark != null ? -s11Mark : null;

  document.getElementById('vna-f0-out').innerHTML =
    fMark != null ? fmt(fMark, 3) + '<span class="result-unit">GHz</span>' : '—';
  document.getElementById('vna-s21-mark').innerHTML =
    s21Mark != null ? fmt(s21Mark, 2) + '<span class="result-unit">dB</span>' : '—';
  document.getElementById('vna-rl-mark').innerHTML =
    rlMark != null ? fmt(rlMark, 2) + '<span class="result-unit">dB</span>' : '—';
  document.getElementById('vna-vswr-mark').innerHTML =
    vswrMark != null ? (vswrMark >= 99 ? '∞' : fmt(vswrMark, 2)) : '—';
  document.getElementById('vna-vswr-max').innerHTML =
    vswrMax >= 99 ? '∞' : fmt(vswrMax, 2);
  document.getElementById('vna-rho-mark').innerHTML =
    rhoMark != null ? fmt(rhoMark, 4) : '—';

  drawSparamChart(freqs, s21Db, s11Db, fMark);
  drawVswrChart(freqs, vswrArr, fMark);
}

let vnaResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(vnaResizeTimer);
  vnaResizeTimer = setTimeout(generateSweep, 120);
});

// Run all calculations on page load
calcVSWR();
calcRL();
calcDB();
calcDBm();
calcZ();
calcFreq();
calcNoise();
calcFriis();
renderAllFormulas();
onFilterTypeChange();
generateSweep();

// ══ Navegación ═══════════════════════════════════════════════════════
const isMobileNav = () => window.matchMedia('(max-width: 900px)').matches;

function setGroup(group, open) {
  group.classList.toggle('open', open);
  group.querySelector('.nav-group-btn').setAttribute('aria-expanded', String(open));
}

function show(id) {
  if (!document.getElementById(id)) id = 'home';
  document.querySelectorAll('.tool').forEach(t => t.classList.toggle('active', t.id === id));
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.dataset.target === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const link = document.querySelector('.nav-link[data-target="' + id + '"]');
  const group = link && link.closest('.nav-group');
  for (let g = group; g; g = g.parentElement.closest('.nav-group')) setGroup(g, true);
  const title = document.querySelector('#' + id + ' .page-title');
  document.title = (title ? title.textContent + ' · ' : '') + 'RF Toolbox';
  window.scrollTo(0, 0);
  if (id === 'vna') generateSweep();   // el canvas necesita su tamaño real
  setNav(false, true);
}

function setNav(open, onlyMobile) {
  if (isMobileNav()) {
    document.body.classList.toggle('nav-open', open);
  } else if (!onlyMobile) {
    document.body.classList.toggle('nav-collapsed', !open);
  }
  document.getElementById('menu-btn').setAttribute('aria-expanded', String(open));
}

function initNav() {
  document.getElementById('menu-btn').addEventListener('click', () => {
    const open = isMobileNav()
      ? !document.body.classList.contains('nav-open')
      : document.body.classList.contains('nav-collapsed');
    setNav(open);
  });
  document.getElementById('scrim').addEventListener('click', () => setNav(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false, true); });
  document.querySelectorAll('.nav-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.closest('.nav-group');
      setGroup(g, !g.classList.contains('open'));
    });
  });
  window.addEventListener('hashchange', () => show(location.hash.slice(1) || 'home'));
  document.getElementById('menu-btn').setAttribute('aria-expanded', String(!isMobileNav()));
  show(location.hash.slice(1) || 'home');
}

// ══ Utilidades ═══════════════════════════════════════════════════════
const $ = id => document.getElementById(id);
const num = id => parseFloat($(id).value);

function lenStr(m) {
  if (!isFinite(m)) return '—';
  if (m >= 1) return fmt(m, 3) + ' m';
  if (m >= 0.01) return fmt(m * 100, 2) + ' cm';
  return fmt(m * 1000, 2) + ' mm';
}

function si(v, unit) {
  const p = [[1e-12, 'p'], [1e-9, 'n'], [1e-6, 'µ'], [1e-3, 'm'], [1, '']];
  let pick = p[0];
  for (const x of p) if (v >= x[0]) pick = x;
  return fmt(v / pick[0], 3) + '<span class="result-unit">' + pick[1] + unit + '</span>';
}

// ══ Inicio: demostración de longitud de onda ══════════════════════════
function initHero() {
  const s = $('hero-slider');
  const update = () => {
    const v = +s.value;
    const fMHz = 10 * Math.pow(1000, v / 100);          // 10 MHz a 10 GHz
    const lam = 299.792458 / fMHz;
    const band = fMHz < 30 ? 'HF' : fMHz < 300 ? 'VHF' : fMHz < 3000 ? 'UHF' : 'SHF';
    $('hero-band').textContent = band;
    $('hero-f').textContent = fMHz >= 1000 ? fmt(fMHz / 1000, 3) + ' GHz' : fmt(fMHz, 3) + ' MHz';
    $('hero-l').textContent = lenStr(lam);
    $('hero-q').textContent = lenStr(lam / 4);
    const cycles = 1.5 + 5 * v / 100;
    let d = '';
    for (let x = 0; x <= 320; x += 2) {
      d += (x ? 'L' : 'M') + x + ' ' + (40 - 30 * Math.sin(2 * Math.PI * cycles * x / 320)).toFixed(1);
    }
    $('hero-wave').setAttribute('d', d);
  };
  s.addEventListener('input', update);
  update();
}

// ══ Filtros: prototipo Butterworth paso bajo ══════════════════════════
function calcProto() {
  const n = Math.max(1, Math.min(8, parseInt($('pr-n').value, 10) || 1));
  const w = 2 * Math.PI * num('pr-fc') * 1e6, z0 = num('pr-z0');
  if (!(w > 0) || !(z0 > 0)) return;
  let html = '';
  for (let k = 1; k <= n; k++) {
    const g = 2 * Math.sin((2 * k - 1) * Math.PI / (2 * n));
    const shunt = k % 2 === 1;
    const val = shunt ? si(g / (z0 * w), 'F') : si(g * z0 / w, 'H');
    html += '<div class="result-card"><div class="result-label">' + (shunt ? 'C' : 'L') + k +
            (shunt ? ' en paralelo' : ' en serie') + '</div><div class="result-value">' + val + '</div></div>';
  }
  $('pr-out').innerHTML = html;
}

// ══ Radioenlaces ══════════════════════════════════════════════════════
function calcLink() {
  const f = num('lk-f') / 1000, d = num('lk-d');   // MHz → GHz
  if (!(f > 0) || !(d > 0)) return;
  const fspl = 92.45 + 20 * Math.log10(d) + 20 * Math.log10(f);
  const eirp = num('lk-ptx') - num('lk-loss') + num('lk-gtx');
  const prx = eirp - fspl + num('lk-grx');
  const margin = prx - num('lk-sens');
  const r1 = 8.66 * Math.sqrt(d / f);
  $('lk-fspl').innerHTML = fmt(fspl, 1) + '<span class="result-unit">dB</span>';
  $('lk-eirp').innerHTML = fmt(eirp, 1) + '<span class="result-unit">dBm</span>';
  $('lk-prx').innerHTML = fmt(prx, 1) + '<span class="result-unit">dBm</span>';
  $('lk-margin').innerHTML = fmt(margin, 1) + '<span class="result-unit">dB</span>';
  $('lk-fr').innerHTML = fmt(r1, 1) + '<span class="result-unit">m</span>';
  $('lk-fr60').innerHTML = fmt(r1 * 0.6, 1) + '<span class="result-unit">m</span>';
  $('lk-verdict').innerHTML = margin < 0 ? '<b>El enlace no cierra.</b> La señal llega por debajo de la sensibilidad.'
    : margin < 10 ? '<b>Margen justo.</b> Cualquier desvanecimiento puede cortar el enlace.'
    : margin < 20 ? '<b>Margen aceptable</b> para la mayoría de los enlaces.'
    : '<b>Margen robusto.</b> Soporta lluvia y desvanecimiento profundo.';
}

// ══ Biblioteca ════════════════════════════════════════════════════════
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderLibrary() {
  const list = typeof RECURSOS !== 'undefined' ? RECURSOS : [];
  const sel = $('lib-topic');
  if (!sel.options.length) {
    const temas = [...new Set(list.map(r => r.tema).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Todos los temas</option>' + temas.map(t => '<option>' + esc(t) + '</option>').join('');
  }
  const q = $('lib-q').value.trim().toLowerCase(), tema = sel.value;
  const items = list.filter(r =>
    (!tema || r.tema === tema) &&
    (!q || [r.titulo, r.autor, r.descripcion, r.tema, r.tipo].join(' ').toLowerCase().includes(q)));
  $('lib-count').textContent = list.length ? items.length + ' de ' + list.length + ' recursos' : '';
  if (!list.length) {
    $('lib-list').innerHTML = '<div class="empty">Aún no hay lecturas. Agrégalas en el archivo <code>recursos.js</code> y aparecerán aquí.</div>';
    return;
  }
  if (!items.length) {
    $('lib-list').innerHTML = '<div class="empty">Ningún recurso coincide con la búsqueda. Prueba otra palabra o cambia el tema.</div>';
    return;
  }
  $('lib-list').innerHTML = items.map(r => {
    const url = /^\s*javascript:/i.test(r.url || '') ? '' : (r.url || '');
    const title = url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(r.titulo) + '</a>' : esc(r.titulo);
    return '<article class="lib-item"><h3>' + title + '</h3>' +
      (r.descripcion ? '<p>' + esc(r.descripcion) + '</p>' : '') +
      '<div class="lib-meta">' +
      (r.tipo ? '<span class="tag type">' + esc(r.tipo) + '</span>' : '') +
      (r.tema ? '<span class="tag">' + esc(r.tema) + '</span>' : '') +
      (r.autor ? '<span class="tag">' + esc(r.autor) + '</span>' : '') +
      '</div></article>';
  }).join('');
}

// ══ Subpáginas de antenas ═════════════════════════════════════════════
const LAM = f => 299.792458 / f;                       // f en MHz → λ en m
const u = (v, d, unit) => fmt(v, d) + '<span class="result-unit">' + unit + '</span>';
const ANT = {
  dipolo: { in: ['f', 'k'], calc: v => [['λ', lenStr(LAM(v.f))], ['Longitud total', lenStr(v.k * LAM(v.f) / 2)], ['Cada brazo', lenStr(v.k * LAM(v.f) / 4)]] },
  monopolo: { in: ['f', 'k'], calc: v => [['λ', lenStr(LAM(v.f))], ['Altura del brazo', lenStr(v.k * LAM(v.f) / 4)], ['Largo de cada radial', lenStr(LAM(v.f) / 4)], ['Radio mínimo del plano', lenStr(LAM(v.f) / 4)]] },
  yagi: { in: ['f', 'n'], calc: v => {
    const l = LAM(v.f), n = Math.max(3, Math.round(v.n));
    return [['Reflector', lenStr(.495 * l)], ['Elemento excitado', lenStr(.473 * l)], ['Primer director', lenStr(.44 * l)],
            ['Separación', lenStr(.2 * l)], ['Largo del boom', lenStr((n - 1) * .2 * l)], ['Ganancia ≈', u(7.5 + 11.5 * Math.log10(n / 3), 1, 'dBi')]];
  } },
  parche: { in: ['f', 'er', 'h'], calc: v => {
    const lam = 299792.458 / v.f;                       // mm
    const W = lam / 2 * Math.sqrt(2 / (v.er + 1));
    const ee = (v.er + 1) / 2 + (v.er - 1) / 2 * Math.pow(1 + 12 * v.h / W, -0.5);
    const dL = 0.412 * v.h * ((ee + 0.3) * (W / v.h + 0.264)) / ((ee - 0.258) * (W / v.h + 0.8));
    const L = lam / (2 * Math.sqrt(ee)) - 2 * dL;
    return [['Ancho W', u(W, 2, 'mm')], ['Largo L', u(L, 2, 'mm')], ['εᵣ efectiva', fmt(ee, 3)],
            ['Plano de tierra mínimo', fmt(L + 12 * v.h, 1) + ' × ' + fmt(W + 12 * v.h, 1) + '<span class="result-unit">mm</span>']];
  } },
  helice: { in: ['f', 'n'], calc: v => {
    const l = LAM(v.f), n = Math.max(2, Math.round(v.n)), S = 0.25;
    return [['Circunferencia C', lenStr(l)], ['Diámetro D', lenStr(l / Math.PI)], ['Espaciado S', lenStr(S * l)], ['Longitud axial', lenStr(n * S * l)],
            ['Ganancia ≈', u(10.8 + 10 * Math.log10(n * S), 1, 'dBi')], ['Ancho de haz ≈', u(52 / Math.sqrt(n * S), 0, '°')], ['Plano de tierra ≥', lenStr(.75 * l)]];
  } },
  parabola: { in: ['f', 'd', 'eta', 'fd'], calc: v => {
    const l = LAM(v.f), F = v.fd * v.d;
    return [['Ganancia ≈', u(10 * Math.log10(v.eta / 100 * Math.pow(Math.PI * v.d / l, 2)), 1, 'dBi')], ['Ancho de haz ≈', u(70 * l / v.d, 1, '°')],
            ['Distancia focal', lenStr(F)], ['Profundidad', lenStr(v.d * v.d / (16 * F))]];
  } },
};

function calcAnt(t) {
  const v = {};
  for (const n of ANT[t].in) { v[n] = num('a-' + t + '-' + n); if (!(v[n] > 0)) return; }
  $('a-' + t + '-out').innerHTML = ANT[t].calc(v).map(r =>
    '<div class="result-card"><div class="result-label">' + r[0] + '</div><div class="result-value">' + r[1] + '</div></div>').join('');
}

calcProto();
calcLink();
renderAllFormulas();
renderLibrary();
Object.keys(ANT).forEach(calcAnt);
initHero();
initNav();