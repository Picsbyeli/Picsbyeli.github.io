#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
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

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  console.log('Checking backend and static servers...');
  let backendProc = null;
  let staticProc = null;
  const backendUrl = 'http://localhost:4000/api/leaderboard';
  const staticUrl = 'http://localhost:8000/standalone.html';

  const backendUp = await isListening(backendUrl);
  if (!backendUp) {
    console.log('Starting backend server...');
    backendProc = spawnProcess('node', ['index.js'], { cwd: path.join(repoRoot, 'server') });
  } else {
    console.log('Backend already running; reusing existing instance.');
  }

  const staticUp = await isListening(staticUrl);
  if (!staticUp) {
    console.log('Starting static file server on port 8000...');
    staticProc = spawnProcess('python3', ['-m', 'http.server', '8000'], { cwd: repoRoot });
  } else {
    console.log('Static server already running; reusing existing instance.');
  }

  try {
    await waitForUrl(backendUrl, 12000);
    console.log('Backend responsive. Waiting for static server...');
    await waitForUrl(staticUrl, 12000);
    console.log('Static server responsive. Running Playwright tests...');

  const test = spawn('npx', ['playwright', 'test', 'tests/playwright', '--reporter=list', '--workers=1'], { stdio: 'inherit', shell: true });
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
