// Dylan's Split-Flap: the settings. Change these and restart the board.
window.SPLITFLAP = {
  columnsPerScreen: 16,     // characters across each monitor (32 across both)
  rows: 6,                  // rows of characters
  oneScreen: {              // on one screen (one monitor, or the iPad): [characters across, rows]
    sideways: [18, 7],
    upright: [12, 10],
  },
  secondsPerMessage: 60,    // how long each quote stays before the next one flips in
  flipMs: 68,               // how often the drum lets a flap go: about 15 flaps a second, like Oat Foundry's
  sound: true,              // the clatter (M switches it on and off while the board is showing)
  volume: 0.8,
};
