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
  'yurticikargo.com', 'araskargo.com.tr', 'mngkargo.com.tr', 'suratkargo.com.tr',
  'turkcell.com.tr', 'vodafone.com.tr', 'turktelekom.com.tr', 'ttnet.com.tr',
  'papara.com', 'ups.com', 'dhl.com',
];

/** Brand tokens used for mimic + lookalike checks (normalized ASCII). */
const brandTokens = [
  'edevlet', 'e-devlet', 'gib', 'ptt', 'egm',
  'akbank', 'garanti', 'isbank', 'yapikredi', 'ziraat', 'halkbank', 'vakifbank', 'qnb', 'denizbank', 'teb',
  'yurtici', 'aras', 'mng', 'surat', 'ups', 'dhl',
  'turkcell', 'vodafone', 'turktelekom', 'ttnet',
  'papara',
];

const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy', 'is.gd'];
const suspiciousTlds = ['.xyz', '.top', '.click', '.buzz', '.shop', '.live', '.info', '.vip', '.online', '.icu', '.cfd'];
const ignoredHostLabels = new Set([
  'www', 'com', 'net', 'org', 'tr', 'gov', 'edu', 'co', 'info', 'app', 'dev', 'io', 'me', 'tv', 'uk', 'us',
]);

const kindRank: Record<Finding['kind'], number> = { danger: 0, warning: 1, positive: 2 };

export function normalizeForMatching(value: string) {
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

export function sortFindings(findings: Finding[]) {
  return [...findings].sort((a, b) => {
    const byKind = kindRank[a.kind] - kindRank[b.kind];
    if (byKind !== 0) return byKind;
    return b.points - a.points;
  });
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

/** Levenshtein distance for short brand/host labels. */
export function editDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function lookalikeBrand(hostname: string): string | null {
  const labels = hostname
    .toLowerCase()
    .replace(/^www\./, '')
    .split('.')
    .flatMap((part) => part.split('-'))
    .map((part) => part.replace(/[^a-z0-9]/g, ''))
    .filter((part) => part.length >= 4 && !ignoredHostLabels.has(part));

  for (const label of labels) {
    for (const brand of brandTokens) {
      const needle = brand.replaceAll('-', '');
      if (needle.length < 4) continue;
      if (label === needle) continue;
      if (label.includes(needle) || needle.includes(label)) continue;
      const threshold = needle.length <= 5 ? 1 : 2;
      if (editDistance(label, needle) <= threshold) return brand;
    }
  }
  return null;
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
  if (
    /(?:\b0\s*850\b|\b0850[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}\b|\b0\s*888\b|\b0888[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}\b)/i.test(searchable)
    && /(?:ara(?:yin|niz|man)|arayin|musteri|destek|temsilci|guvenlik|hat)/i.test(searchable)
  ) {
    add('Şüpheli destek hattı', 'Mesajdaki numarayı aramak yerine kurumu senin bildiğin resmî kanaldan ara.', 16, 'danger');
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
        const mimicsBrand = brandTokens.some((brand) => {
          const needle = brand.replaceAll('-', '');
          return host.includes(needle) || normalizedLink.includes(`${needle}.`) || host.split(/[.-]/).includes(needle);
        });
        if (mimicsBrand) {
          add('Taklit alan adı', `${host}, bilinen bir kurumun adına benziyor fakat resmî alan adı değil.`, 32, 'danger');
        } else {
          const twin = lookalikeBrand(host);
          if (twin) {
            add(
              'Benzer alan adı (lookalike)',
              `${host}, “${twin}” adına çok benzeyen bir yazım kullanıyor; resmî alan adı olmayabilir.`,
              30,
              'danger',
            );
          }
        }
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

  const cleanFindings = sortFindings(uniqueFindings(findings));
  const score = Math.min(100, cleanFindings.reduce((sum, finding) => sum + finding.points, 0));
  const hasDangerSignal = cleanFindings.some((finding) => finding.kind === 'danger' && finding.points > 0);
  const level: Analysis['level'] = score >= 65 ? 'high' : score >= 30 || hasDangerSignal ? 'medium' : 'low';
  return { score, level, findings: cleanFindings, links };
}
