import mongoose from "mongoose";
import { Server } from "http";

let isShuttingDown = false;

export async function gracefulShutdown(server: Server, signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`📴 Received ${signal}. Shutting down gracefully...`);

  try {
    // 1️⃣ Stop accepting new connections
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

    // 2️⃣ Close DB connections
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");

    // 3️⃣ Exit cleanly
    process.exit(0);
  } catch (err) {
    console.log("💥 Error during shutdown:", err);
    process.exit(1);
  }
}
