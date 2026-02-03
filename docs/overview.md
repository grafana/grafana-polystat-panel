---
title: Polystat Panel
description: The Polystat panel plugin provides a D3-based multi-stat panel for Grafana dashboards.
keywords:
  - polystat
  - panel
  - multi-stat
  - visualization
  - hexagon
  - composites
---

# Grafana Polystat Panel

The Polystat panel plugin provides a [D3-based](http://www.d3js.org) multi-stat panel for [Grafana](https://grafana.com/).

This plugin creates an hexagon for each metric received, and allows you to group metrics into a composite metric and display the triggered state of the composite. The plugin supports autoscaling for best-fit sizing of each polygon to the panel size. When the complete text cannot be displayed, only tooltips are active.

See the following examples:

**All visible**

![polystat-v2-agent-all-visible](assets/overview/polystat-v2-agent-all-visible.png)

**Scaled down**

![polystat-v2-agent-scaled-down](assets/overview/polystat-v2-agent-scaled-down.png)

**Scaled down with tooltip**

![polystat-v2-agent-scaled-down-tooltip](assets/overview/polystat-v2-agent-scaled-down-tooltip.png)

## Settings and options

This panel provides a large number of settings customization options, and are searchable from the menu. For more info, see Global Settings and Options.

### Clickthrough URLs

Use this setting to indicate the URL to open when clicking the polygon. Find more information in Use Clickthrough URLs.

## Set thresholds

This plugin supports "ranged" states. See how to Set thresholds.

## Overrides

Use overrides to apply additional rendering options for metrics, including custom thresholds and clickthroughs. Learn more about Overrides.

## Composites

Composites allow you to combine multiple metrics into a single representation that reflects the "worst" state of the metrics combined. See how at Composites.

## Value mappings

This is a built-in option in Grafana and behaves as documented in [Configure value mappings](https://grafana.com/docs/grafana/latest/panels/configure-value-mappings/).

Note that color assignments are ignored, and only threshold colors are applied.

## Build the plugin

This plugin relies on the [Plugin Tools](https://github.com/grafana/plugin-tools) typical build sequence:

```bash
yarn install
yarn build
```

The code is parsed and copied into "dist" if "tslint" passes without errors.

For development, you can run:

```bash
yarn dev
```

### Docker Support

The plugin includes a `docker-compose.yml` file for development and testing.

To use it run:

```bash
docker-compose up
```

Then browse to <http://localhost:3000>

### Enable Grafana TestData

`Grafana TestData` is not enabled by default.

To enable it, navigate to the Plugins section in your Grafana main menu. Click the Apps tabs in the Plugins section and select the Grafana TestData App. Alternatively navigate directly to <http://your_grafana_instance/plugins/testdata/edit>. Finally click the enable button to enable.

## Acknowledgements

This panel is based on this D3 example:

* <https://www.visualcinnamon.com/2013/07/self-organizing-maps-creating-hexagonal.html>

Many thanks to contributors:

* Mathieu Rollet (matletix)
* Mattias Jiderhamn (mjiderhamn)
* AnushaBoggarapu
* KamalakarGoretta
* Rene Hennig (renehennig)
* Hamza Ziyani (HZiyani)

and many others!
