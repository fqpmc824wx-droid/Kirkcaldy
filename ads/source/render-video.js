// Renders 8 s, 30 fps MP4 videos of the ads (feed 4:5 and Stories/Reels 9:16) via frame capture + ffmpeg
const { chromium } = require('playwright'); const { execFileSync } = require('child_process'); const fs=require('fs');
const FPS=30, DUR=8;
(async () => { const b = await chromium.launch();
  const ONLY=process.env.ONLY; for (const [ad,fmt,out,H] of [['A','story','ad-A-video-9x16.mp4',1920],['B','story','ad-B-video-9x16.mp4',1920],
                                 ['A','feed','ad-A-video-4x5.mp4',1350],['B','feed','ad-B-video-4x5.mp4',1350]]) {
    if(ONLY && fmt!==ONLY) continue;
    const dir=`/tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/frames_${ad}_${fmt}`; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
    const p = await b.newPage({ viewport:{width:1080,height:H}, deviceScaleFactor:1 });
    await p.goto('file://'+__dirname+`/ad.html?ad=${ad}&fmt=${fmt}`,{waitUntil:'networkidle'});
    await p.evaluate(async()=>{await window.layout(); window.prepAnim();});
    for (let i=0;i<FPS*DUR;i++){ await p.evaluate(t=>window.setTime(t), i/FPS);
      await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`}); }
    await p.close();
    execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/f%04d.png`,'-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-preset','slow','-movflags','+faststart',__dirname+'/../'+out]);
    fs.rmSync(dir,{recursive:true,force:true}); console.log('wrote',out);
  }
  await b.close(); })();
