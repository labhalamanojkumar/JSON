import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const dbNameFromEnv = process.env.MONGODB_DB || ''

if (!uri) {
  // don't throw at module load time in some environments, but warn
  // runtime checks will fail if not provided
  console.warn('Warning: MONGODB_URI is not set. MongoDB operations will fail until it is provided.')
}

declare global {
  // allow global caching across module reloads in development
  // eslint-disable-next-line no-var
  var __mongo_client__ : MongoClient | undefined
  // eslint-disable-next-line no-var
  var __mongo_client_promise__ : Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

function makeDevFriendlyUri(input: string) {
  // In development only, if the URI doesn't already explicitly allow invalid certs,
  // append tlsAllowInvalidCertificates=true so local dev with self-signed certs works.
  if (process.env.NODE_ENV !== 'development') return input
  if (!input) return input
  try {
    if (input.includes('tlsAllowInvalidCertificates')) return input
    // append as query param
    return input + (input.includes('?') ? '&' : '?') + 'tlsAllowInvalidCertificates=true'
  } catch (e) {
    return input
  }
}

const effectiveUri = makeDevFriendlyUri(uri)

if (!uri) {
  // create a dummy promise that will immediately reject when used
  clientPromise = Promise.reject(new Error('MONGODB_URI is not set'))
} else if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so that HMR doesn't create new clients
  if (!global.__mongo_client_promise__) {
    client = new MongoClient(effectiveUri)
    global.__mongo_client__ = client
    global.__mongo_client_promise__ = client.connect()
  }
  clientPromise = global.__mongo_client_promise__ as Promise<MongoClient>
} else {
  // In production/build time we must NOT connect eagerly during module import.
  // Creating a MongoClient synchronously here causes Next.js build to attempt
  // to read files referenced by the connection string (e.g. tlsCAFile) which
  // may not exist inside the builder image. Defer connection until runtime
  // when getMongoClient() is called.
  clientPromise = null
}

let cachedClientPromise: Promise<MongoClient> | null = null

function createClientPromise(): Promise<MongoClient> {
  if (!uri) return Promise.reject(new Error('MONGODB_URI is not set'))
  // create client and connect
  const clientLocal = new MongoClient(effectiveUri)
  const p = clientLocal.connect()
  // in development, cache on global to survive HMR
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    global.__mongo_client__ = clientLocal
    // @ts-ignore
    global.__mongo_client_promise__ = p
  }
  return p
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!cachedClientPromise) {
    // if a global cached promise exists (HMR), reuse it
    // @ts-ignore
    if (process.env.NODE_ENV === 'development' && global.__mongo_client_promise__) {
      // @ts-ignore
      cachedClientPromise = global.__mongo_client_promise__
    } else if (clientPromise) {
      // if a clientPromise was created elsewhere, use it
      cachedClientPromise = clientPromise
    } else {
      // otherwise create a fresh connection now (deferred)
      cachedClientPromise = createClientPromise()
      // store the clientPromise for potential reuse
      clientPromise = cachedClientPromise
    }
  }
  return cachedClientPromise
}

export async function getDb(name?: string): Promise<Db> {
  const client = await getMongoClient()
  // prefer explicit param, then MONGODB_DB, then DB from URI path, then default
  if (name) return client.db(name)
  if (dbNameFromEnv) return client.db(dbNameFromEnv)
  try {
    const parsed = new URL(uri)
    const maybe = parsed.pathname.replace(/^\//, '')
    if (maybe) return client.db(maybe)
  } catch (e) {
    // ignore
  }
  return client.db('jsonformatter')
}
