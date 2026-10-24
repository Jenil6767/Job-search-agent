import mongoose from 'mongoose';

interface ConnectionOptions {
  uri?: string;
  maxRetries?: number;
  retryIntervalMs?: number;
}

let isConnecting = false;

export async function connectDatabase(options: ConnectionOptions = {}): Promise<typeof mongoose> {
  const uri = options.uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_jobpilot';
  const maxRetries = options.maxRetries ?? 5;
  const retryIntervalMs = options.retryIntervalMs ?? 3000;

  if ((mongoose.connection.readyState as number) === 1) {
    return mongoose;
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    if ((mongoose.connection.readyState as number) === 1) return mongoose;
  }

  isConnecting = true;

  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      attempts++;
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        autoIndex: true,
      });

      console.log(`[Database] Connected successfully to MongoDB: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
      isConnecting = false;
      return mongoose;
    } catch (err) {
      console.error(`[Database] Connection attempt ${attempts}/${maxRetries} failed:`, (err as Error).message);
      if (attempts >= maxRetries) {
        isConnecting = false;
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${(err as Error).message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
    }
  }

  isConnecting = false;
  return mongoose;
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] Disconnected from MongoDB');
  }
}

export function isDatabaseConnected(): boolean {
  return (mongoose.connection.readyState as number) === 1;
}

export async function pingDatabase(): Promise<boolean> {
  try {
    if (!isDatabaseConnected() || !mongoose.connection.db) {
      return false;
    }
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    return !!result?.ok;
  } catch {
    return false;
  }
}
