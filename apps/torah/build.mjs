// Daily Torah's phone page is made from the desktop app's own two screens, so it always matches them:
// the markup inside each screen's <main> and each screen's own script are lifted out of week.html and
// today.html and put into index.html (from index.template.html). Only the layout is the phone's own
// (app.css). The rest of the desktop code (wall.js, the lessons, the Talmud links) is copied as usual.
import fs from 'node:fs';
import path from 'node:path';

export default function ({ source, dir, write }) {
  if (!source) return 'kept its last page (desktop app not found)';
  const lift = file => {
    const html = fs.readFileSync(path.join(source, file), 'utf8');
    const main = html.match(/<main>([\s\S]*?)<\/main>/);
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    if (!main || !scripts.length) throw new Error(`Daily Torah: couldn't find the screen in ${file}`);
    return { markup: main[1].trim(), script: scripts[scripts.length - 1][1].trim() };
  };
  const week = lift('week.html'), today = lift('today.html');
  write(path.join(dir, 'desktop', 'week.js'), `// Lifted from Daily Torah's week.html by build.mjs; edit it there.\n${week.script}\n`);
  write(path.join(dir, 'desktop', 'today.js'), `// Lifted from Daily Torah's today.html by build.mjs; edit it there.\n${today.script}\n`);
  const page = fs.readFileSync(path.join(dir, 'index.template.html'), 'utf8')
    .replace('{{WEEK}}', week.markup).replace('{{TODAY}}', today.markup);
  return write(path.join(dir, 'index.html'), page) ? 'page rebuilt from the desktop screens' : '';
}
