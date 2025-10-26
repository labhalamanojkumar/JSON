import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fix JSON Errors - Common JSON Problems & Solutions',
  description: 'Troubleshoot and fix common JSON errors: unexpected token, trailing commas, missing quotes, and more. Learn how to debug JSON parsing problems quickly.',
  keywords: ['fix json errors', 'json parse error', 'unexpected token', 'json troubleshooting'],
}

export default function FixJsonErrorsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Fix JSON Errors</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Learn how to identify and fix common JSON errors that prevent parsing and processing. Below are typical mistakes and how to resolve them.
      </p>

      <section className="prose dark:prose-invert max-w-4xl">
        <h2>Common Issues</h2>
        <h3>1. Unexpected Token</h3>
        <p>This usually means malformed JSON. Check for missing commas, extra commas, or unescaped characters.</p>

        <h3>2. Trailing Commas</h3>
        <p>JSON does not allow trailing commas. Remove any extra commas after the last item in objects or arrays.</p>

        <h3>3. Missing Quotes</h3>
        <p>Keys and string values must be wrapped with double quotes in JSON. Use tools to highlight the offending line.</p>

        <h3>4. Comments in JSON</h3>
        <p>JSON does not support comments. Remove any comments or use a JSON superset (like JSONC) on the client side only.</p>

        <h3>Debugging Tips</h3>
        <ul>
          <li>Use a linter or validator to get exact line/column errors.</li>
          <li>Paste JSON into the validator tool on this site for instant feedback.</li>
          <li>Break large JSON into smaller chunks to isolate problems.</li>
        </ul>
      </section>
    </div>
  )
}
