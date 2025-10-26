"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'

export const dynamic = 'force-dynamic'

export default function AdminAnalytics() {
  const [summary, setSummary] = useState<any>(null)
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [token, setToken] = useState<string | null>(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    } catch (e) {
      return null
    }
  })
  const [loading, setLoading] = useState(() => (token ? false : true))
  const router = useRouter()

  const eventType = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('eventType') : null

  useEffect(() => {
    // If there's no token, redirect to admin login.
    if (!token) {
      router.push('/admin')
    }
    // loading was initialized based on token presence
  }, [router, token])

  useEffect(() => {
    if (!token) return
    fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary)
        if (eventType) {
          setFilteredEvents((data.summary?.lastEvents || []).filter((e: any) => e.eventType === eventType))
        } else {
          setFilteredEvents(data.summary?.lastEvents || [])
        }
      })
      .catch(() => setSummary(null))
  }, [token, eventType])

  const counterData = summary?.counters ? Object.entries(summary.counters).map(([key, value]) => ({ name: key, value })) : []
  const eventData = filteredEvents.slice(0, 10).map((e: any, i: number) => ({ name: `Event ${i+1}`, value: 1, ts: e.ts, label: e.label }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Analytics Details</h1>
        {eventType && <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Filtered by event type: <strong>{eventType}</strong></p>}

        <div className="flex justify-end mb-6">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors" onClick={() => { localStorage.removeItem('admin_token'); setToken(null); setSummary(null); router.push('/admin') }}>Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600">{summary?.totalEvents ?? '—'}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Filtered Events</h3>
            <p className="text-3xl font-bold text-green-600">{filteredEvents.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Unique Event Types</h3>
            <p className="text-3xl font-bold text-purple-600">{counterData.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Event Counters</h3>
            {counterData.length > 0 ? (
              <BarChart width={400} height={300} data={counterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Filtered Events</h3>
            {eventData.length > 0 ? (
              <LineChart width={400} height={300} data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filtered Events Table</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Label</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEvents.map((e: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(e.ts).toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{e.eventType}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{e.label || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => router.push('/admin/dashboard')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Back to Dashboard</button>
          <button onClick={() => router.push('/admin/analytics')} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">Clear Filter</button>
        </div>
      </div>
    </div>
  )
}