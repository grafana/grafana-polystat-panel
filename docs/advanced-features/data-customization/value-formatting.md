---
title: Value Formatting
description: Control how metric values are formatted and displayed in the Polystat panel.
sidebar_position: 2
keywords:
  - formatting
  - values
  - units
  - decimals
  - display
---

# Value Formatting

Control how metric values are formatted and displayed to ensure clarity and consistency across your monitoring dashboards.

## Formatting options

The Polystat panel provides several ways to format metric values:

- **Units** - Apply standard units (bytes, percent, throughput, etc.) with automatic suffix formatting
- **Decimals** - Limit decimal precision to improve readability
- **Prefix/Suffix** - Add custom text before or after values
- **Statistics** - Choose which statistic to display (last, mean, max, min, etc.)

## Using overrides for formatting

You can apply different formatting rules to different metrics using overrides. This is useful when monitoring heterogeneous systems where different metrics require different units or precision levels.

For example, you might display:
- Memory metrics in bytes with 2 decimal places
- Percentage metrics with 1 decimal place
- Count metrics with no decimals

See the Overrides section for detailed information on applying metric-specific formatting.
