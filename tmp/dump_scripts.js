const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { window.__E2E__ = true; } catch(e){} });
  const url = process.env.TEST_BASE || 'http://127.0.0.1:8003/standalone.html';
  await page.goto(url);
  const result = await page.evaluate(() => {
    const out = [];
    const scripts = Array.from(document.getElementsByTagName('script'));
    for (let i=0;i<scripts.length;i++) {
      const s = scripts[i];
      out.push({ idx: i, src: s.src || null, type: s.type || null, innerStart: (s.textContent||'').slice(0,200), containsDraw: (s.textContent||'').indexOf('function drawFromPool')>=0 });
    }
    return out;
  });
  console.log('found', result.length, 'script tags');
  result.forEach(r=> console.log(r.idx, r.src, r.type, 'containsDraw?', r.containsDraw, '\n', r.innerStart.slice(0,200).replace(/\n/g,'\\n')));
  await browser.close();
})();
