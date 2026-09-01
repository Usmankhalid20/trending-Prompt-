import { MongoClient, type MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 0,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function connectMongo() {
  const client = new MongoClient(uri, options);

  try {
    await client.connect();
    return client;
  } catch (error) {
    await client.close().catch(() => {});
    throw error;
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (global._mongoClient) {
      return global._mongoClient;
    }

    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connectMongo()
        .then((client) => {
          global._mongoClient = client;
          return client;
        })
        .catch((error) => {
          global._mongoClientPromise = undefined;
          throw error;
        });
    }

    return global._mongoClientPromise;
  }

  return connectMongo();
}

const clientPromise = getMongoClient();
export default clientPromise;
