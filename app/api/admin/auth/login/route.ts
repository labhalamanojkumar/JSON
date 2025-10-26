import { NextResponse } from 'next/server'
import { getDb } from '@/utils/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body || {}
    const envUser = process.env.SUPERADMIN_USER || ''
    const envPass = process.env.SUPERADMIN_PASS || ''
    const adminToken = process.env.ADMIN_TOKEN || ''

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 })
    }

    // Try database-backed admin first (if DB is available)
    try {
      const db = await getDb()
      const col = db.collection('admin_users')
      const user = await col.findOne({ username })
      if (user) {
        const hash = user.passwordHash || user.password || ''
        const ok = await bcrypt.compare(password, hash)
        if (ok) {
          if (!adminToken) return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
          // set HttpOnly cookie with admin token
          const res = NextResponse.json({ success: true, token: adminToken })
          const cookieParts = [`admin_token=${adminToken}`, 'HttpOnly', 'Path=/', `Max-Age=${60 * 60 * 24}`]
          if (process.env.NODE_ENV === 'production') cookieParts.push('Secure', 'SameSite=Strict')
          res.headers.set('Set-Cookie', cookieParts.join('; '))
          return res
        }
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
      }
    } catch (dbErr) {
      // DB not available or error — fall back to env-based auth
    }

    // Fallback to environment-based superadmin
    if (!envUser || !envPass || !adminToken) {
      return NextResponse.json({ success: false, error: 'Server not configured for admin auth' }, { status: 500 })
    }

    if (username === envUser && password === envPass) {
      const res = NextResponse.json({ success: true, token: adminToken })
      const cookieParts = [`admin_token=${adminToken}`, 'HttpOnly', 'Path=/', `Max-Age=${60 * 60 * 24}`]
      if (process.env.NODE_ENV === 'production') cookieParts.push('Secure', 'SameSite=Strict')
      res.headers.set('Set-Cookie', cookieParts.join('; '))
      return res
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Login failed' }, { status: 500 })
  }
}
