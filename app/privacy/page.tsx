import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - JSONFormatterPro',
  description: 'Privacy policy for JSONFormatterPro. We process data client-side and do not collect or store your JSON inputs.',
  keywords: ['privacy policy', 'jsonformatter privacy', 'data policy']
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">At JSONFormatterPro (By Testcraft.in) we value your privacy. We process JSON data locally in your browser and do not transmit or store your JSON inputs on our servers.</p>

      <section className="prose dark:prose-invert max-w-4xl">
        <h2>Data Processing</h2>
        <p>All formatting, validation, comparison, and conversion occur client-side. We do not collect, store, or share your JSON data.</p>

        <h2>Analytics & Cookies</h2>
        <p>This site does not include analytics or third-party trackers by default. If analytics are added later, you will be informed and given an option to opt out.</p>

        <h2>Contact</h2>
        <p>If you have any privacy concerns, contact us via the site contact details.</p>
      </section>
    </div>
  )
}
