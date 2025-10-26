import { MongoClient } from 'mongodb'
import net from 'net'

function parseHostsFromMongoUri(uri: string): Array<{ host: string; port: number }> {
  // Very small, forgiving parser: extract the authority section after the '@' and
  // split on commas. Works for URIs like: mongodb://user:pass@host:1422,host2:1423/...
  const result: Array<{ host: string; port: number }> = []
  if (!uri) return result

  const afterAt = uri.match(/@([^/?]+)/)
  if (!afterAt) return result

  const hostsRaw = afterAt[1]
  for (const part of hostsRaw.split(',')) {
    const [hostPart] = part.split('/')
    const [host, port] = hostPart.split(':')
    result.push({ host, port: port ? parseInt(port, 10) : 27017 })
  }
  return result
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
  const uri = process.env.MONGODB_URI || ''
  const hosts = parseHostsFromMongoUri(uri)

  const hostChecks = await Promise.all(
    hosts.map(async (h) => {
      try {
        const r = await checkTcp(h.host, h.port, 3000)
        return { host: h.host, port: h.port, reachable: r.ok, error: r.error || null }
      } catch (e) {
        return { host: h.host, port: h.port, reachable: false, error: String(e) }
      }
    })
  )

  // Attempt a short Mongo connection for an additional check (non-fatal)
  let mongoAttempt: { ok: boolean; message?: string } = { ok: false }
  if (uri) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000 })
    try {
      await client.connect()
      // ping
      await client.db(process.env.MONGODB_DB || 'admin').command({ ping: 1 })
      mongoAttempt = { ok: true, message: 'connected and ping successful' }
    } catch (err: any) {
      mongoAttempt = { ok: false, message: err?.message || String(err) }
    } finally {
      try { await client.close() } catch (_) {}
    }
  } else {
    mongoAttempt = { ok: false, message: 'MONGODB_URI not set' }
  }

  const payload = {
    env: {
      mongodbUriPresent: Boolean(process.env.MONGODB_URI),
      mongodbDb: process.env.MONGODB_DB || null,
      adminTokenPresent: Boolean(process.env.ADMIN_TOKEN),
      generateAdminTokenOptIn: process.env.GENERATE_ADMIN_TOKEN === '1'
    },
    hosts: hostChecks,
    mongoAttempt,
    timestamp: new Date().toISOString()
  }

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
