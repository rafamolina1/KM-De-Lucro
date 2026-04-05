# KM de Lucro

[Português](README.md) | [English](README.en.md)

Web application for independent truck drivers to track revenue, costs, profit, and freight margin without relying on spreadsheets.

![KM de Lucro dashboard](./public/screenshots/dashkm.png)

## Overview

KM de Lucro is designed to turn basic trip data into practical financial insight. Instead of mental math or parallel spreadsheets, drivers register each freight and monitor monthly performance through a focused interface.

### What the product offers

- Freight registration with date, origin, destination, distance, value, and costs.
- Automatic calculation of net profit, margin, and profit per kilometer.
- Monthly summary with revenue, costs, trip count, and period evolution.
- CSV and PDF exports for external control or accounting.
- Passwordless login through Supabase magic links.
- Free tier for validation and Pro tier with full history and exports.

## Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for authentication and data persistence
- jsPDF for PDF generation

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A Supabase project with email authentication enabled

## Running locally

1. Clone the repository:

```bash
git clone https://github.com/rafamolina1/KM-De-Lucro.git
cd KM-De-Lucro
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_SECRET=A_PASSWORD_FOR_THE_ADMIN_ROUTE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Configure Supabase Auth:

- In `Authentication > URL Configuration`, set `Site URL` to `http://localhost:3000`.
- In `Additional Redirect URLs`, add `http://localhost:3000/auth/callback`.
- If you test through a local network IP, also add `http://YOUR-IP:3000/auth/callback`.
- In `Authentication > Providers > Email`, keep email sign-in enabled.

5. Start the development server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public URL of the Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public key used by the web client for authentication and authorized reads/writes. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes, for the admin route | Server-side key used by `/api/admin/planos`. It must never be exposed to the client. |
| `ADMIN_SECRET` | Yes, for the admin route | Simple secret used by the internal plan management flow. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Base application URL used for metadata and environment setup. |

## Expected Supabase structure

This repository assumes the Supabase project already contains at least these tables:

- `profiles`, with `id` and `plan`
- `freights`, with `id`, `user_id`, `date`, `origin`, `destination`, `km`, `value`, `diesel`, `tolls`, `other_costs`, `profit`, and `margin`

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Admin area

The `/admin/planos` route is intended for internal use and depends on `ADMIN_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`. If the project is deployed publicly, this flow should be protected with a proper authentication and authorization layer.

## Deployment

The project can be deployed to Vercel with the default Next.js setup.

Before deploying:

- copy the environment variables to the Vercel dashboard
- update `NEXT_PUBLIC_SITE_URL` to the production domain
- add the production `/auth/callback` URL to Supabase Auth

## Note

This repository contains the application, but it does not include database migrations. If you are setting up Supabase from scratch, you will need to create the schema expected by the front-end and the admin route.
