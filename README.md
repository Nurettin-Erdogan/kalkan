# Kalkan

Kalkan, şüpheli mesaj, bağlantı ve ekran görüntülerindeki dolandırıcılık risklerini sade Türkçeyle açıklayan bir web uygulaması prototipidir.

## Özellikler

- Mesaj ve bağlantı analizi
- Türkçe ekran görüntüsü OCR desteği
- Taklit alan adı ve şüpheli bağlantı tespiti
- Açıklanabilir risk puanı
- Güvenli sonraki adım önerileri
- Tamamen tarayıcı içinde çalışan analiz

## Test ve CI

Risk analizi birim testleri tarayıcı olmadan çalışır:

```bash
npm test
npm run typecheck
npm run lint
```

Push ve pull request'lerde GitHub Actions aynı kontrolleri çalıştırır.

## Yerel geliştirme

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Üretim derlemesi

```bash
npm run build
```

## Önemli not

Kalkan bir risk değerlendirme aracıdır; hiçbir içeriğe kesin güvenlik garantisi vermez. Şüpheli bir durumda işlem yapılmamalı ve ilgili kurumun resmî kanallarına doğrudan ulaşılmalıdır.
