# AgriSmart — Enterprise Agricultural Intelligence & Farm Platform for Somalia 🌾🐪

**AgriSmart** is a next-generation, data-driven agricultural intelligence, farm journal management, financial bookkeeping, and e-commerce marketplace platform engineered specifically for Somalia and the Horn of Africa.

---

## 🌟 Key Platform Modules & Features

- **📊 True Dynamic Executive Dashboard (`/dashboard`)**:
  Real-time operational aggregation calculated on the fly across live database tables (Financial Ledger sales, active farm plots, herd health risk index, regional AI insights, and weather forecasts for Lower Shabelle / Mogadishu).
  
- **🤖 Live Gemini AI Agronomist (`/ai-agronomist`)**:
  Powered by Google Gemini AI (`gemini-2.5-flash`) via an Express proxy with strict Somali agricultural system guardrails, Vision AI crop disease diagnosis, and persistent Supabase chat sessions.

- **💳 Stripe-Inspired Financial Ledger (`/financial-ledger` & `/ledger`)**:
  Farm financial bookkeeping displaying Net Balance, Total Revenue/Income, Total Expenses, formatted USD currency calculations, and an interactive transaction modal.

- **💬 Linear-Style Farmer Community Forum (`/community`)**:
  Peer-to-peer knowledge sharing and hazard alerts with category pill filters (`Pest Control`, `Market Prices`, `Weather`, `Livestock`, `General`), live discussion search, optimistic upvoting, and post creation.

- **🐄 Livestock & Crop Management Journal (`/livestock-crops`)**:
  Digital farm journal tracking herd health (Camels, Goats, Cattle, Sheep) and crop plot cycles (Sorghum, Sesame, Maize, Bananas) with dynamic Supabase insertions.

- **🛒 Enterprise Marketplace (`/marketplace`)**:
  Dynamic e-commerce catalog featuring 20 Somali agricultural inputs and produce across 4 categories (Seeds, Tools, Fertilizers, Produce) with Admin management.

- **👤 Enterprise Profile & Settings (`/profile` & `/settings`)**:
  Agronomist identity credentials, regional preferences (Lower Shabelle, Middle Shabelle, Bay & Bakool, Hiiraan, Somaliland/Puntland), AI engine guardrail toggles, and notification settings.

- **📐 Collapsible Sidebar & Profile Popover**:
  ChatGPT/Vercel minimalist UI featuring a smooth collapsible icon-only mode with hover tooltips and an upward user profile popover menu.

---

## 🏗️ Architecture & Monorepo Structure

AgriSmart is built as a clean monorepo with separate frontend and backend workspaces, adhering strictly to the **Tumaal Skills Library** engineering guidelines:

```
AgriSmart/
├── backend/                      # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   └── server.ts             # Gemini AI Proxy & Health Check Endpoints
│   ├── supabase/                 # PostgreSQL Database DDL & Seed SQL Scripts
│   │   ├── schema.sql            # Core Metrics & Weather Schema
│   │   ├── chat_schema.sql       # AI Chat Sessions & Messages Schema
│   │   ├── marketplace_schema.sql# Marketplace Products DDL
│   │   ├── seed_products.sql     # 20 Somali Agricultural Products Catalog
│   │   ├── fix_chat_rls.sql      # Permissive RLS & Session Fix Script
│   │   ├── livestock_crops_schema.sql # Herd & Plot Management Schema
│   │   ├── ledger_schema.sql     # Financial Ledger Transactions Schema
│   │   └── community_schema.sql  # Farmer Community Discussion Forum Schema
│   └── package.json
│
├── frontend/                     # React 19 + Vite + Tailwind CSS v4 Client
│   ├── src/
│   │   ├── components/           # Modular UI Components (< 200 lines each)
│   │   │   ├── ai/               # ChatInput, ChatMessage, ChatHeader, Sidebar
│   │   │   ├── community/        # PostCard, CreatePostModal
│   │   │   ├── dashboard/        # StatCard, AIInsightsList, WeatherWidget
│   │   │   ├── farm/             # FarmTabs, DataTable, StatusBadge, FormFields
│   │   │   ├── layout/           # Sidebar, Header, NavLink, ProfilePopover
│   │   │   ├── ledger/           # LedgerSummary, TransactionTable, Modal
│   │   │   ├── marketplace/      # ProductCard, AddProductModal
│   │   │   └── profile/          # EditProfileModal
│   │   ├── hooks/                # Custom Hooks (100% Dynamic Supabase Fetching)
│   │   │   ├── useChatHistory.ts
│   │   │   ├── useCommunityPosts.ts
│   │   │   ├── useDashboardData.ts
│   │   │   ├── useFarmData.ts
│   │   │   ├── useLedgerData.ts
│   │   │   └── useProducts.ts
│   │   ├── pages/                # Page Components (Editorial Minimalism UI)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AIAgronomist.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   ├── LivestockCrops.tsx
│   │   │   ├── FinancialLedger.tsx
│   │   │   ├── Community.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Settings.tsx
│   │   ├── lib/                  # Supabase Client & Backend API Services
│   │   └── types/                # Strict TypeScript Interface Definitions
│   └── package.json
│
└── package.json                  # Monorepo Workspace Configuration
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React, Supabase JS Client (`@supabase/supabase-js`).
- **Backend**: Node.js, Express, TypeScript, Google Gen AI SDK (`@google/genai`).
- **Database**: Supabase PostgreSQL with Row Level Security (RLS).
- **Design Language**: Editorial Minimalism (Vercel/ChatGPT aesthetic, neutral palettes, clean typography, thin borders).

---

## 🔑 Environment Setup

### 1. Backend Environment (`backend/.env`)
Create a `.env` file in `backend/`:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_publishable_key
```

### 2. Frontend Environment (`frontend/.env.local`)
Create a `.env.local` file in `frontend/`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

---

## 🗄️ Database Execution Order (Supabase SQL)

Before starting the platform, execute the SQL scripts in your Supabase SQL Editor in this order:

1. `backend/supabase/schema.sql` — Core metrics & weather setup.
2. `backend/supabase/seed_products.sql` — Populate the 20 marketplace products catalog.
3. `backend/supabase/fix_chat_rls.sql` — Initialize persistent AI chat tables.
4. `backend/supabase/livestock_crops_schema.sql` — Initialize livestock herd & crop plot journal.
5. `backend/supabase/ledger_schema.sql` — Initialize financial ledger transactions table.
6. `backend/supabase/community_schema.sql` — Initialize farmer community forum table.

---

## 🚀 Running the Platform

### Install Dependencies
```bash
npm install
```

### Start Development Servers

Run the backend Express API server (runs on `http://localhost:5000`):
```bash
npm run dev:backend
```

Run the frontend Vite development server (runs on `http://localhost:5173` or `http://localhost:5174`):
```bash
npm run dev:frontend
```

---

## 📐 Tumaal Engineering Standards

This repository strictly complies with the **Tumaal Skills Library Master Rulebook**:

1. **File Line Limit**: Zero files exceed 200 lines of code. Large components are modularized into dedicated sub-components.
2. **Durable-by-Default**: 100% dynamic data fetching from Supabase PostgreSQL. ZERO hardcoded mock fallback arrays in JS/TS hooks or pages.
3. **Security & Secrets**: All AI API key calls proxy securely through the Express backend. Client bundles never receive secrets.
4. **Editorial Minimalism**: Clean, stark, Vercel/ChatGPT minimalist UI system.
5. **Strict Type Safety**: Verified using `npm run build:frontend` and `npm run build:backend` (`tsc -b`).

---

## 📄 License

Developed for the **AgriSmart Enterprise Initiative** for Somali agricultural development.
#   A g r i s m a r t  
 