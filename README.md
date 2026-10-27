# Touchline

Touchline is an anonymised pre-match scouting dashboard for an eight-a-side Sunday league team. It turns league results, fixtures and recorded goalscorers into opponent form, scoring patterns, threat concentration and a concise match plan.

## Stack

- Next.js App Router and TypeScript
- Vercel Functions
- Private Vercel Blob storage for the current dataset
- Password-protected CSV administration

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and replace the placeholder admin credentials.
3. Run `npm run dev`.

Without a connected Blob store, the app safely uses the fictional bundled dataset. Vercel creates the Blob authentication variables when a private store is connected to the project.

## Privacy

The public API always returns anonymised identities. The source repository contains fictional team and player names only. Optional real-to-fictional mappings belong in Vercel environment variables and must never be committed.

Unknown team and player names are converted to deterministic fictional aliases, so a missing mapping cannot expose a new real identity.

## Updating the dataset

Open `/admin`, enter the credentials configured in Vercel, and upload the CSV tables that changed. Touchline validates the data and replaces only the supplied tables. Example CSV structures are in `public/`.
