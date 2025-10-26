import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Guide - Learn JSON Basics & Best Practices',
  description: 'Comprehensive JSON guide: syntax, types, best practices, and tips to avoid common errors when working with JSON in web apps and APIs.',
  keywords: ['json guide', 'learn json', 'json tutorial', 'json best practices'],
}

export default function JSONGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">JSON Guide</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This guide covers the essentials of JSON (JavaScript Object Notation), including syntax, data types, and best
        practices for designing and validating JSON data for APIs and configuration files.
      </p>

      <section className="prose dark:prose-invert max-w-4xl">
        <h2>JSON Basics</h2>
        <p>JSON is a lightweight data interchange format. It supports objects, arrays, strings, numbers, booleans, and null.</p>

        <h3>Valid JSON Example</h3>
        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
{`{
  "name": "Alice",
  "age": 30,
  "skills": ["javascript", "json"],
  "isActive": true
}`}
        </pre>

        <h3>Best Practices</h3>
        <ul>
          <li>Always validate incoming JSON on both client and server.</li>
          <li>Use consistent naming conventions (camelCase or snake_case).</li>
          <li>Keep payloads small — paginate large lists.</li>
          <li>Document your JSON schema and expected fields.</li>
        </ul>

        <h3>Tools</h3>
        <p>Use the tools on this site to format, validate, compare, and convert JSON.</p>
      </section>
    </div>
  )
}
