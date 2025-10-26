"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdSlot from '@/components/AdSlot'

export default function AdminAds() {
  const [providers, setProviders] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newProvider, setNewProvider] = useState('')
  const [newSelector, setNewSelector] = useState('')
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
    fetch('/api/admin/providers').then(r => r.json()).then((d) => setProviders(d.providers || []))
    fetch('/api/admin/placements').then(r => r.json()).then((d) => setPlacements(d.placements || []))
  }, [token])

  const createPlacement = async () => {
    if (!token) return alert('No admin token')
    if (!newName || !newProvider) return alert('Missing fields')
    const res = await fetch('/api/admin/placements', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: newName, providerId: newProvider, selector: newSelector, enabled: true }) })
    const r = await res.json()
    if (r.success) {
      setPlacements((p) => [...p, r.placement])
      setNewName('')
      setNewSelector('')
    } else alert(r.error || 'Failed')
  }

  const deletePlacement = async (id: string) => {
    if (!token) return alert('No admin token')
    if (!confirm('Delete placement?')) return
    const res = await fetch(`/api/admin/placements?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    const r = await res.json()
    if (r.success) setPlacements((list) => list.filter(x => x._id !== id))
    else alert(r.error || 'Delete failed')
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
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Manage Ads</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">This page will let superadmins manage ad placements and mappings to providers.</p>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create Placement</h3>
            <div className="flex flex-wrap items-center gap-4">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Placement name" className="border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <select value={newProvider} onChange={(e) => setNewProvider(e.target.value)} className="border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select provider</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
              </select>
              <input value={newSelector} onChange={(e) => setNewSelector(e.target.value)} placeholder="selector or page" className="border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button onClick={createPlacement} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Create</button>
            </div>
          </div>

          <div className="space-y-4">
            {placements.map((pl) => {
              const provider = providers.find(p => p.id === pl.providerId)
              return (
                <div key={pl._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-semibold text-lg text-gray-800 dark:text-white">{pl.name} <span className="text-sm text-gray-500">({pl.selector})</span></div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Provider: {provider?.name ?? '—'}</div>
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => deletePlacement(pl._id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors">Delete</button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-white">Preview</h4>
                    <AdSlot provider={provider} placement={pl} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
