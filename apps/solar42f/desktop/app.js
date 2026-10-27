// Dylan's Solar 42F: joins the panel (panel.js) to the sound engine (engine.js), and the power switch, zoom and help.
(() => {
  let engine = null;

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

  Panel.build(document.getElementById('stage'), {
    send: v => { if (engine) engine.node.port.postMessage({ set: toEngine(v) }); },
    sendCables: c => { if (engine) engine.node.port.postMessage({ cables: c }); },
    onMic: async on => {
      if (!engine) return;
      try { await engine.setMic(on); }
      catch (e) { alert('The microphone could not be opened. Allow it when the browser asks, then tap the microphone again.'); }
    },
  });

  // ?picture: the panel on its own, for screenshots (no power switch, no sound)
  if (/[?&]picture\b/.test(location.search)) { document.getElementById('power').style.display = 'none'; document.getElementById('tools').style.display = 'none'; }

  // ---- Power on ----
  document.getElementById('powerBtn').addEventListener('click', async () => {
    try {
      // On an iPad, play even with the ring / silent switch on.
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
      engine = await startSolarEngine(l => Panel.showLeds(l));
      engine.node.port.postMessage({ set: toEngine(Panel.values), now: true });
      engine.node.port.postMessage({ cables: Panel.cables() });
      if (engine.ctx.state !== 'running') await engine.ctx.resume();
      if (Panel.values['pre.mic'] > 0.5) engine.setMic(true).catch(() => {});
      document.getElementById('power').remove();
    } catch (e) {
      console.error(e);
      alert(`The sound couldn't start (${e.message}). Try a current version of Chrome, Edge or Safari.`);
    }
  });
  // ?selftest: switch on by itself, hold drone 1, and after two seconds write whether sound and lights are running
  // into the page's title (for checking the program works without anyone listening).
  if (/[?&]selftest\b/.test(location.search)) {
    let lights = 0;
    const show = Panel.showLeds;
    Panel.showLeds = l => { lights++; show(l); };
    document.getElementById('powerBtn').click();
    setTimeout(() => {
      if (engine) engine.node.port.postMessage({ set: { 'd1.hold': 1 } });
      setTimeout(() => { document.title = `selftest: sound ${engine ? engine.ctx.state : 'off'}, ${lights} light updates`; }, 2000);
    }, 500);
  }

  // If the computer suspends the sound (another app takes the speakers), bring it back on the next touch.
  window.addEventListener('pointerdown', () => { if (engine && engine.ctx.state !== 'running') engine.ctx.resume(); });

  // ---- Zoom and help ----
  document.getElementById('zoomBtn').addEventListener('click', () => {
    const on = document.body.classList.toggle('zoomed');
    document.getElementById('zoomBtn').textContent = on ? '⊖' : '⊕';
  });
  const help = document.getElementById('help');
  document.getElementById('helpBtn').addEventListener('click', () => { help.hidden = false; });
  document.getElementById('closeHelp').addEventListener('click', () => { help.hidden = true; });
  help.addEventListener('click', e => { if (e.target === help) help.hidden = true; });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Put every knob, switch and cable back to how the panel started?')) { Panel.resetAll(); help.hidden = true; }
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') help.hidden = true; });
})();
