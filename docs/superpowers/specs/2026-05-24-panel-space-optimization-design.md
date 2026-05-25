# Panel Space Optimization — Design Spec

**Date:** 2026-05-24  
**Branch:** stacks on `refactor/font-scaler` (PR #545)  
**Scope:** Hexagon shape only (primary default shape)

---

## Problem

Three layers of wasted space compound to produce undersized polygons and undersized text:

1. **Column/row heuristic** — `generatePossibleColumnAndRowsSizes` uses `(W/H) * sqrt(N) * 0.75` to pick column count. For wide panels (W/H=4, N=20) this produces 14 columns vs an optimal ~10, shrinking hexagon radius by ~25%.

2. **Hex radius uses possible grid, not actual grid** — `getHexFlatTopRadius` uses `this.numColumns`/`this.numRows` (user-specified or heuristic). When manual settings exceed actual data, radius is constrained by empty slots.

3. **Text padding is oversized** — `getTextSizeForWidth` subtracts a hardcoded 20px (40% waste at diameterX=50px). `getTextSizeForWidthAndHeight` uses 95% of width. `textAreaHeight` for hexagons is `diameterY * 0.5` (conservative).

---

## Approach: Full Iterative Optimizer (Approach C)

### 1. `findOptimalColumns` helper (`layoutManager.ts`)

Replace the `0.75` heuristic with a mathematically derived starting estimate plus a 5-candidate neighbor search:

```typescript
private findOptimalColumns(n: number, w: number, h: number): number {
  // Closed-form estimate: equates width and height hex constraints
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
    if (r > bestRadius) { bestRadius = r; bestCols = cols; }
  }
  return bestCols;
}
```

**Complexity:** O(1) — always exactly 5 candidates regardless of N.

`generatePossibleColumnAndRowsSizes` calls `findOptimalColumns` for the `rowAutoSize && columnAutoSize` hexagon path, replacing both the wide-panel and tall-panel `0.75` branches. The RECTANGLE shape keeps its existing area-fill formula.

### 2. Hex radius uses actual grid (`layoutManager.ts`)

`getHexFlatTopRadius` gains optional `cols`/`rows` parameters:

```typescript
getHexFlatTopRadius(cols?: number, rows?: number): number {
  const c = cols ?? this.numColumns;
  const r = rows ?? this.numRows;
  let hexRadius = d3.min([
    this.width  / ((c + 0.5) * this.SQRT3),
    this.height / ((r + 1 / 3) * 1.5),
  ]);
  return hexRadius !== undefined ? this.truncateFloat(hexRadius) : 40;
}
```

`generateRadius()` and `getHexFlatTopDiameters()` pass `this.maxColumnsUsed, this.maxRowsUsed` after both generate steps complete. Offset code updated similarly. Default (no args) behavior unchanged — no breaking change for callers.

### 3. Text padding fixes (`utils.ts`, `Polystat.tsx`)

**`getTextSizeForWidth` (`utils.ts:63`):**

```typescript
// before: width = width - 20;
width = width - Math.max(2, Math.round(width * 0.05));
```

Proportional 5% padding; min 2px. Regression-neutral at width=400 (still 20px).

**`getTextSizeForWidthAndHeight` (`utils.ts:100`):**

```typescript
// before: width = Math.round(width * 0.95);
width = Math.round(width * 0.98);
```

Tightens to 2% padding.

**`textAreaHeight` for hexagons (`Polystat.tsx:220`):**

```typescript
const textAreaHeight =
  options.globalShape === PolygonShapes.RECTANGLE
    ? diameterY
    : options.globalShape === PolygonShapes.HEXAGON_POINTED_TOP
      ? diameterY * 0.6 // was 0.5 — uses more of the flat middle band
      : diameterY / 2; // circle/square unchanged
```

---

## Files Changed

| File                                          | Change                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/layout/layoutManager.ts`      | Add `findOptimalColumns`; update `getHexFlatTopRadius` signature; pass `maxColumnsUsed`/`maxRowsUsed` in radius/diameter/offset calls |
| `src/utils.ts`                                | Proportional padding in `getTextSizeForWidth`; 98% width in `getTextSizeForWidthAndHeight`                                            |
| `src/components/Polystat.tsx`                 | `textAreaHeight` hex factor 0.5 → 0.6                                                                                                 |
| `src/components/layout/layoutManager.test.ts` | Before/after radius tests, optimizer correctness, sparse grid                                                                         |
| `src/utils.test.ts`                           | Padding regression tests                                                                                                              |

---

## Testing

### `layoutManager.test.ts` — optimizer correctness

- `findOptimalColumns(20, 2000, 500)` → cols ≈ 10, radius ≥ 100 (vs old radius 79.6)
- `findOptimalColumns(20, 500, 2000)` → correct tall-panel result
- Before/after radius comparison for (800×400, 2000×500, 400×800, 800×800) — assert new ≥ old
- Edge cases: N=1, N=100, W=H (square panel)

### `layoutManager.test.ts` — actual grid radius

- Manual cols=8, rows=8, data=4 → radius uses maxColumnsUsed=4 not numColumns=8
- `getHexFlatTopRadius(4, 2)` > `getHexFlatTopRadius(8, 8)` for same panel

### `utils.test.ts` — text padding

- Width=50: padding = `max(2, round(50*0.05))` = 3, not 20
- Width=400: padding = `round(400*0.05)` = 20 — no regression
- `getTextSizeForWidthAndHeight` at 98% returns same or larger font than at 95%

---

## E2E Visual Comparison

A provisioned dashboard plus Playwright spec enables before/after screenshot comparison.

### Dashboard (`provisioning/dashboards/Layout-Space-Optimization.json`)

Four panels using the TestData DB (CSV datasource), each with a distinct aspect ratio and item count to stress the optimizer:

| Panel        | Dimensions | Items       | Purpose                                         |
| ------------ | ---------- | ----------- | ----------------------------------------------- |
| Wide panel   | 4:1        | 20 hexagons | Primary regression target — 0.75 bug worst here |
| Square panel | 1:1        | 16 hexagons | Baseline — should see no change or slight gain  |
| Tall panel   | 1:4        | 20 hexagons | Verify tall-panel branch also improved          |
| Single item  | any        | 1 hexagon   | Edge case — should fill panel entirely          |

All panels use `autoSizePolygons: true`, `autoSizeColumns: true`, `autoSizeRows: true`, shape = hexagon pointed top.

### Test file (`tests/auth-bypassed/phase3-panel/layout-space-optimization.spec.ts`)

```typescript
import { expect, test } from '@grafana/plugin-e2e';

test.describe('layout space optimization', () => {
  test('wide panel maximizes hex radius', async ({ page, gotoDashboardPage }) => {
    const dashboard = await gotoDashboardPage({ uid: 'layout-space-opt' });
    await expect(page).toHaveScreenshot('wide-panel.png', { fullPage: false });
  });
  // ... one test.step per panel
});
```

Uses `@grafana/plugin-e2e`'s `gotoDashboardPage` (existing project pattern). Screenshots stored in `tests/auth-bypassed/phase3-panel/__screenshots__/`.

### Workflow

1. Run on `refactor/font-scaler` (pre-optimization) → `npx playwright test --update-snapshots` → captures baselines
2. Implement optimization on new branch
3. Run `npx playwright test` — diff highlights larger hexagons in each panel
4. Review diffs in `playwright-report/` visually before merging

---

## Non-Goals

- Circle/square shape optimization (separate PR if needed)
- Rectangle shape (already uses area-fill formula)
- Configurable padding (YAGNI)
