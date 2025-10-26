import { Metadata } from 'next'
import JsonFormatter from '@/components/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Validator - Validate JSON Online Free',
  description: 'Free JSON validator with real-time syntax error detection. Validate your JSON data instantly with detailed error messages showing line and column numbers.',
  keywords: ['json validator', 'validate json', 'json syntax checker', 'json linter', 'json errors'],
}

export default function JsonValidatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Validator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Validate your JSON data with real-time error detection. Get detailed error messages with exact line and column numbers.
        </p>
      </div>

      <JsonFormatter />

      <section className="mt-16 prose dark:prose-invert max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Common JSON Validation Errors
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Missing Quotes</h3>
            <p>All keys and string values must be enclosed in double quotes. Single quotes are not valid in JSON.</p>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mt-2">
              <code>❌ {`{name: 'John'}`}</code>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded mt-2">
              <code>✅ {`{"name": "John"}`}</code>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Trailing Commas</h3>
            <p>JSON does not allow trailing commas after the last element in objects or arrays.</p>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mt-2">
              <code>❌ {`{"name": "John",}`}</code>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded mt-2">
              <code>✅ {`{"name": "John"}`}</code>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Unescaped Characters</h3>
            <p>Special characters in strings must be properly escaped with backslashes.</p>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mt-2">
              <code>❌ {`{"path": "C:\\Users\\file"}`}</code>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded mt-2">
              <code>✅ {`{"path": "C:\\\\Users\\\\file"}`}</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
