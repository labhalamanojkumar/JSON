import { MongoClient, Db } from 'mongodb'

const rawUri = process.env.MONGODB_URI || ''
const dbNameFromEnv = process.env.MONGODB_DB || ''

// Check if we're in build time (Next.js static generation)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-production-server' ||
  process.env.NODE_ENV === 'test'

if (!rawUri && !isBuildTime) {
  console.warn('Warning: MONGODB_URI is not set. MongoDB operations will fail until it is provided.')
}

declare global {
  // allow global caching across module reloads in development
  // eslint-disable-next-line no-var
  var __mongo_client__ : MongoClient | undefined
  // eslint-disable-next-line no-var
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
      const client = new MongoClient(uri)
      await client.connect()
      console.info(`MongoDB: connected (attempt ${attempt})`)
      return client
    } catch (err: any) {
      console.warn(`MongoDB: connect attempt ${attempt} failed: ${err && err.message ? err.message : err}`)
      if (attempt < retries) await wait(delay)
    }
  }

  console.error('MongoDB: all connection attempts failed')
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
