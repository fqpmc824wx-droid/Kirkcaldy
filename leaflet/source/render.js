// Renders the A5 leaflet to PDF. Usage: node render.js [phone]
// Chromium rounds PDF pages to whole pixels, which left a 0.2–0.3 mm white sliver on the right/bottom edge.
// So each page is rendered a fraction of a mm larger (whole pixels), then cropped back to the exact size
// from the top-left with crop.py, which also sets TrimBox/BleedBox for the printer.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
(async () => {
  const phone = process.argv[2] || '';
  const b = await chromium.launch(); const p = await b.newPage();
  const px = mm => Math.ceil(mm * 96 / 25.4);
  for (const bleed of [3, 0]) {
    await p.goto('file://' + __dirname + '/leaflet.html?bleed=' + bleed + '&phone=' + encodeURIComponent(phone), { waitUntil: 'networkidle' });
    console.log('bleed', bleed, await p.evaluate(() => window.layout()));
    const W = 148 + 2*bleed, H = 210 + 2*bleed;
    await p.addStyleTag({ content: '.page { width:' + px(W) + 'px !important; height:' + px(H) + 'px !important; }' });
    const out = bleed ? '../kirkcaldy-dental-leaflet-A5-PRINT-with-3mm-bleed.pdf' : '../kirkcaldy-dental-leaflet-A5.pdf';
    await p.pdf({ path: out, width: px(W) + 'px', height: px(H) + 'px', printBackground: true });
    execFileSync('python3', [__dirname + '/crop.py', out, String(W), String(H), String(bleed)], { stdio: 'inherit' });
  }
  await b.close();
})();
