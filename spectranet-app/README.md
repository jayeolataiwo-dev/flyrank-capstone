# Spectranet Redesign — Capstone Project

A frontend redesign concept for Spectranet's self-care web experience, built as a capstone project for the Flyrank AI-assisted frontend engineering internship. The real Spectranet app has documented usability issues (confusing login flow, dated visuals, poor Play Store reviews) — this project reimagines the core experience with modern design, an AI support assistant, and a set of hand-built accessible UI components.

**Live production URL:** https://flyrank-capstone-vbpb-two.vercel.app

## What it does

- **Homepage** — a custom WebGL fragment shader hero using Spectranet's real, verified brand colors ("Bay of Many" blue-violet + brand orange), with mouse-reactive flow and a `prefers-reduced-motion` static fallback.
- **AI Support Assistant** (`/playground-chat`) — a streaming chat interface (Gemini via the Vercel AI SDK) that can look up a mock data balance via a real tool call, rendered as a live progress card. Includes a designed empty state, error/retry handling, and a working stop button.
- **Accessible UI components** — a Modal, Tabs, and Disclosure widget built entirely by hand (no component library) against the W3C ARIA Authoring Practices patterns: correct roles, full keyboard operation, and a genuine focus trap.
- **3D Router Configurator** (`/playground-router`) — an interactive React Three Fiber product viewer (change color, toggle the status LED), built from primitive geometry with no external model files.
- **A Send button** with a fully choreographed motion lifecycle (idle → loading → success/error), respecting reduced motion.

## Screenshots

<img width="1920" height="1008" alt="Screenshot 2026-08-15 015455" src="https://github.com/user-attachments/assets/238a65ea-58c3-40b6-90a3-aa2dc43e2b93" />
<img width="1920" height="1008" alt="Screenshot 2026-08-15 015331" src="https://github.com/user-attachments/assets/815512a1-d4c2-4d50-b1a7-e87318ed9250" />
<img width="1920" height="1008" alt="Screenshot 2026-08-11 173644" src="https://github.com/user-attachments/assets/5fd2c48d-dcfd-4ec0-82ba-c43ee19fbfb9" />


## Run it locally

```bash
git clone https://github.com/jayeolataiwo-dev/flyrank-capstone.git
cd flyrank-capstone/spectranet-app
npm install --legacy-peer-deps
```

Create a `.env.local` file in `spectranet-app/` with the variable listed below, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable                       | Required                             | Description                                                                                                                                                    |
| ------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes, for the AI chat feature to work | A free Gemini API key from [aistudio.google.com](https://aistudio.google.com). Everything else in the app works without it — only `/playground-chat` needs it. |

On Vercel, this is set under **Project Settings → Environment Variables**, scoped to Production and Preview.

## Architecture overview

- **Framework:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **AI:** Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google`) — `streamText` on an Edge Runtime route handler, `useChat` on the client, with one server-side tool (`checkDataBalance`) defined with a Zod schema
- **3D:** React Three Fiber + drei, primitive geometry only (no external `.glb` files, so nothing to compress/host)
- **Testing:** Vitest + React Testing Library for component tests (chat states, tool results, button lifecycle), Playwright for one end-to-end test of the primary chat flow, both wired into GitHub Actions CI
- **Deployment:** Vercel, connected directly to this GitHub repo's `main` branch

### Why these choices

- **No component library for Modal/Tabs/Disclosure** — built by hand deliberately, to genuinely understand ARIA patterns and focus management rather than just importing a working solution. Compared against shadcn/ui afterward (documented in `NOTES.md`) to see what a production library handles that a hand-built version misses.
- **Gemini instead of Claude for the chat model** — the assignment's linked resources reference Claude, but this project runs on Google's Gemini API instead, specifically because Gemini has a genuinely free, permanent API tier with no credit card required, while Anthropic's and OpenAI's API access is trial-credit-based and ran out during development. The AI SDK is provider-agnostic, so the same `streamText`/`useChat` architecture applies regardless of which model is behind it.
- **In-memory rate limiting, not a hosted service** — this is a portfolio/demo project on a free API tier; a simple per-IP request counter is enough to stop casual abuse of the public chat endpoint without adding cost or a third-party dependency. Documented as a known limitation, not presented as production-grade.
- **Router "3D model" is pure code, not a `.glb` file** — avoids the entire model-compression/hosting problem while still satisfying the assignment's real requirement (an interactive, lazy-loaded 3D scene).

## Production hygiene

- `/api/chat` is rate-limited (10 requests/minute per IP) and rejects any single message over 2,000 characters, before it reaches the model.
- `maxDuration = 30` set on the streaming route handler.
- The Gemini API key lives only in `.env.local` (gitignored) and Vercel's environment variable settings — never committed to the repo.

## Cross-browser testing

- **Chrome (desktop):** fully tested throughout development.
- **Microsoft Edge (desktop):** tested — homepage and chat flow confirmed working.
- **Mobile (real device, default browser):** tested directly on a physical phone — homepage and chat flow both confirmed working.
- **Firefox / Safari (desktop):** not tested — no access to these browsers during development. Noting this honestly rather than claiming untested coverage.

## How AI tools built this

This project was built collaboratively with Claude (Anthropic) across most sessions, with ChatGPT used for a few specific stretches. Specifics, not just "AI helped":

- **Real bugs found and fixed together, not just accepted:** a deprecated Gemini model name that 404'd in production, a Vercel Edge-runtime streaming-buffering issue (fixed by adding `export const runtime = "edge"`), a jsdom `scrollTo` limitation in tests, a genuinely broken YAML indentation that silently prevented CI from triggering, and a `useEffect`-timing bug in the Tabs component where keyboard focus wasn't reliably following the active tab.
- **AI proposed code, human verified every claim before accepting it.** Multiple times, current library syntax was checked against live documentation (AI SDK v5's `tool()`/`inputSchema` API, `InferUITools` for end-to-end type safety) rather than trusting training-data memory, specifically because these libraries had changed significantly across versions.
- **Design decisions were pushed back on, not accepted first-try.** An early shader palette (guessed near-black + orange) was rejected as "not distinctive enough"; the actual brand colors were looked up and verified (Spectranet's real "Bay of Many" blue-violet, sourced from Brandfetch) rather than continuing to guess.
- **A dedicated drill (FE-02) compared a one-sentence prompt against a fully-specified one** for the same feature, documented in `WORKFLOW.MD` — including an honest case where the "precise" prompt produced _objectively worse_ domain logic (a weaker phone-number regex) than the vague one, which is written up as a real finding, not smoothed over.
- **AI did not have final say on scope or priorities.** Given a hard deadline and competing academic exams, task prioritization (what to build fully vs. defer) was a human decision at every step.

## Known limitations / what's next

- The individual feature demos (`/playground-chat`, `/playground-router`, etc.) are not yet consolidated into the main product pages (`/dashboard`, `/profile`) — the components are built and tested, but wiring them into one cohesive user flow is planned as a final pre-submission pass.
- Firefox/Safari desktop testing is outstanding.
- Rate limiting is in-memory only and resets on cold starts — acceptable for this project's scale, not a real production pattern.
