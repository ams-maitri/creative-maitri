# Creative Maitri

A public gallery of things the team builds on Creative Mondays at [Maitri](https://maitriservices.com).

Every Monday, one person shows what they made that week. This site is the lasting record.

## Stack

- Vite + React 19 + TypeScript
- Vanilla CSS (CSS modules)
- React Router
- JSZip + FileSaver for the submission export
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

## Adding a new presentation

1. Visit `/submit` on the live site.
2. Fill in the form. The right side shows exactly how your card will look.
3. Hit **Generate submission**. You get a zip with your photos and a `submission.json`.
4. Unzip into the repo root. Photos end up in `public/photos/<your-slug>/`.
5. Open `src/data/presentations.json` and add the entry from `submission.json`.
6. Commit, open a PR.

## Data

Source of truth: `src/data/presentations.json`. Schema lives in `src/lib/types.ts`.

Photos and attached files live under `public/photos/<slug>/`.
