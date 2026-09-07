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
  assert.ok(titles.includes('Güvenli bağlantı kullanılmıyor'));
});

test('resmî alan adını olumlu işaret olarak kaydeder', () => {
  const result = analyzeContent('Duyuru için https://www.turkiye.gov.tr adresini kullanın.');
  const official = result.findings.find((item) => item.title === 'Resmî alan adı eşleşiyor');
  assert.ok(official);
  assert.equal(official?.kind, 'positive');
  assert.ok(!result.findings.some((item) => item.title === 'Taklit alan adı'));
});

test('şifre isteyen sahte banka mesajını tehlikeli sayar', () => {
  const result = analyzeContent(
    'Hesabınız güvenlik nedeniyle askıya alınacaktır. Mobil bankacılık şifrenizi doğrulamak için acilen https://isbank-guvenlik.info adresine giriş yapın.',
  );
  assert.equal(result.level, 'high');
  const titles = result.findings.map((item) => item.title);
  assert.ok(titles.includes('Hassas bilgi talebi'));
  assert.ok(titles.includes('Taklit alan adı'));
});

test('kısaltılmış bağlantıyı uyarı olarak kaydeder', () => {
  const result = analyzeContent('Detaylar için https://bit.ly/ornek-link');
  const titles = result.findings.map((item) => item.title);
  assert.ok(titles.includes('Kısaltılmış bağlantı'));
  assert.ok(result.score >= 15);
});
