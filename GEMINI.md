# Project Overview: Farmer Dashboard

This project is a **Multi-Tenant SaaS Dashboard** for farmers to track monthly production, costs, and resource usage. It emphasizes data integrity, real-time analytics, and secure data isolation.

## Tech Stack
*   **Frontend**: React 19, Vite, Recharts, Sonner (Toasts).
*   **Backend**: Supabase (PostgreSQL 15+).
*   **Auth**: Supabase Auth (Magic Link / Password).
*   **Styling**: Vanilla CSS (Variables, Flexbox/Grid).

---

# Project Rules & Governance

## 1. Data Structure & Source of Truth
**CRITICAL**: The **Single Source of Truth** for the database schema is the `supabase/migrations/` directory.

*   **Rule**: NEVER modify the database schema (tables, columns, types) directly via the Supabase Dashboard UI without immediately creating a corresponding migration file.
*   **Rule**: EVERY change to the data structure must be logged in a new SQL file in `supabase/migrations/`.
    *   Format: `YYYYMMDDHHMMSS_description.sql`
*   **Rule**: If there is a discrepancy between the Live Database and the Migration Files, the Migration Files are considered correct, and the Database must be aligned to match them.

## 2. Security & Multi-Tenancy
*   **Rule**: All tables storing user-generated data MUST have a `user_id` column referencing `auth.users`.
*   **Rule**: Row Level Security (RLS) MUST be enabled on all tables.
*   **Rule**: RLS Policies must be "Whitelisting" (Default Deny) and explicit (e.g., `auth.uid() = user_id`).

## 3. Code Quality
*   **Validation**: Inputs must be validated on the client (UI feedback) AND the database (CHECK constraints).
*   **Testing**: Critical paths (Auth, Data Entry, Dashboard) must be covered by tests.
*   **Mandatory Test Updates**: **EXTREMELY IMPORTANT**: Every time new code is added or existing code is updated, relevant tests MUST be added or updated accordingly. No code changes are allowed without corresponding test verification.
