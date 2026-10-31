// Dylan's Solar 42F: joins the panel (panel.js) to the sound engine (engine.js), and runs the menu bar, the power
// switch, the output meter, the starter sounds (sounds.js), the User's Guide and the small notes.
(() => {
  let engine = null;
  // Where this program's files are (the iPad version keeps them in a subfolder): the guide is beside app.js.
  const HERE = document.currentScript ? document.currentScript.src : location.href;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);

  // Some panel values mean something slightly different to the engine.
  function toEngine(v) {
    const out = { ...v };
    if ('fx.progL' in v) out['fx.progL'] = Panel.progOf(v['fx.progL']);
    if ('fx.progR' in v) out['fx.progR'] = Panel.progOf(v['fx.progR']);
    // the stages switch: up 4, middle 5, down 3 (the engine wants 0 for 3 steps, 0.5 for 4, 1 for 5)
    if ('seq.stages' in v) out['seq.stages'] = v['seq.stages'] > 0.75 ? 0.5 : v['seq.stages'] > 0.25 ? 1 : 0;
    if ('kbd.enc' in v) out['kbd.tr'] = Math.round((v['kbd.enc'] - 0.5) * 24);
    if (v['fx.resetL'] > 0.5) engine && engine.node.port.postMessage({ reset: 0 });
    if (v['fx.resetR'] > 0.5) engine && engine.node.port.postMessage({ reset: 1 });
    return out;
  }

  // ---- The lights, and the menu bar's output meter ----
  let peak = 0;
  function lights(l) {
    Panel.showLeds(l);
    peak = Math.max(l.out || 0, peak * 0.82);
    $('meterBar').style.width = `${Math.min(100, Math.round(Math.sqrt(peak) * 100))}%`;
  }

  Panel.build($('stage'), {
    send: v => { if (engine) engine.node.port.postMessage({ set: toEngine(v) }); },
    sendCables: c => { if (engine) engine.node.port.postMessage({ cables: c }); },
    onMic: async on => {
      if (!engine) return;
      try { await engine.setMic(on); }
      catch (e) { toast('The microphone could not be opened. Allow it when the browser asks, then click the microphone again.'); }
    },
  });

  // ---- Messages ----
  let toastTimer = null;
  function toast(html, seconds = 9) {
    const t = $('toast');
    t.innerHTML = html; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, seconds * 1000);
  }
  $('toast').addEventListener('click', () => { $('toast').hidden = true; });

  // ---- Power ----
  async function powerOn() {
    if (engine) return true;
    try {
      // On an iPad, play even with the ring / silent switch on.
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
      engine = await startSolarEngine(lights);
      engine.node.port.postMessage({ set: toEngine(Panel.values), now: true });
      engine.node.port.postMessage({ cables: Panel.cables() });
      if (engine.ctx.state !== 'running') await engine.ctx.resume();
      if (Panel.values['pre.mic'] > 0.5) engine.setMic(true).catch(() => {});
      $('power').remove();
      $('powerState').textContent = 'Sound on'; $('powerState').classList.add('on');
      return true;
    } catch (e) {
      console.error(e);
      alert(`The sound couldn't start (${e.message}). Try a current version of Chrome, Edge or Safari.`);
      return false;
    }
  }
  $('powerBtn').addEventListener('click', async () => {
    if (await powerOn()) showFirstSound();
  });
  // Power on is silent, like the real one, so a strip says what to do, with a button that plays a sound. It stays until there's sound.
  function showFirstSound() {
    const strip = document.createElement('div');
    strip.id = 'firstSound';
    strip.innerHTML = '<span><b>The power is on, but it stays silent until you start a sound.</b></span>' +
      '<button type="button">&#9654; Play a sound</button><span class="or">or hold a pad at the bottom right (keys 1 to 6)</span>';
    document.body.appendChild(strip);
    strip.querySelector('button').addEventListener('click', () => {
      const s = SOLAR_SOUNDS[0];
      Panel.applyPatch(s);
      toast(`<b>You should hear it now.</b> Press the red <b>Stop all sound</b> to stop it, and try the other sounds in the <b>Sounds</b> menu. If the bar beside it moves but you hear nothing, check the volume, then Help &gt; Test the speakers.`, 16);
    });
    const look = setInterval(() => {
      if (parseFloat($('meterBar').style.width) > 2) { strip.remove(); clearInterval(look); }
    }, 200);
  }
  // If the computer suspends the sound (another app takes the speakers), bring it back on the next touch.
  window.addEventListener('pointerdown', () => { if (engine && engine.ctx.state !== 'running') engine.ctx.resume(); });

  // ?picture: the panel on its own, for screenshots (no power switch, no sound)
  if (params.has('picture')) { $('power').style.display = 'none'; }

  // ---- The menus ----
  const menus = [...document.querySelectorAll('.menu')];
  const closeMenus = () => menus.forEach(m => m.classList.remove('open'));
  menus.forEach(m => {
    m.querySelector(':scope > button').addEventListener('click', e => {
      e.stopPropagation();
      const was = m.classList.contains('open');
      closeMenus(); if (!was) m.classList.add('open');
    });
    m.addEventListener('mouseenter', () => { if (menus.some(x => x.classList.contains('open')) && !m.classList.contains('open')) { closeMenus(); m.classList.add('open'); } });
  });
  document.addEventListener('click', closeMenus);

  // The starter sounds
  const soundsMenu = $('soundsMenu');
  SOLAR_SOUNDS.forEach((s, i) => {
    const b = document.createElement('button');
    b.innerHTML = `${s.name}<small>${s.about}</small>`;
    b.addEventListener('click', async () => {
      await powerOn();
      Panel.applyPatch(s);
      toast(`<b>${s.name}</b>: ${s.play}`, 16);
    });
    soundsMenu.appendChild(b);
  });
  soundsMenu.appendChild(document.createElement('hr'));
  const stopB = document.createElement('button');
  stopB.textContent = 'Stop all sound (Esc)';
  stopB.addEventListener('click', () => stopAll());
  soundsMenu.appendChild(stopB);

  function stopAll() { Panel.stopAll(); toast('Stopped: every HOLD, pad and held envelope is off.', 4); }
  $('panicBtn').addEventListener('click', e => { e.stopPropagation(); stopAll(); });

  // Each menu item's job
  const DO = {
    new() { if (confirm('Start from a blank panel? (Every knob, switch and cable goes back to where it started.)')) Panel.applyPatch({}); },
    open() { $('openFile').value = ''; $('openFile').click(); },
    save() {
      const blob = new Blob([JSON.stringify(Panel.exportPatch(), null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Solar 42F patch ${new Date().toISOString().slice(0, 16).replace('T', ' ').replace(':', '.')}.json`;
      a.click();
      toast('Saved the patch to your <b>Downloads</b> folder. File > Open a patch brings it back.', 6);
    },
    quit() { window.close(); },
    fit() { document.body.classList.remove('zoomed'); },
    zoom() { document.body.classList.add('zoomed'); },
    fullscreen() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); },
    cables() {
      const off = document.body.classList.toggle('nocables');
      document.querySelector('[data-do="cables"]').textContent = off ? 'Show the patch cables' : 'Hide the patch cables';
    },
    guide() { openSheet("User's Guide", null, new URL('guide.html', HERE).href); },
    quick() { openSheet('Quick start', QUICK); },
    keys() { openSheet('Keyboard shortcuts', KEYS); },
    test() { testSpeakers(); },
    about() { openSheet('About', ABOUT); },
  };
  document.querySelectorAll('[data-do]').forEach(b => b.addEventListener('click', e => { closeMenus(); DO[b.dataset.do](); e.stopPropagation(); }));

  $('openFile').addEventListener('change', async () => {
    const f = $('openFile').files[0];
    if (!f) return;
    try {
      const p = JSON.parse(await f.text());
      if (!p.values) throw new Error('not a patch');
      await powerOn(); Panel.applyPatch(p);
      toast(`Opened <b>${f.name}</b>.`, 5);
    } catch (e) { toast(`<b>${f.name}</b> isn't a Solar 42F patch.`, 6); }
  });

  // Test the speakers: a short chime straight to the computer's sound output, skipping the synth entirely.
  async function testSpeakers() {
    await powerOn();
    const ctx = engine.ctx, t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * 0.18); g.gain.linearRampToValueAtTime(0.25, t + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.9);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.18); o.stop(t + i * 0.18 + 1);
    });
    toast('You should hear three rising notes. <b>If you don\'t</b>, the computer is sending sound somewhere else: check the volume, and in ' +
      'Windows\' sound settings (the speaker by the clock) which output is chosen. See the User\'s Guide, "No sound".', 14);
  }

  // ---- The guide and the small notes ----
  function openSheet(title, html, page) {
    $('sheetTitle').textContent = title;
    const card = document.querySelector('.sheet-card');
    if (page) { $('sheetFrame').hidden = false; $('sheetFrame').src = page; $('sheetText').hidden = true; card.classList.add('wide'); }
    else { $('sheetFrame').hidden = true; $('sheetText').hidden = false; $('sheetText').innerHTML = html; card.classList.remove('wide'); }
    $('sheet').hidden = false;
  }
  const closeSheet = () => { $('sheet').hidden = true; };
  $('sheetClose').addEventListener('click', closeSheet);
  $('sheet').addEventListener('click', e => { if (e.target === $('sheet')) closeSheet(); });

  const QUICK = `
    <h3>Make a sound in three steps</h3>
    <ol>
      <li><b>POWER</b>: click the big button when the program opens (the menu bar then says <b>Sound on</b>).</li>
      <li><b>Start a voice</b>. Nothing plays until you do, just like the real instrument. Any one of these:
        <ul><li>hold a <b>DRONE VOICES</b> pad (the six black squares bottom right), or press keys <b>1</b> to <b>6</b>;</li>
        <li>press the <b>HOLD</b> button on a drone voice (it keeps playing until you press it again);</li>
        <li>play the <b>touch keyboard</b> (the white striped plates), or keys <b>A W S E D F T G Y H U J</b>;</li>
        <li>or pick a starter sound from the <b>Sounds</b> menu.</li></ul></li>
      <li><b>Shape it</b>: turn knobs (drag up and down), press buttons, flip switches. <b>■ Stop all sound</b> (or Esc) silences everything.</li>
    </ol>
    <p>The meter in the menu bar shows sound leaving the synth. If it moves but you hear nothing, use <b>Help > Test the speakers</b>.</p>`;
  const KEYS = `
    <table>
      <tr><td><kbd>A</kbd> <kbd>W</kbd> <kbd>S</kbd> <kbd>E</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>T</kbd> <kbd>G</kbd> <kbd>Y</kbd> <kbd>H</kbd> <kbd>U</kbd> <kbd>J</kbd></td><td>the touch keyboard's 12 plates (C up to B)</td></tr>
      <tr><td><kbd>Z</kbd> / <kbd>X</kbd></td><td>keyboard octave down / up</td></tr>
      <tr><td><kbd>1</kbd> … <kbd>6</kbd></td><td>the drone voice pads (play while held)</td></tr>
      <tr><td><kbd>Esc</kbd></td><td>stop all sound (or close a window like this one)</td></tr>
      <tr><td>drag up / down</td><td>turn a knob (hold <kbd>Shift</kbd> for fine moves); the mouse wheel works too</td></tr>
      <tr><td>double-click a knob</td><td>back to where it started</td></tr>
      <tr><td>drag from a jack</td><td>a patch cable; drag a plug off an input to move it, click a cable to remove it</td></tr>
      <tr><td><kbd>F11</kbd></td><td>full screen</td></tr>
    </table>`;
  const ABOUT = `
    <p><b>Dylan's Solar 42F</b> 1.1: an unofficial tribute to Elta Music's SOLAR 42F drone ambient machine. The panel follows
    Elta Music's drawing of the 42F and its manual; the sound is made live by models of each part, nothing recorded.
    Works without internet. Made with Claude.</p>`;

  // ---- Keyboard: Esc stops all sound (or closes a window) ----
  window.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('sheet').hidden) closeSheet(); else { closeMenus(); stopAll(); }
  });

  // ?selftest: switch on by itself, hold drone 1, and after two seconds write whether sound and lights are running
  // into the page's title (for checking the program works without anyone listening).
  if (params.has('selftest')) {
    let count = 0;
    const show = Panel.showLeds;
    Panel.showLeds = l => { count++; show(l); };
    $('powerBtn').click();
    setTimeout(() => {
      Panel.applyPatch(SOLAR_SOUNDS[0]);
      setTimeout(() => { document.title = `selftest: sound ${engine ? engine.ctx.state : 'off'}, ${count} light updates, meter ${$('meterBar').style.width}`; }, 2500);
    }, 800);
  }
})();
