/**
 * Kalkan değerlendirme seti: etiketli, sentetik Türkçe mesajlar.
 *
 * - Metinler gerçek mağdurlara ait değildir; yaygın dolandırıcılık kalıplarından
 *   ve kurumların bilinen bildirim biçimlerinden esinlenerek yazılmıştır.
 * - Meşru mesajlara bilinçli olarak "zor" örnekler eklenmiştir: aciliyet dili
 *   kullanan gerçek kampanyalar, "kodu uygulamaya girin" diyen gerçek tek
 *   kullanımlık şifreler, resmî alan adlı banka ve kargo bildirimleri.
 * - Bu dosya birim test fixture'larından (scam-cases.ts) ayrıdır. Numarası tek
 *   olan kayıtlar "geliştirme", çift olanlar "kör test" yarısıdır; kural
 *   iyileştirmeleri yalnızca geliştirme yarısındaki hatalara bakılarak yapılır.
 */
export type EvaluationCase = {
  id: string;
  label: 'scam' | 'legit';
  category: string;
  text: string;
};

export const evaluationSet: EvaluationCase[] = [
  // ——— Dolandırıcılık ———
  { id: 's01', label: 'scam', category: 'kargo', text: 'PTT Kargo: Gönderiniz adres eksikliği nedeniyle dağıtıma çıkarılamadı. Adresinizi 24 saat içinde güncelleyin: https://ptt-adres-guncelle.com/tr' },
  { id: 's02', label: 'scam', category: 'kargo', text: 'Yurtiçi Kargo: 2 adet paketiniz gümrükte. Teslimat için 19,90 TL gümrük bedelini ödemeniz gerekmektedir: yurticigumruk-tr.top/ode' },
  { id: 's03', label: 'scam', category: 'kargo', text: 'MNG Kargo bilgilendirme: Teslim alınmayan gönderiniz yarın iade edilecek. Yeni teslimat randevusu için: http://mng-teslimat.click/r/8812' },
  { id: 's04', label: 'scam', category: 'kargo', text: 'DHL Express: Paketiniz için ödenmemiş 34,50 TL vergi bulunmaktadır. Ödeme yapılmazsa gönderi imha edilecektir. dhl-tr-odeme.shop' },
  { id: 's05', label: 'scam', category: 'banka', text: 'Ziraat Bankası: Kartınız şüpheli işlem nedeniyle bloke edilmiştir. Blokeyi kaldırmak için kart bilgilerinizi doğrulayın: https://ziraat-guvenli-islem.com' },
  { id: 's06', label: 'scam', category: 'banka', text: 'Sayın müşterimiz, hesabınızdan 12.450 TL tutarında işlem başlatıldı. Siz yapmadıysanız iptal için size gelen SMS kodunu temsilcimize söyleyin. Banka Güvenlik Birimi' },
  { id: 's07', label: 'scam', category: 'banka', text: 'Akbank: Yeni bir cihazdan hesabınıza giriş yapıldı. Siz değilseniz hemen akbank-cihaz-onay.net adresinden işlemi iptal edin.' },
  { id: 's08', label: 'scam', category: 'banka', text: 'Bonus puanlarınızın süresi bugün doluyor! 1.250 TL değerindeki puanınızı nakite çevirmek için kart bilgilerinizi girin: https://bonus-puan-iade.com' },
  { id: 's09', label: 'scam', category: 'kamu', text: 'e-Devlet: Adınıza 3.750 TL tazminat ödemesi tanımlanmıştır. Almak için kimlik ve kart bilgilerinizi girin: https://turkiye-gov-tazminat.com' },
  { id: 's10', label: 'scam', category: 'kamu', text: 'Gelir İdaresi: 2.180 TL vergi iadeniz bulunmaktadır. İadenin hesabınıza yatması için bilgilerinizi 48 saat içinde doğrulayın: gib-iade-sorgu.online' },
  { id: 's11', label: 'scam', category: 'kamu', text: 'Trafik cezanız ödenmediği için icra takibi başlatılacaktır. Hemen ödeme yapın: http://egm-ceza-odeme.xyz' },
  { id: 's12', label: 'scam', category: 'kamu', text: 'HGS: Geçiş ihlali nedeniyle 412 TL cezanız bulunmaktadır. 3 gün içinde ödenmezse 10 katı uygulanacaktır. hgs-ihlal-odeme.com' },
  { id: 's13', label: 'scam', category: 'fatura', text: 'Elektriğiniz ödenmemiş fatura nedeniyle bugün kesilecektir. Kesintiyi önlemek için borcunuzu hemen ödeyin: https://enerji-borc-sorgula.net/ode' },
  { id: 's14', label: 'scam', category: 'operator', text: 'Turkcell: Hattınız kimlik doğrulaması yapılmadığı için 24 saat içinde kapatılacaktır. Doğrulama: https://turkcell-hat-dogrulama.com' },
  { id: 's15', label: 'scam', category: 'yatirim', text: 'Devletin desteğiyle kripto yatırım programı! Günde 3.000 TL kazanç. Kayıt için 250 TL yatırın: https://yatirim-firsati.vip' },
  { id: 's16', label: 'scam', category: 'yatirim', text: "VIP borsa sinyal grubumuza katılın, haftalık %40 garantili kazanç. Üyelik için IBAN'a 1.000 TL gönderin, WhatsApp'tan yazın." },
  { id: 's17', label: 'scam', category: 'destek', text: 'Banka güvenlik birimi olarak arıyoruz. Hesabınızı korumak için AnyDesk uygulamasını indirip bize ekrandaki kodu söyleyin.' },
  { id: 's18', label: 'scam', category: 'destek', text: 'Kartınızdan 4.999 TL çekim yapılmıştır. İtiraz için hemen 0850 455 12 12 numaralı müşteri hizmetlerini arayın.' },
  { id: 's19', label: 'scam', category: 'hesap', text: 'Merhaba, yanlışlıkla sana 6 haneli bir kod gönderdim, bana iletebilir misin? Acil lazım.' },
  { id: 's20', label: 'scam', category: 'hesap', text: 'Instagram: Hesabınız telif hakkı ihlali nedeniyle 24 saat içinde kapatılacaktır. İtiraz için: https://instagram-telif-itiraz.com/form' },
  { id: 's21', label: 'scam', category: 'aile', text: "Anne benim, telefonum bozuldu bu numaradan yazıyorum. Acil 2.500 TL lazım, şu IBAN'a gönderir misin: TR12 0006 1000 0000 1234 5678 90" },
  { id: 's22', label: 'scam', category: 'is-teklifi', text: "Evden çalışarak günde 1.500 TL kazanın! YouTube videolarını beğenerek para kazanabilirsiniz. Başlamak için WhatsApp'tan yazın." },
  { id: 's23', label: 'scam', category: 'ilan', text: 'Merhaba, ilanınızdaki ev için yurt dışındayım, anahtarı kargolayacağım. Önce 3.000 TL kapora göndermeniz gerekiyor.' },
  { id: 's24', label: 'scam', category: 'cekilis', text: 'Tebrikler! Migros çekilişinde 5.000 TL hediye çeki kazandınız. Ödülünüzü almak için 49 TL kargo ücretini ödeyin: migros-hediye.click' },
  { id: 's25', label: 'scam', category: 'banka', text: 'Garanti BBVA: Güvenliğiniz için kart bilgilerinizi güncelleyin: https://xn--garant-bbva-7nb.com/giris' },
  { id: 's26', label: 'scam', category: 'banka', text: 'Hesabınız kısıtlanmıştır. Kısıtlamayı kaldırmak için https://bit.ly/hesap-ac adresinden giriş yapın.' },
  { id: 's27', label: 'scam', category: 'kamu', text: 'Emniyet Genel Müdürlüğü olarak arıyoruz, adınız bir soruşturmaya karıştı. Savcı bey ile görüşmeniz için paranızı güvenli hesaba aktarmanız gerekiyor.' },
  { id: 's28', label: 'scam', category: 'kamu', text: 'Sağlık Bakanlığı: Aşı kartınızın süresi doldu. Yenilemek için kimlik bilgilerinizi girin: http://saglik-asi-karti.info' },
  { id: 's29', label: 'scam', category: 'e-ticaret', text: "Trendyol: Siparişiniz iptal edildi. İade tutarı olan 1.249 TL'yi almak için kart bilgilerinizi girin: https://trendyol-iade-merkezi.com" },
  { id: 's30', label: 'scam', category: 'banka', text: 'Vakıfbank: Mobil şubeniz askıya alındı. Aktifleştirmek için http://185.214.10.22/vakif adresinden giriş yapın.' },
  { id: 's31', label: 'scam', category: 'fatura', text: 'İGDAŞ: Doğalgaz aboneliğinizde ödenmemiş borç var. Gaz kesintisi yaşamamak için bugün içinde ödeme yapın: igdas-odeme.top' },
  { id: 's32', label: 'scam', category: 'kamu', text: 'Aile ve Sosyal Hizmetler: Hanenize 6.500 TL destek ödemesi çıktı. Başvuru için TC kimlik numaranızı ve kart bilgilerinizi gönderin.' },
  { id: 's33', label: 'scam', category: 'banka', text: 'Bankanız tarafından tahsil edilen kart aidatları iade ediliyor. İadeniz için hemen kart numarası ve CVV bilgisi ile başvurun: aidat-iade.org' },
  { id: 's34', label: 'scam', category: 'operator', text: 'Değerli müşterimiz, hattınıza 10 GB hediye internet tanımlandı. Aktifleştirmek için gelen doğrulama kodunu bu numaraya gönderin.' },
  { id: 's35', label: 'scam', category: 'destek', text: 'Papara: Hesabınızda şüpheli işlem tespit edildi. Hesabınızı korumak için 0888 123 45 67 numaralı destek hattını arayın.' },
  { id: 's36', label: 'scam', category: 'yatirim', text: 'Hisse önerisi: Yarın %300 yükselecek hisse için grubumuza katılın, ücretsiz! https://borsa-sinyal.live/katil' },

  // ——— Meşru ———
  { id: 'l01', label: 'legit', category: 'banka', text: 'Akbank: 482913 şifresini kimseyle paylaşmayın. Bu şifre 3 dakika geçerlidir. Banka çalışanları şifrenizi asla sormaz.' },
  { id: 'l02', label: 'legit', category: 'banka', text: 'Garanti BBVA: 1234 ile biten kartınızdan 249,90 TL harcama yapılmıştır. Detaylar: https://www.garantibbva.com.tr' },
  { id: 'l03', label: 'legit', category: 'kargo', text: 'Yurtiçi Kargo: 123456789 takip numaralı gönderiniz bugün dağıtıma çıkmıştır. Takip: https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula' },
  { id: 'l04', label: 'legit', category: 'kargo', text: 'PTT: Gönderiniz şubemize ulaşmıştır. Takip için https://gonderitakip.ptt.gov.tr adresini kullanabilirsiniz.' },
  { id: 'l05', label: 'legit', category: 'kamu', text: 'e-Devlet Kapısı: Adınıza yeni bir tebligat bulunmaktadır. Görüntülemek için turkiye.gov.tr adresinden giriş yapınız.' },
  { id: 'l06', label: 'legit', category: 'saglik', text: "MHRS: 18.11.2026 09:30 tarihli Dahiliye randevunuz oluşturulmuştur. İptal için 182'yi arayabilirsiniz." },
  { id: 'l07', label: 'legit', category: 'operator', text: "Turkcell: Son gün! Ek 10 GB paket sadece bugün 99 TL. Hemen almak için Turkcell Online İşlemler'i kullan: https://www.turkcell.com.tr" },
  { id: 'l08', label: 'legit', category: 'fatura', text: 'Vodafone: Kasım faturanız 389,50 TL. Son ödeme tarihi 25.11.2026. Online ödeme: https://www.vodafone.com.tr' },
  { id: 'l09', label: 'legit', category: 'fatura', text: 'CK Enerji: 1234567 numaralı tesisatınız için 642,30 TL tutarlı faturanız oluşmuştur. Son ödeme tarihi: 28.11.2026.' },
  { id: 'l10', label: 'legit', category: 'kisisel', text: 'Selam, akşam maça gelecek misin? Biletleri ben aldım, sonra hesaplaşırız.' },
  { id: 'l11', label: 'legit', category: 'kisisel', text: 'Anne ben eve geç geleceğim, okulda proje çalışması var. Akşam yemeğini bekleme.' },
  { id: 'l12', label: 'legit', category: 'kisisel', text: "Site Yönetimi: Kasım ayı aidatlarının ayın 10'una kadar yönetim hesabına yatırılmasını rica ederiz. Bilgi için yönetim ofisine uğrayabilirsiniz." },
  { id: 'l13', label: 'legit', category: 'egitim', text: "Değerli velimiz, 20 Kasım Cuma günü veli toplantısı saat 17.00'de yapılacaktır. Katılımınızı rica ederiz." },
  { id: 'l14', label: 'legit', category: 'e-ticaret', text: 'Trendyol: 1234567 numaralı siparişiniz kargoya verildi. Siparişlerim sayfasından takip edebilirsiniz: https://www.trendyol.com' },
  { id: 'l15', label: 'legit', category: 'banka', text: 'İş Bankası: Hesabınıza 15.000 TL maaş ödemesi yatırılmıştır. İyi günlerde kullanın.' },
  { id: 'l16', label: 'legit', category: 'kargo', text: 'Aras Kargo: İade gönderiniz satıcıya teslim edilmiştir. Takip: https://www.araskargo.com.tr' },
  { id: 'l17', label: 'legit', category: 'e-ticaret', text: 'Paketiniz talebiniz üzerine iptal edilmiştir. Ücret iadesi 3 iş günü içinde kartınıza yapılacaktır.' },
  { id: 'l18', label: 'legit', category: 'banka', text: "Bankamız sizden asla şifre, SMS kodu veya kart bilgisi istemez. Bu tür taleplerle karşılaşırsanız 444 0 444'ü arayın." },
  { id: 'l19', label: 'legit', category: 'saglik', text: "Dr. Ayşe Kaya Kliniği: Yarın 14.00'teki randevunuzu onaylamak için 1, iptal için 2 yazarak yanıtlayın." },
  { id: 'l20', label: 'legit', category: 'e-ticaret', text: 'Migros: Money kartınıza 50 TL indirim çeki yüklendi. Hemen kullanmak için Migros uygulamasına girin.' },
  { id: 'l21', label: 'legit', category: 'kamu', text: "e-Devlet: Kimlik kartınızın teslim randevusu 21.11.2026 tarihinde Nüfus Müdürlüğü'nde oluşturulmuştur." },
  { id: 'l22', label: 'legit', category: 'kamu', text: "Gelir İdaresi Başkanlığı: Motorlu taşıtlar vergisi 2. taksit son ödeme tarihi 30 Kasım'dır. Ödeme için https://dijital.gib.gov.tr" },
  { id: 'l23', label: 'legit', category: 'is', text: 'İK ekibimiz başvurunuzu değerlendirdi. Mülakat için 25 Kasım saat 10.00 uygun mu? Kariyer sayfamız: https://kariyer.ornekfirma.com.tr' },
  { id: 'l24', label: 'legit', category: 'kisisel', text: "Dünkü yemek parası 350 TL düştü, IBAN'ımı WhatsApp'tan attım, müsait olunca gönderirsin." },
  { id: 'l25', label: 'legit', category: 'kargo', text: 'PTT Kargo gönderiniz 15.11.2026 tarihinde teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.' },
  { id: 'l26', label: 'legit', category: 'operator', text: "Türk Telekom: Hattınıza 2 GB hediye internet tanımlanmıştır. Kalan kullanımınızı Online İşlemler'den görebilirsiniz." },
  { id: 'l27', label: 'legit', category: 'banka', text: 'Ziraat Bankası: Kredi kartı ekstreniz hazırlandı. Dönem borcunuz 1.240 TL, son ödeme tarihi 05.12.2026. https://www.ziraatbank.com.tr' },
  { id: 'l28', label: 'legit', category: 'e-ticaret', text: "Hepsiburada: Efsane Kasım başladı! Seçili ürünlerde %50'ye varan indirim. Kaçırmamak için uygulamayı indir." },
  { id: 'l29', label: 'legit', category: 'banka', text: 'Yapı Kredi: Yeni mobil uygulamamız yayında! World puanlarınızı takip etmek için uygulamayı indirin.' },
  { id: 'l30', label: 'legit', category: 'kamu', text: "İBB: Kadıköy'de yarın 09.00-15.00 arası planlı su kesintisi yapılacaktır. Anlayışınız için teşekkür ederiz." },
  { id: 'l31', label: 'legit', category: 'saglik', text: "Tahlil sonuçlarınız e-Nabız'a yüklenmiştir. Sonuçlarınızı enabiz.gov.tr adresinden görüntüleyebilirsiniz." },
  { id: 'l32', label: 'legit', category: 'kisisel', text: 'Kurban Bayramınızı en içten dileklerimizle kutlarız. Sağlıklı ve mutlu günler dileriz. Kardeşler Market' },
  { id: 'l33', label: 'legit', category: 'banka', text: "Yapı Kredi Mobil'e giriş için doğrulama kodunuz: 739201. Bu kodu yalnızca Yapı Kredi Mobil uygulamasına girin, kimseyle paylaşmayın." },
  { id: 'l34', label: 'legit', category: 'kargo', text: 'DHL Express: Gönderiniz için 120 TL gümrük vergisi oluşmuştur. Ödemeyi https://www.dhl.com/tr adresinden yapabilirsiniz.' },
  { id: 'l35', label: 'legit', category: 'kisisel', text: "Merhaba, kombi bakımı için teknisyen yarın saat 11'de gelecek, evde olabilir misiniz?" },
  { id: 'l36', label: 'legit', category: 'banka', text: 'QNB: Kartınıza özel 3 taksit fırsatı! Detaylar https://www.qnb.com.tr/kampanyalar adresinde.' },
];
