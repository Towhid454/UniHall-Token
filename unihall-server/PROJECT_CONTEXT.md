# UniHall - Smart Hall Management System

MERN Stack | MVC Pattern | Multi-tenant | MongoDB Atlas

## Rules for Claude

- Follow smart_hall.pdf plan strictly, one step at a time
- Give complete copy-paste-ready code
- Keep variable/function names consistent with what's already written
- After each step, tell me what to test before moving on

## Tech Stack

- Backend: Node.js + Express.js
- DB: MongoDB Atlas + Mongoose
- Auth: JWT (access + refresh) + bcrypt
- Validation: Zod / express-validator
- Frontend (later): React + Vite + Tailwind CSS

## Folder Structure (Backend)

unihall-server/
├── src/
│ ├── config/db.js
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── middlewares/
│ ├── services/
│ ├── utils/
│ ├── validators/
│ ├── app.js
│ └── server.js
├── .env
└── package.json

## Key Variable Names / Conventions

- DB connection function: connectDB()
- App entry: src/server.js
- Express app: src/app.js
- All routes prefix: /api
- Error class: ApiError
- Response class: ApiResponse
- Async wrapper: asyncHandler()
- JWT access token secret: process.env.JWT_SECRET
- JWT refresh secret: process.env.JWT_REFRESH_SECRET

## Roles (Enum)

student | hallAdmin | universityAdmin | superAdmin

## Multi-tenant Scope

University → Hall → Room → Student
Every query scoped by req.user.hall or req.user.university

## .env Variables

PORT=5000
MONGO_URI=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

## ✅ Completed Steps

### Backend

- Step 1 — Project Init (package.json, app.js, server.js, db.js, .env) ✅
- Step 2 — Folder Skeleton (all folders + empty files created) ✅

## 🔄 Current Step

### Backend Step 3 — Error Handling Core

- utils/ApiError.js
- utils/ApiResponse.js
- utils/asyncHandler.js
- middlewares/error.middleware.js

## ⏳ Remaining Backend Steps

- Step 4 — University & Hall Module
- Step 5 — Auth Module
- Step 6 — Student Profile Module
- Step 7 — Room Module
- Step 8 — Dining Module
- Step 9 — Wallet & Transaction Module
- Step 10 — Feedback & Support Module
- Step 11 — Admin Modules
- Step 12 — Testing
- Step 13 — Docs
  Here is my project context:
  [PROJECT_CONTEXT.md এর পুরো content paste করো]

Also, the full plan is in smart_hall.pdf (attached).

Let's continue with the current step.

6a44b87eaa883f1c0c5828cd
