const { test, expect } = require('@playwright/test');

// Simple test to exercise the audio alert retry/dismiss UI
test('audio alert retry and dismiss', async ({ page }) => {
  // Serve the static site via file:// - Playwright supports loading file URLs
  const path = require('path');
  const fs = require('fs');
  const html = 'file://' + path.resolve(__dirname, '..', '..', 'standalone.html') + '?e2e=1';
  await page.goto(html);

  // Ensure audio track select is populated
  await page.waitForSelector('#audio-track');

  // Trigger updateAudioStatus via page.evaluate to show an error with retryCandidate
  await page.evaluate(() => {
    if (typeof updateAudioStatus === 'function') {
      updateAudioStatus('Test error - cannot play', { error: true, persist: true, retryCandidate: 'assets/audio/Marvel%20Opening%20Theme.mp3' });
    }
  });

  // Audio alert should be visible
  const alert = await page.waitForSelector('#audio-alert:not(.hidden)');
  expect(await alert.isVisible()).toBeTruthy();

  // Retry button should be visible (but may be hidden if not set)
  const retry = await page.$('#audio-retry');
  expect(retry).toBeTruthy();
  // Click retry - this will call playUrlOrYoutube. We stub the function to avoid network.
  await page.evaluate(() => {
    window._playStub = window.playUrlOrYoutube;
    window.playUrlOrYoutube = async function(url) { window._lastPlayed = url; return false; };
  });

  await retry.click();
  // After clicking retry, the alert should remain (since stub returns false)
  expect(await page.$eval('#audio-alert', el => el.classList.contains('hidden'))).toBe(false);

  // Now click dismiss
  const dismiss = await page.$('#audio-dismiss');
  expect(dismiss).toBeTruthy();
  await dismiss.click();

  // Alert should be hidden
  await page.waitForTimeout(100); // small wait for UI
  expect(await page.$eval('#audio-alert', el => el.classList.contains('hidden'))).toBe(true);

  // restore stub
  await page.evaluate(() => { if (window._playStub) window.playUrlOrYoutube = window._playStub; delete window._playStub; });
});
