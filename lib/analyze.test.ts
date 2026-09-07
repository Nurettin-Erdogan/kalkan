import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyzeContent } from './analyze.ts';

test('sakin bir randevu mesajını düşük risk sayar', () => {
  const result = analyzeContent('Merhaba, yarın saat 14.00 için oluşturduğunuz servis randevusunu hatırlatmak isteriz. İyi günler.');
  assert.equal(result.level, 'low');
  assert.equal(result.score, 0);
  assert.equal(result.links.length, 0);
});

test('sahte kargo ödeme bağlantısını yüksek risk işaretler', () => {
  const result = analyzeContent(
    'Kargonuz teslim edilemedi. 14,90 TL yeniden teslimat ücreti için hemen ödeme yapın: http://ptt-teslimat-merkezi.xyz/odeme',
  );
  assert.equal(result.level, 'high');
  assert.ok(result.score >= 65);
  const titles = result.findings.map((item) => item.title);
  assert.ok(titles.includes('Taklit alan adı'));
  assert.ok(titles.includes('Para gönderme talebi'));
  assert.ok(titles.includes('Şüpheli alan adı uzantısı'));
});

test('resmî alan adını olumlu işaret olarak kaydeder', () => {
  const result = analyzeContent('Duyuru için https://www.turkiye.gov.tr adresini kullanın.');
  const official = result.findings.find((item) => item.title === 'Resmî alan adı eşleşiyor');
  assert.ok(official);
  assert.equal(official?.kind, 'positive');
  assert.ok(!result.findings.some((item) => item.title === 'Taklit alan adı'));
});
