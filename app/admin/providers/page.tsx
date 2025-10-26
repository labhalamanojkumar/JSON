"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminProviders() {
  const [providers, setProviders] = useState<any[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState('adsense')
  const [config, setConfig] = useState<any>({})
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
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
  }, [token])

  const addProvider = async () => {
    if (!token) return alert('No admin token')
    if (!name || !type) return alert('Missing fields')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/providers', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, type, config }) })
      const result = await res.json()
      if (result.success) {
        if (!result.provider) {
          // Defensive: provider should be returned from the API. If not, alert and skip mutating state.
          alert('Provider created but server did not return provider data. Refresh providers list.')
          // refresh providers list
          fetch('/api/admin/providers').then(r => r.json()).then((d) => setProviders(d.providers || []))
        } else {
          setProviders((p) => [...p, result.provider])
          setName('')
          setConfig({})
        }
      } else {
        alert(result.error || 'Failed')
      }
    } finally {
      setSaving(false)
    }
  }

  const updateProvider = async () => {
    if (!token) return alert('No admin token')
    if (!name || !type || !editingId) return alert('Missing fields')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/providers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: editingId, name, type, config }) })
      const result = await res.json()
      if (result.success) {
        setProviders((p) => p.map(it => it._id === editingId ? result.provider : it))
        setName('')
        setConfig({})
        setEditingId(null)
        setType('adsense')
      } else {
        alert(result.error || 'Failed')
      }
    } finally {
      setSaving(false)
    }
  }

  const editProvider = (p: any) => {
    setEditingId(p._id)
    setName(p.name)
    setType(p.type)
    setConfig(p.config || {})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setName('')
    setType('adsense')
    setConfig({})
  }

  const removeProvider = async (id: string) => {
    if (!token) return alert('No admin token')
    if (!confirm('Delete provider?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/providers?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      const r = await res.json()
      if (r.success) setProviders((p) => p.filter(x => x._id !== id))
      else alert(r.error || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleEnabled = async (p: any) => {
    if (!token) return alert('No admin token')
    const newEnabled = !(p.config?.enabled ?? true)
    setTogglingId(p._id)
    try {
      const res = await fetch('/api/admin/providers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: p._id, config: { ...p.config, enabled: newEnabled }, name: p.name, type: p.type }) })
      const r = await res.json()
      if (r.success) setProviders((list) => list.map(it => it._id === p._id ? r.provider : it))
      else alert(r.error || 'Toggle failed')
    } finally {
      setTogglingId(null)
    }
  }

  const renderConfigFields = () => {
    switch (type) {
      case 'adsense':
        return (
          <>
            <label className="block mb-2">Publisher ID</label>
            <input value={config.publisherId || ''} onChange={(e) => setConfig({ ...config, publisherId: e.target.value })} placeholder="ca-pub-XXXXXXXXXX" className="border p-2 mr-2 w-full mb-3" />
            <label className="block mb-2">Ad Slot ID</label>
            <input value={config.adSlotId || ''} onChange={(e) => setConfig({ ...config, adSlotId: e.target.value })} placeholder="1234567890" className="border p-2 mr-2 w-full mb-3" />
          </>
        )
      case 'monetag':
        return (
          <>
            <label className="block mb-2">Metaname</label>
            <input value={config.metaname || ''} onChange={(e) => setConfig({ ...config, metaname: e.target.value })} placeholder="a3ba1c9ee279414a909e456501d57989" className="border p-2 mr-2 w-full mb-3" />
            <label className="block mb-2">Account ID</label>
            <input value={config.accountId || ''} onChange={(e) => setConfig({ ...config, accountId: e.target.value })} placeholder="Your Account ID" className="border p-2 mr-2 w-full mb-3" />
          </>
        )
      case 'custom':
        return (
          <>
            <label className="block mb-2">Snippet</label>
            <textarea value={config.snippet || ''} onChange={(e) => setConfig({ ...config, snippet: e.target.value })} placeholder="HTML/JS snippet" className="border p-2 mr-2 w-full mb-3 h-20" />
          </>
        )
      default:
        return null
    }
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
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Manage Ad Providers</h1>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Provider</h2>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Provider Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Provider name" className="border border-gray-300 dark:border-gray-600 p-3 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Type</label>
              <select value={type} onChange={(e) => { setType(e.target.value); setConfig({}) }} className="border border-gray-300 dark:border-gray-600 p-3 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="adsense">AdSense</option>
                <option value="monetag">Monetag</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {renderConfigFields()}
            <button onClick={editingId ? updateProvider : addProvider} disabled={saving} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">{saving ? 'Saving...' : (editingId ? 'Update Provider' : 'Add Provider')}</button>
            {editingId && <button onClick={cancelEdit} disabled={saving} className="ml-4 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">Cancel</button>}
          </div>

          <div className="space-y-4">
            {providers.filter(Boolean).map((p) => (
              <div key={p?._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-800 dark:text-white">{p.name} <span className="text-sm text-gray-500">({p.type})</span></div>
                  <div className="mt-2">
                    {p.type === 'adsense' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Publisher ID: {p.config?.publisherId || '—'}</p>
                        <p>Ad Slot ID: {p.config?.adSlotId || '—'}</p>
                      </div>
                    )}
                    {p.type === 'monetag' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Metaname: {p.config?.metaname || '—'}</p>
                        <p>Account ID: {p.config?.accountId || '—'}</p>
                      </div>
                    )}
                    {p.type === 'custom' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Snippet: {p.config?.snippet ? 'Configured' : '—'}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => editProvider(p)} disabled={saving || deletingId === p._id} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50">Edit</button>
                  <button onClick={() => toggleEnabled(p)} disabled={togglingId === p._id} className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${(p.config?.enabled ?? true) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'}`}>{togglingId === p._id ? '...' : ((p.config?.enabled ?? true) ? 'Enabled' : 'Disabled')}</button>
                  <button onClick={() => removeProvider(p._id)} disabled={deletingId === p._id} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50">{deletingId === p._id ? 'Deleting...' : 'Delete'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
