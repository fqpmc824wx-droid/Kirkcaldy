// Renders the 4 Meta ads at 2x (2160 px wide) into ../
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [ad, fmt, out, H] of [['A','feed','ad-A-feed-4x5.png',1350],['A','story','ad-A-stories-9x16.png',1920],
                                    ['B','feed','ad-B-feed-4x5.png',1350],['B','story','ad-B-stories-9x16.png',1920]]) {
    const p = await b.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: 2 });
    await p.goto('file://' + __dirname + `/ad.html?ad=${ad}&fmt=${fmt}`, { waitUntil: 'networkidle' });
    console.log(out, JSON.stringify(await p.evaluate(() => window.layout())));
    await p.screenshot({ path: __dirname + '/../' + out, clip: { x: 0, y: 0, width: 1080, height: H } });
    await p.close();
  }
  await b.close();
})();
