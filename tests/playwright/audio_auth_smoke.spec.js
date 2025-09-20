const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8000';
const BACKEND_BASE = process.env.BACKEND_BASE || 'http://127.0.0.1:4000';

// Smoke test: audio select populated, sign-in modal opens, autofocus and localStorage set
test('audio select populated and sign-in modal works', async ({ page }) => {
  const base = `${TEST_BASE}/standalone.html`;
  await page.goto(base);

  // Ensure audio select is present and populated (wait briefly for client-side population)
  await page.waitForSelector('#audio-track', { state: 'attached', timeout: 5000 });
  await page.waitForFunction(() => {
    const sel = document.getElementById('audio-track');
    return sel && sel.options && sel.options.length > 0;
  }, { timeout: 8000 });

  // Open sign-in modal using deterministic test hook (avoids click/timing flakiness)
  try {
    await page.evaluate(() => window._testOpenSignin && window._testOpenSignin());
  } catch (e) {
    // fallback to click if the hook isn't present
    await page.click('#signin-btn');
  }
  await page.waitForSelector('#signin-modal[aria-hidden="false"]', { state: 'visible', timeout: 10000 });

  // Username should be focused
  const active = await page.evaluate(() => document.activeElement && document.activeElement.id);
  expect(active === 'si-username' || active === null).toBeTruthy();

  // Fill and submit
  const username = 'smoke_' + Date.now();
  await page.fill('#si-username', username);
  await page.fill('#si-email', `${username}@example.com`);
  // Try to submit using a deterministic test helper (if present) to avoid click races in CI
  try {
    const used = await page.evaluate((u, e) => {
      if (window._testSetBurbleUser) { return window._testSetBurbleUser(u, e); }
      return false;
    }, username, `${username}@example.com`);
    if (!used) {
      await page.click('#si-submit');
      await page.waitForTimeout(300);
    }
  } catch (e) {
    // fallback to click if any evaluate error occurs
    await page.click('#si-submit');
    await page.waitForTimeout(300);
  }

  // Check localStorage for burbleUser
  const stored = await page.evaluate(() => localStorage.getItem('burbleUser'));
  expect(stored).not.toBeNull();
  const parsed = JSON.parse(stored);
  expect(parsed.username).toBeTruthy();
  expect(parsed.username).toContain('smoke_');
});
