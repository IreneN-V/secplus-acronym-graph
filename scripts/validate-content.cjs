// Validates generated study content against the app's format rules.
const fs = require('fs');
const path = require('path');
const dir = path.resolve(process.argv[2]);
const nodes = require(path.join(dir, 'nodes.json'));
const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
const files = fs.readdirSync(dir).filter(f => /^b\d+\.jsonl$/.test(f)).sort();
const seen = {}; const errs = [];
const words = s => s.trim().split(/\s+/).length;
for (const f of files) {
  fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).forEach((line, i) => {
    let r; try { r = JSON.parse(line); } catch (e) { errs.push(`${f}:${i + 1} bad JSON`); return; }
    const n = byId[r.id]; const E = m => errs.push(`${r.id}: ${m}`);
    if (!n) return E('unknown id');
    if (seen[r.id]) E('duplicate'); seen[r.id] = 1;
    if (!r.a || /^it'?s like/i.test(r.a)) E('analogy missing or starts with "It\'s like"');
    if (r.a && (r.a.match(/[.!?](\s|$)/g) || []).length > 2) E('analogy > 2 sentences');
    if (!r.h || words(r.h) < 2 || words(r.h) > 5) E(`headline words=${r.h && words(r.h)}`);
    if (!Array.isArray(r.vs) || r.vs.length > 4) E('vs not array or > 4');
    (r.vs || []).forEach(([id, note]) => {
      if (n.sib.length ? !n.sib.includes(id) : !byId[id]) E(`vs ${id} not a sibling`);
      if (id === r.id) E('vs contains self');
      if (!note || words(note) < 2 || words(note) > 5) E(`vs ${id} note words=${note && words(note)}`);
    });
    if (n.sib.length && (r.vs || []).length === 0) E('vs empty but siblings exist');
    if (!r.e || words(r.e) > 15) E(`edge words=${r.e && words(r.e)}`);
    // Tokens: each letter separately, each run of digits as one token (RAID10 -> R,A,I,D,10).
    const chars = r.id.match(/[A-Za-z]|[0-9]+/g);
    const ws = (r.m || '').trim().split(/\s+/);
    if (ws.length !== chars.length) E(`mnemonic has ${ws.length} words for ${chars.length} tokens: "${r.m}"`);
    else chars.forEach((c, k) => {
      const ok = /\d/.test(c) ? ws[k] === c : ws[k][0].toUpperCase() === c.toUpperCase();
      if (!ok) E(`mnemonic word ${k + 1} "${ws[k]}" should ${/\d/.test(c) ? 'be' : 'start with'} ${c}`);
    });
  });
}
const missing = nodes.filter(n => !seen[n.id]).map(n => n.id);
console.log(`${Object.keys(seen).length}/${nodes.length} done, ${errs.length} errors`);
errs.forEach(e => console.log('  ' + e));
if (process.argv[3] === 'final' && missing.length) console.log('missing:', missing.join(' '));
