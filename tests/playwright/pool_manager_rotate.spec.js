const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8001';

test('pool manager rotate updates last rotation and UI', async ({ page }) => {
  await page.goto(`${TEST_BASE}/index.html`);

  // Ensure pool manager is visible (it is on the home page)
  await page.waitForSelector('#pool-manager');

  // Read previous rotation ts
  const prev = await page.evaluate(() => localStorage.getItem('burbleLastRotation'));

  // Ensure rotate button exists
  await page.waitForSelector('#rotate-now-pools');

  // Click rotate now and confirm dialogs
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.click('#rotate-now-pools');

  // Wait briefly for rotation to complete and localStorage to update
  await page.waitForTimeout(500);

  const after = await page.evaluate(() => localStorage.getItem('burbleLastRotation'));
  expect(after).not.toBeNull();
  if (prev) {
    // new timestamp should be later than previous
    expect(new Date(after).getTime()).toBeGreaterThan(new Date(prev).getTime());
  }

  // Check the UI status element shows 'Rotated' text
  const status = await page.textContent('#rotate-status');
  expect(status).toMatch(/Rotated/);
});
