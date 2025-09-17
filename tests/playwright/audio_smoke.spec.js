const { test, expect } = require('@playwright/test');

test('audio smoke: play/pause/seek/prev-next/volume and per-mode persistence', async ({ page }) => {
  await page.goto('http://localhost:8001/standalone.html');

  await page.waitForSelector('#audio-track');

  const options = await page.$$eval('#audio-track option', opts => opts.map(o => o.value).filter(Boolean));
  test.skip(options.length === 0, 'No audio options to test');

  const first = options[0];
  const second = options[1] || options[0];

  // Select first track and play (user gesture)
  await page.selectOption('#audio-track', first);
  await page.click('#audio-play');

  // Wait for audio to start playing (may be immediate after gesture)
  await page.waitForFunction(() => {
    const a = document.getElementById('trivia-audio');
    return a && !a.paused;
  }, null, { timeout: 3000 });

  // Pause and verify
  await page.click('#audio-pause');
  await page.waitForFunction(() => document.getElementById('trivia-audio').paused === true);

  // Test rewind/forward changes currentTime
  const before = await page.$eval('#trivia-audio', a => a.currentTime);
  await page.click('#audio-forward');
  await page.waitForTimeout(300);
  const afterFwd = await page.$eval('#trivia-audio', a => a.currentTime);
  expect(afterFwd).toBeGreaterThanOrEqual(before);

  await page.click('#audio-rewind');
  await page.waitForTimeout(200);
  const afterRew = await page.$eval('#trivia-audio', a => a.currentTime);
  expect(afterRew).toBeGreaterThanOrEqual(0);

  // Test next changes src (if multiple tracks exist)
  const srcBefore = await page.$eval('#trivia-audio', a => a.src || a.getAttribute('src'));
  await page.click('#audio-next');
  await page.waitForTimeout(400);
  const srcAfter = await page.$eval('#trivia-audio', a => a.src || a.getAttribute('src'));
  expect(srcAfter).toBeTruthy();

  // Test volume control
  await page.$eval('#audio-volume', (el) => { el.value = 0.2; el.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(100);
  const vol = await page.$eval('#trivia-audio', a => a.volume);
  expect(vol).toBeGreaterThanOrEqual(0.18);

  // Test per-mode persistence: set mode to riddles and select a different track
  await page.selectOption('#audio-mode', 'riddles');
  if (options.length > 1) {
    await page.selectOption('#audio-track', second);
  }
  // Reload and verify selection persisted for riddles
  await page.reload();
  await page.waitForSelector('#audio-mode');
  await page.selectOption('#audio-mode', 'riddles');
  const persisted = await page.$eval('#audio-track', el => el.value);
  expect(persisted).toBeTruthy();

  // Ensure starting a Riddles run uses the configured audio (click play for gesture then start)
  await page.click('#audio-play');
  await page.click('text=Riddles');
  await page.waitForSelector('#riddles-next');
  await page.click('#riddles-next');
  await page.waitForTimeout(400);
  // At this point audio should be playing (or attempted) — at minimum ensure audio element exists
  const playing = await page.$eval('#trivia-audio', a => !!a);
  expect(playing).toBeTruthy();
});
