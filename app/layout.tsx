import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

// Fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://return0.iiitdwd.ac.in'),
  title: {
    default: 'RETURN 0; — Competitive Programming Club | IIIT Dharwad',
    template: '%s | RETURN 0;',
  },
  description:
    'RETURN 0; is the official Competitive Programming Club of IIIT Dharwad. Join us to master algorithms, participate in contests, and become a problem-solving champion.',
  keywords: [
    'competitive programming',
    'IIIT Dharwad',
    'coding club',
    'algorithms',
    'data structures',
    'Codeforces',
    'LeetCode',
    'CodeChef',
    'programming contests',
    'RETURN 0',
  ],
  authors: [{ name: 'RETURN 0; Team', url: 'https://return0.iiitdwd.ac.in' }],
  creator: 'RETURN 0; - IIIT Dharwad',
  publisher: 'IIIT Dharwad',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://return0.iiitdwd.ac.in',
    siteName: 'RETURN 0;',
    title: 'RETURN 0; — Competitive Programming Club | IIIT Dharwad',
    description:
      'Master algorithms, conquer contests, and join the elite community of problem solvers at IIIT Dharwad.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RETURN 0; - Competitive Programming Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RETURN 0; — Competitive Programming Club | IIIT Dharwad',
    description:
      'Master algorithms, conquer contests, and join the elite community of problem solvers.',
    images: ['/og-image.png'],
    creator: '@return0_iiitdwd',
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
    { media: '(prefers-color-scheme: light)', color: '#0A0A0F' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neon-pink focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}