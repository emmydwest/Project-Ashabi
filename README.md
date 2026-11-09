# Ashabi

**African comics and entertainment IP platform — comics, webtoons, books, and creator tools. Live beta.**

[![Live](https://img.shields.io/badge/Live-ashabi.cloud-C9A227?style=flat-square)](https://ashabi.cloud)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

**Live site:** [https://ashabi.cloud](https://ashabi.cloud)

> Screenshot (place at `docs/screenshot.png` when publishing):
>
> ![Ashabi — Founder's Note / product UI](docs/screenshot.png)
>
> *Local draft copy also saved as `ashabi-screenshot.png` in this polish folder. Note: ashabi.cloud was returning Vercel `DEPLOYMENT_DISABLED` (paused) when this README was drafted — unpause the project before relying on the live URL.*

---

## What it is

Ashabi is an African-founded entertainment and IP venture: a reading hub for comics, webtoons, graphic novels, and serialized fiction, plus a path for African creators to publish and keep clear credit. Creators are offered a **60/40 revenue split** (creator / platform). The product is in **live beta**.

Third-party catalog tiles (e.g. AniList-powered manhwa/manga/anime browsing) are **demonstration content** for UX while original Ashabi titles ramp up — not Ashabi Originals.

---

## Features

- **Comics Hub** — home spotlight, chapter/episode drops, top-ranked series, weekly release schedule
- **Discover** — browse and search across the catalog
- **Books & Novels** — free full-text books shelf (Gutendex / Project Gutenberg)
- **Vertical comic reader** — scroll-first reading experience for illustrated series
- **Creators Studio** — creator portal & roster (**in development / coming soon**): publishing tools, rights & attribution, Ashabi Studios pathway
- **Founder's Note** — mission, roadmap stages, and founder story (`/welcome`)
- **Auth** — sign-in / sign-up / password reset (Supabase)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide |
| Language | TypeScript |
| Validation | Zod |
| Backend / auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |

---

## Getting started

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev
```

Other scripts from `package.json`:

```bash
npm run build      # production build
npm run start      # start production server
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run test       # node --test tests/*.test.mjs
npm run format     # prettier --write .
```

Copy `.env.example` → `.env.local` and fill in Supabase (and related) keys before auth-backed flows work.

---

## Roadmap (product stages)

1. **Foundation** — digital story platform (comics, webtoons, graphic novels, serialized fiction)
2. **Ecosystem** — creator community across Africa
3. **Original IP** — Ashabi Originals (mythology, sci-fi, fantasy, romance, epics)
4. **Screen & beyond** — Ashabi Studios (animation, film, series, games)

---

## Author

**Emmanuel Kalama (Emmy D West)** — founder · Lagos, Nigeria

- Portfolio: [emmyd-portfolio.vercel.app](https://emmyd-portfolio.vercel.app)
- GitHub: [@emmydwest](https://github.com/emmydwest)
- X: [@EmmyDWest](https://x.com/EmmyDWest)
- Brand: [@studioashabi](https://x.com/studioashabi)
