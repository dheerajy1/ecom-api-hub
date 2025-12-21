// src/lib/mongo.ts
import mongoose from "mongoose";

const uri = process.env.MONGO_URL!;

export async function connectDB() {
  // Check if mongoose is already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "ecom-api-hub",
    });

    console.log("MongoDB connected:", conn.connection.host);
  } catch (error: unknown) {
    console.error("MongoDB connection error:", error instanceof Error ? error.message : error);
    throw new Error("Database connection failed");
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
}