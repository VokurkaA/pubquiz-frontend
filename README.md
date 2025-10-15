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
