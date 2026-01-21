# Repository Guidelines

## Project Structure & Module Organization
This repository currently has no committed files. As the project grows, keep code organized with a predictable layout:
- `src/` for application or library source code.
- `tests/` for unit/integration tests mirroring `src/` paths.
- `assets/` for static files (images, fixtures, schemas).
- `docs/` for longer-form documentation beyond this guide.

If you add a new top-level directory, document its purpose in this file.

## Build, Test, and Development Commands
No build or test tooling is configured yet. When adding tooling, list the exact commands here with short descriptions, for example:
- `npm run dev` — starts the local dev server.
- `npm test` — runs the test suite.
- `npm run build` — creates a production build.

## Coding Style & Naming Conventions
Use consistent indentation (2 or 4 spaces, do not mix) and run a formatter if one is introduced (e.g., Prettier, Black, gofmt). Prefer:
- `kebab-case` for file and directory names.
- `camelCase` for variables/functions.
- `PascalCase` for types/classes.

If you add a linter/formatter, document the exact config file and command.

## Testing Guidelines
No testing framework is configured yet. When adding one, specify:
- Framework name (e.g., Jest, Pytest).
- Test file pattern (e.g., `*.test.ts`, `test_*.py`).
- How to run tests locally and in CI.

## Commit & Pull Request Guidelines
No Git history is present in this directory, so commit conventions are not discoverable. Until defined, use Conventional Commits (e.g., `feat:`, `fix:`) and keep subject lines under 72 characters.

For PRs, include:
- A clear description of changes and intent.
- Linked issue(s) if applicable.
- Screenshots or logs for user-visible changes or behavior.

## Agent-Specific Instructions
Keep this guide up to date as tooling and structure evolve. If a command or convention changes, update this file in the same PR.
