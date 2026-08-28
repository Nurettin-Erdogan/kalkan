'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type Finding = {
  title: string;
  detail: string;
  points: number;
  kind: 'danger' | 'warning' | 'positive';
};

type Analysis = {
  score: number;
  level: 'low' | 'medium' | 'high';
  findings: Finding[];
  links: string[];
};

const examples = [
  {
    label: 'Sahte kargo mesajı',
    text: 'Kargonuz teslim edilemedi. 14,90 TL yeniden teslimat ücreti için hemen ödeme yapın: http://ptt-teslimat-merkezi.xyz/odeme',
  },
  {
    label: 'Sahte banka mesajı',
    text: 'Hesabınız güvenlik nedeniyle askıya alınacaktır. Mobil bankacılık şifrenizi doğrulamak için acilen https://isbank-guvenlik.info adresine giriş yapın.',
  },
  {
    label: 'Normal mesaj',
    text: 'Merhaba, yarın saat 14.00 için oluşturduğunuz servis randevusunu hatırlatmak isteriz. İyi günler.',
  },
];

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

function analyzeContent(input: string): Analysis {
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

export default function Home() {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [imageName, setImageName] = useState('');
  const remaining = 1600 - content.length;

  const resultCopy = useMemo(() => {
    if (!analysis) return '';
    const level = analysis.level === 'high' ? 'Yüksek risk' : analysis.level === 'medium' ? 'Şüpheli' : 'Düşük risk';
    return `Kalkan analizi: ${level} (${analysis.score}/100)\n${analysis.findings.filter((item) => item.points > 0).map((item) => `• ${item.title}: ${item.detail}`).join('\n')}`;
  }, [analysis]);

  function runAnalysis() {
    if (!content.trim()) return;
    setAnalysis(analyzeContent(content));
    setCopied(false);
  }

  function reset() {
    setContent('');
    setAnalysis(null);
    setCopied(false);
    setOcrStatus('');
    setImageName('');
  }

  async function copyResult() {
    await navigator.clipboard.writeText(resultCopy);
    setCopied(true);
  }

  function loadExample(text: string) {
    setContent(text);
    setAnalysis(null);
    setOcrStatus('');
    setImageName('');
  }

  async function readScreenshot(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setOcrStatus('Lütfen PNG, JPG veya WEBP biçiminde bir görsel seç.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setOcrStatus('Görsel en fazla 8 MB olabilir.');
      return;
    }

    setImageName(file.name);
    setAnalysis(null);
    setOcrStatus('Metin okuma hazırlanıyor…');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('tur', 1, {
        langPath: '/tessdata',
        logger: (message) => {
          if (message.status === 'recognizing text') {
            setOcrStatus(`Metin okunuyor… %${Math.round((message.progress ?? 0) * 100)}`);
          }
        },
      });
      const result = await worker.recognize(file);
      await worker.terminate();
      const extracted = result.data.text.trim();
      if (!extracted) {
        setOcrStatus('Görselde okunabilir metin bulunamadı. Daha net bir ekran görüntüsü dene.');
        return;
      }
      setContent(extracted.slice(0, 1600));
      setOcrStatus('Metin cihazında okundu. Şimdi analizi başlatabilirsin.');
    } catch {
      setOcrStatus('Görsel okunamadı. Mesajı kopyalayıp metin alanına yapıştırabilirsin.');
    }
  }

  const levelText = analysis?.level === 'high' ? 'Yüksek risk' : analysis?.level === 'medium' ? 'Şüpheli' : 'Düşük risk';

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Kalkan ana sayfa">
          <span className="brand-icon" aria-hidden="true">K</span>
          <span>Kalkan</span>
        </a>
        <div className="nav-right">
          <span className="local-badge"><i aria-hidden="true" /> Analiz bu cihazda</span>
          <a href="#bilgi">Nasıl çalışır?</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="overline">DİJİTAL DOLANDIRICILIK KALKANI</span>
          <h1>Şüphe duyduysan,<br /><em>önce Kalkan’a sor.</em></h1>
          <p>Mesajı veya bağlantıyı yapıştır. Risk işaretlerini birkaç saniyede, sade Türkçeyle gör.</p>
          <div className="trust-row">
            <span><b>✓</b> Şifre istemez</span>
            <span><b>✓</b> Bağlantıyı açmaz</span>
            <span><b>✓</b> İçeriği saklamaz</span>
          </div>
        </div>

        <section className="analyzer" aria-labelledby="analyzer-title">
          <div className="analyzer-head">
            <div><span className="step">01</span><h2 id="analyzer-title">Şüpheli içeriği ekle</h2></div>
            {content && <button className="text-button" type="button" onClick={reset}>Temizle</button>}
          </div>
          <label htmlFor="content">MESAJ VEYA BAĞLANTI</label>
          <div className="textarea-wrap">
            <textarea
              id="content"
              value={content}
              onChange={(event) => { setContent(event.target.value.slice(0, 1600)); setAnalysis(null); }}
              placeholder={'Örnek: Kargonuz teslim edilemedi. Yeniden teslimat için hemen ödeme yapın: ...'}
              rows={7}
            />
            <span className="counter">{remaining}</span>
          </div>
          <div className="input-divider"><span>veya</span></div>
          <label className="upload-button">
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={readScreenshot} />
            <span aria-hidden="true">▧</span>
            <span><strong>Ekran görüntüsü seç</strong><small>PNG, JPG veya WEBP · En fazla 8 MB</small></span>
            <b aria-hidden="true">↗</b>
          </label>
          {(ocrStatus || imageName) && (
            <p className="ocr-status" role="status" aria-live="polite">
              {imageName && <strong>{imageName}</strong>} {ocrStatus}
            </p>
          )}
          <button className="analyze-button" type="button" onClick={runAnalysis} disabled={!content.trim()}>
            <span aria-hidden="true">✦</span> Riski analiz et
          </button>
          <p className="privacy-note"><span aria-hidden="true">●</span> Yazı ve görseller sunucuya gönderilmez; tarayıcında analiz edilir.</p>
        </section>
      </section>

      <section className="examples" aria-label="Örnek mesajlar">
        <span>DENEMEK İÇİN:</span>
        {examples.map((example) => <button key={example.label} type="button" onClick={() => loadExample(example.text)}>{example.label} <b>↗</b></button>)}
      </section>

      {analysis && (
        <section className={`result result-${analysis.level}`} aria-live="polite">
          <div className="result-score">
            <div className="score-ring" style={{ '--score': `${analysis.score * 3.6}deg` } as React.CSSProperties}>
              <span><strong>{analysis.score}</strong>/100</span>
            </div>
            <div>
              <span className="result-label">KALKAN RİSK PUANI</span>
              <h2>{levelText}</h2>
              <p>{analysis.level === 'high' ? 'Bu içerikle işlem yapma. Bağlantıyı açma ve bilgi paylaşma.' : analysis.level === 'medium' ? 'İşlem yapmadan önce kurumu kendi resmî kanalından doğrula.' : 'Belirgin tehlike az; bu sonuç güvenlik garantisi değildir.'}</p>
            </div>
          </div>
          <div className="findings">
            <h3>Neden bu sonucu verdi?</h3>
            {analysis.findings.map((finding) => (
              <article key={finding.title} className={finding.kind}>
                <span aria-hidden="true">{finding.kind === 'positive' ? '✓' : finding.kind === 'danger' ? '!' : '?'}</span>
                <div><strong>{finding.title}</strong><p>{finding.detail}</p></div>
                {finding.points > 0 && <b>+{finding.points}</b>}
              </article>
            ))}
          </div>
          <div className="safe-actions">
            <div><span className="step">02</span><h3>Şimdi ne yapmalısın?</h3></div>
            <ul>
              <li>Mesajdaki bağlantıyı açma ve numarayı arama.</li>
              <li>Kurumun adresini kendin yazarak veya resmî uygulamasından kontrol et.</li>
              <li>Şifre, kart bilgisi ve SMS doğrulama kodunu kimseyle paylaşma.</li>
            </ul>
            <button type="button" onClick={copyResult}>{copied ? 'Sonuç kopyalandı ✓' : 'Sonucu ailemle paylaş'}</button>
          </div>
        </section>
      )}

      <section className="info" id="bilgi">
        <div><span className="overline">NASIL ÇALIŞIR?</span><h2>Tek bir işarete değil,<br />bütün resme bakar.</h2></div>
        <div className="info-grid">
          <article><span>01</span><h3>Mesajın dili</h3><p>Aciliyet, korkutma, ödül ve hassas bilgi taleplerini arar.</p></article>
          <article><span>02</span><h3>Bağlantının yapısı</h3><p>Taklit alan adlarını, şüpheli uzantıları ve gizlenmiş hedefleri inceler.</p></article>
          <article><span>03</span><h3>Açıklanabilir sonuç</h3><p>Risk puanını hangi işaretlerin yükselttiğini tek tek gösterir.</p></article>
        </div>
      </section>

      <section className="disclaimer">
        <span aria-hidden="true">i</span>
        <p><strong>Önemli:</strong> Kalkan bir risk değerlendirme aracıdır; hiçbir içeriğe kesin güvenlik garantisi vermez. Şüphedeysen işlem yapma ve ilgili kurumun resmî kanalına ulaş.</p>
      </section>

      <footer><span>Kalkan · Güvenli karar için bir adım daha.</span><span>İlk prototip · 2026</span></footer>
    </main>
  );
}
