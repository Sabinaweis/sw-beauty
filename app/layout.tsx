import { Metadata } from 'next';
import { Cormorant_Garamond, Geist } from 'next/font/google';
import './globals.css';

// Optimalizované fonty pomocí next/font/google
const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
});

const geist = Geist({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  preload: true,
});

export const metadata: Metadata = {
  title: 'SW Beauty Hodonín | HIFU, Endospheres, Kosmetika | Luxusní péče',
  description: 'Luxusní kosmetický salon v Hodoníně. HIFU 7D lifting, Endospheres terapie, Hydrafacial, prodlužování vlasů. Online rezervace termínů. U Cihelny 1326/4.',
  keywords: 'kosmetika Hodonín, HIFU lifting, Endospheres, Hydrafacial, prodlužování vlasů, kosmetický salon, laminace obočí, lifting řas',
  openGraph: {
    type: 'website',
    url: 'https://swbeauty.cz',
    title: 'SW Beauty Hodonín | HIFU, Endospheres, Kosmetika',
    description: 'Luxusní kosmetický salon v Hodoníně. HIFU 7D lifting, Endospheres terapie, profesionální kosmetika. Rezervujte termín online.',
    images: ['https://swbeauty.cz/images/hero-image.jpg'],
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SW Beauty Hodonín | HIFU, Endospheres, Kosmetika',
    description: 'Luxusní kosmetický salon v Hodoníně. HIFU 7D lifting, Endospheres terapie, profesionální kosmetika.',
    images: ['https://swbeauty.cz/images/hero-image.jpg'],
  },
  icons: {
    icon: '/favicon.png',
  },
  other: {
    'disabled-font-classes': 'font-instrument-serif,font-roboto,font-montserrat,font-poppins,font-merriweather,font-bricolage,font-jakarta,font-manrope,font-space-grotesk,font-work-sans,font-pt-serif,font-geist-mono,font-space-mono,font-nunito,font-quicksand',
  },
};

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
      className={`${cormorant.variable} ${geist.variable}`}
    >
      <body className="antialiased selection:bg-stone-200 selection:text-stone-900 text-stone-800 relative">
        {children}
      </body>
    </html>
  );
}