# LearnRep Web

Local web app for LearnRep.

## Local Development

Copy the example env file and fill in the Supabase/API keys:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Use the local site URL from the example:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3456
```

Start the app from the repo root:

```bash
corepack pnpm --filter web dev
```

Open [http://localhost:3456](http://localhost:3456).

## Local OAuth

For browser login on the local dev server, Supabase must allow this exact redirect URL:

```text
http://localhost:3456/callback
```

The checked-in `supabase/config.toml` already uses `http://localhost:3456` for local Supabase. Hosted Supabase projects need the same redirect URL added in the Supabase dashboard.
