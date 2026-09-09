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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
