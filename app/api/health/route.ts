import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    // Check MySQL connectivity
    const connection = await mysql.createConnection(process.env.MYSQL_URL || process.env.DATABASE_URL!)
    await connection.execute('SELECT 1')
    await connection.end()

    return NextResponse.json({ ok: true, ts: Date.now(), db: 'connected' }, { status: 200 })
  } catch (e) {
    console.error('Health check failed:', e)
    return NextResponse.json({ ok: false, error: 'db_unavailable', ts: Date.now() }, { status: 503 })
  }
}
