// Dylan's Solar 42F: the starter sounds in the Sounds menu. Each is a whole patch: only what differs from the panel's
// starting position, plus any cables. "play" is the message shown when it's picked (what to do next).
//
// Switch values: the effector's program switches are 1 for program 1 (up), 0.5 for 2, 0 for 3; the sequencer's stages
// switch is 1 for 4 steps (up), 0.5 for 5, 0 for 3. Cartridges: 0 CATHEDRAL, 1 VIBROTREM, 2 MAGIC, 3 FILTER, 4 TIME, 5 VIBE.
window.SOLAR_SOUNDS = [
  {
    name: 'Warm drone chord',
    about: 'Drone voices 1 and 2 held, through the Shimmer reverb',
    play: 'Drone voices <b>1</b> and <b>2</b> are on <b>HOLD</b>. Try their <b>MUTE</b> buttons to change the chord, <b>TUNE</b> each oscillator, and turn <b>VOLT</b>.',
    values: { 'd1.hold': 1, 'd2.hold': 1, 'd2.mute4': 1, 'd1.mod3': 1, 'mix.vol0': 0.7, 'mix.vol1': 0.55,
      'fx.cart': 0, 'fx.progL': 1, 'fx.progR': 1, 'fx.blend': 0.45, 'fx.z': 0.7, 'flt.freqL': 0.68, 'flt.freqR': 0.68 },
  },
  {
    name: 'Growling FM drone',
    about: 'Drone voice 1 with VOLT past halfway, through the filter and distortion',
    play: 'Drone voice <b>1</b> is on <b>HOLD</b> with <b>VOLT</b> turned up, so its oscillators modulate each other. Turn <b>VOLT</b>, the filters\' <b>FREQ</b> and <b>RES</b>, and <b>DIST</b>.',
    values: { 'd1.hold': 1, 'd1.volt': 0.82, 'mix.vol0': 0.75, 'flt.freqL': 0.6, 'flt.resL': 0.55, 'flt.freqR': 0.6, 'flt.resR': 0.55,
      'flt.dist': 0.45, 'flt.gain': 0.35, 'fx.cart': 4, 'fx.progL': 1, 'fx.progR': 1, 'fx.blend': 0.3 },
  },
  {
    name: 'Sirens and birds',
    about: 'Drone voices 3 and 6, their LFOs bending the pitch',
    play: 'Drone voices <b>3</b> and <b>6</b> are on <b>HOLD</b>. Turn their <b>rate</b>, <b>mod</b> and <b>PITCH</b> knobs, and try <b>fm</b>, <b>am</b> and <b>hi/low</b>.',
    values: { 'd3.hold': 1, 'd3.rate': 0.5, 'd3.mod': 0.55, 'd3.pitch': 0.6, 'd6.hold': 1, 'd6.range': 1, 'd6.rate': 0.25, 'd6.mod': 0.3,
      'd6.pitch': 0.78, 'mix.vol2': 0.6, 'mix.vol9': 0.45, 'mix.pan2': 0.3, 'mix.pan9': 0.7,
      'fx.cart': 4, 'fx.progL': 1, 'fx.progR': 1, 'fx.blend': 0.4 },
  },
  {
    name: 'Wind and surf',
    about: 'Drone voice 3 as noise, through a sweeping band-pass filter',
    play: 'Drone voice <b>3</b> is making noise on <b>HOLD</b>, and <b>LFO A</b> sweeps the filters through a patch cable. Turn LFO A\'s <b>rate</b>, the filters\' <b>RES</b>, and the effector\'s <b>BLEND</b>.',
    values: { 'd3.hold': 1, 'd3.noise': 1, 'd3.mod': 1, 'd3.divider': 1, 'd3.fm': 0, 'd3.am': 1, 'd3.rate': 0.12, 'mix.vol2': 0.85,
      'flt.modeL': 1, 'flt.modeR': 1, 'flt.freqL': 0.45, 'flt.freqR': 0.5, 'flt.resL': 0.65, 'flt.resR': 0.65, 'flt.mod': 0.7, 'flt.link': 1,
      'lfoa.rate': 0.35, 'fx.cart': 0, 'fx.progL': 0, 'fx.progR': 0, 'fx.blend': 0.5 },
    cables: [['lfoa.out', 'flt.cv']],
  },
  {
    name: 'Keyboard lead',
    about: 'VCO A and B on the touch keyboard, with a delay',
    play: 'Play the <b>touch keyboard</b>: click the white plates, or press the keys <b>A W S E D F T G Y H U J</b> (<b>Z</b> and <b>X</b> change octave).',
    values: { 'vcoa.morph': 0.4, 'vcob.morph': 0.6, 'vcob.tune': 0.03, 'enva.a': 0.05, 'enva.d': 0.45, 'enva.s': 0.55, 'enva.r': 0.4,
      'envb.a': 0.05, 'envb.d': 0.45, 'envb.s': 0.55, 'envb.r': 0.4, 'mix.vol4': 0.7, 'mix.vol5': 0.5, 'mix.pan4': 0.35, 'mix.pan5': 0.65,
      'flt.freqL': 0.7, 'flt.freqR': 0.7, 'fx.cart': 4, 'fx.progL': 1, 'fx.progR': 1, 'fx.blend': 0.35, 'fx.y': 0.45 },
  },
  {
    name: 'Sequencer melody',
    about: 'The 5-step sequencer playing VCO A',
    play: 'The <b>5-step sequencer</b> plays VCO A through two patch cables. Turn the <b>step</b> knobs to change the tune, <b>pulser</b> for the speed, and flip the <b>gate</b> switches.',
    values: { 'vcoa.morph': 0.6, 'vcoa.tune': 0.0, 'enva.a': 0.03, 'enva.d': 0.32, 'enva.s': 0.15, 'enva.r': 0.3, 'mix.vol4': 0.7,
      'seq.pulser': 0.42, 'seq.stages': 0.5, 'seq.step1': 0.3, 'seq.step2': 0.45, 'seq.step3': 0.2, 'seq.step4': 0.6, 'seq.step5': 0.38,
      'flt.freqL': 0.72, 'flt.freqR': 0.72, 'fx.cart': 2, 'fx.progL': 1, 'fx.progR': 1, 'fx.blend': 0.35, 'fx.z': 0.75 },
    cables: [['seq.cv', 'vcoa.voct'], ['seq.gate', 'enva.gate']],
  },
  {
    name: 'Deep space',
    about: 'Drone voices 4 and 5, slowly moving, in a huge reverb',
    play: 'Drone voices <b>4</b> and <b>5</b> are on <b>HOLD</b>, their oscillators drifting with <b>LFO B</b> (the <b>MOD</b> buttons). Hover over or press the round <b>photo sensors</b> to bend them.',
    values: { 'd4.hold': 1, 'd5.hold': 1, 'd4.mod1': 1, 'd4.mod4': 1, 'd5.mod2': 1, 'd5.mod5': 1, 'd4.volt': 0.35, 'lfob.rate': 0.05,
      'lfob.wave': 0, 'mix.vol7': 0.65, 'mix.vol8': 0.55, 'fx.cart': 0, 'fx.progL': 0, 'fx.progR': 1, 'fx.blend': 0.6, 'fx.z': 0.8 },
  },
];
