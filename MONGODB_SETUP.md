# MongoDB Integration Guide for Nova AI

MongoDB support has been configured across the Nova AI platform, providing a flexible, production-ready database layer that seamlessly supports both **MongoDB Atlas (Cloud)** and **Local MongoDB instances** via environment variables, paired with offline-safe local caching.

---

## 🚀 Quick Start

### 1. Configure Connection String
Open `server/.env` (or copy `.env.example` to `.env.local` / `.env`):

#### Option A: Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/nova
```

#### Option B: MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/nova?retryWrites=true&w=majority
```

---

## 🏗️ Architecture & Implementation Details

```
                          ┌───────────────────────────┐
                          │   React 19 Frontend SPA   │
                          │   (AppContext & UI Views) │
                          └─────────────┬─────────────┘
                                        │
                         Bidirectional Sync & Cache
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
          ┌───────────────────┐                   ┌───────────────────┐
          │  localStorage     │                   │  src/data/api.ts  │
          │  (Instant Cache)  │                   │  (REST API Client)│
          └───────────────────┘                   └─────────┬─────────┘
                                                            │
                                                   HTTP REST Endpoints
                                                            │
                                                            ▼
                                                  ┌───────────────────┐
                                                  │  Express Server   │
                                                  │  (server/index.ts)│
                                                  └─────────┬─────────┘
                                                            │
                                                        Mongoose
                                                            │
                                                            ▼
                                                  ┌───────────────────┐
                                                  │  MongoDB Atlas /  │
                                                  │  Local Database   │
                                                  └───────────────────┘
```

### 1. Database Connection & Caching (`server/db.ts`)
- Automatically caches the connection instance (`global.mongooseCache`) to prevent connection storms in development HMR and Vercel serverless environments.
- Handles graceful reconnection and fallback if the database server is booting or temporarily unreachable.

### 2. Mongoose Schemas & Models (`server/models/`)
- **`User.ts`**: Registered accounts, email index, hashed passwords, verification timestamps, and assigned roles.
- **`Builder.ts`**: Builder profiles, skills, reputation scores, availability, completed projects, and portfolio links.
- **`Company.ts`**: Company & Investor profiles, industry, organization size, investment focus, and portfolio history.
- **`Project.ts`**: Posted projects, required skills, team size, budget, category, and lifecycle statuses.
- **`Application.ts`**: Project applications, builder references, statuses (`pending`, `accepted`, `rejected`), and response logs.
- **`Investment.ts`**: Investment marketplace opportunities (`InvestmentProject`), signed contracts (`InvestmentAgreement`), and project inquiries (`InvestorInquiry`).
- **`Team.ts`**: Collaboration rooms (`TeamRoom`) and room messages (`TeamMessage`).

### 3. REST API Endpoints (`server/routes/` & `server/index.ts`)
- **Authentication**:
  - `POST /api/auth/register` - Create account & associated profile in MongoDB
  - `POST /api/auth/login` - Verify credentials against MongoDB
  - `GET /api/auth/user/:email` - Fetch registered user metadata
  - `PUT /api/auth/reset-password` - Update password hash in MongoDB
- **Projects**:
  - `GET /api/projects` - Retrieve all projects
  - `POST /api/projects` - Create project in MongoDB
  - `PUT /api/projects/:id` - Update project details
  - `DELETE /api/projects/:id` - Remove project
- **Profiles**:
  - `GET /api/profiles/builders` & `PUT /api/profiles/builders/:userId`
  - `GET /api/profiles/companies` & `PUT /api/profiles/companies/:userId`
- **Applications**:
  - `GET /api/applications` & `POST /api/applications` & `PATCH /api/applications/:id`
- **Investor Portal**:
  - `GET /api/investor/projects` - Marketplace projects
  - `GET /api/investor/agreements` & `POST /api/investor/agreements` - Contracts
  - `GET /api/investor/inquiries` & `POST /api/investor/inquiries` - Messages
- **Team Rooms**:
  - `GET /api/team/rooms` & `POST /api/team/rooms`
  - `GET /api/team/messages` & `POST /api/team/messages`
- **Health & Diagnostics**:
  - `GET /api/db-status` - Returns MongoDB connection state and collection document counts.
  - `POST /api/seed` - Triggers automatic database seeding if collections are empty.

### 4. Automatic Database Seeding (`server/seedDatabase.ts`)
When MongoDB connects for the first time, `seedDatabaseIfEmpty()` automatically verifies collection counts. If empty, it seeds initial demo data from `src/data/seed.ts` and `src/data/investor-seed.ts`.

### 5. Frontend Client & Offline Fallback (`src/data/api.ts` & `src/state/AppContext.tsx`)
- On startup, `AppContext` loads cached data from `localStorage` immediately, then queries MongoDB in the background to update with fresh database records.
- User actions (adding projects, editing profiles, submitting applications, signing agreements) update state optimistically and push updates to MongoDB via REST endpoints.
- If the MongoDB instance is offline or unreachable, the application falls back to local storage without throwing unhandled exceptions.

---

## 🔍 How to Test & Verify

1. **Restart the dev server**:
   ```bash
   npm run dev
   ```
   *(Or start just the backend with `npm run dev:server`)*

2. **Check MongoDB Status**:
   In your browser or terminal, visit:
   ```
   http://localhost:4001/api/db-status
   ```
   Response example:
   ```json
   {
     "connected": true,
     "state": "connected",
     "uri": "mongodb://localhost:27017/nova",
     "collections": {
       "users": 0,
       "builders": 6,
       "companies": 5,
       "projects": 6,
       "applications": 8,
       "investmentProjects": 5,
       "investmentAgreements": 2,
       "teamRooms": 0,
       "teamMessages": 0
     }
   }
   ```
