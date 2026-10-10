// Reads the technique files (bjj-data.js, judo-data.js), sorts them into categories, and picks the
// technique of the day. The data files explain their own format at the top.
(function (global) {
  'use strict';

  // ---------------- How jiu-jitsu is organized ----------------
  const BJJ = {
    positions: [
      ['Standing', [
        ['standing', 'Standing'], ['clinch', 'Clinch & ties'],
      ]],
      ['Guard · you underneath', [
        ['closed-guard', 'Closed guard'], ['open-guard', 'Open guard'], ['butterfly', 'Butterfly guard'],
        ['dlr', 'De La Riva & reverse DLR'], ['spider', 'Spider & lasso'], ['x-guard', 'X-guard & single-leg X'],
        ['half-guard', 'Half guard'], ['lockdown', 'Lockdown & 10th Planet half'], ['rubber-guard', 'Rubber guard'],
        ['lapel', 'Lapel guards'], ['seated', 'Seated guard & shin-to-shin'], ['inverted', 'Inverted guard'],
      ]],
      ['Passing · you on top of their guard', [
        ['top-closed', 'Inside their closed guard'], ['top-open', 'Passing open guard'], ['top-half', 'Top half guard'],
      ]],
      ['Pins · you on top', [
        ['mount', 'Mount'], ['side-control', 'Side control'], ['knee-on-belly', 'Knee on belly'],
        ['north-south', 'North-south'], ['back', 'Back control'], ['turtle-top', 'Attacking the turtle'],
        ['front-headlock', 'Front headlock'], ['truck', 'The truck'],
      ]],
      ['Pinned · you underneath', [
        ['mount-bottom', 'Under mount'], ['side-bottom', 'Under side control'], ['back-bottom', 'They have your back'],
        ['turtle-bottom', 'Turtle'], ['caught', 'Caught in a submission'],
      ]],
      ['Leg entanglements', [
        ['ashi', 'Straight ashi & single-leg X'], ['outside-ashi', 'Outside ashi'], ['saddle', 'Saddle (inside sankaku)'],
        ['fifty', '50/50'],
      ]],
    ],
    kinds: [
      ['submission', 'Submissions'], ['sweep', 'Sweeps'], ['pass', 'Guard passes'], ['takedown', 'Takedowns'],
      ['backtake', 'Back takes'], ['escape', 'Escapes & defense'], ['transition', 'Control & transitions'],
    ],
    targets: [
      ['choke', 'Chokes'], ['elbow', 'Arm locks'], ['shoulder', 'Shoulder locks'], ['wrist', 'Wrist locks'],
      ['leg', 'Leg locks'], ['neck', 'Neck & spine'], ['compression', 'Slicers & compressions'],
    ],
    styles: [
      ['classic', 'Classic', 'The Gracie and old-school core: what every academy teaches.'],
      ['modern', 'Modern', 'The sport-jiu-jitsu era: De La Riva, berimbolos, lapels, leg drags (roughly 2005 on).'],
      ['10p', '10th Planet', "Eddie Bravo's no-gi system: rubber guard, lockdown, the truck, the twister."],
      ['leglock', 'Leg-lock era', 'The ashi garami system that took over no-gi in the 2010s (Danaher, Ryan Hall and others).'],
      ['wrestling', 'Wrestling', 'Takedowns and rides from wrestling.'],
      ['judo', 'Judo', 'Throws and pins borrowed from judo (the right screen has the full judo list).'],
    ],
    attire: [['both', 'Gi & No-Gi'], ['gi', 'Gi only'], ['nogi', 'Made for No-Gi']],
    levels: [['white', 'White belt'], ['blue', 'Blue belt'], ['purple', 'Purple belt'], ['brown', 'Brown & black belt']],
  };

  // ---------------- How judo is organized (the Kodokan's own groups) ----------------
  const JUDO = {
    classes: [
      ['Nage-waza · throws', [
        ['te', 'Te-waza', 'Hand techniques'], ['koshi', 'Koshi-waza', 'Hip techniques'], ['ashi', 'Ashi-waza', 'Foot & leg techniques'],
        ['ma-sutemi', 'Ma-sutemi-waza', 'Sacrifices to the back'], ['yoko-sutemi', 'Yoko-sutemi-waza', 'Sacrifices to the side'],
      ]],
      ['Katame-waza · grappling', [
        ['osaekomi', 'Osaekomi-waza', 'Pins'], ['shime', 'Shime-waza', 'Chokes'], ['kansetsu', 'Kansetsu-waza', 'Arm locks'],
      ]],
    ],
    groups: [
      ['1', 'Gokyo group 1', 'The first eight throws everyone learns (usually by yellow belt).'],
      ['2', 'Gokyo group 2', 'Usually learned by orange belt.'],
      ['3', 'Gokyo group 3', 'Usually learned by green belt.'],
      ['4', 'Gokyo group 4', 'Usually learned by blue belt.'],
      ['5', 'Gokyo group 5', 'Usually learned by brown belt.'],
      ['shin', 'Shinmeisho-no-waza', 'Throws the Kodokan added in 1982 and since, outside the Gokyo.'],
      ['hab', 'Habukareta-waza', 'Throws dropped from the Gokyo in 1920 and later restored.'],
      ['katame', 'Katame-waza list', 'The Kodokan\'s pins, chokes and arm locks.'],
    ],
    kuzushi: [
      ['front', 'Forward'], ['front-corner', 'Front corner'], ['side', 'Sideways'], ['back-corner', 'Back corner'], ['back', 'Backward'],
    ],
  };

  // ---------------- Reading the data files ----------------
  // Each technique starts with "@ id | Name" and continues with short keyed lines (see the data files).
  function parse(source, kind) {
    const list = [];
    const families = {};
    let cur = null;
    for (const raw of source.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('//')) continue;
      let m;
      if ((m = line.match(/^@family\s+(\S+)\s*\|\s*(.+?)\s*\|\s*(.+)$/))) {
        families[m[1]] = { id: m[1], name: m[2], about: m[3] };
        cur = null;
        continue;
      }
      if ((m = line.match(/^@\s+(\S+)\s*\|\s*(.+)$/))) {
        cur = { id: m[1], name: m[2], discipline: kind, aka: [], steps: [], dos: [], donts: [], counters: [],
          related: [], tags: [], cross: [] };
        list.push(cur);
        continue;
      }
      if (!cur) continue;
      if ((m = line.match(/^(\d+)\s+(.+?)\s*\|\s*(.+)$/))) { cur.steps.push({ pose: m[2], text: m[3] }); continue; }
      const sp = line.indexOf(' ');
      const key = sp < 0 ? line : line.slice(0, sp), val = sp < 0 ? '' : line.slice(sp + 1).trim();
      const bar = v => v.split('|').map(x => x.trim()).filter(Boolean);
      const commas = v => v.split(/[,\s]+/).map(x => x.trim()).filter(Boolean);
      switch (key) {
        case 'f': cur.family = val; break;
        case 'k': [cur.kind, cur.target] = val.split('/').map(x => x.trim()); break;
        case 'p': cur.from = val; break;
        case 's': cur.style = val; break;
        case 'g': cur.attire = val; break;
        case 'l': cur.level = val; break;
        case 'r': cur.tags = commas(val); break;
        case 'a': cur.aka = bar(val); break;
        case '=': cur.summary = val; break;
        case '+': cur.dos.push(...bar(val)); break;
        case '-': cur.donts.push(...bar(val)); break;
        case 'x': cur.counters.push(...bar(val)); break;
        case 'v': cur.related = commas(val); break;
        case 'j': case 'b': cur.cross = commas(val); break;
        case 'n': cur.note = val; break;
        // judo only
        case 'kanji': cur.kanji = val; break;
        case 'en': cur.english = val; break;
        case 'c': cur.cls = val; break;
        case 'gk': cur.group = val; break;
        case 'kz': cur.kuzushi = val; break;
        case 'ng': cur.nogi = val; break;
        case 'ijf': cur.ijf = val; break;
        default: console.warn(`${cur.id}: unknown line "${line}"`);
      }
    }
    return { list, families };
  }

  // ---------------- Technique of the day ----------------
  // Every technique comes up once before any repeats: a fixed shuffle of the whole list, walked a day at a time.
  function dayNumber(date) {
    return Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2026, 0, 1)) / 864e5);
  }
  function shuffled(ids, seed) {
    let a = seed >>> 0;
    const rand = () => {   // mulberry32
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const out = ids.slice().sort();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function ofTheDay(pool, date, seed) {
    const order = shuffled(pool.map(t => t.id), seed);
    const n = order.length;
    const i = ((dayNumber(date) % n) + n) % n;
    return pool.find(t => t.id === order[i]);
  }

  // ---------------- Search ----------------
  const fold = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  function matches(tech, query) {
    const q = fold(query);
    if (!q) return true;
    const hay = fold([tech.name, ...tech.aka, tech.english, tech.kanji, tech.summary, tech.family].join(' '));
    return q.split(' ').every(word => hay.includes(word));
  }

  function build(kind, source) {
    const { list, families } = parse(source, kind);
    const byId = Object.fromEntries(list.map(t => [t.id, t]));
    for (const t of list) {
      t.related = t.related.filter(id => byId[id] && id !== t.id);
      t.familyInfo = families[t.family];
    }
    // Family members point at each other too.
    for (const t of list) {
      if (!t.family) continue;
      for (const o of list) if (o !== t && o.family === t.family && !t.related.includes(o.id)) t.related.push(o.id);
    }
    return { list, byId, families };
  }

  global.Catalog = { BJJ, JUDO, build, ofTheDay, matches, fold, dayNumber };
})(window);
