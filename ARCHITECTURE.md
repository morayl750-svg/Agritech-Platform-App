# AgriSmart Platform - System Architecture & Design Document

> **Version**: 3.0.0 (Monorepo Architecture)  
> **Target**: Somali Agricultural AI & Farm Management Ecosystem  
> **Status**: Production-Ready Core  

---

## 1. Executive Summary

**AgriSmart** is an enterprise-grade, AI-powered agricultural management and e-commerce platform designed for farmers in Somalia and the Horn of Africa. It provides real-time farm telemetry, financial bookkeeping, livestock/crop management, a peer-to-peer community, and a live AI Agronomist powered by Google Gemini.

---

## 2. High-Level Architecture

The project utilizes a **Monorepo** structure with strict separation of concerns.

```mermaid
graph TD
    subgraph Frontend [React 19 SPA - Vite]
        A[UI Components / Pages] -->|Custom Hooks| B[Supabase JS Client]
        A -->|Fetch API| C[Backend API]
    end

    subgraph Backend [Node.js / Express Server]
        C -->|POST /api/chat| D[Gemini Controller]
        D -->|@google/genai| E[Google Gemini 2.5 Flash]
    end

    subgraph Database [Supabase / PostgreSQL]
        B -->|CRUD Operations| F[(PostgreSQL Tables)]
        B -->|Auth & RLS| G[Supabase Auth]
    end
```

---

## 3. Technology Stack

| Tier | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript | Fast, concurrent SPA rendering. |
| **Styling** | Tailwind CSS v4, Lucide React | Utility-first CSS, modern iconography. |
| **Backend** | Node.js, Express, TypeScript | API Gateway for secure AI communication. |
| **Database** | Supabase (PostgreSQL) | Relational database with Row Level Security (RLS). |
| **AI Engine** | Google Gemini 2.5 Flash | `@google/genai` SDK with strict agricultural guardrails. |

---

## 4. UI/UX Design System: "Enterprise Minimalism"

Future developers and AI agents MUST adhere to these strict design rules:

- **No "Plastic" UI**: Avoid heavy drop shadows, bulky pills, and overly bright backgrounds.
- **Colors**: Use pure white (`bg-white`), subtle grays (`bg-gray-50`, `border-gray-200`), and pure black/dark gray for primary text/buttons (`bg-gray-900`). Use colors (Emerald, Red) only for semantic badges (Income, Healthy, Error).
  - *Brand Logo Exception*: The AgriSmart logo strictly uses a clean green (`emerald-600`) to represent agriculture, nature, and growth. This is the only element that uses a strong brand color outside of semantic status badges.
- **Layout**: Utilize full-width responsive grids. Use ample whitespace and subtle borders to separate content.
- **Components**: Inspired by Vercel, Stripe, and Linear (e.g., Collapsible sidebars, clean data tables, minimalist popovers).

---

## 5. Database Schema (PostgreSQL)

All frontend data is 100% dynamic. Mock data is strictly forbidden.

- `dashboard_metrics`: (Deprecated - Dashboard now aggregates data dynamically).
- `products`: Marketplace inventory (name, price, category, stock, image_url).
- `livestock`: Herd management (animal_type, count, health_status).
- `crops`: Plot management (crop_name, status, planted_date).
- `transactions`: Financial ledger (type: income/expense, amount, category).
- `chat_sessions` & `chat_messages`: Persisted AI conversations.
- `posts`: Community forum discussions (title, upvotes, replies_count).

---

## 6. Core Modules

1. **Dashboard**: Dynamically aggregates total revenue (from transactions), active plots (from crops), and farm health (from livestock).
2. **AI Agronomist**: Live chat interface. The backend enforces strict system instructions so the AI only answers Somali agricultural questions.
3. **Marketplace**: E-commerce grid with category filters and an Admin "Add Product" modal.
4. **Livestock & Crops**: Tabbed farm journal with data tables and status badges.
5. **Financial Ledger**: Stripe-inspired bookkeeping for income and expenses.
6. **Community**: Peer-to-peer knowledge sharing forum.

---

## 7. Development Workflow

The project uses npm workspaces.

- **Start Frontend**: `npm run dev --workspace=frontend` (Runs on port 5173/5174)
- **Start Backend**: `npm run dev --workspace=backend` (Runs on port 5000)
- **Environment Variables**:
  - Frontend requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
  - Backend requires `GEMINI_API_KEY`.
