import app from "./app.js";
import http, { Server } from "http";
import { connectDB } from "@/configs/db.js";
import configs from "@/configs/index.js";
import { regProcessHandlers } from "@/infra/uncaughtHandler.js";
const PORT = configs.PORT || 5000;

let server: Server = http.createServer(app);
 
async function bootstrap() {
  try {
    await connectDB();
    server.listen(PORT, () =>
      console.log(`✅ Server listening on PORT:${PORT}`)
    );

    regProcessHandlers(server);
  } catch (err) {
    console.log("❌ Server startup failed:", err);
    process.exit(1);
  }
}

bootstrap();
