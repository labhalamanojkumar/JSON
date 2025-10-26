'use client'

import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { FiSun, FiMoon, FiCode } from 'react-icons/fi'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <FiCode className="text-3xl text-primary-600 dark:text-primary-400" />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">JSONFormatterPro</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">By Testcraft.in</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/json-formatter" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Formatter
            </Link>
            <Link href="/json-validator" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Validator
            </Link>
            <Link href="/json-minifier" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Minifier
            </Link>
            <Link href="/json-converter" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Converter
            </Link>
            <Link href="/json-compare" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Compare
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Blog
            </Link>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FiMoon className="text-xl text-gray-800" />
            ) : (
              <FiSun className="text-xl text-yellow-400" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-wrap gap-3">
          <Link href="/json-formatter" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Formatter
          </Link>
          <Link href="/json-validator" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Validator
          </Link>
          <Link href="/json-minifier" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Minifier
          </Link>
          <Link href="/json-converter" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Converter
          </Link>
          <Link href="/json-compare" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Compare
          </Link>
          <Link href="/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Blog
          </Link>
        </div>
      </nav>
    </header>
  )
}
