# ⚡ Nova AI — Autonomous Intelligence & Builder Ecosystem

Nova AI is an intelligent talent matching and collaboration platform connecting elite builders, innovative startups, venture investors, and learners through automated heuristic scoring, live telemetry, and smart milestone escrows.

---

## 🔐 Administrator Authentication & Overseer Portal

The platform includes a dedicated **Admin Authentication Gate** guarding the **Overseer Command Center**.

### Admin Login Credentials

| Parameter | Value |
| :--- | :--- |
| **Admin Portal URL** | [`http://localhost:5173/admin`](http://localhost:5173/admin) or [`http://localhost:5173/admin/login`](http://localhost:5173/admin/login) |
| **Admin Username / Email** | `novafuturegrid@gmail.com` |
| **Security Access Key / Password** | `nova@admin` |
| **Clearance Level** | `Level 5 Root Clearance` |
| **Role Assignment** | `System Overseer / Admin` |

> [!IMPORTANT]
> Any direct navigation to `/admin` requires passing through the **Admin Authentication Page**. Unauthenticated visitors cannot access system controls without presenting these credentials. A 1-click **"Quick Fill"** button is also provided directly on the admin login page for rapid verification.

### Overseer Subsystems & Capabilities

Upon authenticating as administrator, the Overseer Dashboard grants full access to:
- **Live System Telemetry**: Real-time MongoDB connection pool status, AI matcher pipeline heartbeats, and simulated server load.
- **AI Matching Engine Hyperparameter Tuning**: Adjust heuristic weights (Skills, Role, Experience, Availability, Reputation) and auto-recommendation thresholds.
- **User Management & Verification**: Inspect user entities, issue verified credential badges, adjust reputation scores, or suspend accounts.
- **Project & Escrow Controls**: Track active projects and disburse funding milestone escrows.
- **Global Broadcasts**: Issue platform-wide banners (`info`, `warning`, `critical`) across all active user sessions.
- **System Audit Logs**: Real-time event and security audit trail.
- **Console Lock & Logout**: Instantly lock the console to return to the Admin Auth Gate.

---

## 👥 Platform Demo Accounts

For testing different persona experiences across the ecosystem:

| Persona | Email / Username | Password | Role Features |
| :--- | :--- | :--- | :--- |
| **System Admin** | `novafuturegrid@gmail.com` | `nova@admin` | Full Overseer Console, Root telemetry, User & Project Moderation |
| **Elite Builder** | `emeka@nova.dev` | Any valid password | Builder Profile, AI matching feed, project application, team room chat |
| **Company / Founder** | `founder@nova.dev` | Any valid password | Post projects, review applicants, release milestone escrows |
| **Venture Investor** | `investor@nova.dev` | Any valid password | Deal flow radar, co-investment agreements, portfolio metrics |
| **Learner** | New signup / Learner role | Any valid password | Curriculum tracks, interactive code labs, skill progress |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm**
- *(Optional)* **MongoDB** instance (falls back to resilient local storage if disconnected)

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default configuration values:
```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/nova-ai
VITE_API_URL=http://localhost:4001
```

### 3. Run Development Servers

#### Option A: Full-Stack (Frontend + Backend concurrently)
```bash
npm run dev:all
```
*(or run them separately)*:

#### Frontend (Vite)
```bash
npm run dev
```
> App runs at `http://localhost:5173`

#### Backend API (Express + MongoDB)
```bash
npm run server
```
> Server runs at `http://localhost:4001`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion
- **State Management**: React Context API with persistent localStorage & sessionStorage synchronization
- **UI Components**: Radix UI primitives with tailored cyberpunk/obsidian dark mode
- **Backend API**: Express.js, TypeScript, Mongoose ODM
- **Database**: MongoDB with automatic fallback to client-side entity storage
