// Corkboard's phone version shows the desktop app's Local Events (things around South Florida), so this
// takes just those out of its events.js, with the month colors from its config.js, into desktop/going.js.
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
  const out = {
    monthColors: cfg.monthColors,
    countdownDays: cfg.countdownDays ?? 7,
    goingTo: going.filter(e => !e.sample),
  };
  const changed = write(path.join(dir, 'desktop', 'going.js'),
    `// Lifted from Corkboard Wall's events.js (Local Events only) and config.js by build.mjs; edit them there.\n` +
    `window.CORKBOARD_GOING = ${JSON.stringify(out, null, 1)};\n`);
  return changed ? `${out.goingTo.length} local events` : '';
}
