/* AnomEx Duel: interface, effects and sound. Rules live in engine.js. */
(function () {
'use strict';
const E = window.Duel;
const { DEFS, STATS, SNAME, ROLE, CFG } = E;
/* lore codenames replace the role line on cards; the real role stays in the inspect view */
const CODE = { argo: 'The Sullen', jane: 'The Secretary', cathy: 'White Thread', wren: 'Artificer', edica: 'Hestia', ellie: 'The Ungracer', miera: 'Lilith', opal: 'Black Damsel', rarity: 'Urshanabi', echidna: 'Enkidu', julian: 'The Wreck', delilah: 'The Wreckess', wraith: 'Nocturna', cray: 'The Seisman', neko: 'The Feline', nessy: 'Vesp', tyrees: 'Calico', argithia: 'Lady Luck', frey: 'Bloometh', mason: 'The Spokesman' };
Object.keys(CODE).forEach(k => { if (DEFS[k]) { DEFS[k].realRole = DEFS[k].role; DEFS[k].role = CODE[k]; } });
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
const ROSTER_ALL = ['wren', 'argo', 'jane', 'rarity', 'cathy', 'edica', 'ellie', 'miera', 'opal', 'echidna', 'julian', 'delilah', 'wraith', 'cray', 'neko', 'nessy', 'tyrees', 'argithia', 'frey', 'mason', 'aimee', 'feri', 'marsh', 'griff'];
let roster = ROSTER_ALL.slice();
const DK = 'anomex-decks'; let decks = null, activeDeck = 0;
const fixOrder = o => {
  const seen = new Set(), arr = Array.isArray(o) ? o : [], out = [];
  for (let i = 0; i < 4; i++) { const k = arr[i]; if (k && ROSTER_ALL.includes(k) && !seen.has(k)) { seen.add(k); out.push(k); } else out.push(null); }
  arr.slice(4).forEach(k => { if (k && ROSTER_ALL.includes(k) && !seen.has(k)) { seen.add(k); out.push(k); } }); ROSTER_ALL.forEach(k => { if (!seen.has(k)) out.push(k); });
  return out;
};
const emptyOrder = () => [null, null, null, null].concat(ROSTER_ALL);
const saveDecks = () => { try { localStorage.setItem(DK, JSON.stringify({ active: activeDeck, decks })); } catch (e) {} };
(function loadDecks() {
  try { const d = JSON.parse(localStorage.getItem(DK) || 'null'); if (d && Array.isArray(d.decks) && d.decks.length) { decks = d.decks.slice(0, 5).map((x, i) => ({ name: String(x.name || 'Deck ' + (i + 1)).slice(0, 14), order: fixOrder(x.order) })); activeDeck = Math.min(Math.max(d.active | 0, 0), decks.length - 1); } } catch (e) {}
  if (!decks) { decks = [{ name: 'Deck 1', order: emptyOrder() }]; activeDeck = 0; }
  roster = decks[activeDeck].order;
})();
const teamOf = () => roster.slice(0, 4);
const cards = {}, railEls = [], snap = {};
const prefs = { hp: 0.6, half: false, clash: true, sfx: true, ai: 3, name: '', elo: 1000, games: 0, wins: 0 };
const AI_NAMES = ['', 'Super easy', 'Decently easy', 'Thinks', 'Thinks ahead', 'Tactician'];
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
      case 'msg': fm(ac, 880, 2, 0.5, 0.16, 0.05); fm(ac, 1320, 2, 0.4, 0.22, 0.05, 0.09); break;
      case 'msg2': fm(ac, 1100, 2, 0.4, 0.12, 0.025); break;
      case 'csend': osc(ac, 'sine', 520, 760, 0.07, 0.03, 0, 0.004); break;
      case 'copen': osc(ac, 'sine', 400, 640, 0.09, 0.03, 0, 0.004); break;
      case 'mstart': osc(ac, 'sine', 70, 55, 0.9, 0.35, 0, 0.004); nz(ac, 0.6, 0.12, 0, 0, 400, 5200); fm(ac, 330, 2.01, 1.2, 0.9, 0.05, 0.05); [660, 880, 1320].forEach((f, i) => fm(ac, f, 2, 0.4, 0.5, 0.04, 0.5 + i * 0.1)); break;
      case 'twinkle': fm(ac, 1760, 2, 0.5, 0.2, 0.045); fm(ac, 2640, 2, 0.4, 0.18, 0.03, 0.06); break;
      case 'die': osc(ac, 'sine', 110, 26, 0.7, 0.4, 0, 0.004); nz(ac, 0.5, 0.14, 0, 0, 1800, 180); fm(ac, 330, 1.5, 2, 0.45, 0.05); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => { fm(ac, f, 2, 0.5, 0.45, 0.07, i * 0.11); fm(ac, f * 2, 1, 0.2, 0.35, 0.025, i * 0.11); }); break;
      case 'victory':
        osc(ac, 'sine', 110, 1500, 0.85, 0.1, 0, 0.3); osc(ac, 'triangle', 220, 2200, 0.85, 0.04, 0, 0.4); nz(ac, 0.85, 0.13, 0, 0, 300, 7000);
        osc(ac, 'sine', 95, 30, 1.3, 0.5, 0.85, 0.004); nz(ac, 0.5, 0.2, 0, 0.85, 3000, 200); fm(ac, 1175, 2.76, 1.2, 1.2, 0.07, 0.86);
        [523, 659, 784, 1047, 1319].forEach((f, i) => { fm(ac, f, 2, 0.45, 1.7, 0.055, 0.87 + i * 0.045); fm(ac, f * 2, 1, 0.15, 1.2, 0.02, 0.87 + i * 0.045); });
        [1568, 2093, 2637, 3136, 2637, 3136, 4186].forEach((f, i) => fm(ac, f, 2, 0.3, 0.5, 0.03, 1.5 + i * 0.09)); break;
      case 'defeat': osc(ac, 'sine', 90, 38, 1.8, 0.4, 0, 0.01); [392, 330, 262, 196, 131].forEach((f, i) => fm(ac, f, 1.01, 0.8, 0.9, 0.06, 0.25 + i * 0.3)); nz(ac, 1.2, 0.08, 0.3, 0, 120, 900); break;
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
const parts = [], rings = [], arcs = [], cracks = [], streaks = [], lenses = [], waves = [], glows = [], bars = [], scans = [];
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
function ring(x, y, r, delay = 0, col = '255,255,255', w = 3, dur = 0.42, sides = 0) { rings.push({ x, y, r, life: -delay, max: dur, col, w, sides, rot: rnd(0, TAU) }); }
function arc(x1, y1, x2, y2, life = 0.3, jit = 12, seg = 8, pal) { if (arcs.length > 60) return; arcs.push({ x1, y1, x2, y2, life: 0, max: life, jit, seg, pts: null, t: 99, pal }); }
function twinkles(x, y, n, spread, cols, o = {}) { n = Math.max(1, Math.round(n * QF)); if (parts.length > 900) return; for (let i = 0; i < n; i++) { const a = rnd(0, TAU), d = rnd(0, spread), sp = rnd(10, 60) * (o.speed || 1); parts.push({ k: 'tw', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp + (o.rise ? -rnd(20, 70) : 0), life: 0, max: rnd(0.4, 0.95) * (o.life || 1), w: rnd(2, 5.5) * (o.size || 1), c: pickOne(cols) }); } }
function shockLines(x, y, n, d0, len, spd, col) { n = Math.max(4, Math.round(n * QF)); for (let i = 0; i < n; i++) parts.push({ k: 'l', x, y, a: (i / n) * TAU + rnd(-0.1, 0.1), d: d0 * rnd(0.8, 1.2), v: spd * rnd(0.7, 1.3), len: len * rnd(0.6, 1.4), life: 0, max: rnd(0.2, 0.36), c: col || '#ffffff' }); }
function chevrons(x, y, n, spread, col, up) { n = Math.max(2, Math.round(n * QF)); for (let i = 0; i < n; i++) parts.push({ k: 'v', x: x + rnd(-spread, spread), y: y - rnd(0, spread * 0.6), vy: rnd(70, 160) * (up ? -1 : 1), life: -rnd(0, 0.25), max: rnd(0.5, 0.8), w: rnd(4, 8), c: col }); }
function lens(x, y, r, delay = 0, dur = 0.7, tint = '255,90,40') { if (lenses.length > 8) return; lenses.push({ x, y, r, life: -delay, max: dur, tint, rot: rnd(0, TAU) }); }
function field(x, y, rx, ry, delay = 0, dur = 0.9, col = '255,110,40') { if (waves.length > 14) return; waves.push({ x, y, rx, ry, life: -delay, max: dur, col }); }
function glow(x, y, r, dur = 0.35, col = '255,140,50', delay = 0) { glows.push({ x, y, r, life: -delay, max: dur, col }); }
const GLY = '01ABCDEF7#<>/=+';
function glyphs(x, y, n, spread, cols, o = {}) {
  if (RM) return; n = Math.max(1, Math.round(n * QF)); if (parts.length > 900) return;
  for (let i = 0; i < n; i++) parts.push({ k: 'g', x: x + rnd(-spread, spread), y: y + rnd(-spread * 0.5, spread * 0.7), vx: rnd(-12, 12), vy: o.down ? rnd(50, 130) : -rnd(40, 140), life: -rnd(0, o.delay == null ? 0.3 : o.delay), max: rnd(0.6, 1.1), w: rnd(9, 14) * S() * (o.size || 1), c: pickOne(cols), ch: GLY[(Math.random() * GLY.length) | 0] });
}
function glitch(x, y, w, h, n = 6, col = '255,90,31') {
  if (RM || bars.length > 50) return; n = Math.max(2, Math.round(n * QF));
  for (let i = 0; i < n; i++) bars.push({ x: x - w / 2 + rnd(-0.08, 0.08) * w, y: y - h / 2 + rnd(0, h), w: w * rnd(0.35, 1.05), h: rnd(2, 7) * Math.max(0.8, S() * 0.8), dx: rnd(-16, 16) * S(), life: -rnd(0, 0.14), max: rnd(0.12, 0.3), col: i % 3 === 0 ? '255,255,255' : col });
}
function scan(x, y, w, h, dir = -1, col = '255,255,255', dur = 0.5) { if (RM || scans.length > 6) return; scans.push({ x, y, w, h, dir, col, life: 0, max: dur }); }
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
  const busy = parts.length || rings.length || arcs.length || cracks.length || streaks.length || lenses.length || waves.length || glows.length || bars.length || scans.length;
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
    const t = r.life / r.max, rr = r.r * (0.2 + 0.8 * (1 - Math.pow(1 - t, 2))); cx.beginPath();
    if (r.sides) { for (let j = 0; j <= r.sides; j++) { const an = r.rot + (j / r.sides) * TAU; j ? cx.lineTo(r.x + Math.cos(an) * rr, r.y + Math.sin(an) * rr) : cx.moveTo(r.x + Math.cos(an) * rr, r.y + Math.sin(an) * rr); } } else cx.arc(r.x, r.y, rr, 0, TAU);
    cx.strokeStyle = `rgba(${r.col},${1 - t})`; cx.lineWidth = r.w * (1 - t) + 0.5; cx.stroke();
  }
  for (let i = scans.length - 1; i >= 0; i--) {
    const sc = scans[i]; sc.life += dt; if (sc.life > sc.max) { scans.splice(i, 1); continue; }
    const t = sc.life / sc.max, top = sc.y - sc.h / 2, yy = sc.dir < 0 ? top + sc.h * (1 - t) : top + sc.h * t, tl = sc.h * 0.38, fade = 1 - t * 0.5;
    const y0 = sc.dir < 0 ? yy : Math.max(top, yy - tl), y1 = sc.dir < 0 ? Math.min(top + sc.h, yy + tl) : yy;
    if (y1 > y0) { const g = cx.createLinearGradient(0, sc.dir < 0 ? yy : yy, 0, sc.dir < 0 ? yy + tl : yy - tl); g.addColorStop(0, `rgba(${sc.col},${0.42 * fade})`); g.addColorStop(1, `rgba(${sc.col},0)`); cx.fillStyle = g; cx.fillRect(sc.x - sc.w / 2, y0, sc.w, y1 - y0); }
    cx.fillStyle = `rgba(${sc.col},${0.95 * fade})`; cx.fillRect(sc.x - sc.w / 2 - 4, yy - 1, sc.w + 8, 2);
  }
  for (let i = bars.length - 1; i >= 0; i--) {
    const b = bars[i]; b.life += dt; if (b.life < 0) continue; if (b.life > b.max) { bars.splice(i, 1); continue; }
    const t = b.life / b.max; cx.fillStyle = `rgba(${b.col},${(1 - t) * (0.55 + Math.random() * 0.4)})`; cx.fillRect(b.x + b.dx * (1 - t), b.y, b.w, b.h);
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
      if (p.life < 0) continue; p.y += p.vy * dt; const f = p.vy < 0 ? -1 : 1; cx.globalAlpha = (1 - t) * 0.9; cx.strokeStyle = p.c; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(p.x - p.w, p.y - p.w * 0.6 * f); cx.lineTo(p.x, p.y); cx.lineTo(p.x + p.w, p.y - p.w * 0.6 * f); cx.stroke(); cx.globalAlpha = 1;
    } else if (p.k === 'g') {
      if (p.life < 0) continue; p.x += p.vx * dt; p.y += p.vy * dt; if (Math.random() < 0.14) p.ch = GLY[(Math.random() * GLY.length) | 0];
      cx.globalAlpha = Math.min(1, Math.sin(t * Math.PI) * 1.6); cx.fillStyle = p.c; cx.font = '700 ' + p.w.toFixed(0) + 'px ui-monospace,Menlo,Consolas,monospace'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(p.ch, p.x, p.y); cx.globalAlpha = 1;
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
  if (level >= 2) { ring(x, y, 60 * s, 0, '212,32,43', 3, 0.45, 6); glow(x, y, 70 * s, 0.3, '255,70,30'); glyphs(x, y, 5, R, COL_DATA); }
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
    <div class="icon"><img src="icons/${u.key}.png" alt="" draggable="false"></div><div class="tags"></div><div class="actb" hidden></div><div class="trkb" hidden></div><div class="eyeb" hidden><svg viewBox="0 0 16 14" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path class="open" d="M1 7C4 1.5 12 1.5 15 7C12 12.5 4 12.5 1 7Z"/><circle class="iris" cx="8" cy="7" r="2.7" fill="#fff" stroke="none"/><path class="shut" d="M1 6C4 11.5 12 11.5 15 6M4.5 9.6L3.3 12M8 10.6V13M11.5 9.6L12.7 12"/></svg></div><div class="momb" hidden></div><div class="rest"></div>
    ${STATS.map(k => `<button type="button" class="notch n-${k.toLowerCase()}" data-k="${k}" tabindex="-1" aria-label="${SNAME[k]}"><img src="${ICO[k]}" alt="" draggable="false"><i class="lg"></i><i class="val"></i><i class="pv"></i></button>`).join('')}
    <div class="info"><div class="irow"><b class="nm"${(d.short || d.name).length > 6 ? ' data-l="' + (d.short || d.name).length + '"' : ''}>${d.short || d.name}</b><span class="hpn"></span></div><div class="role">${d.role}</div><div class="hp"><b class="tr"></b><i></i></div></div></div>${STATS.map(k => `<i class="na na-${k.toLowerCase()}" data-k="${k}"></i>`).join('')}`;
  paint(w, u);
  return w;
}
const viewVal = (u, k) => (UI.pv && UI.pv.u === u) ? UI.pv.v[k] : u.cur[k];
const hid = u => !!(CFG.hideStats && G && !G.over && !u.pseudo && u.side === 1 && G.ctrl[0] === 'human' && !(G.seen && G.seen[0].includes(u.uid)));
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
  { const tb = w.querySelector('.trkb'), mb = w.querySelector('.momb'), fe = u.key === 'feri' && !!u.track && !!E.TRACKS[u.track];
    if (tb && mb) { tb.hidden = mb.hidden = !fe; if (fe) { tb.textContent = ({ might: 'MIGHT', accel: 'ACCEL', mind: 'MIND' })[u.track]; mb.textContent = '\u25CF'.repeat(u.mom | 0) + '\u25CB'.repeat(3 - (u.mom | 0)); mb.dataset.m = u.mom | 0; } } }
  { const eb = w.querySelector('.eyeb'); if (eb) { eb.hidden = u.key !== 'aimee' || !u.alive; eb.classList.toggle('closed', E.isCloaked(u)); } }
  { const ab = w.querySelector('.actb'); if (ab) { ab.hidden = !u.act; ab.textContent = ['', 'I', 'II', 'III'][u.act || 0]; ab.dataset.a = u.act || 0; } }
  w.classList.toggle('au-red', u.alive && !u.pseudo && (u.cur.STR > u.max.STR || u.ua));
  w.classList.toggle('au-dep', u.alive && (u.dep > 0 || u.chg > 0));
  w.classList.toggle('au-hard', u.alive && u.harden > 0);
  w.classList.toggle('au-coat', u.alive && !!u.coat);
  w.classList.toggle('cloaked', E.isCloaked(u));
  w.classList.toggle('au-rdy', u.alive && !!(u.mchg || u.gs || u.bash || u.bd || u.succ || u.fp || u.makeup || u.manip || u.lost || u.stat || u.sharp || u.ds || u.blend || u.wing || u.rookie || u.coll > 0 || u.imp > 0 || ((u.baton || u.glob) && !(real0(u)))));
  card.classList.toggle('resting', u.alive && (u.rest > 0 || u.nap));
  const rt = u.rest > 0 ? 'REST<br>' + u.rest : (u.nap ? 'NAP<br>zzZ' : ''); if (w._rt !== rt) { w._rt = rt; R.rest.innerHTML = rt; }
  const pct = u.hp / u.maxhp * 100, hk = u.hp + '/' + u.maxhp;
  if (w._hk !== hk) { w._hk = hk; const ws = pct + '%'; R.hpi.style.width = ws; R.hptr.style.width = ws; R.hp.style.setProperty('--n', u.maxhp); R.hpn.innerHTML = u.hp + '<small>/' + u.maxhp + '</small>'; }
  R.hp.classList.toggle('low', pct <= 30 && u.alive);
  const real = !u.pseudo && G;
  STATS.forEach(k => {
    const n = R.n[k], v = viewVal(u, k), hd = hid(u), vt = hd ? '?' : (v === u.max[k] ? mxs(u, k, v) : v + '/' + mxs(u, k, u.max[k]));
    if (R.v[k]._t !== vt) { R.v[k]._t = vt; R.v[k].textContent = vt; }
    n.classList.toggle('zero', !hd && v <= 0); n.classList.toggle('up', !hd && v > u.max[k]);
    n.classList.toggle('dbf', !!(real && G.debuffs.some(d => d.target === u && d.amt[k])));
  });
  const fl = [];
  if (u.mark) fl.push('<span class="neg">MARKED</span>');
  if (u.makeup) fl.push('<span>MAKEUP</span>');
  if (u.fp) fl.push('<span>PERFECT</span>');
  if (u.dep > 0) fl.push('<span>DEPULSION</span>'); if (u.harden > 0) fl.push('<span>HARDEN</span>'); if (u.bd) fl.push('<span>BEATDOWN</span>'); if (u.bash) fl.push('<span>BASH</span>'); if (u.ua) fl.push('<span>UNSTABLE</span>'); if (u.succ) fl.push('<span>' + (u.taught ? 'TAUGHT' : 'SUCCESSOR') + '</span>');
  if (u.chg > 0) fl.push('<span>CHARGE ' + u.chg + '/3</span>'); if (u.manip) fl.push('<span>MANIPULATOR</span>'); if (u.boost > 0) fl.push('<span>+3 STR</span>');
  if (u.coat) fl.push('<span class="neg">COATED</span>'); if (u.bud) fl.push('<span class="neg">BUDDED</span>'); if (u.lost) fl.push('<span>LOST</span>'); if (u.stat) fl.push('<span>STATIONARY</span>'); if (u.sharp) fl.push('<span>CLAWS</span>'); if (u.ds) fl.push('<span>DOUBLE</span>');
  if (u.hm > 0 && !(real && G.ctrl[1 - u.side] === 'human')) fl.push("<span>HE'S MINE</span>");
  if (u.dc > 0) fl.push('<span>DEPU-COUNTER</span>'); if (u.imp > 0) fl.push('<span>IMPRESSION</span>'); if (u.blend) fl.push('<span>BLENDER</span>'); if (u.shard) fl.push('<span class="neg">SHARDS ' + u.shard.n + '</span>');
  if (u.wing) fl.push('<span>WINGWOMAN</span>'); if (u.rookie) fl.push('<span>ROOKIE</span>'); if (u.coll > 0) fl.push('<span>COLLATERAL</span>'); if (u.frz && u.rest > 0) fl.push('<span class="neg">FROZEN</span>'); if (u.noDodge > 0) fl.push('<span class="neg">NO DODGE</span>');
  if (u.baton && !(real && G.ctrl[1 - u.side] === 'human')) fl.push('<span>BATON</span>'); if (u.glob && !(real && G.ctrl[1 - u.side] === 'human')) fl.push('<span>GLOB</span>');
  { const hideFromFoe = real && G.ctrl[1 - u.side] === 'human';
    if (u.fzw) fl.push('<span class="neg">FROZEN: ' + u.fzw + ' AGI</span>');
    if (u.abs && !hideFromFoe) fl.push('<span>ABSORB ' + E.SLETTER[u.abs.stat] + '</span>');
    if (u.mchg) fl.push('<span>CHARGE</span>');
    if (u.charged) fl.push('<span class="neg">CHARGED</span>');
    if (u.pull) fl.push('<span class="neg">PULLED &rarr; ' + (u.pull.slot + 1) + '</span>');
    if (u.gs && !hideFromFoe) fl.push('<span>' + (u.gs === 'baton' ? 'BATON' : 'KNIFE') + '</span>');
    if (u.bleed > 0) fl.push('<span class="neg">BLEED ' + u.bleed + '</span>'); }
  if (real && G.debuffs.some(d => d.target === u)) fl.push('<span class="neg">DEBUFF</span>');
  const tg = fl.join(''); if (w._tg !== tg) { w._tg = tg; R.tags.innerHTML = tg; }
  const al = `${u.name}, ${u.hp} of ${u.maxhp} HP${u.alive ? '' : ', down'}${u.rest > 0 ? ', resting' : ''}. ${hid(u) ? ' Stats hidden until analysed.' : ' Strength ' + u.cur.STR + ', Agility ' + u.cur.AGI + ', Brains ' + u.cur.BRN + ', DATA ' + u.cur.DATA + '.'}`;
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
function notchAt(w, e, k) {
  let best = null, bd = 1e9;
  $$('.na', w).forEach(a => { const q = a.getBoundingClientRect(), rad = q.width / 2, d = Math.hypot(e.clientX - (q.left + q.width / 2), e.clientY - (q.top + q.height / 2)) / rad; if (d < bd) { bd = d; best = a; } });
  return best && bd < k ? $('.n-' + best.dataset.k.toLowerCase(), w) : null;
}
function notchHover(w, e) {
  if (w.classList.contains('dead')) return;
  let nn = notchAt(w, e, 1.15); if (!nn && hovN && w.contains(hovN)) { const h = notchAt(w, e, 1.5); if (h === hovN) nn = h; }
  if (nn !== hovN) { if (hovN) hovN.classList.remove('hov'); if (nn) nn.classList.add('hov'); hovN = nn; }
}
function nearestNotch(w, e, k) { return notchAt(w, e, k); }
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
  const r = w.getBoundingClientRect(); notchHover(w, e);
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
  else if (act.type === 'recover') { notchPop(u, 'AGI', '-1', 'dbf'); notchPop(u, act.stat, '+1', 'buf'); }
  else if (act.type === 'mark') notchPop(u, 'BRN', '-1', 'dbf');
  else if (act.type === 'analyse') notchPop(u, 'BRN', '-' + (act.X || 1), 'dbf');
  else if (act.type === 'cure') notchPop(u, 'BRN', '-2', 'dbf');
  else if (act.type === 'wake') notchPop(u, 'AGI', '-' + u.rest, 'dbf');
  else if (act.type === 'move') notchPop(u, 'AGI', '-' + Math.abs(u.slot - act.to), 'dbf');
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
    if (!E.alive(0).some(u => u.rest === 0) && !(TUT && TUT.noPass)) { UI.mode = 'busy'; hintSet('No agent is ready', 'Everyone is resting, so the turn passes.'); setTimeout(() => commit({ type: 'pass' }), 1400); return; }
    goIdle();
  });
}
function goIdle() {
  UI.allyFn = null;
  closeMenus(); stopHint(); removePlot(); clearMarks(); camReset();
  const prev = UI.sel; UI.sel = null; UI.pv = null; UI.mode = 'idle';
  $$('.notch').forEach(n => { n.classList.remove('lit'); n.tabIndex = -1; });
  if (prev && cards[prev.uid]) paint(cards[prev.uid].wrap, prev);
  setTray(); syncBack(); hintSet('Your move', 'Tap an agent to pick it. It gets +1 STR, AGI and DATA (not Brains), then acts once.');
}
function backToSel() {
  UI.allyFn = null; UI.allySelf = false; $$('.statpick').forEach(x => x.remove());
  const u = UI.sel; if (!u) return goIdle();
  closeMenus(); stopHint(); removePlot(); railEls.forEach(r => r.classList.remove('pick', 'hot')); $$('.cardwrap').forEach(w => w.classList.remove('tgt'));
  UI.mode = 'sel'; setTray(); camEl(cards[u.uid].slot); lightNotches(u); selHint(u);
}
function selHint(u) {
  if (u.rest > 0) return hintSet(u.name + ' is resting', `${u.rest} more turn${u.rest > 1 ? 's' : ''}. It can't act, defend or dodge.` + (E.canWake(u).ok ? ` Tap Agility to wake it for ${u.rest} AGI (uses your turn).` : '') + ' Tap empty space to go back.');
  hintSet(u.name, 'Drag the card to the Action Rail to attack, or tap a lit stat. Tap empty space to cancel.');
}
function selectAgent(u) {
  if (!['idle', 'sel', 'abil', 'const', 'place'].includes(UI.mode)) return;
  closeMenus(); stopHint(); removePlot(); clearMarks(); setTray(); $$('.notch').forEach(n => { n.classList.remove('lit'); n.tabIndex = -1; });
  const prev = UI.sel; UI.sel = u; UI.mode = 'sel';
  if (prev && prev !== u && cards[prev.uid]) { UI.pv = null; paint(cards[prev.uid].wrap, prev); }
  const w = cards[u.uid].wrap; w.classList.add('sel'); $$('.notch', w).forEach(n => { n.tabIndex = 0; });
  camEl(cards[u.uid].slot); sfx('tick'); selHint(u);
  if (u.rest > 0) { UI.pv = null; paint(w, u); lightNotches(u); return; }
  const v = {}; STATS.forEach(k => { v[k] = E.proj(u, k); });
  setTimeout(() => {
    if (UI.sel !== u) return;
    UI.pv = { u, v }; UI.previewed = u.uid; paint(w, u);
    STATS.forEach((k, i) => { if (v[k] > u.cur[k]) setTimeout(() => { if (UI.sel === u) notchPop(u, k, '+' + (v[k] - u.cur[k]), 'buf'); }, i * 90); });
    setTimeout(() => { if (UI.sel === u && UI.mode === 'sel') lightNotches(u); }, 560);
  }, 360);
}
function lightNotches(u) {
  const w = cards[u.uid].wrap; if (u.rest > 0) { STATS.forEach(k => $('.n-' + k.toLowerCase(), w).classList.toggle('lit', k === 'AGI' && E.canWake(u).ok)); return; }
  const lit = { STR: E.canAttack(u).ok, DATA: DEFS[u.key].abilities.some(x => E.abilityState(u, x.id).ok), BRN: E.canTransfer(u).ok || E.canMark(u).ok || E.canAnalyse(u).ok || E.canCure(u).ok, AGI: E.canRecover(u).ok || E.moveOptions(u).length > 0 };
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
['gesturestart', 'gesturechange', 'gestureend'].forEach(n => document.addEventListener(n, e => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('pointerdown', e => { const w = e.target.closest && e.target.closest('#board .cardwrap:not(.clone)'); downCard = w ? { w, x: e.clientX, y: e.clientY, t: performance.now(), n: w.classList.contains('dead') ? null : notchAt(w, e, 1.3) } : null; }, true);
function onBoardClick(e) {
  if (suppressClick) return;
  if (e.target.closest('.pod, .statpick')) return;
  if (UI.mode === 'abil' && !e.target.closest('.abil')) { /* taps that land on or just beside the ability list never fall through to the agent next door */
    const bx = $('.ablist'); if (bx) { const r = bx.getBoundingClientRect(), m = 10; if (e.clientX >= r.left - m && e.clientX <= r.right + m && e.clientY >= r.top - m && e.clientY <= r.bottom + m) return; }
    if (performance.now() - (UI.abilT || 0) < 650) return;
  }
  let w = e.target.closest('.cardwrap:not(.clone)'), dn = null;
  if (downCard && performance.now() - downCard.t < 900 && Math.hypot(e.clientX - downCard.x, e.clientY - downCard.y) < 16 && !e.target.closest('.rs')) { if (downCard.w !== w) w = downCard.w; dn = downCard.n; }
  if (w && cards[w.dataset.uid]) { let n = (dn && w.contains(dn) ? dn : null) || (hovN && w.contains(hovN) ? hovN : null) || notchAt(w, e, 1.3);
    if (!n && ((cards[w.dataset.uid].unit === UI.sel && ['sel', 'abil', 'const'].includes(UI.mode)) || (UI.mode === 'defend' && UI.def && cards[w.dataset.uid].unit === UI.def.t))) n = notchAt(w, e, 3.2); /* a tap near a corner counts as that notch, not as an inspect */ return onCardTap(cards[w.dataset.uid].unit, n && n.dataset.k, e); }
  const rs = e.target.closest('.rs'); if (rs) return onRailTap(+rs.dataset.slot);
  onEmptyTap();
}
function onEmptyTap() {
  if (UI.mode === 'sel') goIdle();
  else if (UI.mode === 'plot' || UI.mode === 'bid') return; /* only the Back button leaves the number picker */
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
    case 'plot': case 'retort': case 'bid': return;
    case 'defend': if (UI.def && u === UI.def.t && k) return UI.def.pick(k); if (UI.def && u === UI.def.t) return; return;
    default: if (!['boot', 'arrange'].includes(UI.mode)) showInspect(u);
  }
}
function onRailTap(slot) {
  if (UI.mode === 'target') { const u = G.sides[1][slot]; if (u && u.alive) return targetPicked(u); }
  else if (UI.mode === 'place') { const t = G.sides[1][slot]; if (t && t.alive) return placeOnRail(UI.sel, slot, UI.sel.fp ? 'fp' : 'str'); toast('No enemy in that column.'); }
  else if (UI.mode === 'slot') return UI.slotFn(slot);
}
function flowMove(u) {
  const opts = E.moveOptions(u);
  if (!opts.length) { sfx('tick'); return toast(E.alive(0).length === 4 ? 'Nowhere to move yet. A slot opens up when one of your agents falls.' : 'No empty slot in reach. Moving costs 1 Agility per slot.'); }
  UI.mode = 'slot'; closeMenus(); camReset(); railEls.forEach((r, i) => r.classList.toggle('pick', opts.some(o => o.slot === i)));
  UI.slotFn = s => { const o = opts.find(x => x.slot === s); if (!o) { sfx('tick'); return toast('Tap a lit slot, where an agent has fallen.'); } commit({ type: 'move', agent: u, to: s }); };
  hintSet('Move ' + u.name, 'Tap a lit slot to move there: ' + opts.map(o => 'slot ' + (o.slot + 1) + ' = ' + o.cost + ' Agility').join(', ') + '. It uses your turn.');
}
function notchAct(u, k) {
  if (k === 'AGI') {
    if (u.rest > 0) { const c = E.canWake(u); if (!c.ok) { sfx('tick'); return toast(u.name + ' is resting (' + u.rest + ' more). Waking needs ' + u.rest + ' Agility' + (c.reason === 'cannot be woken' ? ', but this one cannot be woken.' : '.')); } return commit({ type: 'wake', agent: u }); }
    if (UI.mode === 'slot') return backToSel();
    return UI.mode === 'const' && UI.constKind === 'agi' ? backToSel() : openConst(u, 'agi');
  }
  if (u.rest > 0) return toast(u.name + ' is resting.');
  if (k === 'STR') { const c = E.canAttack(u); if (!c.ok) return toast('Strength: ' + c.reason + '.'); return startPlace(u); }
  if (k === 'DATA') { return UI.mode === 'abil' ? backToSel() : openAbil(u); }
  if (k === 'BRN') { return UI.mode === 'const' && UI.constKind === 'brn' ? backToSel() : openConst(u, 'brn'); }
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
  E.hittable(0).forEach(t => railEls[t.slot].classList.add('pick'));
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
  else if (kind === 'barr') { mx = Math.max(1, Math.min(5, Math.floor(E.proj(u, 'DATA')), Math.floor(E.proj(u, 'AGI')))); X = Math.min(mx, 3); }
  else if (kind === 'heal') { mx = Math.max(1, Math.min(E.proj(u, 'DATA'), u.maxhp - u.hp)); X = Math.min(mx, 3); }
  else { mx = X = CFG.fpDamage; }
  if (TUT && TUT.cap) { mx = Math.min(mx, TUT.cap); X = mx; }
  UI.mode = 'plot'; UI.plot = { u, idx, t, kind, X, t2: null };
  rs.classList.add('hot');
  let xb = el('div', 'xb', X);
  if (kind !== 'heal' && kind !== 'proj' && kind !== 'vesp') { cards[u.uid].wrap.classList.add('away'); const clone = cloneCard(u); clone.classList.add('onrail'); rs.appendChild(clone); $('.card', clone).appendChild(xb); }
  const pod = el('div', 'pod' + (kind === 'proj' || kind === 'vesp' || kind === 'heal' ? ' data' : ''));
  pod.innerHTML = `<div class="ptop"><div class="pinfo"></div></div>
    ${kind === 'fp' ? '' : '<div class="prow"><button type="button" class="pbtn" data-d="-1" aria-label="Less"><i>-</i></button><span class="pnum" aria-live="polite"></span><button type="button" class="pbtn" data-d="1" aria-label="More"><i>+</i></button></div>'}
    <button type="button" class="pgo">${kind === 'barr' ? 'Barrage' : kind === 'proj' || kind === 'vesp' ? 'Fire' : kind === 'heal' ? 'Heal' : 'Strike'}</button>`;
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
    else if (kind === 'barr') $('.pinfo', pod).textContent = `${X} hits = ${2 * X} dmg  |  -${X} DATA, -${X} AGI  |  dodge ${X}  |  rest ${X}`;
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
    else if (kind === 'proj' || kind === 'vesp' || kind === 'barr') commit({ type: 'ability', agent: u, id: kind, target: t, X: P.X });
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
  cu: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="none"/><path d="M12 10v4M10 12h4" fill="none"/>', tr: '<path d="M4 8h14m-4-4l4 4-4 4M20 16H6m4-4l-4 4 4 4" fill="none"/>', an: '<circle cx="10" cy="10" r="6" fill="none"/><path d="M15 15l6 6" fill="none"/>', mk: '<circle cx="12" cy="12" r="7" fill="none"/><path d="M12 2v6m0 8v6M2 12h6m8 0h6" fill="none"/>', mv: '<path d="M3 12h16m-5-6l6 6-6 6" fill="none"/>',
  dep: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" fill="none"/><path d="M8 12h8" fill="none"/>', bd: '<path d="M5 5l6 7-6 7M13 5l6 7-6 7" fill="none"/>',
  bash: '<path d="M4 20L16 8M13 5l6 6-3 3-6-6z" fill="none"/>', ua: '<path d="M12 2l10 18H2z" fill="none"/><path d="M12 9v5M12 17v.5" fill="none"/>',
  bb: '<circle cx="8" cy="9" r="3.5"/><circle cx="16" cy="9" r="3.5"/><path d="M2 20c1-4 4-6 6-6s5 2 6 6M10 20c1-4 4-6 6-6s5 2 6 6" fill="none"/>', harden: '<rect x="5" y="5" width="14" height="14" rx="2" fill="none"/><path d="M9 12l2 2 4-4" fill="none"/>',
  teacher: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5" fill="none"/>', rarium: '<circle cx="12" cy="12" r="9" fill="none"/><path d="M12 7v5l3 2" fill="none"/>', ook: '<circle cx="12" cy="12" r="2.5"/><path d="M12 3a9 9 0 1 1-9 9" fill="none"/><path d="M12 7a5 5 0 1 1-5 5" fill="none"/>', enki: '<path d="M12 21C5 15 3 11 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 7-9 13z" fill="none"/><path d="M12 9v6M9 12h6" fill="none"/>', lamb: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7" fill="none"/>', panic: '<path d="M3 12h4l2-6 4 12 2-6h6" fill="none"/>', manip: '<path d="M4 8h12m-4-4l4 4-4 4M20 16H8m4-4l-4 4 4 4" fill="none"/>', hm: '<path d="M12 20s-7-5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 10-7 10z" fill="none"/><path d="M5 5l14 14" fill="none"/>',
  atom: '<circle cx="12" cy="12" r="2"/><circle cx="6" cy="7" r="1.6"/><circle cx="18" cy="8" r="1.6"/><circle cx="15" cy="18" r="1.6"/><circle cx="7" cy="17" r="1.6"/>', disch: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>', jump: '<circle cx="12" cy="12" r="9" fill="none"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M8 16c2-2 6-2 8 0" fill="none"/>', lost: '<rect x="4" y="9" width="16" height="6" fill="none"/><path d="M8 9v6M12 9v6M16 9v6" fill="none"/>', stat: '<path d="M12 21v-8M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 13c4 0 6-3 6-7-4 0-6 3-6 7z" fill="none"/>', catnap: '<path d="M5 6h6l-6 6h6M13 14h5l-5 5h5" fill="none"/>', sharp: '<path d="M4 4l5 14M10 3l4 15M16 4l4 12" fill="none"/>', ds: '<path d="M4 6l8 6-8 6M12 6l8 6-8 6" fill="none"/>', vesp: '<path d="M3 12h10m-4-5l5 5-5 5M17 6l4 6-4 6" fill="none"/>',
  dcount: '<path d="M4 12a8 8 0 0114 -5.5M20 12a8 8 0 01-14 5.5" fill="none"/><path d="M18 3v4h-4M6 21v-4h4" fill="none"/>', baton: '<path d="M5 19L19 5" fill="none" stroke-width="3"/><circle cx="19" cy="5" r="2"/>',
  impr: '<circle cx="12" cy="12" r="8" fill="none"/><path d="M8 12h8M12 8v8" fill="none"/>', blend: '<path d="M12 2l3 7-3 13-3-13z"/><path d="M4 8l5 2M20 8l-5 2" fill="none"/>',
  fglob: '<circle cx="12" cy="13" r="6"/><path d="M12 2c2 3 3 4 3 6" fill="none"/>', wing: '<path d="M3 17c4-1 7-4 9-10 2 6 5 9 9 10-4 1-7 0-9-3-2 3-5 4-9 3z" fill="none"/>',
  rookie: '<path d="M12 4l7 6-7 6-7-6z" fill="none"/><path d="M12 16v5" fill="none"/>', coll: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" fill="none"/><path d="M12 8v6M9 11h6" fill="none"/>',
  barr: '<path d="M3 7h10M3 12h14M3 17h10M17 5l4 7-4 7" fill="none"/>', ach: '<path d="M8 3l3 8-3 10M16 3l-3 8 3 10" fill="none"/><path d="M6 21h12" fill="none"/>', play: '<path d="M9 18V6l10-2v12" fill="none"/><circle cx="7" cy="18" r="2.5"/><circle cx="17" cy="16" r="2.5"/>', sb: '<path d="M3 12h4M10 6l4 6-4 6M16 3l5 9-5 9" fill="none"/>',
  absb: '<circle cx="12" cy="12" r="8" fill="none"/><path d="M12 7v10M7 12h10" fill="none"/>', mchg: '<path d="M7 12h10M12 7v10" fill="none"/><circle cx="12" cy="12" r="9" fill="none"/>', redir: '<path d="M4 6h9a4 4 0 014 4v8m0 0l-3-3m3 3l3-3" fill="none"/>', gbat: '<path d="M5 19L17 7m0 0h-4m4 0v4" fill="none"/><path d="M4 20l3-3" fill="none"/>', gknife: '<path d="M5 20L18 4l1 9-9 8z" fill="none"/>',
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
    const ab = E.abilityView(u, ab0), st = E.abilityState(u, ab.id), needs = ab.target === 'none' && ab.id !== 'enki' && ab.id !== 'absb' && ab.id !== 'play';
    const cost = ab.cost === 'X' ? 'X DATA' : (ab.id === 'fp' ? 'ALL DATA' : ab.cost === 0 ? 'FREE' : ab.cost + ' DATA');
    const b = el('button', 'abil', `<span class="ai">${svgIcon(ab.id)}</span><span class="t2"><b>${ab.name}</b><span class="cost">${cost}</span></span><small>${st.ok ? (ab.short || ab.text) : st.reason + '.'}</small><em class="arm">TAP AGAIN TO USE</em>`);
    b.style.setProperty('--i', i); b.type = 'button'; b.disabled = !st.ok; b.setAttribute('role', 'menuitem');
    b.addEventListener('click', e => {
      e.stopPropagation(); sfx('tick');
      if (ab.id === 'play') return trackMenu(u, box, b);
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
function trackMenu(u, box, btn) {
  const slot = box.parentElement, side = box.classList.contains('r') ? 'r' : 'l', pan = f => camEl(slot, { panX: side === 'r' ? f : 1 - f, sc: 1.3, free: true, rx: 9, cy: 0.42 });
  const old = $('.trksub', box); if (old) { old.remove(); btn.classList.remove('opn'); pan(0.26); return; }
  const sub = el('div', 'trksub'); sub.setAttribute('role', 'menu');
  Object.keys(E.TRACKS).forEach(key => {
    const T = E.TRACKS[key], on = u.track === key;
    const b = el('button', 'trk' + (on ? ' on' : ''), `<b>${T.n}</b><small>${on ? 'playing' : '+2 ' + T.k}</small>`); b.type = 'button'; b.disabled = on; b.setAttribute('role', 'menuitem');
    b.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); commit({ type: 'playlist', agent: u, to: key }); });
    sub.appendChild(b);
  });
  sub.addEventListener('click', e => e.stopPropagation()); sub.addEventListener('pointerdown', e => e.stopPropagation());
  sub.style.top = btn.offsetTop + 'px'; sub.style.minHeight = btn.offsetHeight + 'px';
  box.appendChild(sub); btn.classList.add('opn');
  if (!box.classList.contains('sheet')) pan(0.15);
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
    if (ab.id === 'absb') return flowStatPick(u, 'Absorb', 'Pick the stat that stores the damage.', k => commit({ type: 'ability', agent: u, id: 'absb', stat: k }));
    if (ab.id === 'play') return commit({ type: 'playlist', agent: u });
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
    UI.targetFn = t => { if (!okT.includes(t)) return toast(t.name + ' cannot be targeted.'); if (ab.id === 'proj' || ab.id === 'vesp' || ab.id === 'barr') placeOnRail(u, t.slot, ab.id); else if (ab.id === 'redir') return flowRedirect(u, t); else commit({ type: 'ability', agent: u, id: ab.id, target: t }); };
    hintSet(ab.name, 'Tap an enemy (or its rail slot) to target. ' + ab.text);
  }, 280);
}
function targetPicked(t) { if (UI.targetFn) UI.targetFn(t); }
function flowEnemyTarget(u, type) {
  UI.mode = 'target'; camReset();
  const okT = E.enemies(0).filter(t => type === 'analyse' || !t.mark);
  okT.forEach(t => { cards[t.uid].wrap.classList.add('tgt'); railEls[t.slot].classList.add('pick'); });
  UI.targetFn = t => { if (!okT.includes(t)) return toast(t.name + ' cannot be picked.'); if (type === 'analyse') return flowAnalyseBid(u, t); commit({ type, agent: u, target: t }); };
  hintSet(type === 'analyse' ? 'Analyse' : 'Mark', 'Tap an enemy. ' + (type === 'analyse' ? 'You bid Brains to read its exact stats and hidden effects until your turn ends. It does not use your turn.' : 'Your next hit on it lands +1. Costs 1 Brains, then you rest 1.'));
}
function flowAnalyseBid(a, t) {
  closeMenus(); stopHint(); camReset(); UI.mode = 'bid'; $$('.cardwrap').forEach(w => w.classList.remove('tgt')); railEls.forEach(r => r.classList.remove('pick'));
  const rs = railEls[t.slot], mx = Math.max(1, E.proj(a, 'BRN')); let X = 1;
  const pod = el('div', 'pod');
  pod.innerHTML = `<div class="ptop"><div class="pinfo"></div></div><div class="prow"><button type="button" class="pbtn" data-d="-1" aria-label="Less"><i>-</i></button><span class="pnum" aria-live="polite"></span><button type="button" class="pbtn" data-d="1" aria-label="More"><i>+</i></button></div><button type="button" class="pgo">Analyse</button><div class="pcov"><button type="button" class="pcb take"><b>Back</b></button></div>`;
  rs.appendChild(pod); rs.classList.add('hot');
  const upd = () => { $('.pnum', pod).textContent = X; $(".pinfo", pod).textContent = `-${X} BRN`; $$('.pbtn', pod).forEach(b => { b.disabled = (+b.dataset.d < 0 && X <= 1) || (+b.dataset.d > 0 && X >= mx); }); };
  $$('.pbtn', pod).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); X = cl(X + +b.dataset.d, 1, mx); sfx('tick'); upd(); }));
  const end = () => { pod.remove(); rs.classList.remove('hot'); };
  $('.pgo', pod).addEventListener('click', e => { e.stopPropagation(); sfx('tick'); end(); commit({ type: 'analyse', agent: a, target: t, X }); });
  $('.pcb', pod).addEventListener('click', e => { e.stopPropagation(); end(); backToSel(); });
  pod.addEventListener('click', e => e.stopPropagation());
  upd(); hintSet('Analyse ' + t.name, 'Bid Brains. If it has that many and spends them, it blocks you. A bigger bid is harder to block.');
}
function askResist(ctx) {
  if (TUT) return Promise.resolve({ block: false });
  const { attacker: a, target: t, bid } = ctx;
  return new Promise(res => {
    UI.mode = 'retort'; closeMenus(); hintSet(''); hidePod(); document.body.classList.add('defending');
    const rs = railEls[t.slot], pod = el('div', 'pod defpod');
    pod.innerHTML = `<div class="ptop"><div class="pinfo">${a.name} bids ${bid} Brains to read ${t.name}.</div></div><button type="button" class="pgo">Block (-${bid} BRN)</button><div class="pcov"><button type="button" class="pcb take"><b>Let it</b></button></div>`;
    rs.appendChild(pod);
    const done = b => { pod.remove(); document.body.classList.remove('defending'); stopHint(); UI.mode = 'busy'; res({ block: b }); };
    $('.pgo', pod).addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done(true); });
    $('.pcb.take', pod).addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done(false); });
    pod.addEventListener('click', e => e.stopPropagation());
    hintSet(t.name + ' is being read', 'Spend ' + bid + ' Brains to block it, or let it through.');
  });
}
const ANA = { bash: 'Bash ready', bd: 'Beatdown ready', succ: 'Successor ready', fp: 'Finally Perfect ready', makeup: 'Makeup ready', manip: 'Manipulator ready', lost: 'Lost ready', stat: 'Stationary ready', sharp: 'Claws sharpened', ds: 'Double-Smack ready', blend: 'Blender ready', wing: 'Wingwoman ready', rookie: 'Rookie ready', baton: 'Baton ready', hm: "He's Mine set", dc: 'Depu-counter up', dep: 'Depulsion up', harden: 'Harden up', imp: 'Impression up', coll: 'Collateral up', glob: 'Glob set', ua: 'Unstable', mark: 'Marked' };
async function showAnalyse(t) {
  const have = Object.keys(ANA).filter(k => !!t[k] && (typeof t[k] !== 'number' || t[k] > 0)), coated = G.atom[t.side].some(Boolean);
  const fx = have.map(k => ANA[k]); if (t.coat) fx.push('Coated'); if (coated) fx.push('A slot on its side is coated in secret');
  showPanel(`<h2>${t.name}</h2><p>${t.hp} of ${t.maxhp} HP${t.rest > 0 ? ', resting ' + t.rest : ''}.</p><p>Strength ${t.cur.STR}/${t.max.STR}, Agility ${t.cur.AGI}/${t.max.AGI}, Brains ${t.cur.BRN}/${t.max.BRN}, DATA ${t.cur.DATA}/${t.max.DATA}.</p><h3>Hidden and ready</h3>${fx.length ? '<ul>' + fx.map(x => '<li>' + x + '</li>').join('') + '</ul>' : '<p>Nothing set. It is a clean read.</p>'}<div class="btnrow"><button class="btn primary pclose" type="button">Got it</button></div>`);
  while ($('#panel').classList.contains('on')) await sleep(120);
}

/* ---------- Brains constellation (click to open, sits on the card) ---------- */
function closeConst() { const c = $('.const'); if (c) c.remove(); $$('.slot.top').forEach(x => x.classList.remove('top')); $('#board').classList.remove('deep'); hideTip(); }
function openConst(u, kind) {
  if (!['sel', 'abil', 'const'].includes(UI.mode)) return;
  closeMenus(); UI.mode = 'const'; UI.tipFor = null; UI.constKind = kind = kind || 'brn';
  const slot = cards[u.uid].slot; slot.classList.add('top'); $('#board').classList.add('deep');
  let nodes, lines;
  if (kind === 'brn') {
    const tr = E.canTransfer(u), mk = E.canMark(u), an = E.canAnalyse(u), cu = E.canCure(u);
    nodes = [
      { id: 'tr', x: 50, y: 16, z: 36, t: 'Transfer', d: 'Costs 1 Brains and your turn. A teammate gains +' + E.transferAmt(u) + ' in a stat of your choice (1 + a quarter of your Brains). You lose 1 of it, then rest 1 turn.', ok: tr.ok, why: tr.reason, svg: 'tr' },
      { id: 'an', x: 18, y: 62, z: -14, t: 'Analyse', d: 'Free, it does not use your turn. Bid Brains to read an enemy\'s exact stats and hidden effects until your turn ends. It can spend the same amount to block you.', ok: an.ok, why: an.reason, svg: 'an' },
      { id: 'mk', x: 82, y: 66, z: -24, t: 'Mark', d: 'Costs 1 Brains and your turn, then you rest 1. Only this agent gets the +1, on its next hit on that enemy.', ok: mk.ok, why: mk.reason, svg: 'mk' },
      { id: 'cu', x: 50, y: 88, z: 10, t: 'Cure', d: 'Costs 2 Brains and your turn, then you rest 1. Pick yourself or a teammate to clear Mark and any no-dodge penalty.', ok: cu.ok, why: cu.reason, svg: 'cu' }
    ];
    lines = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]];
  } else {
    const rc = E.canRecover(u), mo = E.moveOptions(u);
    const rec = k => { const p = E.proj(u, k), nr = u.noRegen && u.noRegen[k]; const ok = rc.ok && p < u.max[k] && !nr; return { id: 'r' + k, stat: k, t: 'Recover ' + SHORT[k], ok, why: nr ? 'cannot recover on its own' : (p >= u.max[k] ? 'already full' : rc.reason), d: `Spend 1 Agility and your turn to restore +1 ${SHORT[k]} (${p} to ${p + 1}).` }; };
    nodes = [Object.assign(rec('STR'), { x: 16, y: 40, z: -14 }), Object.assign(rec('BRN'), { x: 50, y: 14, z: 30 }), Object.assign(rec('DATA'), { x: 84, y: 42, z: -18 }),
      { id: 'mv', x: 50, y: 80, z: 18, t: 'Move', d: 'Slide into a fallen slot for 1 Agility per slot. It uses your turn.', ok: mo.length > 0, why: 'no empty slot in reach', svg: 'mv' }];
    lines = [[0, 1], [1, 2], [0, 3], [2, 3]];
  }
  const box = el('div', 'const'); box.setAttribute('role', 'menu');
  const drift = el('div', 'drift'), scene = el('div', 'scene'); drift.appendChild(scene); box.appendChild(drift);
  scene.appendChild(el('div', 'bgglow'));
  for (let i = 0; i < 22; i++) { const d = el('i', 'dust'); d.style.left = rnd(0, 100) + '%'; d.style.top = rnd(0, 100) + '%'; d.style.transform = `translateZ(${rnd(-60, 40).toFixed(0)}px)`; d.style.animationDelay = rnd(0, 3) + 's'; scene.appendChild(d); }
  scene.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.map(l => `<line x1="${nodes[l[0]].x}" y1="${nodes[l[0]].y}" x2="${nodes[l[1]].x}" y2="${nodes[l[1]].y}"/>`).join('')}</svg>`);
  nodes.forEach((n, i) => {
    const s = el('button', 'star' + (n.ok ? '' : ' off')); s.type = 'button';
    s.style.left = n.x + '%'; s.style.top = n.y + '%'; s.style.setProperty('--z', n.z + 'px'); s.style.setProperty('--d', (i * 0.4) + 's');
    s.setAttribute('aria-label', n.t + (n.ok ? '' : ' (unavailable: ' + n.why + ')'));
    s.innerHTML = n.svg ? svgIcon(n.svg) : `<img src="${ICO[n.stat]}" alt=""><i class="plus">+</i>`;
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
      if (n.id === 'an' || n.id === 'mk') return flowEnemyTarget(u, n.id === 'an' ? 'analyse' : 'mark');
      if (n.id === 'cu') return flowCure(u);
      if (n.id === 'mv') return flowMove(u);
      commit({ type: 'recover', agent: u, stat: n.stat });
    });
    scene.appendChild(s);
  });
  box.addEventListener('pointermove', e => { if (box.dataset.freeze) return; const r = box.getBoundingClientRect(); box.style.setProperty('--cry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg'); box.style.setProperty('--crx', -((e.clientY - r.top) / r.height - 0.5) * 9 + 'deg'); });
  box.addEventListener('click', e => e.stopPropagation());
  slot.appendChild(box); camEl(slot, { sc: 1.35, cx: 1, free: true, rx: 9, cy: 0.5 });
  hintSet(kind === 'brn' ? 'Mind' : 'Reflex', kind === 'brn' ? 'Tap a star. Each is an action you can take with Brains. Tap empty space to go back.' : 'Tap a star. Agility pays for these. Tap empty space to go back.');
}
function closeMenus() { closeAbil(); closeConst(); hideTip(); $$('.statpick').forEach(x => x.remove()); }

/* ---------- Bloodbrother: pick an ally, then plot the attack ---------- */
function flowBloodbrother(u) {
  UI.mode = 'ally'; camReset();
  E.alive(0).filter(x => x !== u && x.cur.STR >= 1).forEach(x => cards[x.uid].wrap.classList.add('tgt'));
  UI.allyFn = ally => {
    if (ally.cur.STR < 1) return toast(ally.name + ' has no Strength to lend.');
    UI.allyFn = null; $$('.cardwrap').forEach(w => w.classList.remove('tgt')); UI.mode = 'target'; camReset();
    E.hittable(0).forEach(t => { cards[t.uid].wrap.classList.add('tgt'); railEls[t.slot].classList.add('pick'); });
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
function flowCure(a) {
  UI.mode = 'ally'; UI.allySelf = true; camReset();
  const ok = E.cureTargets(a); ok.forEach(x => cards[x.uid].wrap.classList.add('tgt'));
  UI.allyFn = t => { if (!ok.includes(t)) return toast(t.name + ' has nothing to cure.'); UI.allyFn = null; commit({ type: 'cure', agent: a, target: t }); };
  hintSet('Cure', 'Tap a teammate (or yourself) with Mark or a no-dodge penalty. Costs 2 Brains and your turn, then you rest 1.');
}
function flowPick(u, title, hint, items, cb) {
  UI.mode = 'ally'; UI.allyFn = () => {}; camReset(); $$('.statpick').forEach(x => x.remove());
  const slot = cards[u.uid].slot, p = el('div', 'statpick');
  items.forEach(it => {
    const b = el('button', 'sp ' + (it.txt ? 'txt' : ''), it.img ? `<img src="${it.img}" alt="${it.label}"><small>${it.small || ''}</small>` : `<b>${it.label}</b><small>${it.small || ''}</small>`); b.type = 'button'; b.disabled = !!it.off; b.setAttribute('aria-label', it.label);
    b.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); cb(it.val); }); p.appendChild(b);
  });
  p.addEventListener('click', e => e.stopPropagation()); slot.appendChild(p);
  hintSet(title, hint);
}
function flowStatPick(u, title, hint, cb) {
  flowPick(u, title, hint, STATS.map(k => ({ img: ICO[k], label: SHORT[k], small: u.cur[k], val: k })), cb);
}
function flowRedirect(u, t) {
  flowPick(u, 'Redirect ' + t.name, 'Pick the slot on your side that its next attack is pulled onto. An empty slot wastes the attack.',
    [0, 1, 2, 3].map(i => { const v = G.sides[0][i]; return { label: 'Slot ' + (i + 1), small: v && v.alive ? v.name : 'empty', val: i, txt: 1 }; }),
    i => commit({ type: 'ability', agent: u, id: 'redir', target: t, slot: i }));
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
function flyerFollow(rs) {
  const fl = UI.flyer; if (!fl) return () => camReset();
  fl.el.classList.add('seated'); rs.appendChild(fl.el); { const c = cards[fl.u.uid]; if (c) c.wrap.classList.add('away'); }
  return async () => { await camReset(); if (fl.el.isConnected) { fl.el.classList.remove('seated'); $('#fxlayer').appendChild(fl.el); } };
}
function askDefense(ctx) {
  const { attacker: a, target: t, X, kind } = ctx;
  if (TUT && TUT.coverOnly) { ctx.canBlock = false; ctx.canDodge = false; }
  const can = { STR: ctx.canBlock && t.cur.STR > 0, AGI: !ctx.exposed && ctx.canDodge };
  if (!can.STR && !can.AGI && !ctx.protectors.length) { toast(t.name + ' has no way to stop it.'); return sleep(RM ? 0 : 450).then(() => ({ type: 'take' })); }
  return new Promise(res => {
    UI.mode = 'defend'; closeMenus(); hintSet(''); hidePod(); document.body.classList.add('defending');
    const wrap = cards[t.uid].wrap, rs = railEls[t.slot], R0 = rs.getBoundingClientRect();
    let unseat = () => camReset(), m = null, s = Math.min(X, t.cur.STR), cs = {};
    const nn = k => $('.n-' + k.toLowerCase(), wrap);
    const cleanup = () => { (UI.holds || []).forEach(f => f()); UI.holds = []; pod.remove(); STATS.forEach(k => { const n = nn(k); n.classList.remove('lit', 'hov', 'on', 'dlit'); $$('.nlab', n).forEach(x => x.remove()); }); wrap.classList.remove('tgt'); ctx.protectors.forEach(p => cards[p.uid].wrap.classList.remove('guard')); UI.def = null; document.body.classList.remove('defending'); stopHint(); clearMarks(); return unseat(); };
    const done = async d => { UI.mode = 'busy'; await cleanup(); res(d); };
    wrap.classList.add('tgt'); ctx.protectors.forEach(p => cards[p.uid].wrap.classList.add('guard'));
    ['STR', 'AGI'].forEach(k => { const n = nn(k); n.classList.toggle('lit', !!can[k]); n.classList.toggle('dlit', !!can[k]); if (can[k]) { const l = el('span', 'nlab', k === 'STR' ? 'BLOCK' : 'DODGE'); n.appendChild(l); } });
    const pod = el('div', 'pod defpod');
    pod.innerHTML = `<div class="ptop"><div class="pinfo"></div></div>
      <div class="prow"><button type="button" class="pbtn" data-d="-1" aria-label="Less"><i>-</i></button><span class="pnum"></span><button type="button" class="pbtn" data-d="1" aria-label="More"><i>+</i></button></div>
      <button type="button" class="pgo"></button><div class="pcov"></div>`;
    rs.appendChild(pod);
    const info = $('.pinfo', pod), row = $('.prow', pod), num = $('.pnum', pod), go = $('.pgo', pod), cov = $('.pcov', pod);
    const upd = () => {
      row.style.display = go.style.display = 'none';
      STATS.forEach(k => nn(k).classList.toggle('on', m === k));
      if (m === 'STR') {
        row.style.display = go.style.display = ''; num.textContent = s; go.textContent = 'Block';
        info.textContent = s < X ? `Spend ${s} STR | take ${X - s}` : s === X ? `Spend ${X} STR | matched${CFG.clash ? ' (they may raise)' : ''}` : `Spend ${s} STR | counter ${s - X}`;
        $$('.pbtn', pod).forEach(b => { b.disabled = (+b.dataset.d < 0 && s <= 1) || (+b.dataset.d > 0 && s >= t.cur.STR); });
        go.onclick = e => { e.stopPropagation(); sfx('tick'); done({ type: 'block', s }); };
      } else if (m === 'AGI') {
        go.style.display = ''; go.textContent = 'Dodge'; info.textContent = `Spend exactly ${X} AGI | you have ${t.cur.AGI}`;
        go.onclick = e => { e.stopPropagation(); sfx('tick'); done({ type: 'dodge' }); };
      } else info.textContent = `Incoming ${X}. Tap ${can.STR && can.AGI ? 'STR to block or AGI to dodge' : can.STR ? 'STR to block' : can.AGI ? 'AGI to dodge' : 'a cover'}`;
    };
    UI.def = { t, pick: k => {
      if (k === 'DATA' || k === 'BRN') { sfx('tick'); return toast(k === 'DATA' ? 'DATA does nothing while you defend.' : 'Brains only lets a neighbour cover you.'); }
      if (!can[k]) { sfx('tick'); return toast(k === 'STR' ? (ctx.exposed ? t.name + ' is resting: no block.' : t.cur.STR < 1 ? 'No Strength to block with.' : 'Cannot block this.') : (ctx.exposed ? t.name + ' is resting: no dodge.' : 'Not enough Agility. Dodging needs exactly ' + X + '.')); }
      sfx('tick'); m = m === k ? null : k; upd();
    } };
    $$('.pbtn', pod).forEach(b => {
      let t1 = 0, t2 = 0;
      const step = () => { const nx = cl(s + +b.dataset.d, 1, t.cur.STR); if (nx === s) return false; s = nx; sfx('tick'); upd(); return true; };
      const stop = () => { clearTimeout(t1); clearInterval(t2); b.classList.remove('down'); };
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (b.disabled) return; b.classList.add('down'); step(); t1 = setTimeout(() => { t2 = setInterval(() => { if (!step()) stop(); }, 110); }, 380); });
      ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave'].forEach(n => b.addEventListener(n, stop)); (UI.holds = UI.holds || []).push(stop);
      b.addEventListener('click', e => { e.stopPropagation(); if (e.detail === 0) step(); });
    });
    pod.addEventListener('click', e => e.stopPropagation());
    ctx.protectors.forEach(p => {
      const str = kind === 'str' && !p.makeup, key = p.uid; cs[key] = Math.min(X, p.cur.STR);
      const b = el('button', 'pcb', ''); b.type = 'button';
      const lab = () => { b.innerHTML = `<b>Cover: ${p.name}</b><small>${p.makeup ? 'negates all, rests 2' : str ? 'spend ' + cs[key] + ' STR, you take ' + (X - cs[key]) : 'takes all ' + X + ', rests ' + p.restN}</small>`; };
      lab();
      if (str && p.cur.STR > 0) { const lim = Math.min(X, p.cur.STR); b.addEventListener('contextmenu', e => e.preventDefault()); b.dataset.n = 1; b.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done({ type: 'interrupt', by: p, s: cs[key] }); });
        const st = el('span', 'pcs'); [['-', -1], ['+', 1]].forEach(([l, d]) => { const c = el('i', '', l); c.addEventListener('click', e => { e.stopPropagation(); cs[key] = cl(cs[key] + d, 0, lim); sfx('tick'); lab(); }); st.appendChild(c); }); const w = el('div', 'pcw'); w.append(b, st); cov.appendChild(w);
      } else { b.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done({ type: 'interrupt', by: p, s: 0 }); }); cov.appendChild(b); }
    });
    const take = el('button', 'pcb take', `<b>Take it (${X})</b>`); take.type = 'button'; take.addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done({ type: 'take' }); }); cov.appendChild(take);
    upd();
    const sa = cards[a.uid].slot, st2 = cards[t.uid].slot, l = Math.min(sa.offsetLeft, st2.offsetLeft), tp = Math.min(sa.offsetTop, st2.offsetTop);
    camEl({ offsetLeft: l, offsetTop: tp, offsetWidth: Math.max(sa.offsetLeft + sa.offsetWidth, st2.offsetLeft + st2.offsetWidth) - l, offsetHeight: Math.max(sa.offsetTop + sa.offsetHeight, st2.offsetTop + st2.offsetHeight) - tp }, { sc: 1.5, rx: 10, cx: 1 });
    unseat = flyerFollow(rs);
    hintSet(`${a.name} hits ${t.name} for ${X}`, (kind === 'data' ? 'DATA attack: dodge it exactly, or have a neighbour take it.' : 'Strength attack: match it to negate, go over to counter.') + (ctx.exposed ? ` ${t.name} is resting: no block, no dodge.` : ''));
  });
}
function askRetort(ctx) {
  if (TUT) return Promise.resolve({ s: 0 });
  const { attacker: a, target: t, cap } = ctx;
  return new Promise(res => {
    UI.mode = 'retort'; closeMenus(); hintSet(''); hidePod(); document.body.classList.add('defending');
    const rs = railEls[t.slot], R0 = rs.getBoundingClientRect(); let s = cap, unseat = () => camReset();
    const pod = el('div', 'pod defpod');
    pod.innerHTML = `<div class="ptop"><div class="pinfo"></div></div>
      <div class="prow"><button type="button" class="pbtn" data-d="-1" aria-label="Less"><i>-</i></button><span class="pnum"></span><button type="button" class="pbtn" data-d="1" aria-label="More"><i>+</i></button></div>
      <button type="button" class="pgo">Hit back</button><div class="pcov"><button type="button" class="pcb take"><b>Skip</b></button></div>`;
    rs.appendChild(pod);
    const info = $('.pinfo', pod), num = $('.pnum', pod), holds = [];
    const upd = () => { num.textContent = s; info.textContent = `Spend ${s} AGI | ${a.name} takes ${s}`; $$('.pbtn', pod).forEach(b => { b.disabled = (+b.dataset.d < 0 && s <= 1) || (+b.dataset.d > 0 && s >= cap); }); };
    const done = async d => { UI.mode = 'busy'; holds.forEach(f => f()); pod.remove(); document.body.classList.remove('defending'); stopHint(); await unseat(); res(d); };
    $$('.pbtn', pod).forEach(b => {
      let t1 = 0, t2 = 0;
      const step = () => { const nx = cl(s + +b.dataset.d, 1, cap); if (nx === s) return false; s = nx; sfx('tick'); upd(); return true; };
      const stop = () => { clearTimeout(t1); clearInterval(t2); b.classList.remove('down'); }; holds.push(stop);
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (b.disabled) return; b.classList.add('down'); step(); t1 = setTimeout(() => { t2 = setInterval(() => { if (!step()) stop(); }, 110); }, 380); });
      ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave'].forEach(n => b.addEventListener(n, stop));
      b.addEventListener('click', e => { e.stopPropagation(); if (e.detail === 0) step(); });
    });
    $('.pgo', pod).addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done({ s }); });
    $('.pcb.take', pod).addEventListener('click', e => { e.stopPropagation(); sfx('tick'); done({ s: 0 }); });
    pod.addEventListener('click', e => e.stopPropagation());
    upd();
    const sa = cards[a.uid].slot, st2 = cards[t.uid].slot, l = Math.min(sa.offsetLeft, st2.offsetLeft), tp = Math.min(sa.offsetTop, st2.offsetTop);
    camEl({ offsetLeft: l, offsetTop: tp, offsetWidth: Math.max(sa.offsetLeft + sa.offsetWidth, st2.offsetLeft + st2.offsetWidth) - l, offsetHeight: Math.max(sa.offsetTop + sa.offsetHeight, st2.offsetTop + st2.offsetHeight) - tp }, { sc: 1.5, rx: 10, cx: 1 });
    unseat = flyerFollow(rs);
    hintSet(t.name + ' took a hit', 'Hit back? Spend Agility, 1 point of damage each, up to half of what you took.');
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
    if (c.canDodge) { const d = drow(ICO.AGI, `Dodge: spend <b>${c.dodgeCost || X}</b> AGI. Your spent Strength stays spent.`); d.r.appendChild(btn('Dodge', 'primary', () => done({ type: 'dodge' }))); opts.appendChild(d.r); }
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
  if (!RM) { ring(T.x, T.y, 40 * S(), 0, '255,90,31', 2, 0.4, 6); glyphs(T.x, T.y, 6, 30 * S(), COL_DATA, { delay: 0.05 }); glitch(T.x, T.y, T.w, T.h, 4); }
  sparks(T.x, T.y, 18, 230 * S(), COL_DATA, { g: 140 }); sparks(T.x, T.y, 8, 160 * S(), ['#ffffff', '#ffd0a0'], { g: 60, life: 0.6 });
  ring(T.x, T.y, 34 * S(), 0, '255,90,31', 3, 0.3); glow(T.x, T.y, 40 * S(), 0.25, '255,90,31'); shake(1.5, 0.1);
  if (['block', 'negate', 'intercept', 'body'].includes(res)) {
    shieldFX(T.x, T.y); sfx('block'); ufloat(cover ? by : t, res === 'body' ? 'BODY-BLOCK' : res === 'negate' ? 'NEGATED' : res === 'intercept' ? 'COVERED' : 'BLOCKED', 'blk'); await sleep(240);
  } else if (res === 'partial' || res === 'intercept-part') { shieldFX(T.x, T.y); sfx('block'); await sleep(110); }
  else await sleep(40);
}
/* stat gain / loss: a scan sweeps the card, arrows rise or fall, and the stat's own notch rings out */
const SLK = { S: 'STR', A: 'AGI', B: 'BRN', D: 'DATA', STR: 'STR', AGI: 'AGI', BRN: 'BRN', DATA: 'DATA' };
function statOfText(t) { const m = /([+-])\s*\d+\s*(STR|AGI|BRN|DATA|S|A|B|D)\b/.exec(t || ''); return m ? { sign: m[1], k: SLK[m[2]] } : null; }
function shiftFX(c, text, down) {
  if (RM) return; const P = center(c.wrap), s = S(), st = statOfText(text), col = down ? '255,90,31' : '255,255,255', hx = down ? '#ff5a1f' : '#ffffff';
  scan(P.x, P.y, P.w, P.h, down ? 1 : -1, col, 0.55);
  chevrons(P.x, down ? P.y - P.h * 0.42 : P.y + P.h * 0.32, down ? 9 : 8, P.w * 0.4, hx, !down);
  ring(P.x, P.y, P.w * 0.85, 0.04, col, 2, 0.6, 6);
  if (down) { glitch(P.x, P.y, P.w, P.h, 7); glyphs(P.x, P.y - P.h * 0.2, 9, P.w * 0.4, COL_DATA, { down: true }); c.wrap.animate([{ translate: '0 0' }, { translate: '-2.2% 0' }, { translate: '2.4% 0' }, { translate: '-1.4% 0' }, { translate: '1% 0' }, { translate: '0 0' }], { duration: 300, easing: 'steps(6)' }); }
  else twinkles(P.x, P.y + P.h * 0.1, 6, P.w * 0.4, COL_HIT, { rise: true });
  if (st) { const n = notchEl({ uid: c.wrap.dataset.uid }, st.k); if (n) { const r = center(n); n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); setTimeout(() => n.classList.remove('pop'), 700); ring(r.x, r.y, r.w * 1.7, 0, col, 3, 0.5); ring(r.x, r.y, r.w * 2.6, 0.09, col, 2, 0.55, 6); sparks(r.x, r.y, 10, 150 * s, down ? COL_DATA : COL_HIT, { g: down ? 120 : -60 }); chevrons(r.x, r.y + (down ? -r.h * 0.9 : r.h * 0.6), 3, r.w * 0.5, hx, !down); } }
}
/* a DATA strike landing: hex shockwave, code spray, glitch slices and a red scan */
function dataHitFX(P, tier) {
  if (RM) return; const s = S();
  ring(P.x, P.y, P.w * (0.7 + tier * 0.12), 0, '255,90,31', 3, 0.5, 6); ring(P.x, P.y, P.w * (1.1 + tier * 0.15), 0.08, '212,32,43', 2, 0.55, 6);
  glyphs(P.x, P.y, 8 + tier * 5, P.w * 0.5, COL_DATA, { delay: 0.12 }); glitch(P.x, P.y, P.w, P.h, 4 + tier * 3); scan(P.x, P.y, P.w, P.h, 1, '255,90,31', 0.45);
  if (tier >= 3) { chevrons(P.x, P.y - P.h * 0.4, 6, P.w * 0.4, '#ff5a1f'); glyphs(P.x, P.y, 12, P.w * 0.7, ['#ffffff', '#ff9a4a'], { down: true, size: 1.2 }); }
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
    const P = center(c.wrap), tier = impact(P.x, P.y, dmg, kind); if (kind === 'data') dataHitFX(P, tier);
    ufloat(u, '-' + dmg, 'dmg' + (kind === 'data' ? ' data' : ''), Math.max(16, P.w * (0.2 + tier * 0.07)));
    c.wrap.classList.add('hurt'); setTimeout(() => c.wrap.classList.remove('hurt'), 340);
    const amp = 1.5 + tier * 2;
    c.wrap.animate([{ translate: '0 0' }, { translate: `${-amp}% 1%` }, { translate: `${amp}% -1%` }, { translate: `${-amp / 2}% 0` }, { translate: '0 0' }], { duration: 240 + tier * 60 });
    sfx('hit', tier); await sleep(110 + tier * 75);
  },
  async counter(t, a) { const A = center(cards[t.uid].wrap), B = center(cards[a.uid].wrap); streak(A.x, A.y, B.x, B.y, '255,255,255'); ufloat(t, 'COUNTER', 'buf'); sfx('hit', 1); await sleep(240); },
  async dodge(u) { const c = cards[u.uid]; if (c) ghostSlide(c.wrap, 1); sfx('dodge'); ufloat(u, 'DODGED', 'blk'); await sleep(260); },
  async moved(w, dead, from) {
    const cw = cards[w.uid], cd = cards[dead.uid]; if (!cw || !cd) return;
    const bw = cw.wrap.getBoundingClientRect(), bd = cd.wrap.getBoundingClientRect(), sa = cw.slot, sb = cd.slot;
    sa.appendChild(cd.wrap); sb.appendChild(cw.wrap); cw.slot = sb; cd.slot = sa;
    const aw = cw.wrap.getBoundingClientRect(), ad = cd.wrap.getBoundingClientRect();
    if (!RM) { try { cw.wrap.animate([{ translate: `${bw.left - aw.left}px ${bw.top - aw.top}px` }, { translate: '0 0' }], { duration: 460, easing: 'cubic-bezier(.2,.9,.2,1)' }); cd.wrap.animate([{ translate: `${bd.left - ad.left}px ${bd.top - ad.top}px` }, { translate: '0 0' }], { duration: 460, easing: 'cubic-bezier(.2,.9,.2,1)' }); } catch (e) {} }
    const P = center(cw.wrap); sfx('tick'); if (!RM) { ring(P.x, P.y, P.w * 0.9, 0.2, '255,255,255', 2, 0.5, 6); }
    updateAll(); await sleep(RM ? 40 : 520);
  },
  async die(u) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    sparks(P.x, P.y, 50, 380 * s, COL_HIT, { g: 500 }); sparks(P.x, P.y, 24, 260 * s, COL_DATA, { g: 400 }); smoke(P.x, P.y, 5, 44 * s); crack(P.x, P.y, 80 * s); ring(P.x, P.y, 76 * s, 0, '255,255,255', 4, 0.5);
    lens(P.x, P.y, 120 * s, 0, 0.6, '255,60,40'); shockLines(P.x, P.y, 24, 14 * s, 30 * s, 640 * s, '#fff'); twinkles(P.x, P.y, 12, P.w * 0.5, COL_HIT, { rise: true, life: 1.3 }); glow(P.x, P.y, P.w, 0.45, '255,60,30');
    shake(8, 0.4); sfx('die'); ufloat(u, 'DOWN', 'dmg'); paint(c.wrap, u); updateAll(); await sleep(520);
  },
  async dataBurst(u, level) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap);
    c.wrap.classList.add('datafx'); dataFX(P.x, P.y, level); notchSpark(u, 'DATA'); sfx('data');
    if (!RM) { scan(P.x, P.y, P.w, P.h, -1, '255,90,31', 0.5); glyphs(P.x, P.y + P.h * 0.15, 6 + level * 4, P.w * 0.45, COL_DATA); ring(P.x, P.y, P.w * (0.75 + level * 0.15), 0, '255,90,31', 2, 0.55, 6); }
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
    shiftFX(c, t, /^-/.test(t.trim()));
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
  credit(side, pts, txt) {
    if (TUT) return;
    if (!G || G.ctrl[side] !== 'human') return;
    let box = $('#credits'); if (!box) { box = el('div'); box.id = 'credits'; document.body.appendChild(box); }
    const d = el('div', 'cp p' + Math.min(pts, 5)); d.innerHTML = `<b>+${pts} Credit Point${pts > 1 ? 's' : ''}</b><span></span>`; d.lastChild.textContent = txt;
    while (box.children.length > 3) box.firstChild.remove();
    box.appendChild(d); sfx(pts >= 3 ? 'win' : 'twinkle');
    setTimeout(() => d.classList.add('out'), RM ? 2200 : 2600 + pts * 200); setTimeout(() => d.remove(), 3400 + pts * 200);
  },
  async prick(u, src) {
    const c = cards[u.uid]; if (!c) return; const P = center(c.wrap), s = S();
    for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; streak(P.x + Math.cos(a) * P.w * 0.7, P.y + Math.sin(a) * P.h * 0.5, P.x, P.y, '255,40,40'); }
    sparks(P.x, P.y, 10, 120 * s, ['#ff2a2a', '#d4202b'], { g: 20 }); sfx('hit', 0); await sleep(RM ? 30 : 200);
  },
  async debuff(u, text) { const c = cards[u.uid]; if (!c) return; paint(c.wrap, u); const P = center(c.wrap); dataFX(P.x, P.y, 1); shiftFX(c, text, true); chevrons(P.x, P.y - P.h * 0.35, 10, P.w * 0.4, '#ff4a2a'); glow(P.x, P.y, P.w * 0.8, 0.3, '212,32,43'); ufloat(u, 'v ' + text, 'dbf'); await sleep(280); },
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
const mxs = (u, k, n) => (k === 'STR' && (u.key === 'neko' || u.key === 'mason') && n >= 11) ? 'X' : n;
function pseudoUnit(key, i) { const d = DEFS[key], hp = Math.max(1, Math.round(d.hp * prefs.hp)); return { uid: 'p' + i, pseudo: true, key, name: d.name, side: 0, slot: i, cur: E.statsFor(key, i), max: E.statsFor(key, i), hp, maxhp: hp, rest: 0, alive: true, makeup: false, fp: false }; }
function showInspect(u) {
  const d = DEFS[u.key], ov = $('#inspect'), v = k => (UI.pv && UI.pv.u === u) ? UI.pv.v[k] : u.cur[k];
  ov.innerHTML = `<div class="inner holo" style="display:flex;flex-direction:column;align-items:center">
    <div class="hstage"><div class="hbeam"></div><div class="hbase"><i></i><i></i></div><div class="hfloat"><div class="bigslot"><div class="hsheen"></div><div class="hscan"></div></div></div></div>
    <div class="det hp3d">
    <h2 style="font-size:17px">${d.name}</h2><p style="margin:0 0 8px">${d.role.toUpperCase()} &middot; ${(d.realRole || '').toUpperCase()} &middot; ${ROLE[u.slot]} slot ${u.slot + 1} &middot; rests ${d.rest} after acting${u.rest > 0 ? ' (resting ' + u.rest + ')' : ''}</p>
    <div class="hr"><div><b>${u.hp}/${u.maxhp}</b>HP</div>${STATS.map(k => `<div><b>${hid(u) ? '?' : v(k) === u.max[k] ? mxs(u, k, v(k)) : v(k) + '/' + mxs(u, k, u.max[k])}</b>${k === 'DATA' ? 'DATA' : k}</div>`).join('')}</div>
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
function closePanels() { $$('.ov').forEach(o => { if (o.id !== 'arrange' && o.id !== 'over' && o.id !== 'title') o.classList.remove('on'); }); }
function showPanel(html, after) { const p = $('#panel'); p.innerHTML = `<div class="inner">${html}</div>`; p.classList.add('on'); const c = $('.pclose', p); if (c) { c.onclick = () => p.classList.remove('on'); c.focus({ preventScroll: true }); } if (after) after(p); }
function showRules() {
  const S = {
    basics: `<h3>The goal</h3><p>Knock out all four enemy agents. Nobody heals, apart from Echidna's Enki, so every point of damage counts.</p>
      <h3>Your squad</h3><ul>
      <li>4 agents, spent from a <b>hiring budget</b> of 15 points. Strong agents cost more.</li>
      <li><b>Slots 1 and 4 guard</b> (they can step in for a neighbour). <b>Slots 2 and 3 attack.</b> Where you place someone matters.</li>
      <li>Build and save up to several decks on the squad screen. Hold and drag cards to rearrange.</li>
      <li><b>Last stand:</b> if only one of your agents is left standing, it gets an adrenaline rush and every attack hits for +1.</li></ul>
      <h3>The four stats</h3><ul>
      <li><b>STR (Strength):</b> your attack power and your block. Attacking and blocking spend it.</li>
      <li><b>AGI (Agility):</b> spend exactly the attack's number to dodge it. On your turn it can also <b>wake a resting agent</b> (1 per turn left) or <b>move an agent into a fallen slot</b> (1 per slot). After you take a hit, spend it to <b>hit back</b>. It also pays to <b>recover</b>: 1 Agility for +1 in Strength, Brains or DATA.</li>
      <li><b>BRN (Brains):</b> pays for interrupts, Transfers, Analyse, Mark and Cure. It can also cover up to 2 DATA of an ability's cost. It never refills on its own. Some abilities target it.</li>
      <li><b>DATA:</b> pays for special abilities. The only stat shown in colour.</li></ul>
      <p>Stats are a <b>pool you spend</b>, not a fixed number. They refill slowly (see Turn).</p>
      <h3>Daily and challenges</h3><ul>
      <li><b>Daily challenge:</b> same squads for everyone each day, harder as the week goes on. Earn up to 3 stars and build a streak.</li>
      <li><b>Challenges:</b> a list of goals that unlock as you play solo duels against the CPU. A banner pops up when you finish one.</li></ul>`,
    turn: `<h3>On your turn</h3><ol>
      <li><b>Pick one agent</b> that isn't resting. It instantly gets <b>+1 Strength, Agility and DATA</b> (up to its max). <b>Brains does not refill on its own.</b></li>
      <li><b>Act once</b> with that agent using one notch on its card:</li></ol><ul>
      <li><b>Strength:</b> attack. Drag the card onto the Action Rail slot in front of your target, or tap the slot. Set the power with + and -.</li>
      <li><b>DATA:</b> open its abilities and pick one.</li>
      <li><b>Agility:</b> Recover, Move or Wake (below).</li>
      <li><b>Brains:</b> Transfer, Mark or Cure (below). Analyse is free and does not use the turn.</li>
      <li><b>Skip turn</b> is under your cards. Skipping gives every one of your agents <b>+1 Brains</b>, the only way to refill it.</li></ul>
      <h3>Resting</h3><p>After attacking or interrupting, an agent <b>rests</b> for its own number of turns (shown when you inspect it). A resting agent can't act, defend or dodge, so it's wide open.</p>
      <h3>Brains actions</h3><ul>
      <li><b>Transfer:</b> give a teammate 1 + a quarter of your Brains in one stat. It costs you 1 Brains and the turn, then you rest 1. Best from high-Brains agents.</li>
      <li><b>Analyse:</b> a free action, it does not use your turn. Enemy stats are hidden (shown as ?) until you Analyse that agent. You bid some Brains (at least 1); the enemy can spend that same amount of its Brains to block it, so a bigger bid is harder to block. If it works, you see that agent's exact stats and hidden effects until your turn ends. Hiding can be turned off in Tune.</li>
      <li><b>Mark:</b> costs 1 Brains and the turn (you rest 1). Only the agent that marked it gets the +1, on its next hit that lands.</li>
      <li><b>Cure:</b> costs 2 Brains and the turn (you rest 1). Clears Mark or a no-dodge penalty from you or a teammate.</li></ul>
      <h3>Agility actions</h3><ul>
      <li><b>Recover:</b> spend 1 Agility and your turn to restore +1 Strength, Brains or DATA (up to its max).</li>
      <li><b>Wake:</b> 1 Agility per rest turn left, to get a resting agent up.</li>
      <li><b>Move:</b> 1 Agility per slot, into a fallen slot.</li></ul>
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
      <li><b>Nessy + Frey: triple hit.</b> Frey readies Wingwoman, then Nessy's Double-Smack hits the same agent twice and Frey charges in for a third. That's the "3-Piece Galore" challenge.</li>
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
function showTutorials() {
  const mk = (n, t, d, done) => `<div class="tutwrap"><div class="trow2"><button class="btn tutrow" type="button" data-n="${n}"><b>${n}. ${t}</b>${done ? ' <span class="tdone">DONE</span>' : ''}<small>${d}</small></button><button class="btn tparts" type="button" data-n="${n}" aria-expanded="false">Parts<i>&#9662;</i></button></div><div class="tchs" id="tch${n}" hidden>${TUT_CH[n].map((c, i) => `<button type="button" class="btn tch" data-n="${n}" data-c="${c.id}"><i>${chDone(n, c.id) ? '✓' : i + 1}</i><span><b>${c.n}</b><small>${c.d}</small></span></button>`).join('')}</div></div>`;
  showPanel(`<h2>Tutorials</h2><p>Short, hands-on lessons against a practice opponent. Play it all, or tap Parts to replay just one chapter.</p>
  <div class="btnrow col opts">${mk(1, 'The Basics', 'Argo and Jane. Stats, blocking, dodging, resting, recovering, guards, DATA.', prefs.tutDone)}${mk(2, 'Tactics', 'Rarity and Echidna. Hidden stats, Analyse bids, waking, clashes, Mark, Cure.', prefs.tut2Done)}</div>
  <div class="btnrow"><button class="btn pclose" type="button">Back</button></div>`, p => {
    $$('.tutrow', p).forEach(b => { b.onclick = () => { sfx('tick'); closePanels(); startTutorial(+b.dataset.n); }; });
    $$('.tparts', p).forEach(b => { b.onclick = () => { sfx('tick'); const l = $('#tch' + b.dataset.n, p), open = l.hidden; $$('.tchs', p).forEach(x => { x.hidden = true; }); $$('.tparts', p).forEach(x => x.setAttribute('aria-expanded', 'false')); l.hidden = !open; b.setAttribute('aria-expanded', String(open)); }; });
    $$('.tch', p).forEach(b => { b.onclick = () => { sfx('tick'); closePanels(); startTutorial(+b.dataset.n, b.dataset.c); }; });
  });
}
/* =========================================================
   Challenges: goals that unlock as you play (solo games against the CPU)
   ========================================================= */
const sameSet = (a, b) => a.length === b.length && b.every(k => a.includes(k));
const CHALS = [
  { id: 'icon', n: 'Icon Squad', d: 'Win a duel using Argo, Jane, Cathy and Mason.', end: (g, A) => sameSet(g.sides[0].map(u => u.key), ['argo', 'jane', 'cathy', 'mason']) },
  { id: 'triple', n: '3-Piece Galore', d: 'Land 3 hits in a row on one agent, uninterrupted. A double hit plus a Wingwoman works, or 3 clean hits over turns.', live: A => A.chain[0] >= 3 },
  { id: 'flawless', n: 'Flawless', d: 'Win without losing a single agent.', end: g => g.sides[0].every(u => u.alive) },
  { id: 'last', n: 'Last One Standing', d: 'Win with exactly one agent of yours still up.', end: g => g.sides[0].filter(u => u.alive).length === 1 },
  { id: 'speed', n: 'Quick Draw', d: 'Win a duel by round 12.', end: g => Math.ceil(g.turnNo / 2) <= 12 },
  { id: 'cheap', n: 'Bargain Bin', d: 'Win with a squad that costs 9 hiring points or less.', end: g => E.squadCost(g.sides[0].map(u => u.key)) <= 9 },
  { id: 'pair', n: 'Inseparable', d: 'Win with Julian and Delilah on your squad.', end: g => ['julian', 'delilah'].every(k => g.sides[0].some(u => u.key === k)) },
  { id: 'tact', n: 'Outthink the Tactician', d: 'Win against the top CPU level (Tactician, level 5).', end: (g, A, ai) => ai === 5 },
  { id: 'counter', n: 'Counter Culture', d: 'Counter-attack 3 times in one duel.', live: A => A.ctr[0] >= 3 },
  { id: 'wall', n: 'Brick Wall', d: 'Fully block 5 attacks in one duel.', live: A => A.blk[0] >= 5 },
  { id: 'clash', n: 'Escalation', d: 'Raise a clash twice in a single exchange (both of you matching each time).', live: A => A.raise >= 2 },
  { id: 'scout', n: 'Know Thy Enemy', d: 'Analyse all four enemy agents in one duel.', live: A => A.ana[0].length >= 4 },
  { id: 'cure', n: 'Clean Bill', d: 'Cure an agent that has been marked.', live: A => A.cure[0] >= 1 },
  { id: 'daily3', n: 'Daily Perfection', d: 'Earn 3 stars on a daily challenge.', end: (g, A, ai, r) => !!(r && r.stars === 3) },
  { id: 'streak', n: 'Regular', d: 'Win the daily challenge 3 days running.', end: (g, A, ai, r) => !!(r && r.win && r.streak >= 3) }
];
const chalDone = () => CHALS.filter(c => prefs.chal && prefs.chal[c.id]).length;
let chalQ = [], chalBusy = false, chalIv = 0;
function chalPop() {
  if (chalBusy || !chalQ.length) return; chalBusy = true; const c = chalQ.shift();
  let e = $('#chalPop'); if (!e) { e = el('div'); e.id = 'chalPop'; document.body.appendChild(e); }
  e.innerHTML = '<small>CHALLENGE COMPLETE</small><b></b>'; $('b', e).textContent = c.n; e.classList.add('on'); sfx('win');
  setTimeout(() => { e.classList.remove('on'); setTimeout(() => { chalBusy = false; chalPop(); }, 500); }, 2600);
}
function chalGrant(c) {
  if (!prefs.chal) prefs.chal = {}; if (prefs.chal[c.id]) return; prefs.chal[c.id] = true; savePrefs();
  if (G) (G.newChal = G.newChal || []).push(c.n); chalQ.push(c); chalPop();
}
const chalSolo = () => !!(G && !TUT && G.ctrl[0] === 'human' && G.ctrl[1] === 'cpu' && !(ONL && ONL.playing));
function chalLive() {
  if (!chalSolo() || G.over) return; const A = E.ach();
  CHALS.forEach(c => { if (c.live && !(prefs.chal && prefs.chal[c.id]) && c.live(A)) chalGrant(c); });
}
function chalEnd(r) {
  if (!chalSolo() || G.winner !== 0) return; const A = E.ach(), ai = G.daily ? G.daily.ai : (prefs.ai || 3);
  CHALS.forEach(c => { if (!(prefs.chal && prefs.chal[c.id]) && ((c.end && c.end(G, A, ai, r)) || (c.live && c.live(A)))) chalGrant(c); });
}
function showChallenges() {
  const rows = CHALS.map(c => { const ok = prefs.chal && prefs.chal[c.id]; return `<li class="${ok ? 'ok' : ''}"><i>${ok ? '✓' : ''}</i><div><b>${c.n}</b><small>${c.d}</small></div></li>`; }).join('');
  showPanel(`<h2>Challenges</h2><p>${chalDone()} of ${CHALS.length} done. They unlock as you play solo duels against the CPU, in any mode.</p><ul class="chlist">${rows}</ul><div class="btnrow"><button class="btn pclose" type="button">Back</button></div>`);
}

/* =========================================================
   Daily challenge: same squads for everyone, harder as the week goes on
   ========================================================= */
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_DIFF = ['Easy', 'Gentle', 'Fair', 'Standard', 'Tough', 'Hard', 'Brutal'];
const DAY_AI = [1, 2, 2, 3, 3, 4, 5], DAY_HP = [0.7, 0.8, 0.9, 1, 1, 1.1, 1.25], DAY_PAR = [16, 22, 24, 26, 28, 30, 34];
const DAY_MODS = [{ t: 'Standard rules', d: 'Nothing special.' }, { t: 'No clashes', d: 'Blocks end the exchange. No raising.', clash: false }, { t: 'Half-cost attacks', d: 'Attacks cost half, rounded up.', half: true }, { t: 'Open files', d: 'Enemy stats are visible from the start.', hide: false }];
const mulb = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const dKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
function dailySetup() {
  const d = new Date(), key = dKey(d), dow = (d.getDay() + 6) % 7, rnd = mulb(d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate());
  const pool = ROSTER_ALL.filter(k => k !== 'julian' && k !== 'delilah');
  const pick = avoid => { for (let n = 0; n < 600; n++) { const p = pool.slice(); for (let i = p.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; } const c = p.slice(0, 4), cost = E.squadCost(c); if (cost <= E.CFG.budget && cost >= 11 && !(avoid && c.some(k => avoid.includes(k)))) return c; } return ['wren', 'rarity', 'cray', 'neko']; };
  const me = pick(), opp = pick(me), mod = DAY_MODS[(rnd() * DAY_MODS.length) | 0];
  return { key, dow, me, opp, mod, ai: DAY_AI[dow], hpm: DAY_HP[dow], par: DAY_PAR[dow] };
}
const dailyDone = () => prefs.dKey === dKey(new Date()) && prefs.dStars > 0;
function dailyRecord() {
  const D = G.daily; if (!D || G.dRec) return G.dRec || null; const win = G.winner === 0, rounds = Math.ceil(G.turnNo / 2), lost = G.sides[0].filter(u => !u.alive).length;
  let stars = 0; if (win) { stars = 1; if (rounds <= D.par) stars++; if (!lost) stars++; }
  let first = false;
  if (win) {
    if (prefs.dKey !== D.key) { prefs.dKey = D.key; prefs.dStars = 0; }
    if (!prefs.dStars) { first = true; const y = new Date(); y.setDate(y.getDate() - 1); prefs.dStreak = prefs.dLast === dKey(y) ? (prefs.dStreak || 0) + 1 : 1; prefs.dLast = D.key; prefs.dBest = Math.max(prefs.dBest || 0, prefs.dStreak); }
    if (stars > (prefs.dStars || 0)) prefs.dStars = stars; savePrefs();
  }
  return G.dRec = { win, stars, rounds, lost, first, D, streak: prefs.dStreak || 0, best: prefs.dBest || 0 };
}
function dailyHtml(r) {
  const st = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  if (!r.win) return `<div class="cpsum"><h3>Daily ${r.D.key}</h3><p>No stars yet. Retry as many times as you like.</p><small>Streak ${prefs.dStreak && prefs.dLast === r.D.key ? prefs.dStreak : prefs.dStreak || 0}${prefs.dLast && prefs.dLast !== r.D.key && prefs.dLast !== dKey(new Date(Date.now() - 864e5)) ? ' (ended)' : ''}</small></div>`;
  return `<div class="cpsum"><h3>Daily ${st(r.stars)}</h3><ul><li><b>★</b> Win</li><li><b>${r.rounds <= r.D.par ? '★' : '☆'}</b> Win by round ${r.D.par} (you took ${r.rounds})</li><li><b>${r.lost ? '☆' : '★'}</b> Lose nobody</li></ul><small>Streak ${r.streak} day${r.streak === 1 ? '' : 's'}. Best ${r.best}.</small></div>`;
}
function dailyShare(r) {
  const txt = `AnomEx Daily ${r.D.key} (${DAY_DIFF[r.D.dow]})\n${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)} Round ${r.rounds}\nStreak ${r.streak}`;
  if (navigator.share) { navigator.share({ text: txt }).catch(() => {}); return; }
  try { navigator.clipboard.writeText(txt).then(() => toast('Copied.'), () => toast(txt)); } catch (e) { toast(txt); }
}
function showDaily() {
  if (ONL && ONL.playing) return toast('Finish or forfeit the online match first.');
  const D = dailySetup(), nm = k => E.DEFS[k] ? E.DEFS[k].name : k, got = prefs.dKey === D.key ? prefs.dStars || 0 : 0;
  const y = new Date(); y.setDate(y.getDate() - 1); const live = prefs.dLast === D.key || prefs.dLast === dKey(y) ? prefs.dStreak || 0 : 0;
  showPanel(`<h2>Daily challenge</h2><p>${DAY_NAMES[D.dow]}, ${D.key}. Everyone gets the same squads. Gets harder as the week goes on.</p>
  <ul class="dlist"><li><b>Difficulty</b> ${DAY_DIFF[D.dow]}</li><li><b>Twist</b> ${D.mod.t}. ${D.mod.d}</li><li><b>Your squad</b> ${D.me.map(nm).join(', ')}</li><li><b>Enemy</b> ${D.opp.map(nm).join(', ')}${D.hpm !== 1 ? ' (' + (D.hpm > 1 ? '+' : '') + Math.round((D.hpm - 1) * 100) + '% HP)' : ''}</li></ul>
  <ul class="dlist"><li><b>★</b> Win</li><li><b>★</b> Win by round ${D.par}</li><li><b>★</b> Lose nobody</li></ul>
  <p><small>Today: ${'★'.repeat(got)}${'☆'.repeat(3 - got)}. Streak ${live} day${live === 1 ? '' : 's'}. Best ${prefs.dBest || 0}.</small></p>
  <div class="btnrow"><button class="btn pclose" type="button">Back</button><button class="btn primary" type="button" id="dGo">${got ? 'Play again' : 'Start'}</button></div>`, p => {
    $('#dGo', p).onclick = () => { sfx('tick'); closePanels(); startGame(['human', 'cpu'], { daily: D }); };
  });
}
function showTune() {
  showPanel(`<h2>Tune</h2><p>Test knobs. They apply to the next duel.</p>
  <div class="field"><label for="tHp">Agent HP <span id="tHpV"></span></label><input id="tHp" type="range" min="0.4" max="1" step="0.05"><small>100% is the HP on your cards. With no healing, full HP makes long duels, so this starts at 60%.</small></div>
  <div class="field"><label>Attack cost</label><div class="seg"><button class="btn" type="button" id="tFull">Full power</button><button class="btn" type="button" id="tHalf">Half, rounded up</button></div></div>
  <div class="field"><label>Clash escalation</label><div class="seg"><button class="btn" type="button" id="tClOn">On</button><button class="btn" type="button" id="tClOff">Off</button></div><small>On: a matched block lets the attacker raise by 1 and the defender answer, repeating until someone stops.</small></div>
  <div class="field"><label>Hidden enemy stats</label><div class="seg"><button class="btn" type="button" id="tHdOn">On</button><button class="btn" type="button" id="tHdOff">Off</button></div><small>On: enemy stats show as ? until you Analyse them. Online, the host's setting is used.</small></div>
  <div class="btnrow"><button class="btn primary pclose" type="button">Done</button></div>`, p => {
    const r = $('#tHp', p), v = $('#tHpV', p);
    const sync = () => { v.textContent = Math.round(prefs.hp * 100) + '%'; r.value = prefs.hp; $('#tFull', p).classList.toggle('on', !prefs.half); $('#tHalf', p).classList.toggle('on', prefs.half); $('#tClOn', p).classList.toggle('on', prefs.clash); $('#tClOff', p).classList.toggle('on', !prefs.clash); $('#tHdOn', p).classList.toggle('on', prefs.hide !== false); $('#tHdOff', p).classList.toggle('on', prefs.hide === false); };
    r.oninput = () => { prefs.hp = +r.value; savePrefs(); sync(); };
    $('#tFull', p).onclick = () => { prefs.half = false; savePrefs(); sync(); }; $('#tHalf', p).onclick = () => { prefs.half = true; savePrefs(); sync(); };
    $('#tClOn', p).onclick = () => { prefs.clash = true; savePrefs(); sync(); }; $('#tClOff', p).onclick = () => { prefs.clash = false; savePrefs(); sync(); };
    $('#tHdOn', p).onclick = () => { prefs.hide = true; savePrefs(); sync(); }; $('#tHdOff', p).onclick = () => { prefs.hide = false; savePrefs(); sync(); };
    sync();
  });
}
window.addEventListener('touchmove', e => { if (UI.dnd && e.cancelable) e.preventDefault(); }, { passive: false });
/* ---------- theme, title screen, settings, mission start ---------- */
function applyTheme() {
  const light = prefs.theme === 'light';
  document.documentElement.classList.toggle('light', light);
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = light ? '#ffffff' : '#000000';
}
function showSettings() {
  showPanel(`<h2>Settings</h2>
  <div class="field"><label>Sound</label><div class="seg"><button class="btn" type="button" id="sOn">On</button><button class="btn" type="button" id="sOff">Off</button></div></div>
  <div class="field"><label>Theme</label><div class="seg"><button class="btn" type="button" id="thDark">Dark</button><button class="btn" type="button" id="thLight">Light</button></div><small>Light inverts the whole archive: white becomes black. DATA keeps its colour.</small></div>
  <div class="btnrow col opts"><button class="btn" type="button" id="sTune">Tune (test knobs)</button></div>
  <div class="btnrow"><button class="btn primary pclose" type="button">Done</button></div><p class="note" style="text-align:center;margin-top:14px">Version ${E.VERSION}</p>`, p => {
    const sync = () => { $('#sOn', p).classList.toggle('on', !!prefs.sfx); $('#sOff', p).classList.toggle('on', !prefs.sfx); $('#thDark', p).classList.toggle('on', prefs.theme !== 'light'); $('#thLight', p).classList.toggle('on', prefs.theme === 'light'); };
    $('#sOn', p).onclick = () => { prefs.sfx = true; savePrefs(); sync(); sfx('tick'); }; $('#sOff', p).onclick = () => { prefs.sfx = false; savePrefs(); sync(); };
    $('#thDark', p).onclick = () => { prefs.theme = 'dark'; savePrefs(); applyTheme(); sync(); sfx('tick'); }; $('#thLight', p).onclick = () => { prefs.theme = 'light'; savePrefs(); applyTheme(); sync(); sfx('tick'); };
    $('#sTune', p).onclick = () => { sfx('tick'); showTune(); };
    sync();
  });
}
function showTitle() {
  UI.mode = 'title'; const ov = $('#title'); $('#arrange').classList.remove('on'); $('#over').classList.remove('on'); closePanels(); ov.classList.add('on');
  const lobby = !!(ONL && ONL.lobby && !ONL.playing);
  const pool = ROSTER_ALL.filter(k => DEFS[k]).slice(); for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  ov.innerHTML = `<div class="tscan"></div>
  <div class="tcore"><div class="tlogo"><b>${[...'ANOMEX'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</b><em>LINKED</em></div>
  <p class="tsub">Archive link established</p>
  <div class="tmenu"><button class="tbtn main" type="button" id="tPlay">${lobby ? 'Back to lobby' : 'Play'}</button>
  <div class="tgrid"><button class="tbtn" type="button" id="tOnl">Online</button><button class="tbtn" type="button" id="tDaily">Daily${dailyDone() ? ' ' + '★'.repeat(prefs.dStars || 0) : ''}</button><button class="tbtn" type="button" id="tChal">Challenges <i>${chalDone()}/${CHALS.length}</i></button><button class="tbtn" type="button" id="tTut">${prefs.tutDone ? 'Tutorials' : 'Tutorials <i>new</i>'}</button><button class="tbtn" type="button" id="tRules">Rules</button><button class="tbtn" type="button" id="tSet">Settings</button></div></div>
  <small class="tver">${E.VERSION}</small></div>`;
  const go = (id, fn) => { $(id, ov).onclick = () => { sfx('tick'); fn(); }; };
  go('#tPlay', () => { if (lobby) ONL.lobby(); else showArrange(); }); go('#tOnl', () => { if (lobby) ONL.lobby(); else showOnline(); });
  go('#tDaily', showDaily); go('#tChal', showChallenges); go('#tTut', showTutorials); go('#tRules', showRules); go('#tSet', showSettings);
}
async function missionStart(label, sub) {
  const gid = loopId, v = el('div', 'mis'); v.id = 'mis';
  v.innerHTML = `<div class="mgrid"></div><div class="mline top"></div><div class="mline bot"></div><div class="mtag">${esc(sub || '')}</div><div class="mtxt">${[...(label || 'MISSION START')].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div><div class="msub">Tap to skip</div>`;
  document.body.appendChild(v);
  let skip = false; v.addEventListener('pointerdown', () => { skip = true; });
  const wait = async ms => { const t0 = performance.now(); while (!skip && performance.now() - t0 < ms) await sleep(40); };
  sfx('mstart');
  await wait(RM ? 900 : 2100);
  v.classList.add('out'); await sleep(RM ? 0 : 380); v.remove();
}
function showArrange() {
  UI.mode = 'arrange'; let sel = 0, swapping = false, first = true, dragEnd = 0, lq = '', lsort = 'deck', ldir = 1; const ov = $('#arrange'); ov.classList.add('on'); $('#over').classList.remove('on'); $('#title').classList.remove('on');
  const statBar = (k, v, d) => `<div class="sb"><span class="sl"><img src="${ICO[k]}" alt="">${SHORT[k]}</span><span class="st"><i style="--w:${Math.min(100, v / 10 * 100)}%"></i></span><b>${v}</b></div>`;
  const panel = key => {
    if (!key) return `<div class="ahead"><b>Empty slot</b><span>${ROLE[sel]} ${sel + 1}</span></div><p class="blurb">Pick an agent from the roster below and tap Add to squad, drag one in, or hit Random.</p>`;
    const d = DEFS[key], st0 = E.statsFor(key, sel), hp = Math.max(1, Math.round(d.hp * prefs.hp)), slotNote = sel < 4 ? (sel === 0 || sel === 3 ? 'Guard slot: can interrupt for the agent beside them' : 'Attack slot: hits harder, nobody guards for it') : 'On the bench';
    const brnNote = (E.statsFor(key, sel).BRN < 1 ? ' Has no Brains, so it cannot interrupt for a teammate.' : '') + (d.pair ? ' Must sit next to ' + DEFS[d.pair].name + ' (both or neither).' : '');
    return `<div class="ahead"><b>${d.name}</b><span>${d.role.toUpperCase()} &middot; ${(d.realRole || '').toUpperCase()} &middot; rests ${d.rest} after acting &middot; costs ${d.cost} hiring point${d.cost > 1 ? 's' : ''}</span></div>
      <p class="blurb">${d.blurb}</p>
      <div class="hpbig"><b>${hp}</b><span>HP in duel &middot; ${d.hp} on card at ${Math.round(prefs.hp * 100)}% Tune</span></div>
      <div class="sbs">${STATS.map(k => statBar(k, st0[k])).join('')}</div>
      <div class="abl">${d.abilities.map(x => `<div class="ab"><span>${x.cost === 'X' ? 'X DATA' : (x.id === 'fp' ? 'ALL DATA' : x.cost + ' DATA')}</span><b>${x.name}</b><br>${x.text}</div>`).join('')}</div>
      <p class="note">${slotNote}.${brnNote}</p>`;
  };
  const draw = () => {
    ov.innerHTML = `<div class="inner arr"><div class="abrand"><b>ANOMEX</b><span>LINKED</span></div><h2>Build your squad</h2>
      <div class="decks"></div><div class="dkrow"></div><div class="budget"></div>
      <p class="sub">Tap a card to inspect it, or drag it onto a squad slot to swap. Slots 1 and 4 guard, 2 and 3 attack.</p>
      <div class="tiles squad"></div>
      <div class="libbar"><div class="srow"><input class="lsearch" type="search" placeholder="Search agents" aria-label="Search agents" autocomplete="off" spellcheck="false"><button class="mini rnd" type="button" id="aRand">Random</button><button class="mini" type="button" id="aClear">Clear</button></div><div class="lsort" role="group" aria-label="Sort agents"></div></div>
      <div class="libwrap"><button class="larr l" type="button" aria-label="Scroll left">&#9664;</button><div class="lib"></div><button class="larr r" type="button" aria-label="Scroll right">&#9654;</button></div>
      <div class="swaprow"></div>
      <div class="apanel"></div>
      <div class="cpurow"><span>CPU level</span>${[1, 2, 3, 4, 5].map(n => `<button class="lchip${prefs.ai === n ? ' on' : ''}" type="button" data-ai="${n}">${n}</button>`).join('')}<b id="aiName">${AI_NAMES[prefs.ai]}</b></div>
      <div class="btnrow abot"><button class="btn" type="button" id="aMenu">Menu</button><button class="btn" type="button" id="aOnl" style="display:none">Back to lobby</button><button class="btn primary" type="button" id="aGo">Start duel</button></div></div>`;
    const bar = $('.decks', ov), dkrow = $('.dkrow', ov);
    decks.forEach((d, i) => { const b = el('button', 'dk' + (i === activeDeck ? ' on' : '')); b.type = 'button'; b.textContent = d.name; b.onclick = () => { if (i === activeDeck) return; sfx('tick'); activeDeck = i; roster = decks[i].order; saveDecks(); sel = 0; swapping = false; first = true; draw(); }; bar.appendChild(b); });
    if (decks.length < 5) { const b = el('button', 'dk add', '+'); b.type = 'button'; b.setAttribute('aria-label', 'New deck'); b.onclick = () => { sfx('tick'); decks.push({ name: 'Deck ' + (decks.length + 1), order: emptyOrder() }); activeDeck = decks.length - 1; roster = decks[activeDeck].order; saveDecks(); sel = 0; swapping = false; first = true; draw(); }; bar.appendChild(b); }
    const inp = el('input', 'dkname'); inp.value = decks[activeDeck].name; inp.maxLength = 14; inp.setAttribute('aria-label', 'Deck name'); inp.autocomplete = 'off'; inp.spellcheck = false;
    inp.oninput = () => { decks[activeDeck].name = inp.value.trim().slice(0, 14) || 'Deck ' + (activeDeck + 1); const bs = $$('.dk:not(.add)', bar); if (bs[activeDeck]) bs[activeDeck].textContent = decks[activeDeck].name; saveDecks(); };
    const dup = el('button', 'mini', 'Copy'); dup.type = 'button'; dup.onclick = () => { if (decks.length >= 5) return toast('Five decks max.'); sfx('tick'); decks.push({ name: (decks[activeDeck].name + ' 2').slice(0, 14), order: roster.slice() }); activeDeck = decks.length - 1; roster = decks[activeDeck].order; saveDecks(); sel = 0; first = true; draw(); };
    let armDel = false; const del = el('button', 'mini', 'Delete'); del.type = 'button'; del.onclick = () => { if (decks.length < 2) return toast('You need at least one deck.'); if (!armDel) { armDel = true; del.textContent = 'Sure?'; del.classList.add('arm'); setTimeout(() => { armDel = false; del.textContent = 'Delete'; del.classList.remove('arm'); }, 2200); return; } decks.splice(activeDeck, 1); activeDeck = Math.max(0, activeDeck - 1); roster = decks[activeDeck].order; saveDecks(); sel = 0; first = true; draw(); };
    dkrow.append(inp, dup, del);
    { const used = E.squadCost(teamOf()), B = E.CFG.budget, bg = $('.budget', ov); bg.classList.toggle('over', used > B);
      bg.innerHTML = `<span>HIRING POINTS</span><b>${used}<i> / ${B}</i></b><div class="bbar"><u style="width:${Math.min(100, used / B * 100)}%"></u></div>`; }
    let lf = UI.landed; UI.landed = null;
    const mkTile = (key, i, n) => {
      const t = el('div', 'tile' + (sel === i ? ' pick' : '') + (i >= 4 ? ' bench' : '') + (swapping && sel !== i ? ' target' : '') + (first ? ' enter' : '') + (lf && lf.includes(i) ? ' landed' + (i < 4 ? ' hot' : '') : '')); t.dataset.i = i; t.style.setProperty('--i', n); t.tabIndex = 0; t.setAttribute('role', 'button'); t.setAttribute('aria-label', `${key ? DEFS[key].name : 'Empty'}, ${i < 4 ? 'slot ' + (i + 1) : 'bench'}`);
      const lab = el('div', 'lab', i < 4 ? ROLE[i] + ' ' + (i + 1) : 'BENCH'), slot = el('div', 'tslot');
      if (key) { const w = buildCard(pseudoUnit(key, i)); w.tabIndex = -1; $$('.notch', w).forEach(n => { n.style.pointerEvents = 'none'; }); slot.appendChild(w); t.append(lab, slot, el('div', 'cap', DEFS[key].name), el('div', 'tcost', String(DEFS[key].cost))); }
      else { t.classList.add('empty'); slot.appendChild(el('div', 'eslot', '<i>+</i>')); t.append(lab, slot, el('div', 'cap', 'Empty')); }
      if (lf && lf.includes(i)) { const fx = el('div', 'landfx'); for (let k = 0; k < 10; k++) { const sp = el('i'); sp.style.setProperty('--a', (k * 36 + (i * 17) % 20) + 'deg'); sp.style.setProperty('--d', (28 + (k % 3) * 12) + 'px'); fx.appendChild(sp); } slot.appendChild(fx); setTimeout(() => fx.remove(), 800); }
      if (key) t.addEventListener('pointerdown', e => dragStart(e, t, i));
      const act = () => {
        if (Date.now() - dragEnd < 350) return;
        sfx('tick');
        if (swapping && sel !== i) { const x = roster[sel], from = sel; roster[sel] = roster[i]; roster[i] = x; sel = i; swapping = false; UI.landed = [from, i]; saveDecks(); }
        else { sel = i; swapping = false; }
        draw();
      };
      t.addEventListener('click', act); t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
      return t;
    };
    const squadEl = $('.squad', ov); for (let i = 0; i < 4; i++) squadEl.appendChild(mkTile(roster[i], i, i));
    const lib = $('.lib', ov), lsearch = $('.lsearch', ov), lsortEl = $('.lsort', ov), arL = $('.larr.l', ov), arR = $('.larr.r', ov);
    const SORTS = [['deck', 'Deck'], ['name', 'A-Z'], ['cost', 'Cost'], ['STR', 'STR'], ['AGI', 'AGI'], ['BRN', 'BRN'], ['DATA', 'DATA']];
    const arrows = () => { const m = lib.scrollWidth - lib.clientWidth; arL.classList.toggle('off', lib.scrollLeft < 4); arR.classList.toggle('off', lib.scrollLeft > m - 4); arL.parentNode.classList.toggle('noscroll', m < 6); };
    const sval = key => lsort === 'name' ? DEFS[key].name.toLowerCase() : lsort === 'cost' ? DEFS[key].cost : DEFS[key].stats[lsort];
    const fillLib = keepScroll => {
      const prev = lib.scrollLeft; lib.innerHTML = '';
      const ql = lq.trim().toLowerCase();
      const items = roster.map((key, i) => ({ key, i })).filter(x => x.key && x.i >= 4 && (!ql || (DEFS[x.key].name + ' ' + (DEFS[x.key].short || '') + ' ' + DEFS[x.key].role).toLowerCase().includes(ql)));
      if (lsort !== 'deck') items.sort((a, b) => { const x = sval(a.key), y = sval(b.key); return ((x < y ? -1 : x > y ? 1 : 0) * ldir) || DEFS[a.key].name.localeCompare(DEFS[b.key].name); });
      if (!items.length) lib.appendChild(el('p', 'lempty', 'No agents match.'));
      items.forEach((x, n) => lib.appendChild(mkTile(x.key, x.i, n)));
      lib.scrollLeft = keepScroll ? prev : 0; arrows();
    };
    lsearch.value = lq; lsearch.oninput = () => { lq = lsearch.value; fillLib(false); };
    lsearch.onkeydown = e => { if (e.key === 'Enter') lsearch.blur(); };
    const paintSort = () => { lsortEl.innerHTML = ''; SORTS.forEach(([k, nm]) => { const b = el('button', 'lchip' + (lsort === k ? ' on' : ''), (STATS.includes(k) ? `<img src="${ICO[k]}" alt="">` : '') + nm + (lsort === k && k !== 'deck' ? (ldir > 0 ? ' &#9650;' : ' &#9660;') : '')); b.type = 'button';
      b.onclick = () => { sfx('tick'); if (lsort === k) { if (k !== 'deck') ldir = -ldir; } else { lsort = k; ldir = (k === 'name' || k === 'cost') ? 1 : -1; } paintSort(); fillLib(false); }; lsortEl.appendChild(b); }); };
    paintSort();
    $('#aRand', ov).onclick = () => {
      let pick = null; for (let tr = 0; tr < 800 && !pick; tr++) { const pool = ROSTER_ALL.slice(); for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; } const four = pool.slice(0, 4); if (E.validSquad(four).ok) pick = four; }
      if (!pick) return; const rest = ROSTER_ALL.filter(k => !pick.includes(k)); roster = decks[activeDeck].order = pick.concat(rest, [null, null, null, null]);
      sfx('whoosh'); sfx('tick'); UI.landed = [0, 1, 2, 3]; sel = 0; swapping = false; saveDecks(); draw();
    };
    $('#aClear', ov).onclick = () => { if (!roster.slice(0, 4).some(Boolean)) return; sfx('tick'); const rest = roster.filter((k, i) => k && i >= 4).concat(roster.slice(0, 4).filter(Boolean)); roster = decks[activeDeck].order = [null, null, null, null].concat(rest); sel = 0; swapping = false; UI.landed = null; saveDecks(); draw(); };
    const prevScroll = UI.libScroll || 0; fillLib(false); lib.scrollLeft = prevScroll; arrows();
    lib.addEventListener('scroll', () => { UI.libScroll = lib.scrollLeft; arrows(); }, { passive: true });
    const nudge = d => { sfx('tick'); lib.scrollBy({ left: d * Math.max(120, lib.clientWidth * 0.8), behavior: 'smooth' }); };
    arL.onclick = () => nudge(-1); arR.onclick = () => nudge(1);
    lib.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && lib.scrollWidth > lib.clientWidth) { const m = lib.scrollWidth - lib.clientWidth, nx = lib.scrollLeft + e.deltaY; if ((e.deltaY < 0 && lib.scrollLeft > 0) || (e.deltaY > 0 && lib.scrollLeft < m)) { e.preventDefault(); lib.scrollLeft = Math.max(0, Math.min(m, nx)); } } }, { passive: false });
    lf = null;
    first = false;
    const dragStart = (e, t, i) => {
      if (e.button > 0 || UI.dnd) return;
      const sx = e.clientX, sy = e.clientY, touch = e.pointerType !== 'mouse'; let started = false, timer = null, ghost = null, raf = 0, px = sx, py = sy, overI = -1, lpx = -1, lpy = -1, lsy = -1;
      const clean = () => { clearTimeout(timer); cancelAnimationFrame(raf); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cn); ov.removeEventListener('scroll', onScr); window.removeEventListener('scroll', onScr); if (ghost) ghost.remove(); t.classList.remove('dragsrc'); $$('.tile.over', ov).forEach(x => x.classList.remove('over')); UI.dnd = false; };
      let rects = null, scr = 0;
      const onScr = () => { scr = ov.scrollTop + window.scrollY; };
      const track = () => {
        if (!started) return;
        { const lb = rects.lb, inY = py + scr >= lb.t + rects.s0 - 30 && py + scr <= lb.b + rects.s0 + 30; if (inY) { if (px < lb.l + 46) lib.scrollLeft -= 7; else if (px > lb.r - 46) lib.scrollLeft += 7; } }
        const lsx = lib.scrollLeft, moved = px !== lpx || py !== lpy || scr !== lsy || lsx !== (track.ll || 0); track.ll = lsx; lpx = px; lpy = py; lsy = scr;
        if (moved) {
          ghost.style.transform = `translate3d(${px}px,${py}px,0) translate(-50%,-55%) scale(1.08) rotate(3deg)`;
          const dy = scr - rects.s0; let ni = -1;
          const lx = lib.scrollLeft - rects.l0, inLb = px >= rects.lb.l && px <= rects.lb.r && py + scr >= rects.lb.t + rects.s0 && py + scr <= rects.lb.b + rects.s0;
          for (const q of rects.list) { if (q.inLib && !inLb) continue; const ql = q.inLib ? q.l - lx : q.l, qr = q.inLib ? q.r - lx : q.r; if (px >= ql && px <= qr && py + scr >= q.t + rects.s0 && py + scr <= q.b + rects.s0) { ni = q.t0 === t ? -1 : q.i; break; } }
          if (ni !== overI) { $$('.tile.over', ov).forEach(x => x.classList.remove('over')); if (ni >= 0) { const q = rects.list.find(z => z.i === ni); q.t0.classList.add('over'); sfx('tick'); } overI = ni; }
        }
        const m = 80, vh = window.innerHeight; if (py < m) { ov.scrollTop -= (m - py) * 0.25; window.scrollBy(0, -(m - py) * 0.25); } else if (py > vh - m) { ov.scrollTop += (py - (vh - m)) * 0.25; window.scrollBy(0, (py - (vh - m)) * 0.25); }
        raf = requestAnimationFrame(track);
      };
      const begin = () => {
        started = true; UI.dnd = true; try { navigator.vibrate && navigator.vibrate(12); } catch (er) {}
        const r = t.getBoundingClientRect(); ghost = t.cloneNode(true); ghost.classList.add('ghost'); ghost.classList.remove('pick', 'enter', 'landed'); ghost.style.width = r.width + 'px'; document.body.appendChild(ghost); t.classList.add('dragsrc'); sfx('whoosh');
        onScr(); const lb = lib.getBoundingClientRect(); rects = { s0: scr, l0: lib.scrollLeft, lb: { l: lb.left, r: lb.right, t: lb.top, b: lb.bottom }, list: $$('.tile', ov).filter(x => x.dataset.i != null).map(x => { const b = x.getBoundingClientRect(); return { t0: x, i: +x.dataset.i, l: b.left, r: b.right, t: b.top, b: b.bottom, inLib: lib.contains(x) }; }) };
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
    const vs = E.validSquad(teamOf()); $('#aGo').disabled = !vs.ok; const wn = el('p', 'warn', vs.ok ? '' : vs.reason + (/budget/.test(vs.reason) ? ' Swap in cheaper agents to start.' : /Fill/.test(vs.reason) ? '' : ' Swap them into place to start.')); wn.style.display = vs.ok ? 'none' : 'block'; $('.swaprow', ov).before(wn);
    const key = roster[sel], ap = $('.apanel', ov); ap.innerHTML = panel(key);
    requestAnimationFrame(() => requestAnimationFrame(() => ap.classList.add('on')));
    const sr = $('.swaprow', ov), firstEmpty = [0, 1, 2, 3].find(i => !roster[i]);
    const mkB = (txt, cls, fn) => { const b = el('button', 'btn' + (cls ? ' ' + cls : ''), txt); b.type = 'button'; b.onclick = () => { sfx('tick'); fn(); }; sr.appendChild(b); return b; };
    const moveTo = (from, to) => { const x = roster[from]; roster[from] = roster[to]; roster[to] = x; sel = to; swapping = false; UI.landed = [from, to].filter(q => q < 4); saveDecks(); sfx('whoosh'); draw(); };
    if (!key) { if (firstEmpty == null) mkB('Squad is full', '', () => {}).disabled = true; }
    else if (sel >= 4) {
      if (firstEmpty != null && !swapping) mkB('Add ' + DEFS[key].name + ' to ' + ROLE[firstEmpty] + ' ' + (firstEmpty + 1), 'primary', () => moveTo(sel, firstEmpty));
      mkB(swapping ? 'Tap a squad slot to swap in ' + DEFS[key].name + ' (cancel)' : (firstEmpty != null ? 'Put in a specific slot...' : 'Swap ' + DEFS[key].name + ' into the squad...'), swapping ? 'primary' : '', () => { swapping = !swapping; draw(); });
    } else {
      mkB(swapping ? 'Tap a card to swap with ' + DEFS[key].name + ' (cancel)' : 'Swap ' + DEFS[key].name + ' with...', swapping ? 'primary' : '', () => { swapping = !swapping; draw(); });
      if (!swapping) mkB('Remove from squad', '', () => { let bn = roster.findIndex((k, q) => q >= 4 && !k); if (bn < 0) { roster.push(null); bn = roster.length - 1; } const from = sel; roster[bn] = roster[from]; roster[from] = null; swapping = false; UI.landed = null; saveDecks(); sfx('whoosh'); draw(); });
    }
    $$('.cpurow .lchip', ov).forEach(b => { b.onclick = () => { prefs.ai = +b.dataset.ai; savePrefs(); sfx('tick'); $$('.cpurow .lchip', ov).forEach(x => x.classList.toggle('on', x === b)); $('#aiName', ov).textContent = AI_NAMES[prefs.ai]; }; });
    $('#aMenu').onclick = () => { sfx('tick'); showTitle(); }; if (ONL && ONL.lobby && !ONL.playing) { $('#aOnl').style.display = ''; $('#aOnl').onclick = () => { sfx('tick'); ONL.lobby(); }; $('#aGo').style.display = 'none'; } $('#aGo').onclick = () => { sfx('tick'); startGame(); };
  };
  ov.onscroll = () => ov.classList.toggle('scrolled', ov.scrollTop > 30);
  ov.classList.remove('scrolled'); draw();
}
function creditSummary() {
  const me = G.ctrl[0] === 'human' ? 0 : 1, L = (G.cr ? G.cr.log : []).filter(x => x[0] === me); if (!L.length) return '';
  const tot = L.reduce((n, x) => n + x[1], 0), cnt = {}; L.forEach(x => { const k = x[1] + '|' + x[2]; cnt[k] = (cnt[k] || 0) + 1; });
  const rows = Object.keys(cnt).map(k => { const [p, t] = k.split('|'); return `<li><b>+${p}</b> ${t.replace(/</g, '&lt;')}${cnt[k] > 1 ? ' x' + cnt[k] : ''}</li>`; }).join('');
  let life = tot; try { life += +(localStorage.getItem('anomex-credits') || 0); localStorage.setItem('anomex-credits', life); } catch (e) {}
  return `<div class="cpsum"><h3>Credit Points: ${tot}</h3><ul>${rows}</ul><small>Career total ${life}</small></div>`;
}
function removeVic() { const v = $('#vic'); if (v) v.remove(); $('#over').classList.remove('vwin'); }
async function victorySeq() {
  const v = el('div', 'vic'); v.id = 'vic';
  v.innerHTML = '<div class="vrays"></div><div class="vrays r2"></div><div class="vbloom"></div><div class="vline"></div><div class="vtxt">' + [...'VANQUISHED'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('') + '</div><div class="vsub">All opposing agents down</div>';
  document.body.appendChild(v);
  let skip = false; v.addEventListener('pointerdown', () => { skip = true; });
  const wait = async ms => { const t0 = performance.now(); while (!skip && performance.now() - t0 < ms) await sleep(40); };
  const cx = innerWidth / 2, cy = innerHeight * 0.42, R = Math.min(innerWidth, innerHeight);
  sfx('victory');
  if (RM) { v.classList.add('rm'); await wait(900); return; }
  const build = setInterval(() => { converge(cx, cy, 5, R * 0.55, COL_HIT, 0.5); }, 90);
  await wait(850); clearInterval(build);
  if (skip) return;
  flash(0.95, 700); shake(14, 0.7); warp(1.4);
  ring(cx, cy, R * 0.25, 0, '255,255,255', 5, 0.7, 6); ring(cx, cy, R * 0.5, 0.06, '255,255,255', 3, 0.9, 6); ring(cx, cy, R * 0.8, 0.12, '255,154,74', 2, 1.1, 6);
  lens(cx, cy, R * 0.6, 0, 0.9, '255,255,255'); glow(cx, cy, R * 0.9, 0.9, '255,255,255');
  shockLines(cx, cy, 44, R * 0.05, R * 0.5, R * 1.6, '#ffffff'); sparks(cx, cy, 70, R * 0.9, COL_FIELD); twinkles(cx, cy, 60, R * 0.35, COL_HIT, { speed: 2.2, life: 1.6, size: 1.2 });
  const rain = setInterval(() => { twinkles(Math.random() * innerWidth, innerHeight * (0.1 + Math.random() * 0.6), 4, 30, COL_HIT, { rise: true, life: 1.4 }); }, 120);
  await wait(900); if (!skip) { ring(cx, cy, R * 0.35, 0, '255,255,255', 2, 0.8, 6); twinkles(cx, cy, 24, R * 0.4, COL_FIELD, { speed: 1.6 }); }
  await wait(1500); clearInterval(rain);
}
async function defeatSeq() {
  const v = el('div', 'vic def'); v.id = 'vic';
  v.innerHTML = '<div class="dvig"></div><div class="dash">' + Array.from({ length: 26 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${3 + (i * 7) % 5}s;--w:${(i * 0.23) % 2.2}s;--s:${2 + (i % 3)}px"></i>`).join('') + '</div><div class="vline"></div><div class="vtxt">' + [...'DEFEATED'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('') + '</div><div class="vsub">Your squad has fallen</div>';
  document.body.appendChild(v);
  let skip = false; v.addEventListener('pointerdown', () => { skip = true; });
  const wait = async ms => { const t0 = performance.now(); while (!skip && performance.now() - t0 < ms) await sleep(40); };
  sfx('defeat');
  if (RM) { v.classList.add('rm'); await wait(900); return; }
  await wait(900); if (!skip) shake(9, 0.6);
  await wait(2300);
}
async function showOver() {
  liveSet(false);
  const w = G.winner, ov = $('#over'), win = w === 0, g0 = G, D = G.daily, dres = D ? dailyRecord() : null;
  chalEnd(dres); const nch = (G.newChal || []).map(x => `<li><b>\u2713</b> ${x}</li>`).join('');
  if (w === 1) { await defeatSeq(); if (G !== g0 || !G.over || $('#arrange').classList.contains('on')) { removeVic(); return; } $('#vic').classList.add('settle'); }
  if (win) { await victorySeq(); if (G !== g0 || !G.over || $('#arrange').classList.contains('on')) { removeVic(); return; } $('#vic').classList.add('settle'); }
  ov.innerHTML = `<div class="verdict ${win ? 'win' : 'lose'}">${w === -1 ? '<h1>Stalemate</h1>' : ''}<p>${w === -1 ? 'Nobody could finish it.' : win ? '' : 'Your squad was wiped out.'} Round ${Math.ceil(G.turnNo / 2)}.</p>${nch ? `<div class="cpsum"><h3>Challenge complete</h3><ul>${nch}</ul></div>` : ''}${dres ? dailyHtml(dres) : creditSummary()}
    <div class="btnrow" style="max-width:380px;margin:16px auto 0"><button class="btn" type="button" id="oOrder">${ONL ? 'Leave' : 'Squad order'}</button>${dres ? '<button class="btn" type="button" id="oShare">Share</button>' : ''}<button class="btn primary" type="button" id="oAgain">${D ? 'Retry' : 'Rematch'}</button></div></div>`;
  ov.classList.toggle('vwin', win || w === 1); ov.classList.add('on'); if (w === -1) sfx('lose');
  $('#oAgain').onclick = () => { if (ONL) return rematchAsk(); ov.classList.remove('on'); removeVic(); startGame(['human', 'cpu'], D ? { daily: D } : undefined); };
  if (dres) $('#oShare').onclick = () => dailyShare(dres);
  $('#oOrder').onclick = () => { ov.classList.remove('on'); removeVic(); if (ONL) leaveOnline(); showArrange(); };
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
  ov.classList.add('on'); if (ONL && w !== -1) { rateMatch(win); eloNote(); } $('#oOrder').onclick = () => { ov.classList.remove('on'); leaveOnline(); showArrange(); };
}
function forfeitMatch() {
  if (!ONL || !ONL.playing || ONL.ended) return;
  ONL.ended = true; Net.send({ t: 'forfeit' }); setBan(); liveSet(false); loopId++; closeMenus(); stopHint(); $('#panel').classList.remove('on');
  rateMatch(false); endScreen('lose', 'Forfeited', "You left the match, so you can't play online for 5 minutes."); eloNote();
}
function quitToSquad() { tutKill(); loopId++; closeMenus(); stopHint(); $('#panel').classList.remove('on'); $('#over').classList.remove('on'); showArrange(); }
function showOptions() {
  const live = !!(G && !G.over && !$('#arrange').classList.contains('on') && !(ONL && ONL.ended));
  const online = !!(ONL && ONL.playing);
  showPanel(`<h2>Options</h2><div class="btnrow col opts"><button class="btn" type="button" id="opRules">Rules</button>${live ? '' : '<button class="btn" type="button" id="opTut">Tutorials</button>'}<button class="btn" type="button" id="opLog">Log</button><button class="btn" type="button" id="opSet">Settings</button><button class="btn" type="button" id="opTune">Tune</button><button class="btn" type="button" id="opSnd"></button></div>
    ${live ? `<h3 class="opth">Match</h3><div class="btnrow col opts"><button class="btn danger" type="button" id="opLeave">${online ? 'Forfeit match' : 'Quit to squad'}</button></div><p class="note">${online ? "You lose the match and can't play online for 5 minutes." : 'Ends this duel. Nothing is lost.'}</p>` : ''}
    <div class="btnrow"><button class="btn primary pclose" type="button">Close</button></div><p class="note" style="text-align:center;margin-top:14px">Version ${E.VERSION}</p>`, p => {
    const snd = $('#opSnd', p), sy = () => { snd.textContent = 'Sound: ' + (prefs.sfx ? 'On' : 'Off'); };
    sy(); snd.onclick = () => { prefs.sfx = !prefs.sfx; savePrefs(); sy(); if (prefs.sfx) sfx('tick'); };
    $('#opRules', p).onclick = () => { sfx('tick'); showRules(); }; const ot = $('#opTut', p); if (ot) ot.onclick = () => { sfx('tick'); showTutorials(); }; $('#opLog', p).onclick = () => { sfx('tick'); showLog(); }; $('#opSet', p).onclick = () => { sfx('tick'); showSettings(); }; $('#opTune', p).onclick = () => { sfx('tick'); showTune(); };
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
function leaveOnline() { liveSet(false); chatShow(false); try { Net.reset(); } catch (e) { /* closed */ } if (ONL && ONL.cfg0) Object.assign(CFG, ONL.cfg0); ONL = null; Net.onState = () => {}; }
function rematchAsk() {
  ONL.me = true; Net.send({ t: 'rematch' }); const b = $('#oAgain'); if (b) { b.disabled = true; b.textContent = 'Waiting for friend...'; }
  rematchTry();
}
function rematchTry() { if (ONL && ONL.role === 'host' && ONL.me && ONL.them) { ONL.me = ONL.them = false; Net.send({ t: 'lobby' }); ONL.mine = null; ONL.opp = null; ONL.starting = false; $('#over').classList.remove('on'); loopId++; if (ONL.lobby) ONL.lobby(); } }
function hostStart() {
  CFG.hpScale = prefs.hp; CFG.attackCostFrac = prefs.half ? 0.5 : 1; CFG.clash = prefs.clash; CFG.hideStats = prefs.hide !== false;
  const hostFirst = Math.random() < 0.5; ONL.me = ONL.them = false;
  Net.send({ t: 'start', hostFirst, cfg: Object.assign({}, CFG, { hideStats: prefs.hide !== false }) }); beginOnline(hostFirst);
}
function beginOnline(hostFirst) {
  const myFirst = ONL.role === 'host' ? hostFirst : !hostFirst;
  ONL.n = 0; ONL.loc = {}; ONL.rem = {}; ONL.me = ONL.them = false; ONL.rated = false; ONL.eloD = undefined; ONL.playing = true; ONL.ended = false; liveSet(true); $('#onl').classList.remove('on'); $('#over').classList.remove('on');
  startGame(['human', 'remote'], { opp: ONL.opp, first: myFirst ? 0 : 1 });
  toast(myFirst ? 'You go first.' : 'Your friend goes first.');
}
/* ---------- profile, chat filter, chat ---------- */
const DEV = (() => { const ua = navigator.userAgent || '', touch = (navigator.maxTouchPoints || 0) > 1; if (/iPad|Tablet/i.test(ua) || (/Macintosh/.test(ua) && touch) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet'; if (/Mobi|iPhone|Android/i.test(ua)) return 'phone'; return 'desktop'; })();
const DEV_SVG = {
  phone: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  tablet: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M11 18h2"/></svg>',
  desktop: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/></svg>'
};
const devIcon = d => `<span class="dev" title="${d}">${DEV_SVG[d] || DEV_SVG.phone}</span>`;
const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', '$': 's', '!': 'i', '|': 'i', '(': 'c', '+': 't' };
/* words checked as whole tokens (after look-alike swaps and collapsing repeats) */
const BAD_WORDS = ['nigger', 'nigga', 'nigguh', 'coon', 'darkie', 'spic', 'spick', 'wetback', 'beaner', 'chink', 'gook', 'zipperhead', 'paki', 'kike', 'kyke', 'gypsy', 'gyppo', 'towelhead', 'raghead', 'sandnigger', 'redskin', 'injun', 'jap', 'faggot', 'fagot', 'fag', 'dyke', 'tranny', 'shemale', 'retard', 'retarded', 'spaz', 'mongoloid', 'heil', 'sieg', 'kys', 'nazi', 'whitepower', 'whitepride', 'wetbacks', '1488', '14words'];
/* roots that are safe to catch even inside other text or spaced out */
const BAD_ROOTS = ['nigger', 'faggot', 'retard', 'tranny', 'sandnigger', 'wetback', 'towelhead', 'raghead', 'whitepower'];
const rxParts = r => { const o = []; let i = 0; while (i < r.length) { let j = i; while (j < r.length && r[j] === r[i]) j++; o.push(r[i] + '{' + (j - i) + ',}'); i = j; } return o.join(''); };
const rootRx = BAD_ROOTS.map(r => new RegExp(rxParts(r)));
const lookalike = s => String(s).normalize('NFKD').replace(/[̀-ͯ​-‏⁠﻿]/g, '').toLowerCase().replace(/[0134578@$!|(+]/g, c => LEET[c]);
const wordRx = BAD_WORDS.map(w => new RegExp('^' + rxParts(lookalike(w).replace(/[^a-z]/g, '')) + 's?$'));
function cleanText(s) {
  s = String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').slice(0, 140);
  const sq = lookalike(s).replace(/[^a-z]/g, '');
  if (rootRx.some(r => r.test(sq))) return '***';
  return s.split(/(\s+)/).map(tok => {
    if (!tok.trim()) return tok;
    const core = lookalike(tok).replace(/[^a-z]/g, ''); if (!core) return tok;
    return wordRx.some(r => r.test(core)) ? '***' : tok;
  }).join('');
}
const cleanName = s => { const n = cleanText(String(s || '').replace(/\s+/g, ' ').trim()).slice(0, 14).trim(); return !n || /\*\*\*/.test(n) ? 'Player' : n; };
const SC = {}; ('smile:😄,grin:😁,joy:😂,lol:😂,rofl:🤣,wink:😉,blush:😊,heart_eyes:😍,sunglasses:😎,cool:😎,thinking:🤔,hmm:🤔,sweat:😅,sweat_smile:😅,cry:😢,sob:😭,angry:😠,rage:😡,scream:😱,skull:💀,dead:💀,ghost:👻,robot:🤖,alien:👽,fire:🔥,boom:💥,sparkles:✨,star:⭐,zap:⚡,snowflake:❄️,eyes:👀,brain:🧠,muscle:💪,strong:💪,thumbsup:👍,thumbsdown:👎,clap:👏,pray:🙏,wave:👋,ok:👌,point_right:👉,fist:✊,handshake:🤝,heart:❤️,broken_heart:💔,blue_heart:💙,100:💯,gg:🤝,sword:⚔️,swords:⚔️,shield:🛡️,dagger:🗡️,bomb:💣,target:🎯,trophy:🏆,crown:👑,medal:🏅,gem:💎,key:🔑,lock:🔒,bulb:💡,gear:⚙️,link:🔗,chart:📈,warning:⚠️,x:❌,check:✅,question:❓,exclamation:❗,zzz:💤,party:🎉,tada:🎉,cake:🎂,pizza:🍕,coffee:☕,cat:🐱,dog:🐶,wolf:🐺,fox:🦊,bat:🦇,snake:🐍,dragon:🐉,rocket:🚀,moon:🌙,sun:☀️,rain:🌧️,rainbow:🌈,hourglass:⏳,clock:⏰,flag:🏳️,wow:😮,oops:😬,sad:😞,smirk:😏,pensive:😔,yawn:🥱,sleepy:😴,pleading:🥺,salute:🫡,shrug:🤷,facepalm:🤦,nerd:🤓,clown:🤡,devil:😈,angel:😇,tired:😩,sus:🤨').split(',').forEach(p => { const i = p.indexOf(':'); SC[p.slice(0, i)] = p.slice(i + 1); });
const emojify = s => s.replace(/:([a-z0-9_+]{1,16}):/gi, (m, k) => SC[k.toLowerCase()] || m);
const QUICK = ['GG', 'Good luck!', 'Nice one', 'Oops', 'Rematch?', 'One sec'];
const CHAT = { open: false, unread: 0, mute: false, last: 0, built: false, stamps: [] };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function chatBuild() {
  if (CHAT.built) return; CHAT.built = true;
  document.body.insertAdjacentHTML('beforeend', `<button id="chatBtn" type="button" aria-label="Chat" hidden><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8" cy="10.5" r="1.2" fill="currentColor"/><circle cx="12" cy="10.5" r="1.2" fill="currentColor"/><circle cx="16" cy="10.5" r="1.2" fill="currentColor"/></svg><i id="chatDot"></i></button>
  <div id="chat" role="dialog" aria-label="Chat"><div class="chh"><b id="chTitle">Chat</b><button type="button" id="chMute">Mute</button><button type="button" id="chClose" aria-label="Close chat">&times;</button></div>
  <div id="chLog" aria-live="polite"></div><div id="chQuick">${QUICK.map(q => `<button type="button" class="cq">${q}</button>`).join('')}</div>
  <div id="chEmo" hidden>${Object.keys(SC).filter((k, i, a) => a.findIndex(x => SC[x] === SC[k]) === i).slice(0, 64).map(k => `<button type="button" data-k="${k}">${SC[k]}</button>`).join('')}</div>
  <form id="chForm" autocomplete="off"><button type="button" id="chE" aria-label="Emoji">&#9786;</button><input id="chIn" maxlength="120" placeholder="Say something. :fire: works" enterkeyhint="send"><button type="submit" id="chSend">Send</button></form></div>`);
  $('#chatBtn').onclick = () => chatToggle(); $('#chClose').onclick = () => chatToggle(false);
  $('#chMute').onclick = () => { CHAT.mute = !CHAT.mute; $('#chMute').textContent = CHAT.mute ? 'Unmute' : 'Mute'; $('#chMute').classList.toggle('on', CHAT.mute); chatLine('', CHAT.mute ? 'Chat muted. You will not see their messages.' : 'Chat unmuted.', 'sys'); };
  $('#chE').onclick = () => { const e = $('#chEmo'); e.hidden = !e.hidden; };
  $('#chEmo').onclick = e => { const b = e.target.closest('button[data-k]'); if (!b) return; const i = $('#chIn'); i.value += SC[b.dataset.k]; i.focus(); };
  $('#chQuick').onclick = e => { const b = e.target.closest('.cq'); if (b) chatSend(b.textContent); };
  $('#chForm').onsubmit = e => { e.preventDefault(); const i = $('#chIn'); if (chatSend(i.value)) i.value = ''; };
  ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(ev => $('#chat').addEventListener(ev, e => e.stopPropagation()));
}
function chatLine(who, text, cls) {
  const l = $('#chLog'); if (!l) return; const d = el('div', 'cl ' + (cls || ''));
  d.innerHTML = who ? `<b>${esc(who)}</b> ${esc(text)}` : esc(text); l.appendChild(d); while (l.children.length > 60) l.removeChild(l.firstChild); l.scrollTop = l.scrollHeight;
}
function chatBadge() {
  if (CHAT.open) CHAT.unread = 0; const d = $('#chatDot'); if (!d) return;
  d.textContent = CHAT.unread > 9 ? '9+' : String(CHAT.unread || ''); d.classList.toggle('on', CHAT.unread > 0);
}
function chatBump() { const b = $('#chatBtn'); if (!b) return; b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
function chatToggle(on) {
  chatBuild(); CHAT.open = on === undefined ? !CHAT.open : on; $('#chat').classList.toggle('on', CHAT.open);
  document.body.classList.toggle('chopen', CHAT.open); chatBadge(); if (CHAT.open) { sfx('copen'); $('#chLog').scrollTop = 1e6; setTimeout(() => { const i = $('#chIn'); if (i && innerWidth >= 800) i.focus(); }, 60); }
}
function chatShow(on) {
  chatBuild(); $('#chatBtn').hidden = !on;
  if (!on) { chatToggle(false); $('#chLog').innerHTML = ''; CHAT.unread = 0; chatBadge(); CHAT.stamps = []; }
  else { $('#chTitle').innerHTML = 'Chat' + (ONL && ONL.oppInfo ? ' with ' + esc(ONL.oppInfo.name) : ''); }
}
function chatSend(text) {
  text = emojify(cleanText(String(text || '').trim())).trim(); if (!text || !ONL) return false;
  const now = Date.now(); if (now - CHAT.last < 500) { toast('Slow down a bit.'); return false; } CHAT.last = now;
  Net.send({ t: 'chat', m: text }); chatLine('You', text, 'me'); sfx('csend'); return true;
}
function chatRecv(m) {
  if (!ONL || typeof m.m !== 'string') return;
  const now = Date.now(); CHAT.stamps = CHAT.stamps.filter(t => now - t < 4000); if (CHAT.stamps.length >= 5) return; CHAT.stamps.push(now);
  if (CHAT.mute) return;
  const text = emojify(cleanText(m.m)).trim(); if (!text) return;
  chatLine(ONL.oppInfo ? ONL.oppInfo.name : 'Friend', text, 'them');
  if (!CHAT.open) { CHAT.unread++; chatBadge(); chatBump(); sfx('msg'); } else sfx('msg2');
}
const myName = () => { if (!prefs.name) { prefs.name = 'Agent' + (100 + Math.floor(Math.random() * 900)); savePrefs(); } return cleanName(prefs.name); };
function rateMatch(win) {
  if (!ONL || ONL.rated || !ONL.oppInfo) return;
  ONL.rated = true; const me = prefs.elo || 1000, op = ONL.oppInfo.elo, ex = 1 / (1 + Math.pow(10, (op - me) / 400)), d = Math.round(32 * ((win ? 1 : 0) - ex));
  ONL.eloFrom = me; prefs.elo = Math.max(100, me + d); prefs.games = (prefs.games || 0) + 1; if (win) prefs.wins = (prefs.wins || 0) + 1; savePrefs(); ONL.eloD = d;
}
function eloNote() {
  if (!ONL || ONL.eloD === undefined) return; const b = document.querySelector('#over .btnrow'); if (!b || document.querySelector('#over .eloLine')) return;
  b.insertAdjacentHTML('beforebegin', `<p class="eloLine">Rating ${ONL.eloFrom} &rarr; ${prefs.elo} (${ONL.eloD >= 0 ? '+' : ''}${ONL.eloD})</p>`);
}
function showOnline() {
  const ov = $('#onl'); ov.classList.add('on');
  const body = (h, f) => { ov.innerHTML = `<div class="inner onl">${h}</div>`; f && f(); };
  const menu = () => {
    leaveOnline();
    body(`<h2>Online duel</h2><p class="blurb">Play a friend on another phone. One of you makes an invite code, the other types it in. You both pick a squad once you're connected.</p><div class="prof"><label for="nName">Your name</label><input id="nName" maxlength="14" autocomplete="off" spellcheck="false" value="${esc(myName())}"><span class="pe">${devIcon(DEV)} Rating <b>${prefs.elo || 1000}</b> &middot; ${prefs.wins || 0}W ${(prefs.games || 0) - (prefs.wins || 0)}L</span></div>${banLeft() ? '<p class="warn">Online cooldown: ' + fmtT(banLeft()) + ' left, because you left a match early.</p>' : ''}
      <div class="btnrow col"><button class="btn primary" type="button" id="nHost">Make invite code</button><button class="btn" type="button" id="nJoin">I have a code</button><button class="btn ghost" type="button" id="nBack">Back</button></div>${Net.ok ? '' : '<p class="warn">Online play could not load here.</p>'}`, () => {
      $('#nName').onchange = () => { prefs.name = cleanName($('#nName').value); $('#nName').value = prefs.name; savePrefs(); }; $('#nBack').onclick = () => ov.classList.remove('on'); $('#nHost').onclick = host; $('#nJoin').onclick = join; if (!Net.ok) { $('#nHost').disabled = true; $('#nJoin').disabled = true; }
    });
  };
  const gate = () => { const b = banLeft(); if (b > 0) { toast('Online cooldown: ' + fmtT(b) + ' left.'); return false; } return true; };
  const lobby = () => {
    if (!ONL) return; ONL.playing = false; ONL.lobby = lobby; ov.classList.add('on');
    const vs = E.validSquad(teamOf()), cost = E.squadCost(teamOf()), rd = !!ONL.mine, st = ONL.opp ? 'Your friend is ready.' : 'Your friend is choosing a squad...';
    const deckBtns = decks.map((d, i) => `<button type="button" class="dk${i === activeDeck ? ' on' : ''}" data-i="${i}"${rd ? ' disabled' : ''}>${String(d.name).replace(/[<>&]/g, '')}</button>`).join('');
    body(`<h2>Choose your squad</h2>${ONL.oppInfo ? `<p class="vsline">${devIcon(DEV)} <b>${esc(myName())}</b> ${prefs.elo || 1000} <i>vs</i> ${devIcon(ONL.oppInfo.dev)} <b>${esc(ONL.oppInfo.name)}</b> ${ONL.oppInfo.elo}</p>` : ''}<p class="blurb">${rd ? 'You are ready. Waiting for your friend...' : st}</p>
      <div class="decks">${deckBtns}</div>
      <div class="lsq">${teamOf().map((k, i) => k ? `<div class="lag"><img src="icons/${k}.png" alt=""><b>${DEFS[k].short || DEFS[k].name}</b><span>${ROLE[i]} &middot; ${DEFS[k].cost}</span></div>` : `<div class="lag"><b>Empty</b><span>${ROLE[i]} &middot; pick an agent</span></div>`).join('')}</div>
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
      if (st === 'open') Net.send({ t: 'hello', sig: defsSig(), name: myName(), elo: prefs.elo || 1000, dev: DEV });
      else if (st === 'lost') { if (ONL && ONL.playing) { if (G && !G.over && !ONL.ended) onlineLost(); } else { ov.classList.add('on'); toast('Connection lost.'); menu(); } }
    };
    Net.on('hello', m => {
      if (m.sig !== defsSig()) { Net.send({ t: 'reject', why: 'Different game versions. Both of you reload the page.' }); ov.classList.add('on'); toast('Different game versions. Both of you reload the page.'); menu(); return; }
      ONL.oppInfo = { name: cleanName(m.name), elo: Math.max(100, Math.min(4000, Math.round(+m.elo) || 1000)), dev: ['phone', 'tablet', 'desktop'].includes(m.dev) ? m.dev : 'phone' };
      chatShow(true); toast('Linked with ' + ONL.oppInfo.name + '.');
      lobby();
    });
    Net.on('chat', chatRecv);
    Net.on('ready', m => {
      const vs = Array.isArray(m.squad) && m.squad.length === 4 && m.squad.every(k => DEFS[k]) ? E.validSquad(m.squad) : { ok: false, reason: 'bad squad' };
      if (!vs.ok) { Net.send({ t: 'reject', why: 'Their squad is not legal: ' + vs.reason }); ov.classList.add('on'); toast('Their squad is not legal.'); menu(); return; }
      ONL.opp = m.squad.slice(); if (ONL.lobby && !ONL.playing && !ONL.starting) ONL.lobby(); tryStart();
    });
    Net.on('forfeit', () => { if (!ONL || !ONL.playing || ONL.ended) return; ONL.ended = true; loopId++; closeMenus(); stopHint(); liveSet(false); $('#panel').classList.remove('on'); sfx('win'); rateMatch(true); endScreen('win', 'Victory', 'Your friend forfeited.'); eloNote(); });
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
    } else { UI.mode = 'busy'; setTray(); hintSet(G.ctrl[0] === 'cpu' ? 'Side ' + (side + 1) : 'CPU turn', 'Choosing...'); await sleep(G.ctrl[0] === 'cpu' ? 420 : 750); act = (TUT && TUT.janeAct && await TUT.janeAct()) || E.aiChoose(side); }
    if (id !== loopId) return;
    try { await E.executeAction(act); UI.fails = 0; if (act.type === 'analyse' && G.ctrl[side] === 'human' && !TUT && G.seen[0].includes(act.target.uid)) await showAnalyse(act.target); } catch (err) { if (id !== loopId) return; console.error(err); toast('Rules error: ' + err.message); await sleep(800); if (G.ctrl[side] !== 'human' && ++UI.fails >= 2) { UI.fails = 0; try { await E.executeAction({ type: 'pass' }); } catch (e2) {} } }
    if (id !== loopId) return;
    if (ONL) sendSync();
    await camReset(); if (UI.retreating) await UI.retreating;
    UI.flyer = null; $$('.cardwrap.away').forEach(w => w.classList.remove('away')); $$('.flyer').forEach(f => f.remove());
    updateAll();
  }
  if (G && G.over && id === loopId) { updateAll(); setTray(); hintSet(''); await sleep(600); if (TUT) return tutOutro(); showOver(); }
}
function startGame(ctrl, o) {
  removeVic();
  o = o || {}; if (!o.tut) tutKill();
  E.setAI(prefs.ai || 3);
  if (!o.opp) { CFG.hpScale = prefs.hp; CFG.attackCostFrac = prefs.half ? 0.5 : 1; CFG.clash = prefs.clash; CFG.hideStats = prefs.hide !== false; }
  if (o.daily) { const D = o.daily; CFG.hpScale = 0.6; CFG.attackCostFrac = D.mod.half ? 0.5 : 1; CFG.clash = D.mod.clash !== false; CFG.hideStats = D.mod.hide !== false; E.setAI(D.ai); }
  const singAll = ROSTER_ALL.filter(k => k !== 'julian' && k !== 'delilah'); let cpu = null;
  for (let tries = 0; tries < 300 && !cpu; tries++) {
    const sing = singAll.slice(); for (let i = sing.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [sing[i], sing[j]] = [sing[j], sing[i]]; }
    let c = sing.slice(0, 4);
    if (Math.random() < 0.3) { const p = (Math.random() * 3) | 0, pr = Math.random() < 0.5 ? ['julian', 'delilah'] : ['delilah', 'julian']; c = []; let si = 0; for (let i = 0; i < 4; i++) c.push(i === p ? pr[0] : i === p + 1 ? pr[1] : sing[si++]); }
    if (E.squadCost(c) <= E.CFG.budget) cpu = c;
  }
  if (!cpu) cpu = ['wren', 'rarity', 'cray', 'neko'];
  if (o.opp) cpu = o.opp; if (o.daily) cpu = o.daily.opp;
  loopId++; stopHint(); closeMenus(); removePlot(); $$('.flyer, .pod, .dragghost').forEach(x => x.remove());
  UI.flyer = null; UI.retreating = null; UI.sel = null; UI.pv = null; UI.resolveTurn = null; UI.plot = null; UI.plotted = null; UI.mode = 'busy';
  E.setTutor(o.tut || false);
  if (o.tut) { CFG.hpScale = 1; CFG.attackCostFrac = 1; CFG.clash = o.tut === 2; CFG.hideStats = o.tut === 2; E.setAI(1); }
  G = E.newGame(o.tut === 2 ? ['rarity'] : o.tut ? ['argo'] : o.daily ? o.daily.me : teamOf(), o.tut === 2 ? ['echidna'] : o.tut ? ['jane'] : cpu, ctrl || ['human', 'cpu'], o.opp ? ['You', 'Friend'] : ['You', 'CPU']);
  if (o.tut === 2) { G.turn = 0; const ra = G.sides[0][0], ec = G.sides[1][0]; ra.restN = 2; ec.restN = 3; ec.cur.STR = 1; ec.cur.AGI = 1; ec.cur.BRN = 2; ec.cur.DATA = 9; }
  else if (o.tut) { G.turn = 1; G.sides[1][0].hp = 4; G.sides[0][0].restN = 1; G.sides[1][0].restN = 1; }
  if (o.tut && o.ch) tutSetup(o.tut, o.ch, G);
  if (o.opp && o.first === 1) G.turn = 1;
  if (o.daily) { G.daily = o.daily; G.sides[1].forEach(u => { u.hp = u.maxhp = Math.max(1, Math.round(u.hp * o.daily.hpm)); }); }
  $('#arrange').classList.remove('on'); $('#title').classList.remove('on'); $('#over').classList.remove('on'); closePanels();
  $('#cam').style.transform = 'none'; UI.camOn = false;
  clearInterval(chalIv); chalIv = setInterval(chalLive, 700);
  buildBoard(); updateAll();
  if (!o.tut) { const myId = loopId; (async () => { await missionStart(o.daily ? 'DAILY MISSION' : 'MISSION START', o.daily ? 'Daily challenge' : (o.opp ? 'Linked duel' : 'vs ' + (G.names ? G.names[1] : 'CPU'))); if (myId !== loopId) return; toast('Slots 1 and 4 guard the agent beside them.'); gameLoop(myId); })(); }
  else { toast('Duel start. Slots 1 and 4 guard the agent beside them.'); gameLoop(loopId); }
}

/* =========================================================
   Tutorial: Argo teaches the basics against Jane
   ========================================================= */
let TUT = null;
const TUT_STOP = { tut: 'stop' };
const rR = e => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; };
const rU = es => { const r = es.map(rR), l = Math.min(...r.map(x => x.l)), t = Math.min(...r.map(x => x.t)), rt = Math.max(...r.map(x => x.l + x.w)), b = Math.max(...r.map(x => x.t + x.h)); return { l, t, w: rt - l, h: b - t }; };
const hlRow = k => () => { const s = $('.slot.' + k), b = rR($('#board')), r = s && rR(s); return r && { l: b.l, t: r.t, w: b.w, h: r.h }; };
const hlRail = () => { const b = rR($('#board')), r = rU(railEls); return { l: b.l, t: r.t, w: b.w, h: r.h }; };
const hlIn = (u, sel) => () => { const w = cards[u.uid] && cards[u.uid].wrap, e = w && $(sel, w); return e && rR(e); };
function tutDom() {
  let t = $('#tut'); if (t) return t;
  t = el('div'); t.id = 'tut';
  t.innerHTML = '<div id="tutShield"></div><div id="tutHl"></div><div id="tutBox"><div class="tport"><img alt=""></div><div class="tmain"><b class="tname"></b><p class="ttxt"></p></div><i class="tnext">&#9662;</i><button type="button" id="tutSkip">SKIP</button></div>';
  document.body.appendChild(t);
  const adv = e => { if (e.target.id === 'tutSkip') return; tutAdvance(); };
  $('#tutShield').addEventListener('click', adv); $('#tutBox').addEventListener('click', adv);
  $('#tutSkip').addEventListener('click', e => { e.stopPropagation(); sfx('tick'); const was = TUT; tutKill(); if (was && !was.solo) { prefs[was.n === 2 ? 'tut2Done' : 'tutDone'] = true; savePrefs(); } quitToSquad(); });
  (function frame() { requestAnimationFrame(frame); const h = $('#tutHl'); if (!h) return; const r = TUT && TUT.hl && TUT.hl(); if (!r || !r.w) { h.style.display = 'none'; return; } const p = 6; h.classList.toggle('soft', !!TUT.soft); h.style.display = 'block'; h.style.left = (r.l - p) + 'px'; h.style.top = (r.t - p) + 'px'; h.style.width = (r.w + p * 2) + 'px'; h.style.height = (r.h + p * 2) + 'px'; })();
  return t;
}
function tutAdvance() {
  if (!TUT || TUT.dead) return;
  if (TUT.typing) { clearInterval(TUT.typing.id); $('#tutBox .ttxt').textContent = TUT.typing.full; TUT.typing = null; $('#tut').classList.toggle('wait', !!TUT.pend); return; }
  const p = TUT.pend; if (p) { TUT.pend = null; $('#tut').classList.remove('block', 'wait'); sfx('tick'); p(); }
}
function tutShow(who, text, o) {
  o = o || {}; const T = TUT, box = $('#tutBox'), t = $('#tut');
  $('.tname', box).textContent = who; const im = $('img', box); im.src = 'icons/' + who.toLowerCase() + '.png';
  box.classList.toggle('r', who !== ((T && T.who) || 'Argo')); box.classList.toggle('top', o.at === 'top'); box.dataset.who = who;
  const tx = $('.ttxt', box); if (T.typing) clearInterval(T.typing.id); T.typing = null; tx.textContent = '';
  t.classList.add('on'); t.classList.toggle('block', !!o.block); t.classList.remove('wait');
  if (RM) { tx.textContent = text; return; }
  let i = 0; const id = setInterval(() => { i += 1; tx.textContent = text.slice(0, i); if (i >= text.length) { clearInterval(id); if (T.typing && T.typing.id === id) T.typing = null; t.classList.toggle('wait', !!T.pend); } }, 16);
  T.typing = { id, full: text };
}
const tutSay = (who, text, o) => new Promise((res, rej) => {
  if (!TUT || TUT.dead) return rej(TUT_STOP);
  const T = TUT; T.rej.add(rej); T.pend = () => { T.rej.delete(rej); res(); };
  tutShow(who, text, Object.assign({ block: true }, o));
});
function tutTip(who, text, o) { if (!TUT || TUT.dead) throw TUT_STOP; TUT.pend = null; tutShow(who, text, Object.assign({ block: false }, o)); }
const tutHl = (f, soft) => { if (TUT) { TUT.hl = f || null; TUT.soft = !!soft; } };
const tutWait = (pred, ms) => new Promise((res, rej) => {
  if (!TUT || TUT.dead) return rej(TUT_STOP); const T = TUT; T.rej.add(rej);
  const iv = setInterval(() => { if (T.dead) { clearInterval(iv); return; } let ok = false; try { ok = pred(); } catch (e) {} if (ok) { clearInterval(iv); T.rej.delete(rej); res(); } }, 110);
});
function tutReveal(k) {
  document.body.classList.remove('tut-no' + k); const u = G.sides[k === 'me' ? 0 : 1][0], w = cards[u.uid].wrap;
  w.classList.add('tutIn'); sfx('whoosh'); setTimeout(() => w.classList.remove('tutIn'), 1000);
}
function tutKill() {
  const T = TUT; if (!T) return; T.dead = true; TUT = null;
  T.rej.forEach(f => { try { f(TUT_STOP); } catch (e) {} }); T.rej.clear(); if (T.ready) T.go();
  document.body.classList.remove('tut', 'tut-nofoe', 'tut-nome', 'tut-cover', 'tut-skipok'); E.setTutor(false);
  const t = $('#tut'); if (t) t.classList.remove('on', 'block', 'wait'); const h = $('#tutHl'); if (h) h.style.display = 'none';
}
function tutAddCard(u) {
  const slot = el('div', 'slot me'); slot.style.gridColumn = u.slot + 1; const w = buildCard(u); slot.appendChild(w);
  $('#board').insertBefore(slot, railEls[0]); cards[u.uid] = { wrap: w, slot, unit: u }; updateAll();
  w.classList.add('tutIn'); sfx('whoosh'); setTimeout(() => w.classList.remove('tutIn'), 1000);
}
function tutDropCard() { const u = E.dropLast(0); if (!u) return; const c = cards[u.uid]; if (c) { c.slot.remove(); delete cards[u.uid]; } updateAll(); sfx('tick'); }
const tutGate = n => { const T = TUT; if (!T.gates[n]) { const g = {}; g.p = new Promise(r => { g.r = r; }); T.gates[n] = g; } return T.gates[n]; };
const TUT_CH = {
  1: [
    { id: 'board', n: 'The board', d: 'The three rows, the cards and the four stats.' },
    { id: 'defend', n: 'Blocking', d: 'Match an attack to stop it. Why resting matters.' },
    { id: 'attack', n: 'Attacking', d: 'Pick an agent, spend Strength, hit the rail.' },
    { id: 'recover', n: 'Recovering', d: 'Spend Agility to refill Strength, Brains or DATA.' },
    { id: 'dodge', n: 'Dodging and skipping', d: 'Dodge with exact Agility. Skip turn refills Brains.' },
    { id: 'cover', n: 'Guards', d: 'Cover a teammate from a guard slot.' },
    { id: 'transfer', n: 'Transfer', d: 'Give a teammate stats using Brains.' },
    { id: 'data', n: 'DATA abilities', d: 'Leer and Projection.' }
  ],
  2: [
    { id: 'hidden', n: 'Hidden stats', d: 'Why enemy numbers show as question marks.' },
    { id: 'analyse', n: 'Analyse and bids', d: 'Spend Brains to read an agent, and beat a block.' },
    { id: 'strike', n: 'A gentle strike', d: 'Use what you learned to hit for exactly what you want.' },
    { id: 'wake', n: 'Waking up', d: 'Spend Agility to wake a resting agent.' },
    { id: 'clash', n: 'Blocking and clashes', d: 'Match an attack, then answer a raise.' },
    { id: 'mark', n: 'Mark', d: 'Mark a target so your next hit lands harder.' },
    { id: 'cure', n: 'Cure', d: 'Clear a Mark from yourself or a teammate.' },
    { id: 'free', n: 'Free play', d: 'Analyse, wear her down and attack on your own.' }
  ]
};
const chDone = (n, id) => !!(prefs.chDone && prefs.chDone[n + ':' + id]);
const chMark = (n, id) => { if (!prefs.chDone) prefs.chDone = {}; if (!prefs.chDone[n + ':' + id]) { prefs.chDone[n + ':' + id] = true; savePrefs(); } };
function tutSetup(n, ch, g) {
  const me = g.sides[0][0], foe = g.sides[1][0];
  if (ch !== 'board' && ch !== 'hidden') document.body.classList.remove('tut-nome', 'tut-nofoe');
  if (n === 1) {
    if (ch === 'defend') g.turn = 1;
    else if (ch === 'attack') { g.turn = 0; foe.rest = 2; }
    else if (ch === 'recover') { g.turn = 0; me.cur.STR = 3; }
    else if (ch === 'dodge') { g.turn = 1; me.cur.AGI = Math.max(me.cur.AGI, 4); }
    else if (ch === 'cover') { g.turn = 1; me.cur.STR = 5; }
    else if (ch === 'transfer') { g.turn = 0; me.cur.STR = 3; }
    else if (ch === 'data') { g.turn = 0; foe.hp = 2; }
  } else {
    g.turn = 0;
    if (['strike', 'wake', 'clash', 'mark', 'cure'].includes(ch)) g.seen[0].push(foe.uid);
    if (ch === 'wake') { g.turn = 1; me.rest = 2; me.cur.STR = 1; }
    else if (ch === 'clash') { g.turn = 1; me.cur.STR = 4; foe.cur.STR = 3; }
    else if (ch === 'mark') { foe.rest = 3; me.restN = 1; }
    else if (ch === 'cure') { me.mark = { by: foe.uid }; me.restN = 1; foe.rest = 2; }
    else if (ch === 'free') { me.cur.STR = Math.max(me.cur.STR, 4); me.cur.BRN = Math.max(me.cur.BRN, 3); me.cur.AGI = Math.max(me.cur.AGI, 3); }
  }
}
async function tutSoloEnd(T) {
  try { await tutSay(T.who, T.n === 2 ? "A-And that's this part! You can replay any chapter from the Tutorials menu." : "That's the end of this part. Replay any chapter, or the whole thing, from the Tutorials menu."); } catch (e) { if (e !== TUT_STOP) throw e; return; }
  tutKill(); quitToSquad(); showTutorials();
}
function startTutorial(n, ch) {
  if (ONL && ONL.playing) return toast('Finish or forfeit the online match first.');
  tutKill(); tutDom();
  const T = TUT = { dead: false, rej: new Set(), pend: null, typing: null, hl: null, gates: {}, cap: 0, coverOnly: false, plan: [], n: n === 2 ? 2 : 1, who: n === 2 ? 'Rarity' : 'Argo', solo: ch || null };
  T.ready = new Promise(r => { T.go = r; });
  const J = () => G.sides[1][0], A = () => G.sides[0][0];
  const skip = { type: 'pass', skip: true };
  const P = {
    atk4: async () => { await T.ready; return { type: 'attack', agent: J(), target: A(), X: 4, target2: null }; },
    skip1: async () => { await tutGate('skip1').p; return skip; },
    dodge: async () => { await tutGate('dodge').p; return { type: 'attack', agent: J(), target: A(), X: 3, target2: null }; },
    cathy: async () => { await tutGate('cathy').p; return { type: 'attack', agent: J(), target: G.sides[0][1], X: 1, target2: null }; }
  };
  T.plan = [P.atk4, P.skip1, P.dodge, P.cathy];
  if (ch) T.plan = ({ defend: [P.atk4], recover: [P.skip1], dodge: [P.dodge, P.cathy], cover: [P.cathy] })[ch] || [];
  T.janeAct = async () => { if (J().rest > 0) return { type: 'pass' }; const f = T.plan.shift(); return f ? await f() : skip; };
  document.body.classList.add('tut', 'tut-nofoe', 'tut-nome'); $('#arrange').classList.remove('on');
  if (T.n === 2) { T.plan = []; T.noPass = true; T.janeAct = async () => { if (G.sides[1][0].rest > 0) return { type: 'pass' }; const f = T.plan.shift(); return f ? await f() : { type: 'pass', skip: true }; }; }
  startGame(['human', 'cpu'], { tut: T.n, ch: ch || null });
  (T.n === 2 ? runTutorial2 : runTutorial)(T).catch(err => { if (err !== TUT_STOP) { console.error(err); tutKill(); toast('Tutorial hit a snag. Back to the squad screen.'); quitToSquad(); } });
}
const hCard = u => () => cards[u.uid] && rR(cards[u.uid].wrap);
const hSel = (sel, i) => () => { const e = i == null ? $(sel) : $$(sel)[i]; return e && rR(e); };
async function tutCoach(T, hintFor) {
  let last = '', seen = false;
  while (!T.dead && !G.over) {
    const m = UI.mode;
    if (m === 'busy') { if (seen) break; await sleep(140); continue; }
    seen = true; const h = hintFor(m), key = h ? h.k : '';
    if (key !== last) { last = key; if (h) { tutHl(h.hl, 1); tutTip(T.who || 'Argo', h.t, h.at ? { at: h.at } : undefined); } else tutHl(null); }
    await sleep(140);
  }
  tutHl(null); $('#tut').classList.remove('on', 'block'); if (T.dead) throw TUT_STOP;
}
const myTurn = () => tutWait(() => G.over || (G.turn === 0 && UI.mode === 'idle'));
const janeTurn = async () => { await tutWait(() => G.over || G.turn === 1); await sleep(1100); };
async function runTutorial(T) {
  const argo = G.sides[0][0], jane = G.sides[1][0], S = tutSay;
  const pick = (u, t) => ({ k: 'pick' + u.uid, hl: hCard(u), t });
  let cathy = null;
  const defendLoop = async (X, kind) => {
    await tutWait(() => UI.mode === 'defend' || G.over);
    let last = '';
    while (UI.mode === 'defend') {
      const go = $('.defpod .pgo'), st = go && go.style.display !== 'none' ? go.textContent : 'none';
      if (st !== last) {
        last = st;
        if (kind === 'dodge') {
          if (st === 'Dodge') { tutHl(hSel('.defpod'), 1); tutTip('Argo', "That's exactly " + X + " Agility, so it all misses. Tap Dodge."); }
          else if (st === 'Block') { tutHl(hlIn(argo, '.n-agi'), 1); tutTip('Argo', 'That would be a block. Tap my Agility notch instead, top right.'); }
          else { tutHl(hlIn(argo, '.n-agi'), 1); tutTip('Argo', "Jane's hit is " + X + '. Tap my Agility notch, then tap Dodge.'); }
        } else if (st === 'Block') { tutHl(hSel('.defpod'), 1); tutTip('Argo', "Match her " + X + " exactly and the hit does nothing. Spend more and you counter for the extra. Then tap Block."); }
        else if (st === 'Dodge') { tutHl(hSel('.defpod'), 1); tutTip('Argo', 'Dodging costs exactly ' + X + ' Agility, and you take nothing. Tap Dodge.'); }
        else { tutHl(hlIn(argo, '.n-str'), 1); tutTip('Argo', "Jane's hit is " + X + ". Tap my Strength to block it, or Agility to dodge. Or just take it. Try blocking."); }
      }
      await sleep(140); if (T.dead) throw TUT_STOP;
    }
    tutHl(null); T.typing = null; $('#tut').classList.remove('on', 'block');
  };
  const C = {};
  C.board = async () => {
    await S('Argo', 'Hey.');
    await S('Argo', 'Welcome to AnomEx: Linked.');
    await S('Argo', "My name's Argo. I'll show you the ropes.");
    await S('Argo', 'For starters, when you start a match (or, in our lingo, a "mission") you get three distinct rows.');
    tutHl(hlRow('foe')); await S('Argo', '"Opponent Hand". That\'s their squad, up top.');
    tutHl(hlRail); await S('Argo', '"Action Rail". Attacks and defences play out right here, in the middle.');
    tutHl(hlRow('me')); await S('Argo', 'And your own hand. Your squad. This is where you tap and drag from.');
    tutHl(null);
    await S('Argo', "Normally you'd run four agents. Let's keep it simple.");
    await S('Argo', "For now, I'll be in your hand.");
    tutReveal('me'); await sleep(1000);
    await S('Argo', 'On the other side... Uh.');
    await S('Argo', 'Jane!');
    await S('Argo', "Can you c'mere?");
    tutReveal('foe'); await sleep(900);
    await S('Jane', 'Sup, sweetie?');
    await S('Argo', 'Need you for this real quick.');
    await S('Jane', 'Alright, hon.');
    tutHl(hlIn(argo, '.card')); await S('Argo', "So, that's me. Everything about an agent lives on its card.");
    tutHl(hlIn(argo, '.n-str')); await S('Argo', "Top left: Strength. That's your attack, and your block.");
    tutHl(hlIn(argo, '.n-agi')); await S('Argo', 'Top right: Agility. You dodge with it, and you regenerate stats with it.');
    tutHl(hlIn(argo, '.n-brn')); await S('Argo', 'Bottom left: Brains. Teamwork and interruptions. We\'ll get to that one soon.');
    tutHl(hlIn(argo, '.n-data')); await S('Argo', "Bottom right: DATA. Special abilities. It's the only stat in colour, so it's easy to spot.");
    tutHl(hlIn(argo, '.hp')); await S('Argo', "And the bar under my name is health. Hit zero and I'm out. Nobody heals, so every point counts.");
    tutHl(hlIn(jane, '.card')); await S('Jane', "That's me. I hit like a truck.");
    await S('Jane', "Fair warning though, I'm not at full health today. Go easy on me.");
    tutHl(null);
    await S('Argo', 'Stats are a pool you spend, not a fixed number. Whatever you use stays spent until you refill it.');
  };
  C.defend = async () => {
    await S('Argo', 'Jane goes first. Watch what she does, then we answer.');
    await S('Jane', "Okay, here I come. I'm swinging at you for 4.");
    T.go();
    await defendLoop(4, 'block');
    await myTurn();
    await S('Jane', "Phew. Swinging that hard wears me out. I'm resting now.");
    tutHl(hlIn(jane, '.card')); await S('Argo', "See the REST on her card? Attackers have to rest for a turn or two. And a resting agent can't block or dodge.");
    tutHl(null); await S('Argo', "That means she's wide open. Your turn.");
  };
  C.attack = async () => {
    if (T.solo) { await S('Argo', "Jane's resting, so she can't block or dodge. Let's hit her."); await myTurn(); }
    T.cap = 2;
    await tutCoach(T, m => {
      if (m === 'idle') return pick(argo, 'Tap me to pick me. You act with one agent each turn.');
      if (m === 'sel' && UI.sel === argo) return { k: 's', hl: hlIn(argo, '.n-str'), t: 'Picking me refills +1 STR, AGI and DATA. Now tap my Strength notch to attack.' };
      if (m === 'place') return { k: 'r', hl: () => rR(railEls[jane.slot]), t: 'Tap the lit Action Rail slot in front of Jane. Or drag my card onto it.' };
      if (m === 'plot') return { k: 'x', hl: hSel('.pod'), t: "Set it to around 2 so we don't hurt her too bad, then click Strike." };
      return null;
    });
    await janeTurn();
    await S('Jane', 'Aw, cutie.');
  };
  C.recover = async () => {
    await S('Argo', "Next I'll talk about the Agility notch.");
    tutHl(hlIn(argo, '.n-agi')); await S('Argo', 'Besides dodging, Agility is what an agent spends to regenerate stats.');
    tutHl(null);
    if (argo.rest > 0) {
      await S('Argo', "1 Agility gets back 1 point of Strength, Brains or DATA. Let's refill some of what we spent on Jane. We're both resting for a moment, so hang tight.");
      await S('Jane', 'Let me skip my turn for you.');
      tutGate('skip1').r();
      await myTurn();
      await S('Argo', 'Thanks. Now, regenerate that Strength.');
    } else {
      await S('Argo', "1 Agility gets back 1 point of Strength, Brains or DATA. I'm a bit low on Strength, so let's refill that.");
      tutGate('skip1').r(); await myTurn();
    }
    await tutCoach(T, m => {
      if (m === 'idle') return pick(argo, 'Tap me to pick me.');
      if (m === 'sel' && UI.sel === argo) return { k: 's', hl: hlIn(argo, '.n-agi'), t: 'Now my Agility notch, top right.' };
      if (m === 'const') return { k: 'c', hl: hSel('.const .star', 0), t: 'Tap the Strength star. Tap it a second time to confirm.' };
      return null;
    });
    await janeTurn();
    await S('Argo', "There we go. That's on top of the free refill you get for picking an agent.");
    await S('Argo', "So Brains isn't for that. Brains is mainly for teamwork, and for interruptions.");
  };
  C.dodge = async () => {
    argo.rest = 0; updateAll();
    await S('Argo', "Blocking isn't your only answer. You can also dodge.");
    tutHl(hlIn(argo, '.n-agi')); await S('Argo', "Spend exactly as much Agility as the attack's power and it misses completely. No damage, no counter.");
    tutHl(null); await S('Argo', 'It has to be exact. Too little and you can\'t dodge at all.');
    await S('Jane', "You're up, hon. I'm swinging for 3.");
    tutGate('dodge').r();
    await defendLoop(3, 'dodge');
    await myTurn(); jane.rest = 0; updateAll();
    await S('Jane', 'Whoa, missed! Nice moves.');
    await S('Argo', "Dodging is cheap against small hits. Against big ones, blocking is usually easier. And Agility is what you recover with, so don't burn it all.");
    await S('Argo', "One more thing. A turn doesn't have to be an action. Skip turn is under your cards, and it gives every one of your agents +1 Brains.");
    await S('Argo', "That's the only way Brains comes back, so skip when you're running low. Try it now.");
    document.body.classList.add('tut-skipok');
    await tutCoach(T, m => {
      if (m === 'idle') return { k: 'sk', hl: hSel('#btnSkip'), at: 'top', t: 'Tap Skip Turn, then tap again to confirm.' };
      if (m === 'sel') return { k: 'sk2', hl: hSel('#btnSkip'), at: 'top', t: 'Tap empty space to put me down, then use Skip Turn.' };
      return null;
    });
    document.body.classList.remove('tut-skipok');
    await janeTurn();
    await S('Argo', 'Nice. Your whole squad just got a little sharper.');
  };
  C.cover = async () => {
    await S('Argo', 'Cathy! C\'mere quickly.');
    cathy = E.addAgent(0, 'cathy'); tutAddCard(cathy); await sleep(900);
    await S('Cathy', 'Hiii!');
    await S('Argo', "This is Cathy. I'm just gonna use her for this next area. She's got a lot of Brains, which is what teamwork runs on.");
    tutHl(hlIn(cathy, '.card')); await S('Argo', 'On the battlefield there are two slot types. The middle ones are for attackers...');
    tutHl(hlIn(argo, '.card')); await S('Argo', '...and the ones at the sides are for defenders.');
    tutHl(null); await S('Argo', "Right now I'm on defence. So if Jane attacks Cathy, I can step in and block it for her, if she can't do it herself.");
    await S('Jane', "I'm gonna quickly attack Cathy for 1.");
    await S('Cathy', 'Hi Jane!');
    await S('Jane', 'Heheh... Hello, darling.');
    T.coverOnly = true; document.body.classList.add('tut-cover'); tutGate('cathy').r();
    await tutWait(() => UI.mode === 'defend');
    await tutCoach(T, m => m === 'defend' ? { k: 'd', hl: hSel('.pcov .pcb:not(.take)'), t: "Cathy can't stop this one herself. I'm guarding her slot, so tap Cover: Argo and I'll take it." } : null);
    T.coverOnly = false; document.body.classList.remove('tut-cover');
    await myTurn();
  };
  C.transfer = async () => {
    if (!cathy) {
      cathy = G.sides[0][1] || E.addAgent(0, 'cathy'); if (!cards[cathy.uid]) tutAddCard(cathy); await sleep(900);
      await S('Cathy', 'Hiii!');
      await S('Argo', "Cathy's got lots of Brains, which is what Transfer runs on. I'm a bit low on Strength, so let's fix that.");
    }
    await S('Cathy', 'Oh no... You lost some strength.');
    await S('Argo', 'Yeah. Transferring me some?');
    await S('Cathy', 'Okay!');
    await tutCoach(T, m => {
      if (m === 'idle') return pick(cathy, 'Pick Cathy.');
      if (m === 'sel' && UI.sel === cathy) return { k: 's', hl: hlIn(cathy, '.n-brn'), t: "Now Cathy's Brains notch, bottom left." };
      if (m === 'const') return { k: 'c', hl: hSel('.const .star', 0), t: 'Tap the Transfer star, then tap it again to use it.' };
      if (m === 'ally') return $('.statpick') ? { k: 'sp', hl: hSel('.statpick .sp', 0), t: 'These four buttons are my stats, and you can give any of them. For now, press Strength, top left.' } : { k: 'al', hl: hCard(argo), t: 'Now tap me.' };
      return null;
    });
    await myTurn();
    await S('Cathy', 'All healthy and awesome again!');
    await S('Jane', "Lookin' good.");
    await S('Argo', 'Next-');
    await S('Argo', 'You can go now, Cathy.');
    await S('Cathy', 'Bye bye!');
    await S('Jane', 'Bye Cathy!');
    if (!T.solo) { tutDropCard(); await sleep(500); }
  };
  C.data = async () => {
    await S('Argo', 'Next up, DATA.');
    await S('Argo', "Jane's skipping her turn. Pick me, then tap the DATA notch, bottom right.");
    await tutCoach(T, m => {
      if (m === 'idle') return pick(argo, 'Tap me to pick me.');
      if (m === 'sel' && UI.sel === argo) return { k: 's', hl: hlIn(argo, '.n-data'), t: 'Now my DATA notch, bottom right.' };
      if (m === 'abil') return { k: 'a', hl: hSel('.ablist .abil', 0), t: "I've got two abilities, each with a different cost. Let's use Leer." };
      if (m === 'target') return { k: 't', hl: hCard(jane), t: 'Tap Jane.' };
      return null;
    });
    await janeTurn();
    await S('Jane', 'Um, a little scary looking there, sweetie.');
    await S('Argo', 'Sorry. Leer takes 1 Brains off Jane, so she has a harder time interrupting attacks or using abilities.');
    await S('Argo', "It also takes 1 of her Agility. That makes her easier to hit with big damage, and forces her to tank it with Strength.");
    await S('Jane', 'Skipping my turns, cutie. Take your time.');
    await myTurn();
    await S('Argo', "Now let's finish this with my other ability, Projection.");
    await S('Argo', 'Projection uses my DATA as the damage instead of Strength. It also can\'t be tanked with Strength. Only dodged, with exact Agility, which leaves the target more open afterwards.');
    await tutCoach(T, m => {
      if (m === 'idle') return pick(argo, 'Tap me to pick me.');
      if (m === 'sel' && UI.sel === argo) return { k: 's', hl: hlIn(argo, '.n-data'), t: 'Now my DATA notch.' };
      if (m === 'abil') return { k: 'a', hl: hSel('.ablist .abil', 1), t: 'Projection, the second one.' };
      if (m === 'target') return { k: 't', hl: hCard(jane), t: 'Tap Jane.' };
      if (m === 'plot') return { k: 'x', hl: hSel('.pod'), t: 'Set Projection to 2, then hit Fire.' };
      return null;
    });
  };
  await sleep(700);
  const list = T.solo ? [T.solo] : TUT_CH[1].map(c => c.id);
  for (const id of list) { await C[id](); chMark(1, id); }
  if (T.solo) await tutSoloEnd(T);
}

async function runTutorial2(T) {
  const rarity = G.sides[0][0], ech = G.sides[1][0], S = tutSay, FXb = (u, t) => FX.buff(u, t);
  const pick = (u, t) => ({ k: 'pick' + u.uid, hl: hCard(u), t });
  const P = {
    eskip: async () => { await tutGate('eskip').p; ech.cur.STR = 3; updateAll(); await FXb(ech, '+2 S'); return { type: 'pass', skip: true }; },
    eatk: async () => { await tutGate('eatk').p; return { type: 'attack', agent: ech, target: rarity, X: 1, target2: null }; },
    mark: async () => ({ type: 'mark', agent: ech, target: rarity })
  };
  const enkiPlan = async () => {
    if (ech.hp >= T.hp0) { T.plan.unshift(enkiPlan); return { type: 'pass', skip: true }; }
    await tutGate('enki').p; return { type: 'ability', agent: ech, id: 'enki', X: Math.max(1, Math.min(5, ech.maxhp - ech.hp)) };
  };
  T.hp0 = -1;
  T.plan = T.solo ? ({ wake: [P.eskip], clash: [P.eatk], free: [enkiPlan] })[T.solo] || [] : [P.eskip, P.eatk, P.mark, enkiPlan];
  const C = {};
  C.hidden = async () => {
    await S('Rarity', 'H-Hello... My name is R-Rarity.');
    await S('Rarity', "I'm gonna show you some tactical aspects today!");
    await S('Rarity', "S-So I'll be in your hand, I hope that's okay with you.");
    tutReveal('me'); await sleep(1000);
    await S('Rarity', "I'll also need an assistant.");
    await S('Rarity', "Echidna, babes! C'mere, I need you!");
    tutReveal('foe'); await sleep(900);
    await S('Echidna', 'Hello, Rarity.');
    await S('Rarity', "Hi! Okay, u-uhm. We're gonna learn how to analyse targets using the Brains Notch!");
    await S('Echidna', 'Fun.');
    await S('Rarity', "For starters, all the stats on your opponent's agents are hidden from you. Try tapping Echidna's card.");
    tutHl(hCard(ech)); tutTip('Rarity', "Tap Echidna's card.");
    await tutWait(() => $('#inspect').classList.contains('on'));
    document.body.classList.add('tut-insp'); tutHl(null);
    await S('Rarity', "S-See? There's a question mark where her n-numbers should be.");
    const ic = $('#inspClose'); if (ic) ic.click(); document.body.classList.remove('tut-insp'); await sleep(500);
    await S('Rarity', "That's so you can't just plan around exact numbers. You have to find them out.");
  };
  C.analyse = async () => {
    if (T.solo) await S('Rarity', "Let's practise reading Echidna's stats.");
    await S('Rarity', 'To see her stats, so we can plan our attack, we have to spend Brains to analyse her.');
    await S('Rarity', "Analysing uses Brains but doesn't cost your turn.");
    await S('Rarity', "You bid some Brains. If she has at least that many, she can spend them to block it, and then you both lose your Brains!");
    await S('Rarity', "However, you can only see the stats of the agent you analyse, and the effect only lasts until your turn ends!");
    await S('Rarity', "Let's try it. Bid 1 and see what happens.");
    E.tutBlock(true);
    await myTurn();
    const bidCoach = want => tutCoach(T, m => {
      if (m === 'idle') return pick(rarity, 'Tap me... N-Not hard though.');
      if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-brn'), t: 'T-Tap the Brains Notch!' };
      if (m === 'const') return { k: 'c', hl: hSel('.const .star', 1), t: 'Now select Analyse. Tap it a second time to confirm.' };
      if (m === 'target') return { k: 't', hl: hCard(ech), t: "And now p-pick Echidna's card." };
      if (m === 'bid') { const nm = $('.pod .pnum'), cur = nm ? +nm.textContent : 1; return cur < want ? { k: 'b+' + cur, hl: hSel('.pod .pbtn[data-d="1"]'), t: 'Tap + to bid ' + want + '.' } : { k: 'b' + cur, hl: hSel('.pod .pgo'), t: 'Bid ' + want + ' Brains and press Analyse.' }; }
      return null;
    });
    await bidCoach(1);
    await myTurn();
    E.tutBlock(false);
    if (!G.seen[0].includes(ech.uid)) {
      await myTurn();
      await S('Echidna', 'Nice try, Rarity.');
      await S('Rarity', "Eek! She blocked it! She spent 1 Brains to stop my 1, and we both lost that Brains.");
      await S('Rarity', "But now she only has 1 Brains left. If we bid MORE than she has, she can't block at all.");
      await S('Rarity', "So let's bid 2 this time.");
      await bidCoach(2);
    } else {
      await S('Rarity', "Oh! It worked. Sometimes a bigger bid than she has left means she can't block at all.");
    }
    await myTurn();
    tutHl(hlIn(ech, '.card')); await S('Rarity', 'See how her stats are visible now?');
    tutHl(null);
    await S('Rarity', 'The bigger your bid, the harder it is to stop. But a bigger bid costs you more Brains too.');
    await S('Rarity', "It looks like she's got very little Strength and Agility right now... Let's use this as a chance to deal some damage!");
  };
  C.strike = async () => {
    if (T.solo) { await myTurn(); await S('Rarity', "I've already read Echidna. She's got very little Strength and Agility right now, so it's a good time to hit."); }
    await S('Rarity', "E-Echidna's my friend, though, and she's really fragile, so let's not hurt her too bad.");
    T.cap = 1;
    await tutCoach(T, m => {
      if (m === 'idle') return pick(rarity, 'Tap me to pick me.');
      if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-str'), t: 'Now my Strength Notch.' };
      if (m === 'place') return { k: 'r', hl: () => rR(railEls[ech.slot]), t: 'Tap the Action Rail in front of her, or drag me there.' };
      if (m === 'plot') return { k: 'x', hl: hSel('.pod'), t: 'Just 1, nice and gentle. Then press Strike.' };
      return null;
    });
    T.cap = 0;
    await janeTurn();
    await S('Echidna', 'Nice one, Rarity...');
    await S('Rarity', 'S-Sorry.');
    await S('Echidna', "Don't be.");
  };
  C.wake = async () => {
    await S('Rarity', "Phew, that attack kinda wore me out, I'm gonna have a rest.");
    await S('Echidna', "Now that you're asleep, I can build up my strength and attack you, no?");
    await S('Rarity', "You could, but I won't let you!");
    tutGate('eskip').r();
    await myTurn();
    await tutCoach(T, m => {
      if (m === 'idle') return pick(rarity, 'Tap my card!');
      if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-agi'), t: 'Tap Agility!' };
      return null;
    });
    T.noPass = false;
    await S('Rarity', "When an agent is resting, you can spend Agility to wake them up early! Just be careful, though.");
    await S('Rarity', 'Using Agility too much makes dodging, upping your stats and moving slots exceedingly hard.');
  };
  C.clash = async () => {
    await S('Rarity', 'Now, how about we tank her attack.');
    tutGate('eatk').r();
    await tutWait(() => UI.mode === 'defend' || G.over);
    let last = '', said = false;
    while (G.turn === 1 && !G.over) {
      if (UI.mode === 'defend') {
        const dp = $('.defpod');
        if (dp) {
          const go = $('.defpod .pgo'), st = go && go.style.display !== 'none' ? go.textContent : 'none';
          if (st !== last) {
            last = st;
            if (st === 'Block') { tutHl(hSel('.defpod'), 1); tutTip('Rarity', "Match her 1 exactly and it does nothing. Then tap Block."); }
            else if (st === 'Dodge') { tutHl(hSel('.defpod'), 1); tutTip('Rarity', 'Dodging costs 1 Agility. Tap Dodge, or try blocking instead.'); }
            else { tutHl(hlIn(rarity, '.n-str'), 1); tutTip('Rarity', "Her hit is 1. Tap my Strength to block it."); }
          }
        } else if ($('.fpod .dopts')) {
          if (!said) {
            said = true; tutHl(null); T.typing = null;
            await S('Rarity', 'Ah-hah!'); await S('Echidna', "Don't be too sure.");
            await S('Rarity', 'Eeek!');
            await S('Rarity', 'Echidna just raised the power of her attack when we blocked it.');
            await S('Rarity', 'This means she can potentially hit us for 1 point of damage.');
            await S('Rarity', 'Every Health Point is very important. In fact, Echidna is the only agent that can raise her own health.');
            await S('Rarity', "So let's add a point to our own Strength and match it for 2.");
          }
          if (last !== 'clash') { last = 'clash'; tutHl(hSel('.fpod .btn.primary'), 1); tutTip('Rarity', 'Press Add to match her.'); }
        }
      } else if (last) { last = ''; tutHl(null); $('#tut').classList.remove('on', 'block'); }
      await sleep(140); if (T.dead) throw TUT_STOP;
    }
    tutHl(null); T.typing = null; $('#tut').classList.remove('on', 'block');
    await myTurn();
    await S('Echidna', "I'll go easy on you today, sweet.");
    await S('Rarity', "Heheh, th-thanks!");
    await S('Rarity', "We survived that a-attack! Now Echidna's g-g-going to rest!");
    tutHl(hlIn(ech, '.card')); await S('Rarity', "Look at her REST. Because she rests for 3 turns after an attack, we can take our time prepping our next attack to make it extra strong!");
    tutHl(null);
  };
  C.mark = async () => {
    rarity.restN = 1;
    await tutCoach(T, m => {
      if (m === 'idle') return pick(rarity, 'Pick me, please! I\'ll get a little back from being picked.');
      if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-brn'), t: 'Tap the Brains Notch!' };
      if (m === 'const') return { k: 'c', hl: hSel('.const .star', 2), t: 'Now tap Mark! (Tap it twice.)' };
      if (m === 'target') return { k: 't', hl: hCard(ech), t: "Then let's Mark Echidna!" };
      return null;
    });
    await janeTurn();
    await S('Rarity', 'G-Great job! Now our next attack will deal 1 more damage to her!');
    await S('Rarity', "It uses a turn, and only my attack will deal that extra damage, n-no one else's!");
    await myTurn();
    await S('Rarity', "B-But since she's still resting, we can attack right now.");
    await tutCoach(T, m => {
      if (m === 'idle') return pick(rarity, 'Pick me!');
      if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-str'), t: 'Now tap my S-Strength Notch.' };
      if (m === 'place') return { k: 'r', hl: () => rR(railEls[ech.slot]), t: 'Either t-tap the Action Rail in front of her, or drag me there... P-Please, sorry.' };
      if (m === 'plot') return { k: 'x', hl: hSel('.pod'), t: 'Set it to the max, then press Strike.' };
      return null;
    });
    await janeTurn();
    await S('Rarity', 'Nice attack!');
  };
  C.cure = async () => {
    await myTurn();
    await S('Echidna', 'Gotcha, darling. I marked you back.');
    await S('Rarity', "Eek! She marked me! Now her next attack will hit me for 1 extra damage.");
    tutHl(hlIn(rarity, '.card')); await S('Rarity', "You can see the MARKED tag on my card. But we can fix that!");
    tutHl(null); await S('Rarity', 'Cure costs 2 Brains and your turn, then you rest 1. It clears a Mark, or a no-dodge penalty, from you or a teammate.');
    await tutCoach(T, m => {
      if (m === 'idle') return pick(rarity, 'Tap me.');
      if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-brn'), t: 'Brains Notch again!' };
      if (m === 'const') return { k: 'c', hl: hSel('.const .star', 3), t: 'Tap Cure. Tap it a second time to confirm.' };
      if (m === 'ally') return { k: 'a', hl: hCard(rarity), t: "Tap me, I'll cure myself." };
      return null;
    });
    await myTurn();
    await S('Rarity', "Phew! Good as new.");
  };
  C.free = async () => {
    await S('Rarity', "Now... How about you try and play a quick turn between just me and Echidna. See if you can analyse her, wear her down and then attack!");
    const hp0 = ech.hp; T.hp0 = hp0;
    rarity.cur.STR = Math.max(rarity.cur.STR, 4); rarity.cur.BRN = Math.max(rarity.cur.BRN, 3); rarity.cur.AGI = Math.max(rarity.cur.AGI, 3); updateAll(); await FXb(rarity, 'REFILLED');
    while (ech.hp >= hp0 && !G.over && !T.dead) {
      await tutWait(() => G.over || ech.hp < hp0 || (G.turn === 0 && UI.mode === 'idle'));
      if (ech.hp < hp0 || G.over) break;
      await tutCoach(T, m => {
        if (m === 'idle') return pick(rarity, 'Your move. Tap me when you\'re ready.');
        if (m === 'sel' && UI.sel === rarity) return { k: 's', hl: hlIn(rarity, '.n-brn'), t: 'Brains Notch to analyse her, Strength Notch to attack.' };
        if (m === 'place') return { k: 'r', hl: () => rR(railEls[ech.slot]), t: 'Tap the Action Rail in front of her, or drag me there.' };
        if (m === 'plot') return { k: 'x', hl: hSel('.pod'), t: 'Pick your power, then press Strike.' };
        return null;
      });
      await tutWait(() => G.over || G.turn === 1 || UI.mode === 'idle');
    }
    await tutWait(() => G.turn === 1 || G.over);
    await S('Rarity', 'That was so good!');
    await S('Rarity', "E-Echidna... Are you okay? I didn't hurt you too bad, did I?");
    await S('Echidna', "Don't worry about it, darling.");
    tutGate('enki').r();
    await tutWait(() => G.turn === 0 && UI.mode === 'idle');
    await sleep(500);
    await S('Rarity', 'Heheh, good!');
    await S('Rarity', "Welp! I think that covers this tutorial for now, good luck out there, p-player!");
  };
  if (T.solo && T.solo !== 'wake') T.noPass = false;
  await sleep(700);
  const list = T.solo ? [T.solo] : TUT_CH[2].map(c => c.id);
  for (const id of list) { await C[id](); chMark(2, id); }
  if (T.solo) return tutSoloEnd(T);
  prefs.tut2Done = true; savePrefs(); tutKill(); quitToSquad();
}
async function tutOutro() {
  const T = TUT; if (!T) return; tutHl(null); await sleep(900);
  if (T.n === 2 || T.solo) return;
  const S = tutSay;
  try {
    await S('Jane', 'Ow! Okay, okay. Nice shot.');
    await S('Argo', "And that's the core of it. Strength to hit and block, Agility to dodge and recover, Brains for teamwork, DATA for abilities.");
    await S('Argo', "Brains does more too. Enemy stats are hidden, so Brains also pays to Analyse them for free during your turn. You can also Mark one so your next hit lands harder, Cure a teammate of a mark, or let Brains pay a bit of an ability's DATA cost.");
    await S('Argo', 'Pick an agent, spend a stat, then rest. Anyone resting is wide open, so time your swings around that.');
    await S('Argo', 'There is more, like waking resting agents and moving into fallen slots. The Rules in Options cover it.');
    await S('Argo', 'When you want the clever stuff, Options has a second tutorial on tactics.');
    await S('Argo', 'Now go build a squad. Good luck out there.');
  } catch (e) { if (e !== TUT_STOP) throw e; return; }
  prefs.tutDone = true; savePrefs(); tutKill(); quitToSquad();
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
  E.setHooks({ fx: FX, askDefense: wrapDec(askDefense), askCounter: wrapDec(askCounter), askBrim: wrapDec(askBrim), askClashAtk: wrapDec(askClashAtk), askClashDef: wrapDec(askClashDef), askRetort: wrapDec(askRetort), askResist: wrapDec(askResist), remoteDec, onChange: updateAll, log: m => { $('#ticker').textContent = m; } });
  applyTheme();
  const h = location.hash;
  if (h === '#watch') startGame(['cpu', 'cpu']);
  else if (h === '#demo') startGame();
  else showTitle();

  window.__duel = { showOver, startTutorial, tutKill, fakeOnline: () => { ONL = { role: 'host', oppInfo: { name: 'Tester', elo: 1010, dev: 'tablet' }, playing: false }; chatShow(true); chatRecv({ m: 'hi :fire: n1gg3r' }); }, showOnline,  getTUT: () => TUT,  askRetort, selectAgent, flowTransfer, allyPicked, backToSel, showOver, showArrange, askClashAtk, askClashDef, askDefense, E, UI, startGame, FX, showInspect, getG: () => G, setRoster: r => { roster = r; decks[activeDeck].order = r; }, cards, railEls };
}
boot();
})();
