'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiCopy, FiDownload, FiUpload, FiTrash2, FiCheck, FiAlertCircle } from 'react-icons/fi'
import JsonEditor from '@/components/JsonEditor'
import JsonTreeView from '@/components/JsonTreeView'
import JsonComparison from '@/components/JsonComparison'
import JsonConverter from '@/components/JsonConverter'

type ViewMode = 'code' | 'tree' | 'compare' | 'convert'
type IndentSize = 2 | 3 | 4

interface ValidationError {
  message: string
  line?: number
  column?: number
}

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('code')
  const [indentSize, setIndentSize] = useState<IndentSize>(2)
  const [isValid, setIsValid] = useState(true)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)
  const [copied, setCopied] = useState(false)
  const [compareInput, setCompareInput] = useState('')

  // Load saved JSON from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('json-formatter-input')
    if (saved) {
      setInput(saved)
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (input) {
      localStorage.setItem('json-formatter-input', input)
    }
  }, [input])

  // Format JSON
  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setValidationError(null)
      setIsValid(true)
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indentSize)
      setOutput(formatted)
      setIsValid(true)
      setValidationError(null)
    } catch (error: any) {
      setIsValid(false)
      const errorMessage = error.message || 'Invalid JSON'
      const lineMatch = errorMessage.match(/position (\d+)/)
      
      let line: number | undefined
      let column: number | undefined
      
      if (lineMatch) {
        const position = parseInt(lineMatch[1])
        const lines = input.substring(0, position).split('\n')
        line = lines.length
        column = lines[lines.length - 1].length + 1
      }
      
      setValidationError({
        message: errorMessage,
        line,
        column
      })
      setOutput('')
    }
  }, [input, indentSize])

  // Minify JSON
  const minifyJson = useCallback(() => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setIsValid(true)
      setValidationError(null)
    } catch (error: any) {
      setIsValid(false)
      setValidationError({ message: error.message })
    }
  }, [input])

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!output) return
    
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [output])

  // Download JSON file
  const downloadJson = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setInput(content)
    }
    reader.readAsText(file)
  }

  // Clear all
  const clearAll = () => {
    setInput('')
    setOutput('')
    setValidationError(null)
    setIsValid(true)
    localStorage.removeItem('json-formatter-input')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        formatJson()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && output) {
        copyToClipboard()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [formatJson, output, copyToClipboard])

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <button
          onClick={() => setViewMode('code')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'code'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setViewMode('tree')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'tree'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Tree View
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'compare'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Compare
        </button>
        <button
          onClick={() => setViewMode('convert')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'convert'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Convert
        </button>
      </div>

      {/* Toolbar */}
      {viewMode === 'code' && (
        <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <button
            onClick={formatJson}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Format / Beautify
          </button>
          <button
            onClick={minifyJson}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Minify
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!output}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {copied ? <FiCheck /> : <FiCopy />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadJson}
            disabled={!output}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiDownload />
            Download
          </button>
          <label className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer flex items-center gap-2">
            <FiUpload />
            Upload
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <FiTrash2 />
            Clear
          </button>
          
          {/* Indent Size Selector */}
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value) as IndentSize)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
          >
            <option value={2}>2 Spaces</option>
            <option value={3}>3 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>
      )}

      {/* Validation Status */}
      {validationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 flex items-start gap-3">
          <FiAlertCircle className="text-red-600 dark:text-red-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">Invalid JSON</h3>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">
              {validationError.message}
              {validationError.line && ` (Line ${validationError.line}, Column ${validationError.column})`}
            </p>
          </div>
        </div>
      )}

      {isValid && output && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
          <FiCheck className="text-green-600 dark:text-green-400 text-xl" />
          <p className="text-green-700 dark:text-green-400 font-medium">Valid JSON</p>
        </div>
      )}

      {/* Content Area */}
      {viewMode === 'code' && (
        <JsonEditor
          input={input}
          output={output}
          onInputChange={setInput}
        />
      )}

      {viewMode === 'tree' && (
        <JsonTreeView input={input} />
      )}

      {viewMode === 'compare' && (
        <JsonComparison
          input1={input}
          input2={compareInput}
          onInput2Change={setCompareInput}
        />
      )}

      {viewMode === 'convert' && (
        <JsonConverter input={input} />
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Keyboard Shortcuts</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li><kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Ctrl/Cmd + Enter</kbd> - Format JSON</li>
          <li><kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Ctrl/Cmd + C</kbd> - Copy formatted JSON</li>
        </ul>
      </div>
    </div>
  )
}
