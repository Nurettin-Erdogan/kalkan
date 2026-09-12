# Kalkan

<p align="center">
  <img src="public/og.jpg" alt="Kalkan — şüpheli mesaj ve bağlantı risk analizi" width="1100">
</p>

<p align="center">
  <a href="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml"><img src="https://github.com/Nurettin-Erdogan/kalkan/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI durumu"></a>
  <a href="https://nurettin-erdogan.github.io/kalkan/"><img src="https://img.shields.io/badge/live-GitHub%20Pages-0f766e.svg" alt="Canlı demo"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0f766e.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/TypeScript-5.9-0f766e.svg" alt="TypeScript 5.9">
</p>

**Şüpheli mesaj, bağlantı ve ekran görüntülerindeki dolandırıcılık işaretlerini açıklanabilir kurallarla analiz et.**

Kalkan; phishing, sahte kargo/banka mesajları, taklit alan adları ve şüpheli destek hattı kalıpları gibi sinyalleri inceleyen **gizlilik odaklı, tarayıcı içinde çalışan bir risk analiz uygulamasıdır**. Mesaj ve görsel içeriği analiz için uzak bir sunucuya gönderilmez.

Kalkan bir LLM sohbet botu değildir. Sonucu tek bir "AI kararı" olarak vermek yerine, hangi sinyallerin puanı yükselttiğini kullanıcıya açıkça gösteren **kural tabanlı ve açıklanabilir** bir yaklaşım kullanır.

<p align="center">
  <a href="https://nurettin-erdogan.github.io/kalkan/"><strong>Canlı demoyu aç →</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/demo-guide.md"><strong>Demo rehberi</strong></a>
</p>

## Kısa özet

| | |
| --- | --- |
| **Problem** | Kullanıcıların sahte kargo, banka ve kurum mesajlarındaki dolandırıcılık işaretlerini hızlıca ayırt edememesi |
| **Çözüm** | Mesaj, URL ve ekran görüntülerini yerel olarak analiz eden açıklanabilir risk puanlama akışı |
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **OCR** | Tesseract.js + Türkçe dil verisi |
| **Analiz** | Kural tabanlı mesaj/URL sinyalleri, lookalike domain ve şüpheli telefon kalıpları |
| **Gizlilik** | Analiz tarayıcı içinde; mesaj ve ekran görüntüsü içerikleri uygulama sunucusuna gönderilmez |
| **Kalite** | Node test runner, TypeScript typecheck, ESLint, production build, GitHub Actions CI |
| **Dağıtım** | GitHub Pages |

## Neler yapıyor?

- Şüpheli mesaj metinlerini analiz eder
- URL yapısını ve alan adını inceler
- Taklit / lookalike alan adı sinyallerini yakalar
- Aciliyet, ödül/ceza, hesap kapatma ve doğrulama baskısı gibi sosyal mühendislik kalıplarını puanlar
- Şüpheli `0850` / destek hattı kalıplarını işaretler
- Ekran görüntülerinden Türkçe OCR ile metin çıkarır
- Kritik bulguları risk puanından önce görünür hale getirir
- Kullanıcıya neden riskli göründüğünü maddeler halinde açıklar
- Güvenli sonraki adım önerileri sunar

## Nasıl çalışıyor?

```text
Mesaj / URL / ekran görüntüsü
        |
        v
Tarayıcı içi metin çıkarma
        |
        +--> ekran görüntüsüyse Tesseract.js OCR
        |
        v
Kural tabanlı sinyal analizi
        |
        +--> URL ve domain kontrolleri
        +--> sosyal mühendislik kalıpları
        +--> telefon / destek hattı sinyalleri
        +--> lookalike domain kontrolleri
        |
        v
Risk puanı + açıklanabilir bulgular
        |
        v
Güvenli sonraki adım önerisi
```

## Neden kural tabanlı?

Bu projede amaç yalnızca bir risk etiketi üretmek değil, **sonucun neden oluştuğunu görünür kılmaktır**. Kural tabanlı yaklaşım sayesinde:

- aynı girdi aynı analizi üretir,
- hangi sinyalin puanı etkilediği izlenebilir,
- test fixture'larıyla davranış deterministik olarak doğrulanabilir,
- analiz için kullanıcı içeriğini harici bir LLM servisine göndermek gerekmez.

Bu yaklaşım tüm dolandırıcılık türlerini yakalama garantisi vermez; ancak karar sürecini kullanıcı ve geliştirici açısından denetlenebilir tutar.

## Gizlilik yaklaşımı

Kalkan'ın temel tasarım kararı, analiz edilen içeriğin mümkün olduğunca cihazda kalmasıdır.

- Mesaj analizi tarayıcıda çalışır.
- URL analizi tarayıcıda çalışır.
- Ekran görüntüsü OCR işlemi Tesseract.js ile istemci tarafında yapılır.
- Risk skoru ve bulgular istemci tarafındaki kurallardan üretilir.

Bu nedenle uygulama, kullanıcı mesajlarını veya ekran görüntülerini analiz amacıyla kendi backend'ine gönderen klasik bir servis değildir.

## Teknik stack

| Katman | Teknoloji | Sorumluluk |
| --- | --- | --- |
| UI | React 19 | Analiz akışı ve sonuç ekranı |
| Dil | TypeScript 5.9 | Tip güvenliği ve analiz kuralları |
| Stil | Tailwind CSS | Responsive arayüz |
| OCR | Tesseract.js 7 | Ekran görüntülerinden Türkçe metin çıkarma |
| Test | Node test runner | Analiz kurallarının fixture tabanlı doğrulanması |
| Kalite | ESLint + TypeScript | Lint ve statik kontrol |
| CI | GitHub Actions | Test, typecheck, lint ve production build |
| Hosting | GitHub Pages | Statik canlı demo |

## Test ve CI

Yerelde kalite kontrolleri:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

CI aynı temel kontrolleri çalıştırarak analiz motorunda veya arayüzde yapılan değişikliklerin build ve test seviyesinde doğrulanmasını sağlar.

## Yerel geliştirme

Gereksinim: Node.js 22.13+

```bash
npm install
npm run dev
```

Uygulama geliştirme sunucusunda açılır. Production build için:

```bash
npm run build
```

## Sınırlar

- Kalkan bir antivirüs, URL reputation servisi veya banka doğrulama sistemi değildir.
- Kural tabanlı analiz yeni veya alışılmadık dolandırıcılık kalıplarını kaçırabilir.
- OCR doğruluğu ekran görüntüsünün çözünürlüğü, yazı tipi ve kontrastına bağlıdır.
- Düşük risk puanı, içeriğin güvenli olduğuna dair garanti değildir.
- Kritik işlemlerde kullanıcı ilgili kurumun resmî web sitesi, uygulaması veya telefon numarası üzerinden bağımsız doğrulama yapmalıdır.

## English

**Kalkan** is a privacy-focused, browser-side scam and phishing risk analyzer for suspicious messages, URLs and screenshots. It uses deterministic rules instead of an LLM, performs Turkish OCR with Tesseract.js and explains which signals increased the risk score. Analysis content stays in the browser rather than being sent to an application backend.

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
