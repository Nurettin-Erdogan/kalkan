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

test('ücreti hemen ödeyin ifadesini para talebi olarak yakalar', () => {
  const result = analyzeContent(
    'PTT: Kargonuz teslim edilemedi. Paketiniz bugün iptal edilecek. 14,90 TL yeniden teslimat ücretini hemen ödeyin: http://ptt-teslimat-merkezi.xyz/odeme',
  );
  const titles = result.findings.map((item) => item.title);
  assert.equal(result.level, 'high');
  assert.ok(titles.includes('Para gönderme talebi'));
  assert.ok(titles.includes('Tehdit veya kayıp korkusu'));
});

test('ödemenin tamamlandığını bildiren normal mesajı para talebi saymaz', () => {
  const result = analyzeContent('Ödemeniz başarıyla alınmıştır. Faturanızı uygulamadan görüntüleyebilirsiniz.');
  assert.ok(!result.findings.some((item) => item.title === 'Para gönderme talebi'));
});

test('güvenlik uyarısındaki paylaşmayın ifadesini hassas bilgi talebi saymaz', () => {
  const result = analyzeContent('SMS doğrulama kodunuzu kimseyle paylaşmayın. Banka çalışanlarımız bu kodu istemez.');
  assert.ok(!result.findings.some((item) => item.title === 'Hassas bilgi talebi'));
});

test('doğrulama kodunu girmeyi isteyen mesajı hassas bilgi talebi sayar', () => {
  const result = analyzeContent('Hesabınızı açmak için SMS doğrulama kodunu girin.');
  assert.ok(result.findings.some((item) => item.title === 'Hassas bilgi talebi'));
});

test('kelimeler arasındaki ek ifadeler olsa da paket iptali tehdidini yakalar', () => {
  const result = analyzeContent('Paketiniz bugün saat 18.00 sonrasında otomatik olarak iptal edilecektir.');
  assert.ok(result.findings.some((item) => item.title === 'Tehdit veya kayıp korkusu'));
});

test('kullanıcı bilgisi içeren yanıltıcı bağlantıyı yakalar', () => {
  const result = analyzeContent('Giriş: https://turkiye.gov.tr@evil.example/login');
  assert.ok(result.findings.some((item) => item.title === 'Yanıltıcı bağlantı biçimi'));
});

test('resmî alan adının alt alanına izin verir', () => {
  const result = analyzeContent('Bilgi için https://sube.turkiye.gov.tr/duyuru adresini açın.');
  assert.ok(result.findings.some((item) => item.title === 'Resmî alan adı eşleşiyor'));
  assert.ok(!result.findings.some((item) => item.title === 'Taklit alan adı'));
});

test('çok katmanlı alt alan adını şüpheli bulur', () => {
  const result = analyzeContent('İşlem için https://giris.guvenli.banka.destek.example.com adresini açın.');
  assert.ok(result.findings.some((item) => item.title === 'Aşırı uzun alt alan adı'));
});

test('protokol yazılmadan yapıştırılan sahte alan adını analiz eder', () => {
  const result = analyzeContent('Ödeme için ptt-teslimat-merkezi.xyz/odeme adresini kullanın.');
  const titles = result.findings.map((item) => item.title);
  assert.deepEqual(result.links, ['ptt-teslimat-merkezi.xyz/odeme']);
  assert.ok(titles.includes('Taklit alan adı'));
  assert.ok(titles.includes('Şüpheli alan adı uzantısı'));
});

test('e-posta adresinin alan adını bağlantı gibi değerlendirmez', () => {
  const result = analyzeContent('Sorularınız için destek@ptt.gov.tr adresine yazabilirsiniz.');
  assert.equal(result.links.length, 0);
});
