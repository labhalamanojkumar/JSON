"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null)
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

  useEffect(() => {
    if (!token) return
    fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setSummary(data.summary))
      .catch(() => setSummary(null))
  }, [token])

  // Prepare data for charts
  const counterData = summary?.counters ? Object.entries(summary.counters).map(([key, value]) => ({ name: key, value })) : []
  const eventData = summary?.lastEvents ? summary.lastEvents.slice(0, 10).map((e: any, i: number) => ({ name: `Event ${i+1}`, value: 1 })) : []
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

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
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Superadmin Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Manage ad providers, verify monetags and view advanced analytics.</p>

        <div className="flex justify-end mb-6">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors" onClick={() => { localStorage.removeItem('admin_token'); setToken(null); setSummary(null); router.push('/admin') }}>Logout</button>
        </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Events</h3>
                <p className="text-3xl font-bold text-blue-600">{summary?.totalEvents ?? '—'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Active Providers</h3>
                <p className="text-3xl font-bold text-green-600">—</p> {/* TODO: Fetch provider count */}
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Active Placements</h3>
                <p className="text-3xl font-bold text-purple-600">—</p> {/* TODO: Fetch placement count */}
              </div>
            </div>

            {/* Charts Section */}
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Events</h3>
                {eventData.length > 0 ? (
                  <PieChart width={400} height={300}>
                    <Pie data={eventData} cx={200} cy={150} labelLine={false} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {eventData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            </div>

            {/* Last Events Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Last Events</h3>
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
                    {(summary?.lastEvents || []).map((e: any, i: number) => (
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

            {/* Navigation */}
            <div className="flex flex-wrap gap-4">
              <a href="/admin/providers" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Manage Providers</a>
              <a href="/admin/ads" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">Manage Ads</a>
              <a href="/admin/verify" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">Verify Tags</a>
            </div>
      </div>
    </div>
  )
}
