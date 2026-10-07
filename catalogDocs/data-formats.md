---
title: Data formats
description: Learn how Polystat turns query results into polygons and which field types it reads.
sidebar_position: 2
---

Polystat draws one polygon per numeric value it finds in your query results. It doesn't ask you to pick fields: every numeric field in every returned data frame is a candidate, and the panel reduces each one to a single value with the selected **Stat**.

Polystat appears in the visualization suggestions list when the query result contains at least one numeric field.

## Supported data shape

Polystat accepts two shapes. Which one applies depends on whether a data frame contains a time field.

### Time series

When a data frame has a time field, each numeric field in that frame becomes one polygon. The panel reduces all the values in the field with the global **Stat** (default `Mean (avg)`) or the stat set by a matching override. The newest timestamp in the frame becomes the polygon's timestamp, which the panel shows when **Show Timestamp** is enabled.

Multiple queries, or a query that returns several series, produce one polygon per series.

#### Example

| Time                | cpu | memory |
| ------------------- | --- | ------ |
| 2026-10-07 10:00:00 | 41  | 70     |
| 2026-10-07 10:01:00 | 43  | 72     |
| 2026-10-07 10:02:00 | 42  | 73     |
| 2026-10-07 10:03:00 | 44  | 75     |

This frame renders two polygons, `cpu` and `memory`, each showing the mean of its column.

### Tables without a time field

When a data frame has no time field, Polystat treats it as wide or tabular data. Each non-null cell in a numeric field becomes its own polygon, and the values of the string fields in the same row attach to it as labels. The panel uses the current time as the timestamp for these polygons.

This is the shape that SQL queries and the TestData **CSV Content** scenario typically return.

#### Example

| host  | cpu  | memory |
| ----- | ---- | ------ |
| hera  | 52   | 61.1   |
| plex  | 12.2 | 31.1   |
| zeus  | 98.1 | 55.1   |
| atlas | 7.4  | 18.9   |

This frame renders eight polygons, one for each `cpu` and `memory` cell. The `host` value from each row attaches as a label, so polygons from different rows get distinct names.

## Field mapping

Field roles are fixed:

| Field type | Role                                                                                    |
| ---------- | --------------------------------------------------------------------------------------- |
| Number     | Each field (or each cell, for tables without a time field) becomes a polygon.           |
| Time       | Supplies the polygon timestamp. When absent, the panel uses the current time.           |
| String     | In tables without a time field, becomes a label on the polygons from the same row.      |

The polygon name is the field's display name. To shorten or rewrite names, use **Global Regex** under [Global options](./options/global.md#global-aliasing) or the **Alias** on a [composite](./options/composites.md) metric.
