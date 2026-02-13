# Smart Bookmark Manager

A real-time bookmark management application built with Next.js, Supabase, and Tailwind CSS. Save, organize, and access your favorite links with Google OAuth authentication.

## 🚀 Live Demo

https://bookmark-manager-flax-zeta.vercel.app/

## ✨ Features

- **Google OAuth Authentication** - Secure sign-in without passwords
- **Private Bookmarks** - Each user's bookmarks are completely private
- **Real-time Updates** - Changes sync instantly across all open tabs
- **Add Bookmarks** - Save URLs with custom titles
- **Delete Bookmarks** - Remove bookmarks you no longer need
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Realtime)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud account (for OAuth)
- A Vercel account (for deployment)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bookmark-manager
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run this schema:

```sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table bookmarks;
```

3. Get your Project URL and Anon Key from Settings > API

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret
6. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Paste your Client ID and Client Secret
   - Save

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`


1. **Sign In**: Click "Continue with Google" on the login page
2. **Add Bookmark**: Enter a title and URL, then click "Add Bookmark"
3. **View Bookmarks**: See all your saved bookmarks in chronological order
4. **Delete Bookmark**: Click the trash icon to remove a bookmark
5. **Real-time Sync**: Open the app in multiple tabs to see live updates




## 👤 Author

Vanshika
---

Built with ❤️ using Next.js and Supabase
