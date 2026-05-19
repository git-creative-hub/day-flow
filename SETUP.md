# Dayflow — Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Supabase — create tables

Go to your Supabase project → **SQL Editor** and run:

```sql
-- Tasks table
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text,
  date date not null,
  status text not null default 'pending' check (status in ('pending','in_progress','done')),
  rolled_over boolean not null default false,
  original_date date,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table tasks enable row level security;

create policy "Users manage own tasks" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Journal entries table
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  content text,
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

alter table journal_entries enable row level security;

create policy "Users manage own journal entries" on journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 3. Add environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- **VITE_SUPABASE_URL** — from Supabase → Project Settings → API → Project URL
- **VITE_SUPABASE_ANON_KEY** — from Supabase → Project Settings → API → anon public key
- **VITE_ANTHROPIC_KEY** — from console.anthropic.com → API Keys

## 4. Run locally

```bash
npm run dev
```

## 5. Deploy to Vercel

1. Push to GitHub
2. Import the repo at vercel.com
3. Add the three env vars in Vercel → Project → Settings → Environment Variables
4. Deploy

## Features

| Feature | How it works |
|---|---|
| **Daily tasks** | Add, update status (To do → In progress → Done), delete |
| **Auto rollover** | Unfinished tasks from past days move to today on next login |
| **Journal** | Free-text, auto-saves on blur |
| **AI summary** | Click "Generate" — uses Claude to summarize your day |
| **Timeline** | Calendar view, click any day to see its tasks + journal |
