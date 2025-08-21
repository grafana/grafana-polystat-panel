# Grafana Polystat Panel

[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fgrafana-polystat-panel)](https://grafana.com/grafana/plugins/grafana-polystat-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fgrafana-polystat-panel)](https://grafana.com/grafana/plugins/grafana-polystat-panel)
[![License](https://img.shields.io/github/license/grafana/grafana-polystat-panel)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/grafana/grafana-polystat-panel/badge.svg)](https://snyk.io/test/github/grafana/grafana-polystat-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/5c5cd1076777c637b931/maintainability)](https://codeclimate.com/github/grafana/grafana-polystat-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5c5cd1076777c637b931/test_coverage)](https://codeclimate.com/github/grafana/grafana-polystat-panel/test_coverage)
[![Build Status](https://drone.grafana.net/api/badges/grafana/grafana-polystat-panel/status.svg)](https://drone.grafana.net/grafana/grafana-polystat-panel)

The Polystat panel plugin provides a [D3-based](http://www.d3js.org) multi-stat panel for [Grafana](https://grafana.com/) 8.4 or later. 

This plugin creates an hexagon for each metric received, and allows you to group metrics into a composite metric and display the triggered state of the composite. The plugin supports autoscaling for best-fit sizing of each polygon to the panel size. When the complete text cannot be displayed, only tooltips are active.

See the following examples:

**All visible**

![polystat-v2-agent-all-visible](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-all-visible.png)

**Scaled down**

![polystat-v2-agent-scaled-down](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-scaled-down.png)

**Scaled down with tooltip**

![polystat-v2-agent-scaled-down-tooltip](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-scaled-down-tooltip.png)

## Settings and options

This panel provides a large number of settings customization options, and are searchable from the menu. For more info, see [General settings](docs/Polystat-docs-settings.md) and [Options](docs/Polystat-docs-options.md).

### Clickthrough URLs

Use this setting to indicate the URL to open when clicking the polygon. Find more information in [Use Clickthrough URLs](docs/Polystat-docs-clickthroughurl.md).

## Set thresholds

This plugin supports "ranged" states. See how to [Set thresholds](docs/Polystat-docs-thresholds.md).

## Overrides

Use overrides to apply additional rendering options for metrics, including custom thresholds and clickthroughs. [Learn more](docs/Polystat-docs-overrides.md).

## Composites

Composites allow you to combine multiple metrics into a single representation that reflects the "worst" state of the metrics combined. See how at [Composites](docs/Polystat-docs-composites.md).

## Value mappings

This is a built-in option in Grafana and behaves as documented in [Configure value mappings](https://grafana.com/docs/grafana/latest/panels/configure-value-mappings/).

Note that color assignments are ignored, and only threshold colors are applied.

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
