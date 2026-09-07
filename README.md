# Kalkan

<p align="center">
  <a href="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml"><img src="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI durumu"></a>
</p>

<p align="center">
  <img src="public/og.jpg" alt="Kalkan — şüpheli mesaj ve bağlantı risk analizi" width="1100">
</p>

Kalkan, şüpheli mesaj, bağlantı ve ekran görüntülerindeki dolandırıcılık risklerini sade Türkçeyle açıklayan bir web uygulamasıdır. Analiz tarayıcıda çalışır; içeriği sunucuya göndermez.

<p align="center">
  <a href="https://kalkan.vercel.app"><strong>Canlı demoyu aç →</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/demo-guide.md"><strong>Canlı tur</strong></a>
</p>

## Özet

| | |
| --- | --- |
| **Problem** | Kullanıcıların sahte kargo, banka ve kurum mesajlarını ayırt etmekte zorlanması |
| **Çözüm** | Dil, bağlantı yapısı ve taklit alan adlarını puanlayan açıklanabilir risk analizi |
| **Doğrulama** | Birim testler, TypeScript, lint ve üretim derlemesi GitHub Actions’ta koşar |

Canlı sitede **Sahte kargo mesajı** örneğini açın; puan, bulgular ve önerilen adım tarayıcıda üretilir. Ayrıntılı tur: [docs/demo-guide.md](docs/demo-guide.md).

## Özellikler

- Mesaj ve bağlantı analizi
- Türkçe ekran görüntüsü OCR desteği
- Taklit alan adı ve şüpheli bağlantı tespiti
- Açıklanabilir risk puanı
- Güvenli sonraki adım önerileri
- Tamamen tarayıcı içinde çalışan analiz

## Test ve CI

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Yerel geliştirme

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Önemli not

Kalkan bir risk değerlendirme aracıdır; hiçbir içeriğe kesin güvenlik garantisi vermez. Şüpheli bir durumda işlem yapılmamalı ve ilgili kurumun resmî kanallarına doğrudan ulaşılmalıdır.
