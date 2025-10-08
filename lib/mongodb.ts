import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI as string | undefined;
if (!uri) {
  throw new Error('MONGODB_URI is not set');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  } as const,
  tls: true,
  // Allow connecting even if local OpenSSL trust store blocks validation (Windows/Corp proxy)
  tlsAllowInvalidCertificates: true,
} as const;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, clientOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, clientOptions);
  clientPromise = client.connect();
}

export async function getDb(databaseName = 'app'): Promise<import('mongodb').Db> {
  const connectedClient = await clientPromise!;
  return connectedClient.db(databaseName);
}


