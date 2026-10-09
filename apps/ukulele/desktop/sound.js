// The plucked-string sound, made right here with no recordings and no internet. It's the classic
// "Karplus-Strong" trick: a short burst of hiss loops back on itself, getting a little softer and
// smoother each time around, which is very close to what a real string does after it's plucked.
(function (global) {
  'use strict';

  let ctx = null;
  let out = null;
  const cache = {};
  const ringing = {};   // one note per string at a time, like a real string
  let on = true;
  try { on = localStorage.getItem('uke-sound') !== 'off'; } catch (e) { /* private window: keep the default */ }

  function context() {
    if (!ctx) {
      ctx = new (global.AudioContext || global.webkitAudioContext)();
      const body = ctx.createBiquadFilter();   // a little warmth, like the wooden body
      body.type = 'peaking'; body.frequency.value = 220; body.Q.value = 1; body.gain.value = 4;
      const soft = ctx.createBiquadFilter();   // nylon and wound strings aren't bright like steel
      soft.type = 'lowpass'; soft.frequency.value = 3800;
      const limiter = ctx.createDynamicsCompressor();
      out = ctx.createGain();
      out.gain.value = 0.8;
      out.connect(body); body.connect(soft); soft.connect(limiter); limiter.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  const freq = midi => 440 * Math.pow(2, (midi - 69) / 12);

  // Builds (once) a few seconds of one plucked note. The loop length has to be a whole number of
  // samples, so the note comes out slightly off; playing it back a touch faster or slower fixes that.
  function pluck(midi) {
    if (cache[midi]) return cache[midi];
    const c = context();
    const sr = c.sampleRate;
    const f = freq(midi);
    const n = Math.floor(sr / f - 0.5);
    const length = Math.floor(sr * 3);
    const buffer = c.createBuffer(1, length, sr);
    const y = buffer.getChannelData(0);
    // The pluck: soft random hiss, with the middle taken out (plucking a bit away from the end of the string).
    const burst = new Float32Array(n);
    let smooth = 0;
    for (let i = 0; i < n; i++) { smooth += 0.45 * (Math.random() * 2 - 1 - smooth); burst[i] = smooth; }
    const pick = Math.max(1, Math.round(n * 0.18));
    let mean = 0;
    for (let i = 0; i < n; i++) { y[i] = burst[i] - (i >= pick ? burst[i - pick] : 0); mean += y[i]; }
    for (let i = 0; i < n; i++) y[i] -= mean / n;
    // Low notes ring longer than high ones.
    const halfLife = 0.95 - (midi - 50) * 0.016;
    const keep = Math.pow(0.5, 1 / (f * halfLife));
    y[n] = keep * y[0];
    for (let i = n + 1; i < length; i++) y[i] = keep * 0.5 * (y[i - n] + y[i - n - 1]);
    let peak = 0;
    for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(y[i]));
    const fade = Math.floor(sr * 0.2);
    for (let i = 0; i < length; i++) {
      y[i] *= 0.45 / (peak || 1);
      if (i > length - fade) y[i] *= (length - i) / fade;
    }
    cache[midi] = { buffer, rate: (f * (n + 0.5)) / sr };
    return cache[midi];
  }

  // Plays one note. `string` lets a new note on a string cut off the one already ringing there.
  function play(midi, delay = 0, string = null) {
    if (!on || midi == null) return;
    const c = context();
    const note = pluck(midi);
    const when = c.currentTime + 0.01 + delay;
    if (string != null && ringing[string]) {
      const old = ringing[string];
      old.gain.gain.setTargetAtTime(0, when, 0.015);
      old.source.stop(when + 0.2);
    }
    const source = c.createBufferSource();
    source.buffer = note.buffer;
    source.playbackRate.value = note.rate;
    const gain = c.createGain();
    source.connect(gain);
    gain.connect(out);
    source.start(when);
    if (string != null) ringing[string] = { source, gain };
  }

  // A strum: the strings one after another, low to high. midis has one entry per string (null = silent).
  function strum(midis, gap = 0.045) {
    let t = 0;
    midis.forEach((m, s) => { if (m != null) { play(m, t, s); t += gap; } });
  }

  function setOn(value) {
    on = !!value;
    try { localStorage.setItem('uke-sound', on ? 'on' : 'off'); } catch (e) { /* not saved; fine */ }
    if (!on) Object.values(ringing).forEach(r => r.gain.gain.setTargetAtTime(0, context().currentTime, 0.02));
  }

  global.Sound = { play, strum, setOn, isOn: () => on };
})(window);
