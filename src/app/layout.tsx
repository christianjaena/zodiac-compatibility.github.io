import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Zodiac Compatibility',
  description: 'Explore the compatibility of zodiac signs'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang='en'>
      <head>
        <meta name='google-adsense-account' content='ca-pub-7236582881991356' />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className='flex-1 flex flex-col'>{children}</div>
        <footer className='w-full border-t border-white/15 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md mt-12 py-6 mt-auto'>
          <div className='max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-2 text-sm text-zinc-700 dark:text-zinc-300'>
            <div className='flex gap-4 mb-2 sm:mb-0'>
              <Link href='/' className='hover:text-violet-700 dark:hover:text-violet-300 transition'>Home</Link>
              <Link href='/about-us' className='hover:text-violet-700 dark:hover:text-violet-300 transition'>About Us</Link>
              <Link href='/contact-us' className='hover:text-violet-700 dark:hover:text-violet-300 transition'>Contact Us</Link>
            </div>
            <div className='text-xs text-zinc-400'>
              &copy; {new Date().getFullYear()} Zodiac Compatibility
            </div>
          </div>
        </footer>
        {adsenseId ? (
          <Script
            id='adsense-script'
            async
            strategy='afterInteractive'
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin='anonymous'
          />
        ) : null}
      </body>
    </html>
  );
}
