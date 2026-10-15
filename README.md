# Touchline ⚽

**Pre-match intelligence for grassroots football.**

Touchline turns match results and goalscorer data into tailored opponent briefs, helping a women's Sunday league football team prepare for matches with better information on goal threats and opponents' playing style.

## What it does

- Explore opponents' recent form and scoring patterns.
- Compare recent results and highlight goal threats.
- Generate a practical pre-match scouting summary.

## Public demo and privacy

This repository is the **public, anonymised portfolio edition**. All bundled team and player identities are fictional. It contains no private coach endpoint, upload interface, authentication controls or private database access. The public `/api/dataset` endpoint serves only the bundled anonymised demo dataset, regardless of URL parameters.

The separately hosted operational version is maintained outside this repository. Do not upload real team/player identities or private datasets to this public project.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The application uses Next.js, React, TypeScript and Tailwind CSS.

## Why I built it

My team had the same strategy for each game because our coach was unfamiliar with most opponents in our new league. As a result of this generic strategy, the team was not playing to its full potential and I wanted to do something about this. I built Touchline to use available league statistics to enhance our game preparation. The project combines operations thinking, data organisation, AI-assisted software development, and a bit of competitive spirit.

