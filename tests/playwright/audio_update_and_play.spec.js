const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8001';

test('updateAudioStatus shows alert and retry triggers playUrlOrYoutube', async ({ page }) => {
  await page.goto(`${TEST_BASE}/standalone.html`);
  // ensure page loaded and helper exists
  await page.waitForSelector('#audio-url-input');

  // Trigger an error alert with a retry candidate
  await page.evaluate(() => {
    try {
      window.updateAudioStatus && window.updateAudioStatus('Simulated failure', { error: true, retryCandidate: 'https://example.com/good.mp3', persist: true });
    } catch (e) { /* ignore */ }
  });

  // Alert should appear and retry button visible
  await page.waitForSelector('#audio-alert:not(.hidden)', { timeout: 3000 });
  await page.waitForSelector('#audio-retry:not(.hidden)', { timeout: 3000 });

  // Stub playUrlOrYoutube to record calls and succeed
  await page.evaluate(() => {
    window.__play_calls = [];
    window.playUrlOrYoutube = async function(u) { window.__play_calls.push(u); return true; };
  });

  // Click retry and wait a bit for async handling
  await page.click('#audio-retry');
  await page.waitForTimeout(300);

  // Alert should be hidden after successful retry
  const hidden = await page.$eval('#audio-alert', el => el.classList.contains('hidden') || el.getAttribute('aria-hidden') === 'true');
  expect(hidden).toBe(true);

  // Ensure playUrlOrYoutube was called with expected candidate
  const calls = await page.evaluate(() => window.__play_calls || []);
  expect(calls.length).toBeGreaterThan(0);
  expect(calls[0]).toBe('https://example.com/good.mp3');
});
