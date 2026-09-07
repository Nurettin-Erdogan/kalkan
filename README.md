# Kalkan

<p align="center">
  <a href="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml"><img src="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI durumu"></a>
</p>

Kalkan, şüpheli mesaj, bağlantı ve ekran görüntülerindeki dolandırıcılık risklerini sade Türkçeyle açıklayan bir web uygulamasıdır. Analiz tarayıcıda çalışır; içeriği sunucuya göndermez.

## Portföy özeti

| | |
| --- | --- |
| **Problem** | Kullanıcıların sahte kargo, banka ve kurum mesajlarını ayırt etmekte zorlanması |
| **Çözüm** | Dil, bağlantı yapısı ve taklit alan adlarını puanlayan açıklanabilir risk analizi |
| **Doğrulama** | Birim testler, TypeScript, lint ve üretim derlemesi GitHub Actions’ta koşar |

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
