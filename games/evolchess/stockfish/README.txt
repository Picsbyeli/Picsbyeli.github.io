Put the Stockfish engine here.

The app loads the engine from:
  /stockfish/stockfish-18-lite-single.js
(set in src/lib/stockfish.js -> ENGINE_URL)

Easiest install (you already have npm):
  cd chess-mentor-arena-online
  npm install stockfish
  cp node_modules/stockfish/src/stockfish-18-lite-single.* public/stockfish/

That copies two files into this folder:
  stockfish-18-lite-single.js     <- the engine (loaded as a Web Worker)
  stockfish-18-lite-single.wasm   <- its "brain"; must stay next to the .js

Or download by hand from:
  https://github.com/nmrugg/stockfish.js/releases
and copy the two *-lite-single.* files into this folder.

Why the "lite single" build?
  - Runs in any browser with NO special server headers.
  - Small (~7 MB) and strong enough for bots + game review.

Want maximum strength instead? Use the full single build
(stockfish-18-single.js / .wasm) and update ENGINE_URL to match. The multi-
threaded builds need the COOP/COEP headers already set in vite.config.js and
firebase.json.

Troubleshooting:
  - Stuck on "Loading Stockfish engine…"? The filename or path is wrong, or the
    .wasm is missing. Open the browser console to see the load error.
