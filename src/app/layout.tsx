import type { Metadata } from "next";
import { Inter, Poppins, Lato, Noto_Sans } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { MyProvider } from "@/context/DynamicContext";
import localFont from 'next/font/local';
import Script from 'next/script';
import { initPerformanceMonitoring } from '@/utils/performance-monitor';

const inter = Inter({ subsets: ["latin"] });

// Optimize Google Fonts
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-poppins',
});

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-lato',
});

const notoSans = Noto_Sans({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans',
});

// Local font
const parafina = localFont({
  src: './components/sections/dynamic/contents/fonts/parafina.woff2',
  display: 'swap',
  preload: true,
  variable: '--font-parafina',
});

export const metadata: Metadata = {
  title: {
    default: 'Your Site Title',
    template: '%s | Your Site Title'
  },
  description: 'Your site description',
  keywords: ['blog', 'travel', 'gardening', 'development'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-site-url.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-us',
    },
  },
  openGraph: {
    title: 'Your Site Title',
    description: 'Your site description',
    url: 'https://your-site-url.com',
    siteName: 'Your Site Name',
    images: [
      {
        url: 'https://your-site-url.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Site Title',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Site Title',
    description: 'Your site description',
    creator: '@yourusername',
    images: ['https://your-site-url.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
};

// Dynamically import Navbar and Footer
const Navbar = dynamic(() => import("@/app/components/global/header/Navbar"));
const Footer = dynamic(() => import("@/app/components/global/footer/Footer"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} antialiased ${poppins.variable} ${lato.variable} ${notoSans.variable} ${parafina.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Add structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Your Site Title',
              url: 'https://your-site-url.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://your-site-url.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Initialize performance monitoring */}
        <Script
          id="performance-monitoring"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(${initPerformanceMonitoring.toString()})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MyProvider>
          <Navbar />
          <main id="main-content" role="main">
            {children}
          </main>
          <Footer />
        </MyProvider>
      </body>
    </html>
  );
}