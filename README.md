````markdown
# 🛡️ ACMS — AI Cyber Crime Management System

> Full-stack government cyber crime portal built with Next.js 14, Railway MySQL, Anthropic Claude AI, and Vercel.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Next.js API Routes |
| Database | MySQL on Railway |
| ORM | Prisma |
| Auth | NextAuth.js (JWT) |
| AI | Anthropic Claude API |
| Hosting | Vercel |
| Styles | Tailwind CSS |

---

## ⚙️ Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Railway MySQL (Free)
1. Go to [railway.app](https://railway.app) → sign up
2. Click **New Project → Deploy MySQL**
3. Go to **Connect** tab → copy the **MySQL URL**

### 3. Get Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → Create Key** → copy it

### 4. Configure Environment Variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@YOUR_HOST:PORT/railway"
NEXTAUTH_SECRET="any-random-string-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

> Generate `NEXTAUTH_SECRET`:
> ```bash
> openssl rand -base64 32
> ```

### 5. Push Schema & Seed Data
```bash
npm run db:push    # Creates all tables in Railway MySQL
npm run db:seed    # Adds demo admin, officers, and sample complaints
```

### 6. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acms.gov.in | admin123 |
| Officer | mehta@acms.gov.in | officer123 |
| Citizen | rahul@example.com | citizen123 |

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — Vercel Dashboard
1. Push project to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo
4. **Settings → Environment Variables** → add all 4 keys
5. Click **Deploy**

> ✅ After deploy, update `NEXTAUTH_URL` to your actual Vercel domain (e.g. `https://acms.vercel.app`)

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
│   │   ├── ai/                # AI crime prediction (Claude)
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
│   └── utils.ts               # Helpers (FIR gen, colors)
├── prisma/
│   ├── schema.prisma          # Database schema (MySQL)
│   └── seed.js                # Demo data seeder
└── .env.example               # Environment variables template
```

---

## 🛠️ Available Scripts

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

| Feature | Admin | Officer | Citizen |
|---------|-------|---------|---------|
| View all complaints | ✅ | ✅ | Own only |
| File complaint | ✅ | ✅ | ✅ |
| Manage cases | ✅ | ✅ | ❌ |
| Assign officers | ✅ | ❌ | ❌ |
| View officers page | ✅ | ✅ | ❌ |
| AI prediction | ✅ | ✅ | ✅ |
| Reports & Analytics | ✅ | ✅ | ❌ |

---

## ✨ Features

- **Complaint Management** — File complaints with auto-generated FIR numbers, track status, filter by category/priority
- **Case Management** — Create cases from complaints, assign officers, add investigation notes
- **AI Analysis** — Claude AI gives severity assessment, investigation steps, relevant IT Act / IPC sections, and prevention tips
- **Reports** — Crime category breakdown, status distribution, officer workload
- **Role-Based Access** — Admin / Officer / Citizen with separate views and permissions
- **JWT Auth** — Secure login via NextAuth.js with session management

---

## 📄 License

Academic project — SRM Institute of Science and Technology
````

Bas iska naam `README.md` rakho aur root folder mein daalo. GitHub pe automatically render ho jayega with all tables, code blocks, badges sab kuch. 🔥