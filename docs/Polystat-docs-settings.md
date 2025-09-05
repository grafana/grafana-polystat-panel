
# Global settings

The following settings are available in the Global section, and are detailed below.

![Global](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-all.png)

Main settings include:

- **Display Mode**: Display only metrics that have triggered a threshold or display all metrics.
  
  - **All**: Displays metrics from all polygons                       
  - **Triggered**: Only polygons with a threshold triggered are displayed 

- **Non Triggered State Text**: Text to be displayed in polygon when there are no triggered thresholds and global display mode is set to triggered.

- **Show Value**: Show the value of the metric along with the name.

- **Shape**: See more at [Shapes](#shapes).

- **Use Color Gradients**: This option will apply a shaded color instead of a uniform color.

- **Global Fill Color**: This is the color used when there are no thresholds that apply to the metric or composite.

- **Global Border Color**: The color of the border for each polygon can be set, and is used along with the size setting above.

- **Unit**: All of the unit types are available in this selector and will be applied to the value displayed.

- **Stat**: Select which statistic to display for the value.  The full set of statistics that Grafana provides are available.

- **Decimals**: This limits the number of decimals displayed.

- **Global Thresholds**: This set of thresholds are applied to all metrics that do not have a matching override. See [Use thresholds](./Polystat-docs-thresholds.md) for details on how thresholds are evaluated.

- **Global Clickthrough**: The clickthrough URL is applied to all polygons that do not have an override or composite with a clickthrough specified. See more at [Use Clickthroughs](./Polystat-docs-clickthroughurl.md).

- **Global Aliasing**: This field allows you to specify a regular expression to pick a portion of matching metric names to be rendered instead of the full name. See more at [Global Aliasing](#global-aliasing).

## Shapes

Currently there are three shapes that can be selected, and each use a best fit method to maximize size to the panel.

![Polygon Shapes](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-global-shapes.png)

**Hexagon Pointed Top**

![Polygon Hexagon Pointed Top](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-hexagon-pointed-top.png)

**Circle**

![Polygon Circle](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-circle.png)

**Square**

![Polygon Square](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-shape-square.png)

## Global Aliasing

This field allows you to specify a regular expression to pick a portion of matching metric names to be rendered instead of the full name. 

### Example

If you have these 3 queries, returning the following series:

- Foo-A, values 1,2,3
- Bar-B, values 4,5,6
- Misc, values 7,8,9

![Before Aliasing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/regex-alias-before.png)

If you add the regular expression `/(Foo|Bar)/`, the result is:

![After Aliasing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/regex-alias-after.png)


