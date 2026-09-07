# 3 dakikalık demo

Kalkan’ı tarayıcı içinde çalışan, açıklanabilir bir risk yardımcısı olarak gösterir. Kesin güvenlik kararı iddiası yoktur.

## Hazırlık

- [Canlı demo](https://kalkan.vercel.app) açık olsun.
- Gerçek kişisel mesaj yapıştırmayın; örnekleri kullanın.

## 0:00–0:20 — Tehdit

Sahte kargo ve banka iletileri acil ödeme veya şifre ister. Kullanıcı bağlantıya bakmadan işlem yapmamalıdır. Kalkan metin ve URL yapısını yerelde puanlar; içerik sunucuya gitmez.

## 0:20–0:50 — Örnek analiz

1. **Sahte kargo mesajı** örneğine tıklayın; analiz hemen çalışır.
2. Yüksek risk puanı, taklit alan adı ve ödeme baskısını gösterin.
3. Önerilen adımı okuyun: resmî uygulamadan veya bilinen numaradan doğrula, kısa linke ödeme yapma.
4. **Normal mesaj** örneğiyle düşük risk kontrastını gösterin.

## 0:50–1:10 — Sınır

OCR ekran görüntüsünden metin okur; model bir yargıç değildir. Şüphede işlem durur, kurumun resmî kanalı kullanılır.

## Kapanış

Kalkan, dolandırıcılık tespitini buluta göndermeden sezgisel sinyalleri (alan adı, aciliyet, şifre isteği) açıklanabilir madde madde sunar.

## Olası sorular

**Neden sunucusuz?**  
Mesaj içeriği cihazdan çıkmaz. Bedeli: model güncellemesi dağıtımla gelir; sunucu tarafı istihbarat yoktur.

**Yanlış pozitif?**  
Resmî görünen kısaltılmış link uyarılır. Puan, kesinlik değil önceliklendirmedir.

**OCR hata yaparsa?**  
Okunan metin düzenlenebilir; analiz kullanıcı onayındaki metne uygulanır.
