## PubQuiz Frontend

A Next.js app for hosting and managing pub quizzes. Includes theming, sidebar shell, and simple i18n (English/Czech).

### Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript, Tailwind CSS 4
- Radix UI primitives and custom UI components
- next-themes for dark mode

### Development

Run the dev server:

```bash
npm run dev
```

App opens at http://localhost:3000 and immediately redirects to `/scan`.

### Play page (projector/TV mode)

The Play screen is designed to be shown on a projector or TV.

- Route: `/play`
- Query params:
  - `quiz` — quiz id to load from the API (optional; if omitted, the first quiz is used when available)
  - `q` — 0-based question index (e.g. `/play?quiz=abc123&q=1`)
  - `t` — countdown time in seconds (default 25), e.g. `/play?t=45`
- Controls in the header:
  - Fullscreen toggle (recommended on a projector)
  - Reveal/Hide correct answer
  - Next question

Notes:

- The page uses a full-bleed layout, large typography, and big color tiles for high visibility.
- Questions are loaded from the backend API. Provide `quiz` in the URL to target a specific quiz id, otherwise the first quiz is used.

### Backend API

Set the API base URL via environment variable in your `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://3.70.249.70:6767
```

Endpoints used by the app:

- `POST /quiz` — create a new quiz
- `GET /quiz` — list quizzes
- `GET /quiz/:quiz_id` — get quiz by id
- `POST /quiz/:quiz_id` — update quiz by id
- `DELETE /quiz/:quiz_id` — delete quiz
- `POST /quiz/:quiz_id/instance` — create a quiz instance (start)
- `GET /quiz/instance/:instance_id` — get instance
- `DELETE /quiz/instance/:instance_id` — delete instance
- `POST /quiz/instance/:instance_id/state` — update instance state
- `POST /quiz/instance/:instance_id/answer` — submit an answer

### Project structure

- `src/app/layout.tsx` – root layout, metadata, fonts, providers
- `src/app/page.tsx` – redirects to `/scan`
- `src/app/*` – app routes (scan, add-quiz, stats)
- `src/components` – UI kit, app shell (sidebar), i18n provider
- `src/lib` – utilities, i18n dictionaries, zod schemas

### i18n

Supported languages: English (`en`) and Czech (`cs`).

Preference order:

1. Saved preference (localStorage)
2. Browser language (`navigator.language` -> `en`/`cs`)
3. Fallback `en`

Switch language via the sidebar. Add/modify translations in:

- `src/lib/i18n/dictionaries/en.ts`
- `src/lib/i18n/dictionaries/cs.ts`

Use in client components:

```ts
const { t } = useI18n();
t("some.key");
```

Note: No `[locale]` segments; language does not affect routing.

### Scripts

- `npm run dev` – start dev server (Turbopack)
- `npm run build` – build production bundle
- `npm run start` – start production server
- `npm run lint` / `lint:fix` – lint code
- `npm run format` / `format:write` – Prettier

### Deployment

Standard Next.js deployment on your platform of choice. Configure environment variables and set `NODE_ENV=production`.
