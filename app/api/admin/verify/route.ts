import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/utils/adminAuth'

export async function POST(req: Request) {
  const anyReq: any = req
  if (!requireAdminAuth(anyReq)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { url, tag } = body
    if (!url || !tag) return NextResponse.json({ success: false, error: 'Missing url or tag' }, { status: 400 })

    // Try to fetch the URL and check for tag presence
    try {
      const res = await fetch(url)
      const text = await res.text()
      const found = text.includes(tag)
      return NextResponse.json({ success: true, found })
    } catch (e: any) {
      return NextResponse.json({ success: false, error: 'Failed to fetch URL' }, { status: 500 })
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Invalid request' }, { status: 400 })
  }
}
