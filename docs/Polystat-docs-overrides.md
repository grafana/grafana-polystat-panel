# Overrides

Use overrides to apply additional rendering options for metrics, including custom thresholds and clickthroughs. 

This is an example override that sets the unit for metrics that match a regular expression:

![Override without Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-overrides-no-thresholds.png)

Below is the same override with thresholds added:

![Override with Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-overrides-with-thresholds.png)

The final result of the above override with thresholds applied:

![Override with Thresholds Rendered](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-overrides-rendered-thresholds.png)

## Override settings

- **Label**: Label overrides to ease search. The label is not rendered on the polygon.

- **Metric**: If set, the panel will provide "hints" for metric names, and allow you to enter a regular expression to match multiple metrics.

- **Decimals**: Sets the maximum number of decimals to be displayed. Leave this empty to show all decimals.

- **Statistic to Display (Stat)**: Allows you to specify a different statistic to use for the matching metric, and will replace the global statistic. As with the global setting, the full set of statistics Grafana provides are available.

- **Unit Formatting**: All of the unit types are available in this selector and will be applied to the value displayed. A suffix is typically added by the formatter to indicate the unit like "B/sec" or symbols for temperatures, percentages, and similar.

- **Thresholds**: An override can specify a set of thresholds that are to be applied to the matching metric, and will replace any global threshold settings. See [Use thresholds](./Polystat-docs-thresholds.md) for details on how thresholds are evaluated.

- **Prefix**: Text in this field will be prepended to the rendered metric.

- **Suffix**: Text in this field will be appended to the rendered metric after any unit text is applied.

- **Clickthrough URL**: Use this setting to indicate the URL to open when clicking the polygon. See more at [Use Clickthroughs](./Polystat-docs-clickthroughurl.md).

## Bottom Menu

See the menu at the bottom right side of the override for additional controls.

![Override Menu](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-override-bottom-menu.png)

- **Ordering**: Allows you to move the override so you can force a different evaluation priority or simply to group similar overrides together.

- **Hide/Show**: Use the "eye" icon to enable/disable the override.

- **Duplicate**: Allows you to make a copy of the current override and append it to the end of the list, named with "Copy" at the end.

- **Delete**: This button will delete the override completely.