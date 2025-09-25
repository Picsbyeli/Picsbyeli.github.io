const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'http://127.0.0.1:8003/standalone.html';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const html = await page.content();
  const idx = html.indexOf('function drawFromPool');
  console.log('indexOf drawFromPool in page content:', idx);
  console.log('snippet around drawFromPool:');
  if (idx >= 0) console.log(html.slice(Math.max(0, idx-200), idx+400));
  await browser.close();
})();
