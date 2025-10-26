/*
  One-shot migration/import script
  Usage: node scripts/importData.js
  It reads `data/ad-providers.json` and `data/analytics.json` and imports into MongoDB collections:
    - ad_providers
    - analytics_events
    - analytics_counters

  The script loads environment variables from `.env.local` using dotenv.
*/

const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || null

async function main() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env.local')
    process.exit(2)
  }
  console.log('Connecting to', MONGODB_URI.replace(/:(.*)@/, ':*****@'))
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db(MONGODB_DB || undefined)

    // providers
    const providersPath = path.join(process.cwd(), 'data', 'ad-providers.json')
    if (fs.existsSync(providersPath)) {
      const raw = fs.readFileSync(providersPath, 'utf-8')
      const list = JSON.parse(raw || '[]')
      if (list.length) {
        const col = db.collection('ad_providers')
        for (const p of list) {
          await col.updateOne({ id: p.id }, { $set: p }, { upsert: true })
        }
        console.log(`Imported ${list.length} provider(s) into ad_providers`)
      } else {
        console.log('No providers found to import')
      }
    } else {
      console.log('No data/ad-providers.json file found')
    }

    // analytics
    const analyticsPath = path.join(process.cwd(), 'data', 'analytics.json')
    if (fs.existsSync(analyticsPath)) {
      const raw = fs.readFileSync(analyticsPath, 'utf-8')
      const obj = JSON.parse(raw || '{"events":[],"counters":{}}')
      const events = obj.events || []
      const counters = obj.counters || {}
      const eventsCol = db.collection('analytics_events')
      const countersCol = db.collection('analytics_counters')
      if (events.length) {
        // normalize timestamps
        const docs = events.map(e => ({ eventType: e.eventType, label: e.label || null, ts: e.ts || new Date().toISOString() }))
        await eventsCol.insertMany(docs)
        console.log(`Imported ${docs.length} analytics event(s) into analytics_events`)
      } else {
        console.log('No analytics events to import')
      }
      const counterDocs = Object.keys(counters).map(k => ({ eventType: k, count: counters[k] }))
      for (const c of counterDocs) {
        await countersCol.updateOne({ eventType: c.eventType }, { $set: c }, { upsert: true })
      }
      if (counterDocs.length) console.log(`Upserted ${counterDocs.length} analytics counter(s) into analytics_counters`)
    } else {
      console.log('No data/analytics.json file found')
    }

    console.log('Import complete')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(3)
  } finally {
    try { await client.close() } catch (e) { }
  }
}

main()
