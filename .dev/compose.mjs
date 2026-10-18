// 使い方: node compose.mjs <url> <outDir> <title> <tagline> <bg> <ink> <accent> [patchFrom patchTo] [actionsJSON]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const [url, outDir, title, tagline, bg, ink, accent, patchFrom, patchTo, actions = '[]', focus = '0.5'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader'] });
const p = await b.newPage({ viewport: { width: 400, height: 760 }, deviceScaleFactor: +(process.env.DPR || 2) });
p.on('pageerror', e => console.log('ERR', e.message));
if (patchFrom) await p.route(url, async r => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()).split(patchFrom).join(patchTo) }); });
await p.goto(url); await p.waitForTimeout(900);
for (const a of JSON.parse(actions)) {
  if (a.click) await p.mouse.click(a.click[0], a.click[1]);
  if (a.down) { await p.mouse.move(a.down[0], a.down[1]); await p.mouse.down(); }
  if (a.move) await p.mouse.move(a.move[0], a.move[1], { steps: a.move[2] || 1 });
  if (a.up) await p.mouse.up();
  if (a.key) await p.keyboard.press(a.key);
  if (a.eval) await p.evaluate(a.eval);
  if (a.wait) await p.waitForTimeout(a.wait);
}
const phone = process.env.PHONE ? fs.readFileSync(process.env.PHONE) : await p.screenshot({ type: 'png' });
fs.writeFileSync(outDir + '/thumb-src.png', phone);
// サムネイル(4:3)は画面の中央部分を切り抜き
const t = await b.newPage({ viewport: { width: 640, height: 480 } });
await t.setContent(`<body style="margin:0;background:${bg}"><img src="data:image/png;base64,${phone.toString('base64')}" style="width:640px;position:absolute;left:0;top:${240 - 1216 * +focus}px"></body>`);
await t.waitForTimeout(200); await t.screenshot({ path: outDir + '/thumb.png' });
const o = await b.newPage({ viewport: { width: 1200, height: 630 } });
await o.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Zen+Kaku+Gothic+New:wght@700&display=swap"></head>
<body style="margin:0;width:1200px;height:630px;background:${bg};overflow:hidden;position:relative;font-family:'Zen Kaku Gothic New',sans-serif">
<div style="position:absolute;left:72px;top:50%;transform:translateY(-50%);width:640px;color:${ink}">
<div style="font-family:'Dela Gothic One',sans-serif;font-size:${Math.min(112, Math.floor(630 / title.length))}px;white-space:nowrap;line-height:1.08">${title}</div>
<div style="margin-top:26px;font-size:30px;line-height:1.5">${tagline}</div>
<div style="margin-top:30px;display:inline-block;background:${accent};color:#fff;font-size:22px;padding:8px 18px;border-radius:6px">ブラウザですぐ遊べる・ログインなし</div>
<div style="margin-top:22px;font-size:20px;opacity:.7">asobi.enludus.com</div></div>
<img src="data:image/png;base64,${phone.toString('base64')}" style="position:absolute;right:70px;top:36px;width:300px;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,.35);transform:rotate(3deg)">
</body></html>`);
await o.waitForTimeout(1500); await o.screenshot({ path: outDir + '/ogp.png' });
fs.unlinkSync(outDir + '/thumb-src.png');
await b.close();
