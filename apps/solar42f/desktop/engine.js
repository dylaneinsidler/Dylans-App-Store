// Dylan's Solar 42F: the sound engine. Everything the instrument does runs here, one sample at a time, in an audio
// worklet (the browser's real-time audio thread): the drone voices, the VCOs and their envelopes, the LFOs,
// joystick, sequencer, mixer, filters, distortion and the dual effector. panel.js only sends knob values and
// patch cables here and draws the lights it gets back.
//
// The worklet code is the function below. The page turns it into a file in memory (Blob) and loads that, because a
// worklet file can't be loaded straight from the hard drive.
//
// Voltages work like the real instrument's: 1.0 means 1 volt. Pitch inputs are 1 volt per octave, LFOs and
// envelopes run 0 to 5 V, the joystick -10 to +10 V, audio about +-5 V.
//
// Speed: the knobs are read once per block of 128 samples (prepare), and the per-sample code (tick) only does sums,
// so the whole instrument runs comfortably in real time, on an iPad too.

function solarWorklet() {
  const SR = sampleRate;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const expMap = (v, a, b) => a * Math.pow(b / a, v);          // knob 0..1 -> a..b, evenly by ratio
  const pow2 = x => Math.pow(2, x);
  const coef = seconds => 1 - Math.exp(-1 / (seconds * SR));  // one-pole smoothing step for a time constant

  // PolyBLEP: takes the harsh digital edge off a jump in a waveform, the way an analog oscillator's edge is.
  function blep(t, dt) {
    if (t < dt) { t /= dt; return t + t - t * t - 1; }
    if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
    return 0;
  }

  // ---- The jacks: every output and input on the panel, by number ----
  const OUTS = ['lfoa.out', 'lfob.out', 'joy.x', 'joy.y', 'seq.pulse', 'seq.cv', 'seq.gate',
    'd1.env', 'd2.env', 'd3.env', 'd4.env', 'd5.env', 'd6.env', 'd3.lfo', 'd6.lfo', 'd3.sh', 'd6.sh',
    'enva.out', 'envb.out', 'vcoa.out', 'vcob.out', 'vcob.osc', 'ef.env', 'ef.gate',
    'kbd.trig', 'kbd.gate', 'kbd.gate2', 'kbd.press', 'kbd.voct'];
  const INS = ['d1.gate', 'd2.gate', 'd3.gate', 'd4.gate', 'd5.gate', 'd6.gate', 'd1.cvin', 'd2.cvin', 'd3.cvin',
    'd4.cvin', 'd5.cvin', 'd6.cvin', 'd3.shin', 'd6.shin', 'd3.clock', 'd6.clock',
    'vcoa.voct', 'vcoa.cv', 'vcoa.pwm', 'vcoa.sync', 'vcob.voct', 'vcob.cv', 'vcob.pwm',
    'enva.gate', 'enva.vca', 'envb.gate', 'envb.vca', 'flt.cv', 'fx.cvx', 'fx.cvy', 'fx.cvz',
    'seq.clock', 'pre.ext', 'ext.audio', 'kbd.clk'];
  const O = Object.fromEntries(OUTS.map((n, i) => [n, i]));
  const I = Object.fromEntries(INS.map((n, i) => [n, i]));

  // ---- Small building blocks ----

  // Attack / release envelope of the drone voices (opens their VCA while the gate is on).
  class AR {
    constructor() { this.v = 0; this.ca = 0.01; this.cr = 0.001; }
    prepare(att, rls) { this.ca = coef(att); this.cr = coef(rls); }
    tick(gate) {
      if (gate) { this.v += (1.25 - this.v) * this.ca; if (this.v > 1) this.v = 1; }
      else this.v -= this.v * this.cr;
      return this.v;
    }
  }

  // The VCO envelopes: attack, decay, sustain, release. In loop mode it runs by itself like an LFO ("self
  // generation" in the manual).
  class ADSR {
    constructor() { this.v = 0; this.stage = 0; this.lastGate = false; }
    prepare(a, d, s, r, loop) { this.ca = coef(a); this.cd = coef(d); this.s = s; this.cr = coef(r); this.loop = loop; }
    tick(gate) {
      const loop = this.loop;
      if (gate && !this.lastGate) this.stage = 1;
      if (!gate && this.lastGate && !loop) this.stage = 4;
      this.lastGate = gate;
      if (loop && this.stage === 0) this.stage = 1;
      const st = this.stage;
      if (st === 1) { this.v += (1.3 - this.v) * this.ca; if (this.v >= 1) { this.v = 1; this.stage = loop ? 4 : 2; } }
      else if (st === 2) this.v += (this.s - this.v) * this.cd;
      else if (st === 4) { this.v -= this.v * this.cr; if (this.v < 0.002) { this.v = 0; this.stage = loop ? 1 : 0; } }
      return this.v;
    }
  }

  // A delay line, read at any (fractional) delay in samples.
  class Delay {
    constructor(seconds) { this.n = Math.ceil(seconds * SR) + 4; this.b = new Float32Array(this.n); this.w = 0; }
    write(x) { this.b[this.w] = x; if (++this.w === this.n) this.w = 0; }
    read(d) {
      let r = this.w - 1 - d; if (r < 0) r += this.n; if (r < 0) r = 0;
      const i = r | 0, f = r - i, j = i + 1 === this.n ? 0 : i + 1;
      return this.b[i] + (this.b[j] - this.b[i]) * f;
    }
    clear() { this.b.fill(0); }
  }

  // Pitch shifter: two read heads sweep through a short delay, faded in and out, so the sound is replayed faster or
  // slower than it came in (higher or lower) without changing its length.
  class Shifter {
    constructor() { this.dl = new Delay(0.2); this.ph = 0; this.win = 0.06 * SR; this.step = 0; }
    setPitch(semis) { this.step = -(pow2(semis / 12) - 1) / this.win; }
    tick(x) {
      this.dl.write(x);
      let p = this.ph + this.step; p -= Math.floor(p); this.ph = p;
      let p2 = p + 0.5; if (p2 >= 1) p2 -= 1;
      // sin(pi*p) windows, from a cheap parabola (close enough for a crossfade)
      const w1 = 4 * p * (1 - p), w2 = 4 * p2 * (1 - p2);
      return this.dl.read(p * this.win + 2) * w1 + this.dl.read(p2 * this.win + 2) * w2;
    }
    clear() { this.dl.clear(); }
  }

  // Reverb (Freeverb: eight damped combs into four allpasses).
  class Reverb {
    constructor(spread) {
      const k = SR / 44100;
      this.cb = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(n => new Float32Array(Math.round((n + spread) * k)));
      this.ci = new Int32Array(8); this.cf = new Float32Array(8);
      this.ab = [556, 441, 341, 225].map(n => new Float32Array(Math.round((n + spread) * k)));
      this.ai = new Int32Array(4);
      this.fb = 0.84; this.damp = 0.3;
    }
    set(size, damp) { this.fb = 0.7 + 0.28 * size; this.damp = damp; }
    tick(x) {
      const fb = this.fb, damp = this.damp, inp = x * 0.015;
      let out = 0;
      for (let c = 0; c < 8; c++) {
        const b = this.cb[c], i = this.ci[c], y = b[i];
        const f = y * (1 - damp) + this.cf[c] * damp;
        this.cf[c] = f; b[i] = inp + f * fb;
        this.ci[c] = i + 1 === b.length ? 0 : i + 1;
        out += y;
      }
      for (let a = 0; a < 4; a++) {
        const b = this.ab[a], i = this.ai[a], y = b[i];
        b[i] = out + y * 0.5;
        this.ai[a] = i + 1 === b.length ? 0 : i + 1;
        out = y - out;
      }
      return out;
    }
    clear() { for (const b of this.cb) b.fill(0); this.cf.fill(0); for (const b of this.ab) b.fill(0); }
  }

  // State-variable filter (Cytomic's), used in the effector and, with some extra grit, as the Polivoks filter.
  class SVF {
    constructor() { this.ic1 = 0; this.ic2 = 0; this.lp = 0; this.bp = 0; this.hp = 0; this.set(1000, 0.7); }
    set(fc, q) {
      const g = Math.tan(Math.PI * clamp(fc, 10, SR * 0.45) / SR), k = 1 / q;
      this.k = k; this.a1 = 1 / (1 + g * (g + k)); this.a2 = g * this.a1; this.a3 = g * this.a2;
    }
    tick(x, drive) {
      const v3 = x - this.ic2;
      let v1 = this.a1 * this.ic1 + this.a2 * v3;
      const v2 = this.ic2 + this.a2 * this.ic1 + this.a3 * v3;
      if (drive) v1 = Math.tanh(v1 * drive) / drive;     // the Polivoks' rough, singing resonance
      this.ic1 = 2 * v1 - this.ic1; this.ic2 = 2 * v2 - this.ic2;
      this.lp = v2; this.bp = v1; this.hp = x - this.k * v1 - v2;
    }
    clear() { this.ic1 = this.ic2 = 0; }
  }

  // ---- The voices ----

  // Classic drone voices 1, 2, 4, 5 (after the SOLAR 50): five free-running sawtooth oscillators, two low, one middle,
  // two high, each with MUTE, TUNE and MOD. VOLT transposes all five down; past halfway they start modulating each
  // other (FM). With MOD on, an oscillator's pitch follows the light on the photo sensor and the CV input.
  const DRONE_BASE = {
    1: [55.0, 82.41, 110.0, 329.6, 440.0], 2: [65.41, 98.0, 130.8, 392.0, 523.3],
    4: [49.0, 73.42, 146.8, 293.7, 440.0], 5: [41.2, 61.74, 123.5, 370.0, 493.9],
  };
  class Classic {
    constructor(k) {
      this.k = k; this.base = DRONE_BASE[k]; this.ph = new Float64Array(5).map(() => Math.random());
      this.drift = new Float64Array(5); this.mult = new Float64Array(5); this.mute = new Uint8Array(5);
      this.mod = new Uint8Array(5); this.env = new AR(); this.last = 0; this.envOut = 0;
      const p = 'd' + k + '.';
      this.keys = { volt: p + 'volt', light: p + 'light', cv: p + 'cv', att: p + 'att', rls: p + 'rls',
        tune: [1, 2, 3, 4, 5].map(i => p + 'tune' + i), mute: [1, 2, 3, 4, 5].map(i => p + 'mute' + i), mod: [1, 2, 3, 4, 5].map(i => p + 'mod' + i) };
    }
    prepare(P) {
      const K = this.keys, volt = P[K.volt];
      const transpose = pow2(-2.2 * volt);
      this.cross = Math.max(0, (volt - 0.5) * 2) * 1.8;
      this.anyMod = false; this.playing = 0;
      for (let i = 0; i < 5; i++) {
        // analog oscillators wander a little: "tuning drifts over time"
        this.drift[i] = clamp(this.drift[i] * 0.995 + (Math.random() - 0.5) * 0.0006, -0.006, 0.006);
        this.mult[i] = this.base[i] * pow2((P[K.tune[i]] - 0.5) * 2) * transpose * (1 + this.drift[i]) / SR;
        this.mute[i] = P[K.mute[i]] > 0.5 ? 1 : 0;
        this.mod[i] = P[K.mod[i]] > 0.5 ? 1 : 0;
        if (this.mod[i]) this.anyMod = true;
        if (!this.mute[i]) this.playing++;
      }
      this.modBase = (0.5 - P[K.light]) * 1.4; this.cvDepth = P[K.cv] * 0.3;
      this.env.prepare(expMap(P[K.att], 0.002, 12), expMap(P[K.rls], 0.005, 20));
    }
    tick(cvIn, gate) {
      const env = this.env.tick(gate);
      this.envOut = env;
      if (env < 1e-5 && !gate) return 0;           // silent: skip the oscillators (they keep their place)
      const modMul = this.anyMod ? pow2(this.modBase + cvIn * this.cvDepth) : 1;
      const cross = this.cross;
      let sum = 0, prev = this.last;
      for (let i = 0; i < 5; i++) {
        let dt = this.mult[i];
        if (this.mod[i]) dt *= modMul;
        if (cross > 0) { dt *= 1 + cross * prev; if (dt < 0) dt = -dt; }
        let p = this.ph[i] + dt; if (p >= 1) p -= 1; this.ph[i] = p;
        const s = 2 * p - 1 - blep(p, dt);
        prev = s;
        if (!this.mute[i]) sum += s;
      }
      this.last = prev;
      return sum * 0.22 * env;
    }
  }

  // "New" drone voices 3 and 6 (after Papa Srapa's DIY designs): a square-wave tone oscillator, a square LFO that can
  // bend its pitch (fm) or chop it (am), a frequency divider, white noise, and a sample & hold. Sirens, bird calls,
  // space monsters, volleys, surf and wind.
  class Srapa {
    constructor(k) {
      this.k = k; this.lph = 0; this.ph = 0; this.div = 1; this.count = 0; this.noise = 0;
      this.env = new AR(); this.sh = 0; this.lastClock = 0; this.lp = 0; this.lfoOut = 0; this.envOut = 0;
      const p = 'd' + k + '.';
      this.keys = ['rate', 'range', 'mod', 'pitch', 'hilo', 'fm', 'am', 'divider', 'noise', 'att', 'rls'].reduce((o, n) => (o[n] = p + n, o), {});
    }
    prepare(P) {
      const K = this.keys;
      this.lfoInc = expMap(P[K.rate], 0.08, 9) * (P[K.range] > 0.5 ? 10 : 1) / SR;
      this.mod = P[K.mod];
      this.dtBase = expMap(P[K.pitch], 35, 1100) * (P[K.hilo] > 0.5 ? 6 : 1) / SR;
      this.fm = P[K.fm] > 0.5; this.am = P[K.am] > 0.5;
      this.fmUp = pow2(0.5 * this.mod * 4); this.fmDown = pow2(-0.5 * this.mod * 4);
      this.divN = 1 + Math.round(P[K.divider] * 15); this.dv = P[K.divider] * 0.6; this.nz = P[K.noise];
      this.env.prepare(expMap(P[K.att], 0.002, 12), expMap(P[K.rls], 0.005, 20));
    }
    tick(cvIn, gate, shIn, clockIn, shInPatched, clockPatched) {
      let l = this.lph + this.lfoInc; if (l >= 1) l -= 1; this.lph = l;
      const sq = l < 0.5 ? 1 : 0;
      this.lfoOut = sq * 5;
      this.noise = Math.random() * 2 - 1;
      // Sample & hold: noise (or the patched input), sampled on each rising edge of the clock (or this voice's LFO).
      const clock = clockPatched ? clockIn : this.lfoOut;
      if (clock > 2.5 && this.lastClock <= 2.5) this.sh = clamp(shInPatched ? shIn : this.noise * 5, -5, 5);
      this.lastClock = clock;
      const env = this.env.tick(gate);
      this.envOut = env;
      if (env < 1e-5 && !gate) return 0;
      let dt = this.dtBase;
      if (cvIn !== 0) dt *= pow2(cvIn);
      if (this.fm) dt *= sq ? this.fmUp : this.fmDown;
      if (dt > 0.45) dt = 0.45;
      let p = this.ph + dt;
      if (p >= 1) {                                   // one cycle done: step the divider
        p -= 1;
        if (++this.count >= this.divN) { this.count = 0; this.div = -this.div; }
      }
      this.ph = p;
      let p2 = p + 0.5; if (p2 >= 1) p2 -= 1;
      const tone = (p < 0.5 ? 1 : -1) + blep(p, dt) - blep(p2, dt);
      let s = tone * (1 - this.dv) + this.div * this.dv;
      s = s * (1 - this.nz) + this.noise * this.nz * 1.3;
      if (this.am) s *= 1 - this.mod * (1 - sq);
      this.lp += (s - this.lp) * 0.55;                // the circuit's own soft top end
      return this.lp * 0.35 * env;
    }
  }

  // The two volt-per-octave VCOs (triangle core, after the AS3340). The big knob picks one of six waveforms: sine,
  // triangle, saw, square, saw-to-inverted-saw and sine-to-triangle; PW sets the square's width and morphs the last two.
  class VCO {
    constructor(x) {
      this.ph = 0; this.sub = 0; this.lastSync = 0; this.raw = 0;
      const p = 'vco' + x + '.';
      this.keys = ['cvamt', 'tune', 'oct', 'linexp', 'pw', 'pwm', 'morph', 'sub'].reduce((o, n) => (o[n] = p + n, o), {});
    }
    prepare(P) {
      const K = this.keys;
      this.cvAmt = P[K.cvamt]; this.exp = P[K.linexp] > 0.5;
      this.pitch = P[K.tune] + (P[K.oct] > 0.5 ? 3 : 0);
      this.pw = P[K.pw]; this.pwmAmt = P[K.pwm] * 0.09;
      this.wave = Math.round(P[K.morph] * 5); this.subOn = P[K.sub] > 0.5;
    }
    tick(voct, cv, pwmIn, syncIn) {
      let f = 65.406 * pow2(this.pitch + voct + (this.exp ? cv * this.cvAmt : 0));
      if (!this.exp) f += cv * this.cvAmt * 120;
      if (f < 0) f = -f;
      if (f < 0.5) f = 0.5; else if (f > SR * 0.45) f = SR * 0.45;
      if (syncIn > 0 && this.lastSync <= 0) this.ph = 0;
      this.lastSync = syncIn;
      const dt = f / SR;
      let p = this.ph + dt; if (p >= 1) { p -= 1; this.sub = 1 - this.sub; } this.ph = p;
      let pw = this.pw + pwmIn * this.pwmAmt; if (pw < 0.03) pw = 0.03; else if (pw > 0.97) pw = 0.97;
      let w;
      switch (this.wave) {
        case 0: w = Math.sin(2 * Math.PI * p); break;
        case 1: w = 1 - 4 * Math.abs(p - 0.5); break;
        case 2: w = 2 * p - 1 - blep(p, dt); break;
        case 3: { let q = p - pw; if (q < 0) q += 1; w = (p < pw ? 1 : -1) + blep(p, dt) - blep(q, dt); break; }
        case 4: w = p < pw ? 2 * p / pw - 1 : 1 - 2 * (p - pw) / (1 - pw); break;   // saw <-> triangle <-> inverted saw
        default: w = Math.sin(2 * Math.PI * p) * (1 - pw) + (1 - 4 * Math.abs(p - 0.5)) * pw;
      }
      if (this.subOn) w = w * 0.7 + (this.sub ? 0.5 : -0.5);
      this.raw = w;
      return w;
    }
  }

  // ---- The dual effector ----
  // One cartridge, two channels (L and R), each running one of the cartridge's three programs. X, Y and Z mean
  // different things in each program (the names are printed on each cartridge).
  class FxChannel {
    constructor(spread) {
      this.dl = new Delay(2.2); this.dl2 = new Delay(0.1); this.sh1 = new Shifter(); this.sh2 = new Shifter();
      this.rev = new Reverb(spread); this.f1 = new SVF(); this.f2 = new SVF(); this.ap = new Float64Array(6);
      this.lfo = Math.random(); this.env = 0; this.fb = 0; this.rv = 0; this.revPos = 0; this.mode = -1;
    }
    clear() {
      this.dl.clear(); this.dl2.clear(); this.sh1.clear(); this.sh2.clear(); this.rev.clear(); this.f1.clear();
      this.f2.clear(); this.ap.fill(0); this.fb = 0; this.rv = 0;
    }
    // Everything the knobs set, worked out once per block.
    prepare(cart, prog, X, Y, Z) {
      const m = this.mode = cart * 3 + prog;
      this.X = X; this.Y = Y; this.Z = Z;
      this.dly = expMap(Y, 0.04, 1.8) * SR;
      this.rev.set(0.75, 0.3);
      if (m === 0) { this.sh1.setPitch(12); this.sh2.setPitch(-12); this.rev.set(0.6 + Z * 0.4, 0.25); }
      else if (m === 1) this.sh1.setPitch(12);
      else if (m === 2) this.rev.set(0.75 + Z * 0.25, 0.2);
      else if (m === 3) this.lfoInc = expMap(Y, 0.3, 16) / SR;
      else if (m === 4) this.lfoInc = expMap(Y, 0.3, 12) / SR;
      else if (m === 5) this.lfoInc = expMap(Y, 0.1, 6) / SR;
      else if (m === 6 || m === 7) this.sh1.setPitch((Z - 0.5) * 24);
      else if (m === 8) { this.sh1.setPitch(Math.round((Z - 0.5) * 24)); this.f1.set(2500, 0.7); }
      else if (m === 9) this.envFall = expMap(1 - Y, 0.00005, 0.002);
      else if (m === 10) { this.f1.set(expMap(X, 20, 8000), 0.6 + Z * 8); this.f2.set(expMap(Y, 150, 18000), 0.6 + Z * 8); }
      else if (m === 11) { this.f1.set(expMap(X, 80, 8000), 0.4 + Z * 4); this.f2.set(expMap(Y, 80, 8000), 0.4 + Z * 4); }
      else if (m === 13) this.lfoInc = 0.7 / SR;
      else if (m === 14) this.lfoInc = expMap(Y, 0.5, 9) / SR;
      else if (m === 15) this.lfoInc = expMap(Y, 0.05, 6) / SR;
      else if (m >= 16) this.lfoInc = expMap(Y, 0.05, 5) / SR;
    }
    lfoTick() { let l = this.lfo + this.lfoInc; if (l >= 1) l -= 1; this.lfo = l; return Math.sin(2 * Math.PI * l); }
    verb(x, amt) { return amt > 0.001 ? x * (1 - amt * 0.5) + this.rev.tick(x) * amt * 1.6 : x; }
    tick(x) {
      const X = this.X, Z = this.Z, dly = this.dly;
      switch (this.mode) {
        // CATHEDRAL
        case 0: {               // Shimmer: the reverb's tail is fed back an octave up (X) and an octave down (Y)
          const fbk = this.sh1.tick(this.rv) * X * 0.55 + this.sh2.tick(this.rv) * this.Y * 0.45;
          this.rv = this.rev.tick(x + fbk);
          return x * 0.3 + this.rv * 1.5;
        }
        case 1: { const d = this.dl.read(dly); this.dl.write(x + this.sh1.tick(d) * X * 0.85); return this.verb(x * 0.5 + d, Z); }  // Octave-up delay
        case 2: { const d = this.dl.read(dly); this.dl.write(x + d * X * 0.9); return x * 0.3 + this.rev.tick(x + d) * 1.8; }      // Space reverb
        // VIBROTREM
        case 3: return this.verb(x * (1 - X * (0.5 + 0.5 * this.lfoTick())), Z);
        case 4: { const l = this.lfoTick(); this.dl2.write(x); return this.verb(this.dl2.read(SR * (0.004 + X * 0.004 * (1 + l))), Z); }
        case 5: {
          const l = this.lfoTick(); this.dl2.write(x);
          const c = this.dl2.read(SR * (0.012 + X * 0.007 * (1 + l))) + this.dl2.read(SR * (0.02 + X * 0.007 * (1 - l)));
          return this.verb(x * 0.6 + c * 0.6, Z);
        }
        // MAGIC
        case 6: { const d = this.dl.read(dly); this.dl.write(x + this.sh1.tick(d) * X * 0.85); return x * 0.6 + d; }   // Pitch delay
        case 7: {               // Reverse pitch delay: the delayed sound is played backwards, in pieces as long as Y
          const len = Math.max(dly, SR * 0.06);
          if (++this.revPos >= len) this.revPos = 0;
          const back = this.dl.read(clamp(2 * this.revPos, 1, this.dl.n - 8));
          const w = 4 * (this.revPos / len) * (1 - this.revPos / len);
          const out = this.sh1.tick(back * w);
          this.dl.write(x + out * X * 0.75);
          return x * 0.6 + out;
        }
        case 8: {               // Bell pitch delay: bright pitched repeats that ring like a bell
          const d = this.dl.read(dly); this.f1.tick(d, 0);
          this.dl.write(x + this.sh1.tick(this.f1.hp + d * 0.3) * X * 0.92);
          return x * 0.5 + d * 1.2;
        }
        // FILTER
        case 9: {               // Auto wah: the louder you play, the higher the filter opens
          const a = x < 0 ? -x : x;
          this.env += (a - this.env) * (a > this.env ? 0.01 : this.envFall);
          if ((this.revPos = (this.revPos + 1) & 15) === 0) this.f1.set(200 * pow2(clamp(this.env * 18, 0, 1) * X * 5), 4);
          this.f1.tick(x, 0);
          return this.verb(this.f1.bp * 1.6, Z);
        }
        case 10: { this.f1.tick(x, 0); this.f2.tick(this.f1.hp, 0); return this.f2.lp; }     // HP / LP filter
        case 11: { this.f1.tick(x, 0); const n1 = this.f1.lp + this.f1.hp; this.f2.tick(n1, 0); return this.f2.lp + this.f2.hp; } // Notch
        // TIME
        case 12: { const d = this.dl.read(dly); this.dl.write(x + d * X * 0.92); return this.verb(x * 0.6 + d, Z); }
        case 13: { const l = this.lfoTick(); const d = this.dl.read(dly + l * Z * SR * 0.008 + SR * 0.01); this.dl.write(x + d * X * 0.9); return x * 0.6 + d; }
        case 14: { const l = this.lfoTick(); const d = this.dl.read(SR * 0.26 + l * Z * SR * 0.006); this.dl.write(x + d * X * 0.88); return x * 0.6 + d; }
        // VIBE
        case 15: {              // Phaser: six allpass stages swept by the LFO
          const l = this.lfoTick();
          const a = clamp(0.35 + 0.6 * X * (0.5 + 0.5 * l), 0, 0.97);
          let y = x + this.fb * 0.5;
          for (let i = 0; i < 6; i++) { const o = -a * y + this.ap[i]; this.ap[i] = y + a * o; y = o; }
          this.fb = y;
          return this.verb(x * 0.55 + y * 0.55, Z);
        }
        case 16: { const l = this.lfoTick(); const d = this.dl2.read(SR * (0.0007 + X * 0.005 * (0.5 + 0.5 * l))); this.dl2.write(x + d * 0.6); return this.verb((x + d) * 0.6, Z); }
        default: { const l = this.lfoTick(); const d = this.dl2.read(SR * (0.0006 + Z * 0.006 * (0.5 + 0.5 * l))); this.dl2.write(x + d * (0.5 + X * 0.47)); return (x + d) * 0.55; }
      }
    }
  }

  // Which output index each named output has (used in the sample loop).
  const oLFOA = O['lfoa.out'], oLFOB = O['lfob.out'], oJX = O['joy.x'], oJY = O['joy.y'], oPULSE = O['seq.pulse'],
    oSCV = O['seq.cv'], oSGATE = O['seq.gate'], oENVA = O['enva.out'], oENVB = O['envb.out'], oVA = O['vcoa.out'],
    oVB = O['vcob.out'], oVBOSC = O['vcob.osc'], oEFENV = O['ef.env'], oEFGATE = O['ef.gate'], oTRIG = O['kbd.trig'],
    oKGATE = O['kbd.gate'], oKGATE2 = O['kbd.gate2'], oPRESS = O['kbd.press'], oVOCT = O['kbd.voct'];
  const DRONES = [1, 2, 3, 4, 5, 6];
  const dEnvOut = DRONES.map(d => O['d' + d + '.env']);
  const dGateIn = DRONES.map(d => I['d' + d + '.gate']), dCvIn = DRONES.map(d => I['d' + d + '.cvin']);

  class Solar extends AudioWorkletProcessor {
    constructor() {
      super();
      this.P = {}; this.T = {};                        // knob values: current (smoothed) and target
      this.src = new Int16Array(INS.length).fill(-1); // which output each input is patched to (-1: nothing)
      this.out = new Float64Array(OUTS.length);       // every output's value, one sample ago
      this.voices = DRONES.map(d => (d === 3 || d === 6 ? new Srapa(d) : new Classic(d)));
      this.vcoA = new VCO('a'); this.vcoB = new VCO('b'); this.envA = new ADSR(); this.envB = new ADSR();
      this.lfoA = 0; this.lfoB = 0; this.seqPh = 0; this.step = 0; this.gateLeft = 0; this.lastSeqClock = 0;
      this.fL = new SVF(); this.fR = new SVF(); this.fx = [new FxChannel(0), new FxChannel(23)];
      this.ef = 0; this.kbdPrev = -1; this.kbdVolt = 0; this.trig = 0; this.dc = new Float64Array(4); this.meter = 0;
      this.frames = 0; this.outPeak = 0;
      this.gL = new Float64Array(10); this.gR = new Float64Array(10); this.ch = new Float64Array(10);
      this.port.onmessage = e => this.message(e.data);
    }
    message(m) {
      if (m.set) for (const k in m.set) { const v = m.set[k]; this.T[k] = v; if (!(k in this.P) || m.now) this.P[k] = v; }
      if (m.cables) { this.src.fill(-1); for (const [a, b] of m.cables) if (a in O && b in I) this.src[I[b]] = O[a]; }
      if (m.reset != null) this.fx[m.reset].clear();
    }

    process(inputs, outputs) {
      const P = this.P, T = this.T, src = this.src, o = this.out;
      for (const k in T) { const t = T[k], c = P[k]; if (c !== t) P[k] = Math.abs(t - c) > 1e-5 ? c + (t - c) * 0.3 : t; }
      const outL = outputs[0][0], outR = outputs[0][1] || outputs[0][0];
      const mic = inputs[0] && inputs[0][0];
      const n = outL.length;
      const inp = (i, normal) => { const s = src[i]; return s >= 0 ? o[s] : normal; };
      const patched = i => src[i] >= 0;

      // ---- Everything the knobs set, once per block ----
      for (const v of this.voices) v.prepare(P);
      this.vcoA.prepare(P); this.vcoB.prepare(P);
      this.envA.prepare(expMap(P['enva.a'], 0.001, 8), expMap(P['enva.d'], 0.005, 10), P['enva.s'], expMap(P['enva.r'], 0.005, 15), P['enva.loop'] > 0.5);
      this.envB.prepare(expMap(P['envb.a'], 0.001, 8), expMap(P['envb.d'], 0.005, 10), P['envb.s'], expMap(P['envb.r'], 0.005, 15), P['envb.loop'] > 0.5);
      const lfoAInc = expMap(P['lfoa.rate'], 0.01, 3) / SR, lfoBInc = expMap(P['lfob.rate'], 0.08, 40) / SR;
      const lfoAW = P['lfoa.wave'], lfoBW = P['lfob.wave'];
      const joyX = clamp(P['joy.x'] * 7 + (P['joy.offx'] - 0.5) * 6, -10, 10), joyY = clamp(P['joy.y'] * 7 + (P['joy.offy'] - 0.5) * 6, -10, 10);
      const pulseHz = expMap(P['seq.pulser'], 0.2, 25), stages = 3 + Math.round(P['seq.stages'] * 2);
      const seqClockPatched = patched(I['seq.clock']);
      const stepV = [1, 2, 3, 4, 5].map(i => P['seq.step' + i] * 5), stepGate = [1, 2, 3, 4, 5].map(i => P['seq.gate' + i] > 0.5);
      const note = P['kbd.note'], held = note >= 0;
      const kbdVolt = held ? P['kbd.oct'] + (note + (P['kbd.tr'] || 0)) / 12 : this.kbdVolt;
      const press = P['kbd.press'];
      const dGate = DRONES.map(d => P['d' + d + '.hold'] > 0.5 || P['d' + d + '.pad'] > 0.5);
      const preGain = expMap(P['pre.gain'], 0.05, 40) / 5;
      const efA = coef(expMap(P['ef.att'], 0.001, 1)), efR = coef(expMap(P['ef.rls'], 0.01, 3));
      for (let c = 0; c < 10; c++) {
        const v = P['mix.vol' + c], g = v * v * 1.8, pan = P['mix.pan' + c] * Math.PI / 2;
        this.gL[c] = g * Math.cos(pan); this.gR[c] = g * Math.sin(pan);
      }
      const fcBaseL = expMap(P['flt.freqL'], 30, 16000), fcBaseR = expMap(P['flt.freqR'], 30, 16000);
      const qL = 0.5 + P['flt.resL'] * P['flt.resL'] * 30, qR = 0.5 + P['flt.resR'] * P['flt.resR'] * 30;
      const inGL = 1 + P['flt.resL'] * 0.8, inGR = 1 + P['flt.resR'] * 0.8;
      const bpL = P['flt.modeL'] > 0.5, bpR = P['flt.modeR'] > 0.5, link = P['flt.link'] > 0.5, fMod = P['flt.mod'] * 1.2;
      const fltPatched = patched(I['flt.cv']);
      if (!fltPatched) { this.fL.set(fcBaseL, qL); this.fR.set(fcBaseR, qR); }
      const drive = 1 + P['flt.gain'] * P['flt.gain'] * 40, dm = P['flt.dist'], satNorm = 0.6 / Math.tanh(Math.min(drive, 3));
      const fxCvPatched = patched(I['fx.cvx']) || patched(I['fx.cvy']) || patched(I['fx.cvz']);
      const cart = P['fx.cart'] | 0, progL = Math.round(P['fx.progL']), progR = Math.round(P['fx.progR']);
      const fxX = P['fx.x'], fxY = P['fx.y'], fxZ = P['fx.z'];
      const prepFx = () => {
        const X = clamp(fxX + inp(I['fx.cvx'], 0) / 10, 0, 1), Y = clamp(fxY + inp(I['fx.cvy'], 0) / 10, 0, 1), Z = clamp(fxZ + inp(I['fx.cvz'], 0) / 10, 0, 1);
        this.fx[0].prepare(cart, progL, X, Y, Z); this.fx[1].prepare(cart, progR, X, Y, Z);
      };
      prepFx();
      const mono = P['fx.chan'] > 0.5, byL = P['fx.bypassL'] > 0.5, byR = P['fx.bypassR'] > 0.5, bl = P['fx.blend'];
      const vol = P['fx.master'] * P['fx.master'] * 3 * (0.3 + 0.7 * P['fx.phones']);
      const shIn3 = patched(I['d3.shin']), shIn6 = patched(I['d6.shin']), clk3 = patched(I['d3.clock']), clk6 = patched(I['d6.clock']);
      const V = this.voices, ch = this.ch, gL = this.gL, gR = this.gR;

      for (let s = 0; s < n; s++) {
        // ---- LFOs (positive only, 0..5 V, so they can light the drone voices' photo sensors) ----
        let la = this.lfoA + lfoAInc; if (la >= 1) la -= 1; this.lfoA = la;
        let lb = this.lfoB + lfoBInc; if (lb >= 1) lb -= 1; this.lfoB = lb;
        o[oLFOA] = ((1 - lfoAW) * (1 - Math.abs(2 * la - 1)) + lfoAW * (la < 0.5 ? 1 : 0)) * 5;
        o[oLFOB] = ((1 - lfoBW) * (1 - Math.abs(2 * lb - 1)) + lfoBW * (lb < 0.5 ? 1 : 0)) * 5;
        // ---- Joystick: -10..+10 V, 0 V in the middle; the offset knobs shift it ----
        o[oJX] = joyX; o[oJY] = joyY;

        // ---- 5-step sequencer, clocked by the PULSER or by a patched clock ----
        let sp = this.seqPh + pulseHz / SR; if (sp >= 1) sp -= 1; this.seqPh = sp;
        o[oPULSE] = sp < 0.5 ? 5 : 0;
        const clock = seqClockPatched ? inp(I['seq.clock'], 0) : o[oPULSE];
        if (clock > 2.5 && this.lastSeqClock <= 2.5) {
          this.step = (this.step + 1) % stages;
          this.gateLeft = stepGate[this.step] ? (seqClockPatched ? 0.03 * SR : 0.5 * SR / pulseHz) : 0;
        }
        this.lastSeqClock = clock;
        o[oSCV] = stepV[this.step];
        o[oSGATE] = this.gateLeft > 0 ? 5 : 0; if (this.gateLeft > 0) this.gateLeft--;

        // ---- Touch keyboard: volt per octave, gate, trigger and pressure ----
        if (held && note !== this.kbdPrev) this.trig = 0.004 * SR;
        this.kbdPrev = held ? note : -1;
        this.kbdVolt = kbdVolt;
        o[oVOCT] = kbdVolt;
        o[oKGATE] = o[oKGATE2] = held ? 5 : 0;
        o[oTRIG] = this.trig > 0 ? 5 : 0; if (this.trig > 0) this.trig--;
        o[oPRESS] = held ? press * 5 : 0;

        // ---- Drone voices ----
        for (let d = 0; d < 6; d++) {
          const v = V[d];
          const gate = dGate[d] || inp(dGateIn[d], 0) > 2.5;
          if (d === 2 || d === 5) {
            const k = d === 2 ? 3 : 6;
            ch[d === 2 ? 2 : 9] = v.tick(inp(dCvIn[d], 0), gate, inp(I['d' + k + '.shin'], 0), inp(I['d' + k + '.clock'], 0),
              d === 2 ? shIn3 : shIn6, d === 2 ? clk3 : clk6);
            o[d === 2 ? O['d3.lfo'] : O['d6.lfo']] = v.lfoOut; o[d === 2 ? O['d3.sh'] : O['d6.sh']] = v.sh;
          } else {
            // Normalled: LFO A lights the photo sensors of voices 1 and 2, LFO B those of 4 and 5.
            ch[[0, 1, -1, 7, 8][d]] = v.tick(inp(dCvIn[d], d < 2 ? o[oLFOA] : o[oLFOB]), gate);
          }
          o[dEnvOut[d]] = v.envOut * 5;
        }

        // ---- VCO A and B ----
        // Normalled: the keyboard plays both; LFO A / LFO B sweep their pulse width; VCO A frequency-modulates VCO B
        // through its CV AMT knob.
        const a = this.vcoA.tick(inp(I['vcoa.voct'], kbdVolt), inp(I['vcoa.cv'], 0), inp(I['vcoa.pwm'], o[oLFOA]), inp(I['vcoa.sync'], 0));
        const b = this.vcoB.tick(inp(I['vcob.voct'], kbdVolt), inp(I['vcob.cv'], a), inp(I['vcob.pwm'], o[oLFOB]), 0);
        const kg = o[oKGATE];
        const ea = this.envA.tick(inp(I['enva.gate'], kg) > 2.5 || P['enva.hold'] > 0.5);
        const eb = this.envB.tick(inp(I['envb.gate'], kg) > 2.5 || P['envb.hold'] > 0.5);
        o[oENVA] = ea * 5; o[oENVB] = eb * 5;
        const va = a * clamp(inp(I['enva.vca'], ea * 5) / 5, 0, 1.2), vb = b * clamp(inp(I['envb.vca'], eb * 5) / 5, 0, 1.2);
        o[oVA] = va * 5; o[oVB] = vb * 5; o[oVBOSC] = b * 5;

        // ---- Preamp (contact mic: the computer's microphone) and envelope follower ----
        const pre = inp(I['pre.ext'], (mic ? mic[s] : 0) * 5) * preGain;
        const ax = pre < 0 ? -pre : pre;
        this.ef += (ax - this.ef) * (ax > this.ef ? efA : efR);
        o[oEFENV] = this.ef * 20 > 10 ? 10 : this.ef * 20; o[oEFGATE] = this.ef > 0.05 ? 5 : 0;
        if (ax > this.meter) this.meter = ax;

        // ---- Voice mixer: ten channels, each with VOL and PAN ----
        ch[3] = inp(I['ext.audio'], 0) / 5; ch[4] = va * 0.7; ch[5] = vb * 0.7; ch[6] = pre * 0.8;
        let L = 0, R = 0;
        for (let c = 0; c < 10; c++) { const x = ch[c]; L += x * gL[c]; R += x * gR[c]; }

        // ---- Dual 12 dB Polivoks filter (low pass or band pass each side), then the stereo distortion ----
        if (fltPatched) {
          const m = pow2(inp(I['flt.cv'], 0) * fMod);
          this.fL.set(fcBaseL * m, qL); this.fR.set(link ? fcBaseR * m : fcBaseR, qR);
        }
        this.fL.tick(L * inGL, 1.4); this.fR.tick(R * inGR, 1.4);
        L = bpL ? this.fL.bp * 1.6 : this.fL.lp;
        R = bpR ? this.fR.bp * 1.6 : this.fR.lp;
        if (dm > 0.001) {
          L = L * (1 - dm) + Math.tanh(L * drive) * satNorm * dm;
          R = R * (1 - dm) + Math.tanh(R * drive) * satNorm * dm;
        }

        // ---- Dual effector ----
        if (fxCvPatched && (s & 15) === 0) prepFx();
        const inL = mono ? (L + R) * 0.5 : L, inR = mono ? (L + R) * 0.5 : R;
        const wL = byL ? L : this.fx[0].tick(inL), wR = byR ? R : this.fx[1].tick(inR);
        L = L * (1 - bl) + wL * bl; R = R * (1 - bl) + wR * bl;

        // ---- Master volume, headphone level, a gentle limiter and DC filter ----
        L = Math.tanh(L * vol); R = Math.tanh(R * vol);
        const dc = this.dc;
        const yL = L - dc[0] + 0.9995 * dc[1]; dc[0] = L; dc[1] = yL;
        const yR = R - dc[2] + 0.9995 * dc[3]; dc[2] = R; dc[3] = yR;
        outL[s] = yL; outR[s] = yR;
        const pk = Math.max(yL < 0 ? -yL : yL, yR < 0 ? -yR : yR); if (pk > this.outPeak) this.outPeak = pk;
      }

      // ---- The lights, about 30 times a second ----
      if (++this.frames % 12 === 0) {
        this.port.postMessage({ leds: {
          lfoa: o[oLFOA] / 5, lfob: o[oLFOB] / 5, joyx: Math.abs(o[oJX]) / 10, joyy: Math.abs(o[oJY]) / 10,
          step: this.step, seqgate: o[oSGATE] > 0 ? 1 : 0,
          d1: V[0].envOut, d2: V[1].envOut, d3: V[2].envOut, d4: V[3].envOut, d5: V[4].envOut, d6: V[5].envOut,
          sh3: (V[2].sh + 5) / 10, sh6: (V[5].sh + 5) / 10, enva: this.envA.v, envb: this.envB.v,
          pre: Math.min(1, this.meter * 3), efenv: o[oEFENV] / 10, efgate: o[oEFGATE] > 0 ? 1 : 0,
          out: this.outPeak,                          // how loud the sound leaving the synth is (the menu bar's meter)
        } });
        this.meter *= 0.5; this.outPeak = 0;
      }
      return true;
    }
  }
  registerProcessor('solar42f', Solar);
}

// This same file is also loaded as the worklet itself: there, it starts the processor.
if (typeof registerProcessor === 'function') solarWorklet();
// Where this file is (the iPad version keeps it in a subfolder), so it can be loaded again as the worklet.
const SOLAR_ENGINE_URL = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : 'engine.js';

// Start the engine. Returns { ctx, node, setMic }.
async function startSolarEngine(onLeds) {
  const ctx = new AudioContext({ latencyHint: 'interactive' });
  // Load this file as the worklet (works on the website, and on the PC in the app window, which is started with
  // --allow-file-access-from-files); if that's not allowed, from a copy in memory.
  try {
    await ctx.audioWorklet.addModule(new URL(SOLAR_ENGINE_URL, location.href).href);
  } catch (e) {
    const url = URL.createObjectURL(new Blob([`(${solarWorklet.toString()})()`], { type: 'application/javascript' }));
    await ctx.audioWorklet.addModule(url);
  }
  const node = new AudioWorkletNode(ctx, 'solar42f', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] });
  node.connect(ctx.destination);
  node.port.onmessage = e => { if (e.data.leds) onLeds(e.data.leds); };
  let micSource = null;
  async function setMic(on) {
    if (on && !micSource) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      micSource = ctx.createMediaStreamSource(stream);
      micSource.connect(node);
    } else if (!on && micSource) {
      micSource.mediaStream.getTracks().forEach(t => t.stop());
      micSource.disconnect(); micSource = null;
    }
  }
  return { ctx, node, setMic };
}
