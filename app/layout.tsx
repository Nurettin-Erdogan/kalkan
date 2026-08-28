import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kalkan — Şüpheli mesaj ve bağlantı analizi',
  description: 'Mesaj ve bağlantılardaki dolandırıcılık risklerini sade Türkçeyle açıklar.',
  openGraph: {
    title: 'Kalkan',
    description: 'Şüphe duyduysan, önce Kalkan’a sor.',
    type: 'website',
    locale: 'tr_TR',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Kalkan dolandırıcılık risk analizi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkan',
    description: 'Şüphe duyduysan, önce Kalkan’a sor.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
