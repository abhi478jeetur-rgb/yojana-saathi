# Yojana Saathi · Landing page

Animated marketing site for **Yojana Saathi**, the app that matches Indian citizens to central government schemes from a plain English or Hinglish description. Built for the Appwrite Databases Hackathon 2026 (Appwrite TablesDB + VectorsDB).

Stack: Vite + React, GSAP + ScrollTrigger (`@gsap/react`), Lenis smooth scroll, lucide-react icons, Plus Jakarta Sans via `@fontsource-variable`. Motion is disabled for users with `prefers-reduced-motion: reduce`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview
```

## Environment variables

| Name | Purpose | Default |
| --- | --- | --- |
| `VITE_APP_URL` | Target of every "Try the app" button | `#` |
| `VITE_GITHUB_URL` | Target of "View on GitHub" | `#` |

Copy `.env.example` to `.env.local` for local values.

## Deploy to Vercel

1. Push this folder to a Git repo (or run `npx vercel` from inside it).
2. In Vercel, import the repo. If the landing page lives in a subfolder of a larger repo, set **Root Directory** to that folder.
3. Framework preset: **Vite** (already declared in `vercel.json`). Build command `npm run build`, output directory `dist`.
4. Add `VITE_APP_URL` (and optionally `VITE_GITHUB_URL`) under **Settings → Environment Variables**, then redeploy. Vite inlines them at build time, so a redeploy is needed after changing them.

## Screenshots

`npm run screenshots` (with `npx vite preview --host 127.0.0.1 --port 4918` running and `SHOT_URL=http://127.0.0.1:4918/`) writes 390×844 and 1440×900 shots to `screenshots/`.

## Mascot

Golu, a baby elephant (elephants never forget, and neither does your documents checklist). Optimised WebP poses live in `src/assets/golu/`; the original PNG renders are in `design-src/`.

## License

MIT
