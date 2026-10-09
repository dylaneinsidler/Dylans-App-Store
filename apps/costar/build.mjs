// Co-Star's phone page is made from the desktop app's own two screens (Star Wall's today.html and
// sky.html), so it always matches them: each screen's markup (inside #stage) and its script are lifted
// out and put into index.html (from index.template.html). Each script gets its own scope, since both
// were written as a page of their own. Only the layout is the phone's (app.css).
//
// The desktop app's config.js (Dylan's birth details) is never copied: on the phone, each person types
// in their own, which stay on their phone (app.js).
import fs from 'node:fs';
import path from 'node:path';

export default function ({ source, dir, write }) {
  if (!source) return 'kept its last page (desktop app not found)';
  const lift = file => {
    const html = fs.readFileSync(path.join(source, file), 'utf8');
    const stage = html.match(/<div id="stage">([\s\S]*?)<footer class="hint">/);
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    if (!stage || !scripts.length) throw new Error(`Co-Star: couldn't find the screen in ${file}`);
    return { markup: stage[1].trim(), script: scripts[scripts.length - 1][1].trim() };
  };
  const today = lift('today.html'), sky = lift('sky.html');
  const wrap = (name, s) => `// Lifted from Star Wall's ${name} by build.mjs; edit it there.\n(function () {\n${s}\n})();\n`;
  write(path.join(dir, 'desktop', 'today.js'), wrap('today.html', today.script));
  write(path.join(dir, 'desktop', 'sky.js'), wrap('sky.html', sky.script));
  const page = fs.readFileSync(path.join(dir, 'index.template.html'), 'utf8')
    .replace('{{TODAY}}', today.markup).replace('{{SKY}}', sky.markup);
  return write(path.join(dir, 'index.html'), page) ? 'page rebuilt from the desktop screens' : '';
}
