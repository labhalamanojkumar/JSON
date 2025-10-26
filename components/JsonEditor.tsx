'use client'

interface JsonEditorProps {
  input: string
  output: string
  onInputChange: (value: string) => void
}

export default function JsonEditor({ input, output, onInputChange }: JsonEditorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Input JSON
        </label>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste your JSON here... e.g., {&quot;name&quot;: &quot;John&quot;, &quot;age&quot;: 30}"
          className="w-full h-96 p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100"
          spellCheck={false}
        />
      </div>

      {/* Output Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Formatted Output
        </label>
        <pre className="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto text-gray-900 dark:text-gray-100">
          {output || 'Formatted JSON will appear here...'}
        </pre>
      </div>
    </div>
  )
}
