// Dylan's Split-Flap: the settings. Change these and restart the board.
window.SPLITFLAP = {
  columnsPerScreen: 18,     // characters across each monitor (36 across both): what fits inside the border
  rows: 6,                  // rows of characters
  oneScreen: {              // on one screen (one monitor, or the iPad): [characters across, rows]
    sideways: [18, 7],
    upright: [12, 10],
  },
  secondsPerMessage: 20,    // how long each quote stays. The Morning and Night Screens give each app the whole minute, on
                            // the minute, so 20 means 3 changes in a turn: as it comes up, at :20 and at :40
  border: 81 / 1920,        // the border on the PC, as a share of the screen's width (these monitors are 23.6 inches
                            // across at 1920 pixels, so 81 pixels is an inch)
  borderOneScreen: 0.03,    // on the iPad and iPhone, as a share of the screen's shorter side
  flipMs: 68,               // how often the drum lets a flap go: about 15 flaps a second, like Oat Foundry's
  sound: false,             // the clatter starts muted; the Sound button or M turns it on, on both screens
  volume: 0.8,
};
