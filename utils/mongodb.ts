import { MongoClient, Db } from 'mongodb'
import fs from 'fs'
import path from 'path'

const rawUri = process.env.MONGODB_URI || ''
const dbNameFromEnv = process.env.MONGODB_DB || ''

// Check if we're in build time (Next.js static generation)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-production-server' ||
  process.env.NODE_ENV === 'test'

// Only emit Mongo-related logs when explicitly enabled (avoid noisy prints if the app
// has migrated to MySQL). Enable with DEBUG_MONGO=1 in env when debugging legacy Mongo.
const mongoLogEnabled = String(process.env.DEBUG_MONGO || '') === '1'
function mlog(level: 'info' | 'warn' | 'error', ...args: any[]) {
  if (!mongoLogEnabled) return
  // @ts-ignore
  console[level](...args)
}

if (!rawUri && !isBuildTime) {
  mlog('warn', 'Warning: MONGODB_URI is not set. MongoDB operations will fail until it is provided.')
}

declare global {
  // allow global caching across module reloads in development
   
  var __mongo_client__ : MongoClient | undefined
   
  var __mongo_client_promise__ : Promise<MongoClient | null> | undefined
}

function appendQueryParam(uri: string, key: string, value: string) {
  if (!uri) return uri
  if (uri.includes(`${key}=`)) return uri
  return uri + (uri.includes('?') ? '&' : '?') + `${key}=${encodeURIComponent(value)}`
}

function makeEffectiveUri(input: string) {
  let u = input || ''

  // Optional: allow invalid certs via env toggle (useful for self-signed certs)
  const allowInvalid = String(process.env.MONGO_TLS_ALLOW_INVALID || process.env.MONGO_ALLOW_INVALID_TLS || '').toLowerCase() === 'true'
  if (allowInvalid) {
    u = appendQueryParam(u, 'tlsAllowInvalidCertificates', 'true')
  }

  // Set server selection timeout (ms)
  const serverSelectionTimeout = process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || process.env.MONGO_SERVER_SELECTION_TIMEOUT || ''
  if (serverSelectionTimeout) {
    u = appendQueryParam(u, 'serverSelectionTimeoutMS', serverSelectionTimeout)
  }

  return u
}

const effectiveUri = makeEffectiveUri(rawUri)

let cachedClientPromise: Promise<MongoClient | null> | null = null

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

async function connectWithRetries(uri: string): Promise<MongoClient | null> {
  if (!uri) return null

  const retries = parseInt(process.env.MONGO_CONNECT_RETRIES || process.env.MONGO_RETRIES || '3', 10)
  const delay = parseInt(process.env.MONGO_RETRY_DELAY_MS || '2000', 10)

  for (let attempt = 1; attempt <= retries; attempt++) {
  try {
      // Build options for MongoClient. Support mounting a CA file into the container
      // and passing it to the driver via tlsCA (preferred) so self-signed CA can be trusted.
      const options: any = {}

      const allowInvalid = String(process.env.MONGO_TLS_ALLOW_INVALID || process.env.MONGO_ALLOW_INVALID_TLS || '').toLowerCase() === 'true'
      if (allowInvalid) {
        options.tlsAllowInvalidCertificates = true
      }

      // server selection timeout (ms)
      const serverSelectionTimeout = parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || process.env.MONGO_SERVER_SELECTION_TIMEOUT || '0', 10)
      if (serverSelectionTimeout > 0) {
        options.serverSelectionTimeoutMS = serverSelectionTimeout
      }

      // Support a mounted CA file via env var MONGO_TLS_CA_FILE or MONGODB_TLS_CA_FILE.
      const caPath = process.env.MONGO_TLS_CA_FILE || process.env.MONGODB_TLS_CA_FILE || ''
      if (caPath) {
        try {
          const resolved = path.isAbsolute(caPath) ? caPath : path.join(process.cwd(), caPath)
          const pem = fs.readFileSync(resolved, { encoding: 'utf8' })
          // MongoClient accepts tlsCA as array of PEM strings or Buffer
          options.tlsCA = [pem]
          options.tls = true
        } catch (err) {
          mlog('warn', '[mongodb] failed to read CA file at', caPath, err)
        }
      }

      const client = new MongoClient(uri, options)
      await client.connect()
      mlog('info', `MongoDB: connected (attempt ${attempt})`)
      return client
    } catch (err: any) {
      mlog('warn', `MongoDB: connect attempt ${attempt} failed: ${err && err.message ? err.message : err}`)
      if (attempt < retries) await wait(delay)
    }
  }
  mlog('error', 'MongoDB: all connection attempts failed')
  return null
}

function createMockDb(): Db {
  const mockDb = {
    collection: () => ({
      insertOne: () => Promise.resolve({}),
      updateOne: () => Promise.resolve({}),
      find: () => ({ toArray: () => Promise.resolve([]) }),
      findOne: () => Promise.resolve(null),
      deleteOne: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({})
    })
  } as unknown as Db
  return mockDb
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (isBuildTime) {
    // don't attempt to connect during Next.js build
    return null
  }

  if (cachedClientPromise) return cachedClientPromise

  // reuse global cache in development to survive HMR
  // @ts-ignore
  if (process.env.NODE_ENV === 'development' && global.__mongo_client_promise__) {
    // @ts-ignore
    cachedClientPromise = global.__mongo_client_promise__
    return cachedClientPromise
  }

  const p = (async () => {
    const client = await connectWithRetries(effectiveUri)
    if (!client) return Promise.resolve(null)
    // cache on global in development
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      global.__mongo_client__ = client
      // @ts-ignore
      global.__mongo_client_promise__ = Promise.resolve(client)
    }
    return client
  })()

  cachedClientPromise = p
  return p
}

export async function getDb(name?: string): Promise<Db> {
  // During build time, return a mock database to avoid build-time DB calls
  if (isBuildTime) return createMockDb()

  const client = await getMongoClient()
  if (!client) {
    // return mock DB instead of throwing so routes can respond gracefully
    return createMockDb()
  }

  // prefer explicit param, then MONGODB_DB, then DB from URI path, then default
  if (name) return client.db(name)
  if (dbNameFromEnv) return client.db(dbNameFromEnv)
  try {
    const parsed = new URL(rawUri)
    const maybe = parsed.pathname.replace(/^\//, '')
    if (maybe) return client.db(maybe)
  } catch (e) {
    // ignore
  }
  return client.db('jsonformatter')
}
