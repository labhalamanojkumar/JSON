import { Metadata } from 'next'
import JsonFormatter from '@/components/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Compare - Compare Two JSON Files Online',
  description: 'Compare two JSON files side by side with difference highlighting. Find added, removed, and modified values instantly.',
  keywords: ['json compare', 'json diff', 'compare json', 'json difference', 'json comparison tool'],
}

export default function JsonComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Comparison Tool
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Compare two JSON files side by side with detailed difference highlighting. Identify changes, additions, and deletions instantly.
        </p>
      </div>

      <JsonFormatter />

      <section className="mt-16 prose dark:prose-invert max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          JSON Comparison Features
        </h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Difference Indicators</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>➕ Added:</strong> Properties or values that exist in the second JSON but not in the first</li>
            <li><strong>➖ Removed:</strong> Properties or values that exist in the first JSON but not in the second</li>
            <li><strong>✏️ Modified:</strong> Properties that exist in both JSONs but with different values</li>
            <li><strong>🔄 Type Changed:</strong> Properties where the data type has changed</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">Use Cases</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Compare API responses before and after updates</li>
            <li>Verify configuration file changes</li>
            <li>Debug JSON data transformations</li>
            <li>Review code changes in JSON files</li>
            <li>Validate data migrations</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
