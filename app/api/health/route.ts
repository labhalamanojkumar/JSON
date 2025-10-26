import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ ok: true, ts: Date.now() }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }
}
