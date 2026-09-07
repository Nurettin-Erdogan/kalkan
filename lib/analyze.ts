export type Finding = {
  title: string;
  detail: string;
  points: number;
  kind: 'danger' | 'warning' | 'positive';
};

export type Analysis = {
  score: number;
  level: 'low' | 'medium' | 'high';
  findings: Finding[];
  links: string[];
};

const officialDomains = [
  'turkiye.gov.tr', 'gib.gov.tr', 'ptt.gov.tr', 'egm.gov.tr',
  'akbank.com', 'garanti.com.tr', 'isbank.com.tr', 'yapikredi.com.tr',
  'ziraatbank.com.tr', 'halkbank.com.tr', 'vakifbank.com.tr', 'qnb.com.tr',
  'denizbank.com', 'teb.com.tr',
];

const brandTokens = ['edevlet', 'e-devlet', 'gib', 'ptt', 'akbank', 'garanti', 'isbank', 'yapikredi', 'ziraat', 'halkbank', 'vakifbank', 'qnb', 'denizbank', 'teb'];
const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy', 'is.gd'];
const suspiciousTlds = ['.xyz', '.top', '.click', '.buzz', '.shop', '.live', '.info', '.vip', '.online'];

function isOfficial(hostname: string) {
  return officialDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function uniqueFindings(findings: Finding[]) {
  return findings.filter((finding, index, list) => list.findIndex((item) => item.title === finding.title) === index);
}

export function analyzeContent(input: string): Analysis {
  const text = input.trim();
  const lower = text.toLocaleLowerCase('tr-TR');
  const findings: Finding[] = [];
  const rawLinks = text.match(/(?:https?:\/\/|www\.)[^\s<>"']+/gi) ?? [];
  const links = rawLinks.map((link) => link.replace(/[),.;!?]+$/, ''));

  const add = (title: string, detail: string, points: number, kind: Finding['kind'] = 'warning') => {
    findings.push({ title, detail, points, kind });
  };

  if (/(hemen|acil|son (?:uyarı|şans)|bugün içinde|dakika içinde|gecikmeden|şimdi tıkla)/i.test(lower)) {
    add('Acele ettiren dil', 'Mesaj, düşünmeden işlem yapman için zaman baskısı kuruyor.', 14);
  }
  if (/(şifre|parola|sms kodu|doğrulama kodu|kart numarası|cvv|güvenlik kodu|kimlik bilg)/i.test(lower)) {
    add('Hassas bilgi talebi', 'Şifre, kart veya doğrulama bilgisi isteyen mesajlar yüksek risk taşır.', 26, 'danger');
  }
  if (/(iban|havale|eft|para gönder|ödeme yap|ücret yatır|kapora|kripto|papara)/i.test(lower)) {
    add('Para gönderme talebi', 'Mesaj doğrudan ödeme veya para transferi istiyor.', 18, 'danger');
  }
  if (/(hesabınız.*(?:kapan|askıya|bloke)|icra|ceza uygulan|yasal işlem|hakkınızda işlem|paketiniz iptal)/i.test(lower)) {
    add('Tehdit veya kayıp korkusu', 'Hesap kapatma, ceza ya da yasal işlem korkusu kullanılıyor.', 18, 'danger');
  }
  if (/(ödül kazand|çekiliş|hediye kazand|bedava|ücretsiz iphone|miras|yüksek kazanç)/i.test(lower)) {
    add('Gerçek olamayacak teklif', 'Beklenmeyen ödül veya aşırı kazanç vaadi dolandırıcılık işareti olabilir.', 17);
  }
  if (/(anydesk|teamviewer|uzaktan bağlantı|ekran paylaş|uygulamayı indir)/i.test(lower)) {
    add('Uzaktan erişim isteği', 'Cihazına erişim sağlayan uygulama veya ekran paylaşımı isteniyor.', 32, 'danger');
  }
  if (/(polis|savcı|hakim|banka güvenlik|müşteri hizmetleri|kargo şirketi).*(?:benim|bizim|adına|olarak)/i.test(lower)) {
    add('Yetkili gibi davranma', 'Gönderen kendisini güvenilir bir kurum veya görevli gibi tanıtıyor.', 12);
  }

  for (const rawLink of links) {
    try {
      const normalized = rawLink.startsWith('www.') ? `https://${rawLink}` : rawLink;
      const url = new URL(normalized);
      const host = url.hostname.toLowerCase().replace(/^www\./, '');

      if (isOfficial(host)) {
        add('Resmî alan adı eşleşiyor', `${host} bilinen resmî alan adlarından biri. İçeriği yine de kontrol et.`, 0, 'positive');
      } else {
        const mimicsBrand = brandTokens.some((brand) => host.includes(brand));
        if (mimicsBrand) add('Taklit alan adı', `${host}, bilinen bir kurumun adına benziyor fakat resmî alan adı değil.`, 32, 'danger');
      }
      if (url.protocol !== 'https:') add('Güvenli bağlantı kullanılmıyor', 'Bağlantı HTTPS ile korunmuyor.', 14);
      if (shorteners.includes(host)) add('Kısaltılmış bağlantı', 'Gerçek hedef adres kısa bağlantının arkasına gizlenmiş.', 15);
      if (suspiciousTlds.some((tld) => host.endsWith(tld))) add('Şüpheli alan adı uzantısı', `${host} yaygın resmî kurum uzantılarından farklı bir uzantı kullanıyor.`, 13);
      if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) add('IP adresine yönlendirme', 'Kurumsal alan adı yerine doğrudan IP adresi kullanılmış.', 25, 'danger');
      if (host.includes('xn--')) add('Gizlenmiş karakterler', 'Alan adı benzer görünen farklı alfabe karakterleri içeriyor olabilir.', 24, 'danger');
      if (rawLink.includes('@')) add('Yanıltıcı bağlantı biçimi', 'Bağlantıda gerçek hedefi gizleyebilen @ işareti bulunuyor.', 24, 'danger');
      if ((host.match(/-/g) ?? []).length >= 3) add('Olağandışı alan adı', 'Alan adında normalden fazla tire kullanılmış.', 9);
    } catch {
      add('Bozuk veya gizlenmiş bağlantı', 'Bağlantı standart bir internet adresi olarak okunamadı.', 12);
    }
  }

  if (links.length === 0) {
    add('Bağlantı bulunamadı', 'Metinde incelenecek bir internet bağlantısı yok. Dil ve talep biçimi analiz edildi.', 0, 'positive');
  }

  const cleanFindings = uniqueFindings(findings);
  const score = Math.min(100, cleanFindings.reduce((sum, finding) => sum + finding.points, 0));
  const level: Analysis['level'] = score >= 65 ? 'high' : score >= 30 ? 'medium' : 'low';
  return { score, level, findings: cleanFindings, links };
}
