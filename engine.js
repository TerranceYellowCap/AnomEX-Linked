/* AnomEx Duel: rules engine (no DOM). Works in the browser (window.Duel) and in Node (module.exports). */
(function (root) {
'use strict';

const CFG = {
  attackCostFrac: 1,   // Strength spent per attack = ceil(X * frac)
  buffCap: 3,          // stats can sit at most this far above max
  capTTL: 4,           // Capacitor fades after this many turns (2 per player)
  unstableTTL: 4,      // unstable rail slot fades after this many turns (2 per player)
  hideStats: true,     // enemy current stats show as ? until you Analyse them (resets when your turn ends)
  thinkMax: 2,         // Brains can cover up to this much of a fixed DATA ability cost
  debuffIdle: 3,       // Leer / Quick Maths fade after this many turns with neither side acting
  fpDamage: 6,         // Finally Perfect
  brimDamage: 2,
  brimTank: 2,
  clash: true, hpScale: 1,          // tuning knob: multiplies every agent's HP
  budget: 15,          // hiring points per squad
  ookDamage: 15,       // One-of-a-kind release
  hmTTL: 4,            // He's Mine lasts this many turns (2 per player)
  atomDamage: 5, napMax: 11,
  maxTurns: 700
};
const STATS = ['STR', 'AGI', 'BRN', 'DATA'];
const SNAME = { STR: 'Strength', AGI: 'Agility', BRN: 'Brains', DATA: 'DATA' };
const SLETTER = { STR: 'S', AGI: 'A', BRN: 'B', DATA: 'D' };
const ROLE = ['DEF', 'ATK', 'ATK', 'DEF'];

const DEFS = {
  jane: {
    cost: 5, key: 'jane', name: 'Jane', role: 'Striker', color: '#ff6a1a',
    blurb: 'Overwhelming output. Burns through her own reserves.',
    stats: { STR: 8, AGI: 3, BRN: 1, DATA: 9 }, hp: 19, rest: 2,
    abilities: [
      { id: 'amp', name: 'Amplification', cost: 2, target: 'none', text: '+1 Strength. Stacks, up to +3 over max.' },
      { id: 'brim', name: 'Brim', cost: 8, target: 'none', text: 'A pulse hits every enemy agent for 2. Each can tank it by spending 2 DATA.' }
    ]
  },
  argo: {
    cost: 4, key: 'argo', name: 'Argo', role: 'All-rounder', color: '#2fd0c4',
    blurb: 'No weakness, no spike. Reaches across the rail.',
    stats: { STR: 7, AGI: 5, BRN: 3, DATA: 5 }, hp: 25, rest: 2,
    abilities: [
      { id: 'leer', name: 'Leer', cost: 2, target: 'enemy', text: 'Enemy loses 1 Brains and 1 Agility until they are picked, or 3 turns pass with neither of you acting.' },
      { id: 'proj', name: 'Projection', cost: 'X', target: 'enemy', text: 'Ranged. Spend any amount of DATA as damage. Only dodgeable (exact Agility) or body-blocked.' }
    ]
  },
  cathy: {
    cost: 3, key: 'cathy', name: 'Cathy', role: 'Support', color: '#ff4f9a',
    blurb: 'Soft hitter, hard to pin down. Covers her team.',
    stats: { STR: 3, AGI: 7, BRN: 4, DATA: 3 }, hp: 25, rest: 1,
    abilities: [
      { id: 'makeup', name: 'Makeup', cost: 3, target: 'none', text: 'Next time she protects someone she negates all damage, then rests 2 turns instead of 1.' },
      { id: 'fp', name: 'Finally Perfect', cost: 3, target: 'none', text: 'Her next attack costs no Strength and deals 6. Dodge only. She rests 2 turns after.' }
    ]
  },
  wren: {
    cost: 1, key: 'wren', name: 'Wren', role: 'Enabler', color: '#6aa8ff',
    blurb: 'Brains over brawn. Bends the rail and the odds.',
    stats: { STR: 2, AGI: 4, BRN: 8, DATA: 3 }, hp: 23, rest: 2,
    abilities: [
      { id: 'cap', name: 'Capacitor', cost: 2, target: 'slot', text: 'Charge a rail slot: the next Strength attack through it has -2 Strength. Fades if unused.' },
      { id: 'qm', name: 'Quick Maths', cost: 2, target: 'enemy', text: 'Enemy loses 2 Brains until they are picked, or 3 turns pass with neither of you acting.' }
    ]  },
  edica: {
    cost: 3, key: 'edica', name: 'Edica', role: 'Counter', color: '#c9c9c9',
    blurb: 'Bait and punish. Turns one bad swing into a long rest for the attacker.',
    stats: { STR: 4, AGI: 5, BRN: 4, DATA: 3 }, hp: 24, rest: 2,
    abilities: [
      { id: 'dep', name: 'Depulsion', cost: 3, target: 'none', text: 'The next attack on her is reverted (no damage) and the attacker is knocked back (+1 rest). Edica then rests 2 turns. Fades after 2 enemy turns.' },
      { id: 'bd', name: 'Beatdown', cost: 3, target: 'none', text: 'Her next action can hit two different agents with the same Strength. If the first deals no damage, the second is negated.' }
    ]
  },
  ellie: {
    cost: 4, key: 'ellie', name: 'Ellie', role: 'Bruiser', color: '#ff5a1f',
    blurb: 'Huge Strength, zero Brains. Shuts down whoever she hits.',
    stats: { STR: 8, AGI: 4, BRN: 0, DATA: 5 }, hp: 20, rest: 2,
    abilities: [
      { id: 'bash', name: 'Bash', cost: 4, target: 'none', text: 'Her next attack, if it lands damage, also puts that agent into a 1 turn Resting Period.' },
      { id: 'ua', name: 'Unstable Amplification', cost: 5, target: 'none', text: '+3 Strength until her next attack. That attack leaves its rail slot unstable: nobody in it can attack (her team too). She rests 1 extra turn.' }
    ]
  },
  miera: {
    cost: 3, key: 'miera', name: 'Miera', role: 'Tank', color: '#b0b0ff',
    blurb: 'Massive HP and DATA, slow and clumsy. Hits like whoever she borrows from.',
    stats: { STR: 6, AGI: 2, BRN: 1, DATA: 7 }, start: { BRN: 0 }, noRegen: { BRN: true }, hp: 33, rest: 3,
    abilities: [
      { id: 'bb', name: 'Bloodbrother', cost: 6, target: 'ally', text: '+1 Brains. Attack this turn using a teammate\'s Strength instead of her own (their pool is spent).' },
      { id: 'harden', name: 'Harden', cost: 7, target: 'none', text: 'The next attack on her always hits. If it does not kill her, the damage is also dealt to the attacker. Fades after 2 enemy turns.' }
    ]
  },
  opal: {
    cost: 5, key: 'opal', name: 'Opal', role: 'Tactician', color: '#ffd24a',
    blurb: 'Glass cannon with a brain trust. Her neighbour thinks for two.',
    stats: { STR: 9, AGI: 2, BRN: 1, DATA: 3 }, hp: 17, rest: 3,
    abilities: [
      { id: 'tact', name: 'Tactician', cost: 2, target: 'none', text: '+2 Brains to her neighbouring guard (if she attacks) or neighbouring attacker (if she guards).' },
      { id: 'succ', name: 'Successor', cost: 3, target: 'none', text: 'Her next attack cannot be interrupted. It can still be overbid or evaded.' }
    ]
  },
  rarity: {
    cost: 2, key: 'rarity', name: 'Rarity', role: 'Teacher', color: '#7fe0c0',
    blurb: 'Hits like a feather, thinks like a library. Makes teammates hit harder and benches enemies.',
    stats: { STR: 2, AGI: 6, BRN: 9, DATA: 4 }, hp: 19, rest: 1,
    abilities: [
      { id: 'teacher', name: 'Teacher', cost: 3, target: 'ally', text: 'Teach a teammate: their next attack has +1 Strength and cannot be interrupted.' },
      { id: 'rarium', name: 'Rarium', cost: 4, target: 'enemy', text: 'Force an enemy agent into its Resting Period. A charging Echidna loses her charge.' }
    ]
  },
  echidna: {
    cost: 5, key: 'echidna', name: 'Echidna', role: 'Charger', color: '#ff7a3a',
    blurb: 'Slow, huge, and fragile while she winds up. One clean release ends a fight.',
    stats: { STR: 4, AGI: 4, BRN: 6, DATA: 9 }, hp: 18, rest: 3,
    abilities: [
      { id: 'ook', name: 'One-of-a-kind', cost: 3, target: 'none', text: 'A 3 turn ability, 3 DATA a turn. Turn 1 gather, turn 2 swirl, turn 3 release for 15 damage, then she rests. While charging she cannot attack or dodge, and any direct hit breaks the charge.' },
      { id: 'enki', name: 'Enki', cost: 'X', target: 'none', text: 'Spend X DATA to heal X HP. Usable once every 3 turns she is picked.' }
    ]
  },
  julian: {
    cost: 1, key: 'julian', name: 'Julian', role: 'Lamb', color: '#d8d8ff', pair: 'delilah',
    blurb: 'Fragile and never rests. Only plays alongside Delilah, side by side. Picking either one regens both.',
    stats: { STR: 1, AGI: 4, BRN: 3, DATA: 2 }, hp: 16, rest: 0,
    abilities: [
      { id: 'lamb', name: 'Lamb', cost: 1, target: 'none', text: 'Gives +1 Strength to Delilah.' },
      { id: 'panic', name: 'Panic', cost: 2, target: 'none', text: 'A shockwave of DATA: every enemy loses 1 Agility until they are picked.' }
    ]
  },
  delilah: {
    cost: 4, key: 'delilah', name: 'Delilah', role: 'Guardian', color: '#e2335a', pair: 'julian',
    roleBuff: { atk: { STR: 1 }, def: { BRN: 1 } },
    blurb: 'Brutal, and only with Julian beside her. +1 Strength in an attack slot, +1 Brains in a guard slot.',
    stats: { STR: 7, AGI: 4, BRN: 0, DATA: 5 }, hp: 24, rest: 3,
    abilities: [
      { id: 'manip', name: 'Manipulator', cost: 4, target: 'none', text: 'The next hit on her is redirected onto Julian. In exchange she gets +3 Strength, lost if she is not picked next turn.' },
      { id: 'hm', name: "He's Mine", cost: 5, target: 'none', text: 'Hidden. If anyone attacks Julian, Delilah strikes back for him. Lasts 4 turns if not triggered.' }
    ]
  },
  wraith: {
    cost: 3, key: 'wraith', name: 'Wraith', role: 'Trapper', color: '#9a9aff',
    blurb: 'Sets hidden rail traps and can freeze the whole enemy team at a heavy price.',
    stats: { STR: 4, AGI: 6, BRN: 2, DATA: 4 }, hp: 19, rest: 2,
    abilities: [
      { id: 'atom', name: 'Atomise', cost: 4, target: 'slot', text: 'Hidden. Coat a rail slot in DATA. The first enemy that attacks through it is coated. Once someone is coated this becomes Discharge: 1 DATA, the coated agent takes 5, and Wraith rests.' },
      { id: 'jump', name: 'Jumpscare', cost: 4, target: 'none', text: 'Sacrifice ALL her stats and rest, to put every enemy agent into its Resting Period.' }
    ]
  },
  cray: {
    cost: 2, key: 'cray', name: 'Cray', role: 'Blocker', color: '#8fe08f',
    blurb: 'Slow and sturdy. Clogs the rail and pins enemies down with buds.',
    stats: { STR: 3, AGI: 1, BRN: 5, DATA: 3 }, hp: 21, rest: 1,
    abilities: [
      { id: 'lost', name: 'Lost', cost: 2, target: 'none', text: 'After his next attack he stays on that rail slot for 1 turn, blocking it. Nobody can attack through it.' },
      { id: 'stat', name: 'Stationary', cost: 3, target: 'none', text: 'His next attack plants a bud on its target. They cannot attack until Cray is attacked.' }
    ]
  },
  neko: {
    cost: 4, key: 'neko', name: 'Neko', role: 'Napper', color: '#ffb0d0',
    blurb: 'Starts weak and never regens Strength. Naps to build it up to 11, but a napping cat is exposed.',
    stats: { STR: 11, AGI: 5, BRN: 2, DATA: 2 }, start: { STR: 2 }, noRegen: { STR: true }, hp: 19, rest: 0,
    abilities: [
      { id: 'catnap', name: 'Catnap', cost: 0, target: 'none', text: 'Start a nap: +1 Strength every turn of yours she sleeps (max 11). Napping she is exposed and cannot guard. Pick her to wake and act.' },
      { id: 'sharp', name: 'Sharpen', cost: 2, target: 'none', text: 'Her next attack has +1 Strength and cannot be blocked with Strength.' }
    ]
  },
  nessy: {
    cost: 4, key: 'nessy', name: 'Nessy', role: 'Skirmisher', color: '#ff9ad0', small: true,
    blurb: 'Small and hard to hit (-1 Strength on attacks against her). Hits twice, stings everyone.',
    stats: { STR: 5, AGI: 3, BRN: 3, DATA: 3 }, hp: 17, rest: 2,
    abilities: [
      { id: 'ds', name: 'Double-Smack', cost: 3, target: 'none', text: 'Her next attack hits the same agent twice. The second hit is half damage, rounded up.' },
      { id: 'vesp', name: 'Vesp', cost: 'X', target: 'enemy', text: 'Ranged DATA sting for X at one enemy, then 1 damage chains to every other enemy.' }
    ]
  },
  tyrees: {
    cost: 4, key: 'tyrees', name: 'Tyrees', role: 'Reflector', color: '#ff7a3a',
    blurb: 'Turns attacks around. Sends hits at the agent opposite him, and turns counters into extra damage.',
    stats: { STR: 4, AGI: 5, BRN: 2, DATA: 5 }, hp: 22, rest: 2,
    abilities: [
      { id: 'dcount', name: 'Depu-counter', cost: 5, target: 'none', text: 'For 2 turns, the next attack on him is reflected onto the enemy agent opposite his slot.' },
      { id: 'baton', name: 'Harden', cost: 3, target: 'none', text: 'Hidden. His next attack carries a baton: any counter the target would throw back hits the target instead, on top of the attack.' }
    ]
  },
  argithia: {
    cost: 4, key: 'argithia', name: 'Argithia-Green', short: 'Argithia', role: 'Freezer', color: '#9ae04a',
    blurb: 'Marks attackers, freezes repeat offenders, and leaves red shards that bleed the target (and her DATA).',
    stats: { STR: 6, AGI: 5, BRN: 1, DATA: 2 }, hp: 26, rest: 3,
    abilities: [
      { id: 'impr', name: 'Impression', cost: 2, target: 'none', text: 'For 2 turns, anyone who attacks her is imprinted with Atomise. If the same agent attacks her again, it is frozen in Hardened DATA for 3 turns.' },
      { id: 'blend', name: 'Blender', cost: 2, target: 'none', text: '+1 Strength. If her next attack lands, red shards circle the target: 1 damage each time it is picked, 6 in total. Each prick costs her 1 DATA, even below zero.' }
    ]
  },
  frey: {
    cost: 3, key: 'frey', name: 'Frey', role: 'Wingwoman', color: '#ffb84a',
    blurb: 'Hides a glob of DATA on an ally that stops the next attacker, and dives in behind her teammates.',
    stats: { STR: 3, AGI: 1, BRN: 5, DATA: 5 }, hp: 19, rest: 1,
    abilities: [
      { id: 'fglob', name: 'Stationary', cost: 4, target: 'ally', text: 'Hidden. Give a glob of DATA to a teammate (or herself). When that agent is attacked, the attack is stopped and the attacker cannot dodge for 2 turns.' },
      { id: 'wing', name: 'Wingwoman', cost: 3, target: 'none', text: 'The next time a teammate lands an attack, she charges in on the same target with all her remaining Strength (1 if she has none).' }
    ]
  },
  mason: {
    cost: 3, key: 'mason', name: 'Mason', role: 'Rookie', color: '#7ad0ff',
    blurb: 'Has no Strength of his own and cannot regain DATA: he has to be fed it by teammates. Copies a neighbour and takes hits for the team.',
    stats: { STR: 11, AGI: 5, BRN: 8, DATA: 1 }, start: { STR: 0 }, noRegen: { STR: true, DATA: true }, hp: 24, rest: 1,
    abilities: [
      { id: 'rookie', name: 'Rookie numbers', cost: 1, target: 'none', text: 'Raise his Strength to match the agent next to him. His next attack makes him rest 1 turn longer.' },
      { id: 'coll', name: 'Collateral', cost: 1, target: 'none', text: 'For 2 turns, when a teammate is attacked he takes ALL of it and rests. The attacker rests 1 extra turn.' }
    ]
  }
};

const SHORT_TXT = { dcount: 'Next attack on him goes to the enemy opposite him.', baton: 'Hidden. His next attack turns the target\'s counter back on them.', impr: 'Attackers get marked. Hit her twice and they freeze.', blend: '+1 Strength. A landed hit leaves 6 shards. Costs her DATA.', fglob: 'Hidden. Stops the next attacker of one teammate.', wing: 'A teammate lands a hit: she charges in on it.', rookie: 'Match a neighbour\'s Strength. Next attack: rest +1.', coll: 'Takes the next attack on a teammate. Attacker rests +1.', amp: '+1 Strength. Stacks to +3 over max.', brim: 'Hits every enemy for 2. They can tank it with 2 DATA.', leer: 'Enemy: -1 Brains, -1 Agility until picked.', proj: 'Ranged. Spend X DATA as damage. Dodge only.', makeup: 'Next cover negates all damage. Rests 2.', fp: 'Next attack: 6 damage, no Strength.', cap: 'Charge a slot: next Strength hit there gets -2.', qm: 'Enemy: -2 Brains until picked.', dep: 'Next attack on her is reverted. She then rests 2.', bd: 'Next attack hits 2 agents, same Strength.', bash: 'Next hit that lands makes the target rest 1.', ua: '+3 Strength. Next attack locks its slot.', bb: '+1 Brains. Attack using an ally\'s Strength.', harden: 'Next hit lands, then reflects onto the attacker.', tact: '+2 Brains to her neighbouring agent.', succ: 'Next attack cannot be interrupted.', teacher: 'Ally: next attack +1 Strength, uninterruptible.', rarium: 'Force an enemy into its Resting Period.', ook: '3 turn charge, 15 damage release.', enki: 'Spend X DATA to heal X HP. Once per 3 picks.', lamb: '+1 Strength to Delilah.', panic: 'Every enemy: -1 Agility until picked.', manip: 'Next hit on her goes to Julian. She gets +3 Strength.', hm: 'Hidden. She strikes back at anyone who hits Julian.', atom: 'Hidden rail trap. Coats the first enemy through it.', disch: 'Coated agent takes 5. Wraith rests.', jump: 'Lose all stats, rest. Every enemy rests.', lost: 'Next attack: he blocks that slot for 1 turn.', stat: 'Next attack plants a bud: target cannot attack.', catnap: 'Nap: +1 Strength a turn. Exposed while asleep.', sharp: 'Next attack +1 Strength, cannot be blocked.', ds: 'Next attack hits twice. 2nd hit is half.', vesp: 'Ranged X DATA sting. 1 damage to the rest.' };
Object.values(DEFS).forEach(d => d.abilities.forEach(a => { a.short = SHORT_TXT[a.id]; }));

let G = null;
let UID = 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const R = () => Math.random();

/* ---------- hooks (UI plugs in here) ---------- */
const noop = async () => {};
const FXNAMES = ['pick', 'declare', 'strike', 'hit', 'counter', 'dodge', 'die', 'dataBurst', 'brim', 'buff', 'debuff', 'rail', 'float', 'clash', 'charge', 'coat', 'discharge', 'jumpscare', 'prick', 'credit'];
const H = { fx: {}, askDefense: null, askCounter: null, askBrim: null, askClashAtk: null, askClashDef: null, askRetort: null, askResist: null, remoteDec: null, onChange() {}, log() {}, wait: () => Promise.resolve() };
FXNAMES.forEach(n => { H.fx[n] = noop; });
function setHooks(h) {
  if (h.fx) Object.assign(H.fx, h.fx);
  ['askDefense', 'askCounter', 'askBrim', 'askClashAtk', 'askClashDef', 'askRetort', 'askResist', 'remoteDec', 'onChange', 'log', 'wait'].forEach(k => { if (h[k]) H[k] = h[k]; });
}

/* ---------- state ---------- */
function makeAgent(key, side, slot) {
  const d = DEFS[key];
  const max = Object.assign({}, d.stats);
  const hp = Math.max(1, Math.round(d.hp * CFG.hpScale));
  const rb = d.roleBuff && d.roleBuff[ROLE[slot] === 'ATK' ? 'atk' : 'def']; if (rb) Object.keys(rb).forEach(k => { max[k] += rb[k]; });
  const cur0 = Object.assign({}, max, d.start || {});
  return { uid: ++UID, key, name: d.name, side, slot, max, cur: cur0, noRegen: d.noRegen || {}, hp, maxhp: hp, restN: d.rest, rest: 0, alive: true, makeup: false, fp: false, dep: 0, bd: false, bash: false, ua: false, harden: 0, succ: false, taught: false, noInt: false, chg: 0, enki: 0, manip: false, boost: 0, hm: 0, coat: null, bud: null, lost: false, stat: false, nap: false, sharp: false, sharpNow: false, ds: false, small: !!d.small, dc: 0, baton: false, batonNow: false, imp: 0, blend: false, shard: null, glob: null, wing: false, rookie: false, coll: 0, noDodge: 0, frz: false, frzN: 0 };
}
let ACH = { chain: [0, 0], ch: null, ctr: [0, 0], blk: [0, 0], raise: 0, ana: [[], []], cure: [0, 0] };
function newGame(order0, order1, ctrl, names) {
  UID = 0; ACH = { chain: [0, 0], ch: null, ctr: [0, 0], blk: [0, 0], raise: 0, ana: [[], []], cure: [0, 0] };
  G = { cr: { pts: [0, 0], hurt: [0, 0], log: [] }, sides: [[], []], rail: [null, null, null, null], atom: [[null, null, null, null], [null, null, null, null]], debuffs: [], seen: [[], []], turn: 0, turnNo: 1, over: false, winner: null, ctrl: ctrl || ['human', 'cpu'], names: names || ['You', 'CPU'], log: [] };
  [order0, order1].forEach((ord, s) => ord.forEach((k, i) => G.sides[s].push(makeAgent(k, s, i))));
  return G;
}
const getG = () => G;
function setTutor(v) { TUTOR = v || false; TUT2_RAISED = false; TUT2_BLOCK = false; }
function tutBlock(v) { TUT2_BLOCK = !!v; }
function addAgent(side, key) { const u = makeAgent(key, side, G.sides[side].length); G.sides[side].push(u); return u; }
function dropLast(side) { return G.sides[side].pop(); }
function statsFor(key, slot) {
  if (slot > 3) return Object.assign({}, DEFS[key].stats);
  const d = DEFS[key], st = Object.assign({}, d.stats), rb = d.roleBuff && d.roleBuff[ROLE[slot] === 'ATK' ? 'atk' : 'def'];
  if (rb) Object.keys(rb).forEach(k => { st[k] += rb[k]; }); return st;
}
function squadCost(keys) { return keys.reduce((n, k) => n + (DEFS[k] ? DEFS[k].cost : 0), 0); }
function validSquad(keys) {
  if (keys.length !== 4 || keys.some(k => !k || !DEFS[k])) return { ok: false, reason: 'Fill all four slots to start.' };
  if (squadCost(keys) > CFG.budget) return { ok: false, reason: 'Over budget: ' + squadCost(keys) + ' of ' + CFG.budget + ' hiring points.' };
  const j = keys.indexOf('julian'), d = keys.indexOf('delilah');
  if (j < 0 && d < 0) return { ok: true };
  if (j < 0) return { ok: false, reason: 'Delilah only plays with Julian beside her.' };
  if (d < 0) return { ok: false, reason: 'Julian only plays with Delilah beside him.' };
  if (Math.abs(j - d) !== 1) return { ok: false, reason: 'Julian and Delilah must sit side by side.' };
  return { ok: true };
}
const blk = slot => !!(G.rail[slot] && G.rail[slot].type === 'lost');
async function trigAtom(a, slot) {
  const w = G.atom[1 - a.side][slot];
  if (!w || !w.alive) return;
  G.atom[1 - a.side][slot] = null;
  if (!a.coat) { a.coat = w; log(a.name + " is coated in " + w.name + "'s DATA"); H.onChange(); await H.fx.coat(a, slot); }
}
const partnerOf = a => { const k = DEFS[a.key].pair; return k ? G.sides[a.side].find(u => u.key === k) || null : null; };
const alive = s => G.sides[s].filter(u => u.alive);
const enemies = s => alive(1 - s);
const log = m => { G.log.push(m); H.log(m); };
const settleRest = (a, base) => { const r = Math.max(base + (a.knock ? 1 : 0), a.frzN || 0); a.knock = false; if (a.frzN) { a.frz = true; a.frzN = 0; } return r; };
const adjacentOf = a => [a.slot - 1, a.slot + 1].map(i => G.sides[a.side][i]).filter(u => u && u.alive);

// What a stat will be once this agent is picked: debuffs on it lift first, then +1 regen up to max.
function proj(u, k) {
  let v = u.cur[k];
  G.debuffs.forEach(d => { if (d.target === u && d.amt[k]) v += d.amt[k]; });
  v = Math.min(v, u.max[k] + CFG.buffCap);
  return (v < u.max[k] && !(u.noRegen && u.noRegen[k]) && !(k === 'BRN' && !CFG.brnRegen)) ? Math.min(u.max[k], v + 1) : v;
}
function regen(u) { STATS.forEach(k => { if (u.cur[k] < u.max[k] && !(u.noRegen && u.noRegen[k]) && !(k === 'BRN' && !CFG.brnRegen)) u.cur[k] = Math.min(u.max[k], u.cur[k] + 1); }); }
const capAt = slot => !!(G.rail[slot] && G.rail[slot].type === 'cap');

function protectorsOf(t) {
  return G.sides[t.side].filter(u => u.alive && u !== t && u.rest === 0 && u.cur.BRN >= 1 &&
    !u.nap && (u.slot === 0 || u.slot === 3) && Math.abs(u.slot - t.slot) === 1);
}
const unst = u => !!(G.rail[u.slot] && G.rail[u.slot].type === 'unstable');
function neighbourOf(a) { const n = { 0: 1, 1: 0, 2: 3, 3: 2 }[a.slot]; const u = G.sides[a.side][n]; return u && u.alive ? u : null; }
function attackMax(a, t, pool) {
  if (unst(a) || a.chg > 0 || a.bud) return 0;
  if (t && blk(t.slot)) return 0;
  if (a.fp) return CFG.fpDamage;
  if (pool) { const S = pool.cur.STR; return capAt(t.slot) ? Math.max(0, S - 2) : S; }
  const pS = proj(a, 'STR');
  return capAt(t.slot) ? Math.max(0, pS - 2) : pS;
}
function canAttack(a) {
  const foes = enemies(a.side);
  if (!foes.length) return { ok: false, reason: 'no targets' };
  if (unst(a)) return { ok: false, reason: 'unstable slot' };
  if (a.chg > 0) return { ok: false, reason: 'charging' };
  if (a.bud) return { ok: false, reason: 'stationary bud' };
  if (a.fp) return foes.some(f => !blk(f.slot)) ? { ok: true } : { ok: false, reason: 'slot blocked' };
  if (foes.some(t => attackMax(a, t) >= 1)) return { ok: true };
  return { ok: false, reason: 'no Strength' };
}
function abilityState(a, id) {
  const pDraw = proj(a, 'DATA'), pS = proj(a, 'STR'), pD = pDraw + Math.min(CFG.thinkMax, Math.max(0, proj(a, 'BRN')));
  const hasFoe = enemies(a.side).length > 0;
  const need = c => (pD >= c ? { ok: true, cost: c } : { ok: false, reason: 'needs ' + c + ' DATA' });
  switch (id) {
    case 'amp': if (pS >= a.max.STR + CFG.buffCap) return { ok: false, reason: 'at buff cap' }; return need(2);
    case 'brim': if (!hasFoe) return { ok: false, reason: 'no targets' }; return need(8);
    case 'leer': if (!hasFoe) return { ok: false, reason: 'no targets' }; return need(2);
    case 'qm': if (!hasFoe) return { ok: false, reason: 'no targets' }; return need(2);
    case 'cap': return need(2);
    case 'makeup': if (a.makeup) return { ok: false, reason: 'already ready' }; return need(3);
    case 'fp': if (a.fp) return { ok: false, reason: 'already ready' }; return need(3);
    case 'vesp': case 'proj': if (unst(a)) return { ok: false, reason: 'unstable slot' }; if (a.bud) return { ok: false, reason: 'stationary bud' }; if (hasFoe && enemies(a.side).every(f => blk(f.slot))) return { ok: false, reason: 'slot blocked' }; if (!hasFoe) return { ok: false, reason: 'no targets' }; return pDraw >= 1 ? { ok: true } : { ok: false, reason: 'no DATA' };
    case 'dep': if (a.dep > 0) return { ok: false, reason: 'already active' }; return need(3);
    case 'bd': if (a.bd) return { ok: false, reason: 'already ready' }; if (!hasFoe) return { ok: false, reason: 'no targets' }; return need(3);
    case 'bash': if (a.bash) return { ok: false, reason: 'already ready' }; return need(4);
    case 'ua': if (a.ua) return { ok: false, reason: 'already ready' }; if (pS >= a.max.STR + CFG.buffCap) return { ok: false, reason: 'at buff cap' }; return need(5);
    case 'bb': {
      if (unst(a) || a.bud) return { ok: false, reason: a.bud ? 'stationary bud' : 'unstable slot' };
      if (!hasFoe) return { ok: false, reason: 'no targets' };
      if (!G.sides[a.side].some(u => u.alive && u !== a && u.cur.STR >= 1)) return { ok: false, reason: 'no one to borrow from' };
      return need(6);
    }
    case 'harden': if (a.harden > 0) return { ok: false, reason: 'already active' }; return need(7);
    case 'tact': if (!neighbourOf(a)) return { ok: false, reason: 'no neighbour' }; return need(2);
    case 'succ': if (a.succ) return { ok: false, reason: 'already ready' }; return need(3);
    case 'atom': if (G.atom[a.side].every(Boolean)) return { ok: false, reason: 'every slot is coated' }; return need(4);
    case 'disch': if (!abilityTargets(a, 'disch').length) return { ok: false, reason: 'nobody coated' }; return need(1);
    case 'jump': if (!enemies(a.side).some(f => f.restN > 0)) return { ok: false, reason: 'nothing to freeze' }; return need(4);
    case 'lost': if (a.lost) return { ok: false, reason: 'already ready' }; return need(2);
    case 'stat': if (a.stat) return { ok: false, reason: 'already ready' }; return need(3);
    case 'catnap': if (a.nap) return { ok: true }; if (a.cur.STR >= a.max.STR) return { ok: false, reason: 'Strength is maxed' }; return { ok: true };
    case 'sharp': if (a.sharp) return { ok: false, reason: 'already ready' }; return need(2);
    case 'ds': if (a.ds) return { ok: false, reason: 'already ready' }; if (!hasFoe) return { ok: false, reason: 'no targets' }; return need(3);
    case 'teacher': if (!G.sides[a.side].some(u => u.alive && u !== a)) return { ok: false, reason: 'no teammate' }; return need(3);
    case 'rarium': if (!abilityTargets(a, 'rarium').length) return { ok: false, reason: 'no one to bench' }; return need(4);
    case 'ook': if (!hasFoe) return { ok: false, reason: 'no targets' }; return need(3);
    case 'enki':
      if (a.chg > 0) return { ok: false, reason: 'charging' };
      if (a.enki > 0) return { ok: false, reason: 'ready in ' + a.enki + (a.enki > 1 ? ' picks' : ' pick') };
      if (a.hp >= a.maxhp) return { ok: false, reason: 'already full HP' };
      return pDraw >= 1 ? { ok: true } : { ok: false, reason: 'no DATA' };
    case 'lamb': { const p = partnerOf(a); if (!p || !p.alive) return { ok: false, reason: 'Delilah is down' }; if (p.cur.STR >= p.max.STR + CFG.buffCap) return { ok: false, reason: 'at buff cap' }; return need(1); }
    case 'panic': if (!enemies(a.side).some(f => f.cur.AGI >= 1)) return { ok: false, reason: 'no Agility to drain' }; return need(2);
    case 'manip': { const p = partnerOf(a); if (a.manip) return { ok: false, reason: 'already ready' }; if (!p || !p.alive) return { ok: false, reason: 'Julian is down' }; return need(4); }
    case 'dcount': if (a.dc > 0) return { ok: false, reason: 'already active' }; return need(5);
    case 'baton': if (a.baton) return { ok: false, reason: 'already ready' }; return need(3);
    case 'impr': if (a.imp > 0) return { ok: false, reason: 'already active' }; return need(2);
    case 'blend': if (a.blend) return { ok: false, reason: 'already ready' }; if (!hasFoe) return { ok: false, reason: 'no targets' }; if (pS >= a.max.STR + CFG.buffCap) return { ok: false, reason: 'at buff cap' }; return need(2);
    case 'fglob': if (!abilityTargets(a, 'fglob').length) return { ok: false, reason: 'everyone has one' }; return need(4);
    case 'wing': if (a.wing) return { ok: false, reason: 'already ready' }; if (!G.sides[a.side].some(u => u.alive && u !== a)) return { ok: false, reason: 'no teammate' }; return need(3);
    case 'rookie': if (!adjacentOf(a).some(u => u.cur.STR > a.cur.STR)) return { ok: false, reason: 'no stronger neighbour' }; if (a.rookie) return { ok: false, reason: 'already ready' }; return need(1);
    case 'coll': if (a.coll > 0) return { ok: false, reason: 'already active' }; if (!G.sides[a.side].some(u => u.alive && u !== a)) return { ok: false, reason: 'no teammate' }; return need(1);
    case 'hm': { const p = partnerOf(a); if (a.hm > 0) return { ok: false, reason: 'already set' }; if (!p || !p.alive) return { ok: false, reason: 'Julian is down' }; return need(5); }
  }
  return { ok: false, reason: '?' };
}
function abilityTargets(a, id) {
  if (id === 'disch') return enemies(a.side).filter(f => f.coat && f.coat.side === a.side);
  if (id === 'vesp') return enemies(a.side).filter(f => !blk(f.slot));
  if (id === 'teacher') return G.sides[a.side].filter(u => u.alive && u !== a);
  if (id === 'fglob') return G.sides[a.side].filter(u => u.alive && !u.glob);
  if (id === 'rarium') return enemies(a.side).filter(f => f.rest === 0 && f.restN > 0);
  return enemies(a.side);
}
function abilityView(a, ab) {
  if (ab.id === 'catnap' && a.nap) return Object.assign({}, ab, { name: 'Wake up', short: 'End the nap. This uses her pick, no other action.', text: 'End the nap. This uses her pick.' });
  if (ab.id === 'atom' && abilityTargets(a, 'disch').length) return Object.assign({}, ab, { id: 'disch', name: 'Discharge', cost: 1, target: 'enemy', short: SHORT_TXT.disch, text: 'The coated agent explodes for 5 damage. Wraith rests.' });
  if (ab.id !== 'ook') return ab;
  const n = a.chg | 0;
  return Object.assign({}, ab, { name: ['One-of-a-kind 1/3', 'One-of-a-kind 2/3', 'RELEASE 3/3'][n], short: ['Gather DATA. No attacking or dodging until released.', 'Swirl DATA. Any direct hit breaks the charge.', 'Release: 15 damage to one enemy, then she rests.'][n], target: n === 2 ? 'enemy' : 'none' });
}
function transferStatOk(a, k) {
  const pB = proj(a, 'BRN');
  if (pB < 1) return false;
  const have = proj(a, k) - (k === 'BRN' ? 1 : 0);
  return have >= 1;
}
function canTransfer(a) {
  if (proj(a, 'BRN') < 1) return { ok: false, reason: 'needs 1 Brains' };
  if (alive(a.side).filter(u => u !== a).length === 0) return { ok: false, reason: 'no teammate' };
  if (!STATS.some(k => transferStatOk(a, k))) return { ok: false, reason: 'nothing to give' };
  return { ok: true };
}
function canRecover(a) {
  if (proj(a, 'AGI') < 1) return { ok: false, reason: 'needs 1 Agility' };
  return STATS.some(k => k !== 'AGI' && proj(a, k) < a.max[k] && !(a.noRegen && a.noRegen[k])) ? { ok: true } : { ok: false, reason: 'nothing to restore' };
}
function canMark(a) { if (proj(a, 'BRN') < 1) return { ok: false, reason: 'needs 1 Brains' }; return enemies(a.side).some(f => !f.mark) ? { ok: true } : { ok: false, reason: 'everyone is marked' }; }
function cureTargets(a) { return G.sides[a.side].filter(u => u.alive && (u.mark || u.noDodge > 0)); }
function canCure(a) { if (proj(a, 'BRN') < 2) return { ok: false, reason: 'needs 2 Brains' }; return cureTargets(a).length ? { ok: true } : { ok: false, reason: 'nobody has anything to cure' }; }
function canAnalyse(a) { if (!a.alive || a.rest > 0) return { ok: false, reason: 'resting' }; if (proj(a, 'BRN') < 1) return { ok: false, reason: 'needs 1 Brains' }; return enemies(a.side).length ? { ok: true } : { ok: false, reason: 'no targets' }; }

function canWake(a) {
  if (!a.alive || a.rest < 1) return { ok: false, reason: 'not resting' };
  if (a.frz || a.nap) return { ok: false, reason: 'cannot be woken' };
  if (proj(a, 'AGI') < a.rest) return { ok: false, reason: 'needs ' + a.rest + ' Agility' };
  return { ok: true, cost: a.rest };
}
function moveOptions(a) {
  if (!a.alive || a.rest > 0 || a.nap || a.frz) return [];
  const ag = proj(a, 'AGI');
  return G.sides[a.side].filter(u => !u.alive && Math.abs(u.slot - a.slot) <= ag).map(u => ({ slot: u.slot, cost: Math.abs(u.slot - a.slot) }));
}
/* ---------- debuffs ---------- */
function addDebuff(src, t, want) {
  const amt = {};
  Object.keys(want).forEach(k => { const x = Math.min(t.cur[k], want[k]); if (x > 0) { t.cur[k] -= x; amt[k] = x; } });
  G.debuffs.push({ src, target: t, amt, idle: 0 });
}
function restoreDebuff(d) {
  Object.keys(d.amt).forEach(k => { d.target.cur[k] = Math.min(d.target.max[k] + CFG.buffCap, d.target.cur[k] + d.amt[k]); });
  G.debuffs = G.debuffs.filter(x => x !== d);
}
function expireDebuffsOn(u) { G.debuffs.filter(d => d.target === u).forEach(restoreDebuff); }

/* ---------- damage ---------- */
function credit(side, pts, txt) { if (!G || !G.cr) return; G.cr.pts[side] += pts; G.cr.log.push([side, pts, txt]); try { H.fx.credit(side, pts, txt); } catch (e) {} }
async function dealDamage(u, n, src, kind) {
  if (n <= 0 || !u.alive) return;
  if (kind === 'counter' && src && src.side !== undefined && src.side !== u.side) ACH.ctr[src.side]++;
  if (u.mark && src && src.side !== undefined && src.side !== u.side && u.mark.by === src.uid) { u.mark = false; n += 1; log(u.name + ' was marked: the hit lands +1'); }
  G.cr.hurt[u.side] += n;
  u.hp = Math.max(0, u.hp - n);
  log(u.name + ' takes ' + n);
  H.onChange();
  await H.fx.hit(u, n, kind || 'str', src);
  if (u.hp <= 0) {
    u.alive = false;
    G.atom[u.side] = [null, null, null, null]; G.sides.forEach(ss => ss.forEach(x => { if (x.coat === u) x.coat = null; if (x.bud === u) x.bud = null; }));
    G.debuffs.filter(d => d.target === u || d.src === u).forEach(d => { if (d.target.alive) restoreDebuff(d); else G.debuffs = G.debuffs.filter(x => x !== d); });
    log(u.name + ' is down.');
    H.onChange();
    if (src && src.side !== undefined && src.side !== u.side) credit(src.side, 1, '-1 Agent (' + u.name + ')');
    await H.fx.die(u);
  }
}

/* ---------- defence ---------- */
function normDecision(ctx, d) {
  const t = ctx.target, X = ctx.X;
  if (!d) return { type: 'take' };
  if (d.type === 'block' && ctx.canBlock) return { type: 'block', s: clamp(d.s | 0, 0, t.cur.STR) };
  if (d.type === 'dodge' && ctx.canDodge) return { type: 'dodge' };
  if (d.type === 'interrupt' && ctx.protectors.includes(d.by)) {
    const by = d.by;
    return { type: 'interrupt', by, s: ctx.kind === 'str' ? clamp(d.s | 0, 0, Math.min(X, by.cur.STR)) : 0 };
  }
  return { type: 'take' };
}
async function getDefense(ctx) {
  const t = ctx.target;
  let d;
  if (G.ctrl[t.side] === 'human' && H.askDefense) d = await H.askDefense(ctx);
  else if (G.ctrl[t.side] === 'remote' && H.remoteDec) d = await H.remoteDec('def', ctx);
  else d = aiDefend(ctx);
  return normDecision(ctx, d);
}

async function resolveHit(a, t, X, kind) {
  if (t.key === 'cray') G.sides[1 - t.side].forEach(u => { if (u.bud === t) { u.bud = null; log(u.name + "'s bud withers: it can attack again"); } });
  if (t.glob) {
    t.glob = null; a.noDodge = 3;
    log(a.name + "'s attack on " + t.name + ' is stopped by a glob of DATA: no dodging for 2 turns');
    H.onChange();
    await H.fx.strike(a, t, X, kind, 'negate', null);
    await H.fx.float(t, 'STATIONARY', 'blk'); await H.fx.float(a, 'STOPPED', 'neg');
    return { landed: false, dmg: 0 };
  }
  if (t.key !== 'mason') {
    const mm = G.sides[t.side].find(u => u.key === 'mason' && u.alive && u.coll > 0 && u.rest === 0 && u !== t);
    if (mm) {
      mm.coll = 0; mm.rest = mm.restN; a.knock = true;
      log(mm.name + ' steps in with Collateral: takes all ' + X + ' for ' + t.name + ', ' + a.name + ' rests 1 extra turn');
      H.onChange();
      await H.fx.float(mm, 'COLLATERAL', 'blk');
      await H.fx.strike(a, mm, X, kind, 'body', null);
      await dealDamage(mm, X, a, kind);
      return { landed: true, dmg: X };
    }
  }
  if (t.dc > 0) {
    t.dc = 0;
    const opp = G.sides[a.side][t.slot];
    log(t.name + ' Depu-counter: the hit is reflected at ' + (opp && opp.alive ? opp.name : a.name));
    H.onChange();
    await H.fx.float(t, 'DEPU-COUNTER', 'blk');
    if (opp && opp.alive && opp !== a) { await H.fx.strike(a, t, X, kind, 'negate', null); return await resolveHit(a, opp, X, kind); }
    await H.fx.strike(a, t, X, kind, 'negate', null);
    await dealDamage(a, X, t, 'counter');
    return { landed: false, dmg: 0 };
  }
  if (t.dep > 0) {
    t.dep = 0; a.knock = true; t.rest = Math.max(t.rest, t.restN);
    log(t.name + ' Depulsion: ' + a.name + "'s attack is reverted and " + a.name + ' is sent back');
    H.onChange();
    await H.fx.strike(a, t, X, kind, 'negate', null);
    await H.fx.float(t, 'DEPULSION', 'blk'); await H.fx.float(a, 'SENT BACK', 'neg');
    return { landed: false, dmg: 0 };
  }
  if (t.manip && t.key === 'delilah') {
    const j = partnerOf(t);
    if (j && j.alive) {
      t.manip = false; t.boost = Math.max(0, Math.min(3, t.max.STR + CFG.buffCap - t.cur.STR)); t.cur.STR += t.boost;
      log(t.name + ' manipulates: the hit goes to ' + j.name + ' instead');
      H.onChange();
      await H.fx.float(t, 'MANIPULATOR', 'blk'); await H.fx.buff(t, '+3 STR');
      return await resolveHit(a, j, X, kind);
    }
  }
  if (t.small) {
    X = Math.max(0, X - 1); log(t.name + ' is small: the attack loses 1 Strength');
    if (X < 1) { H.onChange(); await H.fx.strike(a, t, 0, kind, 'negate', null); await H.fx.float(t, 'TOO SMALL', 'blk'); return { landed: false, dmg: 0 }; }
  }
  if (t.imp > 0 && t.alive) {
    if (a.coat === t) {
      a.coat = null; a.frzN = 3; log(a.name + ' attacks ' + t.name + ' a second time and is frozen in Hardened DATA for 3 turns');
      await H.fx.float(a, 'FROZEN', 'neg');
    } else if (!a.coat) { a.coat = t; log(a.name + ' is imprinted with ' + t.name + "'s Atomise"); await H.fx.coat(a, t.slot); }
  }
  const hardened = t.harden > 0 && t.alive; if (hardened) { t.harden = 0; log(t.name + ' is hardened: the hit cannot be stopped'); }
  const exposed = t.rest > 0 || t.nap;
  const ctx = {
    attacker: a, target: t, X, kind, exposed,
    protectors: (a.noInt || hardened) ? [] : protectorsOf(t),
    canBlock: !exposed && !hardened && kind === 'str' && !a.sharpNow,
    canDodge: !exposed && !hardened && t.chg < 1 && !(t.noDodge > 0) && t.cur.AGI >= X
  };
  const d = hardened ? { type: 'take' } : await getDefense(ctx);
  let dmg = 0, byDmg = 0, counter = 0, by = null, res = 'hit';

  if (d.type === 'block') {
    let spent = d.s, dodged = false;
    t.cur.STR -= spent;
    log(t.name + (spent > 0 ? ' blocks with ' + spent + ' Strength' : ' takes it'));
    // Clash: an exact match lets the attacker raise by 1, the defender answers, until someone stops.
    let rz = 0;
    while (CFG.clash && kind === 'str' && spent === X && X > 0 && a.alive) {
      const extra = Math.ceil((X + 1) * CFG.attackCostFrac) - Math.ceil(X * CFG.attackCostFrac);
      if (a.cur.STR < extra) break;
      const cc = { attacker: a, target: t, X, extra, spent };
      let raise;
      if (G.ctrl[a.side] === 'human' && H.askClashAtk) raise = await H.askClashAtk(cc); else if (G.ctrl[a.side] === 'remote' && H.remoteDec) raise = await H.remoteDec('clashA', cc); else raise = aiClashAtk(cc);
      if (!raise) break;
      a.cur.STR -= extra; X += 1;
      log(a.name + ' raises to ' + X); rz++; ACH.raise = Math.max(ACH.raise, rz);
      H.onChange();
      await H.fx.clash(a, t, X, 'raise');
      const dc = { attacker: a, target: t, X, spent, canDodge: t.chg < 1 && !(t.noDodge > 0) && t.cur.AGI >= X, maxAdd: t.cur.STR };
      let r;
      if (G.ctrl[t.side] === 'human' && H.askClashDef) r = await H.askClashDef(dc); else if (G.ctrl[t.side] === 'remote' && H.remoteDec) r = await H.remoteDec('clashD', dc); else r = aiClashDef(dc);
      if (r && r.type === 'dodge' && dc.canDodge) { t.cur.AGI -= X; dodged = true; log(t.name + ' dodges (' + X + ' Agility)'); break; }
      const add = clamp(((r && r.s) | 0), 0, t.cur.STR);
      t.cur.STR -= add; spent += add;
      log(t.name + (add > 0 ? ' matches with +' + add : ' holds back'));
      H.onChange();
      await H.fx.clash(t, a, X, 'answer');
    }
    if (dodged) res = 'dodge';
    else {
      dmg = Math.max(0, X - spent);
      counter = Math.max(0, spent - X);
      res = dmg === 0 ? 'block' : (spent > 0 ? 'partial' : 'hit');
    }
  } else if (d.type === 'dodge') {
    t.cur.AGI -= X;
    res = 'dodge';
    log(t.name + ' dodges (' + X + ' Agility)');
  } else if (d.type === 'interrupt') {
    by = d.by;
    by.cur.BRN -= 1;
    if (by.makeup) {
      by.makeup = false; by.rest = 2; res = 'negate';
      log(by.name + ' steps in. Makeup negates everything.');
    } else if (kind === 'str') {
      by.cur.STR -= d.s; dmg = X - d.s; by.rest = by.restN;
      res = dmg === 0 ? 'intercept' : 'intercept-part';
      log(by.name + ' interrupts with ' + d.s + ' Strength');
    } else {
      byDmg = X; by.rest = by.restN; res = 'body';
      log(by.name + ' body-blocks the hit');
    }
  } else {
    dmg = X; res = 'hit';
  }
  H.onChange();
  await H.fx.strike(a, t, X, kind, res, by);
  if (res === 'block') ACH.blk[t.side]++;
  if (dmg > 0 && (res === 'hit' || res === 'partial')) { if (ACH.ch && ACH.ch.s === a.side && ACH.ch.t === t.uid) ACH.ch.n++; else ACH.ch = { s: a.side, t: t.uid, n: 1 }; ACH.chain[a.side] = Math.max(ACH.chain[a.side], ACH.ch.n); } else ACH.ch = null;
  if ((res === 'block' || res === 'dodge') && X >= 4) credit(t.side, 1, 'Hit denied.');

  if (dmg > 0) await dealDamage(t, dmg, a, kind);
  if (dmg > 0 && t.alive && t.chg > 0) { t.chg = 0; log(t.name + "'s charge is broken"); await H.fx.float(t, 'CHARGE BROKEN', 'neg'); }
  if (byDmg > 0) await dealDamage(by, byDmg, a, kind);
  if (hardened && dmg > 0 && t.alive && a.alive) { log(t.name + ' reflects ' + dmg + ' back'); await H.fx.float(t, 'HARDEN', 'blk'); await dealDamage(a, dmg, t, 'counter'); }

  if (counter > 0 && a.alive && a.batonNow && t.alive) {
    log(a.name + "'s baton turns the counter back: " + t.name + ' takes ' + counter + ' more');
    await H.fx.counter(a, t, counter); await H.fx.float(a, 'BATON', 'blk');
    await dealDamage(t, counter, a, 'counter');
  } else if (counter > 0 && a.alive) {
    await H.fx.counter(t, a, counter);
    let dodged = false;
    if (a.cur.AGI >= counter && !(a.noDodge > 0)) {
      if (G.ctrl[a.side] === 'human' && H.askCounter) dodged = await H.askCounter({ attacker: a, target: t, counter });
      else if (G.ctrl[a.side] === 'remote' && H.remoteDec) dodged = await H.remoteDec('counter', { attacker: a, target: t, counter });
      else dodged = aiCounterDodge(a, counter);
    }
    if (dodged && a.cur.AGI >= counter && !(a.noDodge > 0)) {
      a.cur.AGI -= counter;
      log(a.name + ' dodges the counter');
      H.onChange();
      await H.fx.dodge(a);
    } else {
      log(t.name + ' counters for ' + counter);
      await dealDamage(a, counter, t, 'counter');
    }
  }
  if (t.key === 'julian' && a.alive) {
    const d = G.sides[t.side].find(u => u.key === 'delilah' && u.alive && u.hm > 0 && u.rest === 0);
    if (d) {
      d.hm = 0;
      const Xc = Math.min(d.cur.STR, X);
      log(d.name + " cries: He's Mine!");
      await H.fx.float(d, "HE'S MINE", 'blk');
      if (Xc >= 1) {
        d.cur.STR -= Math.ceil(Xc * CFG.attackCostFrac); H.onChange();
        await H.fx.declare(d, a, Xc, 'str');
        await resolveHit(d, a, Xc, 'str');
      } else log(d.name + ' has no Strength to strike with.');
    }
  }
  return { landed: dmg > 0, dmg };
}

async function doRetort(t, a, cap) {
  const ctx = { attacker: a, target: t, cap };
  let d;
  if (G.ctrl[t.side] === 'human' && H.askRetort) d = await H.askRetort(ctx);
  else if (G.ctrl[t.side] === 'remote' && H.remoteDec) d = await H.remoteDec('ret', ctx);
  else d = aiRetort(ctx);
  const n = clamp((d && d.s) | 0, 0, Math.min(cap, t.cur.AGI));
  if (n < 1) return;
  t.cur.AGI -= n; log(t.name + ' hits back for ' + n + ' (spent ' + n + ' Agility)'); H.onChange();
  await H.fx.float(t, 'RETORT', 'blk');
  await H.fx.strike(t, a, n, 'str', 'take', null);
  await dealDamage(a, n, t, 'retort');
}
function aiRetort(c) {
  if (TUTOR) return { s: 0 };
  const L = AILS[c.target.side], { attacker: a, target: t, cap } = c;
  if (L <= 1) return { s: 0 };
  if (L === 2) return { s: R() < 0.5 ? cap : 0 };
  const spare = t.cur.AGI - cap;
  if (a.hp <= cap || (a.hp <= cap * 2 && L >= 3) || (L >= 4 && spare >= 2) || (L === 3 && spare >= 3)) return { s: cap };
  return { s: 0 };
}
/* ---------- actions ---------- */
async function doAttack(a, t, Xreq, opts) {
  opts = opts || {};
  if (!t || !t.alive || t.side === a.side) throw new Error('bad target');
  if (unst(a) || a.bud) throw new Error('cannot attack');
  if (blk(t.slot)) throw new Error('slot blocked');
  const pool = opts.pool || null;
  let X, kind, restN = a.restN;
  const prepAmp = a.ampd, prepXfer = a.xferd; a.ampd = false; a.xferd = false;
  const bash = a.bash, ua = a.ua, succ = a.succ; a.bash = false; a.ua = false; a.succ = false; a.taught = false;
  const sharp = a.sharp, ds = a.ds, stat = a.stat, lost = a.lost; a.sharp = false; a.ds = false; a.stat = false; a.lost = false; a.sharpNow = sharp;
  const baton = a.baton, blend = a.blend, rk = a.rookie; a.baton = false; a.blend = false; a.rookie = false; a.batonNow = baton;
  if (a.fp && !pool) {
    X = CFG.fpDamage; kind = 'data'; a.fp = false; restN = 2;
  } else {
    const mx = attackMax(a, t, pool);
    if (mx < 1) throw new Error('cannot attack');
    X = clamp(Xreq | 0, 1, mx);
    kind = 'str';
    const cost = Math.ceil(X * CFG.attackCostFrac);
    const src = pool || a;
    if (cost > src.cur.STR) throw new Error('not enough Strength');
    src.cur.STR -= cost;
    if (capAt(t.slot)) {
      G.rail[t.slot] = null;
      log('Capacitor on slot ' + (t.slot + 1) + ' discharges.');
      await H.fx.rail(t.slot, 'fire');
    }
  }
  if (ua || rk) restN += 1;
  if (a.adr && kind === 'str') { X += 1; log(a.name + ' is running on adrenaline: +1 Strength on the hit'); }
  a.noInt = succ;
  await trigAtom(a, t.slot);
  if (opts.t2 && opts.t2 !== t && opts.t2.alive) await trigAtom(a, opts.t2.slot);
  log(a.name + ' attacks ' + t.name + ' for ' + X + (kind === 'data' ? ' (DATA)' : '') + (pool ? ' (with ' + pool.name + "'s Strength)" : ''));
  H.onChange();
  await H.fx.declare(a, t, X, kind);
  const r1 = await resolveHit(a, t, X, kind);
  const bashIt = async (tt, r) => { if (bash && r && r.landed && tt.alive && tt.rest < 1) { tt.rest = 1; log(tt.name + ' is bashed: resting 1 turn'); await H.fx.float(tt, 'BASHED', 'neg'); } };
  await bashIt(t, r1);
  if (kind === 'str' && r1 && r1.landed && r1.dmg >= X) {
    if (prepAmp && X >= 4) credit(a.side, 2, 'Devastating attack landed.');
    else if (prepXfer && X >= 3) credit(a.side, 2, 'Devastating attack landed.');
    else if (X >= 4) credit(a.side, 1, 'Attack landed at optimal impact.');
  }
  if (ds && t.alive && a.alive) {
    const X2 = Math.ceil(X / 2);
    log(a.name + ' smacks ' + t.name + ' again for ' + X2); H.onChange(); await H.fx.declare(a, t, X2, kind);
    const r2 = await resolveHit(a, t, X2, kind); await bashIt(t, r2);
  }
  const t2 = opts.t2;
  if (t2 && t2 !== t && t2.alive && t2.side !== a.side && a.alive) {
    if (r1 && r1.landed) {
      log(a.name + ' follows up on ' + t2.name + ' with the same ' + X);
      H.onChange(); await H.fx.declare(a, t2, X, kind);
      const r2 = await resolveHit(a, t2, X, kind); await bashIt(t2, r2);
    } else { log('Beatdown fizzles: the first hit did not land'); await H.fx.float(a, 'FIZZLED', 'neg'); }
  }
  if (r1 && r1.dmg >= 2 && t.alive && a.alive && t.cur.AGI >= 1 && !t.rest) { const cap = Math.min(t.cur.AGI, Math.floor(r1.dmg / 2)); if (cap >= 1) await doRetort(t, a, cap); }
  if (blend && r1 && r1.landed && t.alive) { t.shard = { n: 6, src: a }; log(a.name + ' leaves red shards circling ' + t.name); await H.fx.debuff(t, 'RED SHARDS'); }
  if (r1 && r1.landed && t.alive && a.alive) {
    for (const w of G.sides[a.side]) {
      if (!(w.alive && w !== a && w.wing && w.rest === 0 && !w.nap && !unst(w) && !w.bud && !(w.chg > 0)) || !t.alive || blk(t.slot)) continue;
      w.wing = false; const Xw = Math.max(1, w.cur.STR); w.cur.STR = 0;
      log(w.name + ' charges in behind ' + a.name + ' for ' + Xw); H.onChange();
      await H.fx.float(w, 'WINGWOMAN', 'blk'); await trigAtom(w, t.slot);
      await H.fx.declare(w, t, Xw, 'str'); await resolveHit(w, t, Xw, 'str');
      w.rest = settleRest(w, w.restN) + 1; H.onChange(); /* +1: the end-of-turn tick would otherwise eat it */
    }
  }
  a.noInt = false; a.sharpNow = false; a.batonNow = false;
  if (stat && t.alive) { t.bud = a; log(a.name + ' plants a bud on ' + t.name + ': it cannot attack until ' + a.name + ' is attacked'); await H.fx.debuff(t, 'STATIONARY BUD'); }
  if (ua) {
    G.rail[t.slot] = { type: 'unstable', owner: a.side, ttl: CFG.unstableTTL };
    log('Rail slot ' + (t.slot + 1) + ' is unstable: nobody in it can attack.');
    await H.fx.rail(t.slot, 'unstable');
  }
  if (lost && a.alive && !G.rail[t.slot]) { G.rail[t.slot] = { type: 'lost', owner: a.side, ttl: 2, who: a }; log(a.name + ' stays on slot ' + (t.slot + 1) + ': it is blocked for a turn'); await H.fx.rail(t.slot, 'lost'); }
  a.rest = settleRest(a, restN);
  H.onChange();
}
async function doProj(a, t, X, chain) {
  if (!t || !t.alive || t.side === a.side) throw new Error('bad target');
  if (unst(a) || a.bud) throw new Error('cannot attack');
  if (blk(t.slot)) throw new Error('slot blocked');
  X = clamp(X | 0, 1, a.cur.DATA);
  if (X < 1) throw new Error('no DATA');
  a.cur.DATA -= X;
  await trigAtom(a, t.slot);
  await H.fx.dataBurst(a, 1);
  log(a.name + (chain ? ' stings ' : ' fires Projection at ') + t.name + ' for ' + X);
  H.onChange();
  await H.fx.declare(a, t, X, 'data', true);
  await resolveHit(a, t, X, 'data');
  if (chain) {
    for (const f of enemies(a.side)) { if (f !== t) { log('The sting chains to ' + f.name); await dealDamage(f, 1, a, 'data'); } }
  }
  a.rest = settleRest(a, a.restN);
  H.onChange();
}
async function doAbility(a, act) {
  const id = act.id;
  const st = abilityState(a, id);
  if (!st.ok) throw new Error('ability not usable: ' + id + ' ' + st.reason);
  if (st.cost && a.cur.DATA < st.cost) { const sh = Math.min(st.cost - a.cur.DATA, Math.max(0, a.cur.BRN)); if (sh > 0) { a.cur.BRN -= sh; a.cur.DATA += sh; log(a.name + ' thinks it through: ' + sh + ' Brains pays for the DATA'); H.onChange(); await H.fx.buff(a, '-' + sh + ' B'); } }
  switch (id) {
    case 'amp':
      a.cur.DATA -= 2; a.cur.STR = Math.min(a.max.STR + CFG.buffCap, a.cur.STR + 1);
      a.ampd = true; log(a.name + ' amplifies: +1 Strength');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, '+1 STR');
      break;
    case 'brim': {
      a.cur.DATA -= 8;
      log(a.name + ' releases Brim');
      H.onChange();
      await H.fx.dataBurst(a, 3);
      await H.fx.brim(a);
      const foes = enemies(a.side);
      const opts = foes.map(f => ({ unit: f, canTank: f.rest === 0 && f.cur.DATA >= CFG.brimTank }));
      let chosen;
      if (G.ctrl[1 - a.side] === 'human' && H.askBrim && opts.some(o => o.canTank)) chosen = await H.askBrim(opts, a);
      else if (G.ctrl[1 - a.side] === 'remote' && H.remoteDec && opts.some(o => o.canTank)) chosen = await H.remoteDec('brim', { opts, a });
      else chosen = opts.filter(o => o.canTank && aiBrimTank(o.unit)).map(o => o.unit);
      for (const f of foes) {
        if (chosen.includes(f) && f.rest === 0 && f.cur.DATA >= CFG.brimTank) {
          f.cur.DATA -= CFG.brimTank;
          log(f.name + ' tanks Brim with DATA');
          H.onChange();
          await H.fx.dataBurst(f, 0);
          await H.fx.float(f, 'TANKED', 'blk');
        } else {
          await dealDamage(f, CFG.brimDamage, a, 'data');
        }
      }
      a.rest = a.restN;
      break;
    }
    case 'leer': {
      const t = act.target; if (!t || !t.alive || t.side === a.side) throw new Error('bad target');
      a.cur.DATA -= 2; addDebuff(a, t, { BRN: 1, AGI: 1 });
      log(a.name + ' leers at ' + t.name + ': -1 Brains, -1 Agility');
      await H.fx.dataBurst(a, 1); await H.fx.debuff(t, 'LEER');
      break;
    }
    case 'qm': {
      const t = act.target; if (!t || !t.alive || t.side === a.side) throw new Error('bad target');
      a.cur.DATA -= 2; addDebuff(a, t, { BRN: 2 });
      log(a.name + ' runs Quick Maths on ' + t.name + ': -2 Brains');
      await H.fx.dataBurst(a, 1); await H.fx.debuff(t, 'QUICK MATHS');
      break;
    }
    case 'cap': {
      const slot = act.slot | 0; if (slot < 0 || slot > 3) throw new Error('bad slot');
      a.cur.DATA -= 2; G.rail[slot] = { type: 'cap', owner: a.side, ttl: CFG.capTTL };
      log(a.name + ' charges the rail at slot ' + (slot + 1));
      await H.fx.dataBurst(a, 1); await H.fx.rail(slot, 'set');
      break;
    }
    case 'makeup':
      a.cur.DATA -= 3; a.makeup = true;
      log(a.name + ' puts on Makeup');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'MAKEUP READY');
      break;
    case 'fp':
      a.cur.DATA -= 3; a.fp = true;
      log(a.name + ' lines up Finally Perfect');
      await H.fx.dataBurst(a, 2); await H.fx.buff(a, 'PERFECT READY');
      break;
    case 'proj':
      await doProj(a, act.target, act.X);
      break;
    case 'vesp':
      await doProj(a, act.target, act.X, true);
      break;
    case 'atom': {
      const slot = act.slot | 0; if (slot < 0 || slot > 3 || G.atom[a.side][slot]) throw new Error('bad slot');
      a.cur.DATA -= 4; G.atom[a.side][slot] = a; H.onChange();
      if (G.ctrl[1 - a.side] !== 'human') { log(a.name + ' coats rail slot ' + (slot + 1) + ' with Atomise'); await H.fx.dataBurst(a, 1); await H.fx.rail(slot, 'set'); }
      break;
    }
    case 'disch': {
      const t = act.target; if (!t || !t.alive || !t.coat || t.coat.side !== a.side) throw new Error('bad target');
      a.cur.DATA -= 1; t.coat = null; log(a.name + ' discharges: ' + t.name + ' explodes');
      H.onChange(); await H.fx.dataBurst(a, 2); await H.fx.discharge(t);
      await dealDamage(t, CFG.atomDamage, a, 'data');
      a.rest = settleRest(a, a.restN);
      break;
    }
    case 'jump': {
      a.cur.DATA -= 4; log(a.name + ' goes for the Jumpscare');
      a.cur.STR = 0; a.cur.AGI = 0; a.cur.BRN = 0; a.cur.DATA = 0; a.rest = a.restN;
      const foes = enemies(a.side); foes.forEach(f => { f.rest = Math.max(f.rest, f.restN); if (f.chg) f.chg = 0; });
      H.onChange(); await H.fx.dataBurst(a, 3); await H.fx.jumpscare(a, foes);
      log('Every enemy agent must rest.');
      break;
    }
    case 'lost': a.cur.DATA -= 2; a.lost = true; log(a.name + ' readies Lost'); await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'LOST READY'); break;
    case 'stat': a.cur.DATA -= 3; a.stat = true; log(a.name + ' readies Stationary'); await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'STATIONARY READY'); break;
    case 'catnap': if (a.wasNap) { log(a.name + ' stays awake'); await H.fx.buff(a, 'AWAKE'); } else { a.nap = true; log(a.name + ' curls up for a Catnap'); await H.fx.buff(a, 'CATNAP zzZ'); } break;
    case 'sharp': a.cur.DATA -= 2; a.cur.STR = Math.min(a.max.STR + CFG.buffCap, a.cur.STR + 1); a.sharp = true; log(a.name + ' sharpens her claws: +1 Strength'); await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'CLAWS +1 STR'); break;
    case 'ds': a.cur.DATA -= 3; a.ds = true; log(a.name + ' readies Double-Smack'); await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'DOUBLE-SMACK READY'); break;
    case 'dep':
      a.cur.DATA -= 3; a.dep = 2; log(a.name + ' braces: Depulsion');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'DEPULSION');
      break;
    case 'bd':
      a.cur.DATA -= 3; a.bd = true; log(a.name + ' readies Beatdown');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'BEATDOWN READY');
      break;
    case 'bash':
      a.cur.DATA -= 4; a.bash = true; log(a.name + ' readies Bash');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'BASH READY');
      break;
    case 'ua':
      a.cur.DATA -= 5; a.cur.STR = Math.min(a.max.STR + CFG.buffCap, a.cur.STR + 3); a.ua = true;
      log(a.name + ' goes Unstable: +3 Strength');
      await H.fx.dataBurst(a, 2); await H.fx.buff(a, '+3 STR UNSTABLE');
      break;
    case 'harden':
      a.cur.DATA -= 7; a.harden = 2; log(a.name + ' hardens');
      await H.fx.dataBurst(a, 2); await H.fx.buff(a, 'HARDEN');
      break;
    case 'tact': {
      const n = neighbourOf(a); a.cur.DATA -= 2;
      n.cur.BRN = Math.min(n.max.BRN + CFG.buffCap, n.cur.BRN + 2);
      log(a.name + ' directs ' + n.name + ': +2 Brains');
      await H.fx.dataBurst(a, 1); await H.fx.buff(n, '+2 BRN');
      break;
    }
    case 'succ':
      a.cur.DATA -= 3; a.succ = true; log(a.name + ' readies Successor');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'UNINTERRUPTIBLE');
      break;
    case 'teacher': {
      const t = act.target; if (!t || !t.alive || t.side !== a.side || t === a) throw new Error('bad ally');
      a.cur.DATA -= 3; t.cur.STR = Math.min(t.max.STR + CFG.buffCap, t.cur.STR + 1); t.succ = true; t.taught = true;
      log(a.name + ' teaches ' + t.name + ': +1 Strength, next attack cannot be interrupted');
      await H.fx.dataBurst(a, 1); await H.fx.buff(t, 'TAUGHT +1 STR');
      break;
    }
    case 'rarium': {
      const t = act.target; if (!t || !t.alive || t.side === a.side || t.rest > 0 || t.restN < 1) throw new Error('bad target');
      a.cur.DATA -= 4; t.rest = Math.max(t.rest, t.restN);
      if (t.chg > 0) { t.chg = 0; log(t.name + "'s charge is broken"); }
      log(a.name + ' uses Rarium: ' + t.name + ' must rest ' + t.restN);
      await H.fx.dataBurst(a, 2); await H.fx.debuff(t, 'RARIUM');
      break;
    }
    case 'ook': {
      a.cur.DATA -= 3;
      if (a.chg < 2) {
        a.chg++; log(a.name + (a.chg === 1 ? ' gathers DATA (1/3)' : ' swirls DATA (2/3)'));
        await H.fx.dataBurst(a, a.chg); await H.fx.charge(a, a.chg); await H.fx.buff(a, a.chg === 1 ? 'GATHERING 1/3' : 'SWIRLING 2/3');
      } else {
        const t = act.target; if (!t || !t.alive || t.side === a.side) { a.cur.DATA += 3; throw new Error('bad target'); }
        a.chg = 0; log(a.name + ' releases One-of-a-kind on ' + t.name);
        H.onChange();
        await H.fx.dataBurst(a, 3); await H.fx.charge(a, 3);
        await H.fx.declare(a, t, CFG.ookDamage, 'data');
        await resolveHit(a, t, CFG.ookDamage, 'data');
        a.rest = settleRest(a, a.restN);
      }
      break;
    }
    case 'enki': {
      const X = clamp(act.X | 0, 1, Math.min(a.cur.DATA, a.maxhp - a.hp)); if (X < 1) throw new Error('nothing to heal');
      a.cur.DATA -= X; a.hp += X; a.enki = 2;
      log(a.name + ' uses Enki: heals ' + X);
      H.onChange();
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, '+' + X + ' HP');
      break;
    }
    case 'lamb': {
      const p = partnerOf(a); a.cur.DATA -= 1; p.cur.STR = Math.min(p.max.STR + CFG.buffCap, p.cur.STR + 1);
      log(a.name + ' gives ' + p.name + ' +1 Strength');
      await H.fx.dataBurst(a, 1); await H.fx.buff(p, '+1 STR');
      break;
    }
    case 'panic': {
      a.cur.DATA -= 2; const foes = enemies(a.side); foes.forEach(f => addDebuff(a, f, { AGI: 1 }));
      log(a.name + ' panics the field: enemies lose 1 Agility');
      await H.fx.dataBurst(a, 2);
      for (const f of foes) await H.fx.debuff(f, 'PANIC');
      break;
    }
    case 'manip':
      a.cur.DATA -= 4; a.manip = true; log(a.name + ' readies Manipulator');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'MANIPULATOR READY');
      break;
    case 'hm':
      a.cur.DATA -= 5; a.hm = CFG.hmTTL;
      if (G.ctrl[1 - a.side] === 'human') { H.onChange(); } else { log(a.name + " sets a trap: He's Mine"); await H.fx.dataBurst(a, 1); await H.fx.buff(a, "HE'S MINE SET"); }
      break;
    case 'dcount':
      a.cur.DATA -= 5; a.dc = 2; log(a.name + ' braces: Depu-counter');
      await H.fx.dataBurst(a, 2); await H.fx.buff(a, 'DEPU-COUNTER');
      break;
    case 'baton':
      a.cur.DATA -= 3; a.baton = true;
      if (G.ctrl[1 - a.side] === 'human') H.onChange(); else { log(a.name + ' readies a baton'); await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'BATON READY'); }
      break;
    case 'impr':
      a.cur.DATA -= 2; a.imp = 2; log(a.name + ' sets Impression');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'IMPRESSION');
      break;
    case 'blend':
      a.cur.DATA -= 2; a.cur.STR = Math.min(a.max.STR + CFG.buffCap, a.cur.STR + 1); a.blend = true;
      log(a.name + ' readies Blender: +1 Strength');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'BLENDER +1 STR');
      break;
    case 'fglob': {
      const t = act.target; if (!t || !t.alive || t.side !== a.side || t.glob) throw new Error('bad ally');
      a.cur.DATA -= 4; t.glob = { by: a };
      if (G.ctrl[1 - a.side] === 'human') H.onChange(); else { log(a.name + ' hides a glob of DATA on ' + t.name); await H.fx.dataBurst(a, 1); await H.fx.buff(t, 'GLOB'); }
      break;
    }
    case 'wing':
      a.cur.DATA -= 3; a.wing = true; log(a.name + ' readies Wingwoman');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'WINGWOMAN');
      break;
    case 'rookie': {
      const nb = adjacentOf(a).sort((p, q) => q.cur.STR - p.cur.STR)[0];
      a.cur.DATA -= 1; a.cur.STR = Math.max(a.cur.STR, Math.min(nb.cur.STR, a.max.STR + CFG.buffCap)); a.rookie = true;
      log(a.name + ' copies ' + nb.name + "'s Strength: " + a.cur.STR);
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'ROOKIE ' + a.cur.STR + ' STR');
      break;
    }
    case 'coll':
      a.cur.DATA -= 1; a.coll = 4; log(a.name + ' readies Collateral');
      await H.fx.dataBurst(a, 1); await H.fx.buff(a, 'COLLATERAL');
      break;
    case 'bb': {
      const ally = act.ally, t = act.target;
      if (!ally || !ally.alive || ally === a || ally.side !== a.side || ally.cur.STR < 1) throw new Error('bad ally');
      if (!t || !t.alive || t.side === a.side) throw new Error('bad target');
      a.cur.DATA -= 6; a.cur.BRN = Math.min(a.max.BRN + CFG.buffCap, a.cur.BRN + 1);
      log(a.name + ' borrows ' + ally.name + "'s Strength");
      await H.fx.dataBurst(a, 2); await H.fx.buff(a, '+1 BRN'); await H.fx.buff(ally, 'LENT ' + ally.cur.STR + ' STR');
      await doAttack(a, t, act.X, { pool: ally });
      break;
    }
  }
  H.onChange();
}
/* Brains = coaching. 1 Brains + 1 of the stat buys the ally 1 + floor(BRN/4) of it, so high-Brains agents are the team's feeders. */
const transferAmt = a => 1 + Math.floor(Math.max(0, a.cur.BRN) / 4);
async function doTransfer(a, to, k) {
  if (!to || !to.alive || to.side !== a.side || to === a) throw new Error('bad ally');
  if (!transferStatOk(a, k)) throw new Error('cannot give ' + k);
  if (to.cur[k] >= to.max[k] + CFG.buffCap) throw new Error('ally at cap');
  const n = Math.min(transferAmt(a), to.max[k] + CFG.buffCap - to.cur[k]);
  a.cur.BRN -= 1; a.cur[k] -= 1; to.cur[k] += n; if (k === 'STR') to.xferd = true;
  if (n > 1) credit(a.side, 1, 'Aiding co-agent.');
  log(a.name + ' transfers +' + n + ' ' + SNAME[k] + ' to ' + to.name);
  H.onChange();
  await H.fx.buff(a, '-1 ' + SLETTER[k]);
  await H.fx.buff(to, '+' + n + ' ' + SLETTER[k]);
}
async function doRecover(a, k) {
  if (k === 'AGI' || a.cur[k] >= a.max[k] || (a.noRegen && a.noRegen[k]) || a.cur.AGI < 1) throw new Error('cannot recover ' + k);
  a.cur.AGI -= 1; a.cur[k] += 1;
  log(a.name + ' spends 1 Agility to regain 1 ' + SNAME[k]);
  H.onChange();
  await H.fx.buff(a, '-1 A');
  await H.fx.buff(a, '+1 ' + SLETTER[k]);
}
async function doCure(a, t) {
  if (!t || !t.alive || t.side !== a.side || !(t.mark || t.noDodge > 0) || a.cur.BRN < 2) throw new Error('cannot cure');
  a.cur.BRN -= 2; a.rest = Math.max(a.rest, 1); if (t.mark) ACH.cure[a.side]++;
  const what = []; if (t.mark) { t.mark = false; what.push('mark'); } if (t.noDodge > 0) { t.noDodge = 0; what.push('no-dodge'); }
  log(a.name + ' cures ' + t.name + ' of ' + what.join(' and '));
  H.onChange();
  await H.fx.buff(a, '-2 B'); await H.fx.float(t, 'CURED', 'blk');
}
async function doMark(a, t) {
  if (!t || !t.alive || t.side === a.side || t.mark || a.cur.BRN < 1) throw new Error('cannot mark');
  a.cur.BRN -= 1; t.mark = { by: a.uid }; a.rest = Math.max(a.rest, 1);
  log(a.name + ' marks ' + t.name + ': the next hit from ' + a.name + ' lands +1');
  H.onChange();
  await H.fx.buff(a, '-1 B'); await H.fx.float(t, 'MARKED', 'neg');
}
async function doAnalyse(a, t, X) {
  X = X | 0;
  if (!a || !a.alive || a.rest > 0 || !t || !t.alive || t.side === a.side || X < 1 || a.cur.BRN < X) throw new Error('cannot analyse');
  a.cur.BRN -= X; log(a.name + ' bids ' + X + ' Brains to analyse ' + t.name); H.onChange();
  await H.fx.buff(a, '-' + X + ' B');
  let r = 0;
  if (t.cur.BRN >= X) {
    const ctx = { attacker: a, target: t, bid: X };
    let d;
    if (G.ctrl[t.side] === 'human' && H.askResist) d = await H.askResist(ctx);
    else if (G.ctrl[t.side] === 'remote' && H.remoteDec) d = await H.remoteDec('res', ctx);
    else d = aiResist(ctx);
    r = d && d.block ? 1 : 0;
  }
  if (r) { t.cur.BRN -= X; log(t.name + ' spends ' + X + ' Brains and blocks the analysis'); H.onChange(); await H.fx.float(t, 'BLOCKED', 'blk'); return false; }
  if (!G.seen[a.side].includes(t.uid)) G.seen[a.side].push(t.uid);
  if (!ACH.ana[a.side].includes(t.uid)) ACH.ana[a.side].push(t.uid);
  log(a.name + ' reads ' + t.name); H.onChange(); await H.fx.float(t, 'ANALYSED', 'neg');
  return true;
}
function aiResist(c) {
  if (TUTOR) { const b = TUTOR === 2 && TUT2_BLOCK; if (b) TUT2_BLOCK = false; return { block: b }; }
  const L = AILS[c.target.side]; if (L <= 1) return { block: false };
  return { block: c.target.cur.BRN >= c.bid && R() < (L >= 3 ? 0.7 : 0.4) };
}

async function executeAction(act) {
  if (G.over) return;
  const side = G.turn;
  if (act.type === 'pass') {
    if (act.skip) { for (const u of G.sides[side]) if (u.alive && u.cur.BRN < u.max.BRN) { u.cur.BRN += 1; log(u.name + ' refocuses: +1 Brains'); H.onChange(); await H.fx.buff(u, '+1 B'); } }
    if (act.skip) { const me = G.sides[side].filter(u => u.alive), en = G.sides[1 - side].some(u => u.alive && u.rest === 0 && u.cur.STR > 0);
      if (en && me.length && me.every(u => u.rest === 0 && !u.nap && ['STR', 'AGI', 'BRN', 'DATA'].every(k => u.cur[k] >= u.max[k]))) credit(side, 2, 'Recognition.'); }
    log(act.skip ? G.names[side] + (G.names[side] === 'You' ? ' skip' : ' skips') + ' the turn.' : G.names[side] + ': no agent ready, turn passes.');
    await finishTurn(side, null);
    return;
  }
  if (act.type === 'wake' || act.type === 'move') {
    const w = act.agent;
    if (!w || !w.alive || w.side !== side) throw new Error('illegal pick');
    expireDebuffsOn(w); regen(w);
    if (act.type === 'wake') {
      if (w.rest < 1 || w.frz || w.nap || w.cur.AGI < w.rest) throw new Error('cannot wake');
      const c = w.rest; w.cur.AGI -= c; w.rest = 0; log(w.name + ' is woken for ' + c + ' Agility'); H.onChange();
      await H.fx.pick(w); await H.fx.float(w, 'AWAKE', 'blk');
    } else {
      const dead = G.sides[side].find(u => !u.alive && u.slot === act.to), c = dead ? Math.abs(dead.slot - w.slot) : 99;
      if (w.rest > 0 || w.nap || !dead || w.cur.AGI < c) throw new Error('cannot move');
      w.cur.AGI -= c; const from = w.slot, i = G.sides[side].indexOf(w), j = G.sides[side].indexOf(dead);
      G.sides[side][i] = dead; G.sides[side][j] = w; dead.slot = from; w.slot = act.to;
      log(w.name + ' moves to slot ' + (act.to + 1) + ' for ' + c + ' Agility'); H.onChange();
      await H.fx.pick(w); if (H.fx.moved) await H.fx.moved(w, dead, from);
    }
    await finishTurn(side, w);
    return;
  }
  if (act.type === 'analyse') {
    const w = act.agent; if (!w || !w.alive || w.side !== side) throw new Error('illegal pick');
    await doAnalyse(w, act.target, act.X || 1);
    return;
  }
  const a = act.agent;
  if (!a || !a.alive || a.side !== side || a.rest > 0) throw new Error('illegal pick');
  expireDebuffsOn(a);
  if (!a.adr && G.sides[side].length > 1 && alive(side).length === 1) { a.adr = true; log(a.name + ' is the last one standing: adrenaline, every attack hits +1'); H.onChange(); await H.fx.float(a, 'ADRENALINE', 'blk'); }
  regen(a);
  { const pp = partnerOf(a); if (pp && pp.alive) regen(pp); }
  a.boost = 0;
  if (a.shard && a.shard.n > 0) {
    const sh = a.shard; sh.n--; if (sh.n <= 0) a.shard = null;
    log('A red shard pricks ' + a.name + ' (' + sh.n + ' left)');
    await H.fx.prick(a, sh.src);
    await dealDamage(a, 1, sh.src, 'shard');
    if (sh.src && sh.src.alive) { sh.src.cur.DATA -= 1; H.onChange(); await H.fx.float(sh.src, '-1 DATA', 'neg'); }
    if (!a.alive) { await finishTurn(side, a); return; }
  }
  a.wasNap = a.nap; if (a.nap) { a.nap = false; log(a.name + ' wakes up'); }
  H.onChange();
  await H.fx.pick(a);
  if (a.bd && act.type !== 'attack') { a.bd = false; log('Beatdown wasted.'); }
  if (a.ds && act.type !== 'attack') { a.ds = false; log('Double-Smack wasted.'); }
  switch (act.type) {
    case 'attack': { const bd = a.bd; a.bd = false; await doAttack(a, act.target, act.X, { t2: bd ? act.target2 : null }); break; }
    case 'ability': await doAbility(a, act); break;
    case 'transfer': await doTransfer(a, act.to, act.stat); a.rest = Math.max(a.rest, 1); H.onChange(); break; /* the giver rests 1: the Brains cost alone is refunded by the next pick */
    case 'recover': await doRecover(a, act.stat); break;
    case 'mark': await doMark(a, act.target); break;
    case 'cure': await doCure(a, act.target); break;
    default: throw new Error('unknown action ' + act.type);
  }
  if (a.enki > 0 && !(act.type === 'ability' && act.id === 'enki')) a.enki--;
  await finishTurn(side, a);
}

async function finishTurn(side, actor) {
  G.seen[side] = [];
  for (const d of [...G.debuffs]) {
    if (!d.target.alive) { G.debuffs = G.debuffs.filter(x => x !== d); continue; }
    if (d.src === actor) d.idle = 0; else d.idle++;
    if (d.idle >= CFG.debuffIdle) { log('Debuff on ' + d.target.name + ' wears off.'); restoreDebuff(d); }
  }
  for (let i = 0; i < 4; i++) {
    const r = G.rail[i];
    if (r) { r.ttl--; if (r.ttl <= 0) { G.rail[i] = null; log((r.type === 'unstable' ? 'Unstable slot ' : r.type === 'lost' ? 'Blocked slot ' : 'Capacitor on slot ') + (i + 1) + (r.type === 'lost' ? ' clears.' : ' fades.')); } }
  }
  G.sides[1 - side].forEach(u => {
    if (!u.alive) return;
    if (u.dep > 0) { u.dep--; if (!u.dep) log(u.name + "'s Depulsion fades."); }
    if (u.dc > 0) { u.dc--; if (!u.dc) log(u.name + "'s Depu-counter fades."); }
    if (u.imp > 0) { u.imp--; if (!u.imp) log(u.name + "'s Impression fades."); }
    if (u.harden > 0) { u.harden--; if (!u.harden) log(u.name + "'s Harden fades."); }
  });
  G.sides[side].forEach(u => {
    if (u.alive && u.boost > 0 && u !== actor) { u.cur.STR = Math.max(0, u.cur.STR - u.boost); u.boost = 0; log(u.name + "'s Manipulator strength fades."); }
  });
  G.sides.forEach(ss => ss.forEach(u => { if (u.alive && u.coll > 0) { u.coll--; }
    if (u.alive && u.hm > 0) { u.hm--; if (!u.hm && G.ctrl[1 - u.side] !== 'human') log(u.name + " He's Mine fades."); } }));
  G.sides[side].forEach(u => { if (u.alive && u.nap && u !== actor) u.cur.STR = Math.min(CFG.napMax, u.cur.STR + 1); });
  G.sides[side].forEach(u => { if (u.alive && u.noDodge > 0) u.noDodge--; });
  G.sides[side].forEach(u => { if (u.alive && u !== actor && u.rest > 0) { u.rest--; if (u.rest === 0) u.frz = false; } });
  const a0 = alive(0).length, a1 = alive(1).length;
  if (a0 === 0 || a1 === 0) { G.over = true; G.winner = a0 === 0 && a1 === 0 ? -1 : (a0 === 0 ? 1 : 0);
    const w = G.winner; if (w >= 0) {
      if (G.cr.hurt[w] === 0) credit(w, 5, 'Optimal performance, Agents, all opposing agents vanquished.');
      else if (alive(w).length === 4) credit(w, 4, 'No casualties, all opposing agents vanquished.');
      else credit(w, 3, 'All opposing agents vanquished.');
      if (alive(w).length === 1 && G.sides[w].length > 1) credit(w, 1, 'Clutch. Last agent standing.'); } }
  else { G.turn = 1 - side; G.turnNo++; if (G.turnNo > CFG.maxTurns) { G.over = true; G.winner = -1; } }
  H.onChange();
}

/* ---------- CPU brain ---------- */
const AILS = [3, 3];
const setAI = (n, side) => { n = clamp(n | 0, 1, 5); if (side === 0 || side === 1) AILS[side] = n; else { AILS[0] = n; AILS[1] = n; } };
function aiClashAtk(c) {
  const { attacker: a, target: t, X, extra } = c;
  if (TUTOR === 2) { if (!TUT2_RAISED && a.cur.STR >= extra) { TUT2_RAISED = true; return true; } return false; }
  if (a.cur.STR < extra) return false;
  if (t.cur.STR < 1) return true;
  if (t.cur.STR < 1 + 0 && true) return true;
  const margin = a.cur.STR - extra;
  if (t.hp <= X + 2) return true;
  return margin >= 1 && R() < (t.cur.STR <= a.cur.STR ? 0.5 : 0.25);
}
function aiClashDef(c) {
  const { target: t, X, spent } = c;
  if (c.canDodge && t.cur.AGI >= X + 2 && R() < 0.5) return { type: 'dodge' };
  if (t.cur.STR >= 1 && (t.hp <= 6 || R() < 0.55)) return { type: 'add', s: Math.min(t.cur.STR, X - spent) };
  if (c.canDodge && R() < 0.4) return { type: 'dodge' };
  return { type: 'add', s: 0 };
}
function aiCounterDodge(a, counter) { return !(a.noDodge > 0) && a.cur.AGI >= counter && (counter >= 2 || R() < 0.5); }
function aiBrimTank(f) { return f.cur.DATA >= 5 || f.hp <= 4; }

let TUTOR = false, TUT2_RAISED = false, TUT2_BLOCK = false;
function aiDefend(ctx) {
  if (TUTOR) return { type: 'take' };
  const AIL = AILS[ctx.target.side];
  if (AIL <= 2) { if (AIL === 1 ? R() < 0.8 : R() < 0.45) return { type: 'take' }; return aiDefendBase(ctx); }
  if (AIL >= 4 && !ctx.exposed) {
    const { target: t, attacker: a, X, kind } = ctx;
    const prot = ctx.protectors.slice().sort((p, q) => q.cur.STR - p.cur.STR);
    const mk = prot.find(p => p.makeup);
    if (mk && (X >= 3 || t.hp <= X + 2)) return { type: 'interrupt', by: mk, s: 0 };
    if (kind === 'str') {
      if (AIL >= 5 && ctx.canBlock && t.cur.STR > X && a.hp <= t.cur.STR - X && !(a.noInt)) return { type: 'block', s: Math.min(t.cur.STR, X + a.hp) };
      if (t.hp <= X + 1 || X >= 3) {
        if (ctx.canDodge && (t.hp <= X + 1 || t.cur.AGI >= X + 2)) return { type: 'dodge' };
        if (ctx.canBlock && t.cur.STR >= X) return { type: 'block', s: X };
        if (prot.length && prot[0].cur.STR >= 1) return { type: 'interrupt', by: prot[0], s: Math.min(X, prot[0].cur.STR) };
        if (ctx.canBlock) return { type: 'block', s: t.cur.STR };
      }
    } else if (ctx.canDodge) return { type: 'dodge' };
  }
  return aiDefendBase(ctx);
}
function aiDefendBase(ctx) {
  const { target: t, X, kind } = ctx;
  const prot = ctx.protectors.slice().sort((p, q) => q.cur.STR - p.cur.STR);
  const mk = prot.find(p => p.makeup);
  if (mk && (X >= 3 || t.hp <= X + 2)) return { type: 'interrupt', by: mk, s: 0 };
  if (ctx.exposed) {
    if (prot.length && (X >= 3 || t.hp <= X * 2) && R() < 0.8) return { type: 'interrupt', by: prot[0], s: Math.min(X, prot[0].cur.STR) };
    return { type: 'take' };
  }
  if (kind === 'data') {
    if (ctx.canDodge && (X >= 3 || R() < 0.5)) return { type: 'dodge' };
    const body = prot.find(p => p.hp > X + 6);
    if (body && X <= 4 && R() < 0.4) return { type: 'interrupt', by: body, s: 0 };
    return { type: 'take' };
  }
  const danger = t.hp <= X + 1;
  if (danger) {
    if (ctx.canDodge) return { type: 'dodge' };
    if (t.cur.STR >= X) return { type: 'block', s: X };
    if (prot.length) return { type: 'interrupt', by: prot[0], s: Math.min(X, prot[0].cur.STR) };
    return { type: 'block', s: t.cur.STR };
  }
  const r = R();
  if (X <= 1) return r < 0.55 ? { type: 'take' } : { type: 'block', s: Math.min(X, t.cur.STR) };
  if (ctx.canDodge && r < 0.4) return { type: 'dodge' };
  if (t.cur.STR >= X + 1 && X >= 2 && r < 0.75) return { type: 'block', s: X + 1 };
  if (t.cur.STR >= X) return { type: 'block', s: X };
  if (prot.length && r < 0.6) return { type: 'interrupt', by: prot[0], s: Math.min(X, prot[0].cur.STR) };
  return { type: 'block', s: t.cur.STR };
}

const trapOf = f => (f.dep > 0 ? 3.5 : 0) + (f.dc > 0 ? 3 : 0) + (f.harden > 0 ? 1.5 : 0) + (f.imp > 0 && f.coat !== null ? 0 : 0);
function aiChoose(side) {
  const AIL = AILS[side];
  const me = alive(side), foes = enemies(side);
  const avail = me.filter(u => u.rest === 0);
  if (!avail.length) return { type: 'pass' };
  const C = [];
  const push = (s, act) => C.push({ s, n: R() * 0.6, act });
  for (const a of avail) {
    const pS = proj(a, 'STR'), pD = proj(a, 'DATA'), pB = proj(a, 'BRN');
    const guard = (a.slot === 0 || a.slot === 3) ? 0.5 : 0;
    for (const f of foes) {
      if (a.chg > 0) break;
      const exposed = f.rest > 0 || f.nap;
      const trap = (f.dep > 0 ? 3.5 : 0) + (f.dc > 0 ? 3 : 0) + (f.imp > 0 && a.coat && a.coat === f ? 4 : 0) + (f.harden > 0 ? (a.hp <= 8 ? 4 : 1.5) : 0);
      if (a.fp) { if (!unst(a) && !a.bud && !blk(f.slot)) push(6.5 + (exposed ? 1 : 0) + (f.hp <= 6 ? 3 : 0) - guard - trap, { type: 'attack', agent: a, target: f, X: 6 }); continue; }
      const mx = attackMax(a, f);
      if (mx >= 1) {
        let X = (exposed || f.hp <= mx) ? Math.min(mx, Math.max(1, f.hp + 1)) : Math.max(1, Math.round(mx * 0.6));
        if (R() < 0.3) X++;
        X = clamp(X, 1, mx);
        const sc = (exposed ? X : X * 0.45) * 0.9 + (f.hp <= X ? 3 : 0) - X * 0.18 - guard - trap + (a.stat ? f.cur.STR * 0.3 : 0) + (a.sharp && !exposed ? 0.9 : 0) + (a.blend ? 1.2 : 0) + (a.baton ? 0.6 : 0) + (a.ds ? X * 0.35 : 0) - (f.small ? 0.9 : 0) - (blk(f.slot) ? 99 : 0);
        push(sc, { type: 'attack', agent: a, target: f, X });
        if (a.bd) foes.filter(g => g !== f).forEach(g => push(sc * 1.8 + 0.8, { type: 'attack', agent: a, target: f, target2: g, X: Math.min(mx, Math.max(X, Math.round(mx * 0.7))) }));
        if (a.bash && !exposed) push(sc + 1.4, { type: 'attack', agent: a, target: f, X });
      }
      if (a.key === 'argo' && pD >= 2 && !unst(a) && !a.bud && !blk(f.slot)) {
        const X = Math.min(pD, exposed ? pD : Math.max(2, Math.min(pD, 4)));
        push(X * 0.55 + (f.hp <= X ? 3 : 0) - X * 0.12 - guard, { type: 'ability', agent: a, id: 'proj', target: f, X });
      }
    }
    const ok = id => { const st = abilityState(a, id); return st.ok; };
    // abilities (checked against projected stats)
    if (a.key === 'jane') {
      if (ok('amp') && pS >= 3 && pD >= 4) push(1.3, { type: 'ability', agent: a, id: 'amp' });
      if (ok('brim') && foes.length >= 2) push(foes.length * 1.5 + (foes.some(f => f.rest > 0) ? 1 : 0), { type: 'ability', agent: a, id: 'brim' });
    }
    if (a.key === 'argo' && ok('leer')) {
      const f = foes.slice().sort((p, q) => (q.cur.BRN + q.cur.AGI) - (p.cur.BRN + p.cur.AGI))[0];
      if (f && !G.debuffs.some(d => d.target === f)) push(1.6, { type: 'ability', agent: a, id: 'leer', target: f });
    }
    if (a.key === 'wren') {
      if (ok('qm')) { const f = foes.slice().sort((p, q) => q.cur.BRN - p.cur.BRN)[0]; if (f && f.cur.BRN >= 2 && !G.debuffs.some(d => d.target === f)) push(1.5, { type: 'ability', agent: a, id: 'qm', target: f }); }
      if (ok('cap')) { const mine = alive(side).slice().sort((p, q) => p.hp - q.hp)[0]; if (mine && !capAt(mine.slot)) push(1.3, { type: 'ability', agent: a, id: 'cap', slot: mine.slot }); }
    }
    if (a.key === 'cathy') {
      if (ok('makeup') && guard > 0) push(2.0, { type: 'ability', agent: a, id: 'makeup' });
      if (ok('fp')) push(2.4, { type: 'ability', agent: a, id: 'fp' });
    }
    if (a.key === 'edica') {
      if (ok('dep') && foes.some(f => f.rest === 0 && f.cur.STR >= 3)) push(1.7 + (a.hp < 12 ? 0.8 : 0), { type: 'ability', agent: a, id: 'dep' });
      if (ok('bd') && foes.length >= 2 && pS >= 3) push(2.0, { type: 'ability', agent: a, id: 'bd' });
    }
    if (a.key === 'ellie') {
      if (ok('bash') && pS >= 3) push(1.8, { type: 'ability', agent: a, id: 'bash' });
      if (ok('ua') && pD >= 5 && foes.some(f => f.rest === 0)) push(1.7, { type: 'ability', agent: a, id: 'ua' });
    }
    if (a.key === 'miera') {
      if (ok('harden') && (a.slot === 0 || a.slot === 3 || a.hp > 20)) push(1.6, { type: 'ability', agent: a, id: 'harden' });
      if (ok('bb')) {
        const lenders = alive(side).filter(u => u !== a && u.cur.STR >= 4).sort((p, q) => q.cur.STR - p.cur.STR);
        const ally = lenders[0]; const f = foes.slice().sort((p, q) => (q.rest > 0) - (p.rest > 0) || p.hp - q.hp)[0];
        if (ally && f && !blk(f.slot)) { const X = clamp(f.hp <= ally.cur.STR ? f.hp + 1 : Math.round(ally.cur.STR * 0.7), 1, attackMax(a, f, ally)); push(X * 0.7 + (f.hp <= X ? 3 : 0) + (f.rest > 0 ? 1 : 0) - trapOf(f), { type: 'ability', agent: a, id: 'bb', ally, target: f, X }); }
      }
    }
    if (a.key === 'opal') {
      const nb = neighbourOf(a);
      if (ok('tact') && nb && nb.cur.BRN < nb.max.BRN + 2) push(1.5 + (nb.cur.BRN === 0 ? 0.8 : 0), { type: 'ability', agent: a, id: 'tact' });
      if (ok('succ') && foes.some(f => protectorsOf(f).length)) push(1.5, { type: 'ability', agent: a, id: 'succ' });
    }
    if (a.key === 'rarity') {
      if (ok('teacher')) { const al = alive(side).filter(u => u !== a && u.rest === 0 && !u.succ && u.cur.STR >= 3).sort((p, q) => q.cur.STR - p.cur.STR)[0]; if (al && foes.some(f => protectorsOf(f).length || f.rest > 0)) push(1.9, { type: 'ability', agent: a, id: 'teacher', target: al }); else if (al) push(1.2, { type: 'ability', agent: a, id: 'teacher', target: al }); }
      if (ok('rarium')) { const f = abilityTargets(a, 'rarium').sort((p, q) => q.cur.STR + q.cur.DATA * 0.3 - p.cur.STR - q.cur.DATA * 0.3)[0]; if (f && f.cur.STR >= 3) push(1.7 + (f.cur.STR >= 6 ? 0.8 : 0), { type: 'ability', agent: a, id: 'rarium', target: f }); }
    }
    if (a.key === 'echidna') {
      if (a.chg === 2 && ok('ook')) { const f = foes.slice().sort((p, q) => protectorsOf(p).length - protectorsOf(q).length || p.hp - q.hp)[0]; push(9, { type: 'ability', agent: a, id: 'ook', target: f }); }
      else if (a.chg === 1 && ok('ook')) push(8, { type: 'ability', agent: a, id: 'ook' });
      else if (a.chg === 0 && ok('ook') && a.hp >= 6) push(1.8 + (foes.some(f => f.cur.STR >= 6 && f.rest === 0) ? -0.6 : 0.4), { type: 'ability', agent: a, id: 'ook' });
      if (ok('enki') && a.maxhp - a.hp >= 3) { const X = Math.min(pD, a.maxhp - a.hp); push(0.9 + X * 0.2, { type: 'ability', agent: a, id: 'enki', X }); }
    }
    if (a.key === 'julian') {
      if (ok('lamb')) push(1.4, { type: 'ability', agent: a, id: 'lamb' });
      if (ok('panic') && foes.length >= 2) push(1.5 + (foes.some(f => f.cur.AGI >= 4) ? 0.4 : 0), { type: 'ability', agent: a, id: 'panic' });
    }
    if (a.key === 'delilah') {
      if (ok('manip') && foes.some(f => f.rest === 0 && f.cur.STR >= 2)) push(1.4, { type: 'ability', agent: a, id: 'manip' });
      if (ok('hm')) push(1.5, { type: 'ability', agent: a, id: 'hm' });
    }
    if (a.key === 'wraith') {
      if (ok('disch')) { const t = abilityTargets(a, 'disch').sort((p, q) => p.hp - q.hp)[0]; push(2.2 + (t.hp <= 5 ? 3 : 0) + (t.hp <= 8 ? 0.8 : 0), { type: 'ability', agent: a, id: 'disch', target: t }); }
      else if (ok('atom')) { const free = [0, 1, 2, 3].filter(i => !G.atom[side][i] && G.sides[side][i] && G.sides[side][i].alive); const slot = free.sort((p, q) => G.sides[side][p].hp - G.sides[side][q].hp)[0]; if (slot != null) push(1.7, { type: 'ability', agent: a, id: 'atom', slot }); }
      if (ok('jump') && foes.length >= 2 && alive(side).filter(u => u !== a && u.rest === 0 && u.cur.STR >= 3).length >= 2) push(2.4 + foes.length * 0.3, { type: 'ability', agent: a, id: 'jump' });
    }
    if (a.key === 'cray') {
      if (ok('stat') && foes.some(f => f.rest === 0 && f.cur.STR >= 5)) push(1.9, { type: 'ability', agent: a, id: 'stat' });
      if (ok('lost') && pS >= 2) push(1.2, { type: 'ability', agent: a, id: 'lost' });
    }
    if (a.key === 'neko') {
      if (ok('catnap') && a.cur.STR <= 6 && a.hp >= 9 && !foes.some(f => f.rest === 0 && f.cur.STR >= 7)) push(2.1 - a.cur.STR * 0.2, { type: 'ability', agent: a, id: 'catnap' });
      if (ok('sharp') && pS >= 3) push(1.5, { type: 'ability', agent: a, id: 'sharp' });
    }
    if (a.key === 'tyrees') {
      if (ok('dcount') && foes.some(f => f.rest === 0 && f.cur.STR >= 3)) push(1.7 + (a.hp < 10 ? 0.6 : 0), { type: 'ability', agent: a, id: 'dcount' });
      if (ok('baton') && pS >= 2) push(1.5, { type: 'ability', agent: a, id: 'baton' });
    }
    if (a.key === 'argithia') {
      if (ok('impr') && foes.some(f => f.rest === 0 && f.cur.STR >= 3)) push(1.5, { type: 'ability', agent: a, id: 'impr' });
      if (ok('blend') && pS >= 4 && foes.some(f => !f.shard)) push(2.0, { type: 'ability', agent: a, id: 'blend' });
    }
    if (a.key === 'frey') {
      if (ok('fglob')) { const al = abilityTargets(a, 'fglob').sort((p, q) => (q.cur.STR + q.cur.DATA * 0.3 + (q.slot === 1 || q.slot === 2 ? 2 : 0)) - (p.cur.STR + p.cur.DATA * 0.3 + (p.slot === 1 || p.slot === 2 ? 2 : 0)))[0]; if (al) push(1.5, { type: 'ability', agent: a, id: 'fglob', target: al }); }
      if (ok('wing') && alive(side).some(u => u !== a && u.rest === 0 && u.cur.STR >= 3)) push(1.6, { type: 'ability', agent: a, id: 'wing' });
    }
    if (a.key === 'mason') {
      if (ok('rookie')) { const nb = adjacentOf(a).sort((p, q) => q.cur.STR - p.cur.STR)[0]; if (nb && nb.cur.STR >= 4 && foes.some(f => !blk(f.slot))) push(1.4 + nb.cur.STR * 0.25, { type: 'ability', agent: a, id: 'rookie' }); }
      if (ok('coll') && a.hp >= 9) push(1.5, { type: 'ability', agent: a, id: 'coll' });
    }
    if (a.key === 'nessy') {
      if (ok('ds') && pS >= 3) push(1.9, { type: 'ability', agent: a, id: 'ds' });
      if (ok('vesp') && pD >= 2) { const f = abilityTargets(a, 'vesp').sort((p, q) => p.hp - q.hp)[0]; if (f) { const X = Math.min(pD, 3); push(X * 0.5 + foes.length * 0.7 + (f.hp <= X ? 3 : 0), { type: 'ability', agent: a, id: 'vesp', target: f, X }); } }
    }
    { const ms = alive(side).find(u => u.key === 'mason' && u !== a && u.cur.DATA < 1);
      if (ms && ms.cur.DATA < ms.max.DATA + CFG.buffCap && canTransfer(a).ok && transferStatOk(a, 'DATA') && proj(a, 'DATA') >= 3) push(1.45, { type: 'transfer', agent: a, to: ms, stat: 'DATA' }); }
    // transfer: give a high stat to a teammate who values it
    if (canTransfer(a).ok && pB >= 1) {
      const stat = STATS.filter(k => k !== 'BRN' && transferStatOk(a, k)).sort((p, q) => proj(a, q) - proj(a, p))[0];
      if (stat && proj(a, stat) >= 3) {
        const ally = alive(side).filter(u => u !== a && u.max[stat] >= 5 && u.cur[stat] < u.max[stat] + CFG.buffCap).sort((p, q) => p.cur[stat] - q.cur[stat])[0];
        if (ally) push(0.9, { type: 'transfer', agent: a, to: ally, stat });
      }
    }
    // recover
    if (canRecover(a).ok && proj(a, 'AGI') >= 3) {
      const lows = STATS.map(k => ({ k, d: a.max[k] - proj(a, k) })).filter(x => x.k !== 'AGI' && x.d > 0 && !(a.noRegen && a.noRegen[x.k])).sort((p, q) => q.d - p.d);
      const deficit = lows.reduce((n, x) => n + x.d, 0);
      push(Math.min(2.2, 0.5 + 0.15 * deficit), { type: 'recover', agent: a, stat: lows[0].k });
    }
  }
  if (AIL >= 3) alive(side).forEach(u => { if (u.rest > 0 && canWake(u).ok && alive(side).filter(x => x.rest === 0).length <= 1) C.push({ s: 0.9 + u.rest * 0.25, n: R() * 0.6, act: { type: 'wake', agent: u } }); });
  { const def = alive(side).reduce((n, u) => n + Math.max(0, u.max.BRN - u.cur.BRN), 0); if (def >= 2 && AIL >= 2) C.push({ s: Math.min(1.7, 0.3 * def), n: R() * 0.6, act: { type: 'pass', skip: true } }); }
  if (!C.length) return { type: 'pass' };
  if (AIL === 1) return C[(R() * C.length) | 0].act;
  if (AIL === 2 && R() < 0.2) return C[(R() * C.length) | 0].act;
  if (AIL >= 4) {
    const pat = (AIL >= 5 ? 1 : 0.5) * (G.turnNo > CFG.maxTurns * 0.6 ? 0 : 1), enemyReady = foes.filter(f => f.rest === 0).length;
    C.forEach(c => {
      const act = c.act, a = act.agent, f = act.target;
      if (act.type === 'recover') c.s += pat * 1.2;
      if (act.type === 'attack' && f) {
        const exposed = f.rest > 0 || f.nap;
        if (exposed && f.hp <= act.X) c.s += 2.5;
        c.s += (1 - f.hp / Math.max(1, f.maxhp)) * 1.2;
        c.s -= pat;
        if (AIL >= 5) {
          const kill = f.hp <= act.X && exposed;
          if (!kill && avail.length === 1 && enemyReady > 0) c.s -= 1.8;
          if (!kill && (a.slot === 0 || a.slot === 3) && alive(side).some(u => u !== a && u.rest > 0)) c.s -= 0.6;
          if (exposed) c.s += 0.8;
        }
      }
    });
  }
  const nm = AIL === 2 ? 4 : AIL === 3 ? 1 : AIL === 4 ? 0.4 : 0;
  C.sort((p, q) => (q.s + q.n * nm) - (p.s + p.n * nm));
  return C[0].act;
}

const API = {
  CFG, DEFS, STATS, SNAME, SLETTER, ROLE,
  ach: () => ACH, newGame, getG, setHooks, setAI, canWake, moveOptions, proj, protectorsOf, attackMax, canAttack, abilityState, transferStatOk, canTransfer, transferAmt, canRecover, canMark, canAnalyse, canCure, cureTargets,
  VERSION: 'linked-41', setTutor, tutBlock, addAgent, dropLast, executeAction, aiChoose, aiDefend, alive, enemies, capAt, dealDamage, abilityTargets, abilityView, statsFor, validSquad, squadCost
};
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Duel = API;
})(typeof window !== 'undefined' ? window : globalThis);
