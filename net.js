/* AnomEx Duel: online play. Peer-to-peer over PeerJS (WebRTC). Both phones run the same rules;
   only moves and defence choices cross the wire. Needs peerjs.min.js loaded first. */
(function (root) {
  'use strict';
  const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const PREFIX = 'anomexduel-';
  const q = new URLSearchParams(location.search);
  function peerOpts() {
    const ps = q.get('ps');            // testing: ?ps=localhost:9000
    if (ps) { const [host, port] = ps.split(':'); return { host, port: +port || 9000, path: '/', secure: false, debug: 0 }; }
    return { debug: 0 };               // PeerJS public cloud
  }
  const newCode = () => { let s = ''; for (let i = 0; i < 5; i++) s += ALPHA[(Math.random() * ALPHA.length) | 0]; return s; };
  const clean = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/[01]/g, m => (m === '0' ? 'O' : 'I'));

  const Net = {
    ok: typeof root.Peer === 'function',
    peer: null, conn: null, role: null, code: null, open: false,
    qs: { act: [], dec: [] }, waits: { act: [], dec: [] }, handlers: {}, lastSeen: 0, hb: 0, onState: () => {},
    on(t, fn) { Net.handlers[t] = fn; },
    reset() {
      clearInterval(Net.hb);
      try { if (Net.conn) Net.conn.close(); } catch (e) { /* closed already */ }
      try { if (Net.peer) Net.peer.destroy(); } catch (e) { /* closed already */ }
      Net.fail(new Error('left'));
      Net.peer = null; Net.conn = null; Net.open = false; Net.role = null; Net.code = null; Net.qs = { act: [], dec: [] };
    },
    fail(err) { ['act', 'dec'].forEach(k => { Net.waits[k].splice(0).forEach(w => w.reject(err)); }); },
    attach(conn) {
      Net.conn = conn;
      conn.on('open', () => {
        Net.open = true; Net.lastSeen = Date.now(); Net.onState('open');
        clearInterval(Net.hb);
        Net.hb = setInterval(() => {
          if (!Net.open) return;
          Net.send({ t: 'ping' });
          if (Date.now() - Net.lastSeen > 20000) Net.lost('timeout');
        }, 4000);
      });
      conn.on('data', m => {
        Net.lastSeen = Date.now();
        if (!m || typeof m !== 'object') return;
        if (m.t === 'ping') return;
        if (m.t === 'act' || m.t === 'dec') {
          const w = Net.waits[m.t].shift();
          if (w) w.resolve(m); else Net.qs[m.t].push(m);
        } else if (Net.handlers[m.t]) Net.handlers[m.t](m);
      });
      conn.on('close', () => Net.lost('closed'));
      conn.on('error', () => Net.lost('error'));
    },
    lost(why) {
      if (!Net.open && why !== 'error') return;
      Net.open = false; clearInterval(Net.hb); Net.fail(new Error('disconnected')); Net.onState('lost', why);
    },
    host(cb) {
      Net.reset(); Net.role = 'host'; let tries = 0;
      const go = () => {
        const code = newCode(); const p = new root.Peer(PREFIX + code, peerOpts()); Net.peer = p;
        const tm = setTimeout(() => { if (!Net.code && cb) { const f = cb; cb = null; try { p.destroy(); } catch (e) { /* ok */ } f(new Error('timed out')); } }, 10000);
        p.on('open', () => { clearTimeout(tm); Net.code = code; cb && cb(null, code); });
        p.on('connection', c => {
          if (Net.conn && Net.open) { c.on('open', () => c.close()); return; }
          Net.attach(c);
        });
        p.on('error', err => {
          if (err.type === 'unavailable-id' && ++tries < 6) { try { p.destroy(); } catch (e) { /* ok */ } go(); return; }
          if (!Net.code) { cb && cb(err); cb = null; } else Net.lost('error');
        });
        p.on('disconnected', () => { try { p.reconnect(); } catch (e) { /* ok */ } });
      };
      go();
    },
    join(code, cb) {
      Net.reset(); Net.role = 'guest'; code = clean(code);
      const p = new root.Peer(peerOpts()); Net.peer = p; let done = false;
      const finish = err => { if (done) return; done = true; cb && cb(err); };
      p.on('open', () => {
        const c = p.connect(PREFIX + code, { reliable: true, serialization: 'json' }); Net.attach(c);
        c.on('open', () => finish(null));
        setTimeout(() => { if (!Net.open) { finish(new Error('no answer')); } }, 12000);
      });
      p.on('error', err => { if (!done) finish(err); else Net.lost('error'); });
    },
    send(m) { if (Net.conn && Net.open) { try { Net.conn.send(m); } catch (e) { Net.lost('error'); } } },
    next(kind) {
      const m = Net.qs[kind].shift(); if (m) return Promise.resolve(m);
      if (!Net.open) return Promise.reject(new Error('disconnected'));
      return new Promise((resolve, reject) => { Net.waits[kind].push({ resolve, reject }); });
    },
    clean
  };

  /* units cross the wire as [owner, slot]: owner 0 = the sender's own side, 1 = the sender's opponent. */
  Net.encode = v => {
    if (v && typeof v === 'object') {
      if ('uid' in v && 'slot' in v && 'side' in v && 'key' in v) return { __u: [v.side === 0 ? 0 : 1, v.slot] };
      if (Array.isArray(v)) return v.map(Net.encode);
      const o = {}; Object.keys(v).forEach(k => { o[k] = Net.encode(v[k]); }); return o;
    }
    return v;
  };
  Net.decode = (v, G) => {
    if (v && typeof v === 'object') {
      if (v.__u) return G.sides[v.__u[0] === 0 ? 1 : 0][v.__u[1]];
      if (Array.isArray(v)) return v.map(x => Net.decode(x, G));
      const o = {}; Object.keys(v).forEach(k => { o[k] = Net.decode(v[k], G); }); return o;
    }
    return v;
  };
  root.Net = Net;
})(window);
