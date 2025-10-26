import { Metadata } from 'next'
import JsonFormatter from '@/components/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Formatter - Format & Beautify JSON Online',
  description: 'Free online JSON formatter and beautifier. Format, indent, and prettify your JSON data with customizable spacing. Real-time validation and syntax highlighting.',
  keywords: ['json formatter', 'beautify json', 'format json', 'prettify json', 'json indentation'],
}

export default function JsonFormatterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Formatter & Beautifier
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Transform minified JSON into beautifully formatted, readable code with proper indentation and syntax highlighting.
        </p>
      </div>

      <JsonFormatter />

      <section className="mt-16 prose dark:prose-invert max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          How to Use the JSON Formatter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li><strong>Paste your JSON:</strong> Copy and paste your minified or unformatted JSON into the input box</li>
          <li><strong>Click Format:</strong> Press the &quot;Format/Beautify&quot; button or use Ctrl/Cmd + Enter</li>
          <li><strong>View results:</strong> Your formatted JSON will appear in the output box with proper indentation</li>
          <li><strong>Customize spacing:</strong> Choose between 2, 3, or 4 space indentation</li>
          <li><strong>Copy or Download:</strong> Use the copy button or download the formatted JSON file</li>
        </ol>
      </section>
    </div>
  )
}
