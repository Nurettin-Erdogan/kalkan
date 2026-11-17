# Kalkan değerlendirme raporu

> Bu dosya `npm run evaluate` ile üretilir; elle düzenlenmez. `npm test`, dosyanın kural motorunun güncel çıktısıyla aynı olduğunu doğrular.

Set: 36 dolandırıcılık + 36 meşru sentetik Türkçe mesaj ([lib/fixtures/evaluation-set.ts](../lib/fixtures/evaluation-set.ts)). "Uyarı" = orta veya yüksek risk.

| Bölüm | Yakalanan dolandırıcılık | Yüksek riskle yakalanan | Yanlış alarm (meşru mesaj) | Kesinlik |
| --- | --- | --- | --- | --- |
| Tümü | 32/36 (%88,9) | 3/36 (%8,3) | 1/36 (%2,8) | %97,0 |
| Geliştirme yarısı | 18/18 (%100,0) | 2/18 (%11,1) | 0/18 (%0,0) | %100,0 |
| Kör test yarısı | 14/18 (%77,8) | 1/18 (%5,6) | 1/18 (%5,6) | %93,3 |

Kural iyileştirmeleri yalnızca geliştirme yarısındaki hatalara bakılarak yapılır; kör test yarısı bu iyileştirmelerin yeni mesajlara ne kadar genellendiğini gösterir.

## Kategori kırılımı

| Etiket | Kategori | Doğru / Toplam |
| --- | --- | --- |
| meşru | banka | 8/8 |
| meşru | e-ticaret | 4/4 |
| meşru | egitim | 1/1 |
| meşru | fatura | 2/2 |
| meşru | is | 1/1 |
| meşru | kamu | 4/4 |
| meşru | kargo | 5/5 |
| meşru | kisisel | 5/6 |
| meşru | operator | 2/2 |
| meşru | saglik | 3/3 |
| dolandırıcılık | aile | 1/1 |
| dolandırıcılık | banka | 7/8 |
| dolandırıcılık | cekilis | 1/1 |
| dolandırıcılık | destek | 3/3 |
| dolandırıcılık | e-ticaret | 1/1 |
| dolandırıcılık | fatura | 2/2 |
| dolandırıcılık | hesap | 2/2 |
| dolandırıcılık | ilan | 1/1 |
| dolandırıcılık | is-teklifi | 0/1 |
| dolandırıcılık | kamu | 6/7 |
| dolandırıcılık | kargo | 4/4 |
| dolandırıcılık | operator | 2/2 |
| dolandırıcılık | yatirim | 2/3 |

## Hatalar

| Kayıt | Bölüm | Gerçek | Kalkan | Puan | Öne çıkan bulgu |
| --- | --- | --- | --- | --- | --- |
| s12 | kör test | dolandırıcılık | low | 0 | — |
| s22 | kör test | dolandırıcılık | low | 0 | — |
| s26 | kör test | dolandırıcılık | low | 15 | Kısaltılmış bağlantı |
| s36 | kör test | dolandırıcılık | low | 13 | Şüpheli alan adı uzantısı |
| l24 | kör test | meşru | medium | 18 | Para gönderme talebi |
