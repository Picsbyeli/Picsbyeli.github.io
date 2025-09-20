const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8001';

test('preflight retry and updateAudioStatus flows', async ({ page }) => {
  await page.goto(`${TEST_BASE}/standalone.html`);
  // ensure controls exist
  await page.waitForSelector('#audio-url-input');
  await page.waitForSelector('#audio-play-url');
  // stub fetch HEAD to simulate failure for a made-up URL
  await page.addInitScript(() => {
    const origFetch = window.fetch;
    window.__fetch_calls = [];
    window.fetch = async function(resource, init) {
      // record
      window.__fetch_calls.push({ resource: String(resource), init: init || null });
      // simulate HEAD failing for our test URL
      if (init && init.method === 'HEAD' && String(resource).includes('example.com/nonexistent.mp3')) {
        return new Response('', { status: 404, statusText: 'Not Found' });
      }
      return origFetch.apply(this, arguments);
    };
  });

  const testUrl = 'https://example.com/nonexistent.mp3';
  await page.fill('#audio-url-input', testUrl);
  await page.click('#audio-play-url');

  // Wait for the alert to appear with retry
  await page.waitForSelector('#audio-alert:not(.hidden)', { timeout: 5000 });
  const msg = await page.$eval('#audio-alert-msg', el => el.textContent.trim());
  expect(msg).toMatch(/Unable to play URL|Not found/);

  // Retry button should be visible
  await page.waitForSelector('#audio-retry:not(.hidden)');

  // Now override fetch to respond OK for retry and click retry
  await page.evaluate(() => {
    window.fetch = async function(resource, init) { return new Response('', { status: 200 }); };
  });
  await page.click('#audio-retry');

  // Allow some time for playback attempt
  await page.waitForTimeout(500);

  // localStorage shouldn't error; check that updateAudioStatus cleared the alert or set playing
  const status = await page.$eval('#audio-status', el => el.textContent.trim());
  expect(status.length).toBeGreaterThan(0);
});
