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

function normalizeForMatching(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/\s+/g, ' ');
}

function extractLinks(value: string) {
  const pattern = /(?:https?:\/\/|www\.)[^\s<>"']+|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s<>"']*)?/gi;
  return [...value.matchAll(pattern)]
    .filter((match) => match.index === 0 || value[match.index - 1] !== '@')
    .map((match) => match[0].replace(/[),.;!?]+$/, ''));
}

function isOfficial(hostname: string) {
  return officialDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function uniqueFindings(findings: Finding[]) {
  return findings.filter((finding, index, list) => list.findIndex((item) => item.title === finding.title) === index);
}

export function analyzeContent(input: string): Analysis {
  const text = input.trim();
  const searchable = normalizeForMatching(text);
  const findings: Finding[] = [];
  const links = extractLinks(text);

  const add = (title: string, detail: string, points: number, kind: Finding['kind'] = 'warning') => {
    findings.push({ title, detail, points, kind });
  };

  if (/\b(hemen|acil(?:en)?|son (?:uyari|sans)|bugun (?:icinde|son)|dakika icinde|gecikmeden|simdi (?:tikla|onayla)|sure dolmadan)\b/i.test(searchable)) {
    add('Acele ettiren dil', 'Mesaj, düşünmeden işlem yapman için zaman baskısı kuruyor.', 14);
  }
  if (/(?:sifre|parola|pin|sms kodu|dogrulama kodu|kart numarasi|cvv|guvenlik kodu|kimlik bilgisi|tc kimlik).{0,60}\b(?:paylasin|gonderin|girin|yazin|iletin|soyleyin|dogrulayin|dogrulamak)\b/i.test(searchable)) {
    add('Hassas bilgi talebi', 'Şifre, kart veya doğrulama bilgisi isteyen mesajlar yüksek risk taşır.', 26, 'danger');
  }
  if (/(?:\biban\b|\bhavale\b|\beft\b|\bkapora\b|\bkripto\b|\bpapara\b|\bpara (?:gonderin|yatirin|transfer edin)\b|\b(?:odeme|ucret|borc|tutar).{0,50}\b(?:odeyin|ode|yapiniz|yapin|tamamlayin|yatirin|gonderin)\b)/i.test(searchable)) {
    add('Para gönderme talebi', 'Mesaj doğrudan ödeme veya para transferi istiyor.', 18, 'danger');
  }
  if (/(?:\b(?:hesabiniz|kartiniz|hattiniz|paketiniz|kargonuz).{0,55}\b(?:kapan|askiya|bloke|iptal|iade|durdur)|\bicra\b|\bceza (?:uygulan|kesil)|\byasal islem\b|\bhakkinizda islem\b)/i.test(searchable)) {
    add('Tehdit veya kayıp korkusu', 'Hesap kapatma, ceza ya da yasal işlem korkusu kullanılıyor.', 18, 'danger');
  }
  if (/(odul kazand|cekilis|hediye kazand|bedava|ucretsiz iphone|miras|yuksek kazanc)/i.test(searchable)) {
    add('Gerçek olamayacak teklif', 'Beklenmeyen ödül veya aşırı kazanç vaadi dolandırıcılık işareti olabilir.', 17);
  }
  if (/(anydesk|teamviewer|uzaktan baglanti|ekran paylas|uygulamayi indir)/i.test(searchable)) {
    add('Uzaktan erişim isteği', 'Cihazına erişim sağlayan uygulama veya ekran paylaşımı isteniyor.', 32, 'danger');
  }
  if (/(polis|savci|hakim|banka guvenlik|musteri hizmetleri|kargo sirketi).{0,80}(?:benim|bizim|adina|olarak)/i.test(searchable)) {
    add('Yetkili gibi davranma', 'Gönderen kendisini güvenilir bir kurum veya görevli gibi tanıtıyor.', 12);
  }

  for (const rawLink of links) {
    try {
      const normalized = /^https?:\/\//i.test(rawLink) ? rawLink : `https://${rawLink}`;
      const url = new URL(normalized);
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      const normalizedLink = normalizeForMatching(normalized);

      if (isOfficial(host)) {
        add('Resmî alan adı eşleşiyor', `${host} bilinen resmî alan adlarından biri. İçeriği yine de kontrol et.`, 0, 'positive');
      } else {
        const mimicsBrand = brandTokens.some((brand) => host.includes(brand) || normalizedLink.includes(`${brand}.`));
        if (mimicsBrand) add('Taklit alan adı', `${host}, bilinen bir kurumun adına benziyor fakat resmî alan adı değil.`, 32, 'danger');
      }
      if (url.protocol !== 'https:') add('Güvenli bağlantı kullanılmıyor', 'Bağlantı HTTPS ile korunmuyor.', 14);
      if (shorteners.includes(host)) add('Kısaltılmış bağlantı', 'Gerçek hedef adres kısa bağlantının arkasına gizlenmiş.', 15);
      if (suspiciousTlds.some((tld) => host.endsWith(tld))) add('Şüpheli alan adı uzantısı', `${host} yaygın resmî kurum uzantılarından farklı bir uzantı kullanıyor.`, 13);
      if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) add('IP adresine yönlendirme', 'Kurumsal alan adı yerine doğrudan IP adresi kullanılmış.', 25, 'danger');
      if (host.includes('xn--')) add('Gizlenmiş karakterler', 'Alan adı benzer görünen farklı alfabe karakterleri içeriyor olabilir.', 24, 'danger');
      if (url.username || url.password || rawLink.includes('@')) add('Yanıltıcı bağlantı biçimi', 'Bağlantıda gerçek hedefi gizleyebilen kullanıcı bilgisi bulunuyor.', 24, 'danger');
      if ((host.match(/-/g) ?? []).length >= 3) add('Olağandışı alan adı', 'Alan adında normalden fazla tire kullanılmış.', 9);
      if (host.split('.').length >= 5) add('Aşırı uzun alt alan adı', 'Gerçek alan adını fark etmeyi zorlaştıran çok sayıda alt alan kullanılmış.', 10);
    } catch {
      add('Bozuk veya gizlenmiş bağlantı', 'Bağlantı standart bir internet adresi olarak okunamadı.', 12);
    }
  }

  if (links.length === 0) {
    add('Bağlantı bulunamadı', 'Metinde incelenecek bir internet bağlantısı yok. Dil ve talep biçimi analiz edildi.', 0, 'positive');
  }

  const cleanFindings = uniqueFindings(findings);
  const score = Math.min(100, cleanFindings.reduce((sum, finding) => sum + finding.points, 0));
  const hasDangerSignal = cleanFindings.some((finding) => finding.kind === 'danger' && finding.points > 0);
  const level: Analysis['level'] = score >= 65 ? 'high' : score >= 30 || hasDangerSignal ? 'medium' : 'low';
  return { score, level, findings: cleanFindings, links };
}
