
# Customization options

This panel provides a large number of customization options, which are searchable from the menu.

## Layout

By default the plugin automatically sizes the displayed polygons using a "best fit" calculation based on the size of the panel.

![Auto Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-options-layout.png)

Alternatively, you can specify the number of columns and/or rows manually. If both columns and rows are set, only `rows*columns` is displayed. 

- **Columns**: Maximum amount of columns to create.

- **Rows**: Maximum amount if rows to create.

![Manual Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-layout-manual.png)

If there are not enough columns and rows to display all of the data, a warning is displayed.

![Manual Layout Warning](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-layout-warning.png)

## Display Limit

By default 100 polygons are displayed. Use this option to set a specific number of polygons to be displayed, or use `0` for no limit.

## Sizing

By default the size of the polygon is automatically calculated for a best-fit. Deselect the auto-size option to manually set a size.

![Polygon Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sizing-auto.png)

You can also set a border on each polygon. The default value is 2 pixels.

![Polygon Border Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sizing-manual.png)

## Text

The plugin attempts to display as much text as possible with the largest font possible across all polygons. You can also set the color, font size, and font family manually.

- **Font Family**: Set the font family to be used for the rendered text. Currently the default is `Inter`, and migrations convert from `Roboto` to `Inter`.

- **Auto Scale Fonts**: Fonts are automatically set.

![Polygon Auto Text Font Size](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-auto-all.png)

Uncheck this option to manually enter a font size.

![Polygon Manual Text Font Size](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-manual-fontsize.png)

- **Automate Font Color**: Uncheck "Automate Font Color" to manually set the font color. The automated option uses the current theme to pick a color, which may not be suitable for all cases.

![Polygon Text Manual Font Color](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-manual-font-color.png)

You can manually set Font Color with the color picker.

![Polygon Text Font Manual Color Picker](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-font-color-picker.png)

## Sorting

Sorting allows you to set the order (left to right) of the displayed polygons.

![Sort Settings](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting.png)

Supported directions:

![Sorting Directions](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting-directions.png)

Supported fields:

![Sorting Fields](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting-fields.png)

## Tooltips

![Tooltips](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-all.png)

The following options are available:

- **Enable/Disable Tooltip**: Toggles displaying tooltips for the panel.

- **Tooltip Font Family**: Sets the font family to be used in tooltips.

- **Show Timestamp**: Toggles display of the timestamp at the bottom of the tooltip.

- **Display mode**: Displays either only metrics that have triggered a threshold in the tooltip or all metrics. This is useful when there are many metrics rolled up into a composite.

![Tooltip Display Modes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-display-modes.png)

- **Non Triggered State Text**: When there are no threshold violations, display this text in the tooltip instead of the metric value. Leave blank if you want to show the value.

## Tooltip Sorting

If you're using *composites* with multiple metrics to be displayed, tooltips have a wider set of sort options to aid in displaying important data "at the top" of the tooltip. 

You can specify a field and direction to first sort by, plus a secondary field and direction. You can also disable sorting if needed.

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

### Primary Sorting

Set the primary sorting direction for tooltip metrics as explained in the table above. 

You can also sort by field:

| Sort By Field   |                                        |
|-----------------|----------------------------------------|
| Name            | name of the field - after all aliasing |
| Threshold Level | from lowest to highest                 |
| Value           | raw value                              |

![Tooltip Sort By Field](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-primary-sortby-field.png)

### Secondary Sorting

Secondary sorting works like primary sorting, but you can set a different direction using a different field/threshold/value. It's applied *after* primary sorting is performed.

- **Show Timestamp**: Displays the time of the metric in the polygon.

![Global Show Timestamp](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-showtimestamp.png)

- **Timestamp Formats**: Allows you to customize timestamp format.

- **Timestamp Position**: Allows you to position the timestamp either above or below the value. If the value is not displayed, the timestamp is placed where the value is normally rendered.

![Global Show Timestamp Position Above](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-timestamp-above.png)

![Global Show Timestamp Position Below](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-timestamp-below.png)

- **Timestamp Y-Offset**: Allows you to adjust the timestamp up or down to fine tune placement. Positive values move the timestamp down, negative values move it up.