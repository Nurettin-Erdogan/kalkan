# Kalkan

<p align="center">
  <a href="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml"><img src="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI durumu"></a>
</p>

<p align="center">
  <img src="public/og.jpg" alt="Kalkan — şüpheli mesaj ve bağlantı risk analizi" width="1100">
</p>

Kalkan, şüpheli mesaj, bağlantı ve ekran görüntülerindeki dolandırıcılık risklerini sade Türkçeyle açıklayan bir web uygulamasıdır. Analiz tarayıcıda çalışır; içeriği sunucuya göndermez.

**Ne değildir?** Kalkan bir LLM sohbet botu değildir; kural tabanlı, açıklanabilir bir risk asistanıdır. [Ajan Kalkanı](https://github.com/Nurettin-Erdogan/ajan-kalkani) AI ajanlarının *tool çağrılarını* yetkilendirir — bu proje ise kullanıcıya gelen *scam / phishing* içerğini puanlar. İkisi farklı katmanlardır.

<p align="center">
  <a href="https://nurettin-erdogan.github.io/kalkan"><strong>Canlı demoyu aç →</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/demo-guide.md"><strong>Canlı tur</strong></a>
</p>

## Özet

| | |
| --- | --- |
| **Problem** | Kullanıcıların sahte kargo, banka ve kurum mesajlarını ayırt etmekte zorlanması |
| **Çözüm** | Dil, bağlantı yapısı, taklit / lookalike alan adları ve şüpheli destek hatlarını puanlayan açıklanabilir risk analizi |
| **Doğrulama** | Fixture’lı birim testler, TypeScript, lint ve üretim derlemesi GitHub Actions’ta koşar |

Canlı sitede **Sahte kargo mesajı** örneğini açın; puan, öncelikli bulgular ve önerilen adım tarayıcıda üretilir. Ayrıntılı tur: [docs/demo-guide.md](docs/demo-guide.md).

## Özellikler

- Mesaj ve bağlantı analizi (kural tabanlı, LLM yok)
- Türkçe ekran görüntüsü OCR desteği
- Taklit alan adı + lookalike (benzer yazım) tespiti
- Şüpheli 0850 / destek hattı kalıpları
- Açıklanabilir risk puanı (önce kritik bulgular)
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
