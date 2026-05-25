# Composites

Composites allow you to combine multiple metrics into a single representation that reflects the "worst" state of the metrics combined. This is useful as a roll-up view of more complex systems being monitored.

When there are multiple metrics to be displayed by a composite, the polygon will cycle through each of them depending on the composite configuration.

![Composites Options All](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-composites-all.png)

This is what two composites look like once they are rendered:

![Composite Rendered](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-composite-rendered.png)

This is the tooltip that is displayed when hovering over the composite:

![Composite Rendered with Tooltip](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-composite-with-tooltip.png)

## Animation Example

When there are multiple metrics the rendered polygon will cycle through each of them based on the composite settings.

Here's an example of two composites and their animation sequence:

![Animation Example](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-composite-animated.gif)

## Global Settings for Composites

There are two global settings that apply to all composites.

### Enable Composites

A toggle is provided to quickly disable all composites from being rendered.  Additionally each composite has a hide icon to toggle its visibility.

### Animation Speed (ms)

This setting controls how fast the animation cycle occurs (in milliseconds).

## Composite Settings

### Composite Name

Sets the name of the composite to be rendered. This accepts a regular expression along with template variables.

Capture groups are also supported which allows you to simplify the name displayed using the alias option.

### Show Name (composite)

This setting will hide/show the name on the displayed polygon.

### Show Value (composite)

This setting will hide/show the values on the displayed polygon.

### Show Members

When this is enabled, the composite is shown along with all of the metrics. Typically this is disabled and just the composite is displayed.

### Display Mode (composite)

This will override the global display mode for just this composite.
As with the global setting, you can choose to display only metrics that have triggered a threshold or display all metrics.

| Display Mode |                                                        |
|--------------|--------------------------------------------------------|
| All          | All metrics are displayed                              |
| Triggered    | Only metrics with a threshold triggered are displayed  |

## Clickthrough URL (composite)

Use this to specify an URL to go to when the polygon is clicked on. Regular expression capture groups and template variables are available to form the URL.
See the overrides section for details on [advanced usage](#clickthrough-url).

### Sanitize URL (composite)

Normally this is enabled, and is intended to prevent malicious data entry.

### Open URL in New Tab (composite)

When checked, this will cause a new tab to be opened when you click on the polygon.
For drill-down dashboards, disabling this is recommended.

### Enable Custom URL Target (composite)

![Custom URL Target](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-custom-clickthrough-target.png)

When checked, this will allow you to set a custom value for the `target` attribute of the clickthrough.
NOTE: This is only visible when `Open URL in New Tab` is disabled.

## Custom URL Target (composite)

Specify the content for the `target` attribute of the clickthrough URL.

Typical values are: _blank|_self|_parent|_top|

## Bottom Menu (composite)

There is a menu at the bottom right side of the composite that provides additional controls.

![Composite Bottom Menu](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-composite-bottom-menu.png)

### Ordering (composite)

Up and Down arrows allow you move the composite for easier grouping.

### Hide/Show (composite)

Use the "eye" icon to enable/disable the composite.

### Duplicate (composite)

This button will make a copy of the current composite and append it to the end of the list.  It will have a new name with "Copy" at the end.

### Delete (composite)

This button will delete the composite completely.

## Adding Metrics to a Composite

The "Add Metric" button is used to append to the list of metrics to be included in the composite.

![Composite Add Metric](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-composite-add-metric.png)

### Metric/Regex (composite)

The editor provides a list of metrics returned by your queries and also accepts a regular expression that may also include template variables.

NOTE: Template variables are expanded first, then the regex is applied to further filter which metrics are included in the composite.

### Alias (composite)

If this has any content, it will be used instead of the metric name.

Capture groups from the metric name plus template variables are available to construct a new name to be displayed.

Using template variables, capture groups, and composite variables are detailed in [section below](#composite-metric-variables)