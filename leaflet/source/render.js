// Renders the A5 leaflet to PDF. Usage: node render.js [phone]
const { chromium } = require('playwright');
(async () => {
  const phone = process.argv[2] || '';
  const b = await chromium.launch(); const p = await b.newPage();
  for (const bleed of [3, 0]) {
    await p.goto('file://' + __dirname + '/leaflet.html?bleed=' + bleed + '&phone=' + encodeURIComponent(phone), { waitUntil: 'networkidle' });
    console.log('bleed', bleed, await p.evaluate(() => window.layout()));
    const out = bleed ? '../kirkcaldy-dental-leaflet-A5-PRINT-with-3mm-bleed.pdf' : '../kirkcaldy-dental-leaflet-A5.pdf';
    await p.pdf({ path: out, width: (148 + 2*bleed) + 'mm', height: (210 + 2*bleed) + 'mm', printBackground: true });
  }
  await b.close();
})();
