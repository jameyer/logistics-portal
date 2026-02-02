# Project: Logistics Portal (React + Vite + TS + Tailwind 4)

This file describes how to work with this codebase so the AI can make consistent, idiomatic changes for a React + Vite + TypeScript + Tailwind v4 app using ESLint flat config. 

## Tech stack

- Runtime: React 19 with React DOM.
- Build tool: Vite 7 using `vite.config.ts` and `defineConfig` with `@vitejs/plugin-react` and `@tailwindcss/vite` for Tailwind v4. 
- Language: TypeScript for app code (`.ts` / `.tsx`), with a few Node utility scripts in `.js` / `.cjs`.
- Styling: Tailwind CSS v4 via the Vite plugin, with Tailwind directives imported in the main stylesheet (no separate `tailwind.config.*` by default). 
- Forms & validation: `react-hook-form`, `@hookform/resolvers`, and `zod`.
- Linting: ESLint 9 flat config (`eslint.config.js`) using:
  - `@eslint/js` recommended,
  - `typescript-eslint` recommended,
  - `eslint-plugin-react-hooks` recommended,
  - `eslint-plugin-react-refresh` Vite preset. 
- Other libs: `date-fns`, `uuid`, `clsx`, `tailwind-merge`, `@bwip-js/browser`, `pdf-lib`, `express`.

## Vite and environment expectations

- Use `vite.config.ts` with `defineConfig`, React plugin, and Tailwind plugin:
  - Do not introduce additional Vite plugins or change the config shape unless explicitly requested.
  - Any new plugin usage should be added to the existing `plugins` array and kept minimal. 
- Assume a standard SPA setup (no SSR) with the default dev server port unless env-driven changes are introduced.
- If environment variables are needed at build time, prefer Vite’s `import.meta.env` mechanism and `loadEnv` in the config rather than reading from `process.env` directly. 

## ESLint and code quality

- All generated or modified code must pass `npm run lint` using the existing flat ESLint configuration. 
- Lint scope:
  - Target TypeScript files via the `files: ['**/*.{ts,tsx}']` pattern.
  - Respect rules from `@eslint/js`, `typescript-eslint`, `react-hooks`, and `react-refresh`.
- Do not disable ESLint rules globally:
  - If a rule must be disabled, restrict it to the smallest possible region (line or block) and add a short justification comment.
- Keep imports clean:
  - Remove unused imports and variables.
  - Avoid circular dependencies.

## TypeScript and React conventions

- Use function components and hooks only; no class components.
- Prefer `strict`-friendly typing:
  - Avoid `any`; if it’s unavoidable, annotate why in a short comment.
  - Use `zod` schemas to derive types (`z.infer<typeof Schema>`) for form values and data models when appropriate.
- Exported components, hooks, and utilities should have explicit types for props and return values where it improves readability.
- Follow React Hooks rules:
  - Do not call hooks conditionally.
  - Maintain accurate dependency arrays for `useEffect`, `useMemo`, and `useCallback`, consistent with `eslint-plugin-react-hooks` recommendations. 

## Tailwind CSS usage

- Use Tailwind utility classes directly in `className` for layout and styling; avoid writing raw CSS unless necessary.
- Organize classes in a consistent order: layout → flex/grid → spacing → typography → colors → borders → effects → state (hover/focus/disabled).
- Prefer theme values and semantic classes over ad‑hoc arbitrary values, unless a design requires a one‑off value.
- Extract common class combinations using:
  - Small presentational components, or
  - Helpers that use `clsx` and `tailwind-merge` to merge conditional classes.
- If a Tailwind configuration file is introduced later, it should align with the Tailwind v4 + Vite plugin setup rather than the legacy `content`/`theme` style config.

## Forms, validation, and data handling

- Use `react-hook-form` for new forms and integrate validation with `zod` via `@hookform/resolvers` where appropriate.
- Prefer schema-driven forms:
  - Define a `zod` schema for the form data shape.
  - Infer TypeScript types from the schema to keep form logic in sync.
- Use `date-fns` for date and time utilities rather than writing custom parsing and formatting.

## Files, folders, and scripts

- Keep new code consistent with the existing layout (for example `src/components`, `src/utils`, `src/assets`, `src/hooks`, etc.).
- Use `.tsx` for React components and `.ts` for non‑JSX modules.
- Maintain the Node scripts used by `package.json` commands:
  - `./src/utils/faker.bol.create.js`
  - `./src/assets/express.js`
  - `./src/utils/drawGrid.cjs`
  - `./src/utils/checkFields.cjs`
- When modifying these scripts, preserve Node compatibility and the existing CLI behavior invoked by `npm run bols`, `npm run express`, `npm run grid`, and `npm run check`.

## Working with this project via AI

- Prefer minimal, focused diffs over large rewrites; show only the sections of files that changed plus a small amount of surrounding context.
- Before adding new top‑level concepts (global state management, routing changes, major layout refactors), briefly outline:
  - The goal,
  - Proposed file changes,
  - Any new dependencies.
- Keep the workflow compatible with existing scripts:
  - `npm run dev` for development,
  - `npm run build` for TypeScript and Vite production build,
  - `npm run lint` to verify ESLint passes.

