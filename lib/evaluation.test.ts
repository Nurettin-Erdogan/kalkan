import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { evaluate, renderReport, splitOf } from './evaluation.ts';
import { evaluationSet } from './fixtures/evaluation-set.ts';

const result = evaluate(evaluationSet);
const report = renderReport(result);

test('değerlendirme seti dengeli ve kayıt kimlikleri tekil', () => {
  const ids = evaluationSet.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(result.overall.scams, 36);
  assert.equal(result.overall.legit, 36);
  assert.equal(result.bySplit.gelistirme.scams, result.bySplit['kor-test'].scams);
  assert.equal(splitOf('s01'), 'gelistirme');
  assert.equal(splitOf('l02'), 'kor-test');
});

// Kalite kapısı: kural değişikliği mevcut doğruluğun altına düşerse CI durur.
// Eşikler ölçülen değerdir; iyileştirme olduğunda yükseltilir, asla gevşetilmez.
test('kural motoru doğruluk kapısını geçer', () => {
  assert.ok(result.overall.caught >= 32, `yakalanan dolandırıcılık ${result.overall.caught}/36 < 32/36`);
  assert.ok(result.overall.falseAlarms <= 1, `yanlış alarm ${result.overall.falseAlarms}/36 > 1/36`);
  assert.ok(
    result.bySplit['kor-test'].caught >= 14,
    `kör testte yakalanan ${result.bySplit['kor-test'].caught}/18 < 14/18`,
  );
});

test('docs/evaluation.md kural motorunun güncel çıktısıyla aynı', () => {
  const published = readFileSync(new URL('../docs/evaluation.md', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
  assert.equal(published, report, 'Rapor eski: `npm run evaluate` çalıştırıp docs/evaluation.md dosyasını commit edin.');
});

test("README'deki doğruluk tablosu rapordaki sayılarla aynı", () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  for (const row of report.split('\n').filter((line) => /^\| (Tümü|Geliştirme yarısı|Kör test yarısı) \|/.test(line))) {
    assert.ok(readme.includes(row), `README bu satırı içermeli:\n${row}`);
  }
});
