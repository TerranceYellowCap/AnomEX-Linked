/* AnomEx Duel: interface, effects and sound. Rules live in engine.js. */
(function () {
'use strict';
const E = window.Duel;
const { DEFS, STATS, SNAME, ROLE, CFG } = E;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const TAU = Math.PI * 2;
const pickOne = a => a[(Math.random() * a.length) | 0];
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const ICO = { STR: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NyIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjI4IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxnIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjMwIiByPSI5IiBzdHJva2U9Im5vbmUiLz48cGF0aCBkPSJNNDAgMzhMMzMgNjIiIHN0cm9rZS13aWR0aD0iMTIiLz48cGF0aCBkPSJNMzMgNjRMNjYgNjIiIHN0cm9rZS13aWR0aD0iMTIiLz48ZWxsaXBzZSBjeD0iNTIiIGN5PSI0OCIgcng9IjE1IiByeT0iMTAuNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTI4IDUyIDQ4KSIgc3Ryb2tlPSJub25lIi8+PHBhdGggZD0iTTYwIDYybDctOSIgc3Ryb2tlLXdpZHRoPSIxMCIvPjwvZz48cGF0aCBkPSJNNDMgNDFjNiAxIDExIDUgMTIgMTEiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyLjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW9wYWNpdHk9Ii43NSIvPjxwYXRoIGQ9Ik0zNiAzMGg4IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utb3BhY2l0eT0iLjciLz48L3N2Zz4=', AGI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NyIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjI4IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxnIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjYiPjxjaXJjbGUgY3g9IjU4IiBjeT0iMjUiIHI9IjYiIGZpbGw9IiNmZmYiIHN0cm9rZT0ibm9uZSIvPjxwYXRoIGQ9Ik01MiAzNmwtOCAxNCAxMiA4LTQgMTYiLz48cGF0aCBkPSJNNTIgMzZsMTIgNiA4LTUiLz48cGF0aCBkPSJNNDggNDJsLTEyIDQtNCAxMCIvPjxwYXRoIGQ9Ik00NCA1MGwtMTQgMTQiLz48L2c+PGcgc3Ryb2tlPSIjZmZmIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLW9wYWNpdHk9Ii42Ij48cGF0aCBkPSJNMTggNDBoMTJNMTQgNTBoMTBNMjAgNjBoOCIvPjwvZz48L3N2Zz4=', BRN: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NyIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjI4IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxnIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjQiPjxwYXRoIGQ9Ik01MCAyNmMtNS01LTE1LTMtMTggMy02IDEtOSA4LTYgMTMtNCA0LTMgMTEgMiAxNCAwIDYgNiAxMCAxMiA4IDMgMyA4IDMgMTAgMCIvPjxwYXRoIGQ9Ik01MCAyNmM1LTUgMTUtMyAxOCAzIDYgMSA5IDggNiAxMyA0IDQgMyAxMS0yIDE0IDAgNi02IDEwLTEyIDgtMyAzLTggMy0xMCAwIi8+PHBhdGggZD0iTTUwIDI2djQyIi8+PC9nPjxnIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1vcGFjaXR5PSIuOCI+PHBhdGggZD0iTTMyIDQyYzUgMCA4IDMgMTAgN002OCA0MmMtNSAwLTggMy0xMCA3TTM2IDU4YzQtMiA4LTEgMTEgMk02NCA1OGMtNC0yLTgtMS0xMSAyIi8+PC9nPjwvc3ZnPg==', DATA: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NyIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjI4IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxnIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMuNSI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiLz48bGluZSB4MT0iODAuMDAiIHkxPSI1MC4wMCIgeDI9Ijg2LjAwIiB5Mj0iNTAuMDAiLz48bGluZSB4MT0iNzUuOTgiIHkxPSI2NS4wMCIgeDI9IjgxLjE4IiB5Mj0iNjguMDAiLz48bGluZSB4MT0iNjUuMDAiIHkxPSI3NS45OCIgeDI9IjY4LjAwIiB5Mj0iODEuMTgiLz48bGluZSB4MT0iNTAuMDAiIHkxPSI4MC4wMCIgeDI9IjUwLjAwIiB5Mj0iODYuMDAiLz48bGluZSB4MT0iMzUuMDAiIHkxPSI3NS45OCIgeDI9IjMyLjAwIiB5Mj0iODEuMTgiLz48bGluZSB4MT0iMjQuMDIiIHkxPSI2NS4wMCIgeDI9IjE4LjgyIiB5Mj0iNjguMDAiLz48bGluZSB4MT0iMjAuMDAiIHkxPSI1MC4wMCIgeDI9IjE0LjAwIiB5Mj0iNTAuMDAiLz48bGluZSB4MT0iMjQuMDIiIHkxPSIzNS4wMCIgeDI9IjE4LjgyIiB5Mj0iMzIuMDAiLz48bGluZSB4MT0iMzUuMDAiIHkxPSIyNC4wMiIgeDI9IjMyLjAwIiB5Mj0iMTguODIiLz48bGluZSB4MT0iNTAuMDAiIHkxPSIyMC4wMCIgeDI9IjUwLjAwIiB5Mj0iMTQuMDAiLz48bGluZSB4MT0iNjUuMDAiIHkxPSIyNC4wMiIgeDI9IjY4LjAwIiB5Mj0iMTguODIiLz48bGluZSB4MT0iNzUuOTgiIHkxPSIzNS4wMCIgeDI9IjgxLjE4IiB5Mj0iMzIuMDAiLz48L2c+PHBhdGggZD0iTTU0IDMwTDM4IDU0aDEwbC00IDE3IDE4LTI2SDUxeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==' }; /* inlined so the stat icons can never go missing */
const SHORT = { STR: 'Strength', AGI: 'Agility', BRN: 'Brains', DATA: 'DATA' };

let G = null, loopId = 0;
const ROSTER_ALL = ['wren', 'argo', 'jane', 'rarity', 'cathy', 'edica', 'ellie', 'miera', 'opal', 'echidna', 'julian', 'delilah', 'wraith', 'cray', 'neko', 'nessy', 'tyrees', 'argithia', 'frey', 'mason'];
let roster = ROSTER_ALL.slice();
const DK = 'anomex-decks'; let decks = null, activeDeck = 0;
const fixOrder = o => { const seen = new Set(), out = []; (Array.isArray(o) ? o : []).forEach(k => { if (ROSTER_ALL.includes(k) && !seen.has(k)) { seen.add(k); out.push(k); } }); ROSTER_ALL.forEach(k => { if (!seen.has(k)) out.push(k); }); return out; };
const saveDecks = () => { try { localStorage.setItem(DK, JSON.stringify({ active: activeDeck, decks })); } catch (e) {} };
(function loadDecks() {
  try { const d = JSON.parse(localStorage.getItem(DK) || 'null'); if (d && Array.isArray(d.decks) && d.decks.length) { decks = d.decks.slice(0, 5).map((x, i) => ({ name: String(x.name || 'Deck ' + (i + 1)).slice(0, 14), order: fixOrder(x.order) })); activeDeck = Math.min(Math.max(d.active | 0, 0), decks.length - 1); } } catch (e) {}
  if (!decks) { decks = [{ name: 'Deck 1', order: ROSTER_ALL.slice() }]; activeDeck = 0; }
  roster = decks[activeDeck].order;
})();
const teamOf = () => roster.slice(0, 4);
const cards = {}, railEls = [], snap = {};
const prefs = { hp: 0.6, half: false, clash: true, sfx: true };
try { Object.assign(prefs, JSON.parse(localStorage.getItem('anomex-duel2') || '{}')); } catch (e) {}
const savePrefs = () => { try { localStorage.setItem('anomex-duel2', JSON.stringify(prefs)); } catch (e) {} };
const UI = { mode: 'boot', sel: null, pv: null, resolveTurn: null, plot: null, plotted: null, flyer: null, retreating: null, camOn: false, hintId: 0, previewed: null, tipFor: null };

/* =========================================================
   Sound
   ========================================================= */
let AC = null, NB = null;
function actx() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (AC.state === 'suspended') AC.resume().catch(() => {});
  if (!NB) { NB = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  return AC;
}
let OUT = null;
function outBus(ac) {
  if (OUT && OUT.ctx === ac) return OUT.in;
  const inn = ac.createGain(), comp = ac.createDynamicsCompressor(), dly = ac.createDelay(0.5), fb = ac.createGain(), wet = ac.createGain(), lp = ac.createBiquadFilter();
  comp.threshold.value = -16; comp.ratio.value = 4; dly.delayTime.value = 0.11; fb.gain.value = 0.32; wet.gain.value = 0.22; lp.type = 'lowpass'; lp.frequency.value = 3200;
  inn.connect(comp); inn.connect(dly); dly.connect(lp); lp.connect(fb); fb.connect(dly); lp.connect(wet); wet.connect(comp); comp.connect(ac.destination);
  OUT = { ctx: ac, in: inn }; return inn;
}
/* soft digital tone: smooth envelope, optional pitch glide, no chiptune waveforms */
function osc(ac, type, f0, f1, dur, vol, delay = 0, atk = 0.006) {
  const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + atk); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(outBus(ac)); o.start(t); o.stop(t + dur + 0.05);
}
/* glassy 2-operator FM bell/blip */
function fm(ac, f, ratio, idx, dur, vol, delay = 0) {
  const t = ac.currentTime + delay, c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
  c.type = 'sine'; m.type = 'sine'; c.frequency.value = f; m.frequency.value = f * ratio;
  mg.gain.setValueAtTime(f * idx, t); mg.gain.exponentialRampToValueAtTime(Math.max(1, f * idx * 0.05), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  m.connect(mg).connect(c.frequency); c.connect(g).connect(outBus(ac)); c.start(t); m.start(t); c.stop(t + dur + 0.05); m.stop(t + dur + 0.05);
}
/* filtered noise; bp = band-pass centre (sweeps to bp2 if given), else low-pass */
function nz(ac, dur, vol, lp, delay = 0, bp, bp2) {
  const t = ac.currentTime + delay, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = NB;
  if (bp) { f.type = 'bandpass'; f.Q.value = 6; f.frequency.setValueAtTime(bp, t); if (bp2) f.frequency.exponentialRampToValueAtTime(bp2, t + dur); } else { f.type = 'lowpass'; f.frequency.value = lp; }
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(outBus(ac)); s.start(t); s.stop(t + dur + 0.05);
}
let lastTick = 0;
function sfx(name, p = 1) {
  if (!prefs.sfx) return;
  if (name === 'tick') { const n = performance.now(); if (n - lastTick < 90) return; lastTick = n; }
  const ac = actx(); if (!ac) return;
  try {
    switch (name) {
      case 'tick': osc(ac, 'sine', 780, 620, 0.035, 0.022, 0, 0.003); break;
      case 'whoosh': nz(ac, 0.26, 0.1, 0, 0, 500, 3800); break;
      case 'hit': nz(ac, 0.07, 0.15 + p * 0.06, 0, 0, 2400 + p * 600, 900); osc(ac, 'sine', 170 - p * 18, 42, 0.2 + p * 0.07, 0.3 + p * 0.08, 0, 0.003); fm(ac, 220, 2.01, 1.4, 0.16, 0.06 + p * 0.03); break;
      case 'block': fm(ac, 1250, 2.76, 1.1, 0.22, 0.08); nz(ac, 0.04, 0.06, 0, 0, 5200, 3000); break;
      case 'dodge': nz(ac, 0.2, 0.08, 0, 0, 3600, 900); fm(ac, 1500, 1, 0.3, 0.12, 0.03, 0.02); break;
      case 'data': osc(ac, 'sine', 140, 900, 0.34, 0.07, 0, 0.05); fm(ac, 640, 3, 0.9, 0.3, 0.04, 0.05); nz(ac, 0.3, 0.05, 0, 0, 1500, 6000); break;
      case 'twinkle': fm(ac, 1760, 2, 0.5, 0.2, 0.045); fm(ac, 2640, 2, 0.4, 0.18, 0.03, 0.06); break;
      case 'die': osc(ac, 'sine', 110, 26, 0.7, 0.4, 0, 0.004); nz(ac, 0.5, 0.14, 0, 0, 1800, 180); fm(ac, 330, 1.5, 2, 0.45, 0.05); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => { fm(ac, f, 2, 0.5, 0.45, 0.07, i * 0.11); fm(ac, f * 2, 1, 0.2, 0.35, 0.025, i * 0.11); }); break;
      case 'lose': [330, 262, 196, 147].forEach((f, i) => fm(ac, f, 1.01, 0.8, 0.5, 0.07, i * 0.16)); break;
    }
  } catch (e) {}
}

/* =========================================================
   Canvas effects (scaled to card size)
   ========================================================= */
const cv = $('#fx'), cx = cv.getContext('2d');
let CW = 0, CH = 0, CARDW = 90;
const S = () => cl(CARDW / 90, 0.8, 2.2);
function sizeCanvas() {
  const dpr = Math.min(1.25, window.devicePixelRatio || 1);
  CW = window.innerWidth; CH = window.innerHeight;
  cv.width = CW * dpr; cv.height = CH * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
const parts = [], rings = [], arcs = [], cracks = [], streaks = [], lenses = [], waves = [], glows = [];
let QF = 1; /* adaptive quality: drops if frames get slow */
const COL_CIT = ['#ff9a1f', '#ffd23f', '#ffb347', '#e8ff6b'];
const COL_FIELD = ['#ff5a1f', '#ff9a4a', '#ffd0a0', '#ffffff'];
const COL_HIT = ['#ffffff', '#e6e6e6', '#bdbdbd', '#ffffff'];
const COL_DATA = ['#ff5a1f', '#d4202b', '#ff9a4a', '#7d0f17'];

function sparks(x, y, n, spd, cols, o = {}) {
  n = Math.max(1, Math.round(n * QF)); if (parts.length > 900) return;
  for (let i = 0; i < n; i++) {
    const a = rnd(0, TAU), s = rnd(spd * 0.25, spd);
    parts.push({ k: 's', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: o.g == null ? 260 : o.g, life: 0, max: rnd(0.22, 0.6) * (o.life || 1), w: rnd(1, 2.4) * (o.size || 1), c: pickOne(cols) });
  }
}
function smoke(x, y, n, r) { for (let i = 0; i < n; i++) parts.push({ k: 'm', x: x + rnd(-r, r) * 0.4, y: y + rnd(-r, r) * 0.4, vx: rnd(-26, 26), vy: rnd(-50, -8), r: rnd(r * 0.5, r), life: 0, max: rnd(0.45, 0.85) }); }
function embers(x, y, n, spread) { for (let i = 0; i < n; i++) parts.push({ k: 'e', x: x + rnd(-spread, spread), y: y + rnd(-spread, spread) * 0.5, vx: rnd(-18, 18), vy: rnd(-100, -26), life: 0, max: rnd(0.6, 1.2), w: rnd(1, 2.2) }); }
function ring(x, y, r, delay = 0, col = '255,255,255', w = 3, dur = 0.42) { rings.push({ x, y, r, life: -delay, max: dur, col, w }); }
function arc(x1, y1, x2, y2, life = 0.3, jit = 12, seg = 8, pal) { if (arcs.length > 60) return; arcs.push({ x1, y1, x2, y2, life: 0, max: life, jit, seg, pts: null, t: 99, pal }); }
function twinkles(x, y, n, spread, cols, o = {}) { n = Math.max(1, Math.round(n * QF)); if (parts.length > 900) return; for (let i = 0; i < n; i++) { const a = rnd(0, TAU), d = rnd(0, spread), sp = rnd(10, 60) * (o.speed || 1); parts.push({ k: 'tw', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp + (o.rise ? -rnd(20, 70) : 0), life: 0, max: rnd(0.4, 0.95) * (o.life || 1), w: rnd(2, 5.5) * (o.size || 1), c: pickOne(cols) }); } }
function shockLines(x, y, n, d0, len, spd, col) { n = Math.max(4, Math.round(n * QF)); for (let i = 0; i < n; i++) parts.push({ k: 'l', x, y, a: (i / n) * TAU + rnd(-0.1, 0.1), d: d0 * rnd(0.8, 1.2), v: spd * rnd(0.7, 1.3), len: len * rnd(0.6, 1.4), life: 0, max: rnd(0.2, 0.36), c: col || '#ffffff' }); }
function chevrons(x, y, n, spread, col) { n = Math.max(2, Math.round(n * QF)); for (let i = 0; i < n; i++) parts.push({ k: 'v', x: x + rnd(-spread, spread), y: y - rnd(0, spread * 0.6), vy: rnd(70, 160), life: -rnd(0, 0.25), max: rnd(0.5, 0.8), w: rnd(4, 8), c: col }); }
function lens(x, y, r, delay = 0, dur = 0.7, tint = '255,90,40') { if (lenses.length > 8) return; lenses.push({ x, y, r, life: -delay, max: dur, tint, rot: rnd(0, TAU) }); }
function field(x, y, rx, ry, delay = 0, dur = 0.9, col = '255,110,40') { if (waves.length > 14) return; waves.push({ x, y, rx, ry, life: -delay, max: dur, col }); }
function glow(x, y, r, dur = 0.35, col = '255,140,50', delay = 0) { glows.push({ x, y, r, life: -delay, max: dur, col }); }
function converge(x, y, n, R, cols, dur = 0.3) { n = Math.max(4, Math.round(n * QF)); for (let i = 0; i < n; i++) { const a = rnd(0, TAU), r = R * rnd(0.7, 1.1), sp = r / dur; parts.push({ k: 's', x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: -Math.cos(a) * sp, vy: -Math.sin(a) * sp, g: 0, life: 0, max: dur, w: rnd(1.2, 2.6), c: pickOne(cols) }); } }
function crack(x, y, len) {
  const lines = [], n = 5 + ((Math.random() * 4) | 0);
  for (let i = 0; i < n; i++) {
    let a = rnd(0, TAU), px = x, py = y; const pts = [[px, py]], segs = 3 + ((Math.random() * 3) | 0);
    for (let s = 0; s < segs; s++) { a += rnd(-0.5, 0.5); const L = len * rnd(0.18, 0.34); px += Math.cos(a) * L; py += Math.sin(a) * L; pts.push([px, py]); }
    lines.push(pts);
  }
  cracks.push({ lines, life: 0, max: 0.8 });
}
function streak(x1, y1, x2, y2, col = '255,255,255') { streaks.push({ x1, y1, x2, y2, life: 0, max: 0.26, col }); }
function bolt(a) {
  const dx = a.x2 - a.x1, dy = a.y2 - a.y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, pts = [[a.x1, a.y1]];
  for (let i = 1; i < a.seg; i++) { const t = i / a.seg, off = rnd(-a.jit, a.jit) * (1 - Math.abs(t - 0.5) * 1.1); pts.push([a.x1 + dx * t + nx * off, a.y1 + dy * t + ny * off]); }
  pts.push([a.x2, a.y2]); return pts;
}
const shk = { a: 0, t: 0, d: 0.01 };
function shake(a, d) { if (RM) a *= 0.2; const k = shk.t < shk.d ? 1 - shk.t / shk.d : 0; if (a > shk.a * k) { shk.a = a; shk.t = 0; shk.d = d; } }
function flash(a, ms, col) { if (RM) return; const f = $('#flash'); f.style.background = col ? `rgb(${col})` : '#fff'; f.animate([{ opacity: 0 }, { opacity: a, offset: 0.12 }, { opacity: 0 }], { duration: ms }); }
function warp(amt = 1) { if (RM) return; const st = $('#stage'); st.animate([{ scale: 1, rotate: '0deg' }, { scale: 1 + 0.035 * amt, rotate: (0.5 * amt) + 'deg', offset: 0.25 }, { scale: 1 - 0.012 * amt, rotate: (-0.3 * amt) + 'deg', offset: 0.6 }, { scale: 1, rotate: '0deg' }], { duration: 620, easing: 'ease-out' }); }

let last = performance.now(), drew = false, fEma = 0.016;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const busy = parts.length || rings.length || arcs.length || cracks.length || streaks.length || lenses.length || waves.length || glows.length;
  if (!busy && shk.a === 0) { if (drew) { cx.clearRect(0, 0, CW, CH); drew = false; } requestAnimationFrame(frame); return; }
  fEma = fEma * 0.9 + dt * 0.1; if (fEma > 0.03) QF = Math.max(0.35, QF - 0.02); else if (fEma < 0.021 && QF < 1) QF = Math.min(1, QF + 0.004);
  drew = true; cx.clearRect(0, 0, CW, CH);
  cx.globalCompositeOperation = 'source-over';
  for (let i = cracks.length - 1; i >= 0; i--) {
    const c = cracks[i]; c.life += dt; if (c.life > c.max) { cracks.splice(i, 1); continue; }
    const al = 1 - c.life / c.max; cx.lineCap = 'round';
    c.lines.forEach(p => { cx.beginPath(); cx.moveTo(p[0][0], p[0][1]); for (let j = 1; j < p.length; j++) cx.lineTo(p[j][0], p[j][1]); cx.strokeStyle = `rgba(0,0,0,${al * 0.85})`; cx.lineWidth = 4; cx.stroke(); cx.strokeStyle = `rgba(255,255,255,${al})`; cx.lineWidth = 1.4; cx.stroke(); });
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; if (p.k !== 'm') continue;
    p.life += dt; if (p.life > p.max) { parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; const t = p.life / p.max, r = p.r * (1 + t * 0.8);
    const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    g.addColorStop(0, `rgba(0,0,0,${0.8 * (1 - t)})`); g.addColorStop(0.7, `rgba(40,40,40,${0.45 * (1 - t)})`); g.addColorStop(1, 'rgba(120,120,120,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, r, 0, TAU); cx.fill();
  }
  cx.globalCompositeOperation = 'lighter';
  for (let i = glows.length - 1; i >= 0; i--) {
    const g = glows[i]; g.life += dt; if (g.life < 0) continue; if (g.life > g.max) { glows.splice(i, 1); continue; }
    const t = g.life / g.max, r = g.r * (0.35 + 0.65 * (1 - Math.pow(1 - t, 3))), gr = cx.createRadialGradient(g.x, g.y, 0, g.x, g.y, r);
    gr.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - t)})`); gr.addColorStop(0.35, `rgba(${g.col},${0.55 * (1 - t)})`); gr.addColorStop(1, `rgba(${g.col},0)`);
    cx.fillStyle = gr; cx.beginPath(); cx.arc(g.x, g.y, r, 0, TAU); cx.fill();
  }
  for (let i = lenses.length - 1; i >= 0; i--) {
    const L = lenses[i]; L.life += dt; if (L.life < 0) continue; if (L.life > L.max) { lenses.splice(i, 1); continue; }
    const t = L.life / L.max, e = 1 - Math.pow(1 - Math.min(1, t * 1.7), 3), r = Math.max(0.5, L.r * e), al = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
    const g = cx.createRadialGradient(L.x, L.y, r * 0.5, L.x, L.y, r);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.72, `rgba(${L.tint},${0.1 * al})`); g.addColorStop(1, `rgba(255,210,170,${0.3 * al})`);
    cx.fillStyle = g; cx.beginPath(); cx.arc(L.x, L.y, r, 0, TAU); cx.fill();
    cx.lineWidth = 2; cx.strokeStyle = `rgba(255,40,30,${0.55 * al})`; cx.beginPath(); cx.arc(L.x, L.y, r + 3, 0, TAU); cx.stroke();
    cx.strokeStyle = `rgba(255,170,70,${0.55 * al})`; cx.beginPath(); cx.arc(L.x, L.y, Math.max(0.1, r - 3), 0, TAU); cx.stroke();
    cx.lineWidth = 1.5; cx.strokeStyle = `rgba(255,255,255,${0.7 * al})`; cx.beginPath(); cx.arc(L.x, L.y, r, 0, TAU); cx.stroke();
    cx.lineWidth = 1; cx.strokeStyle = `rgba(255,220,190,${0.22 * al})`; cx.beginPath(); cx.arc(L.x, L.y, r * 0.8, 0, TAU); cx.stroke(); cx.beginPath(); cx.arc(L.x, L.y, r * 0.6, 0, TAU); cx.stroke();
    const a0 = L.rot + t * 1.1; cx.lineWidth = Math.max(2, r * 0.035); cx.lineCap = 'round'; cx.strokeStyle = `rgba(255,255,255,${0.85 * al})`; cx.beginPath(); cx.arc(L.x, L.y, r * 0.9, a0, a0 + 0.6); cx.stroke();
    cx.lineWidth = Math.max(1.5, r * 0.02); cx.strokeStyle = `rgba(255,255,255,${0.5 * al})`; cx.beginPath(); cx.arc(L.x, L.y, r * 0.9, a0 + Math.PI, a0 + Math.PI + 0.3); cx.stroke();
  }
  for (let i = waves.length - 1; i >= 0; i--) {
    const w = waves[i]; w.life += dt; if (w.life < 0) continue; if (w.life > w.max) { waves.splice(i, 1); continue; }
    const t = w.life / w.max, e = 1 - Math.pow(1 - t, 2), rx = w.rx * (0.7 + 0.9 * e), ry = w.ry * (0.7 + 0.9 * e), al = (1 - t) * (t < 0.12 ? t / 0.12 : 1);
    cx.lineCap = 'round'; cx.lineWidth = 2.2 * (1 - t) + 0.8; cx.strokeStyle = `rgba(${w.col},${al})`; cx.setLineDash([16, 10]); cx.lineDashOffset = -w.life * 90;
    cx.beginPath(); cx.ellipse(w.x, w.y, rx, ry, 0, -1.15, 1.15); cx.stroke(); cx.beginPath(); cx.ellipse(w.x, w.y, rx, ry, 0, Math.PI - 1.15, Math.PI + 1.15); cx.stroke();
    cx.setLineDash([]); cx.lineWidth = 1; cx.strokeStyle = `rgba(255,230,200,${al * 0.5})`; cx.beginPath(); cx.ellipse(w.x, w.y, rx * 1.05, ry * 1.05, 0, -0.9, 0.9); cx.stroke(); cx.beginPath(); cx.ellipse(w.x, w.y, rx * 1.05, ry * 1.05, 0, Math.PI - 0.9, Math.PI + 0.9); cx.stroke();
  }
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i]; r.life += dt; if (r.life < 0) continue; if (r.life > r.max) { rings.splice(i, 1); continue; }
    const t = r.life / r.max; cx.beginPath(); cx.arc(r.x, r.y, r.r * (0.2 + 0.8 * (1 - Math.pow(1 - t, 2))), 0, TAU);
    cx.strokeStyle = `rgba(${r.col},${1 - t})`; cx.lineWidth = r.w * (1 - t) + 0.5; cx.stroke();
  }
  for (let i = streaks.length - 1; i >= 0; i--) {
    const s = streaks[i]; s.life += dt; if (s.life > s.max) { streaks.splice(i, 1); continue; }
    const t = s.life / s.max, hx = s.x1 + (s.x2 - s.x1) * Math.min(1, t * 2.2), hy = s.y1 + (s.y2 - s.y1) * Math.min(1, t * 2.2);
    cx.strokeStyle = `rgba(${s.col},${1 - t})`; cx.lineWidth = 3 * (1 - t) + 1; cx.beginPath(); cx.moveTo(s.x1, s.y1); cx.lineTo(hx, hy); cx.stroke();
  }
  for (let i = arcs.length - 1; i >= 0; i--) {
    const a = arcs[i]; a.life += dt; if (a.life > a.max) { arcs.splice(i, 1); continue; }
    a.t += dt; if (a.t > 0.05) { a.pts = bolt(a); a.t = 0; }
    const al = 1 - a.life / a.max; cx.lineJoin = 'round';
    const path = () => { cx.beginPath(); cx.moveTo(a.pts[0][0], a.pts[0][1]); for (let j = 1; j < a.pts.length; j++) cx.lineTo(a.pts[j][0], a.pts[j][1]); };
    const cit = a.pal === 'cit';
    path(); cx.strokeStyle = cit ? `rgba(255,150,20,${0.32 * al})` : `rgba(212,32,43,${0.3 * al})`; cx.lineWidth = 5; cx.stroke();
    path(); cx.strokeStyle = cit ? `rgba(255,205,50,${0.9 * al})` : `rgba(255,90,31,${0.85 * al})`; cx.lineWidth = 2; cx.stroke();
    path(); cx.strokeStyle = cit ? `rgba(255,255,200,${al})` : `rgba(255,214,170,${al})`; cx.lineWidth = 0.9; cx.stroke();
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; if (p.k === 'm') continue;
    p.life += dt; if (p.life > p.max) { parts.splice(i, 1); continue; }
    const t = Math.max(0, p.life / p.max);
    if (p.k === 'tw') {
      if (p.life < 0) continue; p.x += p.vx * dt; p.y += p.vy * dt; const sz = p.w * (0.4 + Math.sin(t * Math.PI) * 1.1);
      cx.globalAlpha = Math.min(1, (1 - t) * 1.6); cx.strokeStyle = p.c; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(p.x - sz, p.y); cx.lineTo(p.x + sz, p.y); cx.moveTo(p.x, p.y - sz); cx.lineTo(p.x, p.y + sz); cx.stroke();
      cx.lineWidth = 0.8; cx.beginPath(); cx.moveTo(p.x - sz * 0.5, p.y - sz * 0.5); cx.lineTo(p.x + sz * 0.5, p.y + sz * 0.5); cx.moveTo(p.x - sz * 0.5, p.y + sz * 0.5); cx.lineTo(p.x + sz * 0.5, p.y - sz * 0.5); cx.stroke(); cx.globalAlpha = 1;
    } else if (p.k === 'l') {
      p.d += p.v * dt; const c = Math.cos(p.a), sn = Math.sin(p.a); cx.globalAlpha = 1 - t; cx.strokeStyle = p.c; cx.lineWidth = 1.6 * (1 - t) + 0.6; cx.beginPath(); cx.moveTo(p.x + c * p.d, p.y + sn * p.d); cx.lineTo(p.x + c * (p.d + p.len), p.y + sn * (p.d + p.len)); cx.stroke(); cx.globalAlpha = 1;
    } else if (p.k === 'v') {
      if (p.life < 0) continue; p.y += p.vy * dt; cx.globalAlpha = (1 - t) * 0.9; cx.strokeStyle = p.c; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(p.x - p.w, p.y - p.w * 0.6); cx.lineTo(p.x, p.y); cx.lineTo(p.x + p.w, p.y - p.w * 0.6); cx.stroke(); cx.globalAlpha = 1;
    } else if (p.k === 's') {
      p.vy += p.g * dt; const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
      cx.strokeStyle = p.c; cx.globalAlpha = 1 - t; cx.lineWidth = p.w; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(nx - p.vx * 0.012, ny - p.vy * 0.012); cx.stroke(); cx.globalAlpha = 1;
      p.x = nx; p.y = ny;
    } else {
      p.x += p.vx * dt; p.y += p.vy * dt; cx.globalAlpha = (1 - t) * (0.6 + Math.random() * 0.4); cx.fillStyle = '#ff7a2a'; cx.fillRect(p.x, p.y, p.w, p.w); cx.globalAlpha = 1;
    }
  }
  cx.globalCompositeOperation = 'source-over';
  const st = $('#app');
  if (shk.a > 0) {
    shk.t += dt;
    if (shk.t >= shk.d) { shk.a = 0; st.style.transform = ''; }
    else { const k = 1 - shk.t / shk.d, a = shk.a * k; st.style.transform = `translate(${rnd(-a, a).toFixed(1)}px,${rnd(-a, a).toFixed(1)}px) rotate(${(rnd(-a, a) * 0.04).toFixed(2)}deg)`; }
  }
  requestAnimationFrame(frame);
}

// Impact scales with damage: <=2 small, 3-5 medium, 6-8 large, 9+ quake.
function impact(x, y, dmg, kind) {
  const s = S(), tier = dmg <= 2 ? 1 : dmg <= 5 ? 2 : dmg <= 8 ? 3 : 4;
  const cols = kind === 'data' ? COL_DATA : COL_HIT;
  const rc = kind === 'data' ? '255,90,31' : '255,255,255';
  if (tier === 1) { sparks(x, y, 9, 200 * s, cols); ring(x, y, 22 * s, 0, rc, 2, 0.28); twinkles(x, y, 2, 14 * s, cols); }
  if (tier === 2) { shockLines(x, y, 10, 10 * s, 18 * s, 380 * s, kind === 'data' ? '#ff9a4a' : '#fff'); twinkles(x, y, 4, 26 * s, cols); sparks(x, y, 24, 300 * s, cols); ring(x, y, 40 * s, 0, rc, 3, 0.38); smoke(x, y, 2, 20 * s); shake(3, 0.16); }
  if (tier === 3) { lens(x, y, 70 * s, 0, 0.45, kind === 'data' ? '255,90,40' : '200,200,255'); shockLines(x, y, 16, 12 * s, 24 * s, 520 * s, kind === 'data' ? '#ff9a4a' : '#fff'); twinkles(x, y, 7, 40 * s, cols); glow(x, y, 80 * s, 0.3, kind === 'data' ? '255,90,30' : '255,255,255'); sparks(x, y, 44, 420 * s, cols, { size: 1.2 }); ring(x, y, 56 * s, 0, rc, 4, 0.42); ring(x, y, 86 * s, 0.07, '255,90,31', 2, 0.48); smoke(x, y, 4, 30 * s); crack(x, y, 50 * s); shake(7, 0.28); flash(0.2, 240); }
  if (tier === 4) { lens(x, y, 130 * s, 0, 0.6, '255,70,40'); lens(x, y, 90 * s, 0.08, 0.5, '255,160,90'); shockLines(x, y, 28, 14 * s, 34 * s, 720 * s, '#ffb070'); twinkles(x, y, 12, 60 * s, cols, { rise: true }); glow(x, y, 140 * s, 0.4, '255,70,30'); warp(0.8); sparks(x, y, 90, 600 * s, cols, { size: 1.5 }); sparks(x, y, 30, 260 * s, COL_DATA, { g: 600, life: 1.3 }); ring(x, y, 70 * s, 0, '255,255,255', 6, 0.5); ring(x, y, 120 * s, 0.07, '255,90,31', 4, 0.58); ring(x, y, 180 * s, 0.14, '212,32,43', 3, 0.66); smoke(x, y, 8, 44 * s); crack(x, y, 100 * s); crack(x, y, 72 * s); embers(x, y, 14, 26 * s); shake(15, 0.6); flash(0.55, 400); }
  return tier;
}
function dataFX(x, y, level) {
  const s = S(), n = 2 + level * 2, R = (30 + level * 18) * s;
  for (let i = 0; i < n; i++) { const a = rnd(0, TAU), r = rnd(R * 0.5, R); arc(x + rnd(-5, 5), y + rnd(-5, 5), x + Math.cos(a) * r, y + Math.sin(a) * r, rnd(0.22, 0.42), 6 + level * 2, 7); }
  embers(x, y, 3 + level * 4, 14 * s); twinkles(x, y, 2 + level * 2, R * 0.9, COL_DATA, { rise: true });
  if (level >= 2) { ring(x, y, 60 * s, 0, '212,32,43', 3, 0.45); glow(x, y, 70 * s, 0.3, '255,70,30'); }
  if (level >= 3) { flash(0.25, 320); shake(3, 0.25); }
}
function shieldFX(x, y) { sparks(x, y, 14, 240 * S(), COL_HIT, { g: 100 }); ring(x, y, 38 * S(), 0, '255,255,255', 3, 0.32); }

/* =========================================================
   Card building and painting
   ========================================================= */
function buildCard(u) {
  const d = DEFS[u.key];
  const w = el('div', 'cardwrap'); w.dataset.uid = u.uid; w.tabIndex = 0; w.setAttribute('role', 'button');
  w.innerHTML = `<div class="card tilt"><div class="aura"><i></i><i></i></div><div class="glare"></div><div class="frame"></div>
    <div class="icon"><img src="icons/${u.key}.png" alt="" draggable="false"></div><div class="tags"></div><div class="rest"></div>
    ${STATS.map(k => `<button type="button" class="notch n-${k.toLowerCase()}" data-k="${k}" tabindex="-1" aria-label="${SNAME[k]}"><img src="${ICO[k]}" alt="" draggable="false"><i class="lg"></i><i class="val"></i><i class="pv"></i></button>`).join('')}
    <div class="info"><div class="irow"><b class="nm"${(d.short || d.name).length > 6 ? ' data-l="' + (d.short || d.name).length + '"' : ''}>${d.short || d.name}</b><span class="hpn"></span></div><div class="role">${d.role}</div><div class="hp"><b class="tr"></b><i></i></div></div></div>`;
  paint(w, u);
  return w;
}
const viewVal = (u, k) => (UI.pv && UI.pv.u === u) ? UI.pv.v[k] : u.cur[k];
const real0 = u => !!(!u.pseudo && G && G.ctrl[1 - u.side] === 'human');
function paintRefs(w) {
  if (w._r) return w._r;
  const r = w._r = { card: $('.card', w), rest: $('.rest', w), hpi: $('.hp i', w), hptr: $('.hp .tr', w), hp: $('.hp', w), hpn: $('.hpn', w), tags: $('.tags', w), n: {}, v: {} };
  STATS.forEach(k => { const n = $('.n-' + k.toLowerCase(), w); r.n[k] = n; r.v[k] = $('.val', n); });
  return r;
}
function paint(w, u) {
  const R = paintRefs(w), card = R.card; if (!card) return;
  w.classList.toggle('dead', !u.alive);
  w.classList.toggle('au-red', u.alive && !u.pseudo && (u.cur.STR > u.max.STR || u.ua));
  w.classList.toggle('au-dep', u.alive && (u.dep > 0 || u.chg > 0));
  w.classList.toggle('au-hard', u.alive && u.harden > 0);
  w.classList.toggle('au-coat', u.alive && !!u.coat);
  w.classList.toggle('au-rdy', u.alive && !!(u.bash || u.bd || u.succ || u.fp || u.makeup || u.manip || u.lost || u.stat || u.sharp || u.ds || u.blend || u.wing || u.rookie || u.coll > 0 || u.imp > 0 || ((u.baton || u.glob) && !(real0(u)))));
  card.classList.toggle('resting', u.alive && (u.rest > 0 || u.nap));
  const rt = u.rest > 0 ? 'REST<br>' + u.rest : (u.nap ? 'NAP<br>zzZ' : ''); if (w._rt !== rt) { w._rt = rt; R.rest.innerHTML = rt; }
  const pct = u.hp / u.maxhp * 100, hk = u.hp + '/' + u.maxhp;
  if (w._hk !== hk) { w._hk = hk; const ws = pct + '%'; R.hpi.style.width = ws; R.hptr.style.width = ws; R.hp.style.setProperty('--n', u.maxhp); R.hpn.innerHTML = u.hp + '<small>/' + u.maxhp + '</small>'; }
  R.hp.classList.toggle('low', pct <= 30 && u.alive);
  const real = !u.pseudo && G;
  STATS.forEach(k => {
    const n = R.n[k], v = viewVal(u, k), vt = v + (v !== u.max[k] ? '/' + u.max[k] : '');
    if (R.v[k]._t !== vt) { R.v[k]._t = vt; R.v[k].textContent = vt; }
    n.classList.toggle('zero', v === 0); n.classList.toggle('up', v > u.max[k]);
    n.classList.toggle('dbf', !!(real && G.debuffs.some(d => d.target === u && d.amt[k])));
  });
  const fl = [];
  if (u.makeup) fl.push('<span>MAKEUP</span>');
  if (u.fp) fl.push('<span>PERFECT</span>');
  if (u.dep > 0) fl.push('<span>DEPULSION</span>'); if (u.harden > 0) fl.push('<span>HARDEN</span>'); if (u.bd) fl.push('<span>BEATDOWN</span>'); if (u.bash) fl.push('<span>BASH</span>'); if (u.ua) fl.push('<span>UNSTABLE</span>'); if (u.succ) fl.push('<span>' + (u.taught ? 'TAUGHT' : 'SUCCESSOR') + '</span>');
  if (u.chg > 0) fl.push('<span>CHARGE ' + u.chg + '/3</span>'); if (u.manip) fl.push('<span>MANIPULATOR</span>'); if (u.boost > 0) fl.push('<span>+3 STR</span>');
  if (u.coat) fl.push('<span class="neg">COATED</span>'); if (u.bud) fl.push('<span class="neg">BUDDED</span>'); if (u.lost) fl.push('<span>LOST</span>'); if (u.stat) fl.push('<span>STATIONARY</span>'); if (u.sharp) fl.push('<span>CLAWS</span>'); if (u.ds) fl.push('<span>DOUBLE</span>');
  if (u.hm > 0 && !(real && G.ctrl[1 - u.side] === 'human')) fl.push("<span>HE'S MINE</span>");
  if (u.dc > 0) fl.push('<span>DEPU-COUNTER</span>'); if (u.imp > 0) fl.push('<span>IMPRESSION</span>'); if (u.blend) fl.push('<span>BLENDER</span>'); if (u.shard) fl.push('<span class="neg">SHARDS ' + u.shard.n + '</span>');
  if (u.wing) fl.push('<span>WINGWOMAN</span>'); if (u.rookie) fl.push('<span>ROOKIE</span>'); if (u.coll > 0) fl.push('<span>COLLATERAL</span>'); if (u.frz && u.rest > 0) fl.push('<span class="neg">FROZEN</span>'); if (u.noDodge > 0) fl.push('<span class="neg">NO DODGE</span>');
  if (u.baton && !(real && G.ctrl[1 - u.side] === 'human')) fl.push('<span>BATON</span>'); if (u.glob && !(real && G.ctrl[1 - u.side] === 'human')) fl.push('<span>GLOB</span>');
  if (real && G.debuffs.some(d => d.target === u)) fl.push('<span class="neg">DEBUFF</span>');
  const tg = fl.join(''); if (w._tg !== tg) { w._tg = tg; R.tags.innerHTML = tg; }
  const al = `${u.name}, ${u.hp} of ${u.maxhp} HP${u.alive ? '' : ', down'}${u.rest > 0 ? ', resting' : ''}. Strength ${u.cur.STR}, Agility ${u.cur.AGI}, Brains ${u.cur.BRN}, DATA ${u.cur.DATA}.`;
  if (w._al !== al) { w._al = al; w.setAttribute('aria-label', al); }
  if (!UI.pv || UI.pv.u !== u) snap[u.uid] = Object.assign({}, u.cur);
}
function cloneCard(u) {
  const f = cards[u.uid].wrap.cloneNode(true);
  f.classList.remove('sel', 'tgt', 'away', 'guard', 'lift', 'dead', 'hurt'); f.classList.add('clone'); f.removeAttribute('tabindex'); delete f.dataset.uid;
  $$('.notch', f).forEach(n => { n.tabIndex = -1; n.classList.remove('lit', 'pop'); });
  return f;
}

function buildBoard() {
  const b = $('#board'); b.innerHTML = '';
  Object.keys(cards).forEach(k => delete cards[k]); railEls.length = 0;
  b.appendChild(el('div', 'pile foe', '<span class="pl">FALLEN</span>')); b.appendChild(el('div', 'pile me', '<span class="pl">FALLEN</span>'));
  for (let s = 1; s >= 0; s--) {
    G.sides[s].forEach(u => {
      const slot = el('div', 'slot ' + (s === 1 ? 'foe' : 'me')); slot.style.gridColumn = u.slot + 1;
      const w = buildCard(u); slot.appendChild(w); b.appendChild(slot); cards[u.uid] = { wrap: w, slot, unit: u };
    });
  }
  for (let i = 0; i < 4; i++) {
    const r = el('div', 'rs', `<span class="lbl">AR</span><span class="eff">CAP -2 STR</span>`); r.style.gridColumn = i + 1; r.dataset.slot = i; b.appendChild(r); railEls.push(r);
  }
  fit();
}
function updateAll() {
  if (!G) return;
  for (let s = 0; s < 2; s++) G.sides[s].forEach(u => { const c = cards[u.uid]; if (c) paint(c.wrap, u); });
  railEls.forEach((r, i) => { r.classList.toggle('cap', E.capAt(i)); r.classList.toggle('unst', !!(G.rail[i] && G.rail[i].type === 'unstable')); r.classList.toggle('lost', !!(G.rail[i] && G.rail[i].type === 'lost')); r.classList.toggle('atom', !!(G.atom && G.atom[0][i])); });
  ['foe', 'me'].forEach((cl2, i) => {
    const side = i === 0 ? 1 : 0, p = $('.pile.' + cl2); if (!p) return;
    const dead = G.sides[side].filter(u => !u.alive), have = $$('.mini', p).length;
    if (dead.length !== have) { $$('.mini', p).forEach(m => m.remove()); dead.forEach(u => { const im = el('img', 'mini'); im.src = 'icons/' + u.key + '.png'; im.alt = u.name + ' (down)'; p.appendChild(im); }); }
  });
  const tag = $('#turnTag');
  if (G.over) { $('#turnWho').textContent = 'Duel over'; tag.className = ''; }
  else { $('#turnWho').textContent = G.ctrl[G.turn] === 'human' ? 'Your turn' : (G.ctrl[1] === 'remote' ? "Friend's turn" : G.ctrl[0] === 'cpu' ? 'Side ' + (G.turn + 1) : 'CPU turn'); tag.className = G.turn === 0 ? 'me' : 'cpu'; }
  $('#turnNo').textContent = 'R' + Math.ceil(G.turnNo / 2);
}
function fit() {
  const st = $('#stage'), b = $('#board'); if (!st || !st.clientHeight) return;
  const W = st.clientWidth, H = st.clientHeight, pad = 12, gk = 0.08, R = 1.38;
  const cwStrip = Math.min((W - pad * 2) / (4 + 3 * gk), (H - pad * 2 - 56) / (3 * R + 4 * gk));
  const cwSide = Math.min((W - pad * 2) / (5 + 4 * gk), (H - pad * 2) / (3 * R + 2 * gk));
  const side = cwSide >= cwStrip * 1.02;
  CARDW = Math.max(44, Math.min(210, Math.floor(side ? cwSide : cwStrip)));
  b.className = (side ? 'side' : 'strip') + (b.classList.contains('focus') ? ' focus' : '');
  b.style.setProperty('--cw', CARDW + 'px');
}

/* =========================================================
   Camera: zoom and pitch toward a slot
   ========================================================= */
let camSettle = 0;
function camEl(slotEl, opt = {}) {
  const cam = $('#cam'), board = $('#board'), st = $('#stage');
  const ox = board.offsetLeft + slotEl.offsetLeft + slotEl.offsetWidth / 2, oy = board.offsetTop + slotEl.offsetTop + slotEl.offsetHeight / 2;
  const sw = st.clientWidth, sh = st.clientHeight;
  let dx = (sw / 2 - ox) * (opt.cx != null ? opt.cx : 0.5), dy = (sh / 2 - oy) * 0.3;
  if (opt.panX != null) dx = opt.panX * sw - ox;
  const ry = RM ? 0 : cl((ox - sw / 2) / sw * -16, -9, 9), rx = RM ? 0 : (opt.rx != null ? opt.rx : 13);
  let sc = opt.sc || 1.75; const bt = board.offsetTop, bh = board.offsetHeight;
  if (!opt.free) {
    const hh = slotEl.offsetHeight / 2, hw = slotEl.offsetWidth / 2;
    sc = Math.min(sc, (sh - 28) / (hh * 2), (sw - 20) / (hw * 2)); sc = Math.max(sc, 1.06);
    const pad = 12, k = 0.9;
    dy = (sh / 2 - oy) * 0.55;
    const top = oy + dy - hh * sc * k, bot = oy + dy + hh * sc * k;
    if (top < pad) dy += pad - top; else if (bot > sh - pad) dy -= bot - (sh - pad);
  } else if (opt.cy != null) dy = (sh * opt.cy) - oy;
  opt = Object.assign({}, opt, { sc });
  const mk = (a, b) => `translate(${dx + ox}px,${dy + oy}px) rotateX(${a}deg) rotateY(${b}deg) scale(${opt.sc || 1.75}) translate(${-ox}px,${-oy}px)`;
  clearTimeout(camSettle); cam.style.transform = mk(rx, ry);
  UI.camOn = true; $('#board').classList.add('focus');
}
function camReset() {
  const was = UI.camOn; UI.camOn = false; clearTimeout(camSettle);
  $('#cam').style.transform = 'none'; $('#board').classList.remove('focus');
  return was ? sleep(RM ? 30 : 600) : Promise.resolve();
}

/* =========================================================
   Tilt (saucer) + hover
   ========================================================= */
window.addEventListener('pointerup', () => (UI.holds || []).forEach(f => f())); window.addEventListener('pointercancel', () => (UI.holds || []).forEach(f => f()));
let hovN = null;
function notchHover(w, e, r) {
  const card = w.querySelector('.card'); if (!card || w.classList.contains('dead')) return;
  const px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100 * (r.height / r.width) , cw = card.offsetWidth;
  let best = null, bd = 1e9;
  $$('.notch', w).forEach(n => { const cx = (n.offsetLeft + n.offsetWidth / 2) / cw * 100, cy = (n.offsetTop + n.offsetHeight / 2) / cw * 100 - 3, d = Math.hypot(px - cx, py - cy); if (d < bd) { bd = d; best = n; } });
  const lim = hovN && hovN === best ? 15 : 11.5;
  const nn = bd < lim ? best : null;
  if (nn !== hovN) { if (hovN) hovN.classList.remove('hov'); if (nn) nn.classList.add('hov'); hovN = nn; }
}
function nearestNotch(w, e, lim) {
  const card = w.querySelector('.card'); if (!card) return null; const r = w.getBoundingClientRect(), cw = card.offsetWidth;
  const px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.width * 100; let best = null, bd = 1e9;
  $$('.notch', w).forEach(n => { const cx = (n.offsetLeft + n.offsetWidth / 2) / cw * 100, cy = (n.offsetTop + n.offsetHeight / 2) / cw * 100 - 3, d = Math.hypot(px - cx, py - cy); if (d < bd) { bd = d; best = n; } });
  return bd < lim ? best : null;
}
function notchHoverOff() { if (hovN) { hovN.classList.remove('hov'); hovN = null; } }
let tw = null, tcard = null, tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, tRaf = 0, tOut = 0;
function tiltApply() {
  const c = tcard; if (!c) { tRaf = 0; return; }
  cur.x += (tgt.x - cur.x) * 0.22; cur.y += (tgt.y - cur.y) * 0.22;
  c.style.setProperty('--ry', (cur.x * 6).toFixed(2) + 'deg'); c.style.setProperty('--rx', (-cur.y * 6).toFixed(2) + 'deg');
  c.style.setProperty('--gx', ((cur.x + 0.5) * 100).toFixed(0) + '%'); c.style.setProperty('--gy', ((cur.y + 0.5) * 100).toFixed(0) + '%');
  const done = !tw && Math.abs(cur.x) < 0.004 && Math.abs(cur.y) < 0.004;
  if (done) { ['--rx', '--ry'].forEach(p => c.style.removeProperty(p)); c.classList.remove('tilting'); tcard = null; tRaf = 0; return; }
  tRaf = requestAnimationFrame(tiltApply);
}
function tiltEnd() { notchHoverOff(); tw = null; tgt = { x: 0, y: 0 }; if (tcard) { tcard.classList.remove('tilting'); if (!tRaf) tRaf = requestAnimationFrame(tiltApply); } }
document.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch' || RM) return;
  if ((drag && drag.started) || UI.dnd) return tiltEnd();
  const w = e.target.closest && e.target.closest('.cardwrap');
  if (!w || w.classList.contains('clone') || w.closest('.tile') || !w.querySelector('.tilt') || ($('#board').classList.contains('locked') && !w.classList.contains('sel') && w.closest('.slot.me'))) { if (tw && !tOut) tOut = setTimeout(() => { tOut = 0; tiltEnd(); }, 90); return; }
  clearTimeout(tOut); tOut = 0;
  if (tw !== w) { if (tcard && tcard !== w.querySelector('.tilt')) { tcard.classList.remove('tilting'); ['--rx', '--ry'].forEach(p => tcard.style.removeProperty(p)); cur = { x: 0, y: 0 }; } tw = w; tcard = w.querySelector('.tilt'); }
  const r = w.getBoundingClientRect(); notchHover(w, e, r);
  tgt.x = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5)); tgt.y = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
  tcard.classList.add('tilting'); if (!tRaf) tRaf = requestAnimationFrame(tiltApply);
});
document.addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest('#stage, #arrange, .tile, .cardwrap, #inspect, .ov')) e.preventDefault(); });
document.addEventListener('dragstart', e => { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); });
document.addEventListener('pointerleave', tiltEnd); window.addEventListener('blur', tiltEnd);

/* =========================================================
   Floating text, notch effects
   ========================================================= */
const center = e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, l: r.left, t: r.top }; };
function floatAt(x, y, text, cls, size) {
  const f = el('div', 'float ' + cls, text); f.style.left = x + 'px'; f.style.top = y + 'px'; if (size) f.style.fontSize = size + 'px';
  document.body.appendChild(f); f.addEventListener('animationend', () => f.remove()); setTimeout(() => f.remove(), 1400);
}
function ufloat(u, text, cls, size) { const c = cards[u.uid]; if (!c) return; const P = center(c.wrap); floatAt(P.x + rnd(-6, 6), P.y - P.h * 0.12, text, cls, size || Math.max(14, P.w * 0.2)); }
function twinkle(x, y) { const t = el('div', 'twink'); t.style.left = x + 'px'; t.style.top = y + 'px'; document.body.appendChild(t); t.addEventListener('animationend', () => t.remove()); sfx('twinkle'); }
function notchEl(u, k) { const c = cards[u.uid]; return c && $('.n-' + k.toLowerCase(), c.wrap); }
function notchPop(u, k, text, cls) {
  const n = notchEl(u, k); if (!n) return;
  n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); setTimeout(() => n.classList.remove('pop'), 700);
  const r = center(n); twinkle(r.x, r.y); sparks(r.x, r.y, 7, 110 * S(), COL_HIT, { g: -30 });
  floatAt(r.x, r.y - r.h * 0.8, text, cls || 'buf', Math.max(13, r.w * 0.85));
}
function notchSpark(u, k) {
  const n = notchEl(u, k); if (!n) return; const r = center(n);
  n.classList.remove('data-spark'); void n.offsetWidth; n.classList.add('data-spark'); setTimeout(() => n.classList.remove('data-spark'), 800);
  sparks(r.x, r.y, 22, 220 * S(), COL_DATA, { g: 100 }); dataFX(r.x, r.y, 1); sfx('data');
}
function costFx(act) {
  const u = act.agent; if (!u) return;
  if (act.type === 'attack' && !u.fp) notchPop(u, 'STR', '-' + Math.ceil(act.X * CFG.attackCostFrac), 'dbf');
  else if (act.type === 'ability') {
    const ab = DEFS[u.key].abilities.find(x => x.id === act.id) || { cost: act.id === 'disch' ? 1 : 0 }, c = ab.cost === 'X' ? act.X : ab.cost;
    if (c !== 0) { notchSpark(u, 'DATA'); notchPop(u, 'DATA', typeof c === 'number' ? '-' + c : '-' + 'ALL', 'dbf'); }
    if (act.id === 'bb' && act.ally) notchPop(act.ally, 'STR', '-' + Math.ceil(act.X * CFG.attackCostFrac), 'dbf');
  } else if (act.type === 'transfer') { notchPop(u, 'BRN', '-1', 'dbf'); notchPop(u, act.stat, '-1', 'dbf'); }
  else if (act.type === 'recover') notchPop(u, act.stat, '+1', 'buf');
}

/* =========================================================
   Tooltip
   ========================================================= */
function showTip(title, text, anchor) {
  const t = $('#tip'); t.innerHTML = `<b>${title}</b>${text}`; t.classList.add('on');
  const r = anchor.getBoundingClientRect(), tw = Math.min(240, t.offsetWidth || 200);
  t.style.left = cl(r.left + r.width / 2 - tw / 2, 6, window.innerWidth - tw - 6) + 'px';
  const above = r.top > 90; t.style.top = (above ? r.top - (t.offsetHeight || 56) - 8 : r.bottom + 8) + 'px';
}
function hideTip() { $('#tip').classList.remove('on'); UI.tipFor = null; }

/* =========================================================
   Hint / tray helpers
   ========================================================= */
function hintSet(title, sub) { $('#hint').innerHTML = title ? `<b>${title}</b>${sub || ''}` : ''; syncBack(); }
function syncBack() { const b = document.getElementById('btnBack'); if (!b) return; if (UI.sel && ['sel', 'abil', 'const', 'place', 'plot'].indexOf(UI.mode) >= 0) b.classList.add('on'); else b.classList.remove('on'); }
function setTray(...n) { const k = n.filter(Boolean); if (k.length) showPod(k); else hidePod(); }
function hidePod() { $$('#podlayer .fpod').forEach(x => x.remove()); $('#dimmer').classList.remove('on'); }
function showPod(nodes) {
  hidePod(); const L = $('#podlayer'), p = el('div', 'fpod'); nodes.forEach(n => p.appendChild(n)); L.appendChild(p); $('#dimmer').classList.add('on');
  let l = 1e9, r = -1e9, t = 1e9, b = -1e9; $$('.slot.me').forEach(sl => { const q = sl.getBoundingClientRect(); l = Math.min(l, q.left); r = Math.max(r, q.right); t = Math.min(t, q.top); b = Math.max(b, q.bottom); });
  const W = window.innerWidth, H = window.innerHeight, w = Math.min(W - 16, Math.max(340, r - l + 30), 440);
  p.style.width = w + 'px'; const h = p.offsetHeight;
  p.style.left = cl((l + r) / 2, w / 2 + 8, W - w / 2 - 8) + 'px'; p.style.top = cl((t + b) / 2, h / 2 + 8, H - h / 2 - 8) + 'px';
}
function toast(msg) { $('#ticker').textContent = msg; }
function btn(label, cls, fn, sub, disabled) {
  const b = el('button', 'btn ' + (cls || ''), label + (sub ? `<small>${sub}</small>` : '')); b.type = 'button';
  if (disabled) b.disabled = true;
  b.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); fn(e); }); return b;
}
function miniStep(min, max, val, on) {
  const w = el('div', 'mini-step'), m = el('button', '', '-'), v = el('span', '', val), p = el('button', '', '+');
  m.type = p.type = 'button'; m.setAttribute('aria-label', 'less'); p.setAttribute('aria-label', 'more');
  let cur = val; const set = n => { cur = cl(n, min, max); v.textContent = cur; on(cur); };
  m.onclick = () => { sfx('tick'); set(cur - 1); }; p.onclick = () => { sfx('tick'); set(cur + 1); };
  w.append(m, v, p); return w;
}
function clearMarks() { $$('.cardwrap').forEach(w => w.classList.remove('sel', 'tgt', 'guard')); railEls.forEach(r => r.classList.remove('pick', 'hot')); }

/* =========================================================
   Human turn: select -> notches -> rail
   ========================================================= */
function humanTurn() {
  return new Promise(res => {
    UI.resolveTurn = res;
    if (!E.alive(0).some(u => u.rest === 0)) { UI.mode = 'busy'; hintSet('No agent is ready', 'Everyone is resting, so the turn passes.'); setTimeout(() => commit({ type: 'pass' }), 1400); return; }
    goIdle();
  });
}
function goIdle() {
  UI.allyFn = null;
  closeMenus(); stopHint(); removePlot(); clearMarks(); camReset();
  const prev = UI.sel; UI.sel = null; UI.pv = null; UI.mode = 'idle';
  $$('.notch').forEach(n => { n.classList.remove('lit'); n.tabIndex = -1; });
  if (prev && cards[prev.uid]) paint(cards[prev.uid].wrap, prev);
  setTray(); syncBack(); hintSet('Your move', 'Tap an agent to pick it. It gets +1 on every stat, then acts once.');
}
function backToSel() {
  UI.allyFn = null; UI.allySelf = false;
  const u = UI.sel; if (!u) return goIdle();
  closeMenus(); stopHint(); removePlot(); railEls.forEach(r => r.classList.remove('pick', 'hot')); $$('.cardwrap').forEach(w => w.classList.remove('tgt'));
  UI.mode = 'sel'; setTray(); camEl(cards[u.uid].slot); lightNotches(u); selHint(u);
}
function selHint(u) {
  if (u.rest > 0) return hintSet(u.name + ' is resting', `${u.rest} more turn${u.rest > 1 ? 's' : ''}. It can't act, defend or dodge. Tap empty space to go back.`);
  hintSet(u.name, 'Drag the card to the Action Rail to attack, or tap a lit stat. Tap empty space to cancel.');
}
function selectAgent(u) {
  if (!['idle', 'sel', 'abil', 'const', 'place'].includes(UI.mode)) return;
  closeMenus(); stopHint(); removePlot(); clearMarks(); setTray(); $$('.notch').forEach(n => { n.classList.remove('lit'); n.tabIndex = -1; });
  const prev = UI.sel; UI.sel = u; UI.mode = 'sel';
  if (prev && prev !== u && cards[prev.uid]) { UI.pv = null; paint(cards[prev.uid].wrap, prev); }
  const w = cards[u.uid].wrap; w.classList.add('sel'); $$('.notch', w).forEach(n => { n.tabIndex = 0; });
  camEl(cards[u.uid].slot); sfx('tick'); selHint(u);
  if (u.rest > 0) { UI.pv = null; paint(w, u); return; }
  const v = {}; STATS.forEach(k => { v[k] = E.proj(u, k); });
  setTimeout(() => {
    if (UI.sel !== u) return;
    UI.pv = { u, v }; UI.previewed = u.uid; paint(w, u);
    STATS.forEach((k, i) => { if (v[k] > u.cur[k]) setTimeout(() => { if (UI.sel === u) notchPop(u, k, '+' + (v[k] - u.cur[k]), 'buf'); }, i * 90); });
    setTimeout(() => { if (UI.sel === u && UI.mode === 'sel') lightNotches(u); }, 560);
  }, 360);
}
function lightNotches(u) {
  const w = cards[u.uid].wrap; if (u.rest > 0) return;
  const lit = { STR: E.canAttack(u).ok, DATA: DEFS[u.key].abilities.some(x => E.abilityState(u, x.id).ok), BRN: E.canTransfer(u).ok || E.canRecover(u).ok, AGI: false };
  STATS.forEach(k => $('.n-' + k.toLowerCase(), w).classList.toggle('lit', !!lit[k]));
}
async function commit(act) {
  if (!UI.resolveTurn) return;
  const r = UI.resolveTurn; UI.resolveTurn = null;
  UI.mode = 'busy'; UI.plotted = UI.plot ? { uid: UI.plot.u.uid } : null; UI.plot = null;
  closeMenus(); stopHint(); setTray(); hintSet('', '');
  $$('.pod, .statpick').forEach(x => x.remove());
  costFx(act);
  await sleep(RM ? 30 : 420);
  clearMarks(); $$('.notch.lit').forEach(n => n.classList.remove('lit'));
  await camReset();
  r(act);
}

/* ---------- board input ---------- */
let suppressClick = false, downCard = null;
document.addEventListener('pointerdown', e => { const w = e.target.closest && e.target.closest('#board .cardwrap:not(.clone)'); downCard = w ? { w, x: e.clientX, y: e.clientY, t: performance.now(), n: e.target.closest('.notch') } : null; }, true);
function onBoardClick(e) {
  if (suppressClick) return;
  if (e.target.closest('.pod, .statpick')) return;
  if (UI.mode === 'abil' && !e.target.closest('.abil')) { /* taps that land on or just beside the ability list never fall through to the agent next door */
    const bx = $('.ablist'); if (bx) { const r = bx.getBoundingClientRect(), m = 10; if (e.clientX >= r.left - m && e.clientX <= r.right + m && e.clientY >= r.top - m && e.clientY <= r.bottom + m) return; }
    if (performance.now() - (UI.abilT || 0) < 650) return;
  }
  let w = e.target.closest('.cardwrap:not(.clone)'), dn = null;
  if (downCard && performance.now() - downCard.t < 900 && Math.hypot(e.clientX - downCard.x, e.clientY - downCard.y) < 16 && !e.target.closest('.rs')) { if (downCard.w !== w) w = downCard.w; dn = downCard.n; }
  if (w && cards[w.dataset.uid]) { let n = (dn && w.contains(dn) ? dn : null) || e.target.closest('.notch') || (hovN && w.contains(hovN) ? hovN : null);
    if (!n && cards[w.dataset.uid].unit === UI.sel && ['sel', 'abil', 'const'].includes(UI.mode)) n = nearestNotch(w, e, 21); /* a tap near a corner counts as that notch, not as an inspect */ return onCardTap(cards[w.dataset.uid].unit, n && n.dataset.k, e); }
  const rs = e.target.closest('.rs'); if (rs) return onRailTap(+rs.dataset.slot);
  onEmptyTap();
}
function onEmptyTap() {
  if (UI.mode === 'sel') goIdle();
  else if (UI.mode === 'plot') return; /* only the Back button leaves the number picker */
  else if (['abil', 'const', 'place', 'ally'].includes(UI.mode)) backToSel();
  else if (UI.mode === 'target' || UI.mode === 'slot') backToSel();
}
function onCardTap(u, k, e) {
  switch (UI.mode) {
    case 'target': if (u.side === 1) return targetPicked(u); break;
    case 'ally': if (u.side === 0 && u.alive && (u !== UI.sel || UI.allySelf)) return allyPicked(u); break;
    case 'idle': case 'sel': case 'abil': case 'const': case 'place':
      if (u.side === 0 && u.alive) { if (u === UI.sel && k) return notchAct(u, k, e); if (u === UI.sel) return showInspect(u); if (UI.sel) { sfx('tick'); return toast('Hit BACK first to pick a different agent.'); } return selectAgent(u); }
      return showInspect(u);
    case 'plot': return;
    default: if (!['boot', 'arrange'].includes(UI.mode)) showInspect(u);
  }
}
function onRailTap(slot) {
  if (UI.mode === 'target') { const u = G.sides[1][slot]; if (u && u.alive) return targetPicked(u); }
  else if (UI.mode === 'place') { const t = G.sides[1][slot]; if (t && t.alive) return placeOnRail(UI.sel, slot, UI.sel.fp ? 'fp' : 'str'); toast('No enemy in that column.'); }
  else if (UI.mode === 'slot') return UI.slotFn(slot);
}
function notchAct(u, k) {
  if (u.rest > 0) return toast(u.name + ' is resting.');
  if (k === 'STR') { const c = E.canAttack(u); if (!c.ok) return toast('Strength: ' + c.reason + '.'); return startPlace(u); }
  if (k === 'DATA') { return UI.mode === 'abil' ? backToSel() : openAbil(u); }
  if (k === 'BRN') { return UI.mode === 'const' ? backToSel() : openConst(u); }
  toast('Agility is for dodging. It lights up when you are attacked.');
}

/* ---------- drag to rail ---------- */
let drag = null;
function slotAtPoint(x, y) {
  let best = null, bd = 1e9;
  railEls.forEach((r, i) => { const b = r.getBoundingClientRect(), m = 10; if (x > b.left - m && x < b.right + m && y > b.top - m && y < b.bottom + m) { const d = Math.hypot(x - (b.left + b.width / 2), y - (b.top + b.height / 2)); if (d < bd) { bd = d; best = i; } } });
  if (best == null) G.sides[1].forEach((u, i) => { if (u.alive) { const b = cards[u.uid].wrap.getBoundingClientRect(); if (x > b.left && x < b.right && y > b.top && y < b.bottom) best = i; } });
  return best;
}
$('#board').addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const w = e.target.closest('.cardwrap:not(.clone)'); if (!w || !cards[w.dataset.uid]) return;
  const u = cards[w.dataset.uid].unit;
  if (!UI.sel || u !== UI.sel || u.side !== 0 || u.rest > 0 || !['sel', 'place', 'abil', 'const'].includes(UI.mode) || !E.canAttack(u).ok) return;
  if (e.target.closest('.notch')) return;
  drag = { u, x0: e.clientX, y0: e.clientY, id: e.pointerId, started: false };
});
window.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  if (!drag.started) { if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 9) return; startDrag(e); }
  const vx = e.clientX - (drag.lx == null ? e.clientX : drag.lx); drag.lx = e.clientX;
  const g = drag.ghost, rz = cl(vx * 0.6, -14, 14); g._t = Date.now();
  g.style.transform = `translate(${e.clientX - drag.w / 2}px,${e.clientY - drag.h / 2}px) rotateZ(${rz}deg) rotateX(14deg) scale(1.12)`;
  const idx = slotAtPoint(e.clientX, e.clientY);
  railEls.forEach((r, i) => r.classList.toggle('hot', i === idx));
});
function startDrag(e) {
  const u = drag.u; drag.started = true; closeMenus(); stopHint(); UI.mode = 'place'; hideTip(); camReset();
  G.sides[1].forEach(t => { if (t.alive) railEls[t.slot].classList.add('pick'); });
  const wrap = cards[u.uid].wrap, r = { width: wrap.offsetWidth, height: wrap.offsetHeight };
  const g = cloneCard(u); g.classList.add('dragghost'); g.style.width = r.width + 'px'; g.style.height = r.height + 'px'; g.style.position = 'fixed'; g.style.inset = 'auto';
  g._t = Date.now(); $('#fxlayer').appendChild(g); drag.ghost = g; drag.w = r.width; drag.h = r.height; wrap.classList.add('away');
  hintSet('Drop it on a lit slot', 'The slot you pick is the enemy column you strike.');
}
function endDrag(e, cancel) {
  const d = drag; drag = null; if (!d || !d.started) return; d.ghost._t = Date.now() + 400;
  suppressClick = true; setTimeout(() => { suppressClick = false; }, 60);
  const idx = cancel ? null : slotAtPoint(e.clientX, e.clientY), u = d.u, t = idx != null ? G.sides[1][idx] : null;
  const back = () => { d.ghost.remove(); cards[u.uid].wrap.classList.remove('away'); railEls.forEach(r => r.classList.remove('hot')); backToSel(); };
  if (t && t.alive) {
    const rb = railEls[idx].getBoundingClientRect();
    d.ghost.animate([{ transform: d.ghost.style.transform }, { transform: `translate(${rb.left}px,${rb.top}px) scale(1)` }], { duration: 160, easing: 'ease-out', fill: 'forwards' });
    setTimeout(() => { d.ghost.remove(); placeOnRail(u, idx, u.fp ? 'fp' : 'str'); }, 165);
  } else {
    if (idx != null) toast('No enemy in that column.');
    const rb = cards[u.uid].wrap.getBoundingClientRect();
    d.ghost.animate([{ transform: d.ghost.style.transform }, { transform: `translate(${rb.left}px,${rb.top}px) scale(1)` }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
    setTimeout(back, 225);
  }
}
window.addEventListener('pointerup', e => { if (drag && (e.pointerId === drag.id || drag.started)) endDrag(e, false); drag = null; });
window.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) endDrag(e, true); drag = null; });
window.addEventListener('blur', () => { if (drag && drag.started) endDrag({}, true); drag = null; });
/* watchdog: never leave a stray drag ghost behind */
setInterval(() => {
  if (drag) return;
  const gs = $$('.dragghost'); if (!gs.length || UI.ending) return;
  if (gs.some(g => g._t && Date.now() - g._t < 600)) return;
  gs.forEach(g => g.remove()); $$('.cardwrap.away').forEach(w => w.classList.remove('away')); railEls.forEach(r => r.classList.remove('hot'));
  if (UI.mode === 'place' && !$('.pod')) { try { backToSel(); } catch (e) {} }
}, 500);

/* ---------- "how to drag" hint animation ---------- */
function stopHint() { UI.hintId++; (UI.hintEls || []).forEach(x => x.remove()); UI.hintEls = []; }
async function hintDrag(u) {
  stopHint(); const my = UI.hintId;
  const foes = E.enemies(0); const t = foes.find(f => f.slot === u.slot) || foes[0]; if (!t) return;
  const h = el('div', 'hand'), lb = el('div', 'handlbl', 'Drag'); document.body.append(h, lb); UI.hintEls = [h, lb];
  for (let i = 0; i < 3; i++) {
    if (UI.hintId !== my || UI.mode !== 'place') break;
    const a = center(cards[u.uid].wrap), b = center(railEls[t.slot]);
    const kf = (p, o, dy) => ({ transform: `translate(${p.x - 22}px,${p.y - 22 + (dy || 0)}px)`, opacity: o });
    const an = h.animate([{ ...kf(a, 0), offset: 0 }, { ...kf(a, 1), offset: .15 }, { ...kf(a, 1), offset: .3 }, { ...kf(b, 1), offset: .75 }, { ...kf(b, 0), offset: 1 }], { duration: 1700, easing: 'ease-in-out', fill: 'forwards' });
    lb.animate([{ ...kf(a, 0, 36), offset: 0 }, { ...kf(a, 1, 36), offset: .15 }, { ...kf(a, 1, 36), offset: .3 }, { ...kf(b, 1, 36), offset: .75 }, { ...kf(b, 0, 36), offset: 1 }], { duration: 1700, easing: 'ease-in-out', fill: 'forwards' });
    await sleep(1900);
    an.cancel();
  }
  if (UI.hintId === my) stopHint();
}
function startPlace(u) {
  closeMenus(); UI.mode = 'place'; camReset();
  E.enemies(0).forEach(t => railEls[t.slot].classList.add('pick'));
  hintSet('Drag to the Action Rail', `Drag ${u.name} onto a lit slot (or tap one). The slot is the enemy column you strike.${u.fp ? ' Finally Perfect: 6 damage, no Strength.' : ''}${u.bd ? ' Beatdown ready: you can pick a second target on the rail.' : ''}`);
  hintDrag(u);
}

/* ---------- plotting an attack on the rail ---------- */
function removePlot() {
  (UI.holds || []).forEach(f => f()); UI.holds = [];
  UI.plot = null; $$('.pod, .onrail').forEach(x => x.remove());
  $$('.cardwrap.away').forEach(w => { if (!UI.flyer) w.classList.remove('away'); });
  railEls.forEach(r => r.classList.remove('hot'));
}
function placeOnRail(u, idx, kind, lender) {
  const t = kind === 'heal' ? null : G.sides[1][idx]; if (kind !== 'heal' && (!t || !t.alive)) return;
  closeMenus(); stopHint(); removePlot(); $$('.cardwrap').forEach(w => w.classList.remove('tgt')); railEls.forEach(r => r.classList.remove('pick'));
  const rs = railEls[idx];
  let mx, X, info;
  if (kind === 'str') { mx = E.attackMax(u, t); if (mx < 1) { toast('Not enough Strength for that slot.'); return backToSel(); } X = Math.min(mx, 3); }
  else if (kind === 'bb') { mx = E.attackMax(u, t, lender); if (mx < 1) { toast(lender.name + ' cannot lend enough Strength for that slot.'); return backToSel(); } X = Math.min(mx, 3); }
  else if (kind === 'proj' || kind === 'vesp') { mx = E.proj(u, 'DATA'); X = Math.min(mx, 3); }
  else if (kind === 'heal') { mx = Math.max(1, Math.min(E.proj(u, 'DATA'), u.maxhp - u.hp)); X = Math.min(mx, 3); }
  else { mx = X = CFG.fpDamage; }
  UI.mode = 'plot'; UI.plot = { u, idx, t, kind, X, t2: null };
  rs.classList.add('hot');
  let xb = el('div', 'xb', X);
  if (kind !== 'heal' && kind !== 'proj' && kind !== 'vesp') { cards[u.uid].wrap.classList.add('away'); const clone = cloneCard(u); clone.classList.add('onrail'); rs.appendChild(clone); $('.card', clone).appendChild(xb); }
  const pod = el('div', 'pod' + (kind === 'proj' || kind === 'vesp' || kind === 'heal' ? ' data' : ''));
  pod.innerHTML = `<div class="ptop"><div class="pinfo"></div></div>
    ${kind === 'fp' ? '' : '<div class="prow"><button type="button" class="pbtn" data-d="-1" aria-label="Less"><i>-</i></button><span class="pnum" aria-live="polite"></span><button type="button" class="pbtn" data-d="1" aria-label="More"><i>+</i></button></div>'}
    <button type="button" class="pgo">${kind === 'proj' || kind === 'vesp' ? 'Fire' : kind === 'heal' ? 'Heal' : 'Strike'}</button>`;
  if (u.bd && kind === 'str') {
    const others = E.enemies(0).filter(f => f !== t);
    if (others.length) {
      const row = el('div', 'p2', '<small>BEATDOWN: also hit</small>');
      others.forEach(f => { const b = el('button', 'p2b', f.name); b.type = 'button'; b.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); const on = UI.plot.t2 === f; UI.plot.t2 = on ? null : f; $$('.p2b', row).forEach(x => x.classList.remove('on')); $$('.cardwrap').forEach(w => w.classList.remove('tgt')); if (!on) { b.classList.add('on'); cards[f.uid].wrap.classList.add('tgt'); } upd(); }); row.appendChild(b); });
      pod.insertBefore(row, $('.pgo', pod));
    }
  }
  rs.appendChild(pod);
  const upd = () => {
    const P = UI.plot; X = P.X; xb.textContent = X;
    const num = $('.pnum', pod); if (num) num.textContent = X;
    $$('.pbtn', pod).forEach(b => { b.disabled = (+b.dataset.d < 0 && X <= 1) || (+b.dataset.d > 0 && X >= mx); });
    if (kind === 'bb') { const c = Math.ceil(X * CFG.attackCostFrac); $('.pinfo', pod).textContent = `-${c} ${lender.name} STR  |  ${lender.cur.STR - c} left`; }
    else if (kind === 'str') { const c = Math.ceil(X * CFG.attackCostFrac); $('.pinfo', pod).textContent = `-${c} STR  |  ${E.proj(u, 'STR') - c}${P.t2 ? ' | 2nd hit free: ' + P.t2.name : ' left'}`; }
    else if (kind === 'proj' || kind === 'vesp') $('.pinfo', pod).textContent = `-${X} DATA  |  ${mx - X} left${kind === 'vesp' ? ' | +1 to the rest' : ''}`;
    else if (kind === 'heal') $('.pinfo', pod).textContent = `-${X} DATA  |  +${X} HP`;
    else $('.pinfo', pod).textContent = '6 DMG  |  no STR';
  };
  pod.addEventListener('click', e => e.stopPropagation());
  $$('.pbtn', pod).forEach(b => {
    let t1 = 0, t2 = 0, held = false;
    const step = () => { const nx = cl(UI.plot.X + +b.dataset.d, 1, mx); if (nx === UI.plot.X) return false; UI.plot.X = nx; sfx('tick'); upd(); return true; };
    const stop = () => { clearTimeout(t1); clearInterval(t2); held = false; b.classList.remove('down'); };
    b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (b.disabled) return; held = true; b.classList.add('down'); step(); t1 = setTimeout(() => { t2 = setInterval(() => { if (!step()) stop(); }, 110); }, 380); });
    ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave'].forEach(n => b.addEventListener(n, stop)); (UI.holds = UI.holds || []).push(stop);
    b.addEventListener('click', e => { e.stopPropagation(); if (e.detail === 0) step(); });
  });
  $('.pgo', pod).addEventListener('click', () => {
    sfx('tick'); const P = UI.plot;
    if (kind === 'bb') commit({ type: 'ability', agent: u, id: 'bb', ally: lender, target: t, X: P.X });
    else if (kind === 'str') commit({ type: 'attack', agent: u, target: t, X: P.X, target2: P.t2 || null });
    else if (kind === 'proj' || kind === 'vesp') commit({ type: 'ability', agent: u, id: kind, target: t, X: P.X });
    else if (kind === 'heal') commit({ type: 'ability', agent: u, id: 'enki', X: P.X });
    else commit({ type: 'attack', agent: u, target: t, X: CFG.fpDamage });
  });
  pod.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { UI.plot.X = cl(UI.plot.X - 1, 1, mx); upd(); } if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { UI.plot.X = cl(UI.plot.X + 1, 1, mx); upd(); } });
  upd(); camEl(rs, { sc: 1.35, rx: 10, cx: 1 }); sfx('whoosh');
  if (kind === 'heal') hintSet('Enki', 'Set how much DATA to turn into HP, then heal. Back cancels.'); else hintSet(`${u.name} → ${t.name}`, kind === 'fp' ? 'Locked at 6, DATA damage. Confirm below.' : `Set the power with + and -, then ${kind === 'proj' || kind === 'vesp' ? 'fire' : 'strike'}. Back cancels.`);
  const go = $('.pgo', pod); if (go && !('ontouchstart' in window)) go.focus({ preventScroll: true });
}

/* ---------- DATA abilities: 3D chips beside the card ---------- */
const AB_ICON = {
  amp: '<path d="M12 3l6 9h-4v9h-4v-9H6z"/>', brim: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" fill="none"/>',
  leer: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none"/><circle cx="12" cy="12" r="3"/>', proj: '<path d="M3 12h14m-5-6l6 6-6 6" fill="none"/>',
  makeup: '<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>', fp: '<path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7.2L12 17.8 5.6 21.5l1.7-7.2L2 9.6 9 9z"/>',
  cap: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>', qm: '<path d="M5 6h14M5 12h14M5 18h14M8 3v18M16 3v18" fill="none"/>',
  tr: '<path d="M4 8h14m-4-4l4 4-4 4M20 16H6m4-4l-4 4 4 4" fill="none"/>',
  dep: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" fill="none"/><path d="M8 12h8" fill="none"/>', bd: '<path d="M5 5l6 7-6 7M13 5l6 7-6 7" fill="none"/>',
  bash: '<path d="M4 20L16 8M13 5l6 6-3 3-6-6z" fill="none"/>', ua: '<path d="M12 2l10 18H2z" fill="none"/><path d="M12 9v5M12 17v.5" fill="none"/>',
  bb: '<circle cx="8" cy="9" r="3.5"/><circle cx="16" cy="9" r="3.5"/><path d="M2 20c1-4 4-6 6-6s5 2 6 6M10 20c1-4 4-6 6-6s5 2 6 6" fill="none"/>', harden: '<rect x="5" y="5" width="14" height="14" rx="2" fill="none"/><path d="M9 12l2 2 4-4" fill="none"/>',
  teacher: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5" fill="none"/>', rarium: '<circle cx="12" cy="12" r="9" fill="none"/><path d="M12 7v5l3 2" fill="none"/>', ook: '<circle cx="12" cy="12" r="2.5"/><path d="M12 3a9 9 0 1 1-9 9" fill="none"/><path d="M12 7a5 5 0 1 1-5 5" fill="none"/>', enki: '<path d="M12 21C5 15 3 11 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 7-9 13z" fill="none"/><path d="M12 9v6M9 12h6" fill="none"/>', lamb: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7" fill="none"/>', panic: '<path d="M3 12h4l2-6 4 12 2-6h6" fill="none"/>', manip: '<path d="M4 8h12m-4-4l4 4-4 4M20 16H8m4-4l-4 4 4 4" fill="none"/>', hm: '<path d="M12 20s-7-5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 10-7 10z" fill="none"/><path d="M5 5l14 14" fill="none"/>',
  atom: '<circle cx="12" cy="12" r="2"/><circle cx="6" cy="7" r="1.6"/><circle cx="18" cy="8" r="1.6"/><circle cx="15" cy="18" r="1.6"/><circle cx="7" cy="17" r="1.6"/>', disch: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>', jump: '<circle cx="12" cy="12" r="9" fill="none"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M8 16c2-2 6-2 8 0" fill="none"/>', lost: '<rect x="4" y="9" width="16" height="6" fill="none"/><path d="M8 9v6M12 9v6M16 9v6" fill="none"/>', stat: '<path d="M12 21v-8M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 13c4 0 6-3 6-7-4 0-6 3-6 7z" fill="none"/>', catnap: '<path d="M5 6h6l-6 6h6M13 14h5l-5 5h5" fill="none"/>', sharp: '<path d="M4 4l5 14M10 3l4 15M16 4l4 12" fill="none"/>', ds: '<path d="M4 6l8 6-8 6M12 6l8 6-8 6" fill="none"/>', vesp: '<path d="M3 12h10m-4-5l5 5-5 5M17 6l4 6-4 6" fill="none"/>',
  dcount: '<path d="M4 12a8 8 0 0114 -5.5M20 12a8 8 0 01-14 5.5" fill="none"/><path d="M18 3v4h-4M6 21v-4h4" fill="none"/>', baton: '<path d="M5 19L19 5" fill="none" stroke-width="3"/><circle cx="19" cy="5" r="2"/>',
  impr: '<circle cx="12" cy="12" r="8" fill="none"/><path d="M8 12h8M12 8v8" fill="none"/>', blend: '<path d="M12 2l3 7-3 13-3-13z"/><path d="M4 8l5 2M20 8l-5 2" fill="none"/>',
  fglob: '<circle cx="12" cy="13" r="6"/><path d="M12 2c2 3 3 4 3 6" fill="none"/>', wing: '<path d="M3 17c4-1 7-4 9-10 2 6 5 9 9 10-4 1-7 0-9-3-2 3-5 4-9 3z" fill="none"/>',
  rookie: '<path d="M12 4l7 6-7 6-7-6z" fill="none"/><path d="M12 16v5" fill="none"/>', coll: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" fill="none"/><path d="M12 8v6M9 11h6" fill="none"/>',
  tact: '<circle cx="12" cy="12" r="3"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" fill="none"/>', succ: '<path d="M4 12h12m-4-5l5 5-5 5M20 5v14" fill="none"/>'
};
const svgIcon = id => `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${AB_ICON[id]}</svg>`;
function closeAbil() { $$('.ablist').forEach(x => x.remove()); $$('.slot.top').forEach(x => x.classList.remove('top')); $('#board').classList.remove('deep'); UI.armed = null; }
function openAbil(u) {
  closeMenus(); UI.mode = 'abil'; UI.armed = null;
  const d = DEFS[u.key], slot = cards[u.uid].slot;
  slot.classList.add('top'); $('#board').classList.add('deep'); UI.abilT = performance.now();
  const sr = slot.getBoundingClientRect(), side = (sr.left + sr.width / 2) < window.innerWidth / 2 ? 'r' : 'l';
  const box = el('div', 'ablist ' + side); box.setAttribute('role', 'menu');
  d.abilities.forEach((ab0, i) => {
    const ab = E.abilityView(u, ab0), st = E.abilityState(u, ab.id), needs = ab.target === 'none' && ab.id !== 'enki';
    const cost = ab.cost === 'X' ? 'X DATA' : (ab.id === 'fp' ? 'ALL DATA' : ab.cost === 0 ? 'FREE' : ab.cost + ' DATA');
    const b = el('button', 'abil', `<span class="ai">${svgIcon(ab.id)}</span><span class="t2"><b>${ab.name}</b><span class="cost">${cost}</span></span><small>${st.ok ? (ab.short || ab.text) : st.reason + '.'}</small><em class="arm">TAP AGAIN TO USE</em>`);
    b.style.setProperty('--i', i); b.type = 'button'; b.disabled = !st.ok; b.setAttribute('role', 'menuitem');
    b.addEventListener('click', e => {
      e.stopPropagation(); sfx('tick');
      if (needs) {
        if (UI.armed === ab.id) return commit({ type: 'ability', agent: u, id: ab.id });
        UI.armed = ab.id; $$('.abil', box).forEach(x => x.classList.remove('armed')); b.classList.add('armed'); return;
      }
      useAbility(u, ab);
    });
    box.appendChild(b);
  });
  box.addEventListener('click', e => e.stopPropagation()); box.addEventListener('pointerdown', e => e.stopPropagation());
  slot.appendChild(box);
  camEl(slot, { panX: side === 'r' ? 0.26 : 0.74, sc: 1.3, free: true, rx: 9, cy: 0.42 });
  hintSet('DATA', 'Pick an ability, or hit Back.');
}
function useAbility(u, ab) {
  $$('.abil').forEach(b => b.classList.add('out'));
  setTimeout(() => {
    closeAbil();
    if (ab.id === 'cap') {
      UI.mode = 'slot'; camReset(); railEls.forEach(r => r.classList.add('pick'));
      UI.slotFn = s => commit({ type: 'ability', agent: u, id: 'cap', slot: s });
      return hintSet('Capacitor', 'Tap a rail slot to charge. ' + ab.text);
    }
    if (ab.id === 'atom') {
      UI.mode = 'slot'; camReset(); railEls.forEach((r, i) => { if (!G.atom[0][i]) r.classList.add('pick'); });
      UI.slotFn = s => { if (G.atom[0][s]) return toast('That slot is already coated.'); commit({ type: 'ability', agent: u, id: 'atom', slot: s }); };
      return hintSet('Atomise', 'Tap a rail slot to coat in secret. The enemy will not see it. The first agent that attacks through it is coated.');
    }
    if (ab.id === 'bb') return flowBloodbrother(u);
    if (ab.id === 'enki') return placeOnRail(u, u.slot, 'heal');
    if (ab.target === 'ally') {
      UI.mode = 'ally'; UI.allySelf = ab.id === 'fglob'; camReset(); const okA = E.abilityTargets(u, ab.id);
      okA.forEach(x => cards[x.uid].wrap.classList.add('tgt'));
      UI.allyFn = ally => { if (!okA.includes(ally)) return toast(ally.name + ' cannot be picked.'); UI.allyFn = null; commit({ type: 'ability', agent: u, id: ab.id, target: ally }); };
      return hintSet(ab.name, 'Tap a teammate. ' + ab.text);
    }
    UI.mode = 'target'; camReset();
    const okT = E.abilityTargets(u, ab.id);
    okT.forEach(t => { cards[t.uid].wrap.classList.add('tgt'); railEls[t.slot].classList.add('pick'); });
    UI.targetFn = t => { if (!okT.includes(t)) return toast(t.name + ' cannot be targeted.'); if (ab.id === 'proj' || ab.id === 'vesp') placeOnRail(u, t.slot, ab.id === 'vesp' ? 'vesp' : 'proj'); else commit({ type: 'ability', agent: u, id: ab.id, target: t }); };
    hintSet(ab.name, 'Tap an enemy (or its rail slot) to target. ' + ab.text);
  }, 280);
}
function targetPicked(t) { if (UI.targetFn) UI.targetFn(t); }

/* ---------- Brains constellation (click to open, sits on the card) ---------- */
function closeConst() { const c = $('.const'); if (c) c.remove(); $$('.slot.top').forEach(x => x.classList.remove('top')); $('#board').classList.remove('deep'); hideTip(); }
function openConst(u) {
  if (!['sel', 'abil', 'const'].includes(UI.mode)) return;
  closeMenus(); UI.mode = 'const'; UI.tipFor = null;
  const slot = cards[u.uid].slot; slot.classList.add('top'); $('#board').classList.add('deep');
  const tr = E.canTransfer(u), rc = E.canRecover(u);
  const nodes = [
    { id: 'tr', x: 50, y: 15, z: 36, t: 'Transfer', d: 'Costs 1 Brains and your turn. A teammate gains +' + E.transferAmt(u) + ' in a stat of your choice (1 + a quarter of your Brains). You lose 1 of it, then rest 1 turn.', ok: tr.ok, why: tr.reason, svg: true },
    { id: 'STR', x: 14, y: 48, z: -14, stat: 'STR' }, { id: 'AGI', x: 40, y: 78, z: 22, stat: 'AGI' },
    { id: 'BRN', x: 78, y: 42, z: -28, stat: 'BRN' }, { id: 'DATA', x: 88, y: 82, z: 12, stat: 'DATA' }
  ];
  const lines = [[0, 1], [0, 3], [1, 2], [2, 3], [2, 4], [3, 4]];
  nodes.forEach(n => { if (n.stat) { const p = E.proj(u, n.stat); n.t = 'Recover ' + SHORT[n.stat]; const nr = u.noRegen && u.noRegen[n.stat]; n.ok = rc.ok && p < u.max[n.stat] && !nr; n.why = nr ? 'cannot recover on its own' : (p >= u.max[n.stat] ? 'already full' : rc.reason); n.d = `Spend your action to restore +1 ${SHORT[n.stat]} (${p} to ${p + 1}).`; } });
  const box = el('div', 'const'); box.setAttribute('role', 'menu');
  const drift = el('div', 'drift'), scene = el('div', 'scene'); drift.appendChild(scene); box.appendChild(drift);
  scene.appendChild(el('div', 'bgglow'));
  for (let i = 0; i < 22; i++) { const d = el('i', 'dust'); d.style.left = rnd(0, 100) + '%'; d.style.top = rnd(0, 100) + '%'; d.style.transform = `translateZ(${rnd(-60, 40).toFixed(0)}px)`; d.style.animationDelay = rnd(0, 3) + 's'; scene.appendChild(d); }
  scene.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.map(l => `<line x1="${nodes[l[0]].x}" y1="${nodes[l[0]].y}" x2="${nodes[l[1]].x}" y2="${nodes[l[1]].y}"/>`).join('')}</svg>`);
  nodes.forEach((n, i) => {
    const s = el('button', 'star' + (n.ok ? '' : ' off')); s.type = 'button';
    s.style.left = n.x + '%'; s.style.top = n.y + '%'; s.style.setProperty('--z', n.z + 'px'); s.style.setProperty('--d', (i * 0.4) + 's');
    s.setAttribute('aria-label', n.t + (n.ok ? '' : ' (unavailable: ' + n.why + ')'));
    s.innerHTML = n.svg ? svgIcon('tr') : `<img src="${ICO[n.stat]}" alt=""><i class="plus">+</i>`;
    const tip = extra => showTip(n.t, n.d + (n.ok ? (extra || '') : ' Unavailable: ' + n.why + '.'), s);
    s.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { box.dataset.freeze = 1; tip(); } }); s.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { setTimeout(() => { if (!box.querySelector('.star:hover')) delete box.dataset.freeze; }, 120); hideTip(); } });
    s.addEventListener('focus', () => tip()); s.addEventListener('blur', hideTip);
    s.addEventListener('click', e => {
      e.stopPropagation();
      const touch = e.pointerType === 'touch' || e.pointerType === 'pen';
      if (!n.ok) { tip(); return toast(n.t + ': ' + n.why + '.'); }
      if (touch && UI.tipFor !== n.id) { UI.tipFor = n.id; $$('.star', box).forEach(x => x.classList.remove('on')); s.classList.add('on'); tip(' Tap again to use.'); return; }
      sfx('tick'); hideTip(); closeConst();
      if (n.id === 'tr') return flowTransfer(u);
      commit({ type: 'recover', agent: u, stat: n.stat });
    });
    scene.appendChild(s);
  });
  box.addEventListener('pointermove', e => { if (box.dataset.freeze) return; const r = box.getBoundingClientRect(); box.style.setProperty('--cry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg'); box.style.setProperty('--crx', -((e.clientY - r.top) / r.height - 0.5) * 9 + 'deg'); });
  box.addEventListener('click', e => e.stopPropagation());
  slot.appendChild(box); camEl(slot, { sc: 1.35, cx: 1, free: true, rx: 9, cy: 0.5 });
  hintSet('Mind', 'Tap a star. Each is an action you can take with Brains. Tap empty space to go back.');
}
function closeMenus() { closeAbil(); closeConst(); hideTip(); }

/* ---------- Bloodbrother: pick an ally, then plot the attack ---------- */
function flowBloodbrother(u) {
  UI.mode = 'ally'; camReset();
  E.alive(0).filter(x => x !== u && x.cur.STR >= 1).forEach(x => cards[x.uid].wrap.classList.add('tgt'));
  UI.allyFn = ally => {
    if (ally.cur.STR < 1) return toast(ally.name + ' has no Strength to lend.');
    UI.allyFn = null; $$('.cardwrap').forEach(w => w.classList.remove('tgt')); UI.mode = 'target'; camReset();
    E.enemies(0).forEach(t => { cards[t.uid].wrap.classList.add('tgt'); railEls[t.slot].classList.add('pick'); });
    UI.targetFn = t => placeOnRail(u, t.slot, 'bb', ally);
    hintSet('Bloodbrother: ' + ally.name, `Borrowing ${ally.cur.STR} Strength. Tap an enemy (or its rail slot) to attack. Their pool is spent.`);
  };
  hintSet('Bloodbrother', 'Tap a teammate to borrow their Strength for this attack. Tap empty space to go back.');
}

/* ---------- Transfer ---------- */
function flowTransfer(a) {
  UI.mode = 'ally'; camReset();
  E.alive(0).filter(u => u !== a).forEach(u => cards[u.uid].wrap.classList.add('tgt'));
  hintSet('Transfer', 'Tap a teammate to give +' + E.transferAmt(a) + '. Costs 1 Brains and your turn, and you rest 1 turn after. Back returns.');
}
function allyPicked(ally) {
  if (UI.allyFn) return UI.allyFn(ally);
  const a = UI.sel; $$('.statpick').forEach(x => x.remove());
  $$('.cardwrap').forEach(w => w.classList.remove('tgt')); cards[ally.uid].wrap.classList.add('tgt');
  const slot = cards[ally.uid].slot, p = el('div', 'statpick');
  STATS.forEach(k => {
    const ok = E.transferStatOk(a, k) && ally.cur[k] < ally.max[k] + CFG.buffCap;
    const b = el('button', 'sp', `<img src="${ICO[k]}" alt="${SHORT[k]}"><small>${ally.cur[k]}</small>${ok ? '<em class="gain">+' + Math.min(E.transferAmt(a), ally.max[k] + CFG.buffCap - ally.cur[k]) + '</em>' : ''}`); b.type = 'button'; b.disabled = !ok; b.setAttribute('aria-label', `Give ${SHORT[k]}`);
    b.addEventListener('click', e => { e.stopPropagation(); commit({ type: 'transfer', agent: a, to: ally, stat: k }); }); p.appendChild(b);
  });
  p.addEventListener('click', e => e.stopPropagation()); slot.appendChild(p);
  hintSet('Give which stat to ' + ally.name + '?', `${a.name} loses 1 of the same stat. Greyed stats can't be given. Tap another teammate to switch.`);
}

/* =========================================================
   Defending (tray)
   ========================================================= */
function incHead(a, t, X, kind, text) { return el('div', 'inc' + (kind === 'data' ? ' data' : ''), `<span class="big">${X}</span><div><b>${a.name} &rarr; ${t.name}</b><small>${text}</small></div>`); }
function drow(icon, label) { const r = el('div', 'dr', icon ? `<img src="${icon}" alt="">` : ''); const t = el('div', 't', label); r.appendChild(t); return { r, t }; }
function askDefense(ctx) {
  return new Promise(res => {
    UI.mode = 'defend'; closeMenus(); hintSet('');
    const { attacker: a, target: t, X, kind } = ctx;
    const done = d => { setTray(); UI.mode = 'busy'; clearMarks(); res(d); };
    cards[t.uid].wrap.classList.add('tgt'); ctx.protectors.forEach(p => cards[p.uid].wrap.classList.add('guard'));
    const head = incHead(a, t, X, kind, (kind === 'data' ? 'DATA attack. Dodge it exactly, or have a neighbour take it.' : 'Strength attack. Match to negate, go over to counter.') + (ctx.exposed ? ` ${t.name} is resting: no block, no dodge.` : ''));
    const opts = el('div', 'dopts');
    if (ctx.canBlock) {
      let s = Math.min(X, t.cur.STR); const { r, t: lab } = drow(ICO.STR, '');
      const upd = () => { lab.innerHTML = s === 0 ? `Spend 0. Take all <b>${X}</b>.` : s < X ? `Spend <b>${s}</b> STR. Take <b>${X - s}</b>.` : s === X ? `Spend <b>${X}</b> STR. Matched${CFG.clash ? ' (they may raise)' : ''}.` : `Spend <b>${s}</b> STR. <b>Counter ${s - X}</b>.`; };
      r.append(miniStep(0, t.cur.STR, s, v => { s = v; upd(); }), btn('Block', 'primary', () => done({ type: 'block', s }))); upd(); opts.appendChild(r);
    }
    if (!ctx.exposed) { const { r, t: lab } = drow(ICO.AGI, `Dodge: spend exactly <b>${X}</b> AGI (you have ${t.cur.AGI}).`); r.appendChild(btn('Dodge', 'primary', () => done({ type: 'dodge' }), '', !ctx.canDodge)); opts.appendChild(r); }
    ctx.protectors.forEach(p => {
      const lab = p.makeup ? `<b>${p.name}</b> steps in with Makeup. Negates everything. Rests 2.` : kind === 'str' ? '' : `<b>${p.name}</b> takes all <b>${X}</b> instead. Rests ${p.restN}.`;
      const { r, t: lt } = drow('icons/' + p.key + '.png', lab); r.firstChild.style.borderRadius = '4px'; r.firstChild.style.objectFit = 'contain';
      if (p.makeup || kind !== 'str') r.appendChild(btn('Cover', 'primary', () => done({ type: 'interrupt', by: p, s: 0 }), '1 BRN'));
      else {
        let s = Math.min(X, p.cur.STR); const upd = () => { lt.innerHTML = `<b>${p.name}</b> spends ${s} STR. ${t.name} takes <b>${X - s}</b>. ${p.name} rests ${p.restN}.`; };
        r.append(miniStep(0, Math.min(X, p.cur.STR), s, v => { s = v; upd(); }), btn('Cover', 'primary', () => done({ type: 'interrupt', by: p, s }), '1 BRN')); upd();
      }
      opts.appendChild(r);
    });
    setTray(head, opts, btn('Take it (' + X + ')', 'ghost', () => done({ type: 'take' })));
  });
}
function askCounter(c) {
  return new Promise(res => {
    UI.mode = 'defend'; hintSet(''); const done = v => { setTray(); UI.mode = 'busy'; res(v); };
    const r = el('div', 'btnrow'); r.append(btn('Dodge', 'primary', () => done(true), `spend ${c.counter} AGI`), btn('Take it', 'ghost', () => done(false), c.counter + ' damage'));
    setTray(incHead(c.target, c.attacker, c.counter, 'str', `${c.target.name} counters ${c.attacker.name}. Counters can be dodged, never countered back.`), r);
  });
}
function askClashAtk(c) {
  return new Promise(res => {
    UI.mode = 'defend'; hintSet(''); const done = v => { setTray(); UI.mode = 'busy'; res(v); };
    const r = el('div', 'btnrow'); r.append(btn('Raise to ' + (c.X + 1), 'primary', () => done(true), `-${c.extra} STR (you have ${c.attacker.cur.STR})`), btn('Hold', 'ghost', () => done(false), 'attack is negated'));
    setTray(incHead(c.attacker, c.target, c.X, 'str', `Matched! ${c.target.name} spent ${c.spent}. Raise the stakes by 1, or hold. Both of you keep what you've spent.`), r);
  });
}
function askClashDef(c) {
  return new Promise(res => {
    UI.mode = 'defend'; hintSet(''); const done = v => { setTray(); UI.mode = 'busy'; res(v); };
    const { attacker: a, target: t, X, spent } = c; let add = Math.min(c.maxAdd, X - spent);
    const { r, t: lab } = drow(ICO.STR, '');
    const upd = () => { const tot = spent + add; lab.innerHTML = tot === X ? `Total <b>${tot}</b>. Matched again.` : tot < X ? `Total <b>${tot}</b>. Take <b>${X - tot}</b>.` : `Total <b>${tot}</b>. <b>Counter ${tot - X}</b>.`; };
    r.append(miniStep(0, c.maxAdd, add, v => { add = v; upd(); }), btn('Add', 'primary', () => done({ type: 'add', s: add }))); upd();
    const opts = el('div', 'dopts'); opts.appendChild(r);
    if (c.canDodge) { const d = drow(ICO.AGI, `Dodge: spend <b>${X}</b> AGI. Your spent Strength stays spent.`); d.r.appendChild(btn('Dodge', 'primary', () => done({ type: 'dodge' }))); opts.appendChild(d.r); }
    setTray(incHead(a, t, X, 'str', `${a.name} raises to ${X}. You've spent ${spent} so far. Add Strength to keep up, or let it through.`), opts, btn('Let it through', 'ghost', () => done({ type: 'add', s: 0 })));
  });
}
function askBrim(opts, a) {
  return new Promise(res => {
    UI.mode = 'defend'; hintSet(''); const pick = new Set(); const list = el('div', 'dopts');
    opts.forEach(o => {
      if (!o.unit.alive) return;
      const { r, t } = drow('icons/' + o.unit.key + '.png', `<b>${o.unit.name}</b> (${o.unit.cur.DATA} DATA)`); r.firstChild.style.borderRadius = '4px'; r.firstChild.style.objectFit = 'contain';
      const b = btn('', 'ghost', () => {}, '', !o.canTank);
      const setB = () => { const on = pick.has(o.unit); b.className = 'btn ' + (on ? 'primary' : 'ghost'); b.innerHTML = on ? 'Tank -2 DATA' : 'Take 2'; };
      if (o.canTank) { pick.add(o.unit); b.onclick = () => { sfx('tick'); pick.has(o.unit) ? pick.delete(o.unit) : pick.add(o.unit); setB(); }; setB(); } else b.innerHTML = 'Take 2<small>can\'t tank</small>';
      r.appendChild(b); list.appendChild(r);
    });
    setTray(incHead(a, a, CFG.brimDamage, 'data', `${a.name} releases Brim. Each of your agents takes 2, or tanks it with 2 DATA.`), list, btn('Confirm', 'primary', () => { setTray(); UI.mode = 'busy'; res(Array.from(pick)); }));
  });
}

/* =========================================================
   Battle effects (called by the engine)
   ========================================================= */
const tf = o => `translate(${o.x}px,${o.y}px) rotateX(${o.rx || 0}deg) rotateZ(${o.rz || 0}deg) scale(${o.s || 1})`;
function makeFlyer(u, kind, at, size) {
  const f = cards[u.uid].wrap.cloneNode(true);
  f.classList.remove('sel', 'tgt', 'away', 'guard', 'dead'); f.classList.add('flyer', 'clone'); if (kind === 'data') f.classList.add('data'); f.removeAttribute('tabindex'); delete f.dataset.uid;
  f.style.width = size.w + 'px'; f.style.height = size.h + 'px'; $$('.notch', f).forEach(n => { n.tabIndex = -1; n.classList.remove('lit', 'pop'); });
  const fl = { el: f, w: size.w, h: size.h, cur: { x: at.x, y: at.y, s: 1 }, u };
  f.style.transform = tf(fl.cur); $('#fxlayer').appendChild(f); return fl;
}
async function flyArc(fl, to, ms, lift = 0.5) {
  const from = fl.cur;
  const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - fl.h * lift, s: Math.max(from.s || 1, to.s || 1) * 1.2, rx: -20, rz: (to.x - from.x) > 0 ? 5 : -5 };
  const an = fl.el.animate([{ transform: tf(from), easing: 'cubic-bezier(.2,.8,.3,1)' }, { transform: tf(mid), offset: 0.5, easing: 'cubic-bezier(.7,0,1,.5)' }, { transform: tf(to) }], { duration: ms, fill: 'forwards' });
  await sleep(ms + 12); fl.cur = to; fl.el.style.transform = tf(to); an.cancel();
}
async function squash(fl) {
  const c = fl.cur; const an = fl.el.animate([{ transform: tf(c) }, { transform: tf(c) + ' scale(1.14,.82)', offset: 0.4 }, { transform: tf(c) }], { duration: 230, easing: 'ease-out' });
  await sleep(230); an.cancel();
}
function pump(fl) { const c = fl.cur; fl.el.animate([{ transform: tf(c) }, { transform: tf({ ...c, s: 1.2, rx: -8 }), offset: 0.35 }, { transform: tf(c) }], { duration: 300, easing: 'cubic-bezier(.2,1.6,.4,1)' }); }
function retreat() {
  const fl = UI.flyer; UI.flyer = null; if (!fl) return;
  UI.retreating = (async () => {
    await sleep(260);
    await flyArc(fl, { x: fl.rail.x, y: fl.rail.y, s: 1 }, 300, 0.35);
    $$('.rs.hot').forEach(r => r.classList.remove('hot'));
    await sleep(40);
    await flyArc(fl, { x: fl.home.x, y: fl.home.y, s: 1 }, 340, 0.3);
    fl.el.remove(); const c = cards[fl.u.uid]; if (c) { c.wrap.classList.remove('away'); paint(c.wrap, fl.u); }
    UI.retreating = null;
  })();
}
function ghostSlide(w, dir) { w.animate([{ translate: '0 0' }, { translate: `${dir * 22}% 0`, offset: 0.4 }, { translate: '0 0' }], { duration: 440, easing: 'ease-out' }); }


/* ---- signature effects ---- */
function magnetFX(c, power) {
  const P = center(c.wrap), s = S();
  glow(P.x, P.y, P.w * 1.1, 0.4, '255,90,30');
  for (let i = 0; i < 3 + power; i++) field(P.x, P.y, P.w * 0.62, P.h * 0.55, i * 0.13, 0.95, i % 2 ? '255,70,30' : '255,160,70');
  twinkles(P.x, P.y, 12 + power * 6, P.w * 0.55, COL_FIELD, { speed: 1.6, life: 1.2, size: 1.1 });
  shockLines(P.x, P.y, 12, P.w * 0.5, 18 * s, 300 * s, '#ff9a4a');
  if (power > 1) { flash(0.18, 260, '255,90,30'); shake(3, 0.2); }
}
function ampFX(c, unstable) {
  const P = center(c.wrap), s = S();
  flash(unstable ? 0.5 : 0.38, 360, '255,120,40'); glow(P.x, P.y, P.w * 1.5, 0.5, '255,60,30'); glow(P.x, P.y, P.w * 0.9, 0.3, '255,200,80');
  ring(P.x, P.y, P.w * 0.9, 0, '255,90,31', 5, 0.5); ring(P.x, P.y, P.w * 1.4, 0.08, '212,32,43', 3, 0.6); lens(P.x, P.y, P.w * 0.95, 0, 0.55, '255,60,30');
  for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU + rnd(-0.3, 0.3), r1 = P.w * 0.3, r2 = P.w * rnd(0.7, 1.05); arc(P.x + Math.cos(a) * r1, P.y + Math.sin(a) * r1, P.x + Math.cos(a) * r2, P.y + Math.sin(a) * r2, rnd(0.28, 0.5), 8 * s, 8, 'cit'); }
  sparks(P.x, P.y, 34, 360 * s, COL_CIT, { g: -120, life: 1.1 }); twinkles(P.x, P.y, 8, P.w * 0.5, COL_CIT, { rise: true });
  shockLines(P.x, P.y, 18, P.w * 0.45, 26 * s, 560 * s, '#ffd23f'); shake(unstable ? 6 : 4, 0.25);
}
function hardenFX(c, hit) {
  const P = center(c.wrap), s = S();
  ring(P.x, P.y, P.w * 0.85, 0, '255,255,255', 5, 0.45); ring(P.x, P.y, P.w * 1.15, 0.08, '200,200,230', 3, 0.5); lens(P.x, P.y, P.w * 0.9, 0, 0.5, '190,190,255');
  shockLines(P.x, P.y, 14, P.w * 0.4, 20 * s, 380 * s, '#dfe3ff'); sparks(P.x, P.y, 20, 220 * s, COL_HIT, { g: 60 }); if (hit) shake(5, 0.2);
}
// persistent auras: gentle zaps and twinkles for cards that carry a state
function auraTick() {
  if (document.hidden || RM) return;
  $$('.cardwrap.au-red:not(.clone):not(.dead)').slice(0, 3).forEach(w => {
    const r = w.getBoundingClientRect(); if (!r.width) return;
    for (let i = 0; i < 2; i++) { const x = r.left + r.width * rnd(0.05, 0.95), y = r.top + r.height * rnd(0.05, 0.95), a = rnd(0, TAU), L = rnd(0.2, 0.45) * r.width; arc(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L, 0.16, 5, 5, 'cit'); }
    sparks(r.left + r.width * rnd(0.1, 0.9), r.top + r.height * rnd(0.3, 1), 2, 90 * S(), COL_CIT, { g: -60, life: 0.9 });
  });
  $$('.cardwrap.au-dep:not(.clone):not(.dead)').slice(0, 2).forEach(w => {
    const r = w.getBoundingClientRect(); if (!r.width) return; const cxp = r.left + r.width / 2, cyp = r.top + r.height / 2;
    if (Math.random() < 0.5) field(cxp, cyp, r.width * 0.6, r.height * 0.55, 0, 0.9, '255,110,40');
    for (let i = 0; i < 2; i++) { const side = Math.random() < 0.5 ? -1 : 1; twinkles(cxp + side * r.width * rnd(0.45, 0.7), cyp + rnd(-0.4, 0.4) * r.height, 1, 6, COL_FIELD, { speed: 1.3, life: 1.1, size: 1.1 }); }
  });
}
setInterval(auraTick, 420);

/* ranged DATA shot: shooter stays put, a red projectile flies to the target */
async function shoot(a, t, X, res, by) {
  const cover = by && ['intercept', 'intercept-part', 'body', 'negate'].includes(res);
  const src = cards[a.uid], tgt = cards[(cover ? by : t).uid], ct = cards[t.uid]; if (!src || !tgt) return;
  const A = center(src.wrap), T = center(tgt.wrap), dodge = res === 'dodge', dir = Math.random() < 0.5 ? -1 : 1;
  const ex = dodge ? T.x + dir * T.w * 0.95 : T.x, ey = dodge ? T.y - T.h * 0.1 : T.y;
  if (dodge) { ghostSlide(ct.wrap, dir); sfx('whoosh'); } else sfx('whoosh');
  const dur = RM ? 80 : cl(Math.hypot(ex - A.x, ey - A.y) * 0.55, 220, 420), t0 = performance.now(); let px = A.x, py = A.y;
  await new Promise(done => {
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = k * k * (3 - 2 * k) * 0.35 + k * 0.65, x = A.x + (ex - A.x) * e, y = A.y + (ey - A.y) * e;
      streak(px, py, x, y, '255,90,31'); glow(x, y, 20 * S(), 0.16, '255,70,30'); glow(x, y, 8 * S(), 0.1, '255,230,200');
      sparks(x, y, 2, 70 * S(), COL_DATA, { g: 0, life: 0.7, size: 0.8 }); px = x; py = y;
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  if (dodge) { ufloat(t, 'DODGED', 'blk'); sparks(ex, ey, 8, 120 * S(), COL_DATA); await sleep(200); return; }
  /* little sparky impact */
  sparks(T.x, T.y, 18, 230 * S(), COL_DATA, { g: 140 }); sparks(T.x, T.y, 8, 160 * S(), ['#ffffff', '#ffd0a0'], { g: 60, life: 0.6 });
  ring(T.x, T.y, 34 * S(), 0, '255,90,31', 3, 0.3); glow(T.x, T.y, 40 * S(), 0.25, '255,90,31'); shake(1.5, 0.1);
  if (['block', 'negate', 'intercept', 'body'].includes(res)) {
    shieldFX(T.x, T.y); sfx('block'); ufloat(cover ? by : t, res === 'body' ? 'BODY-BLOCK' : res === 'negate' ? 'NEGATED' : res === 'intercept' ? 'COVERED' : 'BLOCKED', 'blk'); await sleep(240);
  } else if (res === 'partial' || res === 'intercept-part') { shieldFX(T.x, T.y); sfx('block'); await sleep(110); }
  else await sleep(40);
}
const FX = {
  async pick(a) {
    const c = cards[a.uid], before = snap[a.uid] || a.cur;
    const diffs = STATS.filter(k => a.cur[k] > before[k]).map(k => [k, a.cur[k] - before[k]]);
    const mine = a.side === 0 && UI.previewed === a.uid; UI.previewed = null; UI.pv = null;
    updateAll(); if (!c || mine) return;
    camEl(c.slot); sfx('tick'); { const P = center(c.wrap); ring(P.x, P.y, P.w * 0.8, 0, '255,255,255', 2, 0.4); twinkles(P.x, P.y, 6, P.w * 0.45, COL_HIT, { rise: true }); }
    await sleep(RM ? 30 : 460);
    diffs.forEach(([k, n], i) => setTimeout(() => notchPop(a, k, '+' + n, 'buf'), i * 90));
    await sleep(diffs.length ? 480 : 120);
  },
  async declare(a, t, X, kind, ranged) {
    if (UI.retreating) await UI.retreating;
    await camReset();
    UI.ranged = ranged ? a.uid : null;
    if (ranged) {
      UI.plotted = null; $$('.onrail').forEach(x => x.remove()); $$('.pod').forEach(p => p.remove()); railEls.forEach(r => r.classList.remove('hot'));
      const c = cards[a.uid]; if (!c) return; const H0 = center(c.wrap);
      c.wrap.classList.remove('away'); sfx('data');
      converge(H0.x, H0.y, 14, 70 * S(), COL_DATA, 0.28); glow(H0.x, H0.y, 46 * S(), 0.4, '255,70,30'); lens(H0.x, H0.y, H0.w * 0.55, 0, 0.45, '255,70,30');
      c.wrap.animate([{ translate: '0 0' }, { translate: '0 3%', offset: .4 }, { translate: '0 0' }], { duration: 300, easing: 'ease-out' });
      await sleep(RM ? 60 : 280); return;
    }
    const c = cards[a.uid], rs = railEls[t.slot], home = c.wrap.getBoundingClientRect(), rail = rs.getBoundingClientRect();
    const plotted = UI.plotted && UI.plotted.uid === a.uid; UI.plotted = null;
    $$('.onrail').forEach(x => x.remove());
    const size = { w: home.width, h: home.height };
    const fl = makeFlyer(a, kind, plotted ? { x: rail.left, y: rail.top } : { x: home.left, y: home.top }, size);
    fl.home = { x: home.left, y: home.top }; fl.rail = { x: rail.left, y: rail.top }; UI.flyer = fl;
    $$('.xb', fl.el).forEach(x => x.remove()); const xb = el('div', 'xb', X); $('.card', fl.el).appendChild(xb); fl.xb = xb;
    c.wrap.classList.add('away'); rs.classList.add('hot'); $$('.pod', rs).forEach(p => p.remove());
    if (!plotted) { sfx('whoosh'); await flyArc(fl, { x: rail.left, y: rail.top, s: 1 }, 400, 0.45); }
    if (kind === 'data') { const P = center(rs), H0 = center(c.wrap); for (let i = 0; i < 4; i++) arc(H0.x, H0.y, P.x + rnd(-8, 8), P.y + rnd(-8, 8), 0.34, 16 * S(), 12); streak(H0.x, H0.y, P.x, P.y, '255,90,31'); dataFX(P.x, P.y, 1); lens(P.x, P.y, P.w * 0.7, 0, 0.5, '255,70,30'); sfx('data'); }
    await sleep(plotted ? 120 : 160);
  },
  async clash(who, other, X, mode) {
    const fl = UI.flyer;
    if (mode === 'raise') {
      if (fl) { fl.xb.textContent = X; pump(fl); const P = { x: fl.cur.x + fl.w / 2, y: fl.cur.y + fl.h / 2 }; ring(P.x, P.y, 50 * S(), 0, '255,255,255', 3, 0.35); sparks(P.x, P.y, 16, 220 * S(), COL_HIT); floatAt(P.x, P.y - fl.h * 0.55, 'RAISE ' + X, 'dmg', Math.max(16, fl.w * 0.24)); }
      sfx('hit', 1); shake(2, 0.12); await sleep(RM ? 40 : 340);
    } else {
      const c = cards[who.uid]; if (c) { const P = center(c.wrap); c.wrap.animate([{ translate: '0 0' }, { translate: '0 5%', offset: .35 }, { translate: '0 0' }], { duration: 280, easing: 'ease-out' }); shieldFX(P.x, P.y); floatAt(P.x, P.y - P.h * .1, 'MATCH', 'blk', Math.max(14, P.w * 0.2)); }
      sfx('block'); await sleep(RM ? 40 : 300);
    }
  },
  async strike(a, t, X, kind, res, by) {
    if (UI.ranged === a.uid && !UI.flyer) return shoot(a, t, X, res, by);
    const fl = UI.flyer; if (!fl) return;
    const cover = by && ['intercept', 'intercept-part', 'body', 'negate'].includes(res);
    const tgt = cards[(cover ? by : t).uid], T = center(tgt.wrap), ct = cards[t.uid];
    const land = { x: T.l, y: T.t, s: 0.94, rz: 0 };
    if (res === 'dodge') {
      const dir = Math.random() < 0.5 ? -1 : 1; ghostSlide(ct.wrap, dir); sfx('whoosh');
      await flyArc(fl, { x: T.l + dir * T.w * 0.55, y: T.t + T.h * 0.12, s: 0.9, rz: dir * 8 }, 340, 0.5);
      ufloat(t, 'DODGED', 'blk'); await sleep(200);
    } else {
      sfx('whoosh'); await flyArc(fl, land, 340, 0.55);
      streak(T.x - 40 * S(), T.y, T.x + 40 * S(), T.y, kind === 'data' ? '255,90,31' : '255,255,255');
      squash(fl);
      if (cover) { const dir = Math.sign(T.x - center(ct.wrap).x) || 1; tgt.wrap.animate([{ translate: '0 0' }, { translate: `${dir * 30}% -4%`, offset: .35 }, { translate: `${dir * 30}% -4%`, offset: .7 }, { translate: '0 0' }], { duration: 560, easing: 'ease-out' }); }
      if (['block', 'negate', 'intercept', 'body'].includes(res)) {
        shieldFX(T.x, T.y); sfx('block'); shake(2, 0.12);
        ufloat(cover ? by : t, res === 'body' ? 'BODY-BLOCK' : res === 'negate' ? 'NEGATED' : res === 'intercept' ? 'COVERED' : 'BLOCKED', 'blk');
        await sleep(240);
      } else if (res === 'partial' || res === 'intercept-part') { shieldFX(T.x, T.y); sfx('block'); await sleep(110); }
      else await sleep(40);
    }
    retreat();
  },
  async hit(u, dmg, kind) {
    const c = cards[u.uid]; if (!c) return; paint(c.wrap, u);
    const P = center(c.wrap), tier = impact(P.x, P.y, dmg, kind);
    ufloat(u, '-' + dmg, 'dmg' + (kind === 'data' ? ' data' : ''), Math.max(16, P.w * (0.2 + tier * 0.07)));
    c.wrap.classList.add('hurt'); setTimeout(() => c.wrap.classList.remove('hurt'), 340);
    const amp = 1.5 + tier * 2;
    c.wrap.animate([{ translate: '0 0' }, { translate: `${-amp}% 1%` }, { translate: `${amp}% -1%` }, { translate: `${-amp / 2}% 0` }, { translate: '0 0' }], { duration: 240 + tier * 60 });
    sfx('hit', tier); await sleep(110 + tier * 75);
  },
  async counter(t, a) { const A = center(cards[t.uid].wrap), B = center(cards[a.uid].wrap); streak(A.x, A.y, B.x, B.y, '255,255,255'); ufloat(t, 'COUNTER', 'buf'); sfx('hit', 1); await sleep(240); },
  async dodge(u) { const c = cards[u.uid]; if (c) ghostSlide(c.wrap, 1); sfx('dodge'); ufloat(u, 'DODGED', 'blk'); await sleep(260); },
  async die(u) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    sparks(P.x, P.y, 50, 380 * s, COL_HIT, { g: 500 }); sparks(P.x, P.y, 24, 260 * s, COL_DATA, { g: 400 }); smoke(P.x, P.y, 5, 44 * s); crack(P.x, P.y, 80 * s); ring(P.x, P.y, 76 * s, 0, '255,255,255', 4, 0.5);
    lens(P.x, P.y, 120 * s, 0, 0.6, '255,60,40'); shockLines(P.x, P.y, 24, 14 * s, 30 * s, 640 * s, '#fff'); twinkles(P.x, P.y, 12, P.w * 0.5, COL_HIT, { rise: true, life: 1.3 }); glow(P.x, P.y, P.w, 0.45, '255,60,30');
    shake(8, 0.4); sfx('die'); ufloat(u, 'DOWN', 'dmg'); paint(c.wrap, u); updateAll(); await sleep(520);
  },
  async dataBurst(u, level) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap);
    c.wrap.classList.add('datafx'); dataFX(P.x, P.y, level); notchSpark(u, 'DATA'); sfx('data');
    await sleep(260 + level * 90); c.wrap.classList.remove('datafx'); paint(c.wrap, u);
  },
  async brim(a) {
    const c = cards[a.uid], P = center(c.wrap), s = S(), R = Math.min(CW, CH) * 0.62;
    sfx('data'); c.wrap.classList.add('datafx');
    converge(P.x, P.y, 46, 110 * s, COL_DATA, 0.34); lens(P.x, P.y, 80 * s, 0, 0.5, '255,60,30'); glow(P.x, P.y, 90 * s, 0.4, '255,60,30');
    await sleep(RM ? 40 : 300);
    flash(0.5, 520, '255,80,30'); warp(1.3); shake(9, 0.6); sfx('data');
    lens(P.x, P.y, R, 0, 0.85, '255,70,40'); lens(P.x, P.y, R * 0.62, 0.1, 0.8, '255,150,70'); ring(P.x, P.y, R * 1.05, 0, '255,90,31', 6, 0.8); ring(P.x, P.y, R * 0.7, 0.12, '255,255,255', 3, 0.7);
    shockLines(P.x, P.y, 30, 30 * s, 60 * s, 900 * s, '#ff9a4a'); sparks(P.x, P.y, 70, 560 * s, COL_DATA, { g: 40, life: 1.2 }); twinkles(P.x, P.y, 14, 90 * s, COL_FIELD, { rise: true });
    E.enemies(a.side).forEach((f, i) => {
      const Q = center(cards[f.uid].wrap);
      for (let k = 0; k < 3; k++) arc(P.x, P.y, Q.x + rnd(-12, 12) * s, Q.y + rnd(-12, 12) * s, 0.55, 20 * s, 12);
      lens(Q.x, Q.y, Q.w * 0.75, 0.12 + i * 0.05, 0.7, '255,80,40'); glow(Q.x, Q.y, Q.w * 0.9, 0.4, '255,70,30', 0.12 + i * 0.05); dataFX(Q.x, Q.y, 2);
    });
    await sleep(RM ? 40 : 620); c.wrap.classList.remove('datafx');
  },
  async buff(u, text) {
    const c = cards[u.uid]; if (!c) return; paint(c.wrap, u); const P = center(c.wrap), s = S(), t = text || '';
    if (/DEPULSION/.test(t)) { magnetFX(c, 1); sfx('data'); }
    else if (/\+\d STR/.test(t)) { ampFX(c, /UNSTABLE/.test(t)); sfx('data'); }
    else if (/HARDEN/.test(t)) hardenFX(c);
    else { sparks(P.x, P.y, 12, 150 * s, COL_HIT, { g: -80 }); twinkles(P.x, P.y, 5, P.w * 0.4, COL_HIT, { rise: true }); }
    ufloat(u, t, 'buf'); await sleep(RM ? 40 : (/DEPULSION|STR|HARDEN/.test(t) ? 520 : 230));
  },
  async coat(u, slot) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    sparks(P.x, P.y, 26, 180 * s, COL_DATA, { g: 40 }); twinkles(P.x, P.y, 10, P.w * 0.5, COL_FIELD, { rise: true }); glow(P.x, P.y, P.w, 0.4, '255,90,30'); ring(P.x, P.y, P.w * 0.8, 0, '255,90,31', 4, 0.5); lens(P.x, P.y, P.w * 0.9, 0, 0.5, '255,70,30'); sfx('data'); ufloat(u, 'COATED', 'dbf'); paint(c.wrap, u); await sleep(RM ? 40 : 520);
  },
  async discharge(u) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    converge(P.x, P.y, 50, P.w * 1.2, COL_DATA, 0.3); await sleep(RM ? 30 : 280);
    flash(0.55, 420, '255,90,30'); shake(10, 0.5); lens(P.x, P.y, P.w * 1.6, 0, 0.6, '255,70,30'); glow(P.x, P.y, P.w * 1.8, 0.5, '255,70,30'); shockLines(P.x, P.y, 26, 20 * s, 44 * s, 760 * s, '#ff9a4a'); sparks(P.x, P.y, 60, 480 * s, COL_DATA, { g: 30 }); sfx('data'); await sleep(RM ? 30 : 320);
  },
  async jumpscare(a, foes) {
    const s = S(); sfx('die'); flash(0.9, 700, '0,0,0'); warp(1.6); shake(12, 0.7);
    await sleep(RM ? 30 : 220); flash(0.5, 500, '255,40,30');
    const P0 = center(cards[a.uid].wrap); lens(P0.x, P0.y, 120 * s, 0, 0.6, '255,60,40');
    foes.forEach((f, i) => { const c = cards[f.uid]; if (!c) return; const P = center(c.wrap); lens(P.x, P.y, P.w, 0.05 * i, 0.6, '255,60,40'); shockLines(P.x, P.y, 18, 14 * s, 30 * s, 560 * s, '#fff'); twinkles(P.x, P.y, 8, P.w * 0.5, COL_HIT, { rise: true }); ufloat(f, 'FROZEN', 'dbf'); });
    await sleep(RM ? 30 : 600);
  },
  async charge(u, n) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    if (n < 3) { converge(P.x, P.y, 26 + n * 14, P.w * (1.1 + n * 0.3), COL_FIELD, 0.38); magnetFX(c, n); glow(P.x, P.y, P.w * (0.9 + n * 0.3), 0.5, '255,110,40'); await sleep(RM ? 40 : 300); return; }
    converge(P.x, P.y, 70, P.w * 2, COL_DATA, 0.4); glow(P.x, P.y, P.w * 1.6, 0.5, '255,60,30'); await sleep(RM ? 40 : 380);
    flash(0.6, 520, '255,90,30'); warp(1.2); shake(9, 0.6); lens(P.x, P.y, Math.min(CW, CH) * 0.55, 0, 0.8, '255,70,40'); shockLines(P.x, P.y, 30, 30 * s, 60 * s, 900 * s, '#ff9a4a'); sfx('data'); await sleep(RM ? 40 : 200);
  },
  async prick(u, src) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; streak(P.x + Math.cos(a) * P.w * 0.7, P.y + Math.sin(a) * P.h * 0.5, P.x, P.y, '255,40,40'); }
    sparks(P.x, P.y, 10, 120 * s, ['#ff2a2a', '#d4202b'], { g: 20 }); sfx('hit', 0); await sleep(RM ? 30 : 200);
  },
  async debuff(u, text) { const c = cards[u.uid]; if (!c) return; paint(c.wrap, u); const P = center(c.wrap); dataFX(P.x, P.y, 1); chevrons(P.x, P.y - P.h * 0.35, 10, P.w * 0.4, '#ff4a2a'); glow(P.x, P.y, P.w * 0.8, 0.3, '212,32,43'); ufloat(u, 'v ' + text, 'dbf'); await sleep(280); },
  async rail(slot, mode) {
    updateAll(); const P = center(railEls[slot]); dataFX(P.x, P.y, mode === 'fire' ? 2 : 1); sfx('data');
    if (mode === 'unstable') { flash(0.2, 300, '255,70,30'); shockLines(P.x, P.y, 20, 16 * S(), 26 * S(), 480 * S(), '#ff5a1f'); for (let i = 0; i < 4; i++) arc(P.x - P.w / 2, P.y + (i - 1.5) * P.h * 0.3, P.x + P.w / 2, P.y + (i - 1.5) * P.h * 0.3, 0.4, 10, 8); lens(P.x, P.y, P.w * 0.8, 0, 0.6, '255,70,30'); }
    else if (mode === 'lost') { shockLines(P.x, P.y, 14, 14 * S(), 24 * S(), 420 * S(), '#ff9a4a'); glow(P.x, P.y, P.w * 0.8, 0.4, '255,70,30'); lens(P.x, P.y, P.w * 0.8, 0, 0.5, '255,120,60'); }
    else if (mode === 'set') { for (let i = 0; i < 3; i++) arc(P.x - P.w / 2, P.y + (i - 1) * P.h * 0.3, P.x + P.w / 2, P.y + (i - 1) * P.h * 0.3, 0.35, 8, 8); glow(P.x, P.y, P.w * 0.7, 0.35, '255,120,40'); }
    await sleep(240);
  },
  async float(u, text, cls) {
    const c = cards[u.uid];
    if (c && !RM) {
      if (text === 'DEPULSION') { magnetFX(c, 2); sfx('block'); }
      else if (text === 'HARDEN') hardenFX(c, true);
      else if (text === 'BASHED') { const P = center(c.wrap); lens(P.x, P.y, P.w * 0.8, 0, 0.45, '255,90,40'); shockLines(P.x, P.y, 16, 12 * S(), 22 * S(), 500 * S(), '#fff'); shake(5, 0.2); }
      else if (text === 'SENT BACK') { const P = center(c.wrap); shockLines(P.x, P.y, 12, 10 * S(), 20 * S(), 420 * S(), '#ff9a4a'); chevrons(P.x, P.y - P.h * 0.3, 6, P.w * 0.4, '#ff9a4a'); }
    }
    ufloat(u, text, cls || 'blk'); await sleep(text === 'DEPULSION' ? 260 : 120);
  }
};

/* =========================================================
   Inspect, panels, arrange, game over
   ========================================================= */
function pseudoUnit(key, i) { const d = DEFS[key], hp = Math.max(1, Math.round(d.hp * prefs.hp)); return { uid: 'p' + i, pseudo: true, key, name: d.name, side: 0, slot: i, cur: E.statsFor(key, i), max: E.statsFor(key, i), hp, maxhp: hp, rest: 0, alive: true, makeup: false, fp: false }; }
function showInspect(u) {
  const d = DEFS[u.key], ov = $('#inspect'), v = k => (UI.pv && UI.pv.u === u) ? UI.pv.v[k] : u.cur[k];
  ov.innerHTML = `<div class="inner holo" style="display:flex;flex-direction:column;align-items:center">
    <div class="hstage"><div class="hbeam"></div><div class="hbase"><i></i><i></i></div><div class="hfloat"><div class="bigslot"><div class="hsheen"></div><div class="hscan"></div></div></div></div>
    <div class="det hp3d">
    <h2 style="font-size:17px">${d.name}</h2><p style="margin:0 0 8px">${d.role.toUpperCase()} &middot; ${ROLE[u.slot]} slot ${u.slot + 1} &middot; rests ${d.rest} after acting${u.rest > 0 ? ' (resting ' + u.rest + ')' : ''}</p>
    <div class="hr"><div><b>${u.hp}/${u.maxhp}</b>HP</div>${STATS.map(k => `<div><b>${v(k)}${v(k) !== u.max[k] ? '/' + u.max[k] : ''}</b>${k === 'DATA' ? 'DATA' : k}</div>`).join('')}</div>
    ${d.abilities.map(a => `<div class="ab"><span>${a.cost === 'X' ? 'X DATA' : (a.id === 'fp' ? 'ALL DATA' : a.cost + ' DATA')}</span><b>${a.name}</b><br>${a.text}</div>`).join('')}
    <p>${d.blurb}</p><div class="btnrow"><button class="btn primary" type="button" id="inspClose">Close</button></div></div></div>`;
  const big = buildCard(u.pseudo ? u : u); const b = $('.bigslot', ov); b.insertBefore(big, b.firstChild); big.classList.add('showvals'); big.classList.remove('sel');
  big.tabIndex = -1; ov.classList.remove('on'); void ov.offsetWidth; ov.classList.add('on'); $('#inspClose').focus({ preventScroll: true });
  sfx('twinkle');
  /* drag to turn the hologram; springs back when released */
  const st = $('.hstage', ov), fl = $('.hfloat', ov), sh = $('.hsheen', ov); let drag = null;
  const set = (rx, ry) => { fl.style.setProperty('--rx', rx.toFixed(1) + 'deg'); fl.style.setProperty('--ry', ry.toFixed(1) + 'deg'); sh.style.setProperty('--sx', (50 + ry * 1.1).toFixed(1) + '%'); sh.style.setProperty('--sy', (50 - rx * 1.4).toFixed(1) + '%'); };
  st.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId, rx: parseFloat(fl.style.getPropertyValue('--rx')) || 0, ry: parseFloat(fl.style.getPropertyValue('--ry')) || 0 }; fl.classList.add('grab'); fl.classList.remove('rel'); try { st.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } });
  st.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return; set(cl(drag.rx - (e.clientY - drag.y) * 0.4, -38, 38), cl(drag.ry + (e.clientX - drag.x) * 0.55, -75, 75)); });
  const up = e => { if (!drag) return; drag = null; fl.classList.remove('grab'); fl.classList.add('rel'); set(0, 0); };
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  const close = () => { ov.classList.remove('on'); };
  $('#inspClose').onclick = close; ov.onclick = e => { if (e.target === ov || e.target.classList.contains('inner')) close(); };
}
function closePanels() { $$('.ov').forEach(o => { if (o.id !== 'arrange' && o.id !== 'over') o.classList.remove('on'); }); }
function showPanel(html, after) { const p = $('#panel'); p.innerHTML = `<div class="inner">${html}</div>`; p.classList.add('on'); const c = $('.pclose', p); if (c) { c.onclick = () => p.classList.remove('on'); c.focus({ preventScroll: true }); } if (after) after(p); }
function showRules() {
  const S = {
    basics: `<h3>The goal</h3><p>Knock out all four enemy agents. Nobody heals, apart from Echidna's Enki, so every point of damage counts.</p>
      <h3>Your squad</h3><ul>
      <li>4 agents, spent from a <b>hiring budget</b> of 15 points. Strong agents cost more.</li>
      <li><b>Slots 1 and 4 guard</b> (they can step in for a neighbour). <b>Slots 2 and 3 attack.</b> Where you place someone matters.</li>
      <li>Build and save up to several decks on the squad screen. Hold and drag cards to rearrange.</li></ul>
      <h3>The four stats</h3><ul>
      <li><b>STR (Strength):</b> your attack power and your block. Attacking and blocking spend it.</li>
      <li><b>AGI (Agility):</b> spend exactly the attack's number to dodge it.</li>
      <li><b>BRN (Brains):</b> pays for interrupts and Transfers. Some abilities target it.</li>
      <li><b>DATA:</b> pays for special abilities. The only stat shown in colour.</li></ul>
      <p>Stats are a <b>pool you spend</b>, not a fixed number. They refill slowly (see Turn).</p>`,
    turn: `<h3>On your turn</h3><ol>
      <li><b>Pick one agent</b> that isn't resting. It instantly gets <b>+1 on every stat</b> (up to its max).</li>
      <li><b>Act once</b> with that agent using one notch on its card:</li></ol><ul>
      <li><b>Strength:</b> attack. Drag the card onto the Action Rail slot in front of your target, or tap the slot. Set the power with + and -.</li>
      <li><b>DATA:</b> open its abilities and pick one.</li>
      <li><b>Brains:</b> Transfer or Recover (below).</li>
      <li><b>Skip turn</b> is under your cards if you'd rather wait.</li></ul>
      <h3>Resting</h3><p>After attacking or interrupting, an agent <b>rests</b> for its own number of turns (shown when you inspect it). A resting agent can't act, defend or dodge, so it's wide open.</p>
      <h3>Brains actions</h3><ul>
      <li><b>Transfer:</b> give a teammate 1 + a quarter of your Brains in one stat. It costs you 1 Brains and the turn, then you rest 1. Best from high-Brains agents.</li>
      <li><b>Recover:</b> +1 to one stat that's below its max.</li></ul>
      <h3>Buffs</h3><p>Buffs are +1 each and can lift a stat up to +3 over its max.</p>`,
    combat: `<h3>Attacking</h3><p>An attack costs Strength equal to its power. Everything you spend stays spent until you refill it by picking that agent.</p>
      <h3>Defending</h3><ul>
      <li><b>Match</b> the power with Strength to hold it. No damage.</li>
      <li><b>Spend less</b> and you take the gap.</li>
      <li><b>Spend more</b> and you counter for the gap.</li>
      <li><b>Dodge</b> by spending exactly the attack's number in Agility. You can't dodge while resting.</li></ul>
      <h3>Clash</h3><p>If you match exactly, the attacker may raise by 1 (paying 1 more) and you answer, back and forth. Everything spent stays spent. Whoever stops first loses: hold it and it's negated, or let it through and take the gap.</p>
      <h3>Interrupt</h3><p>Guards in slots 1 and 4 can step in for the agent beside them, for 1 Brains plus Strength. Interrupting makes them rest. Counters can be dodged but never countered.</p>
      <h3>The Action Rail</h3><p>One slot per column. Some effects change a slot: a Capacitor weakens the next attack through it, an unstable slot stops everyone attacking from it, a blocked slot can't be attacked through. Glowing slots show what's active.</p>
      <h3>Ranged</h3><p>Projection and Vesp don't move the card. The shot flies across. Only an exact-Agility dodge or a body-block stops them.</p>`,
    data: `<h3>DATA abilities</h3><ul>
      <li>Every agent has two abilities with a DATA cost. <b>X</b> means you choose how much to spend.</li>
      <li>Abilities that last show as a glow around the card and a tag on it (like Depulsion or Harden).</li>
      <li><b>Hidden</b> abilities (He's Mine, Atomise, Stationary, Baton) can't be seen by your opponent. Use them to set traps.</li>
      <li>Using DATA usually makes the agent rest too, so plan the turn after.</li></ul>
      <h3>Reading the board</h3><ul>
      <li>Tap any card to inspect it. You'll see its current stats, abilities and rest time in 3D.</li>
      <li>Orange auras are strong buffs. Dotted ones mean an enemy ability is on that agent.</li>
      <li>Check rest numbers. An agent that just attacked is the best target.</li></ul>`,
    strat: `<h3>Think in tempo</h3><ul>
      <li><b>Rest is the real cost.</b> A 9-Strength hit that leaves its owner resting 3 turns hands your opponent three free moves.</li>
      <li><b>Hit resting agents.</b> They can't block or dodge, so even a small hit lands in full.</li>
      <li><b>Don't empty yourself.</b> An agent with no Strength or Agility left is easy prey until it refills.</li></ul>
      <h3>Placement</h3><ul>
      <li>Put tough, high-Brains agents in the guard slots so they can interrupt.</li>
      <li>Put big hitters in the attack slots, and keep a guard beside each one.</li></ul>
      <h3>Budget</h3><ul>
      <li>All heavy hitters is a glass cannon: few agents can take a hit. Mix in cheap support (1 to 3 points).</li>
      <li>Support squads need a way to finish. Chip damage alone usually runs out of steam.</li></ul>
      <h3>Reading your opponent</h3><ul>
      <li>An enemy who keeps a big agent back is probably holding a hidden trap, or charging Echidna.</li>
      <li>A matched block is a gamble: raising costs you too, so only escalate if you can afford to lose.</li></ul>`,
    combos: `<h3>Combos worth trying</h3><ul>
      <li><b>Opal + Frey: double hit.</b> Frey uses Wingwoman first. When Opal lands her big attack, Frey charges in on the same target with her remaining Strength.</li>
      <li><b>Neko + Rarity: no answer.</b> Rarity's Teacher gives Neko +1 and stops interrupts, and Sharpen stops Strength blocks. The only defence is an exact dodge.</li>
      <li><b>Ellie + any hitter:</b> Bash forces the target to rest, then a teammate walks in on a defenceless agent.</li>
      <li><b>Mason + Opal or Jane:</b> Mason starts at 0 Strength, but Rookie numbers copies his neighbour's. Put him beside your strongest.</li>
      <li><b>Echidna's charge:</b> three turns, then 15 damage. Guard her with Frey's Stationary or Mason's Collateral. The enemy's counter is Rarium, which breaks her charge.</li>
      <li><b>Wraith's trap:</b> Atomise a slot, then Discharge the coated agent for 5.</li>
      <li><b>Punish big swings:</b> Edica's Depulsion, Tyrees' Depu-counter and Miera's Harden all turn an enemy's best attack against them.</li>
      <li><b>Wren as an enabler:</b> a cheap Capacitor on a column shrinks incoming hits. Quick Maths and Leer strip Brains and Agility so your hits land.</li>
      <li><b>Julian + Delilah:</b> they only play together. Manipulator redirects hits onto Julian, and He's Mine punishes anyone who targets him.</li></ul>
      <p style="color:#888">Try a combo for a couple of rounds before deciding it's good. Every squad has a counter.</p>`
  };
  const tabs = [['basics', 'Basics'], ['turn', 'Turn'], ['combat', 'Combat'], ['data', 'DATA'], ['strat', 'Strategy'], ['combos', 'Combos']];
  showPanel(`<h2>Rules</h2><div class="rtabs" role="tablist">${tabs.map((t, i) => `<button type="button" role="tab" class="rtab${i ? '' : ' on'}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="rbody">${tabs.map((t, i) => `<section class="rsec${i ? '' : ' on'}" data-s="${t[0]}">${S[t[0]]}</section>`).join('')}</div>
    <div class="btnrow"><button class="btn pclose" type="button">Close</button></div>`, p => {
    const go = k => { $$('.rtab', p).forEach(b => b.classList.toggle('on', b.dataset.t === k)); $$('.rsec', p).forEach(s => s.classList.toggle('on', s.dataset.s === k)); const bd = $('.rbody', p); if (bd) bd.scrollTop = 0; p.scrollTop = 0; };
    $$('.rtab', p).forEach(b => { b.onclick = () => { sfx('tick'); go(b.dataset.t); }; });
  });
}
function showLog() {
  const lines = (G ? G.log.slice(-60).reverse() : []).map(l => `<div class="logline">${l}</div>`).join('') || '<p>Nothing yet.</p>';
  showPanel(`<h2>Log</h2>${lines}<div class="btnrow" style="margin-top:12px"><button class="btn pclose" type="button">Close</button></div>`);
}
function showTune() {
  showPanel(`<h2>Tune</h2><p>Test knobs. They apply to the next duel.</p>
  <div class="field"><label for="tHp">Agent HP <span id="tHpV"></span></label><input id="tHp" type="range" min="0.4" max="1" step="0.05"><small>100% is the HP on your cards. With no healing, full HP makes long duels, so this starts at 60%.</small></div>
  <div class="field"><label>Attack cost</label><div class="seg"><button class="btn" type="button" id="tFull">Full power</button><button class="btn" type="button" id="tHalf">Half, rounded up</button></div></div>
  <div class="field"><label>Clash escalation</label><div class="seg"><button class="btn" type="button" id="tClOn">On</button><button class="btn" type="button" id="tClOff">Off</button></div><small>On: a matched block lets the attacker raise by 1 and the defender answer, repeating until someone stops.</small></div>
  <div class="btnrow"><button class="btn primary pclose" type="button">Done</button></div>`, p => {
    const r = $('#tHp', p), v = $('#tHpV', p);
    const sync = () => { v.textContent = Math.round(prefs.hp * 100) + '%'; r.value = prefs.hp; $('#tFull', p).classList.toggle('on', !prefs.half); $('#tHalf', p).classList.toggle('on', prefs.half); $('#tClOn', p).classList.toggle('on', prefs.clash); $('#tClOff', p).classList.toggle('on', !prefs.clash); };
    r.oninput = () => { prefs.hp = +r.value; savePrefs(); sync(); };
    $('#tFull', p).onclick = () => { prefs.half = false; savePrefs(); sync(); }; $('#tHalf', p).onclick = () => { prefs.half = true; savePrefs(); sync(); };
    $('#tClOn', p).onclick = () => { prefs.clash = true; savePrefs(); sync(); }; $('#tClOff', p).onclick = () => { prefs.clash = false; savePrefs(); sync(); };
    sync();
  });
}
window.addEventListener('touchmove', e => { if (UI.dnd && e.cancelable) e.preventDefault(); }, { passive: false });
function showArrange() {
  UI.mode = 'arrange'; let sel = 0, swapping = false, first = true, dragEnd = 0; const ov = $('#arrange'); ov.classList.add('on'); $('#over').classList.remove('on');
  const statBar = (k, v, d) => `<div class="sb"><span class="sl"><img src="${ICO[k]}" alt="">${SHORT[k]}</span><span class="st"><i style="--w:${Math.min(100, v / 10 * 100)}%"></i></span><b>${v}</b></div>`;
  const panel = key => {
    const d = DEFS[key], st0 = E.statsFor(key, sel), hp = Math.max(1, Math.round(d.hp * prefs.hp)), slotNote = sel < 4 ? (sel === 0 || sel === 3 ? 'Guard slot: can interrupt for the agent beside them' : 'Attack slot: hits harder, nobody guards for it') : 'On the bench';
    const brnNote = (E.statsFor(key, sel).BRN < 1 ? ' Has no Brains, so it cannot interrupt for a teammate.' : '') + (d.pair ? ' Must sit next to ' + DEFS[d.pair].name + ' (both or neither).' : '');
    return `<div class="ahead"><b>${d.name}</b><span>${d.role.toUpperCase()} &middot; rests ${d.rest} after acting &middot; costs ${d.cost} hiring point${d.cost > 1 ? 's' : ''}</span></div>
      <p class="blurb">${d.blurb}</p>
      <div class="hpbig"><b>${hp}</b><span>HP in duel &middot; ${d.hp} on card at ${Math.round(prefs.hp * 100)}% Tune</span></div>
      <div class="sbs">${STATS.map(k => statBar(k, st0[k])).join('')}</div>
      <div class="abl">${d.abilities.map(x => `<div class="ab"><span>${x.cost === 'X' ? 'X DATA' : (x.id === 'fp' ? 'ALL DATA' : x.cost + ' DATA')}</span><b>${x.name}</b><br>${x.text}</div>`).join('')}</div>
      <p class="note">${slotNote}.${brnNote}</p>`;
  };
  const draw = () => {
    ov.innerHTML = `<div class="inner arr"><div class="abrand"><b>ANOMEX</b><span>LINKED</span></div><h2>Build your squad</h2>
      <div class="decks"></div><div class="dkrow"></div><div class="budget"></div>
      <p class="sub">Tap a card to inspect it. Hold and drag one onto another to swap. Your squad is the top four and must fit the hiring budget. Slots 1 and 4 guard, slots 2 and 3 attack.</p>
      <div class="tiles"></div><div class="swaprow"></div>
      <div class="apanel"></div>
      <div class="btnrow" style="width:min(100%,420px)"><button class="btn" type="button" id="aRules">Rules</button><button class="btn" type="button" id="aTune">Tune</button><button class="btn" type="button" id="aOnl">Online</button><button class="btn primary" type="button" id="aGo">Start duel</button></div></div>`;
    const bar = $('.decks', ov), dkrow = $('.dkrow', ov);
    decks.forEach((d, i) => { const b = el('button', 'dk' + (i === activeDeck ? ' on' : '')); b.type = 'button'; b.textContent = d.name; b.onclick = () => { if (i === activeDeck) return; sfx('tick'); activeDeck = i; roster = decks[i].order; saveDecks(); sel = 0; swapping = false; first = true; draw(); }; bar.appendChild(b); });
    if (decks.length < 5) { const b = el('button', 'dk add', '+'); b.type = 'button'; b.setAttribute('aria-label', 'New deck'); b.onclick = () => { sfx('tick'); decks.push({ name: 'Deck ' + (decks.length + 1), order: roster.slice() }); activeDeck = decks.length - 1; roster = decks[activeDeck].order; saveDecks(); sel = 0; swapping = false; first = true; draw(); }; bar.appendChild(b); }
    const inp = el('input', 'dkname'); inp.value = decks[activeDeck].name; inp.maxLength = 14; inp.setAttribute('aria-label', 'Deck name'); inp.autocomplete = 'off'; inp.spellcheck = false;
    inp.oninput = () => { decks[activeDeck].name = inp.value.trim().slice(0, 14) || 'Deck ' + (activeDeck + 1); const bs = $$('.dk:not(.add)', bar); if (bs[activeDeck]) bs[activeDeck].textContent = decks[activeDeck].name; saveDecks(); };
    const dup = el('button', 'mini', 'Copy'); dup.type = 'button'; dup.onclick = () => { if (decks.length >= 5) return toast('Five decks max.'); sfx('tick'); decks.push({ name: (decks[activeDeck].name + ' 2').slice(0, 14), order: roster.slice() }); activeDeck = decks.length - 1; roster = decks[activeDeck].order; saveDecks(); sel = 0; first = true; draw(); };
    let armDel = false; const del = el('button', 'mini', 'Delete'); del.type = 'button'; del.onclick = () => { if (decks.length < 2) return toast('You need at least one deck.'); if (!armDel) { armDel = true; del.textContent = 'Sure?'; del.classList.add('arm'); setTimeout(() => { armDel = false; del.textContent = 'Delete'; del.classList.remove('arm'); }, 2200); return; } decks.splice(activeDeck, 1); activeDeck = Math.max(0, activeDeck - 1); roster = decks[activeDeck].order; saveDecks(); sel = 0; first = true; draw(); };
    dkrow.append(inp, dup, del);
    { const used = E.squadCost(teamOf()), B = E.CFG.budget, bg = $('.budget', ov); bg.classList.toggle('over', used > B);
      bg.innerHTML = `<span>HIRING POINTS</span><b>${used}<i> / ${B}</i></b><div class="bbar"><u style="width:${Math.min(100, used / B * 100)}%"></u></div>`; }
    const landed = UI.landed; UI.landed = null;
    const tiles = $('.tiles', ov);
    roster.forEach((key, i) => {
      const t = el('div', 'tile' + (sel === i ? ' pick' : '') + (i >= 4 ? ' bench' : '') + (swapping && sel !== i ? ' target' : '') + (first ? ' enter' : '') + (landed && landed.includes(i) ? ' landed' + (i < 4 ? ' hot' : '') : '')); t.dataset.i = i; t.style.setProperty('--i', i); t.tabIndex = 0; t.setAttribute('role', 'button'); t.setAttribute('aria-label', `${DEFS[key].name}, ${i < 4 ? 'slot ' + (i + 1) : 'bench'}`);
      const lab = el('div', 'lab', i < 4 ? ROLE[i] + ' ' + (i + 1) : 'BENCH'), slot = el('div', 'tslot'); const w = buildCard(pseudoUnit(key, i)); w.tabIndex = -1; $$('.notch', w).forEach(n => { n.style.pointerEvents = 'none'; }); slot.appendChild(w);
      t.append(lab, slot, el('div', 'cap', DEFS[key].name), el('div', 'tcost', String(DEFS[key].cost)));
      if (landed && landed.includes(i)) { const fx = el('div', 'landfx'); for (let k = 0; k < 10; k++) { const sp = el('i'); sp.style.setProperty('--a', (k * 36 + (i * 17) % 20) + 'deg'); sp.style.setProperty('--d', (28 + (k % 3) * 12) + 'px'); fx.appendChild(sp); } slot.appendChild(fx); setTimeout(() => fx.remove(), 800); }
      t.addEventListener('pointerdown', e => dragStart(e, t, i));
      const act = () => {
        if (Date.now() - dragEnd < 350) return;
        sfx('tick');
        if (swapping && sel !== i) { const x = roster[sel], from = sel; roster[sel] = roster[i]; roster[i] = x; sel = i; swapping = false; UI.landed = [from, i]; saveDecks(); }
        else { sel = i; swapping = false; }
        draw();
      };
      t.addEventListener('click', act); t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
      tiles.appendChild(t);
    });
    first = false;
    const dragStart = (e, t, i) => {
      if (e.button > 0 || UI.dnd) return;
      const sx = e.clientX, sy = e.clientY, touch = e.pointerType !== 'mouse'; let started = false, timer = null, ghost = null, raf = 0, px = sx, py = sy, overI = -1, lpx = -1, lpy = -1, lsy = -1;
      const clean = () => { clearTimeout(timer); cancelAnimationFrame(raf); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cn); ov.removeEventListener('scroll', onScr); window.removeEventListener('scroll', onScr); if (ghost) ghost.remove(); t.classList.remove('dragsrc'); $$('.tile.over', ov).forEach(x => x.classList.remove('over')); UI.dnd = false; };
      let rects = null, scr = 0;
      const onScr = () => { scr = ov.scrollTop + window.scrollY; };
      const track = () => {
        if (!started) return;
        const moved = px !== lpx || py !== lpy || scr !== lsy; lpx = px; lpy = py; lsy = scr;
        if (moved) {
          ghost.style.transform = `translate3d(${px}px,${py}px,0) translate(-50%,-55%) scale(1.08) rotate(3deg)`;
          const dy = scr - rects.s0; let ni = -1;
          for (const q of rects.list) if (px >= q.l && px <= q.r && py + scr >= q.t + rects.s0 && py + scr <= q.b + rects.s0) { ni = q.t0 === t ? -1 : q.i; break; }
          if (ni !== overI) { $$('.tile.over', ov).forEach(x => x.classList.remove('over')); if (ni >= 0) { const q = rects.list.find(z => z.i === ni); q.t0.classList.add('over'); sfx('tick'); } overI = ni; }
        }
        const m = 80, vh = window.innerHeight; if (py < m) { ov.scrollTop -= (m - py) * 0.25; window.scrollBy(0, -(m - py) * 0.25); } else if (py > vh - m) { ov.scrollTop += (py - (vh - m)) * 0.25; window.scrollBy(0, (py - (vh - m)) * 0.25); }
        raf = requestAnimationFrame(track);
      };
      const begin = () => {
        started = true; UI.dnd = true; try { navigator.vibrate && navigator.vibrate(12); } catch (er) {}
        const r = t.getBoundingClientRect(); ghost = t.cloneNode(true); ghost.classList.add('ghost'); ghost.classList.remove('pick', 'enter', 'landed'); ghost.style.width = r.width + 'px'; document.body.appendChild(ghost); t.classList.add('dragsrc'); sfx('whoosh');
        onScr(); rects = { s0: scr, list: $$('.tile', ov).filter(x => x.dataset.i != null).map(x => { const b = x.getBoundingClientRect(); return { t0: x, i: +x.dataset.i, l: b.left, r: b.right, t: b.top, b: b.bottom }; }) };
        ov.addEventListener('scroll', onScr, { passive: true }); window.addEventListener('scroll', onScr, { passive: true }); track();
      };
      const mv = ev => { px = ev.clientX; py = ev.clientY; if (!started) { const dd = Math.hypot(px - sx, py - sy); if (touch) { if (dd > 10) clean(); } else if (dd > 6) begin(); } };
      const up = () => {
        if (!started) { clean(); return; }
        const to = overI; clean(); dragEnd = Date.now();
        if (to >= 0 && to !== i) { const x = roster[i]; roster[i] = roster[to]; roster[to] = x; sel = to; swapping = false; UI.landed = [i, to]; saveDecks(); sfx('tick'); sfx('whoosh'); }
        draw();
      };
      const cn = () => clean();
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cn);
      if (touch) timer = setTimeout(begin, 240);
    };
    const vs = E.validSquad(teamOf()); $('#aGo').disabled = !vs.ok; const wn = el('p', 'warn', vs.ok ? '' : vs.reason + (/budget/.test(vs.reason) ? ' Swap in cheaper agents to start.' : ' Swap them into place to start.')); wn.style.display = vs.ok ? 'none' : 'block'; $('.swaprow', ov).before(wn);
    const key = roster[sel], ap = $('.apanel', ov); ap.innerHTML = panel(key);
    requestAnimationFrame(() => requestAnimationFrame(() => ap.classList.add('on')));
    const sr = $('.swaprow', ov), sb = el('button', 'btn' + (swapping ? ' primary' : ''), swapping ? 'Tap a card to swap with ' + DEFS[key].name + ' (cancel)' : (sel < 4 ? 'Swap ' + DEFS[key].name + ' with...' : 'Bring ' + DEFS[key].name + ' into the squad...'));
    sb.type = 'button'; sb.onclick = () => { sfx('tick'); swapping = !swapping; draw(); }; sr.appendChild(sb);
    $('#aRules').onclick = showRules; $('#aTune').onclick = showTune; $('#aOnl').onclick = () => { sfx('tick'); if (ONL && ONL.lobby && !ONL.playing) ONL.lobby(); else showOnline(); }; if (ONL && ONL.lobby && !ONL.playing) { $('#aOnl').textContent = 'Back to lobby'; $('#aGo').style.display = 'none'; } $('#aGo').onclick = () => { sfx('tick'); startGame(); };
  };
  draw();
}
function showOver() {
  liveSet(false);
  const w = G.winner, ov = $('#over'), win = w === 0;
  ov.innerHTML = `<div class="verdict ${win ? 'win' : 'lose'}"><h1>${w === -1 ? 'Stalemate' : win ? 'Victory' : 'Defeat'}</h1><p>${w === -1 ? 'Nobody could finish it.' : win ? 'Every enemy agent is down.' : 'Your squad was wiped out.'} Round ${Math.ceil(G.turnNo / 2)}.</p>
    <div class="btnrow" style="max-width:380px;margin:16px auto 0"><button class="btn" type="button" id="oOrder">${ONL ? 'Leave' : 'Squad order'}</button><button class="btn primary" type="button" id="oAgain">Rematch</button></div></div>`;
  ov.classList.add('on'); sfx(win ? 'win' : 'lose');
  $('#oAgain').onclick = () => { if (ONL) return rematchAsk(); ov.classList.remove('on'); startGame(); };
  $('#oOrder').onclick = () => { ov.classList.remove('on'); if (ONL) leaveOnline(); showArrange(); };
}


/* =========================================================
   Online duels (peer to peer; both phones run the same rules)
   ========================================================= */
let ONL = null;
const BANK = 'anomex-ban', LIVEK = 'anomex-live', BAN_MS = 5 * 60 * 1000;
const banLeft = () => { try { return Math.max(0, (+localStorage.getItem(BANK) || 0) - Date.now()); } catch (e) { return 0; } };
const setBan = () => { try { localStorage.setItem(BANK, String(Date.now() + BAN_MS)); } catch (e) { /* private mode */ } };
const liveSet = on => { try { if (on) localStorage.setItem(LIVEK, String(Date.now())); else localStorage.removeItem(LIVEK); } catch (e) { /* private mode */ } };
const fmtT = ms => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
/* closing or refreshing the page in the middle of an online match counts as a forfeit */
try { if (localStorage.getItem(LIVEK)) { liveSet(false); setBan(); } } catch (e) { /* ok */ }
function endScreen(cls, title, text) {
  const ov = $('#over'); ov.innerHTML = `<div class="verdict ${cls}"><h1>${title}</h1><p>${text}</p><div class="btnrow" style="max-width:380px;margin:16px auto 0"><button class="btn primary" type="button" id="oOrder">Back to squad</button></div></div>`;
  ov.classList.add('on'); $('#oOrder').onclick = () => { ov.classList.remove('on'); leaveOnline(); showArrange(); };
}
function forfeitMatch() {
  if (!ONL || !ONL.playing || ONL.ended) return;
  ONL.ended = true; Net.send({ t: 'forfeit' }); setBan(); liveSet(false); loopId++; closeMenus(); stopHint(); $('#panel').classList.remove('on');
  endScreen('lose', 'Forfeited', "You left the match, so you can't play online for 5 minutes.");
}
function quitToSquad() { loopId++; closeMenus(); stopHint(); $('#panel').classList.remove('on'); $('#over').classList.remove('on'); showArrange(); }
function showOptions() {
  const live = !!(G && !G.over && !$('#arrange').classList.contains('on') && !(ONL && ONL.ended));
  const online = !!(ONL && ONL.playing);
  showPanel(`<h2>Options</h2><div class="btnrow col opts"><button class="btn" type="button" id="opRules">Rules</button><button class="btn" type="button" id="opLog">Log</button><button class="btn" type="button" id="opTune">Tune</button><button class="btn" type="button" id="opSnd"></button></div>
    ${live ? `<h3 class="opth">Match</h3><div class="btnrow col opts"><button class="btn danger" type="button" id="opLeave">${online ? 'Forfeit match' : 'Quit to squad'}</button></div><p class="note">${online ? "You lose the match and can't play online for 5 minutes." : 'Ends this duel. Nothing is lost.'}</p>` : ''}
    <div class="btnrow"><button class="btn primary pclose" type="button">Close</button></div><p class="note" style="text-align:center;margin-top:14px">Version ${E.VERSION}</p>`, p => {
    const snd = $('#opSnd', p), sy = () => { snd.textContent = 'Sound: ' + (prefs.sfx ? 'On' : 'Off'); };
    sy(); snd.onclick = () => { prefs.sfx = !prefs.sfx; savePrefs(); sy(); if (prefs.sfx) sfx('tick'); };
    $('#opRules', p).onclick = () => { sfx('tick'); showRules(); }; $('#opLog', p).onclick = () => { sfx('tick'); showLog(); }; $('#opTune', p).onclick = () => { sfx('tick'); showTune(); };
    const lv = $('#opLeave', p); if (lv) { let arm = 0; lv.onclick = () => {
      if (!arm) { sfx('tick'); lv.textContent = online ? 'Sure? Tap again to forfeit' : 'Sure? Tap again to quit'; lv.classList.add('arm'); arm = setTimeout(() => { arm = 0; lv.classList.remove('arm'); lv.textContent = online ? 'Forfeit match' : 'Quit to squad'; }, 3000); return; }
      clearTimeout(arm); if (online) forfeitMatch(); else quitToSquad();
    }; }
  });
}
const hashStr = t => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const defsSig = () => hashStr(E.VERSION + JSON.stringify(Object.keys(DEFS).map(k => [k, DEFS[k].stats, DEFS[k].hp, DEFS[k].rest, DEFS[k].cost, DEFS[k].abilities.map(a => a.id + ':' + a.cost)])));
const wrapDec = fn => async (...a) => { const r = await fn(...a); if (ONL) { if (DBG) console.log('DEC out', JSON.stringify(Net.encode(r))); Net.send({ t: 'dec', d: Net.encode(r) }); } return r; };
async function remoteDec() {
  UI.mode = 'busy'; setTray(); hintSet('Friend', 'Deciding how to respond...');
  try { const m = await Net.next('dec'); if (DBG) console.log('DEC in', JSON.stringify(m.d)); return Net.decode(m.d, G); } catch (err) { onlineLost(); throw err; }
}
const stateStr = () => { const order = ONL && ONL.role === 'guest' ? [1, 0] : [0, 1]; return JSON.stringify(order.map(sd => G.sides[sd].map(u => [u.key, u.alive ? 1 : 0, u.hp, u.rest, u.cur.STR, u.cur.AGI, u.cur.BRN, u.cur.DATA]))); };
const stateHash = () => hashStr(stateStr());
const DBG = /[?&]dbg/.test(location.search);
function sendSync() {
  ONL.n = (ONL.n || 0) + 1; const h = stateHash(); ONL.loc[ONL.n] = h; if (DBG) { ONL.dl = ONL.dl || {}; ONL.dl[ONL.n] = stateStr() + ' | ' + G.log.slice(-4).join(' / '); } Net.send({ t: 'sync', n: ONL.n, h, d: DBG ? ONL.dl[ONL.n] : undefined }); syncCheck(ONL.n);
}
function syncCheck(n) {
  if (!ONL || ONL.loc[n] === undefined || ONL.rem[n] === undefined) return;
  if (ONL.loc[n] !== ONL.rem[n]) { console.error('online desync at', n, DBG ? '\nLOCAL ' + ONL.dl[n] + '\nREMOTE ' + (ONL.rd || {})[n] : ''); toast('Out of sync with your friend. Rematch to start clean.'); }
  delete ONL.loc[n]; delete ONL.rem[n];
}
function onlineLost() {
  if (!ONL || ONL.ended) return; liveSet(false); const dead = ONL; loopId++; closeMenus(); stopHint();
  if (G && G.over) return;
  const ov = $('#over'); ov.innerHTML = `<div class="verdict lose"><h1>Disconnected</h1><p>Your friend left or the connection dropped.</p><div class="btnrow" style="max-width:380px;margin:16px auto 0"><button class="btn primary" type="button" id="oOrder">Back to squad</button></div></div>`;
  ov.classList.add('on'); $('#oOrder').onclick = () => { ov.classList.remove('on'); leaveOnline(); showArrange(); };
  void dead;
}
function leaveOnline() { liveSet(false); try { Net.reset(); } catch (e) { /* closed */ } if (ONL && ONL.cfg0) Object.assign(CFG, ONL.cfg0); ONL = null; Net.onState = () => {}; }
function rematchAsk() {
  ONL.me = true; Net.send({ t: 'rematch' }); const b = $('#oAgain'); if (b) { b.disabled = true; b.textContent = 'Waiting for friend...'; }
  rematchTry();
}
function rematchTry() { if (ONL && ONL.role === 'host' && ONL.me && ONL.them) { ONL.me = ONL.them = false; Net.send({ t: 'lobby' }); ONL.mine = null; ONL.opp = null; ONL.starting = false; $('#over').classList.remove('on'); loopId++; if (ONL.lobby) ONL.lobby(); } }
function hostStart() {
  CFG.hpScale = prefs.hp; CFG.attackCostFrac = prefs.half ? 0.5 : 1; CFG.clash = prefs.clash;
  const hostFirst = Math.random() < 0.5; ONL.me = ONL.them = false;
  Net.send({ t: 'start', hostFirst, cfg: Object.assign({}, CFG) }); beginOnline(hostFirst);
}
function beginOnline(hostFirst) {
  const myFirst = ONL.role === 'host' ? hostFirst : !hostFirst;
  ONL.n = 0; ONL.loc = {}; ONL.rem = {}; ONL.me = ONL.them = false; ONL.playing = true; ONL.ended = false; liveSet(true); $('#onl').classList.remove('on'); $('#over').classList.remove('on');
  startGame(['human', 'remote'], { opp: ONL.opp, first: myFirst ? 0 : 1 });
  toast(myFirst ? 'You go first.' : 'Your friend goes first.');
}
function showOnline() {
  const ov = $('#onl'); ov.classList.add('on');
  const body = (h, f) => { ov.innerHTML = `<div class="inner onl">${h}</div>`; f && f(); };
  const menu = () => {
    leaveOnline();
    body(`<h2>Online duel</h2><p class="blurb">Play a friend on another phone. One of you makes an invite code, the other types it in. You both pick a squad once you're connected.</p>${banLeft() ? '<p class="warn">Online cooldown: ' + fmtT(banLeft()) + ' left, because you left a match early.</p>' : ''}
      <div class="btnrow col"><button class="btn primary" type="button" id="nHost">Make invite code</button><button class="btn" type="button" id="nJoin">I have a code</button><button class="btn ghost" type="button" id="nBack">Back</button></div>${Net.ok ? '' : '<p class="warn">Online play could not load here.</p>'}`, () => {
      $('#nBack').onclick = () => ov.classList.remove('on'); $('#nHost').onclick = host; $('#nJoin').onclick = join; if (!Net.ok) { $('#nHost').disabled = true; $('#nJoin').disabled = true; }
    });
  };
  const gate = () => { const b = banLeft(); if (b > 0) { toast('Online cooldown: ' + fmtT(b) + ' left.'); return false; } return true; };
  const lobby = () => {
    if (!ONL) return; ONL.playing = false; ONL.lobby = lobby; ov.classList.add('on');
    const vs = E.validSquad(teamOf()), cost = E.squadCost(teamOf()), rd = !!ONL.mine, st = ONL.opp ? 'Your friend is ready.' : 'Your friend is choosing a squad...';
    const deckBtns = decks.map((d, i) => `<button type="button" class="dk${i === activeDeck ? ' on' : ''}" data-i="${i}"${rd ? ' disabled' : ''}>${String(d.name).replace(/[<>&]/g, '')}</button>`).join('');
    body(`<h2>Choose your squad</h2><p class="blurb">${rd ? 'You are ready. Waiting for your friend...' : st}</p>
      <div class="decks">${deckBtns}</div>
      <div class="lsq">${teamOf().map((k, i) => `<div class="lag"><img src="icons/${k}.png" alt=""><b>${DEFS[k].short || DEFS[k].name}</b><span>${ROLE[i]} &middot; ${DEFS[k].cost}</span></div>`).join('')}</div>
      <p class="budgetline${vs.ok ? '' : ' bad'}">${vs.ok ? 'Hiring points ' + cost + ' / ' + CFG.budget : vs.reason}</p>
      <div class="btnrow col"><button class="btn primary" type="button" id="nReady"${vs.ok ? '' : ' disabled'}>${rd ? 'Not ready' : 'Ready'}</button><button class="btn" type="button" id="nEdit">Change squad</button><button class="btn ghost" type="button" id="nLeave">Leave</button></div>`, () => {
      $$('.dk', ov).forEach(b => { b.onclick = () => { sfx('tick'); activeDeck = +b.dataset.i; roster = decks[activeDeck].order; saveDecks(); lobby(); }; });
      $('#nReady').onclick = () => {
        sfx('tick');
        if (rd) { ONL.mine = null; Net.send({ t: 'unready' }); return lobby(); }
        if (!E.validSquad(teamOf()).ok) return;
        ONL.mine = teamOf().slice(); Net.send({ t: 'ready', squad: ONL.mine }); lobby(); tryStart();
      };
      $('#nEdit').onclick = () => { sfx('tick'); if (ONL.mine) { ONL.mine = null; Net.send({ t: 'unready' }); } ov.classList.remove('on'); showArrange(); };
      $('#nLeave').onclick = () => { sfx('tick'); menu(); };
    });
  };
  const tryStart = () => { if (ONL && ONL.role === 'host' && ONL.mine && ONL.opp && !ONL.starting) { ONL.starting = true; body(`<h2>Starting...</h2><p class="blurb">Both ready.</p>`); setTimeout(hostStart, 600); } };
  const wire = role => {
    ONL = { role, opp: null, mine: null, playing: false, cfg0: Object.assign({}, CFG) };
    Net.onState = (st, why) => {
      if (st === 'open') Net.send({ t: 'hello', sig: defsSig() });
      else if (st === 'lost') { if (ONL && ONL.playing) { if (G && !G.over && !ONL.ended) onlineLost(); } else { ov.classList.add('on'); toast('Connection lost.'); menu(); } }
    };
    Net.on('hello', m => {
      if (m.sig !== defsSig()) { Net.send({ t: 'reject', why: 'Different game versions. Both of you reload the page.' }); ov.classList.add('on'); toast('Different game versions. Both of you reload the page.'); menu(); return; }
      lobby();
    });
    Net.on('ready', m => {
      const vs = Array.isArray(m.squad) && m.squad.length === 4 && m.squad.every(k => DEFS[k]) ? E.validSquad(m.squad) : { ok: false, reason: 'bad squad' };
      if (!vs.ok) { Net.send({ t: 'reject', why: 'Their squad is not legal: ' + vs.reason }); ov.classList.add('on'); toast('Their squad is not legal.'); menu(); return; }
      ONL.opp = m.squad.slice(); if (ONL.lobby && !ONL.playing && !ONL.starting) ONL.lobby(); tryStart();
    });
    Net.on('forfeit', () => { if (!ONL || !ONL.playing || ONL.ended) return; ONL.ended = true; loopId++; closeMenus(); stopHint(); liveSet(false); $('#panel').classList.remove('on'); sfx('win'); endScreen('win', 'Victory', 'Your friend forfeited.'); });
    Net.on('unready', () => { if (!ONL || ONL.starting) return; ONL.opp = null; if (ONL.lobby && !ONL.playing) ONL.lobby(); });
    Net.on('lobby', () => { if (!ONL) return; ONL.mine = null; ONL.opp = null; ONL.starting = false; ONL.me = ONL.them = false; $('#over').classList.remove('on'); closeMenus(); loopId++; lobby(); });
    Net.on('reject', m => { toast(m.why || 'Rejected'); menu(); });
    Net.on('start', m => { if (role !== 'guest' || !ONL || !ONL.opp || !ONL.mine) return; Object.assign(CFG, m.cfg); beginOnline(m.hostFirst); });
    Net.on('rematch', () => { if (!ONL) return; ONL.them = true; rematchTry(); });
    Net.on('sync', m => { if (!ONL) return; ONL.rem[m.n] = m.h; if (DBG) { ONL.rd = ONL.rd || {}; ONL.rd[m.n] = m.d; } syncCheck(m.n); });
  };
  const host = () => {
    if (!gate()) return;
    body(`<h2>Invite code</h2><p class="blurb">Making a room...</p>`);
    wire('host');
    Net.host((err, code) => {
      if (err) {
        try { Net.reset(); } catch (e) { /* ok */ }
        const why = (err && (err.type || err.message)) || 'unknown';
        return body(`<h2>Could not make a code</h2><p class="blurb">Couldn't reach the matchmaking server (${String(why).replace(/[<>&]/g, '')}). Check your connection, or try again in a bit. Some school/work wifi blocks it.</p><div class="btnrow col"><button class="btn primary" type="button" id="nRetry">Try again</button><button class="btn ghost" type="button" id="nBack2">Back</button></div>`, () => {
          $('#nRetry').onclick = host; $('#nBack2').onclick = menu;
        });
      }
      body(`<h2>Invite code</h2><div class="code" aria-label="Invite code">${code}</div><p class="blurb">Send this to your friend. They tap Online, then "I have a code". Keep this screen open until they join.</p>
        <div class="btnrow col"><button class="btn primary" type="button" id="nCopy">Copy code</button>${navigator.share ? '<button class="btn" type="button" id="nShare">Share</button>' : ''}<button class="btn ghost" type="button" id="nCancel">Cancel</button></div>`, () => {
        $('#nCopy').onclick = async () => { try { await navigator.clipboard.writeText(code); toast('Code copied'); } catch (e) { toast('Long-press the code to copy it.'); } };
        const sh = $('#nShare'); if (sh) sh.onclick = () => navigator.share({ text: 'Duel me in AnomEx: Linked. Invite code: ' + code }).catch(() => {});
        $('#nCancel').onclick = menu;
      });
    });
  };
  const join = () => {
    if (!gate()) return;
    body(`<h2>Join a duel</h2><p class="blurb">Type the 5 letter code your friend sent you.</p><input class="codein" id="nCode" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text" placeholder="CODE">
      <div class="btnrow col"><button class="btn primary" type="button" id="nGo">Join</button><button class="btn ghost" type="button" id="nCancel">Cancel</button></div><p class="blurb" id="nMsg"></p>`, () => {
      const inp = $('#nCode'); inp.focus(); inp.addEventListener('input', () => { inp.value = Net.clean(inp.value).slice(0, 5); });
      $('#nCancel').onclick = menu;
      $('#nGo').onclick = () => {
        const code = Net.clean(inp.value); if (code.length !== 5) return toast('Codes are 5 characters.');
        $('#nGo').disabled = true; $('#nMsg').textContent = 'Connecting...'; wire('guest');
        Net.join(code, err => { if (err) { toast(err.message === 'no answer' || err.type === 'peer-unavailable' ? 'No room with that code.' : 'Could not connect.'); menu(); } });
      };
    });
  };
  menu();
}

/* =========================================================
   Game loop
   ========================================================= */
async function gameLoop(id) {
  while (G && !G.over && id === loopId) {
    const side = G.turn; updateAll(); let act;
    if (G.ctrl[side] === 'human') { act = await humanTurn(); if (ONL) Net.send({ t: 'act', a: Net.encode(act) }); }
    else if (G.ctrl[side] === 'remote') {
      UI.mode = 'busy'; setTray(); hintSet("Friend's turn", 'Waiting for their move...');
      try { const m = await Net.next('act'); if (id !== loopId) return; act = Net.decode(m.a, G); } catch (err) { if (id === loopId) onlineLost(); return; }
      costFx(act);
    } else { UI.mode = 'busy'; setTray(); hintSet(G.ctrl[0] === 'cpu' ? 'Side ' + (side + 1) : 'CPU turn', 'Choosing...'); await sleep(G.ctrl[0] === 'cpu' ? 420 : 750); act = E.aiChoose(side); }
    if (id !== loopId) return;
    try { await E.executeAction(act); } catch (err) { if (id !== loopId) return; console.error(err); toast('Rules error: ' + err.message); await sleep(800); }
    if (id !== loopId) return;
    if (ONL) sendSync();
    await camReset(); if (UI.retreating) await UI.retreating;
    UI.flyer = null; $$('.cardwrap.away').forEach(w => w.classList.remove('away')); $$('.flyer').forEach(f => f.remove());
    updateAll();
  }
  if (G && G.over && id === loopId) { updateAll(); setTray(); hintSet(''); await sleep(600); showOver(); }
}
function startGame(ctrl, o) {
  o = o || {};
  if (!o.opp) { CFG.hpScale = prefs.hp; CFG.attackCostFrac = prefs.half ? 0.5 : 1; CFG.clash = prefs.clash; }
  const singAll = ROSTER_ALL.filter(k => k !== 'julian' && k !== 'delilah'); let cpu = null;
  for (let tries = 0; tries < 300 && !cpu; tries++) {
    const sing = singAll.slice(); for (let i = sing.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [sing[i], sing[j]] = [sing[j], sing[i]]; }
    let c = sing.slice(0, 4);
    if (Math.random() < 0.3) { const p = (Math.random() * 3) | 0, pr = Math.random() < 0.5 ? ['julian', 'delilah'] : ['delilah', 'julian']; c = []; let si = 0; for (let i = 0; i < 4; i++) c.push(i === p ? pr[0] : i === p + 1 ? pr[1] : sing[si++]); }
    if (E.squadCost(c) <= E.CFG.budget) cpu = c;
  }
  if (!cpu) cpu = ['wren', 'rarity', 'cray', 'neko'];
  if (o.opp) cpu = o.opp;
  loopId++; stopHint(); closeMenus(); removePlot(); $$('.flyer, .pod, .dragghost').forEach(x => x.remove());
  UI.flyer = null; UI.retreating = null; UI.sel = null; UI.pv = null; UI.resolveTurn = null; UI.plot = null; UI.plotted = null; UI.mode = 'busy';
  G = E.newGame(teamOf(), cpu, ctrl || ['human', 'cpu'], o.opp ? ['You', 'Friend'] : ['You', 'CPU']);
  if (o.opp && o.first === 1) G.turn = 1;
  $('#arrange').classList.remove('on'); $('#over').classList.remove('on'); closePanels();
  $('#cam').style.transform = 'none'; UI.camOn = false;
  buildBoard(); updateAll(); toast('Duel start. Slots 1 and 4 guard the agent beside them.');
  gameLoop(loopId);
}

function boot() {
  sizeCanvas(); requestAnimationFrame(frame);
  window.addEventListener('resize', () => { sizeCanvas(); fit(); if (UI.sel && UI.camOn && UI.mode === 'sel') camEl(cards[UI.sel.uid].slot); });
  if (window.ResizeObserver) new ResizeObserver(fit).observe($('#stage'));
  { const bk = $('#btnBack'); bk.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); if (UI.mode === 'plot' && UI.plot) { const c = cards[UI.plot.u.uid]; if (c) c.wrap.classList.remove('away'); backToSel(); } else if (UI.mode === 'sel') goIdle(); else backToSel(); });
    bk.addEventListener('pointerdown', e => e.stopPropagation());
    setInterval(() => { const on = ['plot', 'ally', 'target', 'slot'].includes(UI.mode) || (!!UI.sel && ['sel', 'abil', 'const', 'place'].includes(UI.mode)); if (bk.classList.contains('on') !== on) bk.classList.toggle('on', on); const lk = !!UI.sel && ['sel', 'abil', 'const', 'place'].includes(UI.mode), bd = $('#board'); if (bd.classList.contains('locked') !== lk) bd.classList.toggle('locked', lk); }, 120); }
  { const sk = $('#btnSkip'); let armT = 0; sk.addEventListener('pointerdown', e => e.stopPropagation());
    const reset = () => { clearTimeout(armT); armT = 0; sk.textContent = 'SKIP TURN'; sk.classList.remove('arm'); };
    sk.onclick = () => {
      if (!armT) { sfx('tick'); sk.textContent = 'SURE? TAP AGAIN'; sk.classList.add('arm'); armT = setTimeout(reset, 2200); return; }
      reset(); if (!(G && !G.over && G.turn === 0 && G.ctrl[0] === 'human' && ['idle', 'sel', 'abil', 'const'].includes(UI.mode))) return;
      closeMenus(); commit({ type: 'pass', skip: true });
    };
    setInterval(() => { const on = !!(G && !G.over && G.turn === 0 && G.ctrl[0] === 'human' && ['idle', 'sel', 'abil', 'const'].includes(UI.mode)); if (sk.hidden === on) { sk.hidden = !on; if (!on) reset(); } }, 200); }
  $('#btnOpt').onclick = () => { sfx('tick'); showOptions(); };
  $('#board').addEventListener('click', onBoardClick);
  $('#stage').addEventListener('click', e => { if (e.target.id === 'stage' || e.target.id === 'cam' || e.target.id === 'layer') onEmptyTap(); });
  $('#board').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cardwrap')) { e.preventDefault(); e.target.click(); } });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = $$('.ov.on').find(o => o.id !== 'arrange' && o.id !== 'over'); if (open) return open.classList.remove('on');
    if (['sel', 'abil', 'const', 'place', 'plot', 'ally', 'target', 'slot'].includes(UI.mode)) onEmptyTap();
  });
  E.setHooks({ fx: FX, askDefense: wrapDec(askDefense), askCounter: wrapDec(askCounter), askBrim: wrapDec(askBrim), askClashAtk: wrapDec(askClashAtk), askClashDef: wrapDec(askClashDef), remoteDec, onChange: updateAll, log: m => { $('#ticker').textContent = m; } });
  const h = location.hash;
  if (h === '#watch') startGame(['cpu', 'cpu']);
  else if (h === '#demo') startGame();
  else showArrange();
  window.__duel = { showArrange, askClashAtk, askClashDef, askDefense, E, UI, startGame, FX, showInspect, getG: () => G, setRoster: r => { roster = r; decks[activeDeck].order = r; }, cards, railEls };
}
boot();
})();
