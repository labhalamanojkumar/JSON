'use client'

import { useState, useMemo } from 'react'

interface JsonComparisonProps {
  input1: string
  input2: string
  onInput2Change: (value: string) => void
}

export default function JsonComparison({ input1, input2, onInput2Change }: JsonComparisonProps) {
  const [differences, setDifferences] = useState<string[]>([])

  const compareJson = () => {
    try {
      const obj1 = JSON.parse(input1)
      const obj2 = JSON.parse(input2)
      
      const diffs: string[] = []
      findDifferences(obj1, obj2, '', diffs)
      setDifferences(diffs)
    } catch (error) {
      setDifferences(['Error: Invalid JSON in one or both inputs'])
    }
  }

  const findDifferences = (obj1: any, obj2: any, path: string, diffs: string[]) => {
    const keys1 = obj1 && typeof obj1 === 'object' ? Object.keys(obj1) : []
    const keys2 = obj2 && typeof obj2 === 'object' ? Object.keys(obj2) : []
    const allKeys = new Set([...keys1, ...keys2])

    allKeys.forEach(key => {
      const newPath = path ? `${path}.${key}` : key
      const val1 = obj1?.[key]
      const val2 = obj2?.[key]

      if (val1 === undefined) {
        diffs.push(`➕ Added: ${newPath} = ${JSON.stringify(val2)}`)
      } else if (val2 === undefined) {
        diffs.push(`➖ Removed: ${newPath}`)
      } else if (typeof val1 !== typeof val2) {
        diffs.push(`🔄 Type changed: ${newPath} (${typeof val1} → ${typeof val2})`)
      } else if (typeof val1 === 'object' && val1 !== null) {
        findDifferences(val1, val2, newPath, diffs)
      } else if (val1 !== val2) {
        diffs.push(`✏️ Modified: ${newPath} (${JSON.stringify(val1)} → ${JSON.stringify(val2)})`)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First JSON Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            JSON 1 (Original)
          </label>
          <textarea
            value={input1}
            readOnly
            placeholder="First JSON from main input..."
            className="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none text-gray-900 dark:text-gray-100"
            spellCheck={false}
          />
        </div>

        {/* Second JSON Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            JSON 2 (Compare With)
          </label>
          <textarea
            value={input2}
            onChange={(e) => onInput2Change(e.target.value)}
            placeholder="Paste second JSON to compare..."
            className="w-full h-96 p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-gray-900 dark:text-gray-100"
            spellCheck={false}
          />
        </div>
      </div>

      <button
        onClick={compareJson}
        className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
      >
        Compare JSONs
      </button>

      {/* Differences Display */}
      {differences.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Differences Found: {differences.length}
          </h3>
          <div className="space-y-2 max-h-96 overflow-auto">
            {differences.map((diff, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-gray-50 dark:bg-gray-700 font-mono text-sm text-gray-800 dark:text-gray-200"
              >
                {diff}
              </div>
            ))}
          </div>
        </div>
      )}

      {differences.length === 0 && input1 && input2 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
          <p className="text-green-800 dark:text-green-300 font-medium">
            No differences found - JSONs are identical!
          </p>
        </div>
      )}
    </div>
  )
}
