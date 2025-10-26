'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is a JSON Formatter?',
    answer: 'A JSON Formatter is a tool that transforms minified or unformatted JSON data into a readable, properly indented format. It helps developers visualize JSON structure, validate syntax, and debug data issues efficiently.'
  },
  {
    question: 'How do I validate JSON?',
    answer: 'Simply paste your JSON into the input box and click "Format/Beautify". If there are syntax errors, the validator will highlight them with detailed error messages including line and column numbers. Valid JSON will be formatted correctly and displayed in the output area.'
  },
  {
    question: 'Is this JSON Formatter free to use?',
    answer: 'Yes! Our JSON Formatter is completely free to use with no registration required. All processing happens locally in your browser for maximum privacy and speed. You can format, validate, minify, and convert JSON without any limitations.'
  },
  {
    question: 'Can I upload JSON files?',
    answer: 'Yes, you can upload JSON files up to 10MB in size. Simply drag and drop your file into the input area or click the "Upload" button to select a file from your computer. The content will be automatically loaded into the formatter.'
  },
  {
    question: 'What formats can I convert JSON to?',
    answer: 'Our JSON Converter supports converting JSON to CSV, XML, and YAML formats. Simply switch to the "Convert" tab, select your desired output format, and click convert. You can also download the converted output.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely! All processing happens entirely in your browser using JavaScript. Your JSON data never leaves your computer or gets sent to any server. This ensures complete privacy and security for sensitive data.'
  },
  {
    question: 'What are the keyboard shortcuts?',
    answer: 'Press Ctrl/Cmd + Enter to format JSON instantly, and Ctrl/Cmd + C to copy the formatted output. These shortcuts help you work faster and more efficiently.'
  },
  {
    question: 'Can I compare two JSON files?',
    answer: 'Yes! Switch to the "Compare" tab to compare two JSON files side by side. The tool will highlight all differences including added, removed, and modified values with clear visual indicators.'
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FiChevronUp className="text-primary-600 dark:text-primary-400 text-xl flex-shrink-0" />
                ) : (
                  <FiChevronDown className="text-gray-600 dark:text-gray-400 text-xl flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
