import type { Metadata } from 'next'
import './globals.css'
import ThemeProviderClient from '@/components/ThemeProviderClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdInjector from '@/components/AdInjector'
import { getDb } from '@/utils/db'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // try to read monetag provider from DB (first enabled provider with metaname)
  let monetagMeta: string | null = null
  try {
    const db = await getDb()
    if (db) {
      const col = db.collection('ad_providers')
      const providers = await col.find({ type: 'monetag' }).toArray()
      const p = providers.find(pr => pr.config && (pr.config.enabled || pr.config.metaname))
      if (p && p.config && p.config.metaname && typeof p.config.metaname === 'string') monetagMeta = p.config.metaname
    }
  } catch (e) {
    // ignore DB errors at render time; fallback to no meta
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {monetagMeta ? <meta name="monetag" content="f5698bcc36a6466bb735717bce4e6275" /> : null}
        <link rel="canonical" href="https://jsonformatter.pro" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeProviderClient>
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
  </ThemeProviderClient>
      </body>
    </html>
  )
}
