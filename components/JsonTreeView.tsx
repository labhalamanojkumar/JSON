'use client'

import { useState, useMemo } from 'react'
import { FiChevronDown, FiChevronRight, FiImage, FiSearch } from 'react-icons/fi'
import Image from 'next/image'

interface JsonTreeViewProps {
  input: string
}

interface TreeNode {
  key: string
  value: any
  type: string
  isExpanded: boolean
  level: number
}

export default function JsonTreeView({ input }: JsonTreeViewProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  const parsedData = useMemo(() => {
    try {
      return JSON.parse(input)
    } catch {
      return null
    }
  }, [input])

  const toggleExpand = (path: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const expandAll = () => {
    const allKeys = new Set<string>()
    const traverse = (obj: any, path: string = '') => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const newPath = path ? `${path}.${key}` : key
          allKeys.add(newPath)
          traverse(obj[key], newPath)
        })
      }
    }
    if (parsedData) traverse(parsedData)
    setExpandedKeys(allKeys)
  }

  const collapseAll = () => {
    setExpandedKeys(new Set())
  }

  const renderValue = (value: any, key: string, path: string, level: number): JSX.Element => {
    const isExpanded = expandedKeys.has(path)
    const indent = level * 20

    // Check if value is an image URL
    const isImageUrl = typeof value === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value)

    if (value === null) {
      return (
        <div style={{ marginLeft: `${indent}px` }} className="flex items-center py-1">
          <span className="json-key font-semibold">{key}:</span>
          <span className="json-null ml-2">null</span>
        </div>
      )
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const keys = Object.keys(value)
      return (
        <div style={{ marginLeft: `${indent}px` }}>
          <div
            className="flex items-center py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={() => toggleExpand(path)}
          >
            {isExpanded ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
            <span className="json-key font-semibold">{key}:</span>
            <span className="ml-2 text-gray-500">{`{${keys.length}}`}</span>
          </div>
          {isExpanded && (
            <div className="border-l-2 border-gray-300 dark:border-gray-600 ml-2">
              {keys.map(k => renderValue(value[k], k, `${path}.${k}`, level + 1))}
            </div>
          )}
        </div>
      )
    }

    if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: `${indent}px` }}>
          <div
            className="flex items-center py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={() => toggleExpand(path)}
          >
            {isExpanded ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
            <span className="json-key font-semibold">{key}:</span>
            <span className="ml-2 text-gray-500">{`[${value.length}]`}</span>
          </div>
          {isExpanded && (
            <div className="border-l-2 border-gray-300 dark:border-gray-600 ml-2">
              {value.map((item, idx) => renderValue(item, `[${idx}]`, `${path}[${idx}]`, level + 1))}
            </div>
          )}
        </div>
      )
    }

    const valueClass =
      typeof value === 'string'
        ? 'json-string'
        : typeof value === 'number'
        ? 'json-number'
        : typeof value === 'boolean'
        ? 'json-boolean'
        : ''

    return (
      <div style={{ marginLeft: `${indent}px` }} className="flex items-center py-1 group">
        <span className="json-key font-semibold">{key}:</span>
        <span className={`${valueClass} ml-2`}>
          {typeof value === 'string' ? `"${value}"` : String(value)}
        </span>
        {isImageUrl && (
          <div className="relative ml-2">
            <FiImage
              className="text-primary-600 dark:text-primary-400 cursor-pointer"
              onMouseEnter={() => setHoveredImage(value)}
              onMouseLeave={() => setHoveredImage(null)}
            />
            {hoveredImage === value && (
              <div className="absolute left-0 top-6 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-2">
                <Image src={value} alt="Preview" width={200} height={150} className="max-w-xs max-h-48 object-contain" />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (!parsedData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-8 text-center">
        <p className="text-yellow-800 dark:text-yellow-300">
          Enter valid JSON to view tree structure
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search keys or values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Collapse All
        </button>
      </div>

      {/* Tree View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 font-mono text-sm overflow-auto max-h-[600px]">
        {Array.isArray(parsedData) ? (
          parsedData.map((item, idx) => renderValue(item, `[${idx}]`, `[${idx}]`, 0))
        ) : (
          Object.keys(parsedData).map(key => renderValue(parsedData[key], key, key, 0))
        )}
      </div>
    </div>
  )
}
