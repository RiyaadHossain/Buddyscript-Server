import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env['NODE_ENV'] || "development",
  PORT: process.env['PORT'] || 3000,
  MONGO_URI: process.env['MONGO_URI'] || "mongodb://localhost:27017/mydatabase",
  JWT_SECRET: process.env['JWT_SECRET'],
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || "1h",
  REFRESH_TOKEN_SECRET: process.env['REFRESH_TOKEN_SECRET'],
  REFRESH_TOKEN_EXPIRES_IN: process.env['REFRESH_TOKEN_EXPIRES_IN'] || "7d",
  SMTP_HOST: process.env['SMTP_HOST'],
  SMTP_PORT: process.env['SMTP_PORT'],
  SMTP_USER: process.env['SMTP_USER'],
  SMTP_PASS: process.env['SMTP_PASS'],
  MAIL_FROM: process.env['MAIL_FROM'],
  CLIENT_URL: process.env['CLIENT_URL'],
  IMGBB_API_KEY: process.env['IMGBB_API_KEY'],
};
