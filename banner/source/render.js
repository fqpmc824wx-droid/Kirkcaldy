const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const bleed of [10, 0]) {
    await p.goto('file://' + __dirname + '/banner.html?bleed=' + bleed, { waitUntil: 'networkidle' });
    const info = await p.evaluate(() => window.layout()); console.log('bleed', bleed, info);
    const W = 1600 + 2*bleed, H = 600 + 2*bleed;
    const out = bleed ? '../kirkcaldy-dental-banner-160x60cm-PRINT-with-10mm-bleed.pdf' : '../kirkcaldy-dental-banner-160x60cm-finished-size.pdf';
    await p.pdf({ path: out, width: W + 'mm', height: H + 'mm', printBackground: true, pageRanges: '1' });
  }
  await b.close();
})();
