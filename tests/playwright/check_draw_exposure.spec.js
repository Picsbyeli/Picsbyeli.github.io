const { test, expect } = require('@playwright/test');

test('drawFromPool is exposed for E2E', async ({ page }) => {
  await page.addInitScript(() => {
    try { window.__E2E__ = true; } catch (e) {}
    try { localStorage.setItem('burbleUser', JSON.stringify({ username: 'eli', email: 'eli@example.com', isAdmin: true })); } catch (e) {}
  });

  const base = process.env.TEST_BASE || 'http://127.0.0.1:8003/standalone.html';
  page.on('console', m => console.log('PAGE LOG:', m.type(), m.text()));
  page.on('pageerror', e => console.log('PAGE ERROR:', e && e.stack ? e.stack : String(e)));

  await page.goto(base);

  // Wait up to 5s for the app to expose the helper via the early poll we added
  const ok = await page.waitForFunction(() => typeof window.drawFromPool === 'function', { timeout: 5000 }).catch(() => false);
  expect(ok).toBeTruthy();
});
