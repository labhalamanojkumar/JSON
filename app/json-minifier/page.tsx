import { Metadata } from 'next'
import JsonFormatter from '@/components/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Minifier - Compress JSON Online',
  description: 'Free JSON minifier to compress and reduce JSON file size. Remove whitespace and newlines for optimized data transfer.',
  keywords: ['json minifier', 'compress json', 'minify json', 'json compressor', 'reduce json size'],
}

export default function JsonMinifierPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Minifier
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Compress your JSON by removing unnecessary whitespace and newlines. Perfect for reducing file size and optimizing data transfer.
        </p>
      </div>

      <JsonFormatter />

      <section className="mt-16 prose dark:prose-invert max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Why Minify JSON?
        </h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Benefits of JSON Minification</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Reduced File Size:</strong> Minified JSON can be 30-50% smaller than formatted JSON</li>
            <li><strong>Faster Loading:</strong> Smaller files load faster in web applications and APIs</li>
            <li><strong>Lower Bandwidth:</strong> Reduced data transfer costs, especially important for mobile apps</li>
            <li><strong>Improved Performance:</strong> Less data to parse means faster JSON processing</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">When to Use Minified JSON</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>API responses in production environments</li>
            <li>Configuration files in deployed applications</li>
            <li>Data transfer in bandwidth-constrained scenarios</li>
            <li>Storage optimization for large JSON datasets</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
