
# Options

This panel provides a large number of customization options, and are searchable from the menu.

## Layout

By default the plugin with automatically size the polygons to be displayed using a "best fit" calculation based on the size of the panel.

![Auto Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-options-layout.png)

Alternatively, you can specify both the number of columns and rows manually, or automated only one of them.

### Columns

Max # of columns to create

### Rows

Max # rows to create
NOTE: if both columns and rows are set, only `rows*columns` will be displayed, generally one or none should be set.

![Manual Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-layout-manual.png)

If there are not enough columns and rows to display all of the data, a warning will be displayed.

![Manual Layout Warning](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-layout-warning.png)

### Display Limit

Sets a limit for the number of polygons to be displayed. Set this to `0` for no limit (the default value is 100).

## Sizing

The size of the polygon by default is calculated for a best-fit, but it can be manually set if needed.

This section also provides an option to set a border on each polygon (the default value is 2 pixels).

![Polygon Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sizing-auto.png)

Deselect the auto-size option to manually set a size.

![Polygon Border Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sizing-manual.png)

The size of the border for each polygon can be set in this section. The color used can be found in the "Global" section.

## Text

The plugin will attempt to display as much text as possible with the largest font possible across all polygons.
The color, font size, and font family can be manually set.

### Font Family

You can also set the font family to be used for the rendered text.
Currently the default is `Inter`, and migrations will convert from `Roboto` to `Inter`

### Auto Scale Fonts

![Polygon Auto Text Font Size](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-auto-all.png)

Uncheck "Auto Scale Fonts" to manually enter a font size.

![Polygon Manual Text Font Size](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-manual-fontsize.png)

### Automate Font Color

Uncheck "Automate Font Color" to manually set the font color.  The automated option uses the current theme to pick a color, which may not be suitable for all cases.

![Polygon Text Manual Font Color](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-manual-font-color.png)

Manually Set Font Color with color picker

![Polygon Text Font Manual Color Picker](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-text-font-color-picker.png)

## Sorting

The order (left to right) of the displayed polygons can be set with the sort options.

![Sort Settings](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting.png)

The following directions are supported:

![Sorting Directions](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting-directions.png)

And the following fields:

![Sorting Fields](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-sorting-fields.png)

## Tooltips

![Tooltips](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-all.png)

### Enable/Disable Tooltip

Toggles displaying tooltips for the panel.

### Tooltip Font Family

Sets the font family to be used in tooltips.

### Show Timestamp

Toggles display of the timestamp at the bottom of the tooltip.

### Display mode

You can choose to display only metrics that have triggered a threshold in the tooltip, or display all metrics. This is useful when there are many metrics rolled up into a composite.

![Tooltip Display Modes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-display-modes.png)

### Tooltip - Non Triggered State Text

When there are no threshold violations, this text will be displayed in the tooltip instead of the metric value.  Leave blank if you want to show the value.

### Tooltip Sorting

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

#### Primary Sorting

##### Primary Sort Direction (see above table)

The type of sort to be applied to the tooltip metrics.

##### Primary Sort By Field

Which field to sort by:

![Tooltip Sort By Field](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-tooltips-primary-sortby-field.png)

| Sort By Field   |                                        |
|-----------------|----------------------------------------|
| Name            | name of the field - after all aliasing |
| Threshold Level | from lowest to highest                 |
| Value           | raw value                              |

#### Secondary Sorting

The secondary sorting works in the same manner as primary sorting, but can be in a different direction using a different field/threshold/value. This is applied *after* primary sorting is performed.

##### Secondary Sort Direction (see above table)

##### Secondary Sort By Field

## Global settings

The following settings are available in the Global section, and are detailed below.

![Global](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-all.png)

### Display Mode

You can choose to display only metrics that have triggered a threshold or display all metrics.

| Display Mode |                                                        |
|--------------|--------------------------------------------------------|
| All          | All polygons are displayed                             |
| Triggered    | Only polygons with a threshold triggered are displayed |

### Global - Non Triggered State Text

Text to be displayed in polygon when there are no triggered thresholds and global display mode is set to triggered.

### Show Value (Global)

Show the value of the metric along with the name.

### Show Timestamp (Global)

This option will display the time of the metric in the polygon.

![Global Show Timestamp](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-showtimestamp.png)

#### Timestamp Formats

Presets are provided for the timestamp, and the field will also accept a custom format.

#### Timestamp Position

The timestamp can be displayed above or below the value.  If the value is not displayed, it will be place where the value is normally rendered.

![Global Show Timestamp Position Above](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-timestamp-above.png)

![Global Show Timestamp Position Below](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-timestamp-below.png)

#### Timestamp Y-Offset

This allows adjust the timestamp up or down to fine tune placement. Positive values move the timestamp down, negative values move it up.

### Shape

Currently there are three shapes that can be selected, and each use a best fit method to maximize size to the panel.

![Polygon Shapes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-shapes.png)

Hexagon Pointed Top

![Polygon Hexagon Pointed Top](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-hexagon-pointed-top.png)

Circle

![Polygon Circle](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-circle.png)

Square

![Polygon Square](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-square.png)

### Use Color Gradients

This option will apply a shaded color instead of a uniform color.

### Global Fill Color

This is the color used when there are no thresholds that apply to the metric or composite.

### Global Border Color

The color of the border for each polygon can be set, and is used along with the size setting above.

### Unit

All of the unit types are available in this selector and will be applied to the value displayed.

### Stat

Select which statistic to display for the value.  The full set of statistics that Grafana provides are available.

### Decimals

This limits the number of decimals displayed.

### Global Thresholds

This set of thresholds are applied to all metrics that do not have a matching override.

See the section [thresholds](#thresholds-details) below for details on how thresholds are evaluated.

### Global Clickthrough

This clickthrough URL will be applied to all polygons that do not have an override or composite with a clickthrough specified.

#### Clickthrough - Sanitize URL

Normally this is enabled, and is intended to prevent malicious data entry.

#### Clickthrough - Open URL In New Tab

When checked, this will cause a new tab to be opened when you click on a polygon.  For drill-down dashboards, disabling this is recommended.

#### Clickthrough - Enable Custom URL Target

![Custom URL Target](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-custom-clickthrough-target.png)

When checked, this will allow you to set a custom value for the `target` attribute of the clickthrough.
NOTE: This is only visible when `Open in New Tab` is disabled.

#### Clickthrough - Custom URL Target

Specify the content for the `target` attribute of the clickthrough URL.

Typical values are: _blank|_self|_parent|_top|

## Global Aliasing

This field allows you to specify a regular expression to pick a portion of matching metric names to be rendered instead of the full name.

If you have these 3 Queries, returning a series:
Foo-A, values 1,2,3
Bar-B, values 4,5,6
Misc, values 7,8,9

![Before Aliasing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/regex-alias-before.png)

Adding the regular expression: `/(Foo|Bar)/`, will display:

![After Aliasing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/regex-alias-after.png)

Specify a regular expression to pick a portion of matching metric names.

