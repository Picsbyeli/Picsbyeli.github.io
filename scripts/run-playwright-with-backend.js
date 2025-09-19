#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');

function waitForUrl(url, timeout = 10000, interval = 200) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      const req = http.get(url, res => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('timeout waiting for ' + url));
        setTimeout(check, interval);
      });
      req.setTimeout(2000, () => {
        req.abort();
      });
    })();
  });
}

function spawnProcess(cmd, args, opts = {}) {
  const p = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: false }, opts));
  p.on('error', (err) => console.error(`Failed to start ${cmd}:`, err));
  return p;
}

function isListening(url, timeout = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, res => { res.resume(); resolve(true); });
    req.on('error', () => resolve(false));
    req.setTimeout(timeout, () => { req.abort(); resolve(false); });
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function isPortTaken(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err) => {
        if (err && err.code === 'EADDRINUSE') return resolve(true);
        return resolve(false);
      })
      .once('listening', () => {
        tester.close(() => resolve(false));
      })
      .listen(port, host);
  });
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  console.log('Checking backend and static servers...');
  let backendProc = null;
  let staticProc = null;
  const backendUrl = 'http://127.0.0.1:4000/api/leaderboard';
  const staticUrl = 'http://127.0.0.1:8001/standalone.html';

  const backendUp = await isListening(backendUrl);
  if (!backendUp) {
    console.log('Starting backend server...');
    backendProc = spawnProcess('node', ['index.js'], { cwd: path.join(repoRoot, 'server') });
  } else {
    console.log('Backend already running; reusing existing instance.');
  }

  const staticUp = await isListening(staticUrl);
  if (!staticUp) {
    // brief retry loop in case a background step is concurrently starting the static server
    let becameUp = false;
    for (let i = 0; i < 20; i++) {
      if (await isListening(staticUrl)) { becameUp = true; break; }
      await sleep(200);
    }
    if (becameUp) {
      console.log('Static server came up while waiting; reusing existing instance.');
    } else {
      // final port-level check: if port is already bound, assume another process
      // (background step) has started the server and reuse it instead of spawning.
      const portTaken = await isPortTaken(8001);
      if (portTaken) {
        console.log('Port 8001 is bound by another process; reusing existing static server.');
      } else {
        console.log('Starting static file server on port 8001...');
        staticProc = spawnProcess('python3', ['-m', 'http.server', '8001'], { cwd: repoRoot });
      }
    }
  } else {
    console.log('Static server already running; reusing existing instance.');
  }

    try {
    await waitForUrl(backendUrl, 12000);
    console.log('Backend responsive. Waiting for static server...');

    // Robust static server readiness: prefer TCP connect checks and retry HTTP probes.
    // If the port is already bound, do a short probe/sleep and assume the static server
    // will be responsive shortly — this prevents spurious timeouts when the background
    // step has bound the port but the HTTP response is not immediately available.
    let staticReady = false;
    if (await isPortTaken(8001)) {
      // quick probe then proceed
      try { if (await isListening(staticUrl, 2000)) { staticReady = true; } } catch (e) {}
      if (!staticReady) {
        console.log('Port 8001 bound; short wait for static server to become responsive...');
        await sleep(1000);
        try { if (await isListening(staticUrl, 2000)) { staticReady = true; } } catch (e) {}
      }
      if (!staticReady) {
        console.log('Continuing assuming static server is available (port bound).');
        staticReady = true;
      }
    } else {
      const staticTotalTimeout = 60000; // ms
      const start = Date.now();
      while (Date.now() - start < staticTotalTimeout) {
        // quick HTTP probe
        if (await isListening(staticUrl, 2000)) { staticReady = true; break; }
        // if HTTP probe fails, check if port is bound and retry
        if (await isPortTaken(8001)) {
          // port is bound; retry short HTTP probes for a bit
          try { if (await isListening(staticUrl, 2000)) { staticReady = true; break; } } catch (e) {}
        }
        await sleep(500);
      }
      if (!staticReady) throw new Error('timeout waiting for ' + staticUrl);
    }
    console.log('Static server responsive. Running Playwright tests...');

  // Run Playwright with HTML reporter and request trace/video generation so
  // CI can collect these artifacts reliably. We keep --workers=1 to make
  // artifacts and logs deterministic and avoid parallel interleaving.
  const test = spawn('npx', ['playwright', 'test', 'tests/playwright', '--reporter=html', '--workers=1', '--trace=on', '--video=on'], { stdio: 'inherit', shell: true });
    test.on('exit', (code) => {
      console.log('Playwright exited with code', code);
      // kill child servers we started
      try { if (backendProc) backendProc.kill(); } catch (e) {}
      try { if (staticProc) staticProc.kill(); } catch (e) {}
      process.exit(code);
    });
  } catch (err) {
    console.error('Error waiting for servers:', err.message || err);
    try { if (backendProc) backendProc.kill(); } catch (e) {}
    try { if (staticProc) staticProc.kill(); } catch (e) {}
    process.exit(3);
  }
}

main();
