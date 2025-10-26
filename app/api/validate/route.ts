import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = body?.input
    if (typeof input !== 'string') {
      return NextResponse.json({ valid: false, error: 'Missing input string' }, { status: 400 })
    }

    try {
      JSON.parse(input)
      return NextResponse.json({ valid: true })
    } catch (err: any) {
      const message = err?.message || 'Invalid JSON'
      // Attempt to extract position info if available
      const posMatch = message.match(/position (\d+)/)
      let line: number | null = null
      let column: number | null = null
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10)
        const lines = input.substring(0, pos).split('\n')
        line = lines.length
        column = lines[lines.length - 1].length + 1
      }
      return NextResponse.json({ valid: false, error: { message, line, column } }, { status: 200 })
    }
  } catch (e) {
    return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 400 })
  }
}
