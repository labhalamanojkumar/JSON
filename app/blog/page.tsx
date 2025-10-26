import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter Blog - Tips, Tricks & Best Practices',
  description: 'Learn about JSON formatting, validation, and best practices. Expert tips for developers working with JSON data.',
}

const blogPosts = [
  {
    slug: 'json-guide',
    title: 'Complete Guide to JSON for Developers',
    excerpt: 'Everything you need to know about JSON - from basics to advanced concepts. Learn JSON syntax, data types, and best practices.',
    date: '2024-01-15',
    readTime: '10 min read'
  },
  {
    slug: 'fix-json-errors',
    title: 'How to Fix Invalid JSON Errors',
    excerpt: 'Common JSON syntax errors and how to fix them. Learn to identify and resolve missing quotes, trailing commas, and more.',
    date: '2024-01-10',
    readTime: '8 min read'
  },
  {
    slug: 'json-vs-xml',
    title: 'JSON vs XML: Which Should You Use?',
    excerpt: 'Compare JSON and XML data formats. Understand when to use each format and their advantages in different scenarios.',
    date: '2024-01-05',
    readTime: '12 min read'
  },
  {
    slug: 'json-best-practices',
    title: 'JSON Best Practices for APIs',
    excerpt: 'Industry-standard JSON formatting guidelines for building robust APIs. Learn naming conventions, structure patterns, and optimization tips.',
    date: '2024-01-01',
    readTime: '15 min read'
  },
  {
    slug: 'json-tools-developers',
    title: 'Top 5 JSON Tools for Developers',
    excerpt: 'Essential JSON tools every developer should know. From validators to converters, discover the best tools for working with JSON.',
    date: '2023-12-28',
    readTime: '7 min read'
  }
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Formatter Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Tips, tricks, and best practices for working with JSON
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {post.title}
              </h2>
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {post.excerpt}
            </p>
            <Link 
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
