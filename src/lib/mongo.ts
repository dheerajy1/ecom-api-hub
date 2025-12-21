// src/lib/mongo.ts
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;
if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined");
}

// Global cache (survives hot reloads)
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (globalForMongoose._mongoose!.conn) {
    return globalForMongoose._mongoose!.conn;
  }

  if (!globalForMongoose._mongoose!.promise) {
    globalForMongoose._mongoose!.promise = mongoose.connect(MONGO_URL, {
      dbName: "ecom-api-hub",
    });
  }

  globalForMongoose._mongoose!.conn =
    await globalForMongoose._mongoose!.promise;

  console.log("MongoDB connected");

  return globalForMongoose._mongoose!.conn;
}
