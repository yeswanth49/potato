# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/`; keep new routes inside feature folders (e.g., `app/contact`). Shared UI belongs in `components/`, with supporting hooks in `hooks/` and utilities in `lib/`. Global Tailwind layers are in `app/globals.css`, with design tokens and theme overrides under `styles/`. Persist static assets in `public/`, and capture architectural notes or briefs in `docs/` and `references/`.

## Build, Test, and Development Commands
Use pnpm to stay aligned with the lockfile. `pnpm dev` launches the Next.js dev server. `pnpm build` produces the optimized production bundle, and `pnpm start` serves that bundle. `pnpm lint` runs Next.js lint (ESLint + TypeScript awareness) and should pass before you push.

## Coding Style & Naming Conventions
Favor TypeScript (`.tsx`/`.ts`) and 2‑space indentation. Components and layout files use PascalCase (`HeroSection.tsx`), hooks use camelCase prefixed with `use` (`useCarousel.ts`), and utility helpers live under `lib/` with descriptive camelCase exports. Compose styles with Tailwind classes; when a variant grows complex, move logic into the existing `class-variance-authority` patterns. Run `pnpm lint` after formatting to confirm ESLint and built-in Next rules stay green.

## Testing Guidelines
Automated tests are not yet checked in; when contributing logic-heavy features, add React Testing Library or integration tests under `tests/` (or co-located `__tests__`). Mirror the route or component name, and favor descriptive filenames like `button.accessibility.test.tsx`. Document manual QA steps in your PR if tests are pending.

## Commit & Pull Request Guidelines
Follow the Conventional Commits style seen in the log (`feat:`, `fix:`, `chore:`). Keep messages short yet specific about the user-facing change. Each PR should include: a concise summary, screenshots or recordings for UI tweaks, linked issues/tasks, and explicit notes on testing performed. Request review when linting and builds succeed to keep `main` deploy-ready.
