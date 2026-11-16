import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kalkan.enurettin89.chatgpt.site';
const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Kalkan — Şüpheli mesaj ve bağlantı analizi',
  description: 'Mesaj ve bağlantılardaki dolandırıcılık risklerini sade Türkçeyle açıklar.',
  openGraph: {
    title: 'Kalkan',
    description: 'Şüphe duyduysan, önce Kalkan’a sor.',
    type: 'website',
    locale: 'tr_TR',
    images: [{ url: `${siteBasePath}/og.jpg`, width: 1200, height: 630, alt: 'Kalkan dolandırıcılık risk analizi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkan',
    description: 'Şüphe duyduysan, önce Kalkan’a sor.',
    images: [`${siteBasePath}/og.jpg`],
  },
};

// GitHub Pages HTTP başlığı eklemeye izin vermediği için CSP sayfaya meta etiketiyle de eklenir.
// connect-src 'self': yapıştırılan metin ve görseller sayfadan hiçbir dış sunucuya gönderilemez;
// "veri cihazdan çıkmaz" vaadini tarayıcı zorunlu kılar. (frame-ancestors meta ile çalışmadığı için
// yalnızca HTTP başlığında, next.config.ts içinde tanımlıdır.)
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>{children}</body>
    </html>
  );
}
