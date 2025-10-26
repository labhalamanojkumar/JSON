import { NextRequest } from 'next/server'
import { ensureAdminToken } from './ensureAdminToken'

// If the environment opts in, ensureAdminToken will generate and persist a token
// at runtime when `GENERATE_ADMIN_TOKEN=1`. We only call it when ADMIN_TOKEN
// is not present so normal deployments are unaffected.
if (!process.env.ADMIN_TOKEN && process.env.GENERATE_ADMIN_TOKEN === '1') {
  try {
    ensureAdminToken()
  } catch (e) {
    // Non-fatal: if writing fails, auth will continue to rely on ADMIN_TOKEN env
    console.warn('[adminAuth] ensureAdminToken failed:', e)
  }
}

export function requireAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '') || ''
  const adminToken = process.env.ADMIN_TOKEN || ''
  if (!adminToken || token !== adminToken) {
    return false
  }
  return true
}
