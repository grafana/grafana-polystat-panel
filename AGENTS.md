# AGENTS.md - Coding Agent Guidelines for grafana-polystat-panel

Grafana Polystat Panel plugin. React + TypeScript frontend panel plugin built with
`@grafana/create-plugin` scaffolding (v6.4.4). Uses Yarn 4 (Berry), Node >= 24, React 17.

## Build / Lint / Test Commands

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

### Running a Single Test

```bash
# By file path
yarn jest src/data/processor.test.ts

# By test name pattern
yarn jest -t "ClickThroughTransformer"

# Single file in watch mode
yarn jest --watch src/components/tooltips/Tooltip.test.tsx
```

### E2E Tests (Playwright)

```bash
yarn server                 # Start local Grafana via docker compose (port 3000)
yarn e2e                    # Run Playwright tests
yarn playwright:test:ui     # Playwright interactive UI mode
yarn playwright:showreport  # View HTML report
```

E2E tests require a running Grafana instance at `http://localhost:3000` with admin/admin
credentials. The `auth` project runs first to create stored auth state, then `run-tests`
executes against Desktop Chrome.

## Project Structure

- `src/module.ts` -- entry point (PanelPlugin registration)
- `src/migrations.ts` -- Angular-to-React migration logic
- `src/utils.ts` -- shared utilities (sorting, text sizing, decimals)
- `src/components/` -- UI layer: `PolystatPanel.tsx` (Grafana wrapper), `Polystat.tsx` (SVG rendering), `types.ts`, `defaults.ts`; subdirs for `composites/`, `overrides/`, `thresholds/`, `tooltips/`, `gradients/`, `layout/`
- `src/data/` -- processing layer: `processor.ts` (DataFrameToPolystat), `composite_processor.ts`, `override_processor.ts`, `threshold_processor.ts`, `clickThroughTransformer.ts`
- `src/__mocks__/models/` -- shared test fixtures
- `tests/` -- Playwright E2E tests

## Code Style

### Formatting (Prettier)

- Print width: 120
- Single quotes, semicolons required
- Trailing commas: ES5 style
- 2-space indentation, no tabs
- JSX uses double quotes

### Imports

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

### Types and Interfaces

- Use `interface` for object shapes (not `type` aliases)
- Use `enum` for fixed named constants with SCREAMING_SNAKE_CASE members
- Each feature directory has its own `types.ts` for local types
- Props interfaces are defined adjacent to their component in the same file
- Extend Grafana base types for panel props: `interface Props extends PanelProps<PolystatOptions> {}`
- Const arrays of `{ value, label }` for UI select options alongside enums

### Naming Conventions

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

### React Components

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

### Error Handling

- Use fallback/default values rather than throwing exceptions
- Guard with null/undefined checks and early returns
- `console.log('WARNING: ...')` for runtime warnings (no structured error framework)
- Silent `try/catch` with fallback values for version-compatibility workarounds

### Testing

- Tests co-located with source: `foo.ts` has `foo.test.ts` alongside it
- Use `describe`/`it` blocks with descriptive strings
- Name `it` blocks with "returns ..." or "should ..." phrasing
- `beforeEach` for mutable fixtures, `beforeAll` for immutable ones
- Use `@testing-library/react` for component tests (`render`, `screen`)
- Use `expect(...).toBe()` for primitives, `.toStrictEqual()` for objects, `.toMatchSnapshot()` for components
- Mock data centralized in `src/__mocks__/models/`
- Jest uses SWC for transpilation (not Babel)

## Key Technical Details

- **Grafana SDK versions**: `@grafana/data`, `@grafana/runtime`, `@grafana/ui` at `^9.5.21`
- **React 17** (not 18) with `@types/react` pinned to `17.0.44`
- **Webpack 5** with SWC loader, AMD library output format
- **Production build** drops `console.log` and `console.info` via TerserPlugin
- **ESLint 9** flat config extending `@grafana/eslint-config/flat.js`
- **`@grafana/plugins/import-is-compatible`** lint rule warns on SDK version mismatches
- **Docker compose** runs Grafana at `localhost:3000` with anonymous auth (admin role)
- **grafanaDependency**: `>=9.5.0` (minimum supported Grafana version)

## CI Workflow

CI runs via `grafana/plugin-ci-workflows` reusable workflow (v5.0.0):

- Lint, typecheck, unit tests, build
- Playwright E2E against `grafana-enterprise@latest` matching `>=10.1.0`
- Manual publish via `workflow_dispatch` to dev/ops/prod environments
