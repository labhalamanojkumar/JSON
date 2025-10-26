import mysql from 'mysql2/promise'

let pool: mysql.Connection | null = null

export async function getMysqlConnection() {
  if (pool) return pool
  const url = process.env.MYSQL_URL || process.env.MYSQL_URI || process.env.DATABASE_URL || ''
  if (!url) throw new Error('MYSQL_URL not set')
  const u = new URL(url)
  pool = await mysql.createConnection({
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
    database: u.pathname ? u.pathname.replace(/^\//, '') : undefined,
  })
  return pool
}
