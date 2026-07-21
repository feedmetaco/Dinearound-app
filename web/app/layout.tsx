import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/lib/providers';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DineAround - Track Your Restaurant Visits',
  description: 'Discover, log, and remember your favorite restaurants',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DineAround',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Avoids a flash of the wrong theme before hydration — see public/theme-init.js */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className={`${jakarta.variable} ${dmSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
