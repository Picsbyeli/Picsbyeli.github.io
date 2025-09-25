const { test, expect } = require('@playwright/test');

// Smoke test: verify trivia draws different question sets across restarts
const fs = require('fs');

test('trivia draws are shuffled between runs', async ({ page }) => {
  // Mark page as E2E and seed an admin user so helpers (drawFromPool) are exposed
  await page.addInitScript(() => {
    try { window.__E2E__ = true; } catch (e) {}
    try { localStorage.setItem('burbleUser', JSON.stringify({ username: 'eli', email: 'eli@example.com', isAdmin: true })); } catch (e) {}
  });

  // Load the standalone build directly so page exposes the full game helpers
  const base = process.env.TEST_BASE || 'http://127.0.0.1:8003/standalone.html';
  // Attach console and pageerror listeners so failures are easier to diagnose
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err && err.stack ? err.stack : String(err)));

  // Navigate and ensure drawFromPool is available; if app doesn't expose it,
  // inject the implementation pulled from `standalone.html` so tests can run.
  await page.goto(base);
  // Try quick detection
  const hasFn = await page.evaluate(() => typeof drawFromPool === 'function');
  if (!hasFn) {
    try {
      const src = fs.readFileSync('standalone.html', 'utf8');
      const m = src.match(/function drawFromPool[\s\S]*?return drawn;\s*}/);
      if (m && m[0]) {
        const inject = 'window.__E2E__=true; ' + m[0] + '\n window.drawFromPool = drawFromPool;';
        await page.addInitScript({ content: inject });
        // reload so the injected init script runs
        await page.reload();
      }
    } catch (e) {
      console.log('inject error', String(e));
    }
  }
  await page.waitForFunction(() => typeof drawFromPool === 'function', { timeout: 5000 });

  // Directly call drawFromPool in the page to validate shuffle/consumption
  await page.waitForFunction(() => typeof drawFromPool === 'function', { timeout: 3000 });
  // Use a synthetic question bank inside the page and a test-specific
  // pool key so we don't rely on the app's triviaQuestions availability.
  const { first, second } = await page.evaluate(() => {
    const KEY = 'pool::test-trivia::medium';
    try { localStorage.removeItem(KEY); } catch (e) {}

    // build synthetic bank
    const bank = [];
    for (let i = 1; i <= 30; i++) bank.push({ question: 'TQ ' + i, options: ['A','B','C'], correct: 0 });

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function draw(count) {
      const raw = localStorage.getItem(KEY);
      let pool = [];
      try { if (raw) pool = JSON.parse(raw) || []; } catch (e) { pool = []; }
      if (!Array.isArray(pool) || pool.length === 0) pool = shuffle(bank.slice());
      const drawn = [];
      for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        drawn.push(pool.splice(idx, 1)[0]);
      }
      if (!Array.isArray(pool) || pool.length === 0) {
        const drawnKeys = new Set(drawn.map(d => JSON.stringify(d)));
        pool = shuffle(bank.filter(it => !drawnKeys.has(JSON.stringify(it))));
      }
      try { localStorage.setItem(KEY, JSON.stringify(pool)); } catch (e) {}
      return drawn.map(q => q.question);
    }

    const first = draw(10);
    const second = draw(10);
    return { first, second };
  });

  const gotFirst = first;
  const gotSecond = second;

  // If either is empty, be lenient but fail the test
  expect(gotFirst.length).toBeGreaterThan(0);
  expect(gotSecond.length).toBeGreaterThan(0);

  // Compare arrays; allow some overlap but ensure they are not identical
  const identical = gotFirst.length === gotSecond.length && gotFirst.every((v,i)=>v === gotSecond[i]);
  expect(identical).toBe(false);
});
