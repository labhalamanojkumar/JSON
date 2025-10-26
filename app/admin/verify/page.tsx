"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminVerify() {
  const [url, setUrl] = useState('')
  const [tag, setTag] = useState('')
  const [result, setResult] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication and redirect if not logged in
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      if (!saved) {
        router.push('/admin')
        return
      }
      setToken(saved)
    } catch (e) {
      router.push('/admin')
      return
    }
    setLoading(false)
  }, [router])

  const verify = async () => {
    if (!token) return alert('No admin token')
    const res = await fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ url, tag }) })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Verify Monetags / Ad Tags</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Enter a URL and the tag snippet to check if the tag exists on the page.</p>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="border border-gray-300 dark:border-gray-600 p-3 rounded flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="tag snippet or id" className="border border-gray-300 dark:border-gray-600 p-3 rounded flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button onClick={verify} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Verify</button>
            </div>
          </div>

          {result && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Verification Result</h3>
              <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto text-gray-900 dark:text-white">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
