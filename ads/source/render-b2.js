// Ad B alternative wording (families headline)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const [fmt,out,H] of [['feed','ad-B2-families-feed-4x5.png',1350],['story','ad-B2-families-stories-9x16.png',1920]]) {
    const p = await b.newPage({ viewport:{width:1080,height:H}, deviceScaleFactor:2 });
    await p.goto('file://'+__dirname+`/ad.html?ad=B2&fmt=${fmt}`,{waitUntil:'networkidle'});
    console.log(out, JSON.stringify(await p.evaluate(()=>window.layout())));
    await p.screenshot({ path: __dirname+'/../'+out, clip:{x:0,y:0,width:1080,height:H} }); await p.close(); }
  await b.close(); })();
