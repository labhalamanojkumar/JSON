#!/usr/bin/env node
/* Migrate all collections from MongoDB into MySQL tables.
   This script will:
   - Connect to MongoDB using MONGODB_URI from env
   - Connect to MySQL using MYSQL_URL env (or MYSQL_URI)
   - For each collection in MongoDB, create a corresponding table in MySQL
     with columns: id VARCHAR(64) PRIMARY KEY, data JSON, createdAt DATETIME NULL
   - Insert each document with _id mapped to id and the document stored in data

   WARNING: This is a generic migration that preserves documents as JSON in MySQL.
   After migration you can iterate and normalize schemas into relational tables if needed.
*/

const { MongoClient } = require('mongodb')
const mysql = require('mysql2/promise')

async function parseMysqlUrl(url) {
  // simple parser for mysql://user:pass@host:port/database?params
  try {
    const u = new URL(url)
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port, 10) : 3306,
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: u.pathname ? u.pathname.replace(/^\//, '') : undefined,
      params: u.searchParams
    }
  } catch (e) {
    throw new Error('Invalid MYSQL_URL or MYSQL_URI')
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI
  const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_URI || process.env.DATABASE_URL
  if (!mongoUri) {
    console.error('MONGODB_URI not set in environment')
    process.exit(2)
  }
  if (!mysqlUrl) {
    console.error('MYSQL_URL (or MYSQL_URI / DATABASE_URL) not set in environment')
    process.exit(2)
  }

  console.log('Connecting to MongoDB...')
  const mclient = new MongoClient(mongoUri)
  await mclient.connect()
  const mdb = mclient.db(process.env.MONGODB_DB || undefined)

  console.log('Parsing MySQL connection...')
  const cfg = await parseMysqlUrl(mysqlUrl)
  console.log('Connecting to MySQL...', cfg.host, cfg.port, cfg.database)
  const sql = await mysql.createConnection({ host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password, database: cfg.database })

  try {
    const collections = await mdb.listCollections().toArray()
    console.log('Found collections:', collections.map(c => c.name).join(', '))

    for (const colInfo of collections) {
      const name = colInfo.name
      const table = name.replace(/[^a-zA-Z0-9_]/g, '_')
      console.log('\n=== Migrating collection:', name, '-> table:', table)

      // create table if not exists
      const createSql = `CREATE TABLE IF NOT EXISTS \`${table}\` (\n  id VARCHAR(64) PRIMARY KEY,\n  data JSON NULL,\n  createdAt DATETIME NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
      await sql.query(createSql)

      // stream documents in batches to avoid high memory use
      const cursor = mdb.collection(name).find({})
      let count = 0
      while (await cursor.hasNext()) {
        const doc = await cursor.next()
        const id = doc._id ? String(doc._id) : String(Date.now()) + '_' + Math.random().toString(36).slice(2,8)
        const createdAt = doc.createdAt ? new Date(doc.createdAt) : null
        // remove _id from stored JSON to avoid duplication
        const copy = { ...doc }
        delete copy._id
        // insert or replace
        try {
          await sql.query(`REPLACE INTO \`${table}\` (id, data, createdAt) VALUES (?, ?, ?)` , [id, JSON.stringify(copy), createdAt])
          count++
        } catch (e) {
          console.error('Failed to insert doc id=', id, e.message || e)
        }
      }
      console.log(`Migrated ${count} documents into ${table}`)
    }

    console.log('\nMigration complete.')
  } finally {
    try { await mclient.close() } catch(_) {}
    try { await sql.end() } catch(_) {}
  }
}

main().catch((err) => { console.error('Migration failed:', err); process.exit(1) })
