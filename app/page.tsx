import JsonFormatter from '@/components/JsonFormatter'
import FAQSection from '@/components/FAQSection'
import FeaturesSection from '@/components/FeaturesSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Online JSON Formatter & Validator',
  description: 'Format, validate, beautify, and minify JSON online. Free JSON formatter with syntax highlighting, error detection, and tree view. Support for JSON to CSV, XML, YAML conversion.',
  alternates: {
    canonical: 'https://jsonformatter.pro',
  },
}

export default function Home() {
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a JSON Formatter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A JSON Formatter is a tool that transforms minified or unformatted JSON data into a readable, properly indented format. It helps developers visualize JSON structure, validate syntax, and debug data issues."
        }
      },
      {
        "@type": "Question",
        "name": "How do I validate JSON?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your JSON into the formatter. If there are syntax errors, the validator will highlight them with line numbers and error messages. Valid JSON will be formatted correctly."
        }
      },
      {
        "@type": "Question",
        "name": "Is this JSON Formatter free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our JSON Formatter is completely free to use with no registration required. All processing happens in your browser for maximum privacy and speed."
        }
      },
      {
        "@type": "Question",
        "name": "Can I upload JSON files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can upload JSON files up to 10MB in size. Simply drag and drop your file or click the upload button."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Free Online JSON Formatter & Validator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional JSON formatting, validation, and conversion tool. Format, beautify, minify, and validate JSON with real-time error detection. Convert JSON to CSV, XML, YAML and more.
          </p>
        </div>

        {/* Main JSON Formatter Component */}
        <JsonFormatter />

        {/* Features Section */}
        <FeaturesSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* SEO Content */}
        <section className="mt-16 prose dark:prose-invert max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why Use Our JSON Formatter?
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              JSON (JavaScript Object Notation) is the most widely used data format for APIs and web applications. 
              Our JSON Formatter helps developers work more efficiently by providing powerful tools to format, 
              validate, and manipulate JSON data.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Key Features
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Real-time Validation:</strong> Instantly detect syntax errors with detailed error messages</li>
              <li><strong>Multiple View Modes:</strong> Switch between code, tree, and comparison views</li>
              <li><strong>Format Conversion:</strong> Convert JSON to CSV, XML, YAML, and vice versa</li>
              <li><strong>Dark Mode Support:</strong> Eye-friendly dark theme for extended coding sessions</li>
              <li><strong>File Upload:</strong> Support for uploading and downloading JSON files</li>
              <li><strong>Privacy-First:</strong> All processing happens locally in your browser</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}
