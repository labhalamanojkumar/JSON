import { NextResponse } from 'next/server'
import { getDb } from '@/utils/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventType, label } = body
    if (!eventType) return NextResponse.json({ success: false, error: 'Missing eventType' }, { status: 400 })
    const db = await getDb()
    const events = db.collection('analytics_events')
    const counters = db.collection('analytics_counters')
    await events.insertOne({ ts: new Date().toISOString(), eventType, label: label || null })
    const existing = await counters.findOne({ eventType })
    if (existing) {
      await counters.updateOne({ eventType }, { count: (existing.count || 0) + 1 })
    } else {
      await counters.insertOne({ eventType, count: 1 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to record' }, { status: 500 })
  }
}
