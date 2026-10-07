---
title: Clickthrough URLs
description: Open a URL or drill-down dashboard when you click a polygon, built from metric names, values and template variables.
sidebar_position: 5
---

A clickthrough URL opens when you click a polygon. You can set one in three places, and the most specific one wins:

1. The **Clickthrough URL** on a [composite](./options/composites.md), for that composite's polygon.
2. The **Clickthrough URL** on an [override](./options/overrides.md), for the metrics it matches.
3. The **Default Clickthrough** under [Global options](./options/global.md), for every other polygon.

Each place has the same companion options:

- **Sanitize URL**: Usually enabled, to prevent malicious data entry.
- **Open URL In New Tab**: Opens the URL in a new tab. Turn this off for drill-down dashboards.
- **Enable Custom URL Target**: Lets you set a custom value for the `target` attribute of the link. This option is only visible when **Open URL In New Tab** is off.
- **Custom URL Target**: The value for the `target` attribute. Typical values are `_blank`, `_self`, `_parent` and `_top`.

## Use regular expression capture groups

You can build URLs from the capture groups of an override's **Metric/RegEx**.

For example, with these metrics:

```text
hera_memutil
plex_memutil
```

And this regular expression on the override:

```text
/(.*)_mem/
```

You can use the capture group `$1` in the URL:

```text
/dashboard/detail-dash?var-HOSTNAME=$1
```

For the `hera_memutil` polygon, the final URL is `https://myserver/dashboard/detail-dash?var-HOSTNAME=hera`.

Named capture groups work too. To expand the group `A_HOST`, use:

- Regular expression: `/TEMP_(?<A_HOST>.*)_/`
- Clickthrough URL: `/grafana/d/eCLHPr57k/drilldown?orgId=1&var-host=${A_HOST}`

## Use dashboard template variables

Template variables are available in every clickthrough URL with the `${varname}` syntax. To pass a variable to another dashboard, append `var-VARNAME=value` to the URL:

```text
/dashboard/xyz?var-VARNAME=${VARNAME}
```

## Use Polystat variables

Polystat provides variables that reference the polygon you clicked. For example, this drill-down URL passes the polygon name to another dashboard:

```text
dashboard/db/drilldown?var-HOSTNAME=${__cell_name}
```

The panel applies the global **Sorting** settings and global filters before it resolves these variables.

### Single metric variables

| Variable          | Resolves to                       |
| ----------------- | --------------------------------- |
| `${__cell_name}`  | The metric name                   |
| `${__cell}`       | The metric value                  |
| `${__cell:raw}`   | The metric value without encoding |

### Composite metric variables

| Variable              | Resolves to                                      |
| --------------------- | ------------------------------------------------ |
| `${__composite_name}` | The composite name                               |
| `${__cell_name_n}`    | The name of member metric `n`                    |
| `${__cell_n}`         | The value of member metric `n`                   |
| `${__cell_n:raw}`     | The value of member metric `n` without encoding  |

By default, the panel URI-encodes values. Use the `:raw` form to turn encoding off.
