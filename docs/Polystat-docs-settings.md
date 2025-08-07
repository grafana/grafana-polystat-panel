
# Global settings

The following settings are available in the Global section, and are detailed below.

![Global](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-all.png)

## Display Mode

You can choose to display only metrics that have triggered a threshold or display all metrics.

| Display Mode |                                                        |
|--------------|--------------------------------------------------------|
| All          | All polygons are displayed                             |
| Triggered    | Only polygons with a threshold triggered are displayed |

## Global - Non Triggered State Text

Text to be displayed in polygon when there are no triggered thresholds and global display mode is set to triggered.

## Show Value (Global)

Show the value of the metric along with the name.

## Show Timestamp (Global)

This option will display the time of the metric in the polygon.

![Global Show Timestamp](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-showtimestamp.png)

### Timestamp Formats

Presets are provided for the timestamp, and the field will also accept a custom format.

### Timestamp Position

The timestamp can be displayed above or below the value.  If the value is not displayed, it will be place where the value is normally rendered.

![Global Show Timestamp Position Above](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-timestamp-above.png)

![Global Show Timestamp Position Below](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-timestamp-below.png)

### Timestamp Y-Offset

This allows adjust the timestamp up or down to fine tune placement. Positive values move the timestamp down, negative values move it up.

## Shape

Currently there are three shapes that can be selected, and each use a best fit method to maximize size to the panel.

![Polygon Shapes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-shapes.png)

Hexagon Pointed Top

![Polygon Hexagon Pointed Top](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-hexagon-pointed-top.png)

Circle

![Polygon Circle](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-circle.png)

Square

![Polygon Square](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-square.png)

## Use Color Gradients

This option will apply a shaded color instead of a uniform color.

## Global Fill Color

This is the color used when there are no thresholds that apply to the metric or composite.

## Global Border Color

The color of the border for each polygon can be set, and is used along with the size setting above.

## Unit

All of the unit types are available in this selector and will be applied to the value displayed.

## Stat

Select which statistic to display for the value.  The full set of statistics that Grafana provides are available.

## Decimals

This limits the number of decimals displayed.

## Global Thresholds

This set of thresholds are applied to all metrics that do not have a matching override.

See [Use thresholds](./Polystat-docs-thresholds.md) for details on how thresholds are evaluated.

## Global Clickthrough

The clickthrough URL is applied to all polygons that do not have an override or composite with a clickthrough specified.

- Clickthrough - Sanitize URL: Normally this is enabled, and is intended to prevent malicious data entry.

- Clickthrough - Open URL In New Tab: When checked, this will cause a new tab to be opened when you click on a polygon.  For drill-down dashboards, disabling this is recommended.

- Clickthrough - Enable Custom URL Target: When checked, this will allow you to set a custom value for the `target` attribute of the clickthrough. Note that this is only visible when `Open in New Tab` is disabled.

![Custom URL Target](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-custom-clickthrough-target.png)

- Clickthrough - Custom URL Target: Specify the content for the `target` attribute of the clickthrough URL. 

  - Typical values are: _blank|_self|_parent|_top|

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

