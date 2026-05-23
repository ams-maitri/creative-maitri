# Creative Maitri — Design Spec

**Date:** 2026-05-23
**Author:** Aayush Man Singh
**Status:** Approved

## Purpose

A public gallery showcasing the team's "Creative Mondays" presentations at Maitri. Each Monday, a team member showcases something they've built. This site is the lasting record and a celebration of the practice.

## Audience

- Maitri team members (primary)
- Prospective hires, partners, and visitors who land here from maitriservices.com

## Source data

Form: `Creative Mondays' Presenters` (Google Form `1ZcI87sAalYHnHdcVsgpNii9f59qttf9ZRyXFvL8tTvc`). 14 responses as of the build date — see appendix.

## Pages

1. **`/` — Gallery.** Editorial hero (oversized "Creative Maitri" wordmark, presentation count, one-line manifesto). Thin animated marquee strip of presenter names. Asymmetric grid of project cards (varied widths/heights) with ultra-thin "01"…"14" numerals as visual rhythm. Each card: hero photo, presenter, project title, topic chip, date.
2. **`/p/:slug` — Project detail.** Full-bleed image gallery, presenter byline, narrative description, tools as small-cap tags, date, external links.
3. **`/submit` — New submission.** Split layout. Form on the left, live card-and-detail preview on the right. "Generate submission" button downloads a `submission.json` + a zip of uploaded photos, with on-page instructions to drop them into `src/data/` + `public/photos/<slug>/` and open a PR.

## Stack

- Vite + React 19 + TypeScript
- Vanilla CSS (CSS modules), no Tailwind
- React Router for `/`, `/p/:slug`, `/submit`
- Motion One for scroll reveals
- JSZip + FileSaver for the submission export
- Vercel deploy from GitHub (account `aayush.man.singh@maitriservices.com`)

## Data model

```ts
type Presentation = {
  slug: string;              // url-safe id, e.g. "barsha-kunwar-travel-itinerary"
  presenter: string;
  email: string;
  topic: string;             // short label
  title: string;             // expanded, presentational title (defaults to topic)
  date: string;              // ISO YYYY-MM-DD
  tools: string[];           // parsed from comma/newline list
  description: string;       // full markdown-ish text
  photos: string[];          // public-relative paths
  artifact?: string;         // optional path or url
  links?: string[];          // extracted urls from description
}
```

Source of truth: `src/data/presentations.json` (committed). Images live under `public/photos/<slug>/`.

## Visual direction — Editorial Maitri

Inherits from maitriservices.com:

- Background: `#FFFFFF`
- Text: `#050818` (near-black)
- Accent: `#15B3A5` (teal), with gradient `#1b8182 → #2dcbb6` reserved for the wordmark and one or two ornamental moments
- Typeface: **Poppins** only (100, 300, 400, 500, 700, 800 weights, plus italics)
- Buttons: 10px radius, teal fill on dark navy text

Editorial moves on top of brand:

- Asymmetric grid (some cards span 5 cols, some 7, some 12 of a 12-col grid)
- Project numbers in `Poppins 100`, ~12rem, near-transparent (`#0508181a`) as background numerals on cards
- Headlines mix weights: `800` for "Creative" and `100 italic` for "Maitri" (or vice versa) for editorial contrast
- Small-caps eyebrows with wide letter-spacing for section labels
- Thin animated marquee under hero with presenter names
- Slow, restrained motion (250–400ms ease-out, 60ms stagger)
- No emojis, no em-dashes (use commas, en-dashes, periods), no purple, no glass morphism, no rounded-3xl, no shimmer, no auto-playing carousels

## Non-negotiables (what makes it not feel AI)

- No emojis anywhere
- No em-dashes in copy. The form descriptions contain some; strip or replace on render
- No phrases like "elevate", "unlock", "revolutionize", "powered by AI", "in the AI era"
- No purple gradients on white
- No identical-card grid — variety in card sizes
- No generic stock photography placeholders
- Words like "presentation", "talk", "session" are fine; "deliverable" and "synergy" are banned

## Submission flow detail

The `/submit` page is offline-first (everything in the browser):

1. User fills: name, email, topic, presentation date, description, tools (one per line), upload photos (drag-drop), optional artifact.
2. As they type, the right pane shows a live preview of: (a) how the card will look on the gallery and (b) the detail page.
3. On "Generate submission":
   - Build a slug from name + topic
   - Read photos via FileReader → store in a zip under `photos/<slug>/`
   - Build a JSON entry matching the schema
   - Trigger download of `creative-maitri-submission-<slug>.zip` containing `submission.json` + photos
4. Show instructions: how to unzip into the repo and open a PR. Include the suggested git commands.

This keeps the flow zero-backend, matches the user's "preview only, then commit" choice, and means anyone with the form responses can self-serve.

## Build order

1. ✅ Spec (this document)
2. Scaffold Vite + repo, push to GitHub
3. Download photos from Drive, build `presentations.json`
4. Typography + layout primitives
5. Gallery (`/`)
6. Project detail (`/p/:slug`)
7. Submit (`/submit`) with live preview
8. Polish + deploy to Vercel

## Out of scope

- Server-side anything (auth, comments, voting)
- Direct write-back to the Google Form
- Multi-language
- Dark mode toggle (white-only by design)
- Search and filter (14 entries doesn't justify it yet; revisit at 30+)

## Content rewriting

Descriptions submitted via the Google Form are uneven: some are markdown-heavy with headers and bullets, some are URLs only, some contain emojis and em-dashes. During the `presentations.json` build step I will rewrite each description to:

- One or two clean paragraphs in plain prose
- No emojis, no em-dashes (use commas, periods, or en-dashes)
- Preserve the substance: what it does, what's notable, what tools it uses (tools go in the `tools[]` field, not the description)
- Keep all links from the original, surfaced as `links[]` in the data
- Match the editorial voice: confident, concrete, no hype words

Each entry's `description` becomes the cleaned-up version. The original raw response is preserved as `rawDescription` for transparency.

## Appendix: response snapshot

14 responses captured from form `1ZcI87sAalYHnHdcVsgpNii9f59qttf9ZRyXFvL8tTvc` on 2026-05-23. Full data in `src/data/presentations.json` after build step 3.
