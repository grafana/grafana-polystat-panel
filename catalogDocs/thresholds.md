---
title: Thresholds
description: Learn how Polystat evaluates ranged thresholds to set the state and color of each polygon.
sidebar_position: 4
---

Polystat supports ranged states. Each threshold has a value, a state and a color, and the panel colors a polygon with the color of the state its value falls into. You set thresholds in two places:

- **Global Thresholds** under [Global options](./options/global.md) apply to every metric without a matching override.
- **Thresholds** on an [override](./options/overrides.md) replace the global thresholds for the metrics it matches.

Click **Add Threshold** to add one. The available states are `ok`, `warning`, `critical` and `custom`.

## How thresholds are evaluated

Thresholds are sorted by ascending value, where:

```text
T0 = lowest decimal value, any state
TN = highest decimal value, any state
```

The initial state is `ok`. The panel compares the value using "greater than or equal to":

```text
If value >= thresholdValue state = X
```

Comparisons run in reverse order, using the range between the Nth threshold (inclusive) and the N+1 threshold (exclusive):

```text
InclusiveValue = T(n).value
ExclusiveValue = T(n+1).value
```

When there is no N+1 threshold, the panel makes a single inclusive `>=` comparison against the highest threshold, T(n).

The panel returns the worst state after checking every threshold range. A composite takes the worst state of its member metrics.

When thresholds apply to a metric that has no value, the panel fills its polygon grey.

## Typical linear

```text
T0 - 5, ok
T1 - 10, warning
T2 - 20, critical
```

```text
Value >= 20         (Value >= T2)
10 <= Value < 20    (T1 <= Value < T2)
5 <= Value < 10     (T0 <= Value < T1)
```

## Reverse linear

```text
T0 - 50, critical
T1 - 90, warning
T2 - 100, ok
```

```text
Value >= 100
90 <= Value < 100
50 <= Value < 90
```

## Bounded

```text
T0 - 50, critical
T1 - 60, warning
T2 - 70, ok
T3 - 80, warning
T4 - 90, critical
```

```text
Value >= 90
80 <= Value < 90
70 <= Value < 80
60 <= Value < 70
50 <= Value < 60
```
