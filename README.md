# Grafana Polystat Panel

[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22grafana-polystat-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/grafana-polystat-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22grafana-polystat-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/grafana-polystat-panel)
[![License](https://img.shields.io/github/license/grafana/grafana-polystat-panel)](LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/grafana/grafana-polystat-panel/badge.svg)](https://snyk.io/test/github/grafana/grafana-polystat-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/5c5cd1076777c637b931/maintainability)](https://codeclimate.com/github/grafana/grafana-polystat-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5c5cd1076777c637b931/test_coverage)](https://codeclimate.com/github/grafana/grafana-polystat-panel/test_coverage)
[![Build Status](https://drone.grafana.net/api/badges/grafana/grafana-polystat-panel/status.svg)](https://drone.grafana.net/grafana/grafana-polystat-panel)

This panel plugin provides a [D3-based](http://www.d3js.org) multistat panel for [Grafana](https://grafana.com/) 8.4+.

A hexagon is created for each metric received, with the ability to group metrics into a composite metric, and display the triggered state of the composite.

## Screenshots

This plugin supports autoscaling for best-fit sizing of each polygon to the panel size. When the complete text cannot be displayed, only tooltips are active.

### All visible

![polystat-v2-agent-all-visible](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-all-visible.png)

### Scaled down

![polystat-v2-agent-scaled-down](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-scaled-down.png)

### Scaled down with tooltip

![polystat-v2-agent-scaled-down-tooltip](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-agent-scaled-down-tooltip.png)

## Options

This panel provides a large number of customization options, and are searchable from the menu.

### Layout

By default the plugin with automatically size the polygons to be displayed using a "best fit" calculation based on the size of the panel.

![Auto Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-options-layout.png)

Alternatively, you can specify both the number of columnns and rows manually, or automated only one of them.

#### Columns

Max # of columns to create

#### Rows

Max # rows to create
NOTE: if both columns and rows are set, only `rows*columns` will be displayed, generally one or none should be set.

![Manual Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-layout-manual.png)

If there are not enough columns and rows to dispay all of the data, a warning will be displayed.

![Manual Layout Warning](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-layout-warning.png)

#### Display Limit

Sets a limit for the number of polygons to be displayed. Set this to `0` for no limit (the default value is 100).

### Sizing

The size of the polygon by default is calculated for a best-fit, but it can be manually set if needed.

This section also provides an option to set a border on each polygon (the default value is 2 pixels).

![Polygon Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sizing-auto.png)

Deselect the auto-size option to manually set a size.

![Polygon Border Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sizing-manual.png)

The size of the border for each polygon can be set in this section. The color used can be found in the "Global" section.

### Text

The plugin will attempt to display as much text as possible with the largest font possible across all polygons.
Both the color and the font size can be manually set.

![Polygon Auto Text Font Size](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-auto-all.png)

Uncheck "Auto Scale Fonts" to manually enter a font size.

![Polygon Manual Text Font Size](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-manual-fontsize.png)

Uncheck "Automate Font Color" to manually set the font color.  The automated option uses the current theme to pick a color, which may not be suitable for all cases.

![Polygon Text Manual Font Color](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-manual-font-color.png)

Manually Set Font Color with color picker

![Polygon Text Font Manual Color Picker](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-font-color-picker.png)

### Sorting

The order (left to right) of the displayed polygons can be set with the sort options.

![Sort Settings](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting.png)

The following directions are supported:

![Sorting Directions](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting-directions.png)

And the following fields:

![Sorting Fields](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/polystat-v2-sorting-fields.png)

### Tooltips

![Tooltips](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-all.png)

#### Enable/Disable Tooltip

Toggles displaying tooltips for the panel

#### Show Timestamp

Toggles display of the timestamp at the bottom of the tooltip

#### Display mode

You can choose to display only metrics that have triggered a threshold in the tooltip, or display all metrics. This is useful when there are many metrics rolled up into a composite.

![Tooltip Display Modes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-display-modes.png)

#### Tooltip - Non Triggered State Text

When there are no threshold violations, this text will be displayed in the tooltip instead of the metric value.  Leave blank if you want to show the value.

#### Tooltip Sorting

The following settings are used by *composites* when there are multiple metrics to be displayed.

Tooltips have a wider set of sort options to aid in displaying important data "at the top" of the tooltip. You can specify a field and direction to first sort by, plus a secondary field and direction.  You can also disable sorting if needed.

![Tooltip Sort Directions](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-sort-directions.png)

| Sort Direction                        |                                          |
|---------------------------------------|------------------------------------------|
| Disabled                              | No sorting is performed                  |
| Alphabetical (asc)                    | Ascending Alphabetical                   |
| Alphabetical (desc)                   | Descending Alphabetical                  |
| Numerical (asc)                       | Numerical Ascending                      |
| Numerical (descending)                | Numerical Descending                     |
| Alphabetical (case insensitive, asc)  | Case Insensitive Ascending Alphabetical  |
| Alphabetical (case insensitive, desc) | Case Insensitive Descending Alphabetical |

##### Primary Sorting

###### Primary Sort Direction (see above table)

The type of sort to be applied to the tooltip metrics.

###### Primary Sort By Field

Which field to sort by

![Tooltip Sort By Field](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-primary-sortby-field.png)

| Sort By Field   |                                        |
|-----------------|----------------------------------------|
| Name            | name of the field - after all aliasing |
| Threshold Level | from lowest to highest                 |
| Value           | raw value                              |

##### Secondary Sorting

The secondary sorting works in the same manner as primary sorting, but can be in a different direction using a different field/threshold/value. This is applied *after* primary sorting is performed.

###### Secondary Sort Direction (see above table)

###### Secondary Sort By Field

### Global

The following settings are available in the Global section, and are detailed below.

![Global](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-all.png)

#### Display Mode

You can choose to display only metrics that have triggered a threshold or display all metrics.

| Display Mode |                                                        |
|--------------|--------------------------------------------------------|
| All          | All polygons are displayed                             |
| Triggered    | Only polygons with a threshold triggered are displayed |

#### Global - Non Triggered State Text

Text to be displayed in polygon when there are no triggered thresholds and global display mode is set to triggered.

#### Show Value

Show the value of the metric along with the name

#### Shape

Currently there are three shapes that can be selected, and each use a best fit method to maximize size to the panel.

![Polygon Shapes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-shapes.png)

Hexagon Pointed Top
![Polygon Hexagon Pointed Top](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-hexagon-pointed-top.png)

Circle
![Polygon Circle](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-circle.png)

Square
![Polygon Square](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-square.png)

#### Use Color Gradients

This option will apply a shaded color instead of a uniform color.

#### Global Fill Color

This is the color used when there are no thresholds that apply to the metric or composite.

#### Global Border Color

The color of the border for each polygon can be set, and is used along with the size setting above.

#### Unit

All of the unit types are available in this selector and will be applied to the value displayed.

#### Stat

Select which statistic to display for the value.  The full set of statistics that Grafana provides are available.

#### Decimals

This limits the number of decimals displayed.

#### Global Thresholds

This set of thresholds are applied to all metrics that do not have a matching override.

See the section [thresholds](#thresholds) below for details on how thresholds are evaluated.

#### Global Clickthrough

This clickthrough URL will be applied to all polygons that do not have an override or composite with a clickthrough specified.

##### Clickthrough - Sanitize Url

Normally this is enabled, and is intended to prevent malicious data entry.

##### Clickthrough - Open in new tab

When checked, this will cause a new tab to be opened when you click on a polygon.  For drill-down dashboards, disabling this is recommended.

### Global Aliasing

This field allows you to specify a regular expression to pick a portion of matching metric names to be rendered instead of the full name.

If you have these 3 Queries, returning a series:
Foo-A, values 1,2,3
Bar-B, values 4,5,6
Misc, values 7,8,9

![Before Aliasing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/regex-alias-before.png)

Adding the regular expression: `/(Foo|Bar)/`, will display:

![After Aliasing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/regex-alias-after.png)

Specify a regular expression to pick a portion of matching metric names.

## Overrides

![Overrides without Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-overrides-no-thresholds.png)

![Overrides with Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-overrides-all.png)

![Overrides Rendered](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-overrides-gpu0-rendered.png)

## Composites

![Composites with Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-composites-all.png)

![Composite Rendered with Tooltip](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-composites-with-tooltip.png)

### Animation

![Animation](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-options-animation.png)

#### Animate Composites

Animate hexagon to display metrics if there are composites

![Animation Example](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-composites-animated.png)

#### Speed

Speed of animation in milliseconds

## Thresholds

This plugin supports "ranged" states.

Thresholds are expected to be sorted by ascending value, where

```TEXT
T0 = lowest decimal value, any state
TN = highest decimal value, any state
```

Initial state is set to "ok"

A comparison is made using "greater than or equal to" against the value
  `If value >= thresholdValue state = X`

Comparisons are made in reverse order, using the range between the Nth (inclusive) threshold and N+1 (exclusive)

```TEXT
  InclusiveValue = T(n).value
  ExclusiveValue = T(n+1).value
```

When there is no n+1 threshold, the highest value threshold T(n), a simple inclusive >= comparison is made

Example 1: (typical linear)

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

Example 2: (reverse linear)

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

Example 3: (bounded)

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

The "worst" state is returned after checking every threshold range

## Time Range

### Additional Screenshots

#### Tooltip

Hovering over a hexagon shows the metrics that comprise the displayed state.
For composites this will expand members of the composite.

![Tooltip](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-tooltip.png)

#### State with composites

This shows creation of composites, where you select which metrics comprise the composite.

![State with Composites](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-composite-example1.png)

This shows composites configured for GPU 0,1,2,3, and non-grouped metrics from GPU4-7.

![State with partial composites](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-gpu-state-composites.png)

### Templating

#### Using Dashboard Template Variables

Template variables are available in the clickThroughUrl setting, specified by using ${varname}.
They can also be passed to another dashboard by appending var-VARNAME=value to the url

```URL
/dashboard/xyz?var-VARNAME=${VARNAME}
```

Overrides using regular expressions with capture groups provide addition variables that can be referenced in a clickthroughUrl.

Example:

Regular Expression: `/TEMP_(?<A_HOST>.*)_/`
Clickthrough URL: `/grafana/d/eCLHPr57k/drilldown?orgId=1&var-host=${A_HOST}`

The above example will expand the capture named group `A_HOST` and replace the value in the specified URL.

#### Using Polystat Variables

Each polygon represents either a single metric, or a composite metric

An example drilldown clickthrough url can be specified like this:

```URL
dashboard/db/drilldown?var-HOSTNAME=${__cell_name}
```

NOTE: Metrics are sorted using the global options "Sorting" settings. Global filters are also applied before dereferencing is performed.

##### Single Metric Variables

The name and value of a polygon can be referenced using the following syntax:

* Metric Name: `${__cell_name}`
* Metric Value: `${__cell}`
* Metric Raw Value: `${__cell:raw}` syntax.
   By default values are URI encoded. Use this syntax to *disable* encoding

##### Composite Metric Variables

The names and values of a composite polygon can be referenced using the following syntax:

* Composite Name: `${__composite_name}`
* Metric Name: `${__cell_name_n}`
* Metric Value: `${__cell_n}`
* Metric Raw Value: `${__cell_n:raw}` syntax.
   By default values are URI encoded. Use this syntax to *disable* encoding

## Building

This plugin relies on `@grafana/toolkit`, typical build sequence:

```BASH
yarn install
yarn build
```

For development, you can run:

```BASH
yarn watch
```

The code will be parsed then copied into "dist" if "jslint" passes without errors.

### Docker Support

A docker-compose.yml file is include for easy development and testing, just run

```BASH
docker-compose up
```

Then browse to <http://localhost:3000>

## External Dependencies

* Grafana 8.4+

## Enable Grafana TestData

`Grafana TestData` is not enabled by default. To enable it, first navigate to the Plugins section, found in your Grafana main menu. Click the Apps tabs in the Plugins section and select the Grafana TestData App. (Or navigate to <http://your_grafana_instance/plugins/testdata/edit> to go directly there). Finally click the enable button to enable.

### Acknowledgements

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
