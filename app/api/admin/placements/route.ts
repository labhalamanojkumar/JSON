import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/utils/adminAuth'
import { getDb } from '@/utils/db'

export async function GET(req: Request) {
  try {
    const db = await getDb()
    const list = await db.collection('ad_placements').find({}).toArray()
    return NextResponse.json({ success: true, placements: list.map(p => ({ ...p, _id: String(p._id) })) })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to list placements' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { name, providerId, selector, enabled } = body
    if (!name || !providerId) return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    const db = await getDb()
    const res = await db.collection('ad_placements').insertOne({ name, providerId, selector: selector || null, enabled: !!enabled, createdAt: new Date().toISOString() })
  const created = await db.collection('ad_placements').findOne({ _id: res.insertedId })
  if (!created) return NextResponse.json({ success: false, error: 'Create returned no document' }, { status: 500 })
  return NextResponse.json({ success: true, placement: { ...created, _id: String(created._id) } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Create failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { id, name, providerId, selector, enabled } = body
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const db = await getDb()
    await db.collection('ad_placements').updateOne({ _id: id }, { $set: { name, providerId, selector: selector || null, enabled: !!enabled, updatedAt: new Date().toISOString() } })
  const updated = await db.collection('ad_placements').findOne({ _id: id })
  if (!updated) return NextResponse.json({ success: false, error: 'Not found after update' }, { status: 404 })
  return NextResponse.json({ success: true, placement: { ...updated, _id: String(updated._id) } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const db = await getDb()
    await db.collection('ad_placements').deleteOne({ _id: id })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Delete failed' }, { status: 500 })
  }
}
