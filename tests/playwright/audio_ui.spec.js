const { test, expect } = require('@playwright/test');

test('audio UI updates audio src when selecting a track', async ({ page }) => {
  await page.goto('http://localhost:8001/standalone.html');

  // Wait for audio UI to appear
  await page.waitForSelector('#audio-track');

  // Select the first non-empty option if available
  const options = await page.$$eval('#audio-track option', opts => opts.map(o => o.value).filter(v => v));
  if (options.length === 0) {
    test.skip();
    return;
  }
  const first = options[0];

  // Select via the UI and click play (user gesture)
  await page.selectOption('#audio-track', first);
  await page.click('#audio-play');

  // Give the audio element a moment to update
  await page.waitForTimeout(300);

  const src = await page.$eval('#trivia-audio', a => a.src || a.getAttribute('src'));
  expect(src).toBeTruthy();
});
