// src/lib/mongo.ts
import mongoose from "mongoose";

const uri = process.env.MONGO_URL!;

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "ecom-api-hub", // database name
    });

    isConnected = true;
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error: unknown) {

    console.error("MongoDB connection error:", error instanceof Error ? error.message : error);
    throw new Error("Database connection failed");
  }
}

export async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log("MongoDB disconnected");
}
