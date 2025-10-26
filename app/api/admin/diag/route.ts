import net from 'net'
import { getMysqlConnection } from '@/utils/mysql'

function parseMysqlHostFromUrl(url: string): { host: string | null; port: number | null } {
  if (!url) return { host: null, port: null }
  try {
    const u = new URL(url)
    return { host: u.hostname || null, port: u.port ? parseInt(u.port, 10) : 3306 }
  } catch (e) {
    return { host: null, port: null }
  }
}

async function checkTcp(host: string, port: number, timeout = 3000): Promise<{ ok: boolean; error?: string }>{
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let settled = false
    const onDone = (ok: boolean, error?: string) => {
      if (settled) return
      settled = true
      try { socket.destroy() } catch (_) {}
      resolve({ ok, error })
    }
    socket.setTimeout(timeout)
    socket.once('error', (err) => onDone(false, String(err)))
    socket.once('timeout', () => onDone(false, 'timeout'))
    socket.connect(port, host, () => onDone(true))
  })
}

export async function GET() {
  // Prefer MySQL connectivity checks now that the app uses MySQL for admin data
  const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_URI || process.env.DATABASE_URL || ''
  const hostInfo = parseMysqlHostFromUrl(mysqlUrl)

  const hostChecks = []
  if (hostInfo.host && hostInfo.port) {
    try {
      const r = await checkTcp(hostInfo.host, hostInfo.port, 3000)
      hostChecks.push({ host: hostInfo.host, port: hostInfo.port, reachable: r.ok, error: r.error || null })
    } catch (e) {
      hostChecks.push({ host: hostInfo.host, port: hostInfo.port, reachable: false, error: String(e) })
    }
  }

  // Attempt a short MySQL connection for an additional check (non-fatal)
  let mysqlAttempt: { ok: boolean; message?: string } = { ok: false }
  if (mysqlUrl) {
    try {
      const conn = await getMysqlConnection()
      // simple ping/query
      const [rows] = await (conn as any).query('SELECT 1')
      mysqlAttempt = { ok: true, message: 'connected and query successful' }
    } catch (err: any) {
      mysqlAttempt = { ok: false, message: err?.message || String(err) }
    }
  } else {
    mysqlAttempt = { ok: false, message: 'MYSQL_URL not set' }
  }

  const payload = {
    env: {
      mysqlUrlPresent: Boolean(mysqlUrl),
      adminTokenPresent: Boolean(process.env.ADMIN_TOKEN),
      generateAdminTokenOptIn: process.env.GENERATE_ADMIN_TOKEN === '1'
    },
    hosts: hostChecks,
    mysqlAttempt,
    timestamp: new Date().toISOString()
  }

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
