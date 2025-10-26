import { NextResponse } from 'next/server'
import yaml from 'js-yaml'
import { js2xml } from 'xml-js'
import { Parser as Json2CsvParser } from 'json2csv'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = body?.input
    const format = body?.format
    if (typeof input !== 'string' || !format) {
      return NextResponse.json({ success: false, error: 'Missing input or format' }, { status: 400 })
    }

    let parsed
    try {
      parsed = JSON.parse(input)
    } catch (err: any) {
      return NextResponse.json({ success: false, error: 'Invalid JSON input' }, { status: 400 })
    }

    try {
      if (format === 'yaml') {
        const out = yaml.dump(parsed)
        return NextResponse.json({ success: true, output: out })
      }

      if (format === 'xml') {
        const out = js2xml(parsed, { compact: true, spaces: 2 })
        return NextResponse.json({ success: true, output: out })
      }

      if (format === 'csv') {
        // Ensure array of objects
        if (!Array.isArray(parsed)) {
          return NextResponse.json({ success: false, error: 'CSV conversion requires a JSON array of objects' }, { status: 400 })
        }
        const parser = new Json2CsvParser()
        const out = parser.parse(parsed)
        return NextResponse.json({ success: true, output: out })
      }

      return NextResponse.json({ success: false, error: 'Unsupported format' }, { status: 400 })
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || 'Conversion error' }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
