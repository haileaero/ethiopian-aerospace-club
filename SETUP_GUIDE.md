# EAC V4 — Authentication Setup

This version keeps the existing public EAC design and adds a real email/password authentication foundation using Supabase.

## 1. Create a Supabase project

Create a project at https://supabase.com/ and keep the project URL and anon/publishable key available.

## 2. Configure the database

Open **SQL Editor** in Supabase and run:

`supabase/schema.sql`

This creates:
- member profiles
- member/admin roles
- automatic profile creation on registration
- Row Level Security policies
- protected CMS content tables for the next CMS migration

## 3. Configure email authentication

In Supabase, open **Authentication -> Providers -> Email** and make sure email/password authentication is enabled.

For a real deployed website, configure your Site URL and Redirect URLs to include:

- your Vercel production URL
- `http://localhost:5173/auth/callback`
- `http://localhost:5173/reset-password`

The exact production URL should be your final EAC domain.

## 4. Configure the local project

Copy `.env.example` to `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Then run:

```bash
npm install
npm run dev
```

## 5. Create the first admin

Do NOT put an admin password or service-role key in the React project.

Instead:

1. Open the EAC website.
2. Register using the email you want to use as administrator.
3. Verify that email.
4. Sign in.
5. Open Supabase SQL Editor.
6. Run this with your real admin email:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
);
```

7. Sign out and sign in again.
8. Open `/admin`.

The admin dashboard is now role-protected.

## 6. Test the security

### Test member

Register a second account using another real email.

Expected:
- account is `member`
- member can open `/dashboard`
- member cannot access `/admin`
- member cannot choose `admin` during registration

### Test admin

Expected:
- admin can open `/admin`
- admin can use the existing content-control interface
- admin can open `/dashboard` too

## 7. Password recovery

From `/login`, select **Forgot password?**.

The system sends a Supabase password-reset email. The link opens `/reset-password`.

## 8. Email change

Member Dashboard -> Account Security -> Change email.

Supabase sends a verification message to the new address before the change is trusted.

## Important

The existing V4 Admin CMS still contains the original browser-local content editor. The authentication boundary is now real, but CMS persistence should be migrated fully to the database/storage tables included in `supabase/schema.sql` before production content management is considered complete. The next implementation step can replace the remaining localStorage CMS operations with Supabase database/storage operations without changing the public design.
