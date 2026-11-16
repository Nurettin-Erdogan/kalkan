// Tesseract worker ve WASM çekirdeğini public/tesseract altına kopyalar.
// Böylece OCR, üçüncü taraf CDN yerine sitenin kendi kaynağından yüklenir ve
// CSP'deki script-src/connect-src 'self' kuralıyla uyumlu çalışır.
// Dosyalar build sırasında üretilir; repoya eklenmez (.gitignore).
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const workerSrc = require.resolve('tesseract.js/dist/worker.min.js');
const coreDir = path.dirname(require.resolve('tesseract.js-core/package.json'));

const outDir = path.join(process.cwd(), 'public', 'tesseract');
const outCore = path.join(outDir, 'core');
mkdirSync(outCore, { recursive: true });

copyFileSync(workerSrc, path.join(outDir, 'worker.min.js'));

// Uygulama yalnızca LSTM motorunu kullanıyor (createWorker(..., 1)); tarayıcı
// desteğine göre tesseract.js bu üç varyanttan birini seçer.
const coreFiles = readdirSync(coreDir).filter((f) => /^tesseract-core-(relaxedsimd-|simd-)?lstm\.wasm(\.js)?$/.test(f));
for (const file of coreFiles) copyFileSync(path.join(coreDir, file), path.join(outCore, file));

console.log(`Tesseract: worker + ${coreFiles.length} çekirdek dosyası public/tesseract altına kopyalandı.`);
