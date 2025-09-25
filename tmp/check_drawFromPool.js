const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', m => console.log('PAGE LOG:', m.type(), m.text()));
  page.on('pageerror', e => console.log('PAGE ERROR:', e && e.stack ? e.stack : String(e)));
  const url = 'http://127.0.0.1:8003/standalone.html';
  console.log('navigating to', url);
  await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  const type = await page.evaluate(() => { try { return typeof window.drawFromPool; } catch (e) { return 'err:' + String(e); } });
  console.log('typeof drawFromPool:', type);
  const hasTrivia = await page.evaluate(() => { try { return !!(window.triviaQuestions && Object.keys(window.triviaQuestions||{}).length > 0); } catch (e) { return false; } });
  console.log('has triviaQuestions:', hasTrivia);
  // Try to call drawFromPool lightly
  const sample = await page.evaluate(() => {
    try {
      if (typeof drawFromPool !== 'function') return { ok: false, reason: 'no-func' };
      const all = (window.triviaQuestions && triviaQuestions['medium']) ? triviaQuestions['medium'] : [];
      const drawn = drawFromPool('trivia', 'medium', all, Math.min(5, all.length));
      return { ok: true, len: Array.isArray(drawn) ? drawn.length : 0 };
    } catch (e) { return { ok: false, err: String(e) }; }
  });
  console.log('sample draw result:', sample);
  await browser.close();
})();
