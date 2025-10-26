import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdInjector from '@/components/AdInjector'

export const metadata: Metadata = {
  metadataBase: new URL('https://jsonformatter.pro'),
  title: {
    default: 'Free Online JSON Formatter & Validator | JSONFormatterPro',
    template: '%s | JSONFormatterPro'
  },
  description: 'Professional JSON Formatter, Validator, Beautifier & Converter. Format, validate, minify JSON online. Free JSON tools including tree view, comparison, CSV/XML/YAML conversion.',
  keywords: [
    'JSON formatter',
    'JSON validator',
    'JSON beautifier',
    'JSON minifier',
    'JSON editor',
    'JSON tree view',
    'JSON to CSV',
    'JSON to XML',
    'JSON to YAML',
    'JSON compare',
    'JSONLint',
    'format JSON online',
    'validate JSON',
    'prettify JSON'
  ],
  authors: [{ name: 'JSONFormatterPro' }],
  creator: 'JSONFormatterPro',
  publisher: 'JSONFormatterPro',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jsonformatter.pro',
    title: 'Free Online JSON Formatter & Validator',
    description: 'Professional JSON Formatter, Validator, Beautifier & Converter. Format, validate, minify JSON online.',
  siteName: 'JSONFormatterPro',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'JSONFormatterPro'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online JSON Formatter & Validator',
    description: 'Professional JSON Formatter, Validator, Beautifier & Converter',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="monetag" content="a3ba1c9ee279414a909e456501d57989" />
        <link rel="canonical" href="https://jsonformatter.pro" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            {/* header and top-of-main ad slots */}
            <AdInjector positions={['header','main-top']} />

            <main className="flex-grow">
              {children}
            </main>

            {/* bottom-of-main and footer ad slots */}
            <AdInjector positions={['main-bottom','footer']} />

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
