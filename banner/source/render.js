const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const bleed of [10, 0]) {
    await p.goto('file://' + __dirname + '/banner.html?bleed=' + bleed, { waitUntil: 'networkidle' });
    const info = await p.evaluate(() => window.layout()); console.log('bleed', bleed, info);
    const W = 1800 + 2*bleed, H = 600 + 2*bleed;
    const out = bleed ? '../kirkcaldy-dental-banner-180x60cm-PRINT-with-10mm-bleed.pdf' : '../kirkcaldy-dental-banner-180x60cm-finished-size.pdf';
    await p.pdf({ path: out, width: W + 'mm', height: H + 'mm', printBackground: true, pageRanges: '1' });
    // exact size from the top-left + TrimBox/BleedBox for the printer (shared with the leaflet)
    execFileSync('python3', [__dirname + '/../../leaflet/source/crop.py', out, String(W), String(H), String(bleed)], { stdio: 'inherit' });
  }
  await b.close();
})();
