/*
  Script to add/update an admin user into MongoDB admin_users collection.
  Usage: node scripts/addAdmin.js <username> <password>
  It reads MONGODB_URI and MONGODB_DB from .env.local
*/
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') })

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || undefined

async function main() {
  const [,, username, password] = process.argv
  if (!username || !password) {
    console.error('Usage: node scripts/addAdmin.js <username> <password>')
    process.exit(2)
  }
  if (!uri) {
    console.error('MONGODB_URI not set in .env.local')
    process.exit(2)
  }
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const col = db.collection('admin_users')
  const hash = await bcrypt.hash(password, 10)
  await col.updateOne({ username }, { $set: { username, passwordHash: hash, createdAt: new Date() } }, { upsert: true })
  console.log(`Upserted admin user '${username}' (password stored as bcrypt hash)`)
  } catch (e) {
    console.error('Failed to add admin:', e)
    process.exit(3)
  } finally {
    await client.close()
  }
}

main()
