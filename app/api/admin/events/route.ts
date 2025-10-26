import { NextResponse } from 'next/server'
import { getDb } from '@/utils/mongodb'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventType, label } = body
    if (!eventType) return NextResponse.json({ success: false, error: 'Missing eventType' }, { status: 400 })
    const db = await getDb()
    const events = db.collection('analytics_events')
    const counters = db.collection('analytics_counters')
    await events.insertOne({ eventType, label: label || null, ts: new Date().toISOString() })
    await counters.updateOne({ eventType }, { $inc: { count: 1 } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to record' }, { status: 500 })
  }
}
