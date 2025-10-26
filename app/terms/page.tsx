import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - JSONFormatterPro',
  description: 'Terms of service for using JSONFormatterPro (By Testcraft.in). Please read these terms before using the site.',
  keywords: ['terms of service', 'terms jsonformatter', 'legal']
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">By using JSONFormatterPro (By Testcraft.in) you agree to the following terms. Use of the tools is at your own risk. We provide client-side utilities for formatting, validating, comparing and converting JSON.</p>

      <section className="prose dark:prose-invert max-w-4xl">
        <h2>Usage</h2>
        <p>Tools are provided free of charge. You may use them for personal and commercial purposes, but you are responsible for the content you process.</p>

        <h2>Liability</h2>
        <p>We are not liable for any loss or damage arising from the use of this site. Always review output and backups before using programmatically.</p>

        <h2>Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of changes.</p>
      </section>
    </div>
  )
}
