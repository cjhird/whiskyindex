import type { Metadata } from 'next';
import { IBM_Plex_Mono, Public_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MarketTape } from '@/components/MarketTape';
import { SiteDisclaimer } from '@/components/SiteDisclaimer';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whiskyindex.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'WhiskyIndex',
    template: '%s · WhiskyIndex',
  },
  description:
    'Secondary-market auction analytics for rare whisky collectors — marks, comps, and portfolio tracking.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${publicSans.variable} ${ibmPlexMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <MarketTape />
          <SiteDisclaimer />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
