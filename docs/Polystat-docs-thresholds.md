# Use thresholds 

This plugin supports "ranged" states.

Thresholds are expected to be sorted by ascending value, where

```TEXT
T0 = lowest decimal value, any state
TN = highest decimal value, any state
```
The initial state is set to "ok".

A comparison is made using "greater than or equal to" against the value:

`If value >= thresholdValue state = X`

Comparisons are made in reverse order, using the range between the Nth (inclusive) threshold and N+1 (exclusive):

```TEXT
  InclusiveValue = T(n).value
  ExclusiveValue = T(n+1).value
```

## Examples

If there isn't any `n+1` threshold and the highest value is T(n), a simple inclusive >= comparison is made:

**Example 1: Typical linear**

```TEXT
    T0 - 5, ok
    T1 - 10, warning
    T2 - 20, critical
```

```TEXT
  Value >= 20 (Value >= T2)
  10 <= Value < 20  (T1 <= Value < T2)
  5 <= Value < 10   (T0 <= Value < T1)
```

**Example 2: Reverse linear**

```TEXT
    T0 - 50, critical
    T1 - 90, warning
    T2 - 100, ok
```

```TEXT
  Value >= 100
  90 <= value < 100
  50 <= value < 90
```

**Example 3: Bounded**

```TEXT
    T0 - 50, critical
    T1 - 60, warning
    T2 - 70, ok
    T3 - 80, warning
    T4 - 90, critical
```

```TEXT
    Value >= 90
    80 <= Value < 90
    70 <= Value < 80
    60 <= Value < 70
    50 <= Value < 60
```

The "worst" state is returned after checking every threshold range.

