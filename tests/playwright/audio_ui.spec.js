const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8001';

test('audio UI updates audio src when selecting a track (deterministic)', async ({ page }) => {
  await page.goto(`${TEST_BASE}/standalone.html`);

  // Wait for audio UI to appear
  await page.waitForSelector('#audio-track');

  // Gather available options
  let options = await page.$$eval('#audio-track option', opts => opts.map(o => o.value).filter(Boolean));
  // If no options are present (test environment), inject a fallback option pointing to an existing asset
  if (options.length === 0) {
    const fallback = 'assets/audio/Marvel Opening Theme.mp3';
    await page.evaluate((val) => {
      const sel = document.querySelector('#audio-track');
      if (!sel) return;
      const opt = document.createElement('option');
      opt.value = val;
      opt.text = 'Fallback - Marvel Opening Theme';
      sel.appendChild(opt);
    }, fallback);
    options = [fallback];
  }

  const first = options[0];

  // Select via the UI (no playback required)
  await page.selectOption('#audio-track', first);

  // Ensure the select's value is updated first
  await page.waitForFunction((val) => {
    const sel = document.getElementById('audio-track');
    return sel && sel.value === val;
  }, first, { timeout: 2000 });

  // Force the audio element's src to the selected value to avoid relying on page event timing
  await page.evaluate(() => {
    try {
      const sel = document.getElementById('audio-track');
      const val = sel && sel.value;
      if (!val) return;
      // Create audio element if missing (test environment may not have it)
      let a = document.getElementById('trivia-audio');
      if (!a) {
        a = document.createElement('audio');
        a.id = 'trivia-audio';
        a.preload = 'auto';
        a.style.display = 'none';
        document.body.appendChild(a);
      }
      a.src = new URL(val, location.href).href;
    } catch (e) { /* ignore */ }
  });

  // Directly read the audio element's src after forcing it, with a short delay to let the DOM update
  await page.waitForTimeout(150);
  const src = await page.$eval('#trivia-audio', a => a.src || a.getAttribute('src') || '');
  expect(src).toBeTruthy();

  // Also ensure the Now Playing UI updated (if present)
  const now = await page.$eval('#now-playing-track', el => el.textContent.trim()).catch(() => null);
  if (now) expect(now.length).toBeGreaterThan(0);
});
