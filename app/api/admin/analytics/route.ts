import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/utils/adminAuth'
import { getDb } from '@/utils/db'

export async function GET(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const db = await getDb()
    const eventsCol = db.collection('analytics_events')
    const countersCol = db.collection('analytics_counters')
    const totalEvents = await eventsCol.countDocuments()
    const countersArr = await countersCol.find({}).toArray()
    const counters: Record<string, number> = {}
    countersArr.forEach((c: any) => { counters[c.eventType] = c.count || 0 })
    const lastEvents = await eventsCol.find({}).sort({ ts: -1 }).limit(50).toArray()
    const summary = {
      totalEvents,
      counters,
      lastEvents: lastEvents.map((e: any) => ({ ...e, _id: String(e._id) }))
    }
    return NextResponse.json({ success: true, summary })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to read analytics' }, { status: 500 })
  }
}
