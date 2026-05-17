# AGENTS.md - Coding Agent Guidelines for grafana-polystat-panel

Grafana Polystat Panel plugin. React + TypeScript frontend panel plugin built with `@grafana/create-plugin`
scaffolding (v7.6.0). Uses Yarn 4 (Berry), Node >= 24, React 17.

**Working code only. Finish job. Plausibility ≠ correctness.**

File follows [AGENTS.md](https://agents.md) open standard (Linux Foundation / Agentic AI Foundation). Claude Code,
Codex, Cursor, Windsurf, Copilot, Aider, Devin, Amp read natively. Other tools: symlink:

```bash
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md GEMINI.md
```

---

## 0. Non-negotiables

Override everything else when conflict:

1. **No flattery/filler.** Skip "Great question", "Excellent idea", "I'd be happy to". Start with answer or action.
2. **Disagree when wrong.** Say so before doing work. Agreeing false premises = worst failure mode.
3. **No fabrication.** No paths, hashes, API names, test results, library functions. Don't know → read file, run cmd,
   or say so.
4. **Stop when confused.** Two interpretations → ask. Don't pick silently.
5. **Touch only what needed.** Every changed line traces to request. No drive-by refactors/reformats/"while I was in
   there" cleanups.

---

## 1. Before writing code

Goal: understand problem + codebase before diff.

- State plan 1-2 sentences before edit. Non-trivial: numbered steps + verification per step.
- Read files you touch. Read callers. Subagents for exploration (keep main context clean).
- Match existing patterns. Project uses X → use X, even if you'd do differently greenfield.
- Surface assumptions: "Assuming X, Y, Z. Wrong → say so." Don't bury in implementation.
- Two approaches: present both with tradeoffs. Don't pick silently. Exception: trivial tasks where diff fits one
  sentence.

---

## 2. Writing code: simplicity first

Goal: min code that solves stated problem. Nothing speculative.

- No extra features.
- No abstractions for single-use. No unrequested configurability/hooks.
- No error handling for impossible scenarios. Handle actual failures only.
- 200 lines that could be 50 → rewrite first.
- "For future extensibility" → stop. Future = future decision.
- Delete > add. Less = better.

Test: would senior engineer call diff overcomplicated? Yes → simplify.

---

## 3. Surgical changes

Goal: clean, reviewable diffs. Change only what request requires.

- Don't "improve" adjacent code/comments/formatting/imports not in task.
- Don't refactor working code just because you're in file.
- Don't delete pre-existing dead code unless asked. Notice it → mention in summary.
- Do clean up orphans your changes created (unused imports, vars, funcs your edit made obsolete).
- Match project style exactly: indent, quotes, naming, layout.

Test: every changed line traces to request. Fails → revert.

---

## 4. Goal-driven execution

Goal: define verifiable success, loop until verified.

Rewrite vague asks before starting:

- "Add validation" → "Write tests for invalid inputs (empty, malformed, oversized), make them pass."
- "Fix bug" → "Write failing test reproducing symptom, make it pass."
- "Refactor X" → "Test suite passes before+after. No public API changes."
- "Make faster" → "Benchmark hot path, profile bottleneck, change it, show benchmark improved."

Every task:

1. State success criteria before code.
2. Write verification (test/script/benchmark/screenshot diff) where practical.
3. Run it. Read output. No success claim without checking.
4. Verification fails → fix cause, not test.

---

## 5. Tool use and verification

- Run code > guess about code. Test suite exists → run it. Linter → run it. Type checker → run it.
- Never "done" from plausible-looking diff. Plausibility ≠ correctness.
- Debugging: root causes, not symptoms. Suppressing error ≠ fixing error.
- UI changes: screenshot before+after, describe diff.
- Use CLI tools (`gh`) when available. More efficient than reading docs.
- Logs/errors/traces: read whole thing. Half-read trace → wrong fix.

---

## 6. Session hygiene

- Context = constraint. Long sessions with failed attempts < fresh session with sharper prompt.
- Two failed corrections same issue → stop. Summarize, ask user reset session with sharper prompt.
- Subagents for exploration (don't pollute main context with file reads).
- Commit messages: subject under 72 chars. Body grouped by filename with bulleted changes under each, wrapped at 120
  chars. Explains why, not what. No "update file"/"fix bug".

---

## 7. Communication style

- Direct, not diplomatic. "Won't scale because X" > "interesting approach, consider..."
- Concise default. 2-3 short paragraphs unless depth asked. No padding/restating/ceremonial closings.
- Clear answer → give it. No clear answer → say so + best tradeoff read.
- Celebrate: shipping, solving hard problems, metrics moved. Not feature ideas, scope creep, "wouldn't it be cool."
- No excessive bullets, unprompted headers, emoji. Prose > structure for short answers.

---

## 8. When to ask, when to proceed

Ask when:

- Two interpretations, choice materially affects output.
- Change touches load-bearing/versioned/migration-path code.
- Need credential/secret/prod resource you lack.
- Stated goal conflicts with literal request.

Proceed when:

- Trivial + reversible (typo, rename local var, add log line).
- Ambiguity resolved by reading code or running command.
- User already answered question this session.

---

## 9. Project Context

### Build / Lint / Test Commands

```bash
yarn                    # Install dependencies (Yarn 4, uses packageManager field)
yarn build              # Production build (webpack, outputs to dist/)
yarn dev                # Dev build with watch mode + livereload
yarn typecheck          # TypeScript type checking (tsc --noEmit)
yarn lint               # ESLint (flat config, v9)
yarn lint:fix           # ESLint autofix + Prettier
yarn test               # Jest in watch mode (changed files only)
yarn test:ci            # Jest CI mode (all tests, 4 workers)
yarn test:coverage      # Jest with coverage report
yarn spellcheck         # cspell across all source files
```

#### Running a Single Test

```bash
# By file path
yarn jest src/data/processor.test.ts

# By test name pattern
yarn jest -t "ClickThroughTransformer"

# Single file in watch mode
yarn jest --watch src/components/tooltips/Tooltip.test.tsx
```

#### E2E Tests (Playwright)

```bash
yarn server                 # Start local Grafana via docker compose (port 3000)
yarn e2e                    # Run Playwright tests
yarn playwright:test:ui     # Playwright interactive UI mode
yarn playwright:showreport  # View HTML report
```

E2E tests require a running Grafana instance at `http://localhost:3000` with admin/admin credentials. The `auth`
project runs first to create stored auth state, then `run-tests` executes against Desktop Chrome.

### Project Structure

- `src/module.ts` -- entry point (PanelPlugin registration)
- `src/migrations.ts` -- Angular-to-React migration logic
- `src/utils.ts` -- shared utilities (sorting, text sizing, decimals)
- `src/components/` -- UI layer: `PolystatPanel.tsx` (Grafana wrapper), `Polystat.tsx` (SVG rendering), `types.ts`,
  `defaults.ts`; subdirs for `composites/`, `overrides/`, `thresholds/`, `tooltips/`, `gradients/`, `layout/`
- `src/data/` -- processing layer: `processor.ts` (DataFrameToPolystat), `composite_processor.ts`,
  `override_processor.ts`, `threshold_processor.ts`, `clickThroughTransformer.ts`
- `src/__mocks__/models/` -- shared test fixtures
- `tests/` -- Playwright E2E tests

### Code Style

#### Formatting (Prettier)

- Print width: 120
- Single quotes, semicolons required
- Trailing commas: ES5 style
- 2-space indentation, no tabs
- JSX uses double quotes

#### Imports

Order imports as: external packages, then internal (relative) imports.

```typescript
import React, { useEffect, useState } from 'react';
import { textUtil } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { orderBy as lodashOrderBy } from 'lodash';

import { Gradients } from './gradients/Gradients';
import { PolystatOptions } from './types';
```

- Use named imports exclusively -- no default exports exist in this codebase
- Alias imports to avoid name collisions: `orderBy as lodashOrderBy`, `Tooltip as ReactTooltip`
- Import directly from specific files, not barrel/index files

#### Types and Interfaces

- Use `interface` for object shapes (not `type` aliases)
- Use `enum` for fixed named constants with SCREAMING_SNAKE_CASE members
- Each feature directory has its own `types.ts` for local types
- Props interfaces are defined adjacent to their component in the same file
- Extend Grafana base types for panel props: `interface Props extends PanelProps<PolystatOptions> {}`
- Const arrays of `{ value, label }` for UI select options alongside enums

#### Naming Conventions

| Element            | Convention        | Example                                  |
| ------------------ | ----------------- | ---------------------------------------- |
| React components   | PascalCase `.tsx` | `PolystatPanel.tsx`, `Tooltip.tsx`       |
| Processing modules | snake_case `.ts`  | `composite_processor.ts`                 |
| Utility modules    | camelCase `.ts`   | `clickThroughTransformer.ts`             |
| Exported functions | PascalCase        | `DataFrameToPolystat`, `ApplyComposites` |
| Internal functions | camelCase         | `getCoords`, `drawShape`                 |
| Global constants   | SCREAMING_SNAKE   | `GLOBAL_FILL_COLOR_RGBA`                 |
| Enum members       | SCREAMING_SNAKE   | `HEXAGON_POINTED_TOP`                    |
| Variables          | camelCase         | `activeLabelFontSize`                    |
| Interfaces         | PascalCase        | `PolystatModel`, `TooltipProps`          |

#### React Components

- Functional components only, no class components
- Type with `React.FC<Props>` or destructured props with explicit type annotation
- Use Grafana hooks: `useStyles2`, `useTheme2` for styling
- Styles defined as functions taking `GrafanaTheme2`, returning emotion `css` template literals

```typescript
export const MyComponent: React.FC<Props> = ({ options, data }) => {
  const styles = useStyles2(getStyles);
};

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css`
    position: relative;
  `,
});
```

#### Error Handling

- Use fallback/default values rather than throwing exceptions
- Guard with null/undefined checks and early returns
- `console.log('WARNING: ...')` for runtime warnings (no structured error framework)
- Silent `try/catch` with fallback values for version-compatibility workarounds

#### Testing

- Tests co-located with source: `foo.ts` has `foo.test.ts` alongside it
- Use `describe`/`it` blocks with descriptive strings
- Name `it` blocks with "returns ..." or "should ..." phrasing
- `beforeEach` for mutable fixtures, `beforeAll` for immutable ones
- Use `@testing-library/react` for component tests (`render`, `screen`)
- Use `expect(...).toBe()` for primitives, `.toStrictEqual()` for objects, `.toMatchSnapshot()` for components
- Mock data centralized in `src/__mocks__/models/`
- Jest uses SWC for transpilation (not Babel)

### Key Technical Details

- **Grafana SDK versions**: `@grafana/data`, `@grafana/runtime`, `@grafana/ui` at `^9.5.21`
- **React 17** (not 18) with `@types/react` pinned to `17.0.44`
- **Webpack 5** with SWC loader, AMD library output format
- **Production build** drops `console.log` and `console.info` via TerserPlugin
- **ESLint 9** flat config extending `@grafana/eslint-config/flat.js`
- **`@grafana/plugins/import-is-compatible`** lint rule warns on SDK version mismatches
- **Docker compose** runs Grafana at `localhost:3000` with anonymous auth (admin role)
- **grafanaDependency**: `>=9.5.0` (minimum supported Grafana version)

### CI Workflow

CI runs via `grafana/plugin-ci-workflows` reusable workflow (v7.3.1):

- Lint, typecheck, unit tests, build
- Playwright E2E against `grafana-enterprise@latest` matching `>=12.3.0`
- Manual publish via `workflow_dispatch` to dev/ops/prod environments

### Plugin Tooling Rules

- **Never modify anything inside `.config/`** — managed by Grafana plugin tooling (`@grafana/create-plugin`). Extend
  configs at the repo root only.
- **Never change `id` or `type`** in `src/plugin.json`. Changes require a Grafana server restart.
- Use webpack from `.config/` for builds; do not add a custom bundler.
- Use `@grafana/plugin-e2e` for E2E tests.
- **Do NOT pin `grafana/plugin-ci-workflows` to a commit SHA.** Grafana's CI enforces tagged releases only (e.g.,
  `@ci-cd-workflows/v7`). SHA pinning will fail the "Check for release channel" job. All other GitHub Actions
  **should** be pinned to SHAs.
- Grafana API docs: <https://grafana.com/developers/plugin-tools/llms.txt>

### Pre-commit Checklist

Run all of these and fix issues before committing:

1. `yarn typecheck` — when any `src/` files are changed
2. `yarn lint` — fix errors with `yarn lint:fix`
3. `yarn markdownlint` (or `npx markdownlint-cli2`) — on any `.md` file created or modified (AGENTS.md,
   CHANGELOG.md, README.md)
4. `yarn spellcheck` (or `npx cspell ...`) — fix issues, add legit words to `cspell.config.json`
5. **Always update `CHANGELOG.md`** — include the entry in the same commit

### ESLint Rules

Flat config (ESLint 9). Common rules applied:

- `no-console` and `no-debugger` are **errors**
- `@typescript-eslint/no-deprecated` is a **warning** — avoid deprecated APIs
- `@typescript-eslint/no-empty-object-type: off`
- Unused variables are errors (except rest siblings)
- Test files, mocks, config files, and server dirs are excluded from linting

### Critical Rules

- **Always update `CHANGELOG.md` before committing.** Every commit must include the corresponding changelog entry.
  Add entries under `[Unreleased]`, categorized as `### Added`, `### Changed`, `### Removed`, `### Fixed`, or
  `### Project Updates`.
- **NEVER commit unless the user explicitly asks.**
- **NEVER push unless the user explicitly asks.** Never chain `git commit && git push`. Always wait for explicit push
  instruction.
- **After pushing, always update the PR summary** if a PR exists. Use `gh pr edit` to update title and body
  reflecting all changes across the entire branch.
- **No AI attribution** in PR summaries, commits, or any other output.
- **Prefer subagents** for research, code exploration, and multi-step work. Use the Task tool with `explore` or
  `general` agents rather than running many search/read commands directly. Launch multiple agents in parallel when
  tasks are independent.

### Branching Policy

- **Never commit directly to `main`.** Always create a new branch for changes.
- Use descriptive branch names (`feat/add-feature`, `fix/bug-description`).
- **Always create pull requests as drafts** (`gh pr create --draft`).
- When checking out a branch or `main`, always `git fetch` and `git pull` first.
- **Always run `git status`** before constructing `git add` commands.
- **Use categories** in PR summaries: `### Added`, `### Fixed`, `### Changed`, `### Removed`,
  `### Dependencies`, `### CI/CD`, `### Documentation`, `### Tooling`.
- Always include a `## Test plan` section in PRs with a checklist of verification steps.

## 10. Project Learnings

- (empty)

---

## Maintaining this file

Sections 0–8 = general agent behavioral rules.
Section 9 = project context.
Section 10 = project learnings.

File is living. Keep short by keeping honest.

After session where agent erred:

1. Missing rule or ignored rule?
2. Missing → add under "Project Learnings", concrete ("Always use X for Y", not "be careful with Y").
3. Ignored → rule too long/vague/buried. Tighten or move up.
4. Prune every few weeks. Per line: "removing this → agent mistake?" No → delete.
