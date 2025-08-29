# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router. Groups `(frontend)` for site pages and `(payload)` for CMS/admin; API routes under `src/app/api/*`.
- `src/collections`, `src/blocks`, `src/components`, `src/utilities`: Domain models, UI, and helpers. Payload config in `src/payload.config.ts`.
- `public/`: Static assets (media uploads in `public/media/`, git-ignored). Global styles at `src/app/(frontend)/globals.css`.
- Key configs: `next.config.ts`, `eslint.config.js`, `.editorconfig`, `.prettierrc.json`, `redirects.js`.

## Build, Test, and Development Commands
- `pnpm dev`: Start Next.js in dev mode (Turbo) and local CMS.
- `pnpm build`: Production build of the Next app.
- `pnpm start`: Serve the built app.
- `pnpm lint` / `pnpm lint:fix`: Lint code (Next + Prettier rules) and auto-fix.
- `pnpm payload`: Run Payload CLI (admin, tasks).
- `pnpm generate:types` / `pnpm generate:importmap`: Generate Payload types and admin import map.

## Coding Style & Naming Conventions
- TypeScript, 2-space indent (`.editorconfig`). Prettier: single quotes, no semicolons, width 100.
- ESLint extends Next + Prettier; fix all errors before PR.
- Files: React components `PascalCase.tsx`; utilities/hooks `camelCase.ts`; route segments and slugs `kebab-case`.
- Styling via Tailwind CSS; co-locate component styles or use global `globals.css`.

## Testing Guidelines
- No test suite is configured yet. If adding tests, prefer Vitest + Testing Library.
- Name tests `*.test.ts(x)` colocated with code. Mock network with MSW. Keep units small and deterministic.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Imperative, ≤72 char subject; scope optional.
- PRs must include: clear description, linked issues, screenshots for UI changes, and notes on data/CMS changes.
- Before opening: `pnpm lint` and `pnpm build` pass; update docs in `/docs` or `README.md` when behavior changes.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` (see `README.md`). Common keys: `DATABASE_URL`, `PAYLOAD_SECRET`, `OPENAI_API_KEY`, `RESEND_API_KEY`.
- `public/media/` is ignored; keep uploads there. Avoid `console.log` in server paths; prefer typed helpers in `src/utilities`.

## Agent Notes
- Keep changes minimal and scoped; follow file organization above.
- Avoid network/migration side effects; leave TODOs where needed.
