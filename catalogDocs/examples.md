---
title: Examples
description: Worked dashboard.json examples of the Polystat panel, from a basic setup to templated composites.
sidebar_position: 6
---

These examples come from the dashboards in the plugin repository's [provisioning folder](https://github.com/grafana/grafana-polystat-panel/tree/main/provisioning/dashboards). Each excerpt shows only `type`, the options that differ from the defaults and the `targets` it depends on. The queries use the TestData data source's **CSV Content** scenario, so you can paste them into any Grafana instance with TestData enabled.

## Basic example

Three queries, each returning one row of CPU, memory and disk usage for a cluster. With every option left at its default, Polystat draws one hexagon per value, nine in total, sized to fit the panel.

```json
{
  "type": "grafana-polystat-panel",
  "options": {},
  "targets": [
    {
      "refId": "A",
      "scenarioId": "csv_content",
      "csvContent": "ClusterA-CPU,ClusterA-MEM,ClusterA-DISK\n52,61.1,6.7"
    },
    {
      "refId": "B",
      "scenarioId": "csv_content",
      "csvContent": "ClusterB-CPU,ClusterB-MEM,ClusterB-DISK\n12.2,31.1,8.27"
    },
    {
      "refId": "C",
      "scenarioId": "csv_content",
      "csvContent": "ClusterC-CPU,ClusterC-MEM,ClusterC-DISK\n98.12,55.1,18.98"
    }
  ]
}
```

The full dashboard is [Tooltip-Composite-Bug.json](https://github.com/grafana/grafana-polystat-panel/blob/main/provisioning/dashboards/Tooltip-Composite-Bug.json), panel **Default View**.

## Common variations

### Roll metrics up into a composite

This variation adds a time field to the data and groups `cpu` and `memory` into one composite named `cluster-a`. The panel draws a single polygon that cycles between the two values and takes the worst state of either. **Show Members** is off, so the two metrics don't also appear as separate polygons.

```json
{
  "type": "grafana-polystat-panel",
  "options": {
    "compositeConfig": {
      "enabled": true,
      "animationSpeed": "1500",
      "composites": [
        {
          "name": "cluster-a",
          "label": "cluster-a",
          "enabled": true,
          "showComposite": true,
          "showName": true,
          "showValue": true,
          "showMembers": false,
          "displayMode": "all",
          "metrics": [
            { "seriesMatch": "^cpu$", "alias": "", "order": 0 },
            { "seriesMatch": "^memory$", "alias": "", "order": 1 }
          ]
        }
      ]
    }
  },
  "targets": [
    {
      "refId": "A",
      "scenarioId": "csv_content",
      "csvContent": "Time,cpu,memory\n1621987000000,42,73"
    }
  ]
}
```

The full dashboard is [Font-Scaling-Test.json](https://github.com/grafana/grafana-polystat-panel/blob/main/provisioning/dashboards/Font-Scaling-Test.json), panel **Composite value sizing**.

### Build composites from a template variable

This variation uses a multi-value dashboard variable, `cluster`, in both the composite name and its metric patterns. Because the composite name contains a template variable, the panel creates one composite for each selected cluster, each rolling up that cluster's CPU, memory and disk metrics. The data uses metric names such as `CPU-ClusterA` and `MEM-ClusterA`.

```json
{
  "type": "grafana-polystat-panel",
  "options": {
    "compositeConfig": {
      "enabled": true,
      "animationSpeed": "1500",
      "composites": [
        {
          "name": "${cluster}",
          "label": "Composite-0",
          "isTemplated": true,
          "enabled": true,
          "showComposite": true,
          "showName": true,
          "showValue": true,
          "showMembers": false,
          "displayMode": "all",
          "metrics": [
            { "seriesMatch": "^CPU-${cluster}$", "alias": "", "order": 0 },
            { "seriesMatch": "^MEM-${cluster}$", "alias": "", "order": 1 },
            { "seriesMatch": "^DISK-${cluster}$", "alias": "", "order": 2 }
          ]
        }
      ]
    }
  },
  "targets": [
    {
      "refId": "A",
      "scenarioId": "csv_content",
      "csvContent": "CPU-ClusterA,MEM-ClusterA,DISK-ClusterA\n52,61.1,6.7"
    },
    {
      "refId": "B",
      "scenarioId": "csv_content",
      "csvContent": "CPU-ClusterB,MEM-ClusterB,DISK-ClusterB\n12.2,31.1,8.27"
    }
  ]
}
```

The dashboard defines `cluster` as a multi-value custom variable with values such as `ClusterA` and `ClusterB`. The full dashboard is [Tooltip-Composite-Bug.json](https://github.com/grafana/grafana-polystat-panel/blob/main/provisioning/dashboards/Tooltip-Composite-Bug.json), panel **Templated**.
