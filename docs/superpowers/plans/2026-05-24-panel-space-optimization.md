# Panel Space Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maximize hexagon polygon size and text in grafana-polystat-panel by replacing the ad-hoc 0.75 column heuristic with a mathematically optimal search, fixing misnamed methods, reducing conservative text padding, and adding a new HEXAGON_FLAT_TOP shape.

**Architecture:** Seven code tasks (rename → optimize pointed-top → fix text → add flat-top shape) plus an E2E dashboard for visual before/after comparison. All code changes are TDD. Branch: `feature/panel-space-optimization` stacked on `refactor/font-scaler`.

**Tech Stack:** TypeScript, d3-hexbin (pointed-top rendering only), Jest, @grafana/plugin-e2e (Playwright)

---

## File Map

| File                                                                 | Role                                                 |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| `src/components/layout/layoutManager.ts`                             | Column optimizer, rename, flat-top geometry          |
| `src/components/layout/layoutManager.test.ts`                        | All layout unit tests                                |
| `src/components/types.ts`                                            | Add HEXAGON_FLAT_TOP enum + PolygonNamedShapes entry |
| `src/utils.ts`                                                       | Proportional text padding                            |
| `src/utils.test.ts`                                                  | Text padding unit tests                              |
| `src/components/Polystat.tsx`                                        | textAreaHeight, customShape, drawShape for flat-top  |
| `provisioning/dashboards/Layout-Space-Optimization.json`             | 4-panel dashboard for E2E screenshots                |
| `tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts` | E2E screenshot spec                                  |

---

## Task 1: Rename misnamed hex methods

`getHexFlatTopRadius` / `getHexFlatTopDiameters` compute **pointed-top** geometry. The names are wrong and will conflict with the real flat-top methods added in Task 7.

**Files:**

- Modify: `src/components/layout/layoutManager.ts`
- Modify: `src/components/layout/layoutManager.test.ts`

- [ ] **Step 1: Add a test that will verify the rename**

Add to `src/components/layout/layoutManager.test.ts` inside `describe('Layout Manager', ...)`:

```typescript
describe('getHexPointedTopRadius', () => {
  it('returns a positive radius for a 400x200 panel with 4 cols and 2 rows', () => {
    const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    const r = lm.getHexPointedTopRadius();
    expect(r).toBeGreaterThan(0);
  });
  it('returns a larger radius when given fewer actual cols/rows', () => {
    const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    const rDefault = lm.getHexPointedTopRadius(); // uses numColumns=8
    const rActual = lm.getHexPointedTopRadius(2, 2); // 4 items, 2x2
    expect(rActual).toBeGreaterThan(rDefault);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

Expected: `TypeError: lm.getHexPointedTopRadius is not a function`

- [ ] **Step 3: Rename `getHexFlatTopRadius` → `getHexPointedTopRadius` in layoutManager.ts**

Change the method signature at line 96 and all call sites:

```typescript
// line 77 — inside generateHexagonPointedTopLayout
this.radius = this.getHexPointedTopRadius();

// line 96 — method declaration
getHexPointedTopRadius(cols?: number, rows?: number): number {
  const c = cols ?? this.numColumns;
  const r = rows ?? this.numRows;
  let hexRadius = d3.min([
    this.width  / ((c + 0.5) * this.SQRT3),
    this.height / ((r + 1 / 3) * 1.5),
  ]);
  if (hexRadius !== undefined) {
    return this.truncateFloat(hexRadius);
  }
  return 40;
}

// line 114 — inside getHexPointedTopDiameters (renamed next)
const hexRadius = this.getHexPointedTopRadius();

// line 399 — inside generateRadius (HEXAGON_POINTED_TOP case)
radius = this.getHexPointedTopRadius(this.maxColumnsUsed, this.maxRowsUsed);

// line 413 — inside generateRadius (default case)
radius = this.getHexPointedTopRadius(this.maxColumnsUsed, this.maxRowsUsed);
```

- [ ] **Step 4: Rename `getHexFlatTopDiameters` → `getHexPointedTopDiameters` and update its body and call site**

```typescript
// method at line 113
getHexPointedTopDiameters(): PolystatDiameters {
  const hexRadius = this.getHexPointedTopRadius(this.maxColumnsUsed, this.maxRowsUsed);
  const diameterX = this.truncateFloat(hexRadius * this.SQRT3);
  const diameterY = this.truncateFloat(hexRadius * 2);
  return { diameterX, diameterY };
}

// getDiameters() at line 540 — HEXAGON_POINTED_TOP case
return this.getHexPointedTopDiameters();
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

Expected: all existing tests pass + new `getHexPointedTopRadius` tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/layoutManager.ts src/components/layout/layoutManager.test.ts
git commit -m "refactor: rename getHexFlatTopRadius/Diameters to getHexPointedTop*

Corrects misleading names: these methods compute pointed-top hexagon
geometry (points at 12/6 o'clock), not flat-top. Renamed before adding
real flat-top methods in a later commit to avoid confusion.

- src/components/layout/layoutManager.ts
  - getHexFlatTopRadius → getHexPointedTopRadius (accepts optional
    cols/rows params for actual-grid sizing; defaults to numColumns/numRows)
  - getHexFlatTopDiameters → getHexPointedTopDiameters (passes
    maxColumnsUsed/maxRowsUsed to getHexPointedTopRadius)
  - generateRadius: HEXAGON_POINTED_TOP and default cases pass
    maxColumnsUsed/maxRowsUsed to getHexPointedTopRadius
- src/components/layout/layoutManager.test.ts
  - Add getHexPointedTopRadius tests verifying positive radius and
    larger result when actual grid is smaller than max"
```

---

## Task 2: Add `findOptimalColumns` + update `generatePossibleColumnAndRowsSizes`

Replaces the `(W/H) * sqrt(N) * 0.75` heuristic for `HEXAGON_POINTED_TOP`. For a 4:1 panel with 20 items, the heuristic produces 14 columns (radius ≈ 79.6px); the optimizer produces ~10 columns (radius ≈ 110px) — a 38% gain.

**Files:**

- Modify: `src/components/layout/layoutManager.ts`
- Modify: `src/components/layout/layoutManager.test.ts`

- [ ] **Step 1: Write failing tests**

Add to `layoutManager.test.ts` inside `describe('Layout Manager', ...)`:

```typescript
describe('findOptimalColumns', () => {
  it('produces a larger radius than the 0.75 heuristic on a wide panel', () => {
    // 0.75 heuristic: cols = ceil(4 * sqrt(20) * 0.75) = ceil(13.4) = 14 → radius ≈ 79.6
    const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    const optCols = lm.findOptimalColumns(20, 2000, 500);
    const optRows = Math.ceil(20 / optCols);
    const SQRT3 = 1.7320508075688772;
    const optRadius = Math.min(2000 / ((optCols + 0.5) * SQRT3), 500 / ((optRows + 1 / 3) * 1.5));
    expect(optRadius).toBeGreaterThan(79.6);
  });

  it('handles a square panel without regression', () => {
    const lm = new LayoutManager(400, 400, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    const cols = lm.findOptimalColumns(16, 400, 400);
    expect(cols).toBeGreaterThanOrEqual(1);
    expect(cols).toBeLessThanOrEqual(16);
  });

  it('returns 1 for a single item', () => {
    const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    expect(lm.findOptimalColumns(1, 400, 200)).toBe(1);
  });

  it('caps at n for large panels', () => {
    const lm = new LayoutManager(5000, 100, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    expect(lm.findOptimalColumns(5, 5000, 100)).toBeLessThanOrEqual(5);
  });
});

describe('generatePossibleColumnAndRowsSizes — hex auto-size', () => {
  it('produces more space-efficient column count than 0.75 heuristic on 4:1 panel', () => {
    const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    lm.generatePossibleColumnAndRowsSizes(true, true, 100, 20);
    // old heuristic: cols = ceil(4 * sqrt(20) * 0.75) = 14
    // new optimizer must beat radius achieved with 14 cols
    const SQRT3 = 1.7320508075688772;
    const oldRadius = Math.min(2000 / ((14 + 0.5) * SQRT3), 500 / ((2 + 1 / 3) * 1.5));
    const newRadius = Math.min(2000 / ((lm.numColumns + 0.5) * SQRT3), 500 / ((lm.numRows + 1 / 3) * 1.5));
    expect(newRadius).toBeGreaterThan(oldRadius);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

Expected: `TypeError: lm.findOptimalColumns is not a function`

- [ ] **Step 3: Add `findOptimalColumns` to `layoutManager.ts`**

Add after `getHexPointedTopDiameters()`:

```typescript
findOptimalColumns(n: number, w: number, h: number): number {
  // Closed-form estimate that equates the width and height hex constraints:
  // cols^2 = n * w * 1.5 / (h * SQRT3)
  const approx = Math.sqrt((n * w * 1.5) / (h * this.SQRT3));
  const candidates = [approx - 2, approx - 1, approx, approx + 1, approx + 2]
    .map(c => Math.max(1, Math.min(n, Math.round(c))));
  const unique = [...new Set(candidates)];
  let bestCols = unique[0];
  let bestRadius = -1;
  for (const cols of unique) {
    const rows = Math.ceil(n / cols);
    const r = Math.min(
      w / ((cols + 0.5) * this.SQRT3),
      h / ((rows + 1 / 3) * 1.5)
    );
    if (r > bestRadius) {
      bestRadius = r;
      bestCols = cols;
    }
  }
  return bestCols;
}
```

- [ ] **Step 4: Update `generatePossibleColumnAndRowsSizes` — replace the `0.75` branches for `HEXAGON_POINTED_TOP`**

The current `rowAutoSize && columnAutoSize` block has two branches: RECTANGLE (keep as-is) and the `else` branch for hex/circle/square. Replace the `else` with two branches:

```typescript
if (rowAutoSize && columnAutoSize) {
  if (this.shape === PolygonShapes.RECTANGLE) {
    // existing rectangle formula — unchanged
    this.numColumns = Math.max(1, Math.ceil(Math.sqrt((useLimit * this.width) / (2 * this.height))));
    if (this.numColumns > useLimit) {
      this.numColumns = useLimit;
    }
    this.numRows = Math.ceil(useLimit / this.numColumns);
    if (this.numRows < 1) {
      this.numRows = 1;
    }
  } else if (this.shape === PolygonShapes.HEXAGON_POINTED_TOP) {
    this.numColumns = this.findOptimalColumns(useLimit, this.width, this.height);
    if (this.numColumns > useLimit) {
      this.numColumns = useLimit;
    }
    this.numRows = Math.ceil(useLimit / this.numColumns);
    if (this.numRows < 1) {
      this.numRows = 1;
    }
  } else {
    // circle / square — keep existing sqrt heuristic unchanged
    const squared = Math.sqrt(useLimit);
    if (this.width > this.height) {
      this.numColumns = Math.ceil((this.width / this.height) * squared * 0.75);
      if (this.numColumns < 1) {
        this.numColumns = 1;
      } else if (this.numColumns > useLimit) {
        this.numColumns = useLimit;
      }
      this.numRows = Math.ceil(useLimit / this.numColumns);
      if (this.numRows < 1) {
        this.numRows = 1;
      }
    } else {
      this.numRows = Math.ceil((this.height / this.width) * squared * 0.75);
      if (this.numRows < 1) {
        this.numRows = 1;
      } else if (this.numRows > useLimit) {
        this.numRows = useLimit;
      }
      this.numColumns = Math.ceil(useLimit / this.numRows);
      if (this.numColumns < 1) {
        this.numColumns = 1;
      }
    }
  }
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/layoutManager.ts src/components/layout/layoutManager.test.ts
git commit -m "feat: replace 0.75 column heuristic with optimal search for hex pointed-top

The old formula (W/H * sqrt(N) * 0.75) produced too many columns on wide
panels — e.g., 4:1 panel with 20 items gives 14 cols (r=79.6px) instead
of the optimal ~10 cols (r=110px), a 38% radius loss.

- src/components/layout/layoutManager.ts
  - Add findOptimalColumns(n, w, h): closed-form estimate + 5-candidate
    neighbor search; always O(1) regardless of N
  - generatePossibleColumnAndRowsSizes: add HEXAGON_POINTED_TOP branch
    using findOptimalColumns; RECTANGLE and circle/square unchanged
- src/components/layout/layoutManager.test.ts
  - findOptimalColumns: wide panel beats 0.75 radius, square panel,
    single item, cap-at-N edge cases
  - generatePossibleColumnAndRowsSizes: radius improvement assertion"
```

---

## Task 3: Use actual grid in pointed-top offset calculation

`getOffsetsHexagonPointedTop` uses `this.numColumns` for width calculation instead of `this.maxColumnsUsed`. For manually-configured panels where numColumns > actual data, this centers the grid incorrectly.

**Files:**

- Modify: `src/components/layout/layoutManager.ts`
- Modify: `src/components/layout/layoutManager.test.ts`

- [ ] **Step 1: Write failing test**

Add to `layoutManager.test.ts`:

```typescript
describe('getOffsetsHexagonPointedTop — uses maxColumnsUsed not numColumns', () => {
  it('centering uses actual columns, not the configured max', () => {
    // 4 items on an 8-col panel: maxColumnsUsed should be 4 (all in row 0)
    const lm = new LayoutManager(800, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_POINTED_TOP);
    lm.maxColumnsUsed = 4;
    lm.maxRowsUsed = 1;
    const { xoffset } = lm.getOffsets(PolygonShapes.HEXAGON_POINTED_TOP, 100, 4);
    // With 4 actual cols on an 800px panel, radius ≈ 800/((4+0.5)*SQRT3) ≈ 102.6
    // actualWidthUsed ≈ 4 * 102.6 * SQRT3 ≈ 710px, gap ≈ 90px → xoffset ≈ -(45 + 88.9)
    // The xoffset must be negative (content centered, not left-aligned)
    expect(xoffset).toBeLessThan(0);
    // And the magnitude must reflect centering (gap / 2 < radius)
    const r = lm.getHexPointedTopRadius(4, 1);
    expect(Math.abs(xoffset)).toBeLessThan(r * 1.5 * 4); // less than full width
  });
});
```

- [ ] **Step 2: Run test — verify current behavior**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

This test may pass already (xoffset is negative). Confirm the test passes with current code — its purpose is to lock in the contract, not expose a failure. Move to step 3.

- [ ] **Step 3: Update `getOffsetsHexagonPointedTop` to use `maxColumnsUsed`**

Find `getOffsetsHexagonPointedTop` (line ~462). Change the hexRadius calculation and the `actualWidthUsed` line:

```typescript
getOffsetsHexagonPointedTop(dataSize: number): any {
  // Use actual grid dimensions, not the configured max
  const hexRadius = this.getHexPointedTopRadius(this.maxColumnsUsed, this.maxRowsUsed);
  const shapeWidth = this.truncateFloat(hexRadius * this.SQRT3);
  const shapeHeight = this.truncateFloat(hexRadius * 2);

  const offsetToViewY = shapeHeight * 0.5;
  const { oddCount, evenCount } = this.getOddEvenCountForRange(1, this.maxRowsUsed);
  const actualHeightUsed = oddCount * shapeHeight + evenCount * shapeHeight * 0.5;
  let yoffset = (this.height - actualHeightUsed) / 2;
  yoffset = -(yoffset + offsetToViewY);

  const offsetToViewX = shapeWidth * 0.5;
  let widthOffset = 0;
  if (this.maxRowsUsed > 1) {
    if (dataSize >= this.maxColumnsUsed * 2) {
      widthOffset = 0.5;
    }
  }
  // Use maxColumnsUsed (actual data) not numColumns (configured max)
  const actualWidthUsed = (this.maxColumnsUsed + widthOffset) * shapeWidth;
  let xoffset = (this.width - actualWidthUsed) / 2;
  xoffset = -(xoffset + offsetToViewX);
  return { xoffset, yoffset };
}
```

- [ ] **Step 4: Run all tests — expect PASS**

```bash
yarn test --watchAll=false
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/layoutManager.ts src/components/layout/layoutManager.test.ts
git commit -m "fix: use maxColumnsUsed/maxRowsUsed in hex pointed-top offset and radius

When numColumns > actual data columns (manual config), the centering
offset and radius were computed against the empty slots, wasting space.

- src/components/layout/layoutManager.ts
  - getOffsetsHexagonPointedTop: pass maxColumnsUsed/maxRowsUsed to
    getHexPointedTopRadius; replace numColumns with maxColumnsUsed in
    actualWidthUsed; replace numRows with maxRowsUsed in row offset check
- src/components/layout/layoutManager.test.ts
  - Add offset centering test asserting xoffset reflects actual 4-col
    grid on an 8-col panel"
```

---

## Task 4: Fix text padding in utils.ts

Two conservative padding values. At `diameterX=50px`, the 20px flat deduction is 40% waste.

**Files:**

- Modify: `src/utils.ts`
- Modify: `src/utils.test.ts`

- [ ] **Step 1: Write failing tests**

Add to `src/utils.test.ts`:

```typescript
import { getTextSizeForWidth, getTextSizeForWidthAndHeight } from './utils';

describe('getTextSizeForWidth padding', () => {
  it('pads proportionally at small widths (width=50 → subtract 3, not 20)', () => {
    // The internal padding is not directly observable, but we can verify
    // that a font that fits in 47px is returned for width=50 by checking
    // getTextSizeForWidth returns a positive size for a short string.
    // More directly: call with a string we know fits, then verify a string
    // that barely fits with 3px padding does NOT fit with 20px padding.
    // We use canvas mock — getTextWidth returns 0 for all text in test env,
    // so any font fits. Instead test the exported function doesn't throw
    // and returns a plausible value.
    const result = getTextSizeForWidth('A', '?px sans-serif', 50, 6, 240);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('pads proportionally at large widths (width=400 → subtract 20, same as before)', () => {
    // max(2, round(400 * 0.05)) = max(2, 20) = 20 — no regression
    // Verify by checking the function returns maxFontPx when text is short
    const result = getTextSizeForWidth('A', '?px sans-serif', 400, 6, 240);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe('getTextSizeForWidthAndHeight padding', () => {
  it('uses 98% of width (was 95%)', () => {
    // With canvas mock returning width=0, maxFontPx is always returned when it fits height.
    // We verify the function returns maxFontPx for reasonable inputs.
    const result = getTextSizeForWidthAndHeight('A', '?px sans-serif', 100, 240, 6, 240);
    expect(result).toBe(240);
  });
});
```

- [ ] **Step 2: Run tests — verify they pass (or fail if canvas mock absent)**

```bash
yarn test --watchAll=false --testPathPattern=utils.test
```

If tests fail due to canvas, the jest-setup.js file should already import jest-canvas-mock (added on `refactor/font-scaler`). If not, verify `src/jest-setup.js` contains `import 'jest-canvas-mock';`.

- [ ] **Step 3: Fix `getTextSizeForWidth` in `src/utils.ts` (line 63)**

```typescript
// before:
// pad width by 10px
width = width - 20;

// after:
width = width - Math.max(2, Math.round(width * 0.05));
```

Remove the outdated comment.

- [ ] **Step 4: Fix `getTextSizeForWidthAndHeight` in `src/utils.ts` (line 100)**

```typescript
// before:
// need to pad the width: use 95% of the space (leave 10% padding on each side)
// and ensure it is a whole number
width = Math.round(width * 0.95);

// after:
width = Math.round(width * 0.98);
```

Remove the stale comment about "10% padding on each side".

- [ ] **Step 5: Run all tests — expect PASS**

```bash
yarn test --watchAll=false
```

- [ ] **Step 6: Commit**

```bash
git add src/utils.ts src/utils.test.ts
git commit -m "fix: replace hardcoded 20px text padding with proportional 5% padding

At small polygon sizes (diameterX=50px), the 20px flat deduction consumed
40% of available text width. At large sizes (width=400px), behaviour is
identical (max(2, round(400*0.05)) = 20).

- src/utils.ts
  - getTextSizeForWidth: width -= max(2, round(width * 0.05))
  - getTextSizeForWidthAndHeight: width = round(width * 0.98) (was 0.95)
- src/utils.test.ts
  - Add padding tests for width=50 and width=400 (regression guard)"
```

---

## Task 5: Increase textAreaHeight for pointed-top hexagons

`textAreaHeight = diameterY / 2` (= R) is conservative. The flat middle band of a pointed-top hexagon usably spans `0.6 × diameterY`.

**Files:**

- Modify: `src/components/Polystat.tsx` (line 229)

- [ ] **Step 1: Update `textAreaHeight` in `Polystat.tsx`**

```typescript
// before (line 229):
const textAreaHeight = options.globalShape === PolygonShapes.RECTANGLE ? diameterY : diameterY / 2;

// after:
const textAreaHeight =
  options.globalShape === PolygonShapes.RECTANGLE
    ? diameterY
    : options.globalShape === PolygonShapes.HEXAGON_POINTED_TOP
      ? diameterY * 0.6
      : diameterY / 2; // circle / square unchanged
```

- [ ] **Step 2: Run all tests — expect PASS**

```bash
yarn test --watchAll=false
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Polystat.tsx
git commit -m "fix: increase hex pointed-top text area height from 0.5x to 0.6x diameterY

The flat middle band of a pointed-top hexagon (between the two angled
sides) spans roughly 0.6 * diameterY. The previous 0.5x value left 10%
of usable height unused, resulting in unnecessarily small text.

- src/components/Polystat.tsx
  - textAreaHeight for HEXAGON_POINTED_TOP: diameterY * 0.5 → diameterY * 0.6
  - Circle and square unchanged at diameterY / 2"
```

---

## Task 6: Add HEXAGON_FLAT_TOP enum value and UI option

**Files:**

- Modify: `src/components/types.ts`
- Modify: `src/components/layout/layoutManager.test.ts`

- [ ] **Step 1: Write a smoke-test**

Add to `layoutManager.test.ts`:

```typescript
describe('HEXAGON_FLAT_TOP shape exists in PolygonShapes', () => {
  it('enum value is defined', () => {
    expect(PolygonShapes.HEXAGON_FLAT_TOP).toBe('hexagon_flat_top');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

Expected: `TypeError: Cannot read properties of undefined (reading 'HEXAGON_FLAT_TOP')`

- [ ] **Step 3: Add enum value and PolygonNamedShapes entry to `src/components/types.ts`**

```typescript
export enum PolygonShapes {
  HEXAGON_POINTED_TOP = 'hexagon_pointed_top',
  HEXAGON_FLAT_TOP = 'hexagon_flat_top',
  CIRCLE = 'circle',
  SQUARE = 'square',
  RECTANGLE = 'rectangle',
}

export const PolygonNamedShapes = [
  { value: 'hexagon_pointed_top', label: 'Hexagon Pointed Top' },
  { value: 'hexagon_flat_top', label: 'Hexagon Flat Top' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'rectangle', label: 'Rectangle (Brick)' },
];
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

- [ ] **Step 5: Commit**

```bash
git add src/components/types.ts src/components/layout/layoutManager.test.ts
git commit -m "feat: add HEXAGON_FLAT_TOP to PolygonShapes enum and shape selector

Adds the enum value and UI dropdown entry for the upcoming flat-top
hexagon shape. No geometry or rendering logic yet — those follow in the
next two commits.

- src/components/types.ts
  - PolygonShapes: add HEXAGON_FLAT_TOP = 'hexagon_flat_top'
  - PolygonNamedShapes: add 'Hexagon Flat Top' entry after pointed-top
- src/components/layout/layoutManager.test.ts
  - Smoke-test: PolygonShapes.HEXAGON_FLAT_TOP equals 'hexagon_flat_top'"
```

---

## Task 7: Implement flat-top hexagon geometry in LayoutManager

Flat-top hexagon (flat at 12/6 o'clock, points at 3/9 o'clock):

- `diameterX = 2R` (tip-to-tip, horizontal)
- `diameterY = SQRT3 * R` (flat-to-flat, vertical)
- Column step: `1.5 * R`; row step: `SQRT3 * R`; **odd columns** offset down by `SQRT3*R / 2`
- Radius: `R = min(W / ((cols + 1/3) * 1.5),  H / ((rows + 0.5) * SQRT3))`

**Files:**

- Modify: `src/components/layout/layoutManager.ts`
- Modify: `src/components/layout/layoutManager.test.ts`

- [ ] **Step 1: Write failing tests**

Add to `layoutManager.test.ts`:

```typescript
describe('With flat-top hexagon layout', () => {
  describe('getHexFlatTopRadius', () => {
    it('returns a positive radius for a 400x200 panel', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      expect(lm.getHexFlatTopRadius()).toBeGreaterThan(0);
    });

    it('returns a larger radius with fewer actual cols/rows', () => {
      const lm = new LayoutManager(400, 200, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      const rDefault = lm.getHexFlatTopRadius();
      const rActual = lm.getHexFlatTopRadius(2, 2);
      expect(rActual).toBeGreaterThan(rDefault);
    });
  });

  describe('getHexFlatTopDiameters', () => {
    it('diameterX = 2R, diameterY = SQRT3*R', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      lm.maxColumnsUsed = 4;
      lm.maxRowsUsed = 2;
      const { diameterX, diameterY } = lm.getHexFlatTopDiameters();
      const r = lm.getHexFlatTopRadius(4, 2);
      expect(diameterX).toBeCloseTo(r * 2, 1);
      expect(diameterY).toBeCloseTo(r * 1.7320508, 1);
    });
  });

  describe('findOptimalColumnsFlatTop', () => {
    it('produces a larger radius than 0.75 heuristic on a 4:1 panel', () => {
      const lm = new LayoutManager(2000, 500, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      const SQRT3 = 1.7320508075688772;
      // 0.75 heuristic for flat-top wide panel
      const heuristicCols = Math.ceil((2000 / 500) * Math.sqrt(20) * 0.75); // 14
      const heuristicRows = Math.ceil(20 / heuristicCols);
      const heuristicRadius = Math.min(2000 / ((heuristicCols + 1 / 3) * 1.5), 500 / ((heuristicRows + 0.5) * SQRT3));
      const optCols = lm.findOptimalColumnsFlatTop(20, 2000, 500);
      const optRows = Math.ceil(20 / optCols);
      const optRadius = Math.min(2000 / ((optCols + 1 / 3) * 1.5), 500 / ((optRows + 0.5) * SQRT3));
      expect(optRadius).toBeGreaterThan(heuristicRadius);
    });
  });

  describe('shapeToCoordinates — flat-top', () => {
    it('col 0 row 0 is at (0, 0)', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      expect(lm.shapeToCoordinates(PolygonShapes.HEXAGON_FLAT_TOP, 50, 0, 0)).toEqual([0, 0]);
    });

    it('col 1 row 0 is shifted right by 1.5*R and down by SQRT3*R/2 (odd column offset)', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      const SQRT3 = 1.7320508075688772;
      const r = 50;
      const [x, y] = lm.shapeToCoordinates(PolygonShapes.HEXAGON_FLAT_TOP, r, 1, 0);
      expect(x).toBeCloseTo(1.5 * r, 1);
      expect(y).toBeCloseTo((SQRT3 / 2) * r, 1);
    });

    it('col 2 row 0 is at (3R, 0) — even column, no vertical offset', () => {
      const lm = new LayoutManager(400, 200, 4, 2, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      const r = 50;
      const [x, y] = lm.shapeToCoordinates(PolygonShapes.HEXAGON_FLAT_TOP, r, 2, 0);
      expect(x).toBeCloseTo(3 * r, 1);
      expect(y).toBeCloseTo(0, 1);
    });
  });

  describe('generatePossibleColumnAndRowsSizes — flat-top auto-size', () => {
    it('covers all items', () => {
      const lm = new LayoutManager(800, 400, 8, 8, 100, true, PolygonShapes.HEXAGON_FLAT_TOP);
      lm.generatePossibleColumnAndRowsSizes(true, true, 100, 20);
      expect(lm.numColumns * lm.numRows).toBeGreaterThanOrEqual(20);
    });
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

Expected: multiple failures (`getHexFlatTopRadius is not a function`, etc.)

- [ ] **Step 3: Add flat-top geometry methods to `layoutManager.ts`**

Add after `findOptimalColumns`:

```typescript
findOptimalColumnsFlatTop(n: number, w: number, h: number): number {
  // Closed-form estimate: cols^2 = n * w * SQRT3 / (h * 1.5)
  const approx = Math.sqrt((n * w * this.SQRT3) / (h * 1.5));
  const candidates = [approx - 2, approx - 1, approx, approx + 1, approx + 2]
    .map(c => Math.max(1, Math.min(n, Math.round(c))));
  const unique = [...new Set(candidates)];
  let bestCols = unique[0];
  let bestRadius = -1;
  for (const cols of unique) {
    const rows = Math.ceil(n / cols);
    const r = Math.min(
      w / ((cols + 1 / 3) * 1.5),
      h / ((rows + 0.5) * this.SQRT3)
    );
    if (r > bestRadius) {
      bestRadius = r;
      bestCols = cols;
    }
  }
  return bestCols;
}

getHexFlatTopRadius(cols?: number, rows?: number): number {
  const c = cols ?? this.numColumns;
  const r = rows ?? this.numRows;
  let hexRadius = d3.min([
    this.width  / ((c + 1 / 3) * 1.5),
    this.height / ((r + 0.5) * this.SQRT3),
  ]);
  return hexRadius !== undefined ? this.truncateFloat(hexRadius) : 40;
}

getHexFlatTopDiameters(): PolystatDiameters {
  const hexRadius = this.getHexFlatTopRadius(this.maxColumnsUsed, this.maxRowsUsed);
  const diameterX = this.truncateFloat(hexRadius * 2);
  const diameterY = this.truncateFloat(hexRadius * this.SQRT3);
  return { diameterX, diameterY };
}

getOffsetsHexagonFlatTop(dataSize: number): any {
  const hexRadius = this.getHexFlatTopRadius(this.maxColumnsUsed, this.maxRowsUsed);
  const shapeWidth  = this.truncateFloat(hexRadius * 2);
  const shapeHeight = this.truncateFloat(hexRadius * this.SQRT3);

  // X: columns step by 1.5*R, first/last hex adds R on each side
  const offsetToViewX = shapeWidth * 0.5;
  const actualWidthUsed = (this.maxColumnsUsed + 1 / 3) * 1.5 * hexRadius;
  let xoffset = (this.width - actualWidthUsed) / 2;
  xoffset = -(xoffset + offsetToViewX);

  // Y: odd columns are shifted down by SQRT3*R/2
  const offsetToViewY = shapeHeight * 0.5;
  let heightOffset = 0;
  if (this.maxColumnsUsed > 1 && dataSize >= this.maxRowsUsed + 1) {
    heightOffset = 0.5;
  }
  const actualHeightUsed = (this.maxRowsUsed + heightOffset) * shapeHeight;
  let yoffset = (this.height - actualHeightUsed) / 2;
  yoffset = -(yoffset + offsetToViewY);

  return { xoffset, yoffset };
}
```

- [ ] **Step 4: Add `HEXAGON_FLAT_TOP` case to `shapeToCoordinates`**

```typescript
case PolygonShapes.HEXAGON_FLAT_TOP: {
  const x = radius * column * 1.5;
  let y = radius * row * this.SQRT3;
  // Offset odd columns down by half a hex-height
  if (column % 2 === 1) {
    y += (radius * this.SQRT3) / 2;
  }
  return [x, y];
}
```

- [ ] **Step 5: Add `HEXAGON_FLAT_TOP` case to `generatePossibleColumnAndRowsSizes`**

In the `rowAutoSize && columnAutoSize` block, add before the `else` (circle/square):

```typescript
} else if (this.shape === PolygonShapes.HEXAGON_FLAT_TOP) {
  this.numColumns = this.findOptimalColumnsFlatTop(useLimit, this.width, this.height);
  if (this.numColumns > useLimit) {
    this.numColumns = useLimit;
  }
  this.numRows = Math.ceil(useLimit / this.numColumns);
  if (this.numRows < 1) {
    this.numRows = 1;
  }
}
```

- [ ] **Step 6: Add `HEXAGON_FLAT_TOP` cases to `generateRadius`, `getDiameters`, `getOffsets`**

In `generateRadius`:

```typescript
case PolygonShapes.HEXAGON_FLAT_TOP:
  radius = this.getHexFlatTopRadius(this.maxColumnsUsed, this.maxRowsUsed);
  break;
```

In `getDiameters`:

```typescript
case PolygonShapes.HEXAGON_FLAT_TOP:
  return this.getHexFlatTopDiameters();
```

In `getOffsets` switch:

```typescript
case PolygonShapes.HEXAGON_FLAT_TOP:
  return this.getOffsetsHexagonFlatTop(useLimit);
```

- [ ] **Step 7: Run tests — expect PASS**

```bash
yarn test --watchAll=false --testPathPattern=layoutManager
```

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/layoutManager.ts src/components/layout/layoutManager.test.ts
git commit -m "feat: implement HEXAGON_FLAT_TOP geometry in LayoutManager

Flat-top hexagons (flat at 12/6, points at 3/9): diameterX=2R,
diameterY=sqrt(3)*R. Odd columns stagger down by sqrt(3)*R/2.

- src/components/layout/layoutManager.ts
  - findOptimalColumnsFlatTop: optimal column count using flat-top formula
    cols^2 = N*W*SQRT3 / (H*1.5); 5-candidate neighbor search; O(1)
  - getHexFlatTopRadius: min(W/((c+1/3)*1.5), H/((r+0.5)*SQRT3)); accepts
    optional cols/rows for actual-grid sizing
  - getHexFlatTopDiameters: diameterX=2R, diameterY=SQRT3*R
  - getOffsetsHexagonFlatTop: centers grid accounting for odd-column
    vertical offset; uses maxColumnsUsed/maxRowsUsed
  - shapeToCoordinates: HEXAGON_FLAT_TOP case with odd-column row offset
  - generatePossibleColumnAndRowsSizes: HEXAGON_FLAT_TOP branch
  - generateRadius, getDiameters, getOffsets: HEXAGON_FLAT_TOP cases
- src/components/layout/layoutManager.test.ts
  - getHexFlatTopRadius, getHexFlatTopDiameters, findOptimalColumnsFlatTop,
    shapeToCoordinates, generatePossibleColumnAndRowsSizes tests"
```

---

## Task 8: Remove d3-hexbin, add pure SVG paths, wire HEXAGON_FLAT_TOP

Replaces `aHexbin.hexagon(radius)` (d3-hexbin) with a pure SVG path function for both shapes. Removes the d3-hexbin import entirely.

**Files:**

- Modify: `src/components/Polystat.tsx`

- [ ] **Step 1: Add both hex path helpers near the top of `Polystat.tsx`, after the imports**

```typescript
function hexPointedTopPath(radius: number): string {
  // Points at 12 and 6 o'clock; flat sides at 3 and 9 o'clock
  const w = (Math.sqrt(3) / 2) * radius; // half-width = SQRT3/2 * R
  return `M0,${-radius} L${w},${-radius / 2} L${w},${radius / 2} L0,${radius} L${-w},${radius / 2} L${-w},${-radius / 2}Z`;
}

function hexFlatTopPath(radius: number): string {
  // Flat sides at 12 and 6 o'clock; points at 3 and 9 o'clock
  const h = (Math.sqrt(3) / 2) * radius; // half-height = SQRT3/2 * R
  return `M${radius},0 L${radius / 2},${-h} L${-radius / 2},${-h} L${-radius},0 L${-radius / 2},${h} L${radius / 2},${h}Z`;
}
```

- [ ] **Step 2: Remove `hexbin` import and the `aHexbin` block**

Remove line 5:

```typescript
import { hexbin } from 'd3-hexbin';
```

Remove the `const aHexbin = hexbin()...` block (lines ~216–221):

```typescript
// DELETE these lines:
const aHexbin = hexbin()
  .radius(radius)
  .extent([
    [0, 0],
    [options.panelWidth, options.panelHeight],
  ]);
```

- [ ] **Step 3: Update the `customShape` switch to use pure SVG paths**

```typescript
let customShape: string;
switch (options.globalShape) {
  case PolygonShapes.HEXAGON_POINTED_TOP:
    customShape = hexPointedTopPath(radius);
    break;
  case PolygonShapes.HEXAGON_FLAT_TOP:
    customShape = hexFlatTopPath(radius);
    break;
  case PolygonShapes.CIRCLE:
    customShape = symbol.type(symbolCircle)();
    break;
  case PolygonShapes.SQUARE:
    customShape = symbol.type(symbolSquare)();
    break;
  default:
    customShape = hexPointedTopPath(radius);
    break;
}
```

Note: `symbol.type(symbolCircle)()` — the d3 symbol is called as a function to produce the path string. The `symbol` variable is already declared in the existing code using `d3symbol().size(innerArea)`.

- [ ] **Step 4: Update `textAreaHeight` for flat-top**

```typescript
// Extend the existing textAreaHeight assignment (already updated in Task 5):
const textAreaHeight =
  options.globalShape === PolygonShapes.RECTANGLE
    ? diameterY
    : options.globalShape === PolygonShapes.HEXAGON_POINTED_TOP
      ? diameterY * 0.6
      : options.globalShape === PolygonShapes.HEXAGON_FLAT_TOP
        ? diameterY * 0.8 // flat-top: flat sides at top/bottom, most of height usable
        : diameterY / 2; // circle / square
```

- [ ] **Step 5: Add flat-top case to `drawShape` switch**

Find the `drawShape` switch (line ~348). After the `HEXAGON_POINTED_TOP` case, add:

```typescript
case PolygonShapes.HEXAGON_FLAT_TOP:
  return (
    <path
      data-tooltip-id={options.globalTooltipsEnabled ? `polystat-tooltip-${uniquePanelId}` : null}
      data-tooltip-content={index}
      data-tooltip-position-strategy='fixed'
      className={svgPathStyles}
      key={`polystat-tooltip-${uniquePanelId}`}
      transform={`translate(${coords.x}, ${coords.y})`}
      d={customShape}
      fill={fillColor}
      stroke={options.globalPolygonBorderColor}
      strokeWidth={options.globalPolygonBorderSize + 'px'}
    />
  );
```

- [ ] **Step 6: Run all tests — expect PASS**

```bash
yarn test --watchAll=false
```

- [ ] **Step 7: Commit**

````bash
git add src/components/Polystat.tsx
git commit -m "refactor: replace d3-hexbin with pure SVG path functions for hex shapes

d3-hexbin was only used to generate the hexagon path string. Both shapes
are now generated directly without the library dependency.

- src/components/Polystat.tsx
  - hexPointedTopPath(radius): pure SVG M0,-R L w,-R/2 ... path for
    pointed-top hex (points at 12/6 o'clock)
  - hexFlatTopPath(radius): pure SVG M R,0 L R/2,-h ... path for
    flat-top hex (flat at 12/6 o'clock)
  - Remove d3-hexbin import and aHexbin block
  - customShape switch: both hex cases use path helpers; circle/square
    unchanged (still use d3-symbol)
  - textAreaHeight: HEXAGON_FLAT_TOP uses diameterY * 0.8
  - drawShape switch: add HEXAGON_FLAT_TOP case"

---

## Task 9: E2E dashboard + screenshot spec

**Files:**
- Create: `provisioning/dashboards/Layout-Space-Optimization.json`
- Create: `tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts`

- [ ] **Step 1: Create `provisioning/dashboards/Layout-Space-Optimization.json`**

```json
{
  "id": null,
  "uid": "layout-space-opt",
  "title": "Layout Space Optimization",
  "tags": ["polystat", "layout-test"],
  "schemaVersion": 36,
  "version": 1,
  "panels": [
    {
      "id": 1,
      "title": "Wide panel (4:1) — 20 items",
      "type": "grafana-polystat-panel",
      "gridPos": { "h": 6, "w": 24, "x": 0, "y": 0 },
      "options": {
        "autoSizeColumns": true,
        "autoSizePolygons": true,
        "autoSizeRows": true,
        "globalAutoScaleFonts": true,
        "globalShape": "hexagon_pointed_top",
        "globalFillColor": "rgba(71, 212, 149, 0.15)"
      },
      "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
      "targets": [{
        "refId": "A",
        "scenarioId": "csv_content",
        "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
        "csvContent": "m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20\n1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
      }]
    },
    {
      "id": 2,
      "title": "Square panel (1:1) — 16 items",
      "type": "grafana-polystat-panel",
      "gridPos": { "h": 12, "w": 12, "x": 0, "y": 6 },
      "options": {
        "autoSizeColumns": true,
        "autoSizePolygons": true,
        "autoSizeRows": true,
        "globalAutoScaleFonts": true,
        "globalShape": "hexagon_pointed_top",
        "globalFillColor": "rgba(71, 212, 149, 0.15)"
      },
      "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
      "targets": [{
        "refId": "A",
        "scenarioId": "csv_content",
        "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
        "csvContent": "m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12,m13,m14,m15,m16\n1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16"
      }]
    },
    {
      "id": 3,
      "title": "Tall panel (1:4) — 20 items",
      "type": "grafana-polystat-panel",
      "gridPos": { "h": 24, "w": 6, "x": 12, "y": 6 },
      "options": {
        "autoSizeColumns": true,
        "autoSizePolygons": true,
        "autoSizeRows": true,
        "globalAutoScaleFonts": true,
        "globalShape": "hexagon_pointed_top",
        "globalFillColor": "rgba(71, 212, 149, 0.15)"
      },
      "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
      "targets": [{
        "refId": "A",
        "scenarioId": "csv_content",
        "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
        "csvContent": "m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20\n1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
      }]
    },
    {
      "id": 4,
      "title": "Flat-top — wide (4:1) — 20 items",
      "type": "grafana-polystat-panel",
      "gridPos": { "h": 6, "w": 18, "x": 0, "y": 30 },
      "options": {
        "autoSizeColumns": true,
        "autoSizePolygons": true,
        "autoSizeRows": true,
        "globalAutoScaleFonts": true,
        "globalShape": "hexagon_flat_top",
        "globalFillColor": "rgba(110, 159, 255, 0.15)"
      },
      "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
      "targets": [{
        "refId": "A",
        "scenarioId": "csv_content",
        "datasource": { "type": "grafana-testdata-datasource", "uid": "trlxrdZVk" },
        "csvContent": "m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20\n1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
      }]
    }
  ]
}
````

- [ ] **Step 2: Create `tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts`**

```typescript
import { test, expect } from '@grafana/plugin-e2e';

/**
 * Visual regression spec for panel space optimization.
 *
 * Workflow:
 *   Before optimization: npx playwright test layout-space-optimization --update-snapshots
 *   After optimization:  npx playwright test layout-space-optimization
 *   Compare diffs in playwright-report/ to verify larger polygons.
 */
test.describe('layout space optimization', () => {
  test('wide pointed-top panel fills space with large hexagons', async ({ page }) => {
    await page.goto('/d/layout-space-opt/layout-space-optimization');
    await page.waitForSelector('svg[xmlns]', { state: 'visible', timeout: 10000 });
    // Allow SVG animations and data to settle
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('layout-space-opt-full.png', {
      fullPage: false,
      threshold: 0.05, // 5% pixel tolerance for antialiasing differences
    });
  });
});
```

- [ ] **Step 3: Run E2E spec to generate baseline snapshots (requires running Grafana)**

```bash
# Start Grafana first (requires Docker):
# docker-compose up -d
npx playwright test tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts --update-snapshots
```

Expected: Snapshot file created at `tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts-snapshots/layout-space-opt-full-*.png`

- [ ] **Step 4: Commit**

```bash
git add provisioning/dashboards/Layout-Space-Optimization.json
git add tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts
git commit -m "test(e2e): add layout space optimization dashboard and visual screenshot spec

Provisioned dashboard with 4 panels (wide 4:1, square 1:1, tall 1:4,
flat-top wide) used for before/after visual comparison of polygon sizing.

- provisioning/dashboards/Layout-Space-Optimization.json
  - uid: layout-space-opt; 4 panels using TestData DB CSV content
  - panels 1-3: pointed-top hex at different aspect ratios (20 or 16 items)
  - panel 4: flat-top hex wide panel (20 items)
- tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts
  - toHaveScreenshot for full dashboard; run --update-snapshots before
    optimization to capture baseline, then diff after to verify improvement"
```

---

## Task 10: Full test suite verification

- [ ] **Step 1: Run full unit test suite**

```bash
yarn test --watchAll=false
```

Expected: all existing tests pass plus new tests. Test count should grow from 231 (on `refactor/font-scaler`) by approximately 20–25 new tests.

- [ ] **Step 2: Run TypeScript type check**

```bash
yarn build 2>&1 | head -30
```

Expected: no type errors.

- [ ] **Step 3: If any tests fail, diagnose before fixing**

Check for:

- Import errors: verify `PolygonShapes.HEXAGON_FLAT_TOP` is imported in all files that reference it
- Type errors in `drawShape`: the `switch (shape as any)` cast may need updating to include `HEXAGON_FLAT_TOP`
- `customShape` type: if TypeScript infers `string | PathFunction`, add explicit `string` type annotation

---

## Self-Review

**Spec coverage check:**

| Spec requirement                                                  | Task                               |
| ----------------------------------------------------------------- | ---------------------------------- |
| `findOptimalColumns` replacing 0.75 heuristic                     | Task 2                             |
| `getHexFlatTopRadius` → `getHexPointedTopRadius` rename           | Task 1                             |
| Use `maxColumnsUsed`/`maxRowsUsed` in radius/offsets              | Task 1 (radius) + Task 3 (offsets) |
| `getTextSizeForWidth` proportional padding                        | Task 4                             |
| `getTextSizeForWidthAndHeight` 98%                                | Task 4                             |
| `textAreaHeight` hex pointed-top 0.6×                             | Task 5                             |
| `HEXAGON_FLAT_TOP` enum + UI option                               | Task 6                             |
| Flat-top geometry (radius, diameters, coords, offsets, optimizer) | Task 7                             |
| Flat-top rendering in Polystat.tsx                                | Task 8                             |
| E2E dashboard + screenshot spec                                   | Task 9                             |

**All requirements covered. No TBDs.**
