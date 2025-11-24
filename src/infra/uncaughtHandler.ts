import { gracefulShutdown } from "./gracefulShutdown.js";
import { Server } from "http";

export function regProcessHandlers(server: Server) {
  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, () => gracefulShutdown(server, signal))
  );

  process.on("uncaughtException", (err) => {
    console.log("💥 Uncaught Exception:", err);
    gracefulShutdown(server, "uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.log("🚨 Unhandled Rejection:", reason);
    gracefulShutdown(server, "unhandledRejection");
  });
}
