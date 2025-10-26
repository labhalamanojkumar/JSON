import { Metadata } from 'next'
import JsonFormatter from '@/components/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Converter - Convert JSON to CSV, XML, YAML',
  description: 'Convert JSON to CSV, XML, or YAML format online. Free JSON converter with instant conversion and download options.',
  keywords: ['json converter', 'json to csv', 'json to xml', 'json to yaml', 'convert json'],
}

export default function JsonConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Converter
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Convert JSON to CSV, XML, or YAML format with one click. Perfect for data migration and format transformation.
        </p>
      </div>

      <JsonFormatter />

      <section className="mt-16 prose dark:prose-invert max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Supported Conversion Formats
        </h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">JSON to CSV</h3>
            <p>
              Convert JSON arrays to CSV format for use in spreadsheet applications like Excel, Google Sheets, and database imports.
              Perfect for data analysis and reporting.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">JSON to XML</h3>
            <p>
              Transform JSON to XML format with proper schema mapping. Useful for legacy systems, SOAP APIs, and applications
              that require XML data format.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">JSON to YAML</h3>
            <p>
              Convert JSON to YAML (YAML Ain&apos;t Markup Language) for more human-readable configuration files.
              Commonly used in CI/CD pipelines, Kubernetes, and Docker configurations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
