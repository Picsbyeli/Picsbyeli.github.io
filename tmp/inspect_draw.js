const { chromium } = require('playwright');

(async ()=>{
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.addInitScript(() => {
    try { window.__E2E__ = true; } catch (e) {}
    try { localStorage.setItem('burbleUser', JSON.stringify({ username: 'eli', email: 'eli@example.com', isAdmin: true })); } catch (e) {}
  });

  page.on('console', msg => console.log('PAGE LOG>', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR>', err));

  const url = process.env.TEST_BASE || 'http://127.0.0.1:8003/standalone.html';
  console.log('navigating to', url);
  await page.goto(url);

  for (let i=0;i<30;i++) {
    const status = await page.evaluate(() => {
      return {
        e2e: !!window.__E2E__,
        drawType: (typeof window.drawFromPool),
        hasGlobalDraw: !!window.drawFromPool,
        hasLocalDraw: (typeof drawFromPool),
        burbleUser: (()=>{ try { return JSON.parse(localStorage.getItem('burbleUser')||'null'); } catch(e){ return null; } })()
      };
    });
    console.log('tick', i, status);
    if (status.hasGlobalDraw || status.drawType === 'function' || status.hasLocalDraw === 'function') break;
    await new Promise(r => setTimeout(r, 500));
  }

  await browser.close();
})();
