# Değişiklik günlüğü

Önemli değişiklikler bu dosyada sürüm bazında özetlenir. Biçim [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) yaklaşımını izler.

## [Yayınlanmamış]

## [1.0.0] - 2026-11-19

İlk kararlı sürüm. Kalkan; şüpheli mesaj, bağlantı ve ekran görüntülerini tamamen tarayıcıda, açıklanabilir kurallarla inceler.

### Analiz

- Mesaj metninde sosyal mühendislik kalıplarının puanlanması: aciliyet, ödül/ceza, hesap kapatma, doğrulama baskısı, kart bilgisi ve tek kullanımlık kod isteme, "güvenli hesap" tuzağı, emniyet/savcılık taklidi.
- Bağlantı ve alan adı incelemesi: taklit (lookalike) alan adları, punycode, `.gov.tr` olmayan `gov` etiketleri ve resmî kurum alan adı listesi.
- Şüpheli `0850` / destek hattı kalıplarının işaretlenmesi.
- Ekran görüntülerinden Türkçe OCR (Tesseract.js) ile metin çıkarma.
- Kritik bulguların risk puanından önce gösterilmesi; her uyarının nedeninin maddeler halinde açıklanması ve güvenli sonraki adım önerileri.

### Ölçüm

- 36 dolandırıcılık ve 36 meşru sentetik Türkçe mesajdan oluşan etiketli değerlendirme seti; geliştirme ve kör test yarılarına ayrılmış ölçüm (`npm run evaluate`).
- Doğruluk kapısı: kural motorunun yakalama ve yanlış alarm oranları mevcut seviyenin altına düşerse CI durur; README'deki tablo raporla otomatik karşılaştırılır.
- Kör test yarısında yakalama %61,1'den %77,8'e çıktı, yanlış alarm %16,7'den %5,6'ya indi.

### Gizlilik ve güvenlik

- OCR dosyaları üçüncü taraf CDN yerine aynı kaynaktan yüklenir; analiz edilen içerik cihazdan çıkmaz.
- Content-Security-Policy ile dış kaynaklara veri gönderimi tarayıcı düzeyinde engellenir; bu davranış CI'da Playwright ile test edilir (`npm run test:privacy`).
- CodeQL güvenlik analizi (JavaScript/TypeScript ve GitHub Actions) her PR'da ve haftalık çalışır.
- Canlı demo kontrolü: GitHub Pages'teki sürümün sayfa başlığı, CSP etiketi ve OCR dosyaları her sabah otomatik doğrulanır.

### Erişilebilirlik

- Düşük kontrastlı metinler WCAG AA seviyesine çıkarıldı.

[Yayınlanmamış]: https://github.com/Nurettin-Erdogan/kalkan/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Nurettin-Erdogan/kalkan/releases/tag/v1.0.0
