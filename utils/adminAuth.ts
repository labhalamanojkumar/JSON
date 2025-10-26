import { NextRequest } from 'next/server'

export function requireAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '') || ''
  const adminToken = process.env.ADMIN_TOKEN || ''
  if (!adminToken || token !== adminToken) {
    return false
  }
  return true
}
