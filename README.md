# AI Cyber Crime Management System (ACMS)

Full-stack web app — Next.js 14 + Railway MySQL + Claude AI + Vercel

---

## 🚀 SETUP GUIDE (Step by Step)

### STEP 1 — Install dependencies

```bash
npm install
```

---

### STEP 2 — Setup Railway MySQL Database (FREE)

1. Go to https://railway.app and sign up (free)
2. Click **New Project → Deploy MySQL**
3. Wait for it to start, then click your MySQL service
4. Go to **Connect** tab → copy the **MySQL URL** (looks like: `mysql://root:password@host:port/railway`)

---

### STEP 3 — Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Create an account → Go to **API Keys**
3. Click **Create Key** → copy it

---

### STEP 4 — Configure Environment Variables

```bash
cp .env.example .env
```

Now open `.env` and fill in:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@YOUR_HOST:PORT/railway"
NEXTAUTH_SECRET="any-random-string-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

To generate NEXTAUTH_SECRET quickly:
```bash
openssl rand -base64 32
```

---

### STEP 5 — Push Database Schema & Seed Data

```bash
npm run db:push    # Creates all tables in Railway MySQL
npm run db:seed    # Adds demo admin, officers, and sample complaints
```

---

### STEP 6 — Run Locally

```bash
npm run dev
```

Open http://localhost:3000

---

## 🔑 Demo Login Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@acms.gov.in      | admin123    |
| Officer | mehta@acms.gov.in      | officer123  |
| Citizen | rahul@example.com      | citizen123  |

---

## 🌐 Deploy to Vercel (FREE)

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow prompts. When asked about environment variables, add them one by one.

### Option B — Vercel Dashboard

1. Push your project to GitHub
2. Go to https://vercel.com → **New Project**
3. Import your GitHub repo
4. Go to **Settings → Environment Variables** and add:
   - `DATABASE_URL` → your Railway MySQL URL
   - `NEXTAUTH_SECRET` → your secret
   - `NEXTAUTH_URL` → your Vercel URL (e.g. https://acms.vercel.app)
   - `ANTHROPIC_API_KEY` → your Claude API key
5. Click **Deploy**

> ✅ After deploy, update `NEXTAUTH_URL` in Vercel env vars to your actual Vercel domain.

---

## 📁 Project Structure

```
acms/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # All protected pages
│   │   ├── layout.tsx         # Sidebar + topbar layout
│   │   ├── dashboard/         # Main dashboard with stats
│   │   ├── complaints/        # File complaint + list complaints
│   │   ├── cases/             # Case management
│   │   ├── ai/                # AI crime prediction
│   │   ├── officers/          # Officer management
│   │   └── reports/           # Analytics & reports
│   └── api/
│       ├── auth/              # NextAuth + Register
│       ├── complaints/        # CRUD + track by FIR
│       ├── cases/             # Case management API
│       ├── officers/          # Officers API
│       └── ai/analyze/        # Claude AI analysis
├── lib/
│   ├── prisma.ts              # DB client
│   ├── auth.ts                # NextAuth config
│   └── utils.ts               # Helpers
├── prisma/
│   ├── schema.prisma          # Database schema (MySQL)
│   └── seed.js                # Demo data seeder
└── .env.example               # Environment variables template
```

---

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | Next.js 14 (App Router)       |
| Backend   | Next.js API Routes            |
| Database  | MySQL on Railway              |
| ORM       | Prisma                        |
| Auth      | NextAuth.js (JWT)             |
| AI        | Anthropic Claude API          |
| Hosting   | Vercel (frontend + API)       |
| Styles    | Tailwind CSS + CSS Variables  |

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to Railway MySQL
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:seed      # Seed demo data
```

---

## 👥 Roles & Permissions

| Feature              | Admin | Officer | Citizen |
|----------------------|-------|---------|---------|
| View all complaints  | ✅    | ✅      | Own only|
| File complaint       | ✅    | ✅      | ✅      |
| Manage cases         | ✅    | ✅      | ❌      |
| Assign officers      | ✅    | ❌      | ❌      |
| View officers page   | ✅    | ✅      | ❌      |
| AI prediction        | ✅    | ✅      | ✅      |
| Reports              | ✅    | ✅      | ❌      |
