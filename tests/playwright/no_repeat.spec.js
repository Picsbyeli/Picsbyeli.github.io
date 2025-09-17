const { test, expect } = require('@playwright/test');

// This test assumes you have a local static server running at http://localhost:8000
// It starts two consecutive trivia runs and ensures the question sets do not overlap.

test('trivia no-repeat across two consecutive runs', async ({ page }) => {
  await page.goto('http://localhost:8000/index.html');

  // Navigate to Trivia page
  await page.click('text=Trivia');

  // Ensure difficulty 'easy' is selected (or select it)
  await page.click('#trivia-page .selector-btn[data-difficulty="easy"]');

  // Reduce totalQuestions for a faster test run
  await page.evaluate(() => { if (window.gameState && window.gameState.trivia) window.gameState.trivia.totalQuestions = 3; });

  // Wait until start button is enabled and start first run
  await page.waitForFunction(() => {
    const el = document.getElementById('trivia-start');
    return el && !el.disabled;
  });
  await page.click('#trivia-start');

  // Collect the questions for the run
  const firstRunQuestions = [];
  for (let i = 0; i < 5; i++) { // capture up to 5 or break when quiz ends
    const qText = await page.textContent('#trivia-question-text');
    firstRunQuestions.push(qText.trim());
    // click Next if available, otherwise break
    const nextEnabled = await page.$eval('#trivia-next', el => !el.disabled);
    if (nextEnabled) {
      // submit a dummy answer if submit is enabled
      const submitEnabled = await page.$eval('#trivia-submit', el => !el.disabled);
      if (submitEnabled) {
        // pick first option
        await page.click('#trivia-options .trivia-option');
        await page.click('#trivia-submit');
      }
      await page.click('#trivia-next');
      await page.waitForTimeout(200);
    } else {
      break;
    }
  }

  // Ensure the run is finished by navigating away/reloading (pools persist in localStorage)
  await page.reload();
  await page.goto('http://localhost:8000/index.html');
  await page.click('text=Trivia');
  // Restore test-friendly small totalQuestions
  await page.evaluate(() => { if (window.gameState && window.gameState.trivia) window.gameState.trivia.totalQuestions = 3; });
  // Wait for start to be enabled and start second run
  await page.waitForFunction(() => {
    const el = document.getElementById('trivia-start');
    return el && !el.disabled;
  });
  await page.click('#trivia-start');

  const secondRunQuestions = [];
  for (let i = 0; i < 5; i++) {
    const qText = await page.textContent('#trivia-question-text');
    secondRunQuestions.push(qText.trim());
    const nextEnabled = await page.$eval('#trivia-next', el => !el.disabled);
    if (nextEnabled) {
      const submitEnabled = await page.$eval('#trivia-submit', el => !el.disabled);
      if (submitEnabled) {
        await page.click('#trivia-options .trivia-option');
        await page.click('#trivia-submit');
      }
      await page.click('#trivia-next');
      await page.waitForTimeout(200);
    } else {
      break;
    }
  }

  // Assert no overlap between firstRunQuestions and secondRunQuestions
  const overlap = firstRunQuestions.filter(q => secondRunQuestions.includes(q));
  expect(overlap.length).toBe(0);
});
