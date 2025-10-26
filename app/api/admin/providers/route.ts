import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/utils/adminAuth'
import { getDb } from '@/utils/mongodb'

function sanitizeDoc(d: any) {
  if (!d) return d
  const copy: any = { ...d }
  if (copy._id) copy._id = String(copy._id)
  return copy
}

export async function GET(req: Request) {
  // list providers (no auth required for reading in this simple implementation)
  try {
    const db = await getDb()
    const col = db.collection('ad_providers')
    const list = await col.find({}).toArray()
    return NextResponse.json({ success: true, providers: list.map(sanitizeDoc) })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to read providers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // create provider (admin only)
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, type, config } = body
    if (!name || !type) return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    const id = (globalThis as any).crypto ? (globalThis as any).crypto.randomUUID() : String(Date.now())
    const item = { id, name, type, config: config || {}, createdAt: new Date().toISOString() }
    const db = await getDb()
    const col = db.collection('ad_providers')
    const res = await col.insertOne(item)
    const created = await col.findOne({ _id: res.insertedId })
    return NextResponse.json({ success: true, provider: sanitizeDoc(created) })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Create failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { id, name, type, config } = body
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const db = await getDb()
    const col = db.collection('ad_providers')
    const existing = await col.findOne({ id })
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    const update = { $set: { name: name ?? existing.name, type: type ?? existing.type, config: config ?? existing.config, updatedAt: new Date().toISOString() } }
    await col.updateOne({ id }, update)
    const updated = await col.findOne({ id })
    return NextResponse.json({ success: true, provider: sanitizeDoc(updated) })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const db = await getDb()
    const col = db.collection('ad_providers')
    await col.deleteOne({ id })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Delete failed' }, { status: 500 })
  }
}
