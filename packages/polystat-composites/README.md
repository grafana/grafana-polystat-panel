# @grafana/polystat-composites

Reusable composite domain package extracted from grafana-polystat-panel.

## Entry points

- `@grafana/polystat-composites/core`
- `@grafana/polystat-composites/editor`
- `@grafana/polystat-composites/migrations`

## Core usage

```ts
import { ApplyComposites, CompositeItemType } from '@grafana/polystat-composites/core';

const result = ApplyComposites(composites, series, replaceVariables, false, 'utc');
```

## Editor usage

```tsx
import { CompositeEditor } from '@grafana/polystat-composites/editor';
```

## Migration usage

```ts
import { migrateComposites } from '@grafana/polystat-composites/migrations';

const migrated = migrateComposites(panel, '2500');
```
