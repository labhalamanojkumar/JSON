'use client'

import { useState } from 'react'
import yaml from 'js-yaml'

interface JsonConverterProps {
  input: string
}

type ConversionFormat = 'csv' | 'xml' | 'yaml'

export default function JsonConverter({ input }: JsonConverterProps) {
  const [format, setFormat] = useState<ConversionFormat>('csv')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convertToCSV = (data: any): string => {
    if (Array.isArray(data)) {
      if (data.length === 0) return ''
      
      const headers = Object.keys(data[0])
      const csvRows = [headers.join(',')]
      
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header]
          return typeof value === 'string' ? `"${value}"` : value
        })
        csvRows.push(values.join(','))
      })
      
      return csvRows.join('\n')
    } else if (typeof data === 'object') {
      const headers = Object.keys(data)
      const values = Object.values(data).map(v => 
        typeof v === 'string' ? `"${v}"` : v
      )
      return `${headers.join(',')}\n${values.join(',')}`
    }
    return ''
  }

  const convertToXML = (data: any, rootName: string = 'root'): string => {
    const toXML = (obj: any, name: string, indent: string = ''): string => {
      if (obj === null) return `${indent}<${name}/>`
      if (typeof obj !== 'object') {
        return `${indent}<${name}>${obj}</${name}>`
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => toXML(item, 'item', indent)).join('\n')
      }
      
      const children = Object.entries(obj)
        .map(([key, value]) => toXML(value, key, indent + '  '))
        .join('\n')
      
      return `${indent}<${name}>\n${children}\n${indent}</${name}>`
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXML(data, rootName)}`
  }

  const convertToYAML = (data: any): string => {
    return yaml.dump(data, { indent: 2 })
  }

  const handleConvert = () => {
    try {
      const parsed = JSON.parse(input)
      let result = ''
      
      switch (format) {
        case 'csv':
          result = convertToCSV(parsed)
          break
        case 'xml':
          result = convertToXML(parsed)
          break
        case 'yaml':
          result = convertToYAML(parsed)
          break
      }
      
      setOutput(result)
      setError('')
    } catch (err: any) {
      setError(err.message || 'Conversion failed')
      setOutput('')
    }
  }

  const downloadOutput = () => {
    if (!output) return
    
    const extensions: Record<ConversionFormat, string> = {
      csv: 'csv',
      xml: 'xml',
      yaml: 'yaml'
    }
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${extensions[format]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Convert JSON to:
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFormat('csv')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              format === 'csv'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            CSV
          </button>
          <button
            onClick={() => setFormat('xml')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              format === 'xml'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            XML
          </button>
          <button
            onClick={() => setFormat('yaml')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              format === 'yaml'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            YAML
          </button>
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!input}
        className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Convert to {format.toUpperCase()}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Output Display */}
      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Converted Output ({format.toUpperCase()})
            </label>
            <button
              onClick={downloadOutput}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Download
            </button>
          </div>
          <pre className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto max-h-96 text-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}
