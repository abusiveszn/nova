import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Configure reliable DNS servers to avoid querySrv ECONNREFUSED issues on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
  // In environments where setting custom DNS is not permitted, proceed with system defaults
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nova";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB, reusing existing connection in dev or serverless environments.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

    console.log(`[MongoDB] Connecting to: ${MONGODB_URI.replace(/\/\/[^@]+@/, "//***:***@")}`);

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB] Connected successfully to database: ${mongooseInstance.connection.name}`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error(`[MongoDB] Connection error:`, err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

/**
 * Returns current MongoDB connection status
 */
export function getDbStatus(): { connected: boolean; state: string; uri: string } {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const readyState = mongoose.connection.readyState;
  return {
    connected: readyState === 1,
    state: states[readyState] || "unknown",
    uri: MONGODB_URI.replace(/\/\/[^@]+@/, "//***:***@"),
  };
}
