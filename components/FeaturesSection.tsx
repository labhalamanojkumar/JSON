'use client'

import { FiCheck, FiCode, FiZap, FiLock, FiDownload, FiSearch, FiShuffle, FiRefreshCw } from 'react-icons/fi'

interface Feature {
  icon: JSX.Element
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <FiCode className="text-3xl" />,
    title: 'Format & Beautify',
    description: 'Transform minified JSON into readable, properly indented format with customizable spacing (2, 3, or 4 spaces).'
  },
  {
    icon: <FiCheck className="text-3xl" />,
    title: 'Real-time Validation',
    description: 'Instantly detect syntax errors with detailed error messages showing exact line and column numbers.'
  },
  {
    icon: <FiZap className="text-3xl" />,
    title: 'Minify JSON',
    description: 'Compress JSON by removing all unnecessary whitespace for optimized data transfer and storage.'
  },
  {
    icon: <FiSearch className="text-3xl" />,
    title: 'Tree View Explorer',
    description: 'Interactive tree structure with expand/collapse functionality and search capabilities for easy navigation.'
  },
  {
    icon: <FiShuffle className="text-3xl" />,
    title: 'JSON Comparison',
    description: 'Compare two JSON files side by side with highlighted differences for added, removed, and modified values.'
  },
  {
    icon: <FiRefreshCw className="text-3xl" />,
    title: 'Format Conversion',
    description: 'Convert JSON to CSV, XML, or YAML formats with one click. Perfect for data interchange and migration.'
  },
  {
    icon: <FiDownload className="text-3xl" />,
    title: 'File Upload & Download',
    description: 'Upload JSON files up to 10MB and download formatted or converted output instantly.'
  },
  {
    icon: <FiLock className="text-3xl" />,
    title: 'Privacy First',
    description: 'All processing happens locally in your browser. Your data never leaves your computer.'
  }
]

export default function FeaturesSection() {
  return (
    <section className="mt-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Powerful JSON Tools
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
          Everything you need to work with JSON data efficiently
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
