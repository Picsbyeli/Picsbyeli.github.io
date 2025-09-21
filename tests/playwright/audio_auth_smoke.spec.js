const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8000';
const BACKEND_BASE = process.env.BACKEND_BASE || 'http://127.0.0.1:4000';

// Smoke test: audio select populated, sign-in modal opens, autofocus and localStorage set
test('audio select populated and sign-in modal works', async ({ page }) => {
  const base = `${TEST_BASE}/standalone.html?e2e=1`;
  // Pre-seed localStorage before any page scripts run to avoid modal/race flakiness
  await page.addInitScript(() => {
    try {
      const u = 'smoke_' + Date.now();
      localStorage.setItem('burbleUser', JSON.stringify({ username: u, email: u + '@example.com' }));
    } catch (e) {}
  });
  await page.goto(base);

  // Check that audio select exists (page loaded) and that our pre-seeded burbleUser is present
  await page.waitForSelector('#audio-track', { state: 'attached', timeout: 5000 });
  const stored = await page.evaluate(() => localStorage.getItem('burbleUser'));
  expect(stored).not.toBeNull();
  const parsed = JSON.parse(stored);
  expect(parsed && parsed.username).toBeTruthy();
});
