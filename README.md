# Buddyscript Server (AppifyLab Backend)

A modular **Node.js + TypeScript + Express + MongoDB** backend for a social feed application (stored in this repository under `server`). It provides user authentication, post creation with image uploads, comments, likes, and common production-ready middlewares (rate-limiting, security, logging, validation).

---

## 📖 Table of Contents

- [🧩 How the Application Works](#🧩-how-the-application-works)
- [🚀 Features](#🚀-features)
- [📂 Project Structure](#📂-project-structure)
- [🛠️ Tech Stack](#🛠️-tech-stack)
- [⚙️ Installation & Setup](#⚙️-installation--setup)
  - [1️⃣ Clone the repo](#1️⃣-clone-the-repo)
  - [2️⃣ Create a `.env` file and provide the values](#2️⃣-create-a-env-file-and-provide-the-values)
  - [3️⃣ Install and Run the server](#3️⃣-install-and-run-the-server)
- [🔗 API Endpoints](#🔗-api-endpoints)
  - [🔑 Authentication Module](#🔑-authentication-module)
  - [📝 Post Module](#📝-post-module)
  - [💬 Comment Module](#💬-comment-module)
  - [👍 Like Module](#👍-like-module)
- [💡 Configuration & Limits](#💡-configuration--limits)

---

## 🧩 How the Application Works

1. The server boots `src/server.ts` and initializes an Express app configured in `src/app.ts`.
2. Common security and utility middlewares are applied (CORS, Helmet, JSON/body parsing, cookie parser, request logging via Morgan, and Mongo sanitization).
3. API routes are mounted under the prefix `/api/v1` (see `src/app/routes/index.ts`).
4. Feature modules (Auth, Post, Comment, Like) expose REST endpoints. Protected routes require a valid JWT in the `Authorization` header.
5. File uploads are handled by Multer (local disk storage in `uploads/`) and images can be uploaded to ImgBB when API key is provided.
6. Centralized error handling and 404 handling are provided by middlewares in `src/app/middlewares`.

This backend is designed to be modular and easy to extend with new features.

## 🚀 Features

- **TypeScript-first**: Strong typing across modules.
- **Modular architecture**: Feature modules under `src/app/modules` (auth, post, comment, like).
- **JWT Authentication**: Simple JWT creation/verification via `src/helpers/jwt-helper.ts`.
- **File Uploads**: `singleFileUpload('image')` middleware; stored locally in `uploads/` and optionally uploaded to ImgBB.
- **Validation**: Zod-based validation via `src/app/middlewares/validate-req.ts` and per-module schemas.
- **Rate Limiting**: Global and login-specific rate limiters (`src/app/middlewares/rate-limit.ts`).
- **Security**: Helmet, CORS, and mongo-sanitize middleware.
- **Email (password reset)**: SMTP-based password reset flow using `src/helpers/emailSender.ts`.

---

## 📂 Project Structure


```
server/
├── src/
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # App bootstrap
│   ├── app/
│   │   ├── middlewares/      # auth, rate-limit, validation, error handlers
│   │   ├── modules/          # feature modules (auth, post, comment, like)
│   │   │   ├── auth/
│   │   │   ├── post/
│   │   │   ├── comment/
│   │   │   └── like/
│   │   └── routes/index.ts   # mounts modules under /api/v1
│   ├── configs/              # config loader (env), morgan config
│   ├── helpers/              # jwt-helper, fileUploader, emailSender
│   ├── views/                # email templates
│   └── uploads/              # uploaded files (created at runtime)
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Validation:** Zod
- **Auth:** JWT (`jsonwebtoken`)
- **Upload:** Multer (disk storage) + optional ImgBB upload
- **Email:** Nodemailer + Google's SMTP
- **Security & Ops:** Helmet, CORS, mongo-sanitize, express-rate-limit, express-slow-down, Morgan

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo

```powershell
git clone https://github.com/RiyaadHossain/Buddyscript-Server.git
cd server
```

### 2️⃣ Create a `.env` file and provide the values

Create a `.env` at the repository root (the app uses `dotenv` and `configs/index.ts` to load it).

Example `.env`:

```
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/appifylab

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (for password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
MAIL_FROM=no-reply@example.com
CLIENT_URL=http://localhost:3000

# ImgBB (optional)
IMGBB_API_KEY=your_imgbb_api_key
```

Notes:

- `JWT_EXPIRES_IN` defaults to `1h` if not provided in `.env`.
- `IMGBB_API_KEY` is used by `src/helpers/fileUploader.ts` when you want to upload images to ImgBB after local save.

### 3️⃣ Install and Run the server

```powershell
npm install
npm run dev   # runs with tsx in watch mode (development)
npm run build # transpile + tsc-alias
npm start     # start compiled app from dist
```

Server default URL: `http://localhost:3000` (or use `PORT` from `.env`). API base path: `/api/v1`.

---

## 🔗 API Endpoints

All endpoints are mounted under the prefix: `POST /api/v1/...` or `GET /api/v1/...` (depending on method). Protected endpoints require the `Authorization` header containing the JWT token (the middleware reads `req.headers.authorization`).

> Base: `http://{HOST}:{PORT}/api/v1`

### 🔑 Authentication Module

- `POST /auth/signup` — Register new user
  - Body: `{ firstName, lastName, email, password }`
- `POST /auth/login` — Login and receive token
  - Body: `{ email, password }`
  - Rate-limited: max 5 attempts per 10 minutes (loginRateLimiter)
- `POST /auth/forget-password` — Send password reset email
  - Body: `{ email }`
- `POST /auth/reset-password` — Reset password using token
  - Body: `{ token, newPassword }`

### 📝 Post Module

All post routes are under `POST /post` or `GET /post` relative to `/api/v1`.

- `GET /post/feed` — Get feed (protected)
  - Query: `?page=&limit=` (defaults: page=1, limit=10)
  - Requires `Authorization` header
- `GET /post/:id/likes` — Get likes for a post (protected)
- `GET /post/:id/comments` — Get comments for a post (protected)
- `POST /post` — Create a post (protected)
  - Middleware: `singleFileUpload('image')` to accept a single file named `image` (optional)
  - Body: form-data or JSON fields (`text`, `privacy`, etc.)
  - Uploaded files are saved in `uploads/`; if `IMGBB_API_KEY` is configured, the helper can upload images to ImgBB.
- `DELETE /post/:id` — Delete a post (protected)

### 💬 Comment Module

- `GET /comment` — List comments
  - Query: `?post=<postId>&page=&limit=`
- `POST /comment` — Create a comment (protected)
  - Body: `{ post: <postId>, text: string }`
- `DELETE /comment/:id` — Delete comment (protected)

### 👍 Like Module

- `POST /like` — Add a like (protected)
  - Body: `{ targetId, targetType?, reaction? }`
- `POST /like/unlike` — Remove a like (protected)
  - Body: `{ targetId, targetType? }`

### ✅ Health Check

- `GET /` — Returns `{ message: "🚀 Server is running!" }`

---

## 💡 Configuration & Limits

- **API prefix**: `\u007F/api/v1`
- **Authentication & JWT**:

  - Token creation/verification via `src/helpers/jwt-helper.ts`.
  - `JWT_SECRET` and `JWT_EXPIRES_IN` configured via `.env` (defaults applied in `src/configs/index.ts`).
  - The `auth` middleware expects a token in `Authorization` header (it uses the header string directly when verifying).

- **Rate limiting** (`src/app/middlewares/rate-limit.ts`):

  - `globalRateLimiter`: 100 requests per 5 minutes per IP.
  - `loginRateLimiter`: 5 requests per 10 minutes per IP for login.
  - `speedLimiter`: slows down repeated requests after 50 requests in 15 minutes.

- **File uploads** (`src/helpers/fileUploader.ts`):

  - Storage: local disk `uploads/` (directory created at runtime).
  - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
  - Max file size: 5 MB.
  - Optionally uploads to ImgBB (if `IMGBB_API_KEY` provided). Local file is removed after uploading to ImgBB.

- **Validation**: Zod is used for request body/query/params validation; validation schemas live in each module folder (e.g., `src/app/modules/post/post.validation.ts`).

- **Email / Password Reset**:
  - Reset tokens are stored on the user document in fields `resetPasswordToken` and `resetPasswordExpires`.
  - Default reset token expiry: 1 hour (set by the service code).

---

## Notes & Next Steps

- The application uses simple JWT access tokens returned in the login response body. There is a `REFRESH_TOKEN` config shape present in `src/configs/index.ts`, but refresh-token endpoints are not implemented in the current code.
- You can extend the upload flow to store files in cloud storage or to return the ImgBB URL directly on post creation.
- Add Postman / OpenAPI documentation by exporting routes and example requests for easier testing.

---
