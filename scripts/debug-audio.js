const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  const url = 'http://127.0.0.1:8000/standalone.html';
  console.log('navigating to', url);
  await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(1000);
  const hasSel = await page.evaluate(() => !!document.getElementById('audio-track'));
  console.log('has #audio-track?', hasSel);
  const count = await page.evaluate(() => {
    const s = document.getElementById('audio-track');
    return s ? s.options.length : -1;
  });
  console.log('#audio-track option count =', count);
  const inner = await page.evaluate(() => {
    const s = document.getElementById('audio-track');
    return s ? Array.from(s.options).map(o=>o.text).slice(0,10) : null;
  });
  console.log('options sample:', inner);
  const hasPopulate = await page.evaluate(() => !!window.populateAudioSelect);
  console.log('window.populateAudioSelect exists?', hasPopulate);
  const dt = await page.evaluate(() => (window.defaultTracks && window.defaultTracks.length) || 0);
  console.log('window.defaultTracks length =', dt);
  // Inspect script tags to find our IIFE
  const scriptsReport = await page.evaluate(() => {
    return Array.from(document.scripts).map(s => ({len: s.innerText.length, has: s.innerText.indexOf('enhanceAudioAndAuth')>-1}));
  });
  console.log('scripts report (len,hasEnhance):', scriptsReport.slice(0,10));
  const foundText = await page.evaluate(() => {
    for (const s of document.scripts) { if (s.innerText && s.innerText.indexOf('enhanceAudioAndAuth')>-1) return s.innerText.slice(0,800); }
    return null;
  });
  console.log('found snippet:', foundText ? foundText.slice(0,800) : '--- not found ---');
  // Try opening the sign-in modal by clicking the button and report its state
  try {
  await page.click('#leaderboard-btn');
    await page.waitForTimeout(200);
    const modalState = await page.evaluate(() => {
      const m = document.getElementById('signin-modal');
      if (!m) return null;
      return { className: m.className, aria: m.getAttribute('aria-hidden'), styleDisplay: m.style.display || null, focusedId: (document.activeElement && document.activeElement.id) || null };
    });
    console.log('modal state after click:', modalState);
  } catch (e) {
    console.log('modal click test failed:', String(e));
  }
  // Try filling and submitting the modal form
  try {
    const username = 'dbg_' + Date.now();
    await page.fill('#si-username', username);
    await page.fill('#si-email', `${username}@example.com`);
    await page.fill('#si-password', 'secret');
    await page.click('#si-submit');
    await page.waitForTimeout(200);
    const stored = await page.evaluate(() => localStorage.getItem('burbleUser'));
    console.log('localStorage.burbleUser after submit:', stored);
  } catch (e) {
    console.log('submit test failed:', String(e));
  }
  // Dump modal innerHTML for inspection
  try {
    const modalHtml = await page.evaluate(() => {
      const m = document.getElementById('signin-modal'); if (!m) return null; return m.innerHTML.slice(0,2000);
    });
    console.log('modal innerHTML (truncated):', modalHtml ? modalHtml.replace(/\n/g,' ') : '---null---');
  } catch (e) { console.log('failed to dump modal HTML:', String(e)); }
  // Try submitting via page.evaluate (set inputs and click within page context)
  try {
    const result = await page.evaluate(() => {
      try {
        const u = 'eval_' + Date.now();
        const su = document.getElementById('si-username'); if (su) su.value = u;
        const se = document.getElementById('si-email'); if (se) se.value = u + '@example.com';
        const sp = document.getElementById('si-password'); if (sp) sp.value = 'x';
        const btn = document.getElementById('si-submit'); if (btn) btn.click();
        return localStorage.getItem('burbleUser');
      } catch (e) { return 'eval-error:' + String(e); }
    });
    console.log('localStorage via evaluate click:', result);
  } catch (e) { console.log('evaluate-click failed:', String(e)); }
  // Try calling the exposed helper directly
  try {
    const ok = await page.evaluate(() => {
      try { return typeof window.saveBurbleUser === 'function' && window.saveBurbleUser('direct_dbg', 'direct@example.com'); } catch (e) { return 'err:' + String(e); }
    });
    console.log('window.saveBurbleUser result:', ok);
    const storedNow = await page.evaluate(() => localStorage.getItem('burbleUser'));
    console.log('localStorage.burbleUser after direct helper:', storedNow);
  } catch (e) { console.log('direct helper test failed:', String(e)); }
  // More diagnostics: source and basic localStorage test
  try {
    const diag = await page.evaluate(() => {
      const info = { hasFunc: !!window.saveBurbleUser, fnStr: null, lsTest: null, origin: location.origin };
      try { info.fnStr = window.saveBurbleUser ? window.saveBurbleUser.toString().slice(0,500) : null; } catch (e) { info.fnStr = 'toString-err:' + String(e); }
      try { localStorage.setItem('__ls_diag', '1'); info.lsTest = localStorage.getItem('__ls_diag'); localStorage.removeItem('__ls_diag'); } catch (e) { info.lsTest = 'ls-err:' + String(e); }
      return info;
    });
    console.log('diagnostics:', diag);
  } catch (e) { console.log('diag failed:', String(e)); }
  await browser.close();
})();
