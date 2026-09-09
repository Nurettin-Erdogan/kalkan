'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { analyzeContent, type Analysis } from '../lib/analyze';

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
    try {
      await navigator.clipboard.writeText(resultCopy);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function loadExample(text: string) {
    setContent(text);
    setOcrStatus('');
    setImageName('');
    setCopied(false);
    setAnalysis(analyzeContent(text));
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
        langPath: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tessdata`,
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
