const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Seed an admin user in localStorage before navigation so the page sees it
  await page.addInitScript(() => {
    try { localStorage.setItem('burbleUser', JSON.stringify({ username: 'eli', email: 'eli@example.com', isAdmin: true })); } catch (e) {}
  });
  await page.goto('http://127.0.0.1:8002/index.html');
  const signin = await page.$('#signin-btn');
  console.log('signin-btn present:', !!signin);
  const pm = await page.$('#pool-manager');
  if (!pm) { console.log('pool-manager: not found'); await browser.close(); return; }
  const disp = await page.$eval('#pool-manager', el => window.getComputedStyle(el).display);
  console.log('pool-manager display:', disp);
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
