import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/utils/adminAuth'
import { getDb } from '@/utils/db'

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

  let body
  try {
    const raw = await req.text()
    body = JSON.parse(raw)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Invalid JSON in request body: ' + e.message + ' Raw body: ' + (await req.clone().text()) }, { status: 400 })
  }

  try {
    const { name, type, config } = body
    if (!name || !type) return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    if (typeof config !== 'object' || config === null) return NextResponse.json({ success: false, error: 'config must be an object' }, { status: 400 })
    if (type === 'monetag' && config.metaname !== undefined && typeof config.metaname !== 'string') return NextResponse.json({ success: false, error: 'metaname must be a string' }, { status: 400 })
    // Sanitize config
    const sanitizedConfig = { ...config }
    if (type === 'monetag' && sanitizedConfig.metaname) {
      sanitizedConfig.metaname = String(sanitizedConfig.metaname).trim()
    }
    const id = (globalThis as any).crypto ? (globalThis as any).crypto.randomUUID() : String(Date.now())
    const item = { id, name, type, config: { ...sanitizedConfig, enabled: true }, createdAt: new Date().toISOString() }
    const db = await getDb()
    const col = db.collection('ad_providers')
    const res = await col.insertOne(item)
    const created = await col.findOne({ _id: res.insertedId })

    // Automatically create default placements for the new provider
    try {
      const placementsCol = db.collection('ad_placements')
      const defaultPlacements = [
        { name: `${name} Header`, providerId: id, selector: 'header', enabled: true, createdAt: new Date().toISOString() },
        { name: `${name} Footer`, providerId: id, selector: 'footer', enabled: true, createdAt: new Date().toISOString() }
      ]
      for (const pl of defaultPlacements) {
        await placementsCol.insertOne(pl)
      }
    } catch (e) {
      // Ignore errors in creating placements, provider is still created
      console.error('Failed to create default placements:', String(e))
    }

    return NextResponse.json({ success: true, provider: sanitizeDoc(created) })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Create failed', stack: e?.stack }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    const raw = await req.text()
    body = JSON.parse(raw)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Invalid JSON in request body: ' + e.message + ' Raw body: ' + (await req.clone().text()) }, { status: 400 })
  }

  try {
  const { id, name, type, config } = body
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
  if (typeof config !== 'object' || config === null) return NextResponse.json({ success: false, error: 'config must be an object' }, { status: 400 })
  if (type === 'monetag' && config.metaname !== undefined && typeof config.metaname !== 'string') return NextResponse.json({ success: false, error: 'metaname must be a string' }, { status: 400 })
  const db = await getDb()
  const col = db.collection('ad_providers')
  // support searching by primary id (row id) which is exposed as _id on returned docs
  const existing = await col.findOne({ _id: id })
  if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    // Sanitize config
    const sanitizedConfig = { ...config }
    if (type === 'monetag' && sanitizedConfig.metaname) {
      sanitizedConfig.metaname = String(sanitizedConfig.metaname).trim()
    }
    const update = { $set: { name: name ?? existing.name, type: type ?? existing.type, config: sanitizedConfig, updatedAt: new Date().toISOString() } }
  await col.updateOne({ _id: id }, update)
  const updated = await col.findOne({ _id: id })
    return NextResponse.json({ success: true, provider: sanitizeDoc(updated) })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Update failed', stack: e?.stack }, { status: 500 })
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
    // delete by primary id (row id) which is represented as _id in returned docs
    await col.deleteOne({ _id: id })
    // Also remove any placements that reference this provider to avoid orphans
    try {
      const placementsCol = db.collection('ad_placements')
      // deleteMany isn't implemented on the DB wrapper; fetch matching placements and delete individually
      const pls = await placementsCol.find({ providerId: id }).toArray()
      for (const pl of pls) {
        try {
          await placementsCol.deleteOne({ _id: pl._id })
        } catch (innerErr) {
          console.warn('Failed to delete placement', pl._id, innerErr)
        }
      }
    } catch (e) {
      // Non-fatal: log and continue
      console.warn('Failed to cascade-delete placements for provider', id, e)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Delete failed' }, { status: 500 })
  }
}
