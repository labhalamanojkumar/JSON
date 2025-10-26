import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

let pool: mysql.Connection | null = null

export async function getMysqlConnection() {
  if (pool) return pool
  const url = process.env.MYSQL_URL || process.env.MYSQL_URI || process.env.DATABASE_URL || ''
  if (!url) throw new Error('MYSQL_URL not set')
  const u = new URL(url)

  const options: any = {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
    database: u.pathname ? u.pathname.replace(/^\//, '') : undefined,
  }

  // SSL support
  const sslMode = u.searchParams.get('ssl-mode') || u.searchParams.get('sslmode')
  if (sslMode === 'REQUIRED' || sslMode === 'VERIFY_CA' || sslMode === 'VERIFY_IDENTITY') {
    options.ssl = {
      rejectUnauthorized: sslMode !== 'REQUIRED' // for REQUIRED, allow invalid certs if no CA
    }

    // Support mounted CA file
    const caPath = process.env.MYSQL_TLS_CA_FILE || process.env.MYSQL_CA_FILE || ''
    if (caPath) {
      try {
        const resolved = path.isAbsolute(caPath) ? caPath : path.join(process.cwd(), caPath)
        const pem = fs.readFileSync(resolved, { encoding: 'utf8' })
        options.ssl.ca = pem
        options.ssl.rejectUnauthorized = true // require valid CA
      } catch (err) {
        console.warn('[mysql] failed to read CA file at', caPath, err)
      }
    }

    // Allow invalid certs via env
    const allowInvalid = String(process.env.MYSQL_TLS_ALLOW_INVALID || '').toLowerCase() === 'true'
    if (allowInvalid) {
      options.ssl.rejectUnauthorized = false
    }
  }

  pool = await mysql.createConnection(options)
  return pool
}
