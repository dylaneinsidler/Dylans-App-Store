// Corkboard's phone version shows the desktop app's Local Events (things around South Florida), so this
// takes just those out of its events.js, with the month colors from its config.js, into desktop/going.js.
//
// Each event also gets an id and, when its day is known, a calendar file, desktop/ics/<id>.ics: holding an
// event on the phone opens it, and the iPhone offers "Add to Calendar". Only these public events get one.
//
// Never the rest of events.js (Dylan's own appointments and birthdays) or his calendars: those stay on
// his PC. On the phone, each person adds their own reminders and birthdays, kept on their phone (app.js).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export default function ({ source, dir, write }) {
  if (!source) return 'kept its last events (desktop app not found)';
  const run = file => {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(source, file), 'utf8'), sandbox, { filename: file });
    return sandbox.window;
  };
  const going = run('events.js').CORKBOARD_EVENTS?.goingTo || [];
  const cfg = run('config.js').CORKBOARD || {};

  // Ids like "2026-10-17-las-olas-art-fair" (the same every build, so the calendar files keep their names).
  const ids = new Set();
  const events = going.filter(e => !e.sample).map(e => {
    const base = `${e.date}-${String(e.short || e.what).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`.slice(0, 70);
    let id = base;
    for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
    ids.add(id);
    return { id, ...e };
  });

  // The calendar files. Events whose day isn't set yet ("2027-03") get none.
  const icsDir = path.join(dir, 'desktop', 'ics');
  const made = new Set();
  let icsChanged = 0;
  for (const ev of events) {
    const text = ics(ev);
    if (!text) continue;
    ev.ics = `desktop/ics/${ev.id}.ics`;
    made.add(`${ev.id}.ics`);
    // DTSTAMP says when the file was made: keep the old one when nothing else changed.
    const file = path.join(icsDir, `${ev.id}.ics`);
    const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const unstamped = s => s.replace(/^DTSTAMP:.*\r\n/m, '');
    if (old && unstamped(old) === unstamped(text)) continue;
    if (write(file, text)) icsChanged++;
  }
  // Calendar files of events no longer on the board (this build made them all, so they can go).
  if (fs.existsSync(icsDir)) for (const f of fs.readdirSync(icsDir)) {
    if (f.endsWith('.ics') && !made.has(f)) { fs.rmSync(path.join(icsDir, f)); icsChanged++; }
  }

  const out = {
    monthColors: cfg.monthColors,
    countdownDays: cfg.countdownDays ?? 7,
    goingTo: events,
  };
  const changed = write(path.join(dir, 'desktop', 'going.js'),
    `// Lifted from Corkboard Wall's events.js (Local Events only) and config.js by build.mjs; edit them there.\n` +
    `window.CORKBOARD_GOING = ${JSON.stringify(out, null, 1)};\n`);
  return changed || icsChanged ? `${out.goingTo.length} local events, ${made.size} calendar files` : '';
}

// ---- One event as an iCalendar file (RFC 5545), the kind the iPhone's Calendar opens ----
//
// One day with a time: at that time, Fort Lauderdale time ("12 PM - 11 PM" sets the end too; "7:45 PM"
// only the start, since the end isn't known). One day without a time, or several days: all day, through
// the last day, with the hours (if any) in the notes.
const pad = n => String(n).padStart(2, '0');
const ymd = s => s.replace(/-/g, '');
function dayAfter(s) {
  const [y, m, d] = s.split('-').map(Number), t = new Date(Date.UTC(y, m - 1, d + 1));
  return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}`;
}
// '7:45 PM' -> '194500', '12 PM' -> '120000', 'noon' -> '120000', 'midnight' -> '000000' (the next day)
function clock(s) {
  const t = String(s).trim().toLowerCase();
  if (t === 'noon') return '120000';
  if (t === 'midnight') return '000000';
  const m = /^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?$/i.exec(t);
  if (!m || +m[1] < 1 || +m[1] > 12 || +(m[2] || 0) > 59) return null;
  return pad(+m[1] % 12 + (/p/i.test(m[3]) ? 12 : 0)) + pad(+(m[2] || 0)) + '00';
}
// '12 PM - 11 PM' -> both; '7:45 PM' or 'from 4 PM' -> the start only; anything else -> null (all day)
function hours(time) {
  if (!time) return null;
  const parts = String(time).replace(/^\s*(from|starts?( at)?|at)\s+/i, '').split(/\s*[-\u2013\u2014]\s*|\s+to\s+/i);
  if (parts.length > 2) return null;
  const start = clock(parts[0]), end = parts[1] ? clock(parts[1]) : null;
  if (!start || start === '000000' || (parts[1] && !end)) return null;
  return { start, end };
}
const escText = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
// Lines longer than 75 bytes go on to the next line, which starts with a space.
function fold(line) {
  const out = [];
  let cur = '', bytes = 0, max = 75;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > max) { out.push(cur); cur = ' '; bytes = 1; max = 75; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join('\r\n');
}
const ZONE = [
  'BEGIN:VTIMEZONE', 'TZID:America/New_York',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:20070311T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:20071104T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];
function ics(ev) {
  const day = /^\d{4}-\d{2}-\d{2}$/;
  if (!day.test(ev.date) || (ev.to && !day.test(ev.to))) return '';
  const last = ev.to && ev.to > ev.date ? ev.to : ev.date;
  const h = last === ev.date ? hours(ev.time) : null;
  const when = h
    ? [`DTSTART;TZID=America/New_York:${ymd(ev.date)}T${h.start}`,
       ...(h.end ? [`DTEND;TZID=America/New_York:${h.end > h.start ? ymd(ev.date) : dayAfter(ev.date)}T${h.end}`] : [])]
    : [`DTSTART;VALUE=DATE:${ymd(ev.date)}`, `DTEND;VALUE=DATE:${dayAfter(last)}`];
  const notes = [h ? '' : ev.time, ev.note, "From Dylan's Corkboard"].filter(Boolean);
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', "PRODID:-//Dylan's App Store//Corkboard//EN", 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...(h ? ZONE : []),
    'BEGIN:VEVENT',
    `UID:${ev.id}@dylans-corkboard`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${escText(ev.what)}`,
    ...(ev.where ? [`LOCATION:${escText(ev.where)}`] : []),
    ...(Array.isArray(ev.at) && ev.at.length === 2 ? [`GEO:${ev.at[0]};${ev.at[1]}`] : []),
    `DESCRIPTION:${escText(notes.join('\n'))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
