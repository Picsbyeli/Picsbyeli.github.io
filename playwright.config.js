const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 0,
    navigationTimeout: 30000,
  },
  outputDir: 'test-results',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
};
