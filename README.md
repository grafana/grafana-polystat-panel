# Grafana Polystat Panel

[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fgrafana-polystat-panel)](https://grafana.com/grafana/plugins/grafana-polystat-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fgrafana-polystat-panel)](https://grafana.com/grafana/plugins/grafana-polystat-panel)
[![License](https://img.shields.io/github/license/grafana/grafana-polystat-panel)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/grafana/grafana-polystat-panel/badge.svg)](https://snyk.io/test/github/grafana/grafana-polystat-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/5c5cd1076777c637b931/maintainability)](https://codeclimate.com/github/grafana/grafana-polystat-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5c5cd1076777c637b931/test_coverage)](https://codeclimate.com/github/grafana/grafana-polystat-panel/test_coverage)

The Polystat panel plugin provides a [D3-based](http://www.d3js.org) multi-stat panel for [Grafana](https://grafana.com/) 9.5 or later.

This plugin creates an hexagon for each metric received, and allows you to group metrics into a composite metric and display the triggered state of the composite. The plugin supports autoscaling for best-fit sizing of each polygon to the panel size.

![polystat-v2-agent-all-visible](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-all-visible.png)

## Features

- One polygon per metric, sized for a best fit to the panel
- Hexagon, circle, square and rectangle shapes
- Ranged thresholds with `ok`, `warning`, `critical` and `custom` states
- Composites that roll several metrics up into one polygon showing their worst state
- Overrides that apply a different stat, unit, decimals or thresholds to metrics matching a regular expression
- Clickthrough URLs built from template variables, regular expression capture groups and polygon names and values
- Tooltips with primary and secondary sorting and a triggered-only mode
- Value mappings support
- Appears in the visualization suggestions list when the query result has numeric fields

## Documentation

For configuration guides, the full option reference and examples, refer to the [Polystat documentation](https://grafana.com/grafana/plugins/grafana-polystat-panel/docs/).

## Build the plugin

This plugin relies on the [Plugin Tools](https://github.com/grafana/plugin-tools) typical build sequence:

```BASH
yarn install
yarn build
```

The code is parsed and copied into "dist" if "tslint" passes without errors.

For development, you can run:

```BASH
yarn dev
```

### Docker Support

The plugin includes a `docker-compose.yml` file for development and testing.

To use it run:

```BASH
docker-compose up
```

Then browse to <http://localhost:3000>

## Enable Grafana TestData

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
